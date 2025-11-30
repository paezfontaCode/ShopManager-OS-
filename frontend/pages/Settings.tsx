
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAppSettings } from '../hooks/useAppSettings';


const Settings: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const { appName, setAppName, backgroundImage, setBackgroundImage } = useAppSettings();

    const handleLanguageChange = (lang: 'en' | 'es') => {
        setLanguage(lang);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 border-b pb-3 dark:border-gray-700/50 text-gray-900 dark:text-white">{t.settings}</h2>
      
      <div className="space-y-6">
        
        {/* General Settings */}
        <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{t.generalSettings}</h3>
            <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700/50">
                <div>
                    <label htmlFor="appName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.appName}</label>
                    <input
                        type="text"
                        id="appName"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-50 dark:bg-dark-bg dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.backgroundImage}</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <input
                            type="file"
                            id="bg-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="bg-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            {t.uploadImage}
                        </label>
                        {backgroundImage && (
                             <button onClick={() => setBackgroundImage(null)} className="py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                {t.removeImage}
                            </button>
                        )}
                    </div>
                 </div>
            </div>
        </div>


        {/* Language Settings */}
        <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{t.languageSettings}</h3>
            <div className="p-4 border rounded-lg dark:border-gray-700/50">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.changeLanguage}</label>
                  <div className="mt-2 flex rounded-md shadow-sm">
                    <button
                      onClick={() => handleLanguageChange('es')}
                      className={`relative inline-flex items-center justify-center px-4 py-2 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary-dark dark:border-gray-600
                        ${language === 'es' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                    >
                      {t.spanish}
                    </button>
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`relative -ml-px inline-flex items-center justify-center px-4 py-2 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary-dark dark:border-gray-600
                        ${language === 'en' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                    >
                      {t.english}
                    </button>
                  </div>
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default Settings;