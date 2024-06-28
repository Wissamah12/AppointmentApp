// AppNavigator.tsx
import React, { useState } from "react";
import { View, Button } from "react-native";
import CalendarPage from "@/components/CalendarPage";
import AppointmentForm from "@/components/AppointmentForm";

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState("CalendarPage");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const renderScreen = () => {
    switch (currentScreen) {
      case "CalendarPage":
        return (
          <CalendarPage
            navigateToAppointmentForm={(date: string) => {
              setSelectedDate(date);
              setCurrentScreen("AppointmentForm");
            }}
          />
        );
      case "AppointmentForm":
        return (
          <AppointmentForm
            date={selectedDate!}
            navigateBack={() => setCurrentScreen("CalendarPage")}
          />
        );
      default:
        return null;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
};

export default AppNavigator;
