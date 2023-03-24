import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import LoginView from "./components/login_activity/login_activity.js";
import EsgotoScreen from "./components/esgoto_screen_activity/esgoto_screen.js";
import TelaMain from "./components/main_screen_activity/menu_principal.js";
import Macro_View from "./components/esgoto_screen_activity/macro_eee_activity/macro_screen.js";

import { Provider as PaperProvider } from "react-native-paper";
import Vistoria_View from "./components/esgoto_screen_activity/vistoria_eee_activity/vistoria_eee.js";

import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoadingScreen from "./utils/loading.js";

const Stack = createNativeStackNavigator();
(props) => {
  console.log(props);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    position: "absolute",
    top: 0,
  },
  button: {
    width: 40,
  },
});

export default function App() {
  let numero = 0;

  //Responsável por fazer o loading aparecer caso necessário

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="login_screen"
            component={LoginView}
            options={{ title: "Welcome" }}
          ></Stack.Screen>

          <Stack.Screen
            name="tela_activity"
            component={TelaMain}
          ></Stack.Screen>

          <Stack.Screen
            name="vistoria_eee"
            component={Vistoria_View}
          ></Stack.Screen>

          <Stack.Screen
            name="esgoto_screen"
            component={EsgotoScreen}
          ></Stack.Screen>

          <Stack.Screen
            name="menu_principal"
            component={TelaMain}
          ></Stack.Screen>

          <Stack.Screen
            name="macromedidor"
            component={Macro_View}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
