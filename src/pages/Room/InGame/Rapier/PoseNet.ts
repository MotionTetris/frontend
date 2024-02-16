import * as PoseNet from "@tensorflow-models/posenet";
import { RefObject } from "react";

export interface KeyPoint {
    name?: string;
    x: number;
    y: number;
}

export interface KeyPointResult {
    leftAngle: number,
    rightAngle: number,
    rightWristX: number,
    leftWristX: number,
}

export interface KeyPointCallback {
    onRotateLeft: (keypoints: Map<string, KeyPoint>) => void
    onRotateRight: (keypoints: Map<string, KeyPoint>) => void
    onMoveLeft: (keypoints: Map<string, KeyPoint>) => void
    onMoveRight: (keypoints: Map<string, KeyPoint>) => void
}

const Points = ["leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist"];
const Nose = "nose";
function drawKeypoint(keypoint?: PoseNet.Keypoint, renderingContext?: CanvasRenderingContext2D) {
    if (!keypoint || !renderingContext) {
        return;
    }

    if (Points.includes(keypoint.part)) {
        drawCircle(keypoint.position.x, keypoint.position.y, 5, "red");
        return;
    }

    if (keypoint.part === Nose) {
        drawCircle(keypoint.position.x, keypoint.position.y, 10, "blue");
        return;
    }

    function drawCircle(x: number, y: number, radius: number, color: "red" | "blue" | "green" | "yellow") {
        if (!renderingContext) {
            return;
        }
        renderingContext.beginPath();
        renderingContext.arc(x, y, radius, 0, 2 * Math.PI);
        renderingContext.fillStyle = color;
        renderingContext.fill();
    }
}

export async function loadPoseNet(video: RefObject<HTMLVideoElement>, canvas: RefObject<HTMLCanvasElement>, videoWidth: number, videoHeight: number) {
    const poseNet = await PoseNet.load();
    const webcam = await setupWebcam(video);

    if (!webcam || !video.current || !canvas.current) {
        throw new Error("Failed to load web camera");
    }

    const renderingContext = canvas.current?.getContext("2d");
    if (!renderingContext) {
        throw new Error("Failed to get rendering context");
    }

    video.current.width = videoWidth;
    video.current.height = videoHeight;
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    return {
        poseNet: poseNet,
        renderingContext: renderingContext
    }
}

export async function processPose(poseNet: PoseNet.PoseNet, video: HTMLVideoElement, renderingContext: CanvasRenderingContext2D, prevResult: KeyPointResult, eventCallback: KeyPointCallback): Promise<KeyPointResult> {
    const pose = await poseNet.estimateSinglePose(video, {
        flipHorizontal: true
    });

    /* re-draw keypoints */
    renderingContext.clearRect(0, 0, video.width, video.height);
    pose.keypoints.forEach((k) => {
        drawKeypoint(k, renderingContext);
    });

    let leftShoulderKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftShoulder"
    );

    let leftElbowKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftElbow"
    );

    let leftWristKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftWrist"
    );

    let rightShoulderKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightShoulder"
    );

    let rightElbowKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightElbow"
    );

    let rightWristKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightWrist"
    );

    let noseKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "nose"
    );

    let leftShoulder = leftShoulderKeypoint ? leftShoulderKeypoint.position : null;
    let rightShoulder = rightShoulderKeypoint ? rightShoulderKeypoint.position : null;
    let leftElbow = leftElbowKeypoint ? leftElbowKeypoint.position : null;
    let rightElbow = rightElbowKeypoint ? rightElbowKeypoint.position : null;
    let leftWrist = leftWristKeypoint ? leftWristKeypoint.position : null;
    let rightWrist = rightWristKeypoint ? rightWristKeypoint.position : null;
    let nose = noseKeypoint ? noseKeypoint.position : null;
    let centerX = video ? video.offsetWidth / 2 : null;
    let leftShoulderScore = leftShoulderKeypoint ? leftShoulderKeypoint.score : Infinity;
    let rightShoulderScore = rightShoulderKeypoint ? rightShoulderKeypoint.score : Infinity;
    let leftElbowScore = leftElbowKeypoint ? leftElbowKeypoint.score : Infinity;
    let rightElbowScore = rightElbowKeypoint ? rightElbowKeypoint.score : Infinity;
    let leftWristScore = leftWristKeypoint ? leftWristKeypoint.score : Infinity;
    let rightWristScore = rightWristKeypoint ? rightWristKeypoint.score : Infinity;
    let leftMinScore = Math.min(leftShoulderScore, leftElbowScore, leftWristScore);
    let rightMinScore = Math.min(rightShoulderScore, rightElbowScore, rightWristScore);
    let leftAngleInDegrees = 0;
    let rightAngleInDegrees = 0;
    let leftWristX = 0;
    let rightWristX = 0;
    let rightAngleDelta = 0;
    let leftAngleDelta = 0;

    if (leftMinScore > 0.25 && leftShoulder && leftElbow && leftWrist) {
        leftAngleInDegrees = calculateAngle(leftShoulder, leftElbow, leftWrist);
        leftWristX = leftWrist.x;
        leftAngleDelta = leftAngleInDegrees - prevResult.leftAngle;
    }

    if (rightMinScore > 0.25 && rightShoulder && rightElbow && rightWrist) {
        rightAngleInDegrees = calculateAngle(rightShoulder, rightElbow, rightWrist);
        rightWristX = rightWrist.x;
        rightAngleDelta = rightAngleInDegrees - prevResult.rightAngle;
    }

    if (leftAngleDelta > rightAngleDelta) {
        if (leftAngleDelta > 35 && leftAngleInDegrees > prevResult.leftAngle && leftWristX < prevResult.leftWristX - 10) {
            eventCallback.onRotateLeft(new Map());
        }
    } else {
        if (rightAngleDelta > 35 && rightAngleInDegrees > prevResult.rightAngle && rightWristX - 10 > prevResult.rightWristX) {
            eventCallback.onRotateRight(new Map());
        }
    }

    if (nose && centerX) {
        console.log("center", centerX);
        const eventDataMap = new Map([
            ["nose", { name: "nose", x: nose.x, y: nose.y }],
            ["center", { name: "center", x: centerX, y: 0 }]
        ]);

        if (nose.x < centerX) {
            eventCallback.onMoveLeft(eventDataMap);
        } else {
            eventCallback.onMoveRight(eventDataMap);
        }
    }

    return {
        leftAngle: leftAngleInDegrees,
        rightAngle: rightAngleInDegrees,
        rightWristX: rightWristX,
        leftWristX: leftWristX,
    }
}

function calculateAngle(pointA: KeyPoint, pointB: KeyPoint, pointC: KeyPoint): number {
    let vectorA = {
        x: pointA.x - pointB.x,
        y: pointA.y - pointB.y,
    };

    let vectorB = {
        x: pointC.x - pointB.x,
        y: pointC.y - pointB.y,
    };

    let dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    let magnitudeA = Math.sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y);
    let magnitudeB = Math.sqrt(vectorB.x * vectorB.x + vectorB.y * vectorB.y);

    let angleInRadians = Math.acos(dotProduct / (magnitudeA * magnitudeB));
    let angleInDegrees = angleInRadians * (180 / Math.PI);

    return angleInDegrees;
}

export async function setupWebcam(videoRef: RefObject<HTMLVideoElement>) {
    console.log("웹캠 설정을 시작합니다...");
    
    if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        return new Promise<HTMLVideoElement>((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
            resolve(videoRef.current!);
            };
        });
    }
    const video = document.createElement("video");
    return video;
}