import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '@/src/context/AuthContext';
import GradientButton from '@/src/components/GradientButton';
import { colors, spacing, borderRadius } from '@/src/theme';
import { getErrorMessage } from '@/src/api/customFetch';

export default function LoginScreen() {
  const router = useRouter();
  const { login, setTokenAndLoad } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = useCallback(async () => {
    if (!email?.trim() || !password?.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      router.replace('/tabs/home');
    } catch (e) {
      setError(getErrorMessage(e, 'Login failed'));
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  const handleGoogleSSO = useCallback(async () => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
      let redirectUri: string;
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        redirectUri = `${window.location.origin}/auth/callback`;
      } else {
        redirectUri = AuthSession.makeRedirectUri();
      }
      const googleUrl = `${baseUrl}/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;

      if (Platform.OS === 'web') {
        // Google refuses to load inside an iframe (the embedded preview) and answers 403,
        // so break out to a new tab when we are framed.
        let framed = false;
        try {
          framed = window.self !== window.top;
        } catch {
          framed = true;
        }
        if (framed) {
          const opened = window.open(googleUrl, '_blank');
          if (!opened) {
            try {
              if (window.top) window.top.location.href = googleUrl;
            } catch {
              setError('Please allow pop-ups to sign in with Google, or open the app in a new tab.');
            }
          }
        } else {
          window.location.href = googleUrl;
        }
      } else {
        const result = await WebBrowser.openAuthSessionAsync(googleUrl, redirectUri);
        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const token = url.searchParams.get('token');
          const err = url.searchParams.get('error');
          if (err) {
            setError(err);
          } else if (token) {
            await setTokenAndLoad(token);
            router.replace('/tabs/home');
          }
        }
      }
    } catch (e) {
      setError(getErrorMessage(e, 'Google sign-in failed'));
    }
  }, [setTokenAndLoad]);

  const handleBiometric = useCallback(async () => {
    if (Platform.OS === 'web') return;
    try {
      const SecureStore = require('expo-secure-store');
      const LocalAuth = require('expo-local-authentication');
      const storedToken = await SecureStore.getItemAsync('biometric_token');
      if (!storedToken) {
        Alert.alert('Biometric Login', 'No saved session. Please log in with your credentials first.');
        return;
      }
      const hasHardware = await LocalAuth.hasHardwareAsync();
      if (!hasHardware) return;
      const result = await LocalAuth.authenticateAsync({ promptMessage: 'Authenticate to log in' });
      if (result.success) {
        await setTokenAndLoad(storedToken);
        router.replace('/tabs/home');
      }
    } catch {
      setError('Biometric authentication failed');
    }
  }, [setTokenAndLoad]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={64} color={colors.primary} />
        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.subtitle}>Track your spending, save smarter</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoComplete="password"
        />
        <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.muted} />
        </Pressable>
      </View>

      <GradientButton title="Log In" onPress={handleLogin} loading={loading} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable style={({ pressed }) => [styles.googleButton, pressed && { transform: [{ scale: 0.97 }] }]} onPress={handleGoogleSSO}>
        <View style={styles.googleGradient}>
          <Ionicons name="logo-google" size={20} color="#EA4335" />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </View>
      </Pressable>

      {Platform.OS !== 'web' && (
        <Pressable style={styles.biometricButton} onPress={handleBiometric}>
          <Ionicons name="finger-print" size={24} color={colors.primary} />
          <Text style={styles.biometricText}>Biometric Login</Text>
        </Pressable>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable onPress={() => router.push('/auth/signup')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  content: { padding: spacing.lg, paddingTop: 80 },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { color: colors.heading, fontSize: 28, fontWeight: '700', marginTop: spacing.md },
  subtitle: { color: colors.muted, fontSize: 16, marginTop: spacing.xs },
  error: { color: colors.error, fontSize: 14, textAlign: 'center', marginBottom: spacing.md },
  inputContainer: { marginBottom: spacing.md, position: 'relative' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: colors.heading,
    fontSize: 16,
  },
  eyeButton: { position: 'absolute', right: 12, top: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder },
  dividerText: { color: colors.muted, marginHorizontal: spacing.md, fontSize: 14 },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: borderRadius.md,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  googleGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  googleText: { color: colors.heading, fontSize: 16, fontWeight: '600' as const },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: 12,
    gap: spacing.sm,
  },
  biometricText: { color: colors.primary, fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { color: colors.muted, fontSize: 14 },
  footerLink: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
