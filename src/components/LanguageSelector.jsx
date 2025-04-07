import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const { state, dispatch } = useStore();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    dispatch({ type: 'SET_LANGUAGE', payload: lng });
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="relative group">
      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
        <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
        <div className="py-1" role="menu">
          <button
            onClick={() => changeLanguage('fr')}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            Français
          </button>
          <button
            onClick={() => changeLanguage('ar')}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            العربية
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}