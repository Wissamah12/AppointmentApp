import React from "react";
import { SafeAreaView } from "react-native";
import AppNavigator from "./App";

function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
    </SafeAreaView>
  );
}

export default Index;
