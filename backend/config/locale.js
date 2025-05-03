import path from 'path';
import fs from 'fs';

const translationsPath = path.join(process.cwd(), 'locales');

const loadTranslations = (lang) => {
  try {
    const filePath = path.join(translationsPath, `${lang}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return {}; // Return empty object if language file is missing
  } catch (error) {
    console.error('Failed to load translations:', error);
    return {};
  }
};

export const getTranslation = (lang, key, variables = {}) => {
  const translations = loadTranslations(lang);
  let translation = translations[key] || key;

  // Replace variables in the translation string
  Object.keys(variables).forEach((varKey) => {
    translation = translation.replace(`{{${varKey}}}`, variables[varKey]);
  });

  return translation;
};
