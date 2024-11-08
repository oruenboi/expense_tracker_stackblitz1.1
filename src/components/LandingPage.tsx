import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, PieChart, Calendar, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-600'} text-white py-16 transition-colors duration-200`}>
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to Expense Tracker</h1>
          <p className="text-xl mb-8">Take control of your finances with our easy-to-use expense tracking app</p>
          <div className="space-x-4">
            <Link to="/login" className={`${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-blue-100'} px-6 py-2 rounded-full font-semibold transition-colors duration-200`}>
              Login
            </Link>
            <Link to="/register" className={`${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200`}>
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<DollarSign size={48} />}
            title="Expense Tracking"
            description="Easily add and categorize your expenses"
          />
          <FeatureCard
            icon={<PieChart size={48} />}
            title="Visual Reports"
            description="View your spending habits with intuitive charts"
          />
          <FeatureCard
            icon={<Calendar size={48} />}
            title="Custom Periods"
            description="Filter expenses by various time periods"
          />
          <FeatureCard
            icon={<Settings size={48} />}
            title="Account Management"
            description="Manage your profile and security settings"
          />
        </div>
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 py-8 transition-colors duration-200">
        <div className="container mx-auto text-center px-4">
          <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  const { theme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center flex flex-col items-center transition-colors duration-200">
      <div className={`${theme === 'dark' ? 'text-blue-400 bg-gray-700' : 'text-blue-500 bg-blue-100'} mb-4 flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-200`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default LandingPage;