
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unicornio.lector',
  appName: 'Unicornio Lector',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#a78bfa',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  android: {
    buildOptions: {
      minSdkVersion: 22,
      targetSdkVersion: 33,
      versionCode: 1,
      versionName: "1.0.0",
      keystoreAlias: "unicorniolector",
      keystorePassword: "unicorniolector",
      packageName: "com.unicornio.lector"
    }
  }
};

export default config;
