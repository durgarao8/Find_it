"use client";

import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps } from "react-joyride";

const TOUR_STEPS: Step[] = [
  {
    target: "body",
    content: "Welcome to FindIt! Let's take a quick tour of the main features.",
    placement: "center",
  },
  {
    target: "#hero-carousel",
    content: "Here you can see featured images and announcements.",
    placement: "bottom",
  },
  {
    target: "#search-bar",
    content: "Use this search bar to look for specific items by name or description.",
    placement: "bottom",
  },
  {
    target: "#filters",
    content: "You can sort and filter the item list to narrow down your search.",
    placement: "bottom",
  },
  {
    target: "#item-grid",
    content: "This is where all the lost and found items are displayed.",
    placement: "top",
  },
  {
    target: "a[href='/submit']",
    content: "Click here to submit a report for a lost or found item.",
    placement: "bottom",
  },
  {
    target: "a[href='/search-by-image']",
    content: "If you've found an item, you can use our AI to search for it by image here.",
    placement: "bottom",
  },
];

export default function AppTour() {
  const [runTour, setRunTour] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const hasCompletedTour = localStorage.getItem("findit_tour_completed");
      if (!hasCompletedTour) {
        setRunTour(true);
      }
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = ["finished", "skipped"];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("findit_tour_completed", "true");
      }
    }
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: 'hsl(var(--background))',
          backgroundColor: 'hsl(var(--background))',
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          zIndex: 1000,
        },
        buttonClose: {
          display: 'none',
        },
        tooltip: {
            borderRadius: 'var(--radius)',
        },
      }}
    />
  );
}
