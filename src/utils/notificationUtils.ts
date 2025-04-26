import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const EMAIL_SERVICE_ID = 'service_your_id';
const EMAIL_TEMPLATE_ID = 'template_your_id';
const EMAIL_PUBLIC_KEY = 'your_public_key';

interface NotificationData {
  deviceName: string;
  issue: string;
  timestamp: string;
}

export const sendNotifications = async (data: NotificationData) => {
  try {
    // Send email notification
    await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      {
        to_email: 'anoushka.explore@gmail.com',
        device_name: data.deviceName,
        issue: data.issue,
        timestamp: data.timestamp,
      },
      EMAIL_PUBLIC_KEY
    );

    // Send WhatsApp notification via direct link
    const whatsappMessage = `🚨 ICU Alert:\n\nDevice: ${data.deviceName}\nIssue: ${data.issue}\nTime: ${data.timestamp}`;
    
    // Using your provided WhatsApp ID
    const whatsappUrl = `https://wa.me/qr/OX5MMRSEU4ULM1?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show toast notification
    toast.error(`${data.deviceName} Alert`, {
      description: data.issue,
      duration: 5000,
    });
    
  } catch (error) {
    console.error('Failed to send notifications:', error);
    toast.error('Failed to send notifications', {
      description: 'Please check the console for more details.',
    });
  }
};