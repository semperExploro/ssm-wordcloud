"use client";
import React, { useEffect, useRef, useState } from "react";
import WordCloud from "wordcloud";
import APIGateway from "../API";

const WordCloudCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const APIGatewayManager = new APIGateway();
  const [words, setWords] = useState([]);

  useEffect(() => {
    setIsClient(true); // Ensures rendering happens only on the client
  }, []);

  useEffect(() => {
    let words = []
    APIGatewayManager.getSurveyContents().then((response) => {
      console.log("[INFO] Response:", response);
      setWords(response);
    })
  }, [])

  useEffect(() => {
    console.log("[INFO] - Words:", words)
    if (isClient && canvasRef.current && words.length > 0) {
    
      // const words = [
      //   ["React", 50],
      //   ["JavaScript", 40],
      //   ["Next.js", 35],
      //   ["Node.js", 30],
      //   ["TypeScript", 25],
      //   ["Frontend", 20],
      //   ["Backend", 15],
      //   ["API", 10],
      //   ["Web", 8],
      //   ["Cloud", 5],
      // ];

      WordCloud(canvasRef.current, {
        list: words,
        gridSize: 8,
        weightFactor: 12, // Increased weight factor for larger font size
        fontFamily: "sans-serif",
        color: () => `hsl(${Math.random() * 360}, 60%, 40%)`,
        rotateRatio: 0,
        rotationSteps: 2,
        backgroundColor: "floralwhite",
        padding: "10rem"
      });
    }
  }, [isClient, words]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      {isClient && <canvas ref={canvasRef} width={500} height={500} />}
    </div>
  );
};

export default WordCloudCanvas;
