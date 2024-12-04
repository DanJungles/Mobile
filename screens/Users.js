import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const UsuariosScreen = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({ nome: "", email: "", senha: "" });

  const apiBaseUrl = "http://localhost:3000/api/users";

  // Carrega a lista de usuários
  const loadUsers = async () => {
    try {
      const response = await fetch(apiBaseUrl);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        Alert.alert("Erro", "Não foi possível carregar os usuários.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  // Salva ou edita o usuário
  const handleSaveUser = async () => {
    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser ? `${apiBaseUrl}/${editingUser.id}` : apiBaseUrl;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert("Sucesso", editingUser ? "Usuário atualizado!" : "Usuário criado!");
        setModalVisible(false);
        setFormData({ nome: "", email: "", senha: "" });
        setEditingUser(null);
        loadUsers();
      } else {
        Alert.alert("Erro", "Não foi possível salvar o usuário.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  // Exclui um usuário
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/${userToDelete.id}`, { method: "DELETE" });

      if (response.ok) {
        Alert.alert("Sucesso", "Usuário excluído com sucesso!");
        setDeleteModalVisible(false);
        setUserToDelete(null);
        loadUsers();
      } else {
        Alert.alert("Erro", "Não foi possível excluir o usuário.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openModal = ()=>{
     setFormData({ nome: "", email: "", senha: "" });
    setModalVisible(true)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Usuários</Text>
  <View  style={styles.button}>
      <Button title="Adicionar Usuário" onPress={() => openModal()} />
  </View>
      {/* Lista de usuários */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text>ID: {item.id}</Text>
            <Text>Nome: {item.nome}</Text>
            <Text>Email: {item.email}</Text>
            <View style={styles.actions}>
              <Button
                title="Editar"
                onPress={() => {
                  setEditingUser(item);
                  setFormData({ nome: item.nome, email: item.email, senha: "" });
                  setModalVisible(true);
                }}
              />
              <Button
                title="Excluir"
                color="red"
                onPress={() => {
                  setUserToDelete(item);
                  setDeleteModalVisible(true);
                }}
              />
            </View>
          </View>
        )}
      />

      {/* Modal para criar/editar usuário */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editingUser ? "Editar Usuário" : "Adicionar Usuário"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
          />
          {!editingUser && (
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={formData.senha}
              onChangeText={(text) => setFormData({ ...formData, senha: text })}
              secureTextEntry
            />
          )}
          <View style={styles.button}>
          <Button title="Salvar" onPress={handleSaveUser} />
          </View>
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal visible={isDeleteModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle,styles.button}>Confirmação de Exclusão</Text>
          <Text>Tem certeza que deseja excluir o usuário {userToDelete?.nome}?</Text>
            <View style={styles.button}>
          <Button title="Excluir" color="red" onPress={handleDeleteUser} />
           </View>
          <Button title="Cancelar" onPress={() => setDeleteModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  userCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalContainer: { flex: 1, padding: 20, justifyContent: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  button:{marginBottom: 10, marginTop:10}
});

export default UsuariosScreen;
