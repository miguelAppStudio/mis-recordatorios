import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";

const Header = ({
  searchMode,
  setSearchMode,
  setSearchInput,
  navigation,
}: {
  searchMode: boolean;
  setSearchMode: (value: boolean) => void;
  setSearchInput: (value: string) => void;
  navigation: any;
}) => {
  const { mode } = useTheme();

  return (
    <View style={styles.headerContainer}>
      <AntDesign
        onPress={() => {
          navigation.navigate("Setting");
        }}
        name="setting"
        size={30}
        color={Colors[mode].text}
      />

      <Text style={{ ...styles.headerText, color: Colors[mode].text }}>
        Ya Me Acuerdo
      </Text>

      {!searchMode && (
        <Ionicons
          onPress={() => setSearchMode(true)}
          name="search-outline"
          size={30}
          color={Colors[mode].text}
        />
      )}

      {searchMode && (
        <Ionicons
          onPress={() => {
            setSearchMode(false);
            setSearchInput("");
          }}
          name="close"
          size={30}
          color={Colors[mode].text}
        />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: "5%",
  },
  headerText: { fontFamily: "Satoshi-Medium", fontSize: 30 },
});
