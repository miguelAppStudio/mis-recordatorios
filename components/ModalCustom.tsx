import { StyleSheet, Modal, View, ModalProps } from "react-native";
import React from "react";

interface ModalCustomProps {
  propsModal: ModalProps;
  children: React.ReactNode;
}

const ModalCustom = (props: ModalCustomProps) => {
  const { propsModal, children } = props;

  return (
    <Modal {...propsModal}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: "100%",
        }}
      >
        {children}
      </View>
    </Modal>
  );
};

export default ModalCustom;

const styles = StyleSheet.create({});
