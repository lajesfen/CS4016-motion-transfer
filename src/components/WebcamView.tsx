"use client";
import { Landmark } from "@/types/Landmark";
import {
  DrawingUtils,
  PoseLandmarker,
  PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { usePoseLandmarker } from "../hooks/usePoseLandmarker";

export default function WebcamView({
  onLandmarksUpdate,
}: {
  onLandmarksUpdate: (landmarks: Landmark[]) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = usePoseLandmarker();
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    let animationId: number;

    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          const width = videoRef.current!.videoWidth;
          const height = videoRef.current!.videoHeight;
          setDimensions({ width, height });
          videoRef.current!.play();
          animationId = requestAnimationFrame(runDetection);
        };
      }
    };

    const runDetection = async () => {
      if (!videoRef.current || !landmarkerRef.current) return;
      const results: PoseLandmarkerResult =
        landmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

      if (results.worldLandmarks) {
        onLandmarksUpdate(results.worldLandmarks[0]);
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const utils = new DrawingUtils(ctx);

        results.landmarks?.forEach((landmarks) => {
          utils.drawLandmarks(landmarks, { color: "#00FFAA", lineWidth: 2 });
          utils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
            color: "#FF9900",
            lineWidth: 2,
          });
        });
      }

      animationId = requestAnimationFrame(runDetection);
    };

    setupCamera();
    return () => cancelAnimationFrame(animationId);
  }, [landmarkerRef]);

  return (
    <div className="relative w-full max-w[640px] aspect-auto">
      <video
        className="h-full object-cover transform -scale-x-100"
        ref={videoRef}
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 h-full pointer-events-none"
        width={dimensions?.width}
        height={dimensions?.height}
        style={{ transform: "scaleX(-1)" }}
      />
    </div>
  );
}
