import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    debug: true,
    resources: {
      fr: {
        translation: {
          register: {
            title: 'Créer un compte',
            name: 'Nom complet',
            email: 'Adresse e-mail',
            password: 'Mot de passe',
            phone: 'Numéro de téléphone',
            role: 'Sélectionnez un rôle',
            user: 'Utilisateur',
            driver: 'Chauffeur',
            vehicleType: 'Type de véhicule (ex. : Moto)',
            vehicleNumber: 'Numéro de véhicule (ex. : TN-1234)',
            submit: 'S\'inscrire',
            loginPrompt: 'Vous avez déjà un compte ?',
            login: 'Connexion',
          },
          bookRide: {
            title: 'Réserver un trajet',
            pickup: 'Lieu de prise en charge',
            dropoff: 'Lieu de dépose',
            selectPickup: 'Sélectionnez le lieu de prise en charge',
            selectDropoff: 'Sélectionnez le lieu de dépose',
            submit: 'Réserver un trajet',
            success: 'Trajet réservé avec succès !',
            error: 'Échec de la réservation du trajet. Veuillez réessayer.',
          },
          adminDashboard: {
            title: 'Tableau de bord administrateur',
            users: 'Utilisateurs',
            rides: 'Trajets',
            drivers: 'Chauffeurs',
            edit: 'Modifier',
            delete: 'Supprimer',
            update: 'Mettre à jour',
          },
        },
      },
    },
  });

export default i18n;
