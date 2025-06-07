import React from 'react';

const Button = ({ children, className, onClick, type = 'button', disabled }) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;