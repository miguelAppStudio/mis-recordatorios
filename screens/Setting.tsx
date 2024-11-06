import { StyleSheet, Switch, Text, View, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/setting/Header";
import useTheme from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import * as Application from "expo-application";

const Setting = ({ navigation }: { navigation: any }) => {
  const [storedMode, setStoredMode] = useState("");
  const { mode, changeThemeMode } = useTheme();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchData = async () => {
      const theme = await AsyncStorage.getItem("theme-mode");
      if (theme) {
        setStoredMode(theme);
      } else {
        setStoredMode(
          !colorScheme ? "light" : (colorScheme as "light" | "dark")
        );
      }
    };
    fetchData();
  }, [colorScheme]);

  const changeValueHandler = (value: "light" | "dark" | "system") => {
    changeThemeMode(value);
    setStoredMode(value);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <View style={styles.content}>
        <View
          style={{
            ...styles.themeContainer,
            backgroundColor: Colors[mode].backgroundSecondary,
          }}
        >
          <Text style={{ ...styles.themeText, color: Colors[mode].text }}>
            Light Mode
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={
              storedMode === "light" ? Colors[mode].primary : Colors[mode].text
            }
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => changeValueHandler("light")}
            value={storedMode === "light"}
          />
        </View>

        <View
          style={{
            ...styles.themeContainer,
            backgroundColor: Colors[mode].backgroundSecondary,
          }}
        >
          <Text style={{ ...styles.themeText, color: Colors[mode].text }}>
            Dark Mode
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={
              storedMode === "dark" ? Colors[mode].primary : Colors[mode].text
            }
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => changeValueHandler("dark")}
            value={storedMode === "dark"}
          />
        </View>

        <View
          style={{
            ...styles.themeContainer,
            backgroundColor: Colors[mode].backgroundSecondary,
          }}
        >
          <Text style={{ ...styles.themeText, color: Colors[mode].text }}>
            System Mode
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={
              storedMode === "system" ? Colors[mode].primary : Colors[mode].text
            }
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => changeValueHandler("system")}
            value={storedMode === "system"}
          />
        </View>
      </View>

      <Text style={{ ...styles.versionText, color: Colors[mode].text }}>
        {`id: ${Application.androidId || "No Id"} | v.${
          Application.nativeApplicationVersion
        } (${Application.nativeBuildVersion}) | Free`}
      </Text>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    flex: 1,
  },

  content: {
    width: "90%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  themeContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
  },

  themeText: {
    fontFamily: "Satoshi-MediumItalic",
    fontSize: 18,
  },

  versionText: {
    fontFamily: "Satoshi-Regular",
    fontSize: 14,
  },
});
