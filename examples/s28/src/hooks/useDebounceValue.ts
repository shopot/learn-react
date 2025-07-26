import { useRef, useState } from 'react';

export const useDebounceValue = (defaultValue = '', delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(() => defaultValue);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(0);

  const setValue = (value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  };

  return [debouncedValue, setValue] as const;
};
