"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import APIGateway from "../API";
export default function Home() {
    const [showInput, setShowInput] = useState(false);
    const [buttonText, setButtonText] = useState(false);
    const [spinnerVisible, setSpinnerVisible] = useState(false);
    const APIGatewayManager = new APIGateway();
    useEffect(() => {
        // Show input box after animation completes
        const timer = setTimeout(() => setShowInput(true), 250);
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

            {/* Input Box Section */}
            {InputBox(showInput, APIGatewayManager)}
        </div>
    );
}

function InputBox(showInput: boolean, APIGatewayManager: APIGateway) {
    const [userInput, setUserInput] = useState("");
    const [buttonText, setButtonText] = useState("Submit");
    const [spinnerVisible, setSpinnerVisible] = useState("");

    function handleSubmission(event: React.FormEvent<HTMLFormElement>) {

        event.preventDefault();  // Prevent page reload
        console.log("[INFO] User Input:", userInput);
        if (!userInput.trim()) {
            console.warn("[WARN] Empty input, submission aborted.");
            return;
        } else {
            setButtonText("Loading");
            setSpinnerVisible(<i class="fa fa-spinner fa-spin"></i>);
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
                color: '#003062',
                padding: '4rem',
                backgroundColor: '#f1f1f1',
            }}>
                <h2 className="text-xl font-bold text-gray-700 mb-2">WHAT DO YOU THINK?</h2>
                <p className="text-gray-600 mb-2">
                    Sometimes we have preconceived notions of what political labels Christians should adopt. Perhaps you've heard people say, "Christians have to be _______." What have you heard?
                </p>

                <input
                    type="text"
                    placeholder="Answer here..."
                    style={{
                        color: '#003062',
                        border: '#003062',
                        padding: '1rem',
                        marginRight: '1rem'
                    }}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                
                <button onClick={handleSubmission}>
                    {spinnerVisible}{buttonText}
                </button>


            </div>
        )}
    </motion.div>;
}

