import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

const Tag = ({
  tagName,
  tagCount,
  onPress,
  active,
}: {
  tagName: string;
  tagCount: number;
  active?: boolean;
  onPress?: () => void;
}) => {
  const { mode } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        ...styles.tag,
        backgroundColor: active
          ? Colors[mode].textSecondary
          : Colors[mode].backgroundSecondary,
      }}
    >
      <Text
        style={{
          ...styles.tagText,
          color: active
            ? Colors[mode].backgroundSecondary
            : Colors[mode].textSecondary,
        }}
      >
        {tagName}
      </Text>

      <View
        style={{
          ...styles.tagCount,
          backgroundColor: active ? Colors[mode].text : Colors[mode].background,
        }}
      >
        <Text
          style={{
            ...styles.tagCountText,
            color: active
              ? Colors[mode].backgroundSecondary
              : Colors[mode].textSecondary,
          }}
        >
          {tagCount}
        </Text>
      </View>
    </Pressable>
  );
};

const Tags = ({ taskList }: { taskList: TaskTypes[] }) => {
  const [tagList, setTagList] = useState<string[]>([]);

  useEffect(() => {
    for (const list of taskList) {
      setTagList([...tagList, ...list.tags]);
    }
  }, []);

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      exiting={FadeOutDown.duration(500)}
      style={styles.container}
    >
      <FlatList
        ListHeaderComponent={
          <Tag tagName={`Todas las tareas`} tagCount={taskList.length} active />
        }
        contentContainerStyle={{ gap: 13 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tagList}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <Tag tagName={`#${item}`} tagCount={index} />
        )}
      />
    </Animated.View>
  );
};

export default Tags;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "5%",
  },

  tag: {
    padding: 12,
    borderRadius: 27,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },

  tagText: {
    fontSize: 18,
    fontFamily: "Satoshi-Medium",
  },

  tagCountText: {
    fontSize: 14,
    fontFamily: "Satoshi-Medium",
  },

  tagCount: {
    padding: 3,
    borderRadius: 999999,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    height: 30,
    width: 30,
  },
});
