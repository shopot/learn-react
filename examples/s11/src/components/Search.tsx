import React, { useState } from 'react';

export const Search = () => {
  // Инициализация состояния пустой строкой
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  console.log('Input changed:', searchTerm);

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
