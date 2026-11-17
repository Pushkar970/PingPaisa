import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import { pushTokensControllerRegister } from '@/src/api/generated/api';

// Configure foreground display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications(isAuthenticated: boolean) {
  const router = useRouter();
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const registerForPush = useCallback(async () => {
    // Only on physical devices, skip web
    if (Platform.OS === 'web' || !Device.isDevice) return;

    try {
      // Check / request permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      // Get native device token
      const { data: token } = await Notifications.getDevicePushTokenAsync();
      if (!token) return;

      // Register with backend — only ios/android are valid
      const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';
      await pushTokensControllerRegister({ token, deviceType: deviceType as any });
    } catch (e) {
      // Silently ignore push registration errors
      console.warn('Push registration failed:', e);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    registerForPush();

    // Set up Android notification channel
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    // Handle notification taps — navigate to the screen in data
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response?.notification?.request?.content?.data;
        const screen = (data as any)?.screen;
        if (screen && typeof screen === 'string') {
          try {
            router.push(screen as any);
          } catch {
            // ignore navigation errors
          }
        }
      },
    );

    return () => {
      responseListener.current?.remove();
    };
  }, [isAuthenticated, registerForPush, router]);
}
