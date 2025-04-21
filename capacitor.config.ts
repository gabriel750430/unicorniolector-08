
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unicornio.lector',
  appName: 'Unicornio Lector',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000
    }
  }
};

export default config;

