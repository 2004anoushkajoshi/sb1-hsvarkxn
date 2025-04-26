import React, { ReactNode } from 'react';
import { DeviceStatus } from '../types';
import { Wrench } from 'lucide-react';

interface MetricGaugeProps {
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
  status: DeviceStatus;
  isHealing: boolean;
  healingMessage: string | null;
  min: number;
  max: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  criticalIsLower?: boolean;
  customWarningCheck?: (value: number) => boolean;
}

const MetricGauge: React.FC<MetricGaugeProps> = ({
  icon,
  label,
  value,
  unit,
  status,
  isHealing,
  healingMessage,
  min,
  max,
  warningThreshold,
  criticalThreshold,
  criticalIsLower = false,
  customWarningCheck
}) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  
  const getValueColor = () => {
    switch (status) {
      case 'emergency':
        return 'text-red-600 animate-pulse';
      case 'alert':
        return 'text-orange-500';
      case 'auto-fix':
        return 'text-blue-500';
      default:
        return 'text-emerald-600';
    }
  };
  
  const getGaugeColor = () => {
    switch (status) {
      case 'emergency':
        return 'bg-red-500 animate-pulse';
      case 'alert':
        return 'bg-orange-400';
      case 'auto-fix':
        return 'bg-blue-400 animate-pulse';
      default:
        return 'bg-emerald-400';
    }
  };
  
  const getBorderColor = () => {
    switch (status) {
      case 'emergency':
        return 'border-red-200 shadow-red-100';
      case 'alert':
        return 'border-orange-200 shadow-orange-100';
      case 'auto-fix':
        return 'border-blue-200 shadow-blue-100';
      default:
        return 'border-slate-200 shadow-slate-100';
    }
  };
  
  return (
    <div className={`bg-white rounded-lg p-4 relative border shadow-lg transition-all duration-300 ${getBorderColor()}`}>
      {/* Self-healing indicator */}
      {isHealing && (
        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg animate-spin">
          <Wrench className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className="flex items-center mb-2">
        <div className={`transition-colors duration-300 ${status === 'auto-fix' ? 'animate-pulse' : ''}`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-slate-500 ml-2">{label}</h3>
      </div>
      
      <div className={`text-2xl font-bold mb-2 transition-all duration-300 ${getValueColor()}`}>
        {value.toFixed(1)} <span className="text-sm font-normal">{unit}</span>
      </div>
      
      {/* Healing message with animation */}
      {isHealing && healingMessage && (
        <div className="text-xs text-blue-500 mb-2 animate-pulse font-medium">
          {healingMessage}
        </div>
      )}
      
      {/* Animated gauge bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-in-out ${getGaugeColor()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default MetricGauge;