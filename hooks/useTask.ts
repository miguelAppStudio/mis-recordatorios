import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TaskProps {
  allTask: {
    taskList: TaskTypes[];
    pinedTask: TaskTypes | undefined;
    unPinedTask: TaskTypes[];
  };

  allTaskItem: TaskItemTypes[];
  getAllTask: () => Promise<void>;
  getAllTaskItem: () => Promise<void>;
}

const getAllTaskHandler = async () => {
  const taskListJson = await AsyncStorage.getItem("task");
  const allTask: TaskTypes[] = taskListJson ? JSON.parse(taskListJson) : [];
  const pinedTask = allTask.find((item) => item.pined === true);
  const unPinedTask = allTask.filter((elem) => elem.pined !== true);
  const taskList = allTask.reverse();
  return { taskList, pinedTask, unPinedTask: unPinedTask.reverse() };
};

const getAllTaskItemHandler = async () => {
  const taskListItemJson = await AsyncStorage.getItem("task-item");
  const taskListItem: TaskItemTypes[] = taskListItemJson
    ? JSON.parse(taskListItemJson)
    : [];
  return taskListItem.reverse();
};

const useTask = create<TaskProps>((set) => ({
  allTask: {
    taskList: [],
    pinedTask: undefined,
    unPinedTask: [],
  },
  allTaskItem: [],
  getAllTask: async () => set({ allTask: await getAllTaskHandler() }),
  getAllTaskItem: async () =>
    set({ allTaskItem: await getAllTaskItemHandler() }),
}));

export default useTask;
