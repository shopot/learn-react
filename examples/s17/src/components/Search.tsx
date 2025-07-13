import React from 'react';

type SearchProps = {
  search: string;
  onSearch: (value: string) => void;
};

export const Search = ({ search, onSearch }: SearchProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        value={search} // Значение и пропсов
        onChange={handleChange} // Обработчик изменения поля ввода
      />
    </>
  );
};
