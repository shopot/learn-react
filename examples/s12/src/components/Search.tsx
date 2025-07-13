import React, { useState } from 'react';

type SearchProps = {
  onSearch: (value: string) => void;
};

export const Search = ({ onSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setSearchTerm(newValue);
    onSearch(newValue); // Вызов Callback Handler
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        onChange={handleChange} // Обработчик изменения поля ввода
      />
    </div>
  );
};
