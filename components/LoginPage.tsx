
import React, { useState } from 'react';
import { LoadingSpinner } from './icons';

const LOGO_URL = 'https://amazmodularinterior.com/wp-content/uploads/2024/07/Grey_Orange_Modern_Circle_Class_Logo__7_-removebg-preview-e1739462864846.png';

interface LoginPageProps {
  onLoginSuccess: (userId: string) => void;
}

const users: Record<string, string> = {
  '456777': 'Amaz@m25@27',
  '786786': 'INTER@7m',
  '667733': 'Amaz@25@m25',
};

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [amazId, setAmazId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amazId || !password) {
        setError('Please enter both Amaz ID and Password.');
        return;
    }
    setIsLoading(true);
    setError('');

    // Simulate network delay for better UX
    setTimeout(() => {
      if (users[amazId] && users[amazId] === password) {
        onLoginSuccess(amazId);
      } else {
        setError('Invalid Amaz ID or Password.');
        setIsLoading(false);
      }
    }, 500);
  };
  
  const inputClass = "block w-full px-4 py-3 bg-neutral-100 border border-neutral-300 rounded-lg text-sm text-neutral-900 shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition";

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-sm mx-auto">
         <div className="text-center mb-8">
            <img src={LOGO_URL} alt="Company Logo" className="h-24 w-24 object-contain mx-auto" />
            <h1 className="text-3xl font-bold mt-4 text-neutral-900">Your Family Interior</h1>
            <p className="text-md text-neutral-600">AMAZ CRM Portal</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-200">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="amazId" className="block text-sm font-medium text-neutral-700">
                Amaz ID
              </label>
              <div className="mt-1">
                <input
                  id="amazId"
                  name="amazId"
                  type="text"
                  autoComplete="username"
                  required
                  value={amazId}
                  onChange={(e) => setAmazId(e.target.value)}
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {error && (
                <div className="text-sm text-center font-medium text-red-600" role="alert">
                    {error}
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <LoadingSpinner className="h-5 w-5 text-white" /> : 'Log In'}
              </button>
            </div>
          </form>
        </div>
        <footer className="text-center text-xs text-neutral-500 mt-8">
            <p>Powered by AMAZ</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;