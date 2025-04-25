
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unicornio.lector',
  appName: 'Unicornio Lector',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'https://b7c71a89-bc3f-4f91-a063-782dca0f8ed9.lovableproject.com?forceHideBadge=true'
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
