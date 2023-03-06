import { CalendarIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

// We use an object to store the text to update each time the reference changes
type TimeAgoData = { data: string };

export interface TimeAgoProps {
  date: Date;
}

export default function TimeAgo({ date }: TimeAgoProps) {
  const [timeAgoText, setTimeAgoText] = useState<TimeAgoData>({
    data: getTimeAgoText(date),
  });

  useEffect(() => {
    const nextMs = getMsToNextTime(date);
    let timeoutId: number | undefined;

    const startTimeout = () => {
      timeoutId = window.setTimeout(() => {
        const text = getTimeAgoText(date);
        setTimeAgoText({ data: text });
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
  }, [timeAgoText, date]);

  // We need to suppress the hydration warning because we are using a timer which values may
  // defer on the server and client
  return (
    <div className="mr-4 mb-3 mt-3 flex flex-row items-center justify-start gap-1 text-xs text-white opacity-50">
      <CalendarIcon className="h-4 w-4" />
      <span suppressHydrationWarning>{timeAgoText.data}</span>
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

function getTimeAgoText(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(months / 12);

  return `${years} year${years === 1 ? "" : "s"} ago`;
}
