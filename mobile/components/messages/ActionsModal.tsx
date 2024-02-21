import { Button, Modal } from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
}

const ActionsModal = (props: Props) => {
  const { isVisible, closeModal } = props;
  const { logOut } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const handleLogout = async () => {
    setLoading(true);
    await logOut();
    AsyncStorage.clear();
    router.push("/");

    setLoading(false);
  };
  return (
    <Modal
      visible={isVisible}
      onDismiss={closeModal}
      contentContainerStyle={styles.containerStyle}
    >
      <Text
        style={{
          fontFamily: "League-Spartan",
          fontSize: 26,
          textAlign: "center",
        }}
      >
        Akcje
      </Text>
      <Button
        mode="outlined"
        style={{ marginTop: 15, marginHorizontal: 50 }}
        onPress={handleLogout}
        loading={loading}
      >
        Wyloguj się
      </Button>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 20,
  },
});

export default ActionsModal;
