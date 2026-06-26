import { Alert, Pressable, Text, View } from "react-native";

import { supabase } from "@/lib/supabase";

export default function TripsScreen() {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Could not sign out", error.message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        paddingTop: 72,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        Trips
      </Text>

      <Text
        style={{
          fontSize: 16,
          opacity: 0.7,
          marginBottom: 32,
        }}
      >
        Your trips will show up here.
      </Text>

      <Pressable
        onPress={handleSignOut}
        style={{
          borderWidth: 1,
          borderColor: "#d4d4d8",
          borderRadius: 12,
          padding: 16,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Sign out
        </Text>
      </Pressable>
    </View>
  );
}