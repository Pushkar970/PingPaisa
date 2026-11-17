import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '@/src/theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function GradientButton({ title, onPress, loading, disabled, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.container,
        pressed && { transform: [{ scale: 0.97 }] },
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
    >
      <LinearGradient
        colors={colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: borderRadius.md, overflow: 'hidden' },
  gradient: { paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.md },
  text: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
