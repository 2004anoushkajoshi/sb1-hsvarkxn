import React from 'react';
import VentilatorCard from './VentilatorCard';
import DefibrillatorCard from './DefibrillatorCard';
import DiagnosticsPanel from './DiagnosticsPanel';
import { useDeviceSimulation } from '../hooks/useDeviceSimulation';

const Dashboard: React.FC = () => {
  const { ventilator, defibrillator, diagnostics } = useDeviceSimulation();

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VentilatorCard metrics={ventilator} />
        <DefibrillatorCard metrics={defibrillator} />
      </div>
      
      <DiagnosticsPanel diagnostics={diagnostics} />
    </div>
  );
};

export default Dashboard;