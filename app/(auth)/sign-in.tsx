import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "@/theme";

import { supabase } from "@/lib/supabase";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert("Missing information", "Enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      Alert.alert("Could not sign in", error.message);
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: theme.spacing.xl,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "800",
          marginBottom: theme.spacing.sm,
        }}
      >
        Welcome back
      </Text>

      <Text
        style={{
          fontSize: 16,
          opacity: 0.7,
          marginBottom: 32,
        }}
      >
        Sign in to continue planning your trip.
      </Text>

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: 14,
          marginBottom: 12,
          fontSize: 16,
        }}
      />

      <TextInput
        autoCapitalize="none"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: 14,
          marginBottom: 20,
          fontSize: 16,
        }}
      />

      <Pressable
        disabled={isSubmitting}
        onPress={handleSignIn}
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radius.md,
          padding: 16,
          alignItems: "center",
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? (
          <ActivityIndicator color={theme.colors.textInverse} />
        ) : (
          <Text
            style={{
              color: theme.colors.textInverse,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Sign in
          </Text>
        )}
      </Pressable>

      <View
        style={{
          marginTop: 24,
          alignItems: "center",
        }}
      >
        <Link href="/sign-up">
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Need an account? Sign up
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}