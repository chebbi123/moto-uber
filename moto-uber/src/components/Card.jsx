import React from 'react';

export default function Card({
  title,
  children,
  footer,
  className = '',
  variant = 'default',
  onClick,
}) {
  const baseStyles = 'card bg-white rounded-lg shadow-lg p-6 transition duration-300';
  const variants = {
    default: 'hover:shadow-xl',
    clickable: 'cursor-pointer hover:shadow-xl hover:bg-gray-100',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {title && <div className="card-header text-lg font-bold text-gray-800 mb-2">{title}</div>}
      <div className="card-body text-sm text-gray-600">{children}</div>
      {footer && <div className="card-footer mt-4 flex justify-end">{footer}</div>}
    </div>
  );
}
