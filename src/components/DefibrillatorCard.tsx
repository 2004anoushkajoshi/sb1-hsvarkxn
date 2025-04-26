import React from 'react';
import { DefibrillatorMetrics } from '../types';
import MetricGauge from './MetricGauge';
import StatusIndicator from './StatusIndicator';
import { Battery, Activity, Thermometer, Zap } from 'lucide-react';

interface DefibrillatorCardProps {
  metrics: DefibrillatorMetrics;
}

const DefibrillatorCard: React.FC<DefibrillatorCardProps> = ({ metrics }) => {
  const statuses = [
    metrics.batteryVoltage.status,
    metrics.ecgSignal.status,
    metrics.temperature.status
  ];
  
  const cardStatus = statuses.includes('emergency') ? 'emergency' :
                     statuses.includes('alert') ? 'alert' :
                     statuses.includes('auto-fix') ? 'auto-fix' : 'normal';
  
  const getBorderClass = () => {
    switch (cardStatus) {
      case 'emergency':
        return 'border-red-500 shadow-red-200 animate-pulse';
      case 'alert':
        return 'border-orange-400 shadow-orange-100 animate-[shake_0.5s_ease-in-out_infinite]';
      case 'auto-fix':
        return 'border-blue-400 shadow-blue-100';
      default:
        return 'border-emerald-300 shadow-emerald-100';
    }
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-500 ${getBorderClass()}`}>
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-slate-600" /> Defibrillator
          </h2>
          <StatusIndicator status={cardStatus} />
        </div>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricGauge
          icon={<Battery className="w-5 h-5 text-slate-600" />}
          label="Battery Voltage"
          value={metrics.batteryVoltage.value}
          unit="V"
          status={metrics.batteryVoltage.status}
          isHealing={metrics.batteryVoltage.isHealing}
          healingMessage={metrics.batteryVoltage.message}
          min={9}
          max={14}
          warningThreshold={11}
          criticalThreshold={10}
          criticalIsLower={true}
        />
        
        <MetricGauge
          icon={<Activity className="w-5 h-5 text-slate-600" />}
          label="ECG Signal"
          value={metrics.ecgSignal.value}
          unit="mV"
          status={metrics.ecgSignal.status}
          isHealing={metrics.ecgSignal.isHealing}
          healingMessage={metrics.ecgSignal.message}
          min={-1.5}
          max={1.5}
          warningThreshold={1}
          customWarningCheck={(value) => Math.abs(value) > 1}
        />
        
        <MetricGauge
          icon={<Thermometer className="w-5 h-5 text-slate-600" />}
          label="Temperature"
          value={metrics.temperature.value}
          unit="°C"
          status={metrics.temperature.status}
          isHealing={metrics.temperature.isHealing}
          healingMessage={metrics.temperature.message}
          min={15}
          max={50}
          warningThreshold={40}
          criticalThreshold={45}
        />
        
        <div className="bg-slate-50 rounded-lg p-4 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Capacitor Status</h3>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${metrics.capacitorReadiness === 'ready' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`}></div>
            <span className={`text-lg font-semibold ${metrics.capacitorReadiness === 'ready' ? 'text-emerald-600' : 'text-orange-600'}`}>
              {metrics.capacitorReadiness === 'ready' ? 'Ready' : 'Not Ready'}
            </span>
          </div>
          
          {metrics.capacitorReadiness === 'ready' && (
            <div className="mt-2 text-sm text-emerald-600">
              Defibrillator ready for use
            </div>
          )}
          
          {metrics.capacitorReadiness === 'not-ready' && (
            <div className="mt-2 text-sm text-orange-600">
              Resolving issues before activation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefibrillatorCard;