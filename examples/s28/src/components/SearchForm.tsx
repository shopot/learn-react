import React, { memo, useState } from 'react';
import { InputField } from './InputField';

type SearchFormProps = {
  loading: boolean;
  defaultValue: string;
  onSubmit: (searchValue: string) => void;
};

export const SearchForm = memo(
  ({ loading, defaultValue, onSubmit }: SearchFormProps) => {
    const [inputValue, setInputValue] = useState(defaultValue);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      onSubmit(inputValue);
    };

    const handleClear = () => {
      setInputValue('');
      onSubmit('');
    };

    console.count('SearchForm');

    const isSubmitDisabled = loading || !inputValue;

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <InputField
            id="search"
            label="Search"
            value={inputValue}
            isFocused
            onChange={setInputValue}
          />
          <button type="submit" disabled={isSubmitDisabled}>
            Поиск
          </button>
          <button type="button" onClick={handleClear} disabled={!inputValue}>
            Очистить
          </button>
        </div>
      </form>
    );
  },
);
