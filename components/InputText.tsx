import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import useTheme from "@/hooks/useTheme";

interface InputProps {
  autoFocus?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onPressIcon?: () => void;
  placeholder?: string;
  label?: string;
  onChangeText: (text: string) => void;
  value: string;
  editable?: boolean;
  error?: boolean;
  errorMessage?: string;
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  textAlign?: "center" | "left" | "right";
  multiline?: boolean;
  onPress?: () => void;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad"
    | "url";
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
}

const InputText = (props: InputProps) => {
  const {
    autoFocus,
    placeholder,
    label,
    icon,
    onPressIcon,
    iconPosition = "right",
    onChangeText,
    value,
    editable,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    containerStyle,
    labelStyle,
    inputContainerStyle,
    inputStyle,
    error,
    errorMessage,
    inputMode,
    maxLength,
    textAlign,
    multiline,
    onPress,
  } = props;
  const [isFocus, setIsFocus] = useState(false);
  const { mode } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      exiting={FadeOutDown.duration(500)}
      style={[styles.container, containerStyle]}
    >
      {label && (
        <Text style={[styles.label, { color: Colors[mode].text }, labelStyle]}>
          {label}
        </Text>
      )}
      {error && (
        <Text style={[styles.errorMessage, labelStyle]}>{errorMessage}</Text>
      )}
      <Pressable
        onPress={onPress}
        style={[
          styles.inputContainer,
          { backgroundColor: Colors[mode].backgroundSecondary },
          {
            borderColor:
              isFocus && !error
                ? Colors[mode].primary
                : error
                ? Colors.error
                : undefined,
          },
          inputContainerStyle,
        ]}
      >
        {icon && iconPosition === "left" && (
          <Pressable onPress={onPressIcon}>{icon}</Pressable>
        )}

        <TextInput
          autoFocus={autoFocus}
          onPressIn={onPress}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={Colors[mode].textSecondary}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
          keyboardType={keyboardType}
          editable={editable}
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
          inputMode={inputMode}
          maxLength={maxLength}
          textAlign={textAlign}
          multiline={multiline}
          style={[
            styles.input,
            {
              color: secureTextEntry
                ? Colors[mode].backgroundSecondary
                : Colors[mode].text,
            },
            inputStyle,
          ]}
        />

        {icon && iconPosition === "right" && (
          <Pressable onPress={onPressIcon}>{icon}</Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default InputText;

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },

  label: {
    fontSize: 17,
    fontWeight: "500",
  },

  errorMessage: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "500",
  },

  inputContainer: {
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
  },

  input: {
    height: "100%",
    flex: 1,
    backgroundColor: "transparent",

    fontSize: 16,
    fontWeight: "500",
  },
});
