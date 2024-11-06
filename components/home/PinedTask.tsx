import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import formatDate from "@/constants/formatDate";
import getAllTask from "@/constants/getAllTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import useTask from "@/hooks/useTask";

const TaskPreview = ({ taskItem }: { taskItem: TaskItemTypes }) => {
  const { mode } = useTheme();

  return (
    <View style={{ ...styles.taskPreview, backgroundColor: "#fff" }}>
      {taskItem.completed && (
        <AntDesign name="checkcircle" size={30} color={Colors[mode].primary} />
      )}
      {!taskItem.completed && (
        <FontAwesome name="circle-thin" size={30} color={"#333333"} />
      )}

      <Text
        numberOfLines={1}
        style={{
          ...styles.taskPreviewText,
          textDecorationLine: taskItem.completed ? "line-through" : "none",
        }}
      >
        {taskItem.detail}
      </Text>
    </View>
  );
};

const PinedTask = ({
  task,
  navigation,
}: {
  task: TaskTypes;
  navigation: any;
}) => {
  const { mode } = useTheme();
  const { allTask, getAllTask, getAllTaskItem, allTaskItem } = useTask();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentTask: TaskTypes | undefined = allTask.taskList.find(
    (item: any) => item.id === task.id
  );
  const taskListItem = [...allTaskItem];
  const currentTaskItems = taskListItem
    .filter((item) => item.taskId === currentTask?.id)
    .reverse()
    .slice(0, 3);

  const unpinTaskHandler = async () => {
    try {
      setLoading(true);
      for (const elem of allTask.taskList) {
        if (task.id === elem.id) {
          elem.pined = false;
        }
      }
      await AsyncStorage.setItem("task", JSON.stringify(allTask.taskList));
      await getAllTask();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTaskHandler = useCallback(async () => {
    try {
      setDeleting(true);
      const filteredTask: TaskTypes[] = allTask.taskList
        .filter((item: any) => item.id !== task.id)
        .reverse();

      const filteredTaskItem: TaskItemTypes[] = allTaskItem
        .filter((item) => item.taskId !== task.id)
        .reverse();

      await AsyncStorage.setItem("task", JSON.stringify(filteredTask));
      await AsyncStorage.setItem("task-item", JSON.stringify(filteredTaskItem));
      await getAllTask();
      await getAllTaskItem();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }, [allTask.taskList, allTaskItem, getAllTask, getAllTaskItem]);

  return (
    <Animated.View
      key={task.id}
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={{
        ...styles.container,
        backgroundColor: Colors[mode].primary,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={() => navigation.navigate("TaskItems", { id: task.id })}
        android_ripple={{ color: Colors[mode].textSecondary }}
        style={{ padding: 15, gap: 30 }}
      >
        <View style={styles.head}>
          <Text style={styles.title}>{task.title}</Text>
          {!showMenu && (
            <Entypo
              onPress={() => setShowMenu(true)}
              name="dots-three-horizontal"
              size={24}
              color={Colors[mode].text}
            />
          )}

          {showMenu && (
            <AntDesign
              onPress={() => setShowMenu(false)}
              name="close"
              size={24}
              color={Colors[mode].text}
            />
          )}
        </View>

        {!showMenu && (
          <FlatList
            contentContainerStyle={{ gap: 13 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={currentTaskItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <TaskPreview taskItem={item} />}
          />
        )}

        {showMenu && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!deleting && (
              <AntDesign
                onPress={deleteTaskHandler}
                color={Colors[mode].text}
                size={40}
                name="delete"
              />
            )}

            {deleting && (
              <ActivityIndicator size="large" color={Colors[mode].text} />
            )}
          </Animated.View>
        )}

        <View style={styles.head}>
          <Text style={styles.title}>
            {formatDate(new Date(`${task.createdAt}`))}
          </Text>
          {!loading && (
            <AntDesign
              onPress={unpinTaskHandler}
              name="pushpin"
              size={24}
              color="#ffffff"
            />
          )}
          {loading && <ActivityIndicator color={Colors[mode].textSecondary} />}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default PinedTask;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderRadius: 20,
    marginBottom: "5%",
  },

  head: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    color: "#ffffff",
    fontFamily: "Satoshi-Medium",
    fontSize: 17,
  },

  taskPreview: {
    padding: 12,
    borderRadius: 30,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },

  taskPreviewText: {
    maxWidth: 200,
    fontFamily: "Satoshi-Regular",
    color: "#333333",
  },
});
