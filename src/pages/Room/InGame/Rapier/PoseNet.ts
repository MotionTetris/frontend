import * as PoseNet from "@tensorflow-models/posenet";
import { RefObject } from "react";
import * as PIXI from 'pixi.js';
import { createRectangle } from "./Effect";

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
function drawKeypoint(keypoint?: PoseNet.Keypoint, app?: PIXI.Application, container?: PIXI.Container) {
    if (!keypoint || !app || !container) {
        return;
    }

    if (Points.includes(keypoint.part)) {
        let graphic = new PIXI.Graphics();
        graphic.beginFill(0xFF0000);
        graphic.drawCircle(keypoint.position.x, keypoint.position.y, 10);
        graphic.endFill();
        container.addChild(graphic);
        return;
    }

    if (keypoint.part === Nose) {
        let graphic = new PIXI.Graphics();
        graphic.beginFill(0x0000FF);
        graphic.drawCircle(keypoint.position.x, keypoint.position.y, 20);
        graphic.endFill();
        container.addChild(graphic);
        return;
    }
}

export async function loadPoseNet(video: RefObject<HTMLVideoElement>, canvas: RefObject<HTMLCanvasElement>, videoWidth: number, videoHeight: number) {
    const poseNet = await PoseNet.load();
    const webcam = await setupWebcam(video);

    if (!webcam || !video.current || !canvas.current) {
        throw new Error("Failed to load web camera");
    }

    if (!canvas.current) {
        throw new Error("Failed to get rendering context");
    }

    const app = new PIXI.Application({
        view: canvas.current,
        backgroundAlpha: 0
    });
    const container = new PIXI.Container();
    app.stage.addChild(container);
    
    const arrows = [];
    arrows.push(createRectangle(app.stage, "src/assets/arrowLeft.png",  50, 150, 90, 280));
    arrows.push(createRectangle(app.stage, "src/assets/arrowRight.png" , 50, 150, 660, 280));

    video.current.width = videoWidth;
    video.current.height = videoHeight;
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    return {
        poseNet: poseNet,
        app: app,
        container: container,
        arrows: arrows
    };
}

export async function processPose(poseNet: PoseNet.PoseNet, video: HTMLVideoElement, app: PIXI.Application, container: PIXI.Container, prevResult: KeyPointResult, eventCallback: KeyPointCallback): Promise<KeyPointResult> {
    const pose = await poseNet.estimateSinglePose(video, {
        flipHorizontal: true
    });

    container.removeChildren();
    pose.keypoints.forEach((k) => {
        drawKeypoint(k, app, container);
    });

    const leftShoulderKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftShoulder"
    );

    const leftElbowKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftElbow"
    );

    const leftWristKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftWrist"
    );

    const rightShoulderKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightShoulder"
    );

    const rightElbowKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightElbow"
    );

    const rightWristKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightWrist"
    );

    const noseKeypoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "nose"
    );

    const leftShoulder = leftShoulderKeypoint ? leftShoulderKeypoint.position : null;
    const rightShoulder = rightShoulderKeypoint ? rightShoulderKeypoint.position : null;
    const leftElbow = leftElbowKeypoint ? leftElbowKeypoint.position : null;
    const rightElbow = rightElbowKeypoint ? rightElbowKeypoint.position : null;
    const leftWrist = leftWristKeypoint ? leftWristKeypoint.position : null;
    const rightWrist = rightWristKeypoint ? rightWristKeypoint.position : null;
    const nose = noseKeypoint ? noseKeypoint.position : null;
    const centerX = video ? video.offsetWidth / 2 : null;
    const leftShoulderScore = leftShoulderKeypoint ? leftShoulderKeypoint.score : Infinity;
    const rightShoulderScore = rightShoulderKeypoint ? rightShoulderKeypoint.score : Infinity;
    const leftElbowScore = leftElbowKeypoint ? leftElbowKeypoint.score : Infinity;
    const rightElbowScore = rightElbowKeypoint ? rightElbowKeypoint.score : Infinity;
    const leftWristScore = leftWristKeypoint ? leftWristKeypoint.score : Infinity;
    const rightWristScore = rightWristKeypoint ? rightWristKeypoint.score : Infinity;
    const leftMinScore = Math.min(leftShoulderScore, leftElbowScore, leftWristScore);
    const rightMinScore = Math.min(rightShoulderScore, rightElbowScore, rightWristScore);
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
    const vectorA = {
        x: pointA.x - pointB.x,
        y: pointA.y - pointB.y,
    };

    const vectorB = {
        x: pointC.x - pointB.x,
        y: pointC.y - pointB.y,
    };

    const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    const magnitudeA = Math.sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y);
    const magnitudeB = Math.sqrt(vectorB.x * vectorB.x + vectorB.y * vectorB.y);

    const angleInRadians = Math.acos(dotProduct / (magnitudeA * magnitudeB));
    const angleInDegrees = angleInRadians * (180 / Math.PI);

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