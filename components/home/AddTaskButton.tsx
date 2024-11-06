import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import Colors from "@/constants/Colors";
import generateId from "@/constants/generateId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useTask from "@/hooks/useTask";

const AddTaskButton = ({ navigation }: { navigation: any }) => {
  const { mode } = useTheme();
  const [loading, setLoading] = useState(false);
  const { getAllTask, allTask } = useTask();

  const newTaskHandler = async () => {
    try {
      setLoading(true);
      const id = generateId() as string;
      const newTask = {
        id,
        title: "Busca un Título",
        createdAt: new Date(),
        pined: false,
        tags: [],
      };

      const taskListCopy = [...allTask.taskList].reverse();
      taskListCopy.push(newTask);
      await AsyncStorage.setItem("task", JSON.stringify(taskListCopy));
      await getAllTask();
      navigation.navigate("TaskItems", { id });
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <Pressable
      android_ripple={{ color: Colors[mode].backgroundSecondary }}
      onPress={newTaskHandler}
      style={{
        ...styles.container,
        backgroundColor: Colors[mode].backgroundSecondary,
      }}
    >
      <View
        style={{
          ...styles.innerContainer,
          backgroundColor: Colors[mode].primary,
        }}
      >
        {!loading && <Ionicons name="add" size={40} color={"#ffffff"} />}
        {loading && <ActivityIndicator color={"#ffffff"} />}
      </View>
    </Pressable>
  );
};

export default AddTaskButton;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 180,
    bottom: "10%",
    borderWidth: 0.7,
    borderColor: Colors["light"].primary,
  },

  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    height: 65,
    borderRadius: 120,
  },
});
