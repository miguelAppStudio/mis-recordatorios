import Colors from "@/constants/Colors";
import createSampleData from "@/constants/createSampleData";
import useTask from "@/hooks/useTask";
import useTheme from "@/hooks/useTheme";
import Home from "@/screens/Home";
import Setting from "@/screens/Setting";
import TaskItems from "@/screens/TaskItems";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();

const Navigations = () => {
  const { mode } = useTheme();
  const { getAllTask, getAllTaskItem } = useTask();

  useEffect(() => {
    const fetchData = async () => {
      // await AsyncStorage.multiRemove(["task", "task-item", "theme-mode"]);
      const storedTask = await AsyncStorage.getItem("task");
      const storedTaskItem = await AsyncStorage.getItem("task-item");

      if (!storedTask && !storedTaskItem) {
        //create sample
        await createSampleData();
      }

      await getAllTask();
      await getAllTaskItem();
    };
    fetchData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        detachInactiveScreens={false}
        screenOptions={{
          presentation: Platform.OS === "android" ? "transparentModal" : "card",
          headerShown: false,
          cardStyle: { backgroundColor: Colors[mode].background },
          cardOverlayEnabled: false,
          cardStyleInterpolator:
            Platform.OS === "ios"
              ? CardStyleInterpolators.forHorizontalIOS
              : CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="TaskItems" component={TaskItems} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigations;
