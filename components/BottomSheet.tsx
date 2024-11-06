import {
  BackHandler,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import React, { useEffect } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import useTheme from "@/hooks/useTheme";
import Colors from "@/constants/Colors";

const BottomSheet = ({
  children,
  style,
  onClose,
  visible,
}: {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
  onClose: () => void;
  visible: boolean;
}) => {
  const { mode } = useTheme();

  useEffect(() => {
    const backAction = () => {
      onClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    if (!visible) {
      backHandler.remove();
    }

    return () => backHandler.remove();
  }, [visible]);

  if (!visible) {
    return null; // Do not render anything if not visible
  }

  return (
    <>
      <Pressable onPress={onClose} style={styles.overlay}></Pressable>

      <Animated.View
        entering={SlideInDown.duration(300)}
        exiting={SlideOutDown.duration(300)}
        style={[
          styles.container,
          { backgroundColor: Colors[mode].backgroundSecondary },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    width: "100%",
    position: "absolute",
    zIndex: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },

  overlay: {
    height: "100%",
    bottom: 0,
    width: "100%",
    position: "absolute",
    zIndex: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
    backgroundColor: "black",
    opacity: 0.5,
  },
});
