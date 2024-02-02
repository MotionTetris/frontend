import { RefObject } from "react";
import * as posenet from "@tensorflow-models/posenet";
// webcam.ts

export async function setupWebcam(videoRef: RefObject<HTMLVideoElement>) {
  console.log("웹캠 설정을 시작합니다...");
  const video = document.createElement("video");
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
  return video;
}

interface Point {
  x: number;
  y: number;
}

export function calculateAngle(
  pointA: Point,
  pointB: Point,
  pointC: Point,
): number {
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
