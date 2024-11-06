import BottomSheet from "../BottomSheet";

import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import InputText from "../InputText";
import Button from "../Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useTask from "@/hooks/useTask";

const EditItemModal = ({
  editItemModal,
  setEditItemModal,
  currentTaskItem,
}: {
  editItemModal: boolean;
  setEditItemModal: (value: boolean) => void;
  currentTaskItem?: TaskItemTypes;
}) => {
  const [editInput, setEditInput] = useState("");
  const { allTaskItem, getAllTaskItem } = useTask();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditInput(currentTaskItem?.detail || "");
  }, [currentTaskItem?.detail]);

  const editItemHandler = async () => {
    try {
      const theTaskItem: TaskItemTypes | undefined = allTaskItem.find(
        (item: TaskItemTypes) => currentTaskItem?.id === item.id
      );

      theTaskItem && (theTaskItem.detail = editInput);
      await AsyncStorage.setItem(
        "task-item",
        JSON.stringify(allTaskItem.reverse())
      );
      await getAllTaskItem();
      setEditItemModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      visible={editItemModal}
      onClose={() => setEditItemModal(false)}
      style={{}}
    >
      <View style={{ padding: 10, gap: 10 }}>
        <InputText onChangeText={setEditInput} value={editInput} autoFocus />

        <Button
          loading={loading}
          onPress={editItemHandler}
          title="Update"
          small
        />
      </View>
    </BottomSheet>
  );
};

export default EditItemModal;

const styles = StyleSheet.create({});
