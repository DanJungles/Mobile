import React, { useEffect, useState ,useContext} from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importando o Picker
import { UserContext } from "./userContext";

const ProfileScreen = () => {
  const [user, setUser] = useState({});
  const [sports, setSports] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("");

   const { userId } = useContext(UserContext); ; // Substitua pela lógica para obter o userId
  const apiUrl = "http://localhost:3000/api/users";
  const sportsApiUrl = "http://localhost:3000/api/sports";

  // Carrega o perfil do usuário
  const loadProfile = async () => {
    try {
      const response = await fetch(`${apiUrl}/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        Alert.alert("Erro", "Erro ao carregar o perfil.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  };

  // Carrega esportes do usuário
  const loadSports = async () => {
    try {
      const response = await fetch(`${sportsApiUrl}/${userId}`);
      if (response.ok) {
        const sportsData = await response.json();
        setSports(sportsData);
      } else {
        Alert.alert("Erro", "Erro ao carregar esportes.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  };

  // Adicionar esporte
  const addSport = async () => {
 

    try {
      const response = await fetch(sportsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: userId,
          id_esporte: selectedSport,
          nivel_habilidade: selectedSkillLevel,
        }),
      });
      if (response.ok) {
        //Alert.alert("Sucesso", "Esporte adicionado com sucesso!");
        setModalVisible(false);
        loadSports();
      } else {
        const { error } = await response.json();
        Alert.alert("Erro", `Erro ao adicionar esporte: ${error}`);
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  };

  // Excluir esporte
  const deleteSport = async (id) => {
    try {
      const response = await fetch(`${sportsApiUrl}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        Alert.alert("Sucesso", "Esporte excluído com sucesso!");
        loadSports();
      } else {
        Alert.alert("Erro", "Erro ao excluir esporte.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  };

  useEffect(() => {
    loadProfile();
    loadSports();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <TextInput
        style={styles.input}
        value={user.nome || ""}
        editable={false}
        placeholder="Nome"
      />
      <TextInput
        style={styles.input}
        value={user.email || ""}
        editable={false}
        placeholder="Email"
      />

      <FlatList
        data={sports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.sportItem}>
            <Text>{item.esporte_nome}</Text>
            <Text>{item.nivel_habilidade}</Text>
            <Button
              title="Excluir"
              color="red"
              onPress={() => deleteSport(item.id)}
            />
          </View>
        )}
      />

      <Button
        title="Gerenciar Esportes"
        onPress={() => setModalVisible(true)}
      />

      {/* Modal de Gerenciar Esportes */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar Esporte</Text>

          {/* Picker para Esporte */}
          <Picker
            selectedValue={selectedSport}
            onValueChange={(itemValue) => setSelectedSport(itemValue)}
            style={styles.picker}
          >
           <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Futebol" value="1" />
            <Picker.Item label="Basquete" value="2" />
            <Picker.Item label="Vôlei" value="3" />
            <Picker.Item label="Tênis" value="4" />
            <Picker.Item label="Natação" value="5" />
          </Picker>

          {/* Picker para Nível de Habilidade */}
          <Picker
            selectedValue={selectedSkillLevel}
            onValueChange={(itemValue) => setSelectedSkillLevel(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Iniciante" value="iniciante" />
            <Picker.Item label="Intermediário" value="intermediário" />
            <Picker.Item label="Avançado" value="avançado" />
          </Picker>

          <Button title="Adicionar" onPress={addSport} />
          <Button
            title="Fechar"
            onPress={() => setModalVisible(false)}
            color="gray"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  sportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  picker: {
    width: 250,
    height: 50,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});

export default ProfileScreen;
