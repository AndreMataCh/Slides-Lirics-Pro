
import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const slideSchema = {
    type: Type.OBJECT,
    properties: {
        slides: {
            type: Type.ARRAY,
            description: "An array of slide objects for the song.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "The title of the song part (e.g., 'Verse 1', 'Chorus', 'Estrofa 1', 'Coro'). Should be in the original language of the lyrics."
                    },
                    content: {
                        type: Type.STRING,
                        description: "The lyric text for this slide, with line breaks represented by \\n. Each slide should contain 2 to 4 lines of lyrics."
                    }
                },
                required: ["title", "content"]
            }
        }
    },
    required: ["slides"]
};


export const generateSlidesFromText = async (lyrics: string): Promise<Slide[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Here are the song lyrics:\n\n${lyrics}`,
            config: {
                systemInstruction: "You are an expert assistant for church worship leaders. Your task is to take raw song lyrics and structure them into slides for projection during a service. Each slide should contain a short, readable portion of the lyrics, typically 2 to 4 lines. You must identify and label the parts of the song like 'Verse 1', 'Chorus', 'Bridge', 'Outro', etc. The labels must be in the same language as the lyrics provided.",
                responseMimeType: "application/json",
                responseSchema: slideSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);
        return parsed.slides as Slide[];

    } catch (error) {
        console.error("Error generating slides from text:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
};

const textExtractionSchema = {
    type: Type.OBJECT,
    properties: {
        extractedText: {
            type: Type.STRING,
            description: "The full text of the lyrics extracted from the document."
        }
    },
    required: ["extractedText"]
};

export const generateSlidesFromFile = async (file: File): Promise<{ extractedText: string; slides: Slide[] }> => {
    try {
        const filePart = await fileToGenerativePart(file);
        
        // First, extract the text from the document
        const extractionResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [filePart, { text: "Extract all lyrics from this document. Do not summarize or alter them." }] },
             config: {
                responseMimeType: "application/json",
                responseSchema: textExtractionSchema,
            },
        });
        
        const extractionJson = JSON.parse(extractionResponse.text.trim());
        const extractedText = extractionJson.extractedText;

        if (!extractedText || extractedText.trim().length < 10) {
            throw new Error("Could not extract meaningful lyrics from the file.");
        }

        // Then, generate slides from the extracted text
        const slides = await generateSlidesFromText(extractedText);

        return { extractedText, slides };

    } catch (error) {
        console.error("Error generating slides from file:", error);
        throw new Error("Failed to process the file with the Gemini API.");
    }
};
