
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Lead, Project, TeamMember, SiteVisit, ClientCommLog } from '../types';
import { LoadingSpinner } from './icons';

interface DatabaseGeminiPageProps {
    leads: Lead[];
    projects: Project[];
    teamMembers: TeamMember[];
    siteVisits: SiteVisit[];
    clientLogs: ClientCommLog[];
}

const DatabaseGeminiPage: React.FC<DatabaseGeminiPageProps> = ({
    leads,
    projects,
    teamMembers,
    siteVisits,
    clientLogs
}) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exampleQuestions = [
        "How many projects are currently ongoing?",
        "What is the total pending amount across all projects?",
        "List all leads with 'Follow Up' status.",
    ];

    const handleAskAI = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setResponse('');

        try {
            const apiKey = process.env.API_KEY;

            if (!apiKey) {
                throw new Error("API key is not configured. Please ensure the API_KEY environment variable is set in your deployment environment.");
            }
            
            const ai = new GoogleGenAI({ apiKey });

            const crmData = {
                leads,
                projects,
                teamMembers,
                siteVisits,
                clientLogs,
            };

            const systemInstruction = `You are an intelligent assistant for an interior design CRM. Your task is to answer questions based on the data provided. The data is a snapshot of the company's leads, projects, team members, site visits, and client communication logs. Be helpful, concise, and format your answers clearly, using markdown for lists, bolding, and tables where appropriate. If a question is ambiguous, ask for clarification. If the question cannot be answered with the provided data, state that clearly. Today's date is ${new Date().toLocaleDateString()}.`;

            const contents = `${systemInstruction}\n\nHere is the data from the CRM in JSON format:\n\n${JSON.stringify(crmData, null, 2)}\n\n---\n\nUser's Question:\n"${query}"\n\n---\nAnswer:`;

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents,
            });

            setResponse(result.text);

        } catch (e: any) {
            console.error(e);
            setError(`An error occurred: ${e.message || 'Failed to get response from AI.'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 text-gray-900 bg-gray-100 h-full flex flex-col font-sans">
            <div className="flex-shrink-0 mb-6">
                <h2 className="text-3xl font-bold">Check Status </h2>
                <p className="text-base text-gray-500 mt-1">
                    Ask questions about your leads, projects, team, and more. Amaz Technology will analyze your data to find answers.
                </p>
            </div>

            <div className="flex-grow flex flex-col gap-6 overflow-y-auto">
                {/* Input Section */}
                <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., How many leads do we have in the 'Booked' status?"
                        className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        rows={3}
                        disabled={isLoading}
                        aria-label="AI Query Input"
                    />
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-4 gap-4">
                        <div className="text-xs text-gray-500">
                           <strong className="font-semibold text-gray-600">Examples:</strong>
                           <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            {exampleQuestions.map((q, i) => (
                                <button key={i} onClick={() => setQuery(q)} className="text-blue-600 hover:underline text-left disabled:opacity-50" disabled={isLoading}>{q}</button>
                            ))}
                           </div>
                        </div>
                        <button
                            onClick={handleAskAI}
                            disabled={isLoading || !query.trim()}
                            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            {isLoading ? <LoadingSpinner /> : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Response Section */}
                <div className="flex-grow min-h-[200px]">
                    {isLoading && (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                                <LoadingSpinner className="h-8 w-8 mx-auto text-blue-600" />
                                <p className="mt-2 text-sm text-gray-600">Analyzing your data...</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {response && (
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="text-lg font-bold mb-3 text-gray-900">AI Response:</h3>
                            <div className="text-base text-gray-800 whitespace-pre-wrap font-sans leading-relaxed prose prose-sm max-w-none">{response}</div>
                        </div>
                    )}
                     {!isLoading && !response && !error && (
                        <div className="text-center py-10 px-6 h-full flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg bg-white">
                            <h3 className="text-lg font-medium text-gray-900">Amaz Technology</h3>
                            <p className="mt-1 text-sm text-gray-500">Amaz Backend Technology Powered By Zaacy Server</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatabaseGeminiPage;