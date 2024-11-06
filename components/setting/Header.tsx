import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";

const Header = ({ navigation }: { navigation: any }) => {
  const { mode } = useTheme();

  return (
    <View style={styles.headerContainer}>
      <AntDesign
        onPress={() => {
          navigation.goBack();
        }}
        name="back"
        size={30}
        color={Colors[mode].text}
      />

      <Text style={{ ...styles.headerText, color: Colors[mode].text }}>
      Ajustes
      </Text>

      <FontAwesome5 name="donate" size={30} color={Colors[mode].text} />
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
