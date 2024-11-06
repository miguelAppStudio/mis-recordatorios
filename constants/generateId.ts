import uuid from "react-native-uuid";

const generateId = () => {
  return uuid.v4();
};

export default generateId;
