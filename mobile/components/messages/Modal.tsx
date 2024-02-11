import { Button, Modal } from "react-native-paper";
import { StyleSheet, Text } from "react-native";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
}

const GroupModal = (props: Props) => {
  const { isVisible, closeModal } = props;
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
        Actions
      </Text>
      <Button mode="outlined" style={{ marginTop: 15, marginHorizontal: 50 }}>
        Log out
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

export default GroupModal;
