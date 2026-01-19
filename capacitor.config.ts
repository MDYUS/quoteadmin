
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amazinterior.crm',
  appName: 'Amaz Interior CRM',
  webDir: 'dist',
  // NOTE: Server URL is commented out to force the app to use the local 'dist' bundle.
  // This ensures the APK uses the fixed index.html (without importmap) instead of the potentially broken live site.
  // server: {
  //   url: 'https://crmhead.amazmodularinterior.com/',
  //   allowNavigation: ['crmhead.amazmodularinterior.com']
  // },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
