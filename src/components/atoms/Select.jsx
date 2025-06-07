import React from 'react';

const Select = ({ children, className, value, onChange, required }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={className}
      required={required}
    >
      {children}
    </select>
  );
};

export default Select;