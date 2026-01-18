
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amazinterior.crm',
  appName: 'Amaz Interior CRM',
  webDir: 'dist',
  server: {
    url: 'https://crmhead.amazmodularinterior.com/',
    allowNavigation: ['crmhead.amazmodularinterior.com']
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
