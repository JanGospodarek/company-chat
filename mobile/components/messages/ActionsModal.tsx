import { Button, Modal, ToggleButton } from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/uiSlice";
import { useAppTheme } from "../ThemeProvider";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
}

const ActionsModal = (props: Props) => {
  const { isVisible, closeModal } = props;
  const { logOut } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const selectedTheme = useAppSelector((state) => state.ui.theme);
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    setLoading(true);
    await logOut();
    AsyncStorage.clear();
    setLoading(false);

    router.push("/");
  };
  return (
    <Modal
      visible={isVisible}
      onDismiss={closeModal}
      contentContainerStyle={{
        ...styles.containerStyle,
        backgroundColor: theme.colors.backgroundSecondary,
        borderWidth: 4,
        borderColor: theme.colors.optionalBorderColor,
      }}
    >
      <Text
        style={{
          fontFamily: "League-Spartan",
          fontSize: 26,
          textAlign: "center",
          color: theme.colors.primaryFont,
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
      <View style={{ marginTop: 10 }}>
        <ToggleButton.Row
          onValueChange={(value) => dispatch(setTheme(value))}
          value={selectedTheme}
          style={{ borderColor: theme.colors.primary }}
        >
          <ToggleButton
            icon="format-align-left"
            value="normal"
            style={{ borderColor: theme.colors.primary }}
            iconColor={theme.colors.primary}
          />
          <ToggleButton
            icon="format-align-right"
            value="highContrast"
            iconColor={theme.colors.primary}
            style={{ borderColor: theme.colors.primary }}
          />
        </ToggleButton.Row>
      </View>
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
