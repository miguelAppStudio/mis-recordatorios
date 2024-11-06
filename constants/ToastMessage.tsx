import Toast, { ToastPosition } from "react-native-toast-message";

interface ToastMessageProp {
  type: "error" | "success" | "info";
  text1?: string;
  text2?: string;
  onPress?: () => void;
  visibilityTime?: number;
  position?: ToastPosition;
}

const ToastMessage = (props: ToastMessageProp) => {
  Toast.show(props);
};

export default ToastMessage;
