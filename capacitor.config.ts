
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unicornio.lector',
  appName: 'Unicornio Lector',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000
    }
  },
  android: {
    buildOptions: {
      minSdkVersion: 22,
      targetSdkVersion: 33,
      versionCode: 1,
      versionName: "1.0.0"
    }
  }
};

export default config;
