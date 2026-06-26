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

export default function SignUpScreen() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp() {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedDisplayName = displayName.trim();

    if (!normalizedDisplayName || !normalizedEmail || !password) {
      Alert.alert("Missing information", "Enter your name, email, and password.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Password too short", "Use at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          display_name: normalizedDisplayName,
        },
      },
    });

    setIsSubmitting(false);

    if (error) {
      Alert.alert("Could not sign up", error.message);
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
        Create account
      </Text>

      <Text
        style={{
          fontSize: 16,
          opacity: 0.7,
          marginBottom: 32,
        }}
      >
        Start planning your next trip with your group.
      </Text>

      <TextInput
        autoCapitalize="words"
        placeholder="Name"
        value={displayName}
        onChangeText={setDisplayName}
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
        onPress={handleSignUp}
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
            Sign up
          </Text>
        )}
      </Pressable>

      <View
        style={{
          marginTop: 24,
          alignItems: "center",
        }}
      >
        <Link href="/sign-in">
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Already have an account? Sign in
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}