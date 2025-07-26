import React, { useEffect, useRef } from 'react';

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  isFocused?: boolean;
  onChange: (value: string) => void;
};

export const InputField = ({
  id,
  label,
  value,
  isFocused,
  onChange,
}: InputFieldProps) => {
  // (1) Создаём ref
  const inputRef = useRef<HTMLInputElement>(null!);

  // (3) Эффект для управления фокусом
  useEffect(() => {
    if (isFocused && inputRef?.current) {
      // (4) Императивный вызов focus()
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label htmlFor={id}>{label}: </label>
      <input
        ref={inputRef} // (2) Привязываем ref к элементу
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
      />
    </>
  );
};
