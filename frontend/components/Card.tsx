
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorClasses: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, colorClasses }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 flex items-center border border-gray-100 dark:border-gray-700/50 transition-transform hover:scale-105 duration-200">
      <div className={`p-4 rounded-full ${colorClasses} shadow-md`}>
        {icon}
      </div>
      <div className="ml-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default Card;