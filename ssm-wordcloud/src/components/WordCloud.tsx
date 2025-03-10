"use client";
import React, { useEffect, useRef, useState } from "react";
import WordCloud from "wordcloud";

const WordCloudCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures rendering happens only on the client
  }, []);

  useEffect(() => {
    if (isClient && canvasRef.current) {
      const words = [
        ["React", 50],
        ["JavaScript", 40],
        ["Next.js", 35],
        ["Node.js", 30],
        ["TypeScript", 25],
        ["Frontend", 20],
        ["Backend", 15],
        ["API", 10],
        ["Web", 8],
        ["Cloud", 5],
      ];

      WordCloud(canvasRef.current, {
        list: words,
        gridSize: 8,
        weightFactor: 3,
        fontFamily: "sans-serif",
        color: () => `hsl(${Math.random() * 360}, 100%, 50%)`,
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: "#ffffff",
      });
    }
  }, [isClient]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      {isClient && <canvas ref={canvasRef} width={600} height={600} />}
    </div>
  );
};

export default WordCloudCanvas;
