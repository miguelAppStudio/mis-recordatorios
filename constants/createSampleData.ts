import AsyncStorage from "@react-native-async-storage/async-storage";
import generateId from "./generateId";

const createSampleData = async () => {
  const taskIdOne = generateId() as string;
  const taskIdTwo = generateId() as string;
  const taskIdThree = generateId() as string;

  const sampleTaskList = [
    {
      id: taskIdOne,
      title: "Ejemplo de tarea fijada",
      createdAt: new Date(),
      pined: true,
      tags: [],
    },

    {
      id: taskIdTwo,
      title: "Tarea de muestra uno",
      createdAt: new Date(),
      pined: false,
      tags: [],
    },

    {
      id: taskIdThree,
      title: "Tarea de muestra dos",
      createdAt: new Date(),
      pined: false,
      tags: [],
    },
  ];

  const sampleTaskItemList = [
    {
      detail: "Buy groceries: Milk, bread, eggs, fruits, and vegetables",
      id: generateId() as string,
      taskId: taskIdOne,
      completed: false,
      createdAt: new Date(),
    },
    {
      detail:
        "Finish work project: Complete the final report and submit it by 5 PM",
      id: generateId() as string,
      taskId: taskIdOne,
      completed: false,
      createdAt: new Date(),
    },
    {
      detail: "Exercise: Go for a 30-minute jog or workout at the gym",
      id: generateId() as string,
      taskId: taskIdOne,
      completed: false,
      createdAt: new Date(),
    },

    {
      detail: "Read a book: Spend 1 hour reading a novel or non-fiction book.",
      id: generateId() as string,
      taskId: taskIdTwo,
      completed: false,
      createdAt: new Date(),
    },
    {
      detail:
        "Call a friend: Catch up with a friend you haven't spoken to in a while.",
      id: generateId() as string,
      taskId: taskIdTwo,
      completed: false,
      createdAt: new Date(),
    },
    {
      detail:
        "Plan weekend activities: Decide on activities for the upcoming weekend.",
      id: generateId() as string,
      taskId: taskIdTwo,
      completed: false,
      createdAt: new Date(),
    },

    {
      detail: "Pay bills: Settle utility bills and any outstanding payments.",
      id: generateId() as string,
      taskId: taskIdThree,
      completed: false,
      createdAt: new Date(),
    },
    {
      detail:
        "Learn a new skill: Dedicate 30 minutes to learning a new language or coding.",
      id: generateId() as string,
      taskId: taskIdThree,
      completed: false,
      createdAt: new Date(),
    },
    {
      detail: "Clean the house: Tidy up the living room, kitchen, and bedroom.",
      id: generateId() as string,
      taskId: taskIdThree,
      completed: false,
      createdAt: new Date(),
    },
  ];

  await AsyncStorage.setItem("task", JSON.stringify(sampleTaskList));
  await AsyncStorage.setItem("task-item", JSON.stringify(sampleTaskItemList));
};

export default createSampleData;
