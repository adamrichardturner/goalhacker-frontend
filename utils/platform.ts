import { Capacitor } from '@capacitor/core'

export const getPlatform = () => {
  if (Capacitor.isNativePlatform()) {
    return Capacitor.getPlatform()
  }
  return 'web'
}
