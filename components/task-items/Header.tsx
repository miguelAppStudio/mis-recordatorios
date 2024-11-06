import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import InputText from "../InputText";
import Button from "../Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useTask from "@/hooks/useTask";

const Header = ({
  title,
  navigation,
  taskId,
}: {
  title: string;
  navigation: any;

  taskId: string;
}) => {
  const { mode } = useTheme();
  const { getAllTask, allTask } = useTask();
  const [editMode, setEditMode] = useState(false);
  const [taskTitleInput, setTaskTitleInput] = useState(title);
  const [loading, setLoading] = useState(false);

  const editTaskTitleHandler = async () => {
    try {
      setLoading(true);
      const currentTask: TaskTypes | undefined = allTask.taskList.find(
        (item: any) => item.id === taskId
      );
      currentTask && (currentTask.title = taskTitleInput);
      await AsyncStorage.setItem(
        "task",
        JSON.stringify(allTask.taskList.reverse())
      );
      await getAllTask();
      setEditMode(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <AntDesign
          onPress={() => {
            editMode ? setEditMode(false) : navigation.goBack();
          }}
          name="back"
          size={30}
          color={Colors[mode].text}
        />
        {!editMode && (
          <Text
            onPress={() => {
              setEditMode(true);
              setTaskTitleInput(title);
            }}
            style={{ ...styles.headerText, color: Colors[mode].text }}
          >
            {title}
          </Text>
        )}
        {editMode && (
          <InputText
            onChangeText={setTaskTitleInput}
            autoFocus
            value={taskTitleInput}
            containerStyle={{ flex: 1 }}
          />
        )}

        {!editMode && (
          <AntDesign
            onPress={() => {
              setEditMode(true);
              setTaskTitleInput(title);
            }}
            name="edit"
            size={30}
            color={Colors[mode].text}
          />
        )}
        {editMode && (
          <View>
            {!loading && (
              <AntDesign
                onPress={editTaskTitleHandler}
                name="save"
                size={30}
                color={Colors[mode].text}
              />
            )}
            {loading && (
              <ActivityIndicator color={Colors[mode].textSecondary} />
            )}
            <Text style={{ ...styles.saveText, color: Colors[mode].text }}>
              Save
            </Text>
          </View>
        )}
      </View>
    </>
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
    gap: 10,
  },
  headerText: { fontFamily: "Satoshi-Medium", fontSize: 30, flex: 1 },

  saveText: { fontFamily: "Satoshi-Regular", fontSize: 15 },
});
