import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '@/src/context/AuthContext';
import GradientButton from '@/src/components/GradientButton';
import { colors, spacing, borderRadius } from '@/src/theme';
import { getErrorMessage } from '@/src/api/customFetch';

export default function SignupScreen() {
  const { signup, setTokenAndLoad } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = useCallback(async () => {
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signup(email.trim(), password, name.trim());
    } catch (e) {
      setError(getErrorMessage(e, 'Sign up failed'));
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirmPassword, signup]);

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
          }
        }
      }
    } catch (e) {
      setError(getErrorMessage(e, 'Google sign-in failed'));
    }
  }, [setTokenAndLoad]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={64} color={colors.primary} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start tracking your expenses today</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999999"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999999"
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
          placeholderTextColor="#999999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoComplete="new-password"
        />
        <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.muted} />
        </Pressable>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          autoComplete="new-password"
        />
        <Pressable style={styles.eyeButton} onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color={colors.muted} />
        </Pressable>
      </View>

      <GradientButton title="Sign Up" onPress={handleSignup} loading={loading} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable style={({ pressed }) => [styles.googleButton, pressed && { transform: [{ scale: 0.97 }] }]} onPress={handleGoogleSSO}>
        <LinearGradient colors={colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.googleGradient}>
          <Ionicons name="logo-google" size={20} color={colors.white} />
          <Text style={styles.googleText}>Sign up with Google</Text>
        </LinearGradient>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={styles.footerLink}>Log In</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  content: { padding: spacing.lg, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { color: colors.heading, fontSize: 28, fontWeight: '700', marginTop: spacing.md },
  subtitle: { color: colors.muted, fontSize: 16, marginTop: spacing.xs },
  error: { color: colors.error, fontSize: 14, textAlign: 'center', marginBottom: spacing.md },
  inputContainer: { marginBottom: spacing.md, position: 'relative' as const },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeButton: { position: 'absolute' as const, right: 12, top: 14 },
  divider: { flexDirection: 'row' as const, alignItems: 'center' as const, marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder },
  dividerText: { color: colors.muted, marginHorizontal: spacing.md, fontSize: 14 },
  googleButton: { borderRadius: borderRadius.md, overflow: 'hidden' as const },
  googleGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  googleText: { color: colors.white, fontSize: 16, fontWeight: '600' as const },
  footer: { flexDirection: 'row' as const, justifyContent: 'center' as const, marginTop: spacing.xl },
  footerText: { color: colors.muted, fontSize: 14 },
  footerLink: { color: colors.primary, fontSize: 14, fontWeight: '600' as const },
});
