import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { colors, spacing } from '@/src/theme';

export default function CallbackScreen() {
  const router = useRouter();
  const { setTokenAndLoad } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        let token: string | null = null;
        let err: string | null = null;

        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          token = params.get('token');
          err = params.get('error');
        }

        if (err) {
          setError(err);
          setTimeout(() => router.replace('/auth/login'), 2000);
          return;
        }

        if (token) {
          await setTokenAndLoad(token);
          router.replace('/tabs/home');
        } else {
          setError('No authentication token received');
          setTimeout(() => router.replace('/auth/login'), 2000);
        }
      } catch {
        setError('Authentication failed');
        setTimeout(() => router.replace('/auth/login'), 2000);
      }
    };
    processCallback();
  }, []);

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
