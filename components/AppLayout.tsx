import {
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { SafeAreaView as SafeAreaViewIos } from "react-native";
import { SafeAreaView as SafeAreaViewAndroid } from "react-native-safe-area-context";
import React from "react";

export const AppLayout = ({
  children,
  style,
  onLayout,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
}) => {
  const platfrom = Platform.OS;

  if (platfrom === "android") {
    return (
      <SafeAreaViewAndroid
        onLayout={onLayout}
        style={[styles.container, style]}
      >
        {children}
      </SafeAreaViewAndroid>
    );
  }

  return (
    <SafeAreaViewIos onLayout={onLayout} style={[styles.container, style]}>
      {children}
    </SafeAreaViewIos>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
