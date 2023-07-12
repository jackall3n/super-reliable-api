import { addDays, isSameDay } from "date-fns";
import { Reading, ReadingMetric } from "@prisma/client";

export function getPowerReadings(from: Date, to: Date, readings: Reading[]) {
  const range = getDateRange(from, to);

  return range.map((date) => {
    const dailyReadings = readings.filter((reading) =>
      isSameDay(reading.time, date),
    );

    const voltage = dailyReadings.filter(
      (reading) => reading.name === ReadingMetric.Voltage,
    );

    const current = dailyReadings.filter(
      (reading) => reading.name === ReadingMetric.Current,
    );

    if (!current.length || !voltage.length) {
      return {
        time: date.toISOString(),
        name: "Power",
        value: 0,
      };
    }

    const averageVoltage =
      voltage.reduce((total, reading) => total + reading.value, 0) /
      voltage.length;

    const averageCurrent =
      current.reduce((total, reading) => total + reading.value, 0) /
      current.length;

    return {
      time: date.toISOString(),
      name: "Power",
      value: averageCurrent * averageVoltage,
    };
  });
}

function getDateRange(from: Date, to: Date) {
  let current = from;

  const dates: Date[] = [];

  while (current <= to) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}
