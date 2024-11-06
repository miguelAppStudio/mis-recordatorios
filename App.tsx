import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Button, Platform, StyleSheet, Text } from "react-native";
import { AppLayout } from "./components/AppLayout";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";

import Navigations from "@/navigations";
import fonts from "./constants/fonts";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const { mode, initialThemeMode } = useTheme();
  // const notificationListener = useRef<any>();
  // const responseListener = useRef<any>();

  // useEffect(() => {
  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       const title = notification.request.content.title;
  //       const body = notification.request.content.body;
  //       const identify = notification.request.identifier;
  //       const data = notification.request.content.data;
  //       console.log(data);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       const title = response.notification.request.content.title;
  //       const body = response.notification.request.content.body;
  //       const identify = response.notification.request.identifier;
  //       const data = response.notification.request.content.data;
  //       navigation.navigate("TaskItems", { id: data.data.id });
  //       console.log(data);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: Colors[mode].primary,
          backgroundColor: Colors[mode].backgroundSecondary,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 17,
          color: Colors[mode].text,
        }}
        text2Style={{
          fontSize: 15,
          color: Colors[mode].textSecondary,
        }}
      />
    ),

    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          backgroundColor: Colors[mode].backgroundSecondary,
          borderLeftColor: Colors.error,
        }}
        text1Style={{
          fontSize: 17,
          color: Colors[mode].text,
        }}
        text2Style={{
          fontSize: 15,
          color: Colors[mode].textSecondary,
        }}
      />
    ),
  };

  async function onFetchUpdateAsync() {
    if (Device.isDevice) {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        alert(`Error al obtener la última actualización de la Expo: ${error}`);
      }
    } else {
      alert(`Este no es un dispositivo real. La actualización de Expo no funciona aquí`);
    }
  }

  useEffect(() => {
    initialThemeMode();
    onFetchUpdateAsync();
  }, []);

  const [fontsLoaded] = useFonts(fonts);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <AppLayout
        onLayout={onLayoutRootView}
        style={{
          ...styles.container,
          backgroundColor: Colors[mode].background,
        }}
      >
        <Navigations />
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
      </AppLayout>

      <Toast topOffset={100} config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
