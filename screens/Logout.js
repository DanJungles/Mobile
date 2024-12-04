import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { UserContext } from "./userContext";

const LogoutScreen = ({ navigation }) => {
  const { setUserId } = useContext(UserContext); // Acessa o contexto para limpar o userId

  const handleLogout = () => {
    setUserId(null); // Limpa o ID do usuário no contexto
    navigation.navigate("Login"); // Redireciona para a tela de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Tem certeza de que deseja sair?</Text>
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default LogoutScreen;
