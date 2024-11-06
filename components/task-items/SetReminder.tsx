import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BottomSheet from "../BottomSheet";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import formatDate from "@/constants/formatDate";
import useTheme from "@/hooks/useTheme";
import Colors from "@/constants/Colors";
import Button from "../Button";
import * as Notifications from "expo-notifications";
import ToastMessage from "@/constants/ToastMessage";
import useTask from "@/hooks/useTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const SetReminder = ({
  visible,
  onClose,
  currentTask,
}: {
  visible: boolean;
  onClose: () => void;
  currentTask?: TaskTypes;
}) => {
  const [date, setDate] = useState(new Date());
  const [timeMode, setTimeMode] = useState<any>();
  const { mode } = useTheme();
  const [loading, setLoading] = useState(false);
  const { allTask, getAllTask } = useTask();
  const [isTaskScheduled, setIsTaskScheduled] = useState<boolean>();
  const timerRef = useRef<number>();

  const getAllScheduledNotifications = async () => {
    const scheduleNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const check = scheduleNotifications.find(
      (item) => currentTask?.notificationId === item.identifier
    );

    setIsTaskScheduled(check ? true : false);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      getAllScheduledNotifications();
      //   console.log(isTaskScheduled);
    }, 1000);

    if (isTaskScheduled === false) clearInterval(timerRef.current);

    return () => clearInterval(timerRef.current);
  }, [isTaskScheduled, timerRef.current]);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    currentDate && setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setTimeMode(currentMode);
    Platform.OS === "android" &&
      DateTimePickerAndroid.open({
        minimumDate: new Date(),
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: false,
      });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const scheduleReminder = async () => {
    try {
      setLoading(true);
      if (Date.now() >= Date.parse(date.toString()))
        throw new Error(
          "Invalid date: Current Date/Time should be lesser than the Reminder Date/Time"
        );

      const settings = await Notifications.getPermissionsAsync();
      if (!settings.granted) {
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
      }

      date.setSeconds(0);
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hey Champ, Your Next Task is Calling!",
          body: currentTask?.title,
          data: { data: currentTask },
        },
        trigger: { date },
      });

      if (currentTask) {
        currentTask.notificationId = identifier;
        currentTask.notificationDate = date;
      }

      await AsyncStorage.setItem(
        "task",
        JSON.stringify(allTask.taskList.reverse())
      );
      await getAllTask();
      await getAllScheduledNotifications();

      ToastMessage({
        type: "success",
        text1: "Reminder set successfully",
        text2: `Remider set to ${formatDate(date)}`,
      });
      onClose();
    } catch (error: any) {
      ToastMessage({
        type: "error",
        text1: "Error: Increase Time or Date",
        text2: error.message,
        onPress: () => alert(error.message),
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelReminder = async () => {
    try {
      setLoading(true);
      if (currentTask?.notificationId)
        await Notifications.cancelScheduledNotificationAsync(
          currentTask.notificationId
        );
      await getAllScheduledNotifications();
    } catch (error: any) {
      ToastMessage({
        type: "error",
        text1: "Error",
        text2: error.message,
        onPress: () => alert(error.message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      style={{ ...styles.container, gap: 25 }}
      onClose={onClose}
      visible={visible}
    >
      {isTaskScheduled && (
        <Ionicons
          name="alarm-outline"
          size={100}
          color={Colors[mode].primary}
        />
      )}

      <Text style={{ ...styles.dateText, color: Colors[mode].text }}>
        {isTaskScheduled
          ? `Upcoming Reminder: ${formatDate(
              Date.parse(currentTask?.notificationDate?.toString() || "")
            )}`
          : formatDate(date)}
      </Text>

      {Platform.OS === "ios" && !isTaskScheduled && (
        <View style={{ alignItems: "center", gap: 10, width: "90%" }}>
          <DateTimePicker
            minimumDate={new Date()}
            testID="dateTimePicker"
            value={date}
            mode={timeMode}
            is24Hour={true}
            onChange={onChange}
            accentColor={Colors[mode].primary}
            style={{
              backgroundColor: "#fecaca",
              borderRadius: 4,
              overflow: "hidden",
              width: "auto",
            }}
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button
              small
              style={{ flex: 1 }}
              onPress={() => setTimeMode("date")}
              title="Elegir fecha"
              outline={timeMode !== "date"}
            />
            <Button
              small
              style={{ flex: 1 }}
              onPress={() => setTimeMode("time")}
              title="Elige Hora"
              outline={timeMode !== "time"}
            />
          </View>
        </View>
      )}

      {Platform.OS === "android" && !isTaskScheduled && (
        <View style={{ alignItems: "center", gap: 10, width: "90%" }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button
              small
              style={{ flex: 1 }}
              title="Set Date"
              outline={timeMode !== "date"}
              onPress={() => showDatepicker()}
            />
            <Button
              small
              style={{ flex: 1 }}
              title="Set Time"
              outline={timeMode !== "time"}
              onPress={() => showTimepicker()}
            />
          </View>
        </View>
      )}

      <Button
        loading={loading}
        style={{ width: "90%" }}
        title={isTaskScheduled ? "Cancelar recordatorio" : "Establecer recordatorio"}
        onPress={isTaskScheduled ? cancelReminder : scheduleReminder}
      />
    </BottomSheet>
  );
};

export default SetReminder;

const styles = StyleSheet.create({
  container: { height: "60%", justifyContent: "center", alignItems: "center" },

  dateText: {
    fontFamily: "Satoshi-Bold",
    fontSize: 20,
    width: "90%",
    textAlign: "center",
  },
});
