import { useEffect, useState } from 'react';
import type { Story } from '../types';

const API_ENDPOINT = 'http://localhost:3000/catalog';

export const useGetStoriesQuery = (activeSearch: string) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = () => {
      setIsLoading(true);

      fetch(`${API_ENDPOINT}?title_like=${activeSearch}`, {
        signal: controller.signal, // Подключаем механизм отмены
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          return response.json();
        })
        .then((result) => {
          setStories(result);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            // Игнорируем ошибку отмены
            setIsLoading(false);
            setIsError(true);
          }
        });
    };

    fetchData();

    return () => controller.abort();
  }, [activeSearch]);

  return { data: stories, isLoading, isError };
};
