import { FlatList, StyleSheet, View, Platform } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import Header from "@/components/home/Header";
import Tags from "@/components/home/Tags";
import PinedTask from "@/components/home/PinedTask";
import TaskCard from "@/components/home/TaskCard";
import Button from "@/components/Button";
import AddTaskButton from "@/components/home/AddTaskButton";
import useTask from "@/hooks/useTask";
import InputText from "@/components/InputText";

import * as Notifications from "expo-notifications";
import ToastMessage from "@/constants/ToastMessage";

const Home = ({ navigation }: { navigation: any }) => {
  const { allTask } = useTask();
  const [searchMode, setSearchMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<TaskTypes[]>([]);

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const title = notification.request.content.title;
        const body = notification.request.content.body;
        const identify = notification.request.identifier;
        const { data } = notification.request.content.data;
        Platform.OS === "android" &&
          ToastMessage({
            type: "success",
            text1: title || "",
            text2: body || "",
            onPress: () => navigation.navigate("TaskItems", { id: data.id }),
          });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const title = response.notification.request.content.title;
        const body = response.notification.request.content.body;
        const identify = response.notification.request.identifier;
        const { data } = response.notification.request.content.data;
        setTimeout(() => {
          navigation.navigate("TaskItems", { id: data.id });
        }, 1500);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const searchInputChangeHandler = (value: string) => {
    const taskListCopy = [...allTask.taskList];
    const filteredTask = taskListCopy.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setSearchInput(value);
    setSearchResult(filteredTask);
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        setSearchInput={setSearchInput}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
      />

      {searchMode && (
        <InputText
          autoFocus
          containerStyle={{ marginVertical: "4.2%", width: "90%" }}
          value={searchInput}
          onChangeText={searchInputChangeHandler}
        />
      )}

      {!searchMode && <Tags taskList={allTask?.taskList || []} />}

      {allTask.pinedTask && !searchMode && (
        <PinedTask navigation={navigation} task={allTask.pinedTask} />
      )}

      <FlatList
        initialNumToRender={5}
        showsHorizontalScrollIndicator={false}
        style={{ width: "90%" }}
        horizontal
        contentContainerStyle={{
          flexDirection: "row",
          gap: 10,
        }}
        data={
          searchInput.trim().length <= 0 ? allTask.unPinedTask : searchResult
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard navigation={navigation} task={item} />
        )}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 5, // adjust as needed
        }}
      />

      <Button
        small
        style={{ width: "90%", marginBottom: "2%" }}
        title="Valoranos"
        onPress={() => {}}
      />

      <AddTaskButton navigation={navigation} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    flex: 1,
  },
});
