import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "@/theme";

import { useCreateTripMutation } from "@/features/trips/tripMutations";

function isValidDateInput(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default function CreateTripScreen() {
  const router = useRouter();
  const createTripMutation = useCreateTripMutation();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreateTrip() {
    const normalizedTitle = title.trim();
    const normalizedDestination = destination.trim();
    const normalizedStartDate = startDate.trim();
    const normalizedEndDate = endDate.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      Alert.alert("Missing trip name", "Enter a name for this trip.");
      return;
    }

    if (!isValidDateInput(normalizedStartDate)) {
      Alert.alert("Invalid start date", "Use YYYY-MM-DD format.");
      return;
    }

    if (!isValidDateInput(normalizedEndDate)) {
      Alert.alert("Invalid end date", "Use YYYY-MM-DD format.");
      return;
    }

    if (normalizedEndDate < normalizedStartDate) {
      Alert.alert("Invalid date range", "End date cannot be before start date.");
      return;
    }

    try {
      await createTripMutation.mutateAsync({
        title: normalizedTitle,
        destination: normalizedDestination,
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        description: normalizedDescription,
        timezone: "UTC",
      });

      router.replace("/trips");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The trip could not be created.";

      Alert.alert("Could not create trip", message);
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        padding: theme.spacing.xl,
        paddingTop: 72,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        style={{
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Back
        </Text>
      </Pressable>

      <Text
        style={{
          fontSize: 32,
          fontWeight: "800",
          marginBottom: theme.spacing.sm,
        }}
      >
        Create trip
      </Text>

      <Text
        style={{
          fontSize: 16,
          opacity: 0.7,
          marginBottom: 32,
          lineHeight: 22,
        }}
      >
        Start with the basics. You can add itinerary items, ideas, packing, and
        costs after the trip is created.
      </Text>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>
          Trip name
        </Text>
        <TextInput
          placeholder="Hawaii 2026"
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: 14,
            fontSize: 16,
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>
          Destination
        </Text>
        <TextInput
          placeholder="Oahu, Hawaii"
          value={destination}
          onChangeText={setDestination}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: 14,
            fontSize: 16,
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>
          Start date
        </Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
          autoCapitalize="none"
          keyboardType="numbers-and-punctuation"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: 14,
            fontSize: 16,
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>
          End date
        </Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
          autoCapitalize="none"
          keyboardType="numbers-and-punctuation"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: 14,
            fontSize: 16,
          }}
        />
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 8 }}>
          Description
        </Text>
        <TextInput
          placeholder="Optional notes about the trip"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: 14,
            fontSize: 16,
            minHeight: 96,
          }}
        />
      </View>

      <Pressable
        disabled={createTripMutation.isPending}
        onPress={handleCreateTrip}
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 14,
          padding: 16,
          alignItems: "center",
          opacity: createTripMutation.isPending ? 0.7 : 1,
        }}
      >
        {createTripMutation.isPending ? (
          <ActivityIndicator color={theme.colors.textInverse} />
        ) : (
          <Text
            style={{
              color:theme.colors.textInverse,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Create trip
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}