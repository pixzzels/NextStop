import { Calendar, type DateData } from "react-native-calendars";
import { Text, View } from "react-native";

import { theme } from "@/theme";
import { compareDateStrings, getDateRange, isValidDateInput } from "@/utils/dateInput";

type TripDateRangePickerProps = {
  startDate: string;
  endDate: string;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
};

type MarkedDates = Record<
  string,
  {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  }
>;

function getMarkedDates(startDate: string, endDate: string): MarkedDates {
  if (!isValidDateInput(startDate)) {
    return {};
  }

  if (!isValidDateInput(endDate)) {
    return {
      [startDate]: {
        startingDay: true,
        endingDay: true,
        color: theme.colors.primary,
        textColor: theme.colors.textInverse,
      },
    };
  }

  const dates = getDateRange(startDate, endDate);

  return dates.reduce<MarkedDates>((markedDates, date) => {
    const isStart = date === startDate;
    const isEnd = date === endDate;

    markedDates[date] = {
      startingDay: isStart,
      endingDay: isEnd,
      color: isStart || isEnd ? theme.colors.primary : theme.colors.accentMuted,
      textColor: isStart || isEnd ? theme.colors.textInverse : theme.colors.textPrimary,
    };

    return markedDates;
  }, {});
}

export function TripDateRangePicker({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}: TripDateRangePickerProps) {
  function handleDayPress(day: DateData) {
    const selectedDate = day.dateString;

    if (!startDate || (startDate && endDate)) {
      onChangeStartDate(selectedDate);
      onChangeEndDate("");
      return;
    }

    if (compareDateStrings(selectedDate, startDate) < 0) {
      onChangeStartDate(selectedDate);
      onChangeEndDate("");
      return;
    }

    onChangeEndDate(selectedDate);
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.xl,
        overflow: "hidden",
        backgroundColor: theme.colors.surface,
      }}
    >
      <Calendar
        markingType="period"
        markedDates={getMarkedDates(startDate, endDate)}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.textSecondary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.textInverse,
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.textPrimary,
          textDisabledColor: theme.colors.textMuted,
          monthTextColor: theme.colors.textPrimary,
          arrowColor: theme.colors.primary,
          textMonthFontWeight: "800",
          textDayFontWeight: "500",
          textDayHeaderFontWeight: "700",
        }}
      />

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderMuted,
          padding: theme.spacing.md,
          backgroundColor: theme.colors.surfaceMuted,
        }}
      >
        <Text
          style={{
            ...theme.typography.caption,
            color: theme.colors.textSecondary,
            lineHeight: 20,
          }}
        >
          Tap a start date, then tap an end date. Tap another date after both are selected to restart the range.
        </Text>
      </View>
    </View>
  );
}