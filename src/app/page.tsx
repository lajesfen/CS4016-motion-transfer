"use client";
import ThreeView from "@/components/ThreeView";
import WebcamView from "@/components/WebcamView";
import { Landmark } from "@/types/Landmark";
import { useState } from "react";

export default function Home() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row gap-4 p-4">
        <div className="w-full aspect-auto rounded overflow-hidden">
          <WebcamView onLandmarksUpdate={setLandmarks} />
        </div>

        <div className="w-full border border-white rounded">
          <ThreeView landmarks={landmarks} />
        </div>
      </div>
      <a
        className="text-neutral-500 hover:text-white hover:underline transition-all duration-200 mt-8"
        href="https://github.com/lajesfen/CS4016-mocap-three"
      >
        github.com/CS4016-mocap-three
      </a>
    </div>
  );
}
