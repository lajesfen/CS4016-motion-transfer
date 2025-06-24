"use client";
import ThreeView from "@/components/ThreeView";
import WebcamView from "@/components/WebcamView";
import { Landmark } from "@/types/Landmark";
import { useEffect, useRef, useState } from "react";

interface Model {
  label: string;
  path: string;
}

const defaultModels = [
  { label: "Jugador lucha libre", path: "/character3.glb" },
  { label: "Ninja", path: "/character2.glb" },
  { label: "Amy", path: "/character.glb" },
];

const backgrounds = [
  { label: "Arena gym", type: "hdr", file: "/arena-gym.hdr" },
  { label: "Moon lab", type: "hdr", file: "/moon-lab.hdr" },
  { label: "Studio", type: "hdr", file: "/christmas_studio.hdr" },
];

export default function Home() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model>(defaultModels[0]);
  const [selectedBg, setSelectedBg] = useState(backgrounds[0]);

  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);

  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const bgDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
      if (
        bgDropdownRef.current &&
        !bgDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBgDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedModel({ label: file.name, path: url });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-row gap-4 p-4">
        <div className="w-full aspect-auto rounded overflow-hidden">
          <WebcamView onLandmarksUpdate={setLandmarks} />
        </div>
        <div className="w-full rounded">
          <ThreeView
            landmarks={landmarks}
            modelPath={selectedModel.path}
            background={selectedBg}
          />
        </div>
      </div>

      <div className="flex flex-row gap-4 flex-wrap justify-center items-center relative">
        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center justify-between rounded-md border-2 shadow-sm px-4 py-2 text-sm font-medium border-neutral-500 text-neutral-500 hover:border-gray-300 hover:text-white transition-all duration-300">
          Upload Model
          <input
            type="file"
            accept=".glb,.gltf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {/* Model Selector Dropdown */}
        <div className="relative" ref={modelDropdownRef}>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center justify-between rounded-md border-2 shadow-sm px-4 py-2 text-sm font-medium border-neutral-500 text-neutral-500 hover:border-gray-300 hover:text-white transition-all duration-300"
            onClick={() => setIsModelDropdownOpen((prev) => !prev)}
          >
            {selectedModel.label}
            <svg
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isModelDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {defaultModels.map((model, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedModel(model);
                      setIsModelDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    {model.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Background Selector Dropdown */}
        <div className="relative" ref={bgDropdownRef}>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center justify-between rounded-md border-2 shadow-sm px-4 py-2 text-sm font-medium border-neutral-500 text-neutral-500 hover:border-gray-300 hover:text-white transition-all duration-300"
            onClick={() => setIsBgDropdownOpen((prev) => !prev)}
          >
            {selectedBg.label}
            <svg
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isBgDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {backgrounds.map((bg, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedBg(bg);
                      setIsBgDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <a
        className="text-neutral-500 hover:text-white hover:underline transition-all duration-300 mt-4"
        href="https://github.com/lajesfen/CS4016-motion-transfer"
      >
        github.com/CS4016-motion-transfer
      </a>
    </div>
  );
}
