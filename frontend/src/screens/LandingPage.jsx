import React, { useState } from 'react';
import config from '../constants.js';
import { BuildingStorefrontIcon, UserPlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password, role);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BuildingStorefrontIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">FlavorFleet</span>
          </div>
          <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors">
            Admin Panel
          </a>
        </nav>
      </header>

      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Discover & Order
              <span className="block text-indigo-600">Your Favorite Food</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              FlavorFleet connects you to the best local restaurants. Easy ordering, fast delivery, and endless culinary options at your fingertips.
            </p>
            <div className="mt-8 flex gap-4">
              <button onClick={() => onLogin('customer@example.com', 'password')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-transform hover:scale-105">
                Demo as Customer
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
               <button onClick={() => onLogin('owner@example.com', 'password')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-transform hover:scale-105">
                Demo as Owner
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex border-b border-gray-200 mb-6">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-semibold ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Sign In</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-semibold ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Create Account</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
              )}
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
              {!isLogin && (
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="customer">I'm a Customer</option>
                  <option value="owner">I'm a Restaurant Owner</option>
                </select>
              )}
              <button type="submit" className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {isLogin ? 'Sign In' : 'Sign Up'}
                <UserPlusIcon className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
