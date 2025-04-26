import { useState, useEffect, useCallback } from 'react';
import { VentilatorMetrics, DefibrillatorMetrics, DiagnosticMessage, DeviceStatus } from '../types';
import { 
  generateInitialVentilatorMetrics, 
  generateInitialDefibrillatorMetrics,
  simulateVentilatorMetric,
  simulateEcgSignal,
  determineVentilatorTemperatureStatus,
  determineVentilatorPressureStatus,
  determineVentilatorOxygenStatus,
  determineDefibrillatorBatteryStatus,
  determineDefibrillatorEcgStatus,
  determineDefibrillatorTemperatureStatus
} from '../utils/simulationUtils';
import {
  checkVentilatorTemperature,
  checkVentilatorPressure,
  checkVentilatorOxygenLevel,
  checkDefibrillatorBatteryVoltage,
  checkDefibrillatorTemperature
} from '../utils/healingUtils';

const SIMULATION_INTERVAL = 3000; // Update every 3 seconds for demo purposes
const MAX_DIAGNOSTICS = 100; // Max number of diagnostic messages to keep

export const useDeviceSimulation = () => {
  const [ventilator, setVentilator] = useState<VentilatorMetrics>(generateInitialVentilatorMetrics());
  const [defibrillator, setDefibrillator] = useState<DefibrillatorMetrics>(generateInitialDefibrillatorMetrics());
  const [diagnostics, setDiagnostics] = useState<DiagnosticMessage[]>([]);
  
  // Add a diagnostic message
  const addDiagnostic = useCallback((message: string, status: DeviceStatus, device: 'ventilator' | 'defibrillator') => {
    setDiagnostics(prevDiagnostics => {
      const newDiagnostic: DiagnosticMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        message,
        status,
        device
      };
      return [newDiagnostic, ...prevDiagnostics].slice(0, MAX_DIAGNOSTICS);
    });
  }, []);

  // Update ventilator metrics
  const updateVentilator = useCallback(() => {
    setVentilator(prev => {
      // Check if temperature needs healing
      const tempCheck = checkVentilatorTemperature(prev.temperature);
      
      // Simulate next temperature
      const newTempValue = simulateVentilatorMetric(
        prev.temperature.value,
        prev.temperature.status,
        tempCheck.needsHealing,
        15, 
        45, 
        tempCheck.targetValue
      );
      const newTempStatus = determineVentilatorTemperatureStatus(newTempValue);
      
      // Check if healing status has changed
      if (tempCheck.needsHealing && !prev.temperature.isHealing) {
        addDiagnostic(tempCheck.message || 'Adjusting temperature...', 'auto-fix', 'ventilator');
      } else if (!tempCheck.needsHealing && prev.temperature.isHealing) {
        addDiagnostic('Temperature stabilized', 'normal', 'ventilator');
      } else if (newTempStatus !== prev.temperature.status) {
        if (newTempStatus === 'alert') {
          addDiagnostic('Temperature alert threshold reached', 'alert', 'ventilator');
        } else if (newTempStatus === 'emergency') {
          addDiagnostic('CRITICAL: Temperature emergency threshold exceeded', 'emergency', 'ventilator');
        } else if (newTempStatus === 'normal' && prev.temperature.status !== 'normal') {
          addDiagnostic('Temperature returned to normal range', 'normal', 'ventilator');
        }
      }
      
      // Pressure checks
      const pressureCheck = checkVentilatorPressure(prev.pressure);
      const newPressureValue = simulateVentilatorMetric(
        prev.pressure.value,
        prev.pressure.status,
        pressureCheck.needsHealing,
        2,
        45,
        pressureCheck.targetValue
      );
      const newPressureStatus = determineVentilatorPressureStatus(newPressureValue);
      
      // Check if healing status has changed for pressure
      if (pressureCheck.needsHealing && !prev.pressure.isHealing) {
        addDiagnostic(pressureCheck.message || 'Adjusting pressure...', 'auto-fix', 'ventilator');
      } else if (!pressureCheck.needsHealing && prev.pressure.isHealing) {
        addDiagnostic('Pressure stabilized', 'normal', 'ventilator');
      } else if (newPressureStatus !== prev.pressure.status) {
        if (newPressureStatus === 'alert') {
          addDiagnostic('Pressure alert threshold reached', 'alert', 'ventilator');
        } else if (newPressureStatus === 'emergency') {
          addDiagnostic('CRITICAL: Pressure emergency threshold exceeded', 'emergency', 'ventilator');
        } else if (newPressureStatus === 'normal' && prev.pressure.status !== 'normal') {
          addDiagnostic('Pressure returned to normal range', 'normal', 'ventilator');
        }
      }
      
      // Oxygen level checks
      const oxygenCheck = checkVentilatorOxygenLevel(prev.oxygenLevel);
      const newOxygenValue = simulateVentilatorMetric(
        prev.oxygenLevel.value,
        prev.oxygenLevel.status,
        oxygenCheck.needsHealing,
        80,
        100,
        oxygenCheck.targetValue
      );
      const newOxygenStatus = determineVentilatorOxygenStatus(newOxygenValue);
      
      // Check if healing status has changed for oxygen
      if (oxygenCheck.needsHealing && !prev.oxygenLevel.isHealing) {
        addDiagnostic(oxygenCheck.message || 'Adjusting oxygen...', 'auto-fix', 'ventilator');
      } else if (!oxygenCheck.needsHealing && prev.oxygenLevel.isHealing) {
        addDiagnostic('Oxygen level stabilized', 'normal', 'ventilator');
      } else if (newOxygenStatus !== prev.oxygenLevel.status) {
        if (newOxygenStatus === 'alert') {
          addDiagnostic('Oxygen level alert threshold reached', 'alert', 'ventilator');
        } else if (newOxygenStatus === 'emergency') {
          addDiagnostic('CRITICAL: Oxygen level emergency threshold exceeded', 'emergency', 'ventilator');
        } else if (newOxygenStatus === 'normal' && prev.oxygenLevel.status !== 'normal') {
          addDiagnostic('Oxygen level returned to normal range', 'normal', 'ventilator');
        }
      }
      
      // Calculate the overall device status
      const statuses = [newTempStatus, newPressureStatus, newOxygenStatus];
      const hasEmergency = statuses.includes('emergency');
      const newFirmwareStatus = hasEmergency ? 'unresponsive' : 'responsive';
      
      if (newFirmwareStatus !== prev.firmwareStatus) {
        if (newFirmwareStatus === 'unresponsive') {
          addDiagnostic('CRITICAL: Ventilator firmware unresponsive', 'emergency', 'ventilator');
        } else {
          addDiagnostic('Ventilator firmware responsive', 'normal', 'ventilator');
        }
      }
      
      return {
        temperature: {
          value: newTempValue,
          status: newTempStatus,
          isHealing: tempCheck.needsHealing,
          message: tempCheck.message
        },
        pressure: {
          value: newPressureValue,
          status: newPressureStatus,
          isHealing: pressureCheck.needsHealing,
          message: pressureCheck.message
        },
        oxygenLevel: {
          value: newOxygenValue,
          status: newOxygenStatus,
          isHealing: oxygenCheck.needsHealing,
          message: oxygenCheck.message
        },
        firmwareStatus: newFirmwareStatus
      };
    });
  }, [addDiagnostic]);
  
  // Update defibrillator metrics
  const updateDefibrillator = useCallback(() => {
    setDefibrillator(prev => {
      // Battery voltage
      const batteryCheck = checkDefibrillatorBatteryVoltage(prev.batteryVoltage);
      const newBatteryValue = simulateVentilatorMetric(
        prev.batteryVoltage.value,
        prev.batteryVoltage.status,
        batteryCheck.needsHealing,
        9,
        14,
        batteryCheck.targetValue
      );
      const newBatteryStatus = determineDefibrillatorBatteryStatus(newBatteryValue);
      
      // Check if healing status has changed
      if (batteryCheck.needsHealing && !prev.batteryVoltage.isHealing) {
        addDiagnostic(batteryCheck.message || 'Stabilizing battery voltage...', 'auto-fix', 'defibrillator');
      } else if (!batteryCheck.needsHealing && prev.batteryVoltage.isHealing) {
        addDiagnostic('Battery voltage stabilized', 'normal', 'defibrillator');
      } else if (newBatteryStatus !== prev.batteryVoltage.status) {
        if (newBatteryStatus === 'alert') {
          addDiagnostic('Battery voltage alert threshold reached', 'alert', 'defibrillator');
        } else if (newBatteryStatus === 'emergency') {
          addDiagnostic('CRITICAL: Battery voltage emergency threshold exceeded', 'emergency', 'defibrillator');
        } else if (newBatteryStatus === 'normal' && prev.batteryVoltage.status !== 'normal') {
          addDiagnostic('Battery voltage returned to normal range', 'normal', 'defibrillator');
        }
      }
      
      // ECG Signal - this one doesn't need healing
      const newEcgValue = simulateEcgSignal(prev.ecgSignal.value);
      const newEcgStatus = determineDefibrillatorEcgStatus(newEcgValue);
      
      if (newEcgStatus !== prev.ecgSignal.status) {
        if (newEcgStatus === 'alert') {
          addDiagnostic('ECG signal alert: Abnormal reading', 'alert', 'defibrillator');
        } else if (newEcgStatus === 'normal' && prev.ecgSignal.status !== 'normal') {
          addDiagnostic('ECG signal returned to normal range', 'normal', 'defibrillator');
        }
      }
      
      // Temperature
      const tempCheck = checkDefibrillatorTemperature(prev.temperature);
      const newTempValue = simulateVentilatorMetric(
        prev.temperature.value,
        prev.temperature.status,
        tempCheck.needsHealing,
        15,
        50,
        tempCheck.targetValue
      );
      const newTempStatus = determineDefibrillatorTemperatureStatus(newTempValue);
      
      // Check if healing status has changed
      if (tempCheck.needsHealing && !prev.temperature.isHealing) {
        addDiagnostic(tempCheck.message || 'Adjusting temperature...', 'auto-fix', 'defibrillator');
      } else if (!tempCheck.needsHealing && prev.temperature.isHealing) {
        addDiagnostic('Temperature stabilized', 'normal', 'defibrillator');
      } else if (newTempStatus !== prev.temperature.status) {
        if (newTempStatus === 'alert') {
          addDiagnostic('Temperature alert threshold reached', 'alert', 'defibrillator');
        } else if (newTempStatus === 'emergency') {
          addDiagnostic('CRITICAL: Temperature emergency threshold exceeded', 'emergency', 'defibrillator');
        } else if (newTempStatus === 'normal' && prev.temperature.status !== 'normal') {
          addDiagnostic('Temperature returned to normal range', 'normal', 'defibrillator');
        }
      }
      
      // Calculate capacitor readiness
      const statuses = [newBatteryStatus, newTempStatus];
      const isReady = !statuses.includes('emergency') && !statuses.includes('alert');
      const newCapacitorReadiness = isReady ? 'ready' : 'not-ready';
      
      if (newCapacitorReadiness !== prev.capacitorReadiness) {
        if (newCapacitorReadiness === 'ready') {
          addDiagnostic('Defibrillator capacitor ready', 'normal', 'defibrillator');
        } else {
          addDiagnostic('Defibrillator capacitor not ready', 'alert', 'defibrillator');
        }
      }
      
      return {
        batteryVoltage: {
          value: newBatteryValue,
          status: newBatteryStatus,
          isHealing: batteryCheck.needsHealing,
          message: batteryCheck.message
        },
        ecgSignal: {
          value: newEcgValue,
          status: newEcgStatus,
          isHealing: false,
          message: null
        },
        temperature: {
          value: newTempValue,
          status: newTempStatus,
          isHealing: tempCheck.needsHealing,
          message: tempCheck.message
        },
        capacitorReadiness: newCapacitorReadiness
      };
    });
  }, [addDiagnostic]);
  
  // Simulation effect
  useEffect(() => {
    // Add initial diagnostic messages
    addDiagnostic('Systems initialized', 'normal', 'ventilator');
    addDiagnostic('Systems initialized', 'normal', 'defibrillator');
    
    // Set up simulation interval
    const interval = setInterval(() => {
      updateVentilator();
      updateDefibrillator();
    }, SIMULATION_INTERVAL);
    
    return () => clearInterval(interval);
  }, [addDiagnostic, updateVentilator, updateDefibrillator]);
  
  return {
    ventilator,
    defibrillator,
    diagnostics
  };
};