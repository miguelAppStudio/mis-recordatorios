import Colors from "@/constants/Colors";
import useTask from "@/hooks/useTask";
import useTheme from "@/hooks/useTheme";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  RotateInUpLeft,
  RotateOutUpRight,
} from "react-native-reanimated";

const TaskItemCard = ({
  taskItem,
  openEditModal,
}: {
  taskItem: TaskItemTypes;
  openEditModal: (taskItem: TaskItemTypes) => void;
}) => {
  const { mode } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const { allTaskItem, getAllTaskItem } = useTask();
  const [laoding, setLoading] = useState(false);

  useEffect(() => {
    setShowMenu(false);
  }, [taskItem.detail]);

  const changeStatusHandler = async () => {
    try {
      setLoading(true);
      const currentTaskItem: TaskItemTypes | undefined = allTaskItem.find(
        (item: TaskItemTypes) => taskItem.id === item.id
      );

      if (currentTaskItem)
        currentTaskItem?.completed === true
          ? (currentTaskItem.completed = false)
          : (currentTaskItem.completed = true);

      await AsyncStorage.setItem(
        "task-item",
        JSON.stringify(allTaskItem.reverse())
      );
      await getAllTaskItem();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTaskItemHandler = async () => {
    try {
      setLoading(true);
      const filteredTaskItem: TaskItemTypes[] = allTaskItem.filter(
        (item) => taskItem.id !== item.id
      );

      await AsyncStorage.setItem(
        "task-item",
        JSON.stringify(filteredTaskItem.reverse())
      );
      await getAllTaskItem();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View
      key={taskItem.detail + taskItem.id}
      entering={FadeInUp}
      exiting={FadeOutDown}
      style={{
        ...styles.taskPreview,
        backgroundColor: Colors[mode].backgroundSecondary,
      }}
    >
      {!showMenu && (
        <Pressable
          onLongPress={() => setShowMenu(true)}
          onPress={changeStatusHandler}
          android_ripple={{ color: Colors[mode].textSecondary }}
          style={styles.innerContainer}
        >
          {taskItem.completed && (
            <Animated.View exiting={RotateOutUpRight} entering={RotateInUpLeft}>
              <AntDesign
                onPress={changeStatusHandler}
                name="checkcircle"
                size={30}
                color={Colors[mode].primary}
              />
            </Animated.View>
          )}
          {!taskItem.completed && (
            <Animated.View exiting={FadeOut} entering={FadeIn}>
              <FontAwesome
                onPress={changeStatusHandler}
                name="circle-thin"
                size={34}
                color={Colors[mode].textSecondary}
              />
            </Animated.View>
          )}

          <Text
            style={{
              ...styles.taskPreviewText,
              textDecorationLine: taskItem.completed ? "line-through" : "none",
              color: Colors[mode].text,
            }}
          >
            {taskItem.detail}
          </Text>

          {laoding && <ActivityIndicator color={Colors[mode].textSecondary} />}
        </Pressable>
      )}

      {showMenu && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown}
          style={{
            ...styles.innerContainer,
            justifyContent: "center",
            gap: 15,
          }}
        >
          <AntDesign
            onPress={() => openEditModal(taskItem)}
            name="edit"
            size={30}
            color={Colors[mode].textSecondary}
          />
          <AntDesign
            onPress={deleteTaskItemHandler}
            name="delete"
            size={30}
            color={Colors[mode].textSecondary}
          />
          <AntDesign
            onPress={() => setShowMenu(false)}
            name="close"
            size={30}
            color={Colors[mode].textSecondary}
          />
          {laoding && <ActivityIndicator color={Colors[mode].textSecondary} />}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default TaskItemCard;

const styles = StyleSheet.create({
  taskPreview: {
    borderRadius: 30,
    overflow: "hidden",
  },

  innerContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    padding: 12,
  },

  taskPreviewText: {
    fontFamily: "Satoshi-Regular",
    color: "#333333",
    flex: 1,
  },
});
