/**
 * Supported languages for plant disease analysis
 * Covers 10 major Indian languages plus English
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇮🇳',
    promptInstruction: 'Provide the analysis in clear, standard English language. Use proper English vocabulary without mixing Hindi, Kannada, or other regional language words. Keep the language simple, professional, and easy to understand. Use standard international English terminology for plant diseases and agricultural practices.'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    promptInstruction: 'Provide the entire analysis in Kannada language (ಕನ್ನಡ). All disease names, symptoms, recommendations, and descriptions must be in Kannada script.'
  },
  // {
  //   code: 'hi',
  //   name: 'Hindi',
  //   nativeName: 'हिन्दी',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Hindi language (हिन्दी). All disease names, symptoms, recommendations, and descriptions must be in Devanagari script.'
  // },
  // {
  //   code: 'te',
  //   name: 'Telugu',
  //   nativeName: 'తెలుగు',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Telugu language (తెలుగు). All disease names, symptoms, recommendations, and descriptions must be in Telugu script.'
  // },
  // {
  //   code: 'ta',
  //   name: 'Tamil',
  //   nativeName: 'தமிழ்',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Tamil language (தமிழ்). All disease names, symptoms, recommendations, and descriptions must be in Tamil script.'
  // },
  // {
  //   code: 'bn',
  //   name: 'Bengali',
  //   nativeName: 'বাংলা',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Bengali language (বাংলা). All disease names, symptoms, recommendations, and descriptions must be in Bengali script.'
  // },
  // {
  //   code: 'mr',
  //   name: 'Marathi',
  //   nativeName: 'मराठी',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Marathi language (मराठी). All disease names, symptoms, recommendations, and descriptions must be in Devanagari script.'
  // },
  // {
  //   code: 'gu',
  //   name: 'Gujarati',
  //   nativeName: 'ગુજરાતી',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Gujarati language (ગુજરાતી). All disease names, symptoms, recommendations, and descriptions must be in Gujarati script.'
  // },
  // {
  //   code: 'ml',
  //   name: 'Malayalam',
  //   nativeName: 'മലയാളം',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Malayalam language (മലയാളം). All disease names, symptoms, recommendations, and descriptions must be in Malayalam script.'
  // },
  // {
  //   code: 'pa',
  //   name: 'Punjabi',
  //   nativeName: 'ਪੰਜਾਬੀ',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Punjabi language (ਪੰਜਾਬੀ). All disease names, symptoms, recommendations, and descriptions must be in Gurmukhi script.'
  // },
  // {
  //   code: 'or',
  //   name: 'Odia',
  //   nativeName: 'ଓଡ଼ିଆ',
  //   flag: '🇮🇳',
  //   promptInstruction: 'Provide the entire analysis in Odia language (ଓଡ଼ିଆ). All disease names, symptoms, recommendations, and descriptions must be in Odia script.'
  // }
];

/**
 * Get language by code
 */
export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};

/**
 * Get default language (English)
 */
export const getDefaultLanguage = () => {
  return SUPPORTED_LANGUAGES[0];
};
