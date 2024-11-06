import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
// import { Ionicons, } from "@expo/vector-icons";

interface ButtonProps {
  onPress: () => void;
  small?: boolean;
  outline?: boolean;
  title: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
}

const Button = (props: ButtonProps) => {
  const { mode } = useTheme();

  const { small, outline, onPress, title, icon, style, loading } = props;

  return (
    <Pressable
      disabled={loading}
      android_ripple={{ color: Colors[mode].background }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          height: small ? 45 : 60,
          backgroundColor: outline ? "transparent" : Colors[mode].primary,
        },
        {
          backgroundColor: pressed
            ? outline
              ? Colors[mode].primary
              : "transparent"
            : outline
            ? "transparent"
            : Colors[mode].primary,
        },
        style,
      ]}
    >
      {loading && <ActivityIndicator color={"#ffffff"} size="large" />}
      {!loading && (
        <Text
          style={[
            styles.buttonText,
            { fontSize: small ? 16 : 18, color: Colors[mode].text },
          ]}
        >
          {title}
        </Text>
      )}
      {!loading && icon}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: Colors["dark"].primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors["dark"].primary,
    flexDirection: "row",
    gap: 5,
  },

  buttonText: {
    fontWeight: "500",
    textAlign: "center",
  },
});
