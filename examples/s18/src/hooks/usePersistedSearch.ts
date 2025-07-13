import { useEffect, useState } from 'react';

export const usePersistedSearch = (key: string, initialState: string) => {
  const [value, setValue] = useState<string>(
    localStorage.getItem(key) ?? initialState,
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]); // Добавляем key в зависимости

  return [value, setValue] as const;
};
