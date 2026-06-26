import { Link } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { theme } from "@/theme";

import { useTripsQuery } from "@/features/trips/tripQueries";
import { supabase } from "@/lib/supabase";

function formatTripDateRange(startDate: string, endDate: string) {
  if (startDate === endDate) {
    return startDate;
  }

  return `${startDate} - ${endDate}`;
}

export default function TripsScreen() {
  const tripsQuery = useTripsQuery();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Could not sign out", error.message);
    }
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={tripsQuery.isRefetching}
          onRefresh={tripsQuery.refetch}
        />
      }
      contentContainerStyle={{
        flexGrow: 1,
        padding: theme.spacing.xl,
        paddingTop: 72,
      }}
    >
      <View
        style={{
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "800",
            marginBottom: theme.spacing.sm,
          }}
        >
          Trips
        </Text>

        <Text
          style={{
            fontSize: 16,
            opacity: 0.7,
          }}
        >
          Plan itineraries, packing, costs, and what comes next.
        </Text>
      </View>

      <Link href="/create-trip" asChild>
        <Pressable
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            alignItems: "center",
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text
            style={{
              color: theme.colors.textInverse,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Create trip
          </Text>
        </Pressable>
      </Link>

      {tripsQuery.isLoading ? (
        <View
          style={{
            paddingVertical: 48,
            alignItems: "center",
          }}
        >
          <ActivityIndicator />
        </View>
      ) : null}

      {tripsQuery.isError ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#fecaca",
            backgroundColor: "#fef2f2",
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#991b1b",
              fontWeight: "700",
              marginBottom: 4,
            }}
          >
            Could not load trips
          </Text>
          <Text style={{ color: "#991b1b" }}>
            {tripsQuery.error.message}
          </Text>
        </View>
      ) : null}

      {!tripsQuery.isLoading && tripsQuery.data?.length === 0 ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: theme.radius.xl,
            padding: 20,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginBottom: theme.spacing.sm,
            }}
          >
            No trips yet
          </Text>
          <Text
            style={{
              fontSize: 15,
              opacity: 0.7,
              lineHeight: 22,
            }}
          >
            Create your first trip to start building the itinerary, packing
            list, costs, and important trip documents.
          </Text>
        </View>
      ) : null}

      {tripsQuery.data?.map((trip) => (
        <View
          key={trip.id}
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 16,
            padding: 18,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              marginBottom: 4,
            }}
          >
            {trip.title}
          </Text>

          {trip.destination ? (
            <Text
              style={{
                fontSize: 15,
                opacity: 0.75,
                marginBottom: 4,
              }}
            >
              {trip.destination}
            </Text>
          ) : null}

          <Text
            style={{
              fontSize: 14,
              opacity: 0.65,
            }}
          >
            {formatTripDateRange(trip.start_date, trip.end_date)}
          </Text>
        </View>
      ))}

      <Pressable
        onPress={handleSignOut}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: 16,
          alignItems: "center",
          marginTop: "auto",
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
    </ScrollView>
  );
}