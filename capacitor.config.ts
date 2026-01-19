
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amazinterior.crm',
  appName: 'Amaz Interior CRM',
  webDir: 'dist',
  server: {
    // This points the app to your live website
    url: 'https://crmhead.amazmodularinterior.com/',
    allowNavigation: ['crmhead.amazmodularinterior.com', 'res.cloudinary.com', 'pub-388f7f768ada498397e23af82c423ace.r2.dev']
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
