import React from 'react';

const Spinner = ({ className = 'w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' }) => {
  return <div className={className}></div>;
};

export default Spinner;