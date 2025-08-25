import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

interface Translation {
  [key: string]: string;
}

interface Translations {
  [language: string]: Translation;
}

const translations: Translations = {
  en: {
    // Admin Page
    'admin.title': 'User Management',
    'admin.description': 'View user quiz activities and manage users',
    'admin.addUser': 'Add User',
    'admin.totalQuizzes': 'Total Quizzes',
    'admin.activeUsers': 'Active Users',
    'admin.quizTopics': 'Quiz Topics',
    'admin.search': 'Search by user, topic, difficulty, or question type...',
    'admin.showing': 'Showing',
    'admin.user': 'User',
    'admin.topic': 'Topic',
    'admin.difficulty': 'Difficulty',
    'admin.questionType': 'Question Type',
    'admin.createdAt': 'Created At',
    'admin.noQuizzes': 'No quiz data available.',
    'admin.noResults': 'No quizzes found matching your search.',
    'admin.loadingQuizzes': 'Loading quiz data...',
    
    // Add User Dialog
    'addUser.title': 'Add New User with Quiz Preferences',
    'addUser.username': 'Username',
    'addUser.password': 'Password',
    'addUser.topic': 'Programming Topics (Multiple Selection)',
    'addUser.difficulty': 'Difficulty',
    'addUser.questionType': 'Question Type',
    'addUser.cancel': 'Cancel',
    'addUser.create': 'Create User',
    'addUser.creating': 'Creating...',
    'addUser.allRequired': 'All fields are required',
    'addUser.success': 'User created successfully',
    'addUser.failed': 'Failed to create user',
    
    // Difficulty levels
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    
    // Question types
    'questionType.mixed': 'Mixed (Multiple Choice + Code)',
    'questionType.multipleChoice': 'Multiple Choice Only',
    'questionType.codeInput': 'Code Input Only',
    'questionType.trueFalse': 'True/False Only',
    
    // Common
    'common.language': 'Language',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.previous': 'Previous',
    'common.next': 'Next',
    'common.page': 'Page',
    'common.of': 'of',
    'common.rowsPerPage': 'Rows per page:',
  },
  es: {
    // Admin Page
    'admin.title': 'Gestión de Usuarios',
    'admin.description': 'Ver actividades de cuestionarios de usuarios y gestionar usuarios',
    'admin.addUser': 'Agregar Usuario',
    'admin.totalQuizzes': 'Cuestionarios Totales',
    'admin.activeUsers': 'Usuarios Activos',
    'admin.quizTopics': 'Temas de Cuestionarios',
    'admin.search': 'Buscar por usuario, tema, dificultad o tipo de pregunta...',
    'admin.showing': 'Mostrando',
    'admin.user': 'Usuario',
    'admin.topic': 'Tema',
    'admin.difficulty': 'Dificultad',
    'admin.questionType': 'Tipo de Pregunta',
    'admin.createdAt': 'Creado el',
    'admin.noQuizzes': 'No hay datos de cuestionarios disponibles.',
    'admin.noResults': 'No se encontraron cuestionarios que coincidan con su búsqueda.',
    'admin.loadingQuizzes': 'Cargando datos de cuestionarios...',
    
    // Add User Dialog
    'addUser.title': 'Agregar Nuevo Usuario con Preferencias de Cuestionario',
    'addUser.username': 'Nombre de Usuario',
    'addUser.password': 'Contraseña',
    'addUser.topic': 'Temas de Programación (Selección Múltiple)',
    'addUser.difficulty': 'Dificultad',
    'addUser.questionType': 'Tipo de Pregunta',
    'addUser.cancel': 'Cancelar',
    'addUser.create': 'Crear Usuario',
    'addUser.creating': 'Creando...',
    'addUser.allRequired': 'Todos los campos son obligatorios',
    'addUser.success': 'Usuario creado exitosamente',
    'addUser.failed': 'Error al crear usuario',
    
    // Difficulty levels
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Medio',
    'difficulty.hard': 'Difícil',
    
    // Question types
    'questionType.mixed': 'Mixto (Opción Múltiple + Código)',
    'questionType.multipleChoice': 'Solo Opción Múltiple',
    'questionType.codeInput': 'Solo Entrada de Código',
    'questionType.trueFalse': 'Solo Verdadero/Falso',
    
    // Common
    'common.language': 'Idioma',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.previous': 'Anterior',
    'common.next': 'Siguiente',
    'common.page': 'Página',
    'common.of': 'de',
    'common.rowsPerPage': 'Filas por página:',
  },
  fr: {
    // Admin Page
    'admin.title': 'Gestion des Utilisateurs',
    'admin.description': 'Voir les activités de quiz des utilisateurs et gérer les utilisateurs',
    'admin.addUser': 'Ajouter un Utilisateur',
    'admin.totalQuizzes': 'Quiz Totaux',
    'admin.activeUsers': 'Utilisateurs Actifs',
    'admin.quizTopics': 'Sujets de Quiz',
    'admin.search': 'Rechercher par utilisateur, sujet, difficulté ou type de question...',
    'admin.showing': 'Affichage',
    'admin.user': 'Utilisateur',
    'admin.topic': 'Sujet',
    'admin.difficulty': 'Difficulté',
    'admin.questionType': 'Type de Question',
    'admin.createdAt': 'Créé le',
    'admin.noQuizzes': 'Aucune donnée de quiz disponible.',
    'admin.noResults': 'Aucun quiz trouvé correspondant à votre recherche.',
    'admin.loadingQuizzes': 'Chargement des données de quiz...',
    
    // Add User Dialog
    'addUser.title': 'Ajouter un Nouvel Utilisateur avec Préférences de Quiz',
    'addUser.username': 'Nom d\'utilisateur',
    'addUser.password': 'Mot de passe',
    'addUser.topic': 'Sujets de Programmation (Sélection Multiple)',
    'addUser.difficulty': 'Difficulté',
    'addUser.questionType': 'Type de Question',
    'addUser.cancel': 'Annuler',
    'addUser.create': 'Créer un Utilisateur',
    'addUser.creating': 'Création...',
    'addUser.allRequired': 'Tous les champs sont obligatoires',
    'addUser.success': 'Utilisateur créé avec succès',
    'addUser.failed': 'Échec de la création de l\'utilisateur',
    
    // Difficulty levels
    'difficulty.easy': 'Facile',
    'difficulty.medium': 'Moyen',
    'difficulty.hard': 'Difficile',
    
    // Question types
    'questionType.mixed': 'Mixte (Choix Multiple + Code)',
    'questionType.multipleChoice': 'Choix Multiple Seulement',
    'questionType.codeInput': 'Saisie de Code Seulement',
    'questionType.trueFalse': 'Vrai/Faux Seulement',
    
    // Common
    'common.language': 'Langue',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
    'common.previous': 'Précédent',
    'common.next': 'Suivant',
    'common.page': 'Page',
    'common.of': 'de',
    'common.rowsPerPage': 'Lignes par page:',
  }
};

const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    // Get language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('selectedLanguage') as SupportedLanguage;
    return savedLanguage && Object.keys(translations).includes(savedLanguage) ? savedLanguage : 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('selectedLanguage', currentLanguage);
    
    // Set document direction for RTL languages
    document.dir = RTL_LANGUAGES.includes(currentLanguage) ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const isRTL = RTL_LANGUAGES.includes(currentLanguage);

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    isRTL,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};