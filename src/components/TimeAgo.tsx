import { CalendarIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: '%d seconds',
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  },
});

// We use an object to store the text to update each time the reference changes
type TimeAgoText = { text: string };

export interface TimeAgoProps {
  date: Date;
}

export default function TimeAgo({ date }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState<TimeAgoText>({
    text: dayjs(date).fromNow(),
  });

  useEffect(() => {
    const nextMs = getMsToNextTime(date);
    let timeoutId: number | undefined;

    const startTimeout = () => {
      timeoutId = window.setTimeout(() => {
        const text = dayjs(date).fromNow();
        setTimeAgo({ text });
        startTimeout();
      }, nextMs);
    };

    if (nextMs != null) {
      startTimeout();
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeAgo, date]);

  // We need to suppress the hydration warning because we are using a timer which values may
  // defer on the server and client
  return (
    <div className="mr-4 mb-3 mt-3 flex flex-row items-center justify-start gap-1 text-xs text-white opacity-50">
      <CalendarIcon className="h-4 w-4" />
      <span suppressHydrationWarning>{timeAgo.text}</span>
    </div>
  );
}

function getMsToNextTime(fromDate: Date): number | undefined {
  const msElapsed = Date.now() - fromDate.getTime();

  const seconds = Math.floor(msElapsed / 1000);

  // Waits the time required to go to the next second
  if (seconds < 60) {
    const msUntilNextSecond = msElapsed % 1000;
    //console.log(`${msUntilNextSecond}ms until next second`);
    return msUntilNextSecond;
  }

  const minutes = Math.floor(seconds / 60);

  // Wait the time required to go to the next minute
  if (minutes < 60) {
    const msUntilNextMinute = msElapsed % (1000 * 60);
    //console.log(`${msUntilNextMinute}ms until next minute`);
    return msUntilNextMinute;
  }

  const hours = Math.floor(minutes / 60);

  // Wait the time required to go to the next hour
  if (hours < 60) {
    const msUntilNextHour = msElapsed % (1000 * 60 * 60);
    //console.log(`${msUntilNextHour}ms until next hour`);
    return msUntilNextHour;
  }

  // By default return undefined
  return undefined;
}