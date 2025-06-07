import React from 'react';

const Textarea = ({ className, value, onChange, placeholder, required, rows }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      required={required}
      rows={rows}
    />
  );
};

export default Textarea;