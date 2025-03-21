"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import APIGateway from "../API";
export default function Home() {
    const [showInput, setShowInput] = useState(false);
    const APIGatewayManager = new APIGateway();
    useEffect(() => {
        // Show input box after animation completes
        const timer = setTimeout(() => setShowInput(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: 'white',
                textAlign: 'center',
            }}>
            {homepageanimation()}

            {/* Input Box Section */}
            {InputBox(showInput, APIGatewayManager)}
        </div>
    );
}
function InputBox(showInput: boolean, APIGatewayManager: APIGateway) {
    const [userInput, setUserInput] = useState("");
    function handleSubmission(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();  // Prevent page reload
        console.log("[INFO] User Input:", userInput);
        if (!userInput.trim()) {
            console.warn("[WARN] Empty input, submission aborted.");
            return;
        }

        console.log("[INFO] User Input:", userInput);
        APIGatewayManager.putResponse(userInput).then((response) => {
            console.log("[INFO] Response:", response);
            window.location.href = "/WordCloud";
        }).catch((error) => {
            console.error("[ERROR] Error submitting response:", error);
        });

    }

    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showInput ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
    >
        {showInput && (
            <div style={{
                marginTop: '2rem',
                width: '20rem',
            }}>
                <h2 className="text-xl font-bold text-gray-700 mb-2">WHAT DO YOU THINK?</h2>
                <p className="text-gray-600 mb-2">
                    Sometimes we have preconceived notions of what political labels Christians should adopt. Perhaps you've heard people say, "Christians have to be _______." What have you heard?
                </p>
                <input
                    type="text"
                    placeholder="Answer here..."
                    onChange={(e) => setUserInput(e.target.value)}

                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-black" />
                <button
                    className="mt-3 w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-900 transition"
                    onClick={handleSubmission}
                >
                    Submit
                </button>
            </div>
        )}
    </motion.div>;
}

function homepageanimation() {
    return <div
        style={{
            position: 'relative',
            width: '100%',
            height: '10rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}
    >
        {/* Moving Image Placeholder */}
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: -150 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{
                width: '10rem',
                height: '10rem',
                backgroundColor: '#d3d3d3',
                borderRadius: '0.5rem',
            }}        >
            <img src="/jhu_logo.png" alt="JHU Logo" width={200} height={200} />
        </motion.div>

        {/* Text Appearing */}
        <motion.h1
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{
                position: 'absolute',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#333',
            }}        >
            Stepping Stone Ministry
        </motion.h1>
    </div>;
}