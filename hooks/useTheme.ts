import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();

interface ThemeProps {
  mode: "light" | "dark";
  changeThemeMode: (mode: "light" | "dark" | "system") => Promise<void>;
  initialThemeMode: () => void;
}

const fetchUserTheme = async () => {
  const storedTheme = await AsyncStorage.getItem("theme-mode");
  if (storedTheme === "light") {
    return "light";
  } else if (storedTheme === "dark") {
    return "dark";
  } else {
    return colorScheme === null ? "light" : (colorScheme as "light" | "dark");
  }
};

const changeThemeHandler = async (mode: "light" | "dark" | "system") => {
  await AsyncStorage.setItem("theme-mode", mode);
  return await fetchUserTheme();
};

const useTheme = create<ThemeProps>((set) => ({
  mode: "light",
  changeThemeMode: async (mode: "light" | "dark" | "system") =>
    set({ mode: await changeThemeHandler(mode) }),
  initialThemeMode: async () => set({ mode: await fetchUserTheme() }),
}));

export default useTheme;
