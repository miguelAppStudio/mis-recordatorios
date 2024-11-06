import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/task-items/Header";
import Button from "@/components/Button";
import TaskItemCard from "@/components/task-items/TaskItemCard";
import InputText from "@/components/InputText";
import generateId from "@/constants/generateId";
import EditItemModal from "@/components/task-items/EditItemModal";
import useTask from "@/hooks/useTask";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import Colors from "@/constants/Colors";
import formatDate from "@/constants/formatDate";
import SetReminder from "@/components/task-items/SetReminder";

const TaskItems = ({ route, navigation }: { route: any; navigation: any }) => {
  const { getAllTaskItem, allTask, allTaskItem } = useTask();
  const { mode } = useTheme();
  const { id } = route.params;

  const [addTaskItemMode, setAddTaskItemMode] = useState(false);
  const [taskItemInput, setTaskItemInput] = useState("");

  const [editItemModal, setEditItemModal] = useState(false);
  const [reminderModal, setRemiderModal] = useState(false);
  const [currentTaskItem, setCurrentTaskItem] = useState<TaskItemTypes>();

  const task: TaskTypes | undefined = allTask.taskList.find(
    (item: any) => item.id === id
  );
  const taskItems = allTaskItem.filter((item) => item.taskId === task?.id);
  const [loading, setLoading] = useState(false);

  const openEditModal = (taskItem: TaskItemTypes) => {
    setCurrentTaskItem(taskItem);
    setEditItemModal(true);
  };

  const addNewTaskItemHandler = async () => {
    try {
      setLoading(true);
      const newTaskItem = {
        detail: taskItemInput,
        id: generateId() as string,
        taskId: id,
        completed: false,
        createdAt: new Date(),
      };
      const allTaskItemCopy = [...allTaskItem].reverse();
      allTaskItemCopy.push(newTaskItem);
      await AsyncStorage.setItem("task-item", JSON.stringify(allTaskItemCopy));
      await getAllTaskItem();
      setTaskItemInput("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header taskId={id} navigation={navigation} title={task?.title || ""} />

        <Ionicons
          name="alarm-outline"
          onPress={() => {
            setRemiderModal(true);
          }}
          size={40}
          color={Colors[mode].primary}
        />

        <View style={{ width: "90%", marginVertical: "5%" }}>
          {!addTaskItemMode && (
            <Button
              onPress={() => setAddTaskItemMode(true)}
              title="Add Task"
              style={{ width: "100%" }}
            />
          )}

          {addTaskItemMode && (
            <View style={{ gap: 10 }}>
              <InputText
                value={taskItemInput}
                onChangeText={setTaskItemInput}
                autoFocus
                placeholder="Enter New Task Item"
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Button
                  small
                  outline
                  onPress={() => setAddTaskItemMode(false)}
                  title="Atras"
                  style={{ width: "100%", flex: 1 }}
                />
                <Button
                  small
                  loading={loading}
                  onPress={addNewTaskItemHandler}
                  title="Añadir Nueva"
                  style={{ width: "100%", flex: 1 }}
                />
              </View>
            </View>
          )}
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width: "90%" }}
          contentContainerStyle={{ gap: 10 }}
          data={taskItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItemCard openEditModal={openEditModal} taskItem={item} />
          )}
        />
      </View>

      <EditItemModal
        currentTaskItem={currentTaskItem}
        editItemModal={editItemModal}
        setEditItemModal={setEditItemModal}
      />

      <SetReminder
        currentTask={task}
        visible={reminderModal}
        onClose={() => setRemiderModal(false)}
      />
    </>
  );
};

export default TaskItems;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    flex: 1,
  },
});
