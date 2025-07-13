import React from 'react';

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const InputField = ({ id, label, value, onChange }: InputFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label htmlFor={id}>{label}: </label>
      <input id={id} type="text" value={value} onChange={handleChange} />
    </>
  );
};
