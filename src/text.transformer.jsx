import React, { useState, useEffect } from 'react';

const useTextTransformer = () => {
    const [inputText, setInputText] = useState("");
    const [charMapping, setCharMapping] = useState(() => {
        const savedMapping = localStorage.getItem('charMapping');
        return savedMapping || "";
    });
    const [outputText, setOutputText] = useState("");
    const [bannedWordsList, setBannedWordsList] = useState(() => {
        // Store banned words in lowercase for consistent comparison
        const savedWords = localStorage.getItem('bannedWords');
        return savedWords ? JSON.parse(savedWords).map(word => word.toLowerCase()) : [];
    });

    useEffect(() => {
        localStorage.setItem('bannedWords', JSON.stringify(bannedWordsList));
    }, [bannedWordsList]);

    useEffect(() => {
        localStorage.setItem('charMapping', charMapping);
    }, [charMapping]);

    const transformText = () => {
        const mapping = charMapping.split(",").reduce((acc, pair) => {
            const [letter, replacement] = pair.trim().split(":");
            if (letter && replacement) {
                // Add both lowercase and uppercase mappings
                acc[letter.toLowerCase()] = replacement;
                acc[letter.toUpperCase()] = replacement;
            }
            return acc;
        }, {});

        const result = inputText
            .split(" ")
            .map((word) => {
                // Compare lowercase versions for matching
                if (bannedWordsList.includes(word.toLowerCase())) {
                    // Preserve original case when transforming
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

    const addBannedWord = (word) => {
        const lowerWord = word.toLowerCase();
        if (word && !bannedWordsList.includes(lowerWord)) {
            setBannedWordsList([...bannedWordsList, lowerWord]);
        }
    };

    const removeBannedWord = (word) => {
        const lowerWord = word.toLowerCase();
        setBannedWordsList(bannedWordsList.filter(w => w !== lowerWord));
    };

    const clearAllData = () => {
        setBannedWordsList([]);
        setCharMapping("");
        localStorage.removeItem('bannedWords');
        localStorage.removeItem('charMapping');
    };

    return {
        inputText,
        setInputText,
        charMapping,
        setCharMapping,
        outputText,
        transformText,
        bannedWordsList,
        addBannedWord,
        removeBannedWord,
        clearAllData
    };
};

const BannedWordsList = ({ words, onRemove }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-gray-100">Words to Transform</h2>
            {words.length === 0 ? (
                <p className="text-gray-400">No words added yet</p>
            ) : (
                <ul className="space-y-2">
                    {words.map((word, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center bg-gray-800/30 p-2 rounded-lg border border-gray-700"
                        >
                            <span className="text-gray-200">{word}</span>
                            <button
                                onClick={() => onRemove(word)}
                                className="text-red-400 hover:text-red-300"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const TextTransformer = () => {
    const {
        inputText,
        setInputText,
        charMapping,
        setCharMapping,
        outputText,
        transformText,
        bannedWordsList,
        addBannedWord,
        removeBannedWord,
        clearAllData
    } = useTextTransformer();

    const [newBannedWord, setNewBannedWord] = useState("");

    const handleAddBannedWord = () => {
        if (newBannedWord.trim()) {
            addBannedWord(newBannedWord.trim());
            setNewBannedWord("");
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-100 text-center mb-12">
                Transform your captions into censor-guarded text.
            </h1>
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100">Text Transformer</h2>
                    <button
                        onClick={clearAllData}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        Clear All Data
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add a word to transform"
                            value={newBannedWord}
                            onChange={(e) => setNewBannedWord(e.target.value)}
                            className="flex-1 p-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAddBannedWord}
                            className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    <BannedWordsList
                        words={bannedWordsList}
                        onRemove={removeBannedWord}
                    />

                    <textarea
                        rows="6"
                        placeholder="Enter your sentence"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full p-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        placeholder="Letter mapping (e.g., a:@,o:0)"
                        value={charMapping}
                        onChange={(e) => setCharMapping(e.target.value)}
                        className="w-full p-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={transformText}
                        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Transform Text
                    </button>

                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-100">Output</h2>
                        <div className="p-3 bg-gray-800/30 border border-gray-700 rounded-lg min-h-[50px] text-gray-100">
                            {outputText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextTransformer;
