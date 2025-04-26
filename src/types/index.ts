export type DeviceStatus = 'normal' | 'auto-fix' | 'alert' | 'emergency';

export type DiagnosticMessage = {
  id: string;
  timestamp: Date;
  message: string;
  status: DeviceStatus;
  device: 'ventilator' | 'defibrillator';
};

export type MetricData = {
  value: number;
  status: DeviceStatus;
  isHealing: boolean;
  message: string | null;
};

export type VentilatorMetrics = {
  temperature: MetricData;
  pressure: MetricData;
  oxygenLevel: MetricData;
  firmwareStatus: 'responsive' | 'unresponsive';
};

export type DefibrillatorMetrics = {
  batteryVoltage: MetricData;
  ecgSignal: MetricData;
  temperature: MetricData;
  capacitorReadiness: 'ready' | 'not-ready';
};