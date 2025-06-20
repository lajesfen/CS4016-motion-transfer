import {
  FilesetResolver,
  PoseLandmarker
} from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";

export const usePoseLandmarker = () => {
  const landmarkerRef = useRef<PoseLandmarker | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        minPoseDetectionConfidence: 0.9,
        minTrackingConfidence: 0.8,
        numPoses: 1,
      });
    };
    loadModel();
  }, []);

  return landmarkerRef;
};
