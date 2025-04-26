import { DeviceStatus, MetricData, VentilatorMetrics, DefibrillatorMetrics } from '../types';
import { sendNotifications } from './notificationUtils';

// Helper to get a random number within a range with organic fluctuation
export const getRandomValue = (min: number, max: number, decimals = 1): number => {
  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(decimals));
};

// Helper to determine status based on thresholds with notification triggers
export const determineVentilatorTemperatureStatus = (value: number, prevStatus: DeviceStatus): DeviceStatus => {
  const newStatus = value > 40 ? 'emergency' :
                   value > 38 ? 'alert' :
                   value < 20 ? 'alert' : 'normal';
  
  if (newStatus !== prevStatus && (newStatus === 'emergency' || newStatus === 'alert')) {
    const timestamp = new Date().toLocaleTimeString();
    sendNotifications({
      deviceName: 'Ventilator',
      issue: `Temperature ${newStatus === 'emergency' ? 'CRITICAL' : 'Warning'}: ${value}°C`,
      timestamp
    });
  }
  
  return newStatus;
};

export const determineVentilatorPressureStatus = (value: number, prevStatus: DeviceStatus): DeviceStatus => {
  const newStatus = value > 40 ? 'emergency' :
                   value > 35 ? 'alert' :
                   value < 5 ? 'alert' : 'normal';
  
  if (newStatus !== prevStatus && (newStatus === 'emergency' || newStatus === 'alert')) {
    const timestamp = new Date().toLocaleTimeString();
    sendNotifications({
      deviceName: 'Ventilator',
      issue: `Pressure ${newStatus === 'emergency' ? 'CRITICAL' : 'Warning'}: ${value} cmH₂O`,
      timestamp
    });
  }
  
  return newStatus;
};

export const determineVentilatorOxygenStatus = (value: number, prevStatus: DeviceStatus): DeviceStatus => {
  const newStatus = value < 85 ? 'emergency' :
                   value < 90 ? 'alert' : 'normal';
  
  if (newStatus !== prevStatus && (newStatus === 'emergency' || newStatus === 'alert')) {
    const timestamp = new Date().toLocaleTimeString();
    sendNotifications({
      deviceName: 'Ventilator',
      issue: `Oxygen Level ${newStatus === 'emergency' ? 'CRITICAL' : 'Warning'}: ${value}%`,
      timestamp
    });
  }
  
  return newStatus;
};

export const determineDefibrillatorBatteryStatus = (value: number, prevStatus: DeviceStatus): DeviceStatus => {
  const newStatus = value < 10 ? 'emergency' :
                   value < 11 ? 'alert' : 'normal';
  
  if (newStatus !== prevStatus && (newStatus === 'emergency' || newStatus === 'alert')) {
    const timestamp = new Date().toLocaleTimeString();
    sendNotifications({
      deviceName: 'Defibrillator',
      issue: `Battery ${newStatus === 'emergency' ? 'CRITICAL' : 'Warning'}: ${value}V`,
      timestamp
    });
  }
  
  return newStatus;
};

export const determineDefibrillatorEcgStatus = (value: number, prevStatus: DeviceStatus): DeviceStatus => {
  const newStatus = Math.abs(value) > 1 ? 'alert' : 'normal';
  
  if (newStatus !== prevStatus && newStatus === 'alert') {
    const timestamp = new Date().toLocaleTimeString();
    sendNotifications({
      deviceName: 'Defibrillator',
      issue: `ECG Signal Abnormal: ${value}mV`,
      timestamp
    });
  }
  
  return newStatus;
};

export const determineDefibrillatorTemperatureStatus = (value: number, prevStatus: DeviceStatus): DeviceStatus => {
  const newStatus = value > 45 ? 'emergency' :
                   value > 40 ? 'alert' :
                   value < 20 ? 'alert' : 'normal';
  
  if (newStatus !== prevStatus && (newStatus === 'emergency' || newStatus === 'alert')) {
    const timestamp = new Date().toLocaleTimeString();
    sendNotifications({
      deviceName: 'Defibrillator',
      issue: `Temperature ${newStatus === 'emergency' ? 'CRITICAL' : 'Warning'}: ${value}°C`,
      timestamp
    });
  }
  
  return newStatus;
};

// Simulate next data points with organic fluctuations
export const simulateVentilatorMetric = (
  currentValue: number, 
  status: DeviceStatus,
  isHealing: boolean,
  min: number, 
  max: number, 
  targetValue?: number,
  shouldSpike = false
): number => {
  // If healing, move towards the target value with organic movement
  if (isHealing && targetValue !== undefined) {
    const progress = (targetValue - currentValue) * 0.2;
    const organicNoise = (Math.random() - 0.5) * 0.1;
    return Number((currentValue + progress + organicNoise).toFixed(1));
  }
  
  // Simulate critical failure with sudden spike
  if (shouldSpike) {
    const spikeDirection = Math.random() > 0.5 ? 1 : -1;
    const spikeAmount = (max - min) * 0.3;
    return Number(Math.max(min, Math.min(max, currentValue + (spikeAmount * spikeDirection))).toFixed(1));
  }
  
  // Normal organic fluctuation
  const baseFluctuation = (max - min) * (status === 'normal' ? 0.02 : 0.04);
  const organicNoise = Math.sin(Date.now() / 1000) * baseFluctuation * 0.3;
  const randomWalk = (Math.random() - 0.5) * baseFluctuation;
  
  const newValue = currentValue + randomWalk + organicNoise;
  return Number(Math.max(min, Math.min(max, newValue)).toFixed(1));
};

export const simulateEcgSignal = (currentValue: number, shouldSpike = false): number => {
  if (shouldSpike) {
    const spikeValue = Math.random() > 0.5 ? 1.8 : -1.8;
    return Number(spikeValue.toFixed(2));
  }
  
  // Simulate more realistic ECG-like patterns
  const baseSignal = Math.sin(Date.now() / 500) * 0.5;
  const noise = (Math.random() - 0.5) * 0.2;
  const newValue = baseSignal + noise;
  
  return Number(Math.max(-1.5, Math.min(1.5, newValue)).toFixed(2));
};

// Initial data generators with more realistic starting values
export const generateInitialVentilatorMetrics = (): VentilatorMetrics => ({
  temperature: {
    value: getRandomValue(35, 37),
    status: 'normal',
    isHealing: false,
    message: null
  },
  pressure: {
    value: getRandomValue(15, 25),
    status: 'normal',
    isHealing: false,
    message: null
  },
  oxygenLevel: {
    value: getRandomValue(95, 98),
    status: 'normal',
    isHealing: false,
    message: null
  },
  firmwareStatus: 'responsive'
});

export const generateInitialDefibrillatorMetrics = (): DefibrillatorMetrics => ({
  batteryVoltage: {
    value: getRandomValue(12.5, 13.5),
    status: 'normal',
    isHealing: false,
    message: null
  },
  ecgSignal: {
    value: getRandomValue(-0.5, 0.5),
    status: 'normal',
    isHealing: false,
    message: null
  },
  temperature: {
    value: getRandomValue(35, 37),
    status: 'normal',
    isHealing: false,
    message: null
  },
  capacitorReadiness: 'ready'
});