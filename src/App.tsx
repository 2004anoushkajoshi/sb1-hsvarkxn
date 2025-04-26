import React from 'react';
import { Toaster } from 'sonner';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Toaster position="top-right" expand={true} richColors />
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-800">ICU Monitoring System</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-sm text-slate-600">System Active</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;