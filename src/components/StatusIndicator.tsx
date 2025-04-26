import React from 'react';
import { DeviceStatus } from '../types';
import { CheckCircle, AlertTriangle, XCircle, WrenchIcon } from 'lucide-react';

interface StatusIndicatorProps {
  status: DeviceStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  // Content based on status
  const getStatusContent = () => {
    switch (status) {
      case 'emergency':
        return {
          icon: <XCircle className="w-4 h-4 mr-1 text-white animate-pulse" />,
          text: 'Emergency',
          classes: 'bg-red-500 text-white border-red-600 animate-bounce shadow-lg shadow-red-200'
        };
      case 'alert':
        return {
          icon: <AlertTriangle className="w-4 h-4 mr-1 text-white" />,
          text: 'Technician Alert',
          classes: 'bg-orange-400 text-white border-orange-500 animate-pulse shadow-lg shadow-orange-200'
        };
      case 'auto-fix':
        return {
          icon: <WrenchIcon className="w-4 h-4 mr-1 text-white animate-spin" />,
          text: 'Self-Healing Active',
          classes: 'bg-blue-400 text-white border-blue-500 shadow-lg shadow-blue-200'
        };
      default:
        return {
          icon: <CheckCircle className="w-4 h-4 mr-1 text-white" />,
          text: 'Normal Operation',
          classes: 'bg-emerald-400 text-white border-emerald-500 shadow-lg shadow-emerald-200'
        };
    }
  };
  
  const content = getStatusContent();
  
  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${content.classes}`}>
      {content.icon}
      <span>{content.text}</span>
    </div>
  );
};

export default StatusIndicator;