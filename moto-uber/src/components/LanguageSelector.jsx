import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex justify-center space-x-4 mt-4">
      <button
        onClick={() => changeLanguage('en')}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        Français
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        العربية
      </button>
    </div>
  );
}
