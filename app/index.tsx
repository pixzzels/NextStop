import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        NextStop
      </Text>

      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          opacity: 0.75,
        }}
      >
        Shared trip planning, packing, costs, and what&apos;s next.
      </Text>
    </View>
  );
}