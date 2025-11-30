
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorClasses: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, colorClasses }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 flex items-center">
      <div className={`p-3 rounded-full ${colorClasses}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default Card;