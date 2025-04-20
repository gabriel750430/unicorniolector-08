
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b7c71a89bc3f4f91a063782dca0f8ed9',
  appName: 'UnicornioLector',
  webDir: 'dist',
  server: {
    url: 'https://b7c71a89-bc3f-4f91-a063-782dca0f8ed9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000
    }
  }
};

export default config;
