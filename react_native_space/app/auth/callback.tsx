import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { colors, spacing } from '@/src/theme';

export default function CallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string; error?: string }>();
  const { setTokenAndLoad } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const redirectToLogin = () => {
      timer = setTimeout(() => {
        if (active) router.replace('/auth/login');
      }, 2000);
    };

    const processCallback = async () => {
      try {
        let token: string | null = typeof params.token === 'string' ? params.token : null;
        let err: string | null = typeof params.error === 'string' ? params.error : null;

        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const searchParams = new URLSearchParams(window.location.search);
          token = token ?? searchParams.get('token');
          err = err ?? searchParams.get('error');
        }

        if (err) {
          if (active) setError(err);
          redirectToLogin();
          return;
        }

        if (token) {
          await setTokenAndLoad(token);
          if (active) router.replace('/tabs/home');
        } else {
          if (active) setError('No authentication token received');
          redirectToLogin();
        }
      } catch {
        if (active) setError('Authentication failed');
        redirectToLogin();
      }
    };
    processCallback();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [params.token, params.error, router, setTokenAndLoad]);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.text}>Signing you in...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.base },
  text: { color: colors.body, marginTop: spacing.md, fontSize: 16 },
  error: { color: colors.error, fontSize: 16 },
});
