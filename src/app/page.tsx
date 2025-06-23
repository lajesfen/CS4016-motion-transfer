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
  { label: "character.glb", path: "/character.glb" },
  { label: "default_character.glb", path: "/default_character.glb" }, // ToDo: Reemplazar este modelo por otros que funcionen
];

export default function Home() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(defaultModels[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedModel({ label: file.name, path: url });
    }
  };

  const handleSetModel = (model: { label: string; path: string }) => {
    setSelectedModel({ label: model.label, path: model.path });
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-row gap-4 p-4">
        <div className="w-full aspect-auto rounded overflow-hidden">
          <WebcamView onLandmarksUpdate={setLandmarks} />
        </div>
        <div className="w-full rounded">
          <ThreeView landmarks={landmarks} modelPath={selectedModel.path} />
        </div>
      </div>
      <div className="flex flex-row gap-4 relative">
        <label className="cursor-pointer inline-flex items-center justify-between rounded-md border-2 shadow-sm px-4 py-2 text-sm font-medium border-neutral-500 text-neutral-500 hover:border-gray-300 hover:text-white transition-all duration-300">
          Upload Model
          <input
            type="file"
            accept=".glb,.gltf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center justify-between rounded-md border-2 shadow-sm px-4 py-2 text-sm font-medium border-neutral-500 text-neutral-500 hover:border-gray-300 hover:text-white transition-all duration-300"
            onClick={toggleDropdown}
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

          {isDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {defaultModels.map((model, index) => (
                  <button
                    key={index}
                    onClick={() => handleSetModel(model)}
                    className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    {model.label}
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
