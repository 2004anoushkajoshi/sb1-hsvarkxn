import React from 'react';
import { VentilatorMetrics } from '../types';
import MetricGauge from './MetricGauge';
import StatusIndicator from './StatusIndicator';
import { Thermometer, Gauge, Droplet, Cpu } from 'lucide-react';

interface VentilatorCardProps {
  metrics: VentilatorMetrics;
}

const VentilatorCard: React.FC<VentilatorCardProps> = ({ metrics }) => {
  const statuses = [
    metrics.temperature.status,
    metrics.pressure.status,
    metrics.oxygenLevel.status
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
            <Cpu className="w-5 h-5 mr-2 text-slate-600" /> Ventilator
          </h2>
          <StatusIndicator status={cardStatus} />
        </div>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricGauge
          icon={<Thermometer className="w-5 h-5 text-slate-600" />}
          label="Temperature"
          value={metrics.temperature.value}
          unit="°C"
          status={metrics.temperature.status}
          isHealing={metrics.temperature.isHealing}
          healingMessage={metrics.temperature.message}
          min={15}
          max={45}
          warningThreshold={38}
          criticalThreshold={40}
        />
        
        <MetricGauge
          icon={<Gauge className="w-5 h-5 text-slate-600" />}
          label="Pressure"
          value={metrics.pressure.value}
          unit="cmH₂O"
          status={metrics.pressure.status}
          isHealing={metrics.pressure.isHealing}
          healingMessage={metrics.pressure.message}
          min={0}
          max={45}
          warningThreshold={35}
          criticalThreshold={40}
        />
        
        <MetricGauge
          icon={<Droplet className="w-5 h-5 text-slate-600" />}
          label="Oxygen Level"
          value={metrics.oxygenLevel.value}
          unit="%"
          status={metrics.oxygenLevel.status}
          isHealing={metrics.oxygenLevel.isHealing}
          healingMessage={metrics.oxygenLevel.message}
          min={80}
          max={100}
          warningThreshold={90}
          criticalThreshold={85}
          criticalIsLower={true}
        />
        
        <div className="bg-slate-50 rounded-lg p-4 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Firmware Status</h3>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${metrics.firmwareStatus === 'responsive' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
            <span className={`text-lg font-semibold ${metrics.firmwareStatus === 'responsive' ? 'text-emerald-600' : 'text-red-600'}`}>
              {metrics.firmwareStatus === 'responsive' ? 'Responsive' : 'Unresponsive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentilatorCard;