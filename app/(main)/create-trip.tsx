import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { TripDateRangePicker } from "@/features/trips/components/TripDateRangePicker";
import { useCreateTripMutation } from "@/features/trips/tripMutations";
import { theme } from "@/theme";
import { formatDateInput, isValidDateInput } from "@/utils/dateInput";

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
    <KeyboardAvoidingView
      behavior={Platform.select({
        ios: "padding",
        android: "height",
      })}
      keyboardVerticalOffset={Platform.select({
        ios: 24,
        android: 0,
      })}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          padding: theme.spacing.xl,
          paddingTop: theme.spacing["4xl"],
          paddingBottom: 140,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text
            style={{
              ...theme.typography.bodyStrong,
              color: theme.colors.textPrimary,
            }}
          >
            Back
          </Text>
        </Pressable>

        <Text
          style={{
            ...theme.typography.titleLarge,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Create trip
        </Text>

        <Text
          style={{
            ...theme.typography.body,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing["2xl"],
            lineHeight: 24,
          }}
        >
          Start with the basics. You can add itinerary items, ideas, packing, and
          costs after the trip is created.
        </Text>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              ...theme.typography.captionStrong,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}
          >
            Trip name
          </Text>
          <TextInput
            placeholder="Hawaii 2026"
            placeholderTextColor={theme.colors.textMuted}
            value={title}
            onChangeText={setTitle}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              fontSize: 16,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
            }}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              ...theme.typography.captionStrong,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}
          >
            Destination
          </Text>
          <TextInput
            placeholder="Oahu, Hawaii"
            placeholderTextColor={theme.colors.textMuted}
            value={destination}
            onChangeText={setDestination}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              fontSize: 16,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
            }}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              ...theme.typography.captionStrong,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}
          >
            Dates
          </Text>

          <TripDateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              ...theme.typography.captionStrong,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}
          >
            Start date
          </Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textMuted}
            value={startDate}
            onChangeText={(value) => setStartDate(formatDateInput(value))}
            autoCapitalize="none"
            keyboardType="number-pad"
            maxLength={10}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              fontSize: 16,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
            }}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              ...theme.typography.captionStrong,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}
          >
            End date
          </Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textMuted}
            value={endDate}
            onChangeText={(value) => setEndDate(formatDateInput(value))}
            autoCapitalize="none"
            keyboardType="number-pad"
            maxLength={10}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              fontSize: 16,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
            }}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              ...theme.typography.captionStrong,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}
          >
            Description
          </Text>
          <TextInput
            placeholder="Optional notes about the trip"
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              fontSize: 16,
              minHeight: 96,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
            }}
          />
        </View>

        <Pressable
          disabled={createTripMutation.isPending}
          onPress={handleCreateTrip}
          style={{
            backgroundColor: createTripMutation.isPending
              ? theme.colors.primaryDisabled
              : theme.colors.primary,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            alignItems: "center",
            marginBottom: theme.spacing["2xl"],
          }}
        >
          {createTripMutation.isPending ? (
            <ActivityIndicator color={theme.colors.textInverse} />
          ) : (
            <Text
              style={{
                ...theme.typography.bodyStrong,
                color: theme.colors.textInverse,
              }}
            >
              Create trip
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}