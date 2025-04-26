import React from 'react';
import { DiagnosticMessage } from '../types';
import { ClipboardList, CheckCircle, AlertTriangle, XCircle, WrenchIcon } from 'lucide-react';

interface DiagnosticsPanelProps {
  diagnostics: DiagnosticMessage[];
}

const DiagnosticsPanel: React.FC<DiagnosticsPanelProps> = ({ diagnostics }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  const getStatusIcon = (status: DiagnosticMessage['status']) => {
    switch (status) {
      case 'emergency':
        return <XCircle className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-orange-400 animate-bounce" />;
      case 'auto-fix':
        return <WrenchIcon className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    }
  };
  
  const getMessageClass = (status: DiagnosticMessage['status']) => {
    switch (status) {
      case 'emergency':
        return 'bg-red-50 border-red-200 animate-pulse';
      case 'alert':
        return 'bg-orange-50 border-orange-200';
      case 'auto-fix':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-emerald-50 border-emerald-200';
    }
  };
  
  const getDeviceBadgeClass = (device: DiagnosticMessage['device']) => {
    return device === 'ventilator' 
      ? 'bg-indigo-100 text-indigo-800 border-indigo-300' 
      : 'bg-violet-100 text-violet-800 border-violet-300';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-800">System Diagnostics</h2>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
            <span className="text-sm text-slate-600">Live Feed</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        {diagnostics.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No diagnostic messages yet.</p>
        ) : (
          <div className="space-y-3">
            {diagnostics.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 border rounded-lg transition-all duration-300 ${getMessageClass(message.status)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(message.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-xs rounded border ${getDeviceBadgeClass(message.device)}`}>
                          {message.device === 'ventilator' ? 'Ventilator' : 'Defibrillator'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticsPanel;