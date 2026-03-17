import { usePersistedState } from './usePersistedState';

export type LanguageCode = 'fr' | 'en' | 'tsh' | 'lin' | 'sw';

export interface AppState {
  language: LanguageCode;
  selectedCategory: string;
  searchQuery: string;
}

export const useAppState = () => {
  const [language, setLanguage] = usePersistedState<LanguageCode>('app-language', 'fr');
  const [selectedCategory, setSelectedCategory] = usePersistedState<string>('app-category', 'All');
  const [searchQuery, setSearchQuery] = usePersistedState<string>('app-search', '');

  return {
    language,
    setLanguage,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  };
};
