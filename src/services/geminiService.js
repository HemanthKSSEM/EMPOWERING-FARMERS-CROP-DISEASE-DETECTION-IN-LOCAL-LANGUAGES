import { GoogleGenerativeAI } from '@google/generative-ai';
import { getLanguageByCode, getDefaultLanguage } from '../constants/languages';

// Initialize Gemini API
const genAI = ;


/**
 * Analyze plant images using Gemini Flash 2.0
 * Returns detailed analysis including plant name, disease detection, and recommendations
 * @param {File[]} imageFiles - Array of image files to analyze
 * @param {string} languageCode - Language code for the analysis (e.g., 'en', 'hi', 'kn')
 */
export const analyzePlantImages = async (imageFiles, languageCode = 'en') => {
  try {
    // Get language configuration
    const language = getLanguageByCode(languageCode) || getDefaultLanguage();
    
    // Use Gemini Flash 2.0 model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Convert images to base64 for API
    const imageParts = await Promise.all(
      imageFiles.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
              inlineData: {
                data: base64Data,
                mimeType: file.type,
              },
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    // Detailed prompt for comprehensive plant disease analysis
    const prompt = `You are an expert plant pathologist and agricultural scientist. Analyze the provided plant image(s) in detail and provide a comprehensive assessment in the following JSON format:

{
  "plantName": "Common and scientific name of the plant",
  "diseasePresent": true or false,
  "diseaseName": "Name of the disease if present, otherwise 'Healthy'",
  "diseaseStage": "Early/Medium/Advanced/Critical (if disease present, otherwise 'N/A')",
  "confidenceLevel": 85-99,
  "symptoms": ["List of visible symptoms"],
  "organicRecommendations": [
    {
      "treatment": "Specific organic treatment method",
      "application": "How and when to apply",
      "effectiveness": "Expected effectiveness level"
    }
  ],
  "inorganicRecommendations": [
    {
      "treatment": "Specific chemical/synthetic treatment",
      "activeIngredient": "Main chemical component",
      "application": "Dosage and application method",
      "precautions": "Safety measures"
    }
  ],
  "preventiveMeasures": ["List of prevention tips"],
  "severity": "Low/Medium/High/Critical",
  "urgency": "Immediate/Within 3 days/Within a week/Monitor"
}

LANGUAGE REQUIREMENT: ${language.promptInstruction}

IMPORTANT: 
- Provide detailed, actionable recommendations in the specified language
- If multiple images show different plants or diseases, analyze each separately and return an array of results
- Be precise and scientific in your assessment
- Ensure ALL text content (disease names, symptoms, recommendations, preventive measures) is in the requested language
- Keep the JSON structure keys in English, but all values should be in the requested language`;

    // Generate content with images
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    // Remove markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysisResult = JSON.parse(jsonText);

    // If single result, wrap in array for consistency
    const results = Array.isArray(analysisResult) ? analysisResult : [analysisResult];

    return {
      success: true,
      results: results,
      timestamp: new Date().toISOString(),
      language: language.code,
      languageName: language.name
    };
  } catch (error) {
    console.error('Error analyzing images:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze images. Please try again.',
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get file from base64 data URL
 */
export const base64ToFile = (base64String, filename, mimeType) => {
  const arr = base64String.split(',');
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mimeType });
};
