import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'io.goalhacker.app',
  appName: 'Goal Hacker',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#744afc',
    },
    App: {
      url: 'goalhacker.app',
      androidScheme: 'https',
    },
  },
}

export default config
