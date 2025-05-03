import i18next from 'i18next';
import Backend from 'i18next-fs-backend'; // Correct import without subpath
import middleware from 'i18next-http-middleware';
import path from 'path';

const initializeI18n = () => {
  i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      fallbackLng: 'en',
      preload: ['en', 'fr', 'ar'], // Supported languages
      backend: {
        loadPath: path.join(process.cwd(), 'locales/{{lng}}/translation.json'),
      },
    });

  return middleware.handle(i18next);
};

export default initializeI18n;
