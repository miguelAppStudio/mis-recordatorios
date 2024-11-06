import AsyncStorage from "@react-native-async-storage/async-storage";

const getAllTask = async () => {
  const taskListJson = await AsyncStorage.getItem("task");
  const taskList = taskListJson ? JSON.parse(taskListJson) : [];
  return taskList as TaskTypes[];
};

export default getAllTask;
