import { MetricData, DeviceStatus } from '../types';

// Healing target values
const HEALING_TARGETS = {
  ventilator: {
    temperature: { min: 25, max: 35 },
    pressure: { min: 15, max: 25 },
    oxygenLevel: { min: 94, max: 98 }
  },
  defibrillator: {
    batteryVoltage: { min: 12, max: 13.5 },
    temperature: { min: 25, max: 35 }
  }
};

// Healing messages
const HEALING_MESSAGES = {
  ventilator: {
    temperature: {
      high: 'Activating internal cooling system...',
      low: 'Increasing warming elements...'
    },
    pressure: {
      high: 'Reducing pressure gradually...',
      low: 'Increasing pressure to optimal levels...'
    },
    oxygenLevel: {
      low: 'Adjusting oxygen flow rate...'
    }
  },
  defibrillator: {
    batteryVoltage: {
      low: 'Activating backup power source...'
    },
    temperature: {
      high: 'Initiating cooling protocol...',
      low: 'Warming internal components...'
    }
  }
};

// Check if a metric needs healing and prepare healing data
export const checkVentilatorTemperature = (
  metric: MetricData
): { needsHealing: boolean; targetValue: number; message: string | null } => {
  if (metric.status === 'emergency') {
    return { needsHealing: false, targetValue: metric.value, message: null };
  }
  
  const { min, max } = HEALING_TARGETS.ventilator.temperature;
  
  if (metric.value > max) {
    return {
      needsHealing: true,
      targetValue: (max + min) / 2,
      message: HEALING_MESSAGES.ventilator.temperature.high
    };
  }
  
  if (metric.value < min) {
    return {
      needsHealing: true,
      targetValue: (max + min) / 2,
      message: HEALING_MESSAGES.ventilator.temperature.low
    };
  }
  
  return { needsHealing: false, targetValue: metric.value, message: null };
};

export const checkVentilatorPressure = (
  metric: MetricData
): { needsHealing: boolean; targetValue: number; message: string | null } => {
  if (metric.status === 'emergency') {
    return { needsHealing: false, targetValue: metric.value, message: null };
  }
  
  const { min, max } = HEALING_TARGETS.ventilator.pressure;
  
  if (metric.value > max) {
    return {
      needsHealing: true,
      targetValue: (max + min) / 2,
      message: HEALING_MESSAGES.ventilator.pressure.high
    };
  }
  
  if (metric.value < min) {
    return {
      needsHealing: true,
      targetValue: (max + min) / 2,
      message: HEALING_MESSAGES.ventilator.pressure.low
    };
  }
  
  return { needsHealing: false, targetValue: metric.value, message: null };
};

export const checkVentilatorOxygenLevel = (
  metric: MetricData
): { needsHealing: boolean; targetValue: number; message: string | null } => {
  if (metric.status === 'emergency') {
    return { needsHealing: false, targetValue: metric.value, message: null };
  }
  
  const { min, max } = HEALING_TARGETS.ventilator.oxygenLevel;
  
  if (metric.value < min) {
    return {
      needsHealing: true,
      targetValue: (max + min) / 2,
      message: HEALING_MESSAGES.ventilator.oxygenLevel.low
    };
  }
  
  return { needsHealing: false, targetValue: metric.value, message: null };
};

export const checkDefibrillatorBatteryVoltage = (
  metric: MetricData
): { needsHealing: boolean; targetValue: number; message: string | null } => {
  if (metric.status === 'emergency') {
    return { needsHealing: false, targetValue: metric.value, message: null };
  }
  
  const { min, max } = HEALING_TARGETS.defibrillator.batteryVoltage;
  
  if (metric.value < min) {
    return {
      needsHealing: true,
      targetValue: (max + min) / 2,
      message: HEALING_MESSAGES.defibrillator.batteryVoltage.low
    };
  }
  
  return { needsHealing: false, targetValue: metric.value, message: null };
};

export const checkDefibrillatorTemperature = (
  metric: MetricData
): { needsHealing: boolean; targetValue: number; message: string | null } => {
  if (metric.status === 'emergency') {
    return { needsHealing: false, targetValue: metric.value, message: null };
  }
  
  const { min, max } = HEALING_TARGETS.defibrillator.temperature;
  
  if (metric.value > max) {
    return {
      needsHealing: true,
      targetValue: (max + min) / 2,
      message: HEALING_MESSAGES.defibrillator.temperature.high
    };
  }
  
  if (metric.value < min) {
    return {
      needsHealing: true,
      targetValue: (max + min) / 2,
      message: HEALING_MESSAGES.defibrillator.temperature.low
    };
  }
  
  return { needsHealing: false, targetValue: metric.value, message: null };
};