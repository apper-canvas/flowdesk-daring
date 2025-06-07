import React from 'react';

const Input = ({ className, type = 'text', value, onChange, placeholder, required, min, step }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      required={required}
      min={min}
      step={step}
    />
  );
};

export default Input;