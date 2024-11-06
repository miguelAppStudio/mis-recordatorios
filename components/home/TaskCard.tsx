import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import formatDate from "@/constants/formatDate";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import getAllTask from "@/constants/getAllTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const TaskCard = ({
  task,
  navigation,
}: {
  task: TaskTypes;
  navigation: any;
}) => {
  const { mode } = useTheme();
  const { allTask, getAllTask, getAllTaskItem, allTaskItem } = useTask();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentTask: TaskTypes | undefined = allTask.taskList.find(
    (item: any) => item.id === task.id
  );
  const currentTaskItems = [...allTaskItem]
    .filter((item) => item.taskId === currentTask?.id)
    .slice(0, 3);

  const pinTaskHandler = async () => {
    try {
      setLoading(true);
      for (const elem of allTask.taskList) {
        if (task.id === elem.id) {
          elem.pined = true;
        } else {
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
      style={{
        overflow: "hidden",
        ...styles.container,
        backgroundColor: Colors[mode].backgroundSecondary,
      }}
      entering={FadeInDown}
    >
      <Pressable
        onPress={() => navigation.navigate("TaskItems", { id: task.id })}
        style={{ flex: 1, padding: 15, gap: 30, width: "100%" }}
        android_ripple={{ color: Colors[mode].textSecondary }}
      >
        <View style={styles.head}>
          <Text
            style={{
              ...styles.title,
              flex: 1,
              fontSize: 13,
              color: Colors[mode].text,
            }}
          >
            {task?.title}
          </Text>
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
            // onScroll={() => {}}
            contentContainerStyle={{ gap: 13 }}
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
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!deleting && (
              <AntDesign
                onPress={deleteTaskHandler}
                color={Colors[mode].primary}
                size={40}
                name="delete"
              />
            )}

            {deleting && (
              <ActivityIndicator size="large" color={Colors[mode].primary} />
            )}
          </Animated.View>
        )}

        <View style={styles.head}>
          <Text
            style={{
              ...styles.title,
              flex: 1,
              fontSize: 13,
              color: Colors[mode].text,
            }}
          >
            {formatDate(new Date(`${task?.createdAt}`))}
          </Text>
          {!loading && (
            <MaterialCommunityIcons
              name="pin-off"
              size={24}
              color={Colors[mode].text}
              onPress={pinTaskHandler}
            />
          )}
          {loading && <ActivityIndicator color={Colors[mode].textSecondary} />}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    maxHeight: 350,
    justifyContent: "center",
    alignItems: "center",
  },

  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },

  title: {
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
    maxWidth: 100,
    fontFamily: "Satoshi-Regular",
    color: "#333333",
  },
});
