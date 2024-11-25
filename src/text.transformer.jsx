import React, { useState } from "react";

const TextTransformer = () => {
    const [inputText, setInputText] = useState("");
    const [wordsToChange, setWordsToChange] = useState("");
    const [charMapping, setCharMapping] = useState("");
    const [outputText, setOutputText] = useState("");

    const handleTransform = () => {
        // Parse mappings
        const mapping = charMapping.split(",").reduce((acc, pair) => {
            const [letter, replacement] = pair.trim().split(":");
            if (letter && replacement) acc[letter] = replacement;
            return acc;
        }, {});

        // Split words to change into an array
        const words = wordsToChange.split(",").map((word) => word.trim());

        // Transform the input text
        const result = inputText
            .split(" ")
            .map((word) => {
                if (words.includes(word)) {
                    return word
                        .split("")
                        .map((char) => mapping[char] || char)
                        .join("");
                }
                return word;
            })
            .join(" ");

        setOutputText(result);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Text Transformer</h1>
            <textarea
                rows="4"
                placeholder="Enter your sentence"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
                type="text"
                placeholder="Words to change (comma-separated)"
                value={wordsToChange}
                onChange={(e) => setWordsToChange(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
                type="text"
                placeholder="Letter mapping (e.g., a:@,o:0)"
                value={charMapping}
                onChange={(e) => setCharMapping(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
            />
            <button onClick={handleTransform} style={{ marginBottom: "20px" }}>
                Transform Text
            </button>
            <h2>Output</h2>
            <p>{outputText}</p>
        </div>
    );
};

export default TextTransformer;
