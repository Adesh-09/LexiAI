"use client";

// Google AI Studio API key
const googleAIKey = "AIzaSyAEz333Dr8W-mqH4zyKBGKYb0uH0wrHjrY";

// Base URL for Google AI API
const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
const model = "gemini-pro";

/**
 * Processes document text using Google Gemini AI
 */
export async function analyzeDocument(documentText: string): Promise<{
  summary: string;
  docType: string;
  clauseTags: Record<string, string>;
}> {
  const prompt = `
    You are a legal AI assistant. Analyze the following legal document:
    
    ---
    ${documentText.substring(0, 15000)} ${documentText.length > 15000 ? '... (truncated for length)' : ''}
    ---
    
    1. Provide a concise summary of the document (max 250 words).
    2. Determine the document type (e.g., NDA, employment contract, terms of service).
    3. Identify and extract key clauses from the document, including:
       - Termination clauses
       - Jurisdiction/governing law
       - Indemnification
       - Liability limitations
       - Non-compete/confidentiality
       - Payment terms (if applicable)
    4. Highlight any unusual or potentially risky terms.
    
    Format your response as a JSON object with the following keys:
    {
      "summary": "...",
      "docType": "...",
      "clauseTags": {
        "termination": "...",
        "jurisdiction": "...",
        "indemnification": "...",
        "liability": "...",
        "confidentiality": "...",
        "payment": "..."
      }
    }
  `;

  const response = await fetchGeminiResponse(prompt);
  
  try {
    // Extract JSON from the response text
    const jsonMatch = response.match(/```json\s*({[\s\S]*?})\s*```/) || 
                       response.match(/{[\s\S]*?}/);
                       
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      summary: "Failed to parse document automatically.",
      docType: "Unknown",
      clauseTags: {}
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      summary: "Error processing document.",
      docType: "Unknown",
      clauseTags: {}
    };
  }
}

/**
 * Gets an answer to a specific question about a document
 */
export async function askQuestionAboutDocument(
  documentText: string,
  question: string
): Promise<string> {
  const prompt = `
    You are a legal AI assistant helping a lawyer analyze a document. 
    Use the following document context to answer the question as accurately as possible:
    
    ---
    ${documentText.substring(0, 15000)} ${documentText.length > 15000 ? '... (truncated for length)' : ''}
    ---
    
    QUESTION: ${question}
    
    Answer the question based ONLY on information in the document. 
    If the document doesn't contain information to answer the question, state that clearly.
    Provide specific quotes or references from the document when relevant.
  `;

  return await fetchGeminiResponse(prompt);
}

/**
 * Finds legal references related to a document or term
 */
export async function findLegalReferences(
  searchTerm: string
): Promise<Array<{url: string, title: string, snippet: string, citation: string}>> {
  const prompt = `
    You are a legal AI assistant helping a lawyer find authoritative online references.
    Find 3 highly relevant, authoritative online sources related to this legal topic or term:
    
    "${searchTerm}"
    
    For each source, provide:
    1. A plausible URL (must begin with https://)
    2. The title of the source
    3. A 1-2 sentence snippet explaining what information this source provides
    4. A proper legal citation format for this source
    
    Format your response as a JSON array of objects with the following structure:
    [
      {
        "url": "https://example.com/resource",
        "title": "Resource Title",
        "snippet": "Brief description of what this resource provides",
        "citation": "Proper legal citation"
      },
      ...
    ]
  `;

  const response = await fetchGeminiResponse(prompt);
  
  try {
    // Extract JSON from the response text
    const jsonMatch = response.match(/```json\s*(\[[\s\S]*?\])\s*```/) || 
                       response.match(/\[[\s\S]*?\]/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    
    // Fallback
    return [{
      url: "https://www.law.cornell.edu/",
      title: "Legal Information Institute",
      snippet: "Comprehensive legal information provided by Cornell Law School.",
      citation: "Legal Information Institute, Cornell Law School, available at law.cornell.edu"
    }];
  } catch (error) {
    console.error("Failed to parse references:", error);
    return [{
      url: "https://www.law.cornell.edu/",
      title: "Legal Information Institute",
      snippet: "Comprehensive legal information provided by Cornell Law School.",
      citation: "Legal Information Institute, Cornell Law School, available at law.cornell.edu"
    }];
  }
}

/**
 * Makes a request to the Google Gemini API
 */
async function fetchGeminiResponse(prompt: string): Promise<string> {
  const url = `${baseUrl}/${model}:generateContent?key=${googleAIKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service response error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text || "No response generated.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while processing your request.";
  }
}