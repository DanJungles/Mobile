import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { UserContext } from "./userContext";

const ParticipationsScreen = () => {
  const [participations, setParticipations] = useState([]);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [participationIdToDelete, setParticipationIdToDelete] = useState(null);
  const apiBaseUrl = "http://localhost:3000/api/participations";
  const { userId } = useContext(UserContext);

  // Carregar participações
  const loadParticipations = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setParticipations(data);
      } else {
        Alert.alert("Erro", "Nenhuma participação encontrada.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  // Excluir participação
  const handleDeleteParticipation = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/${participationIdToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        Alert.alert("Sucesso", "Participação excluída com sucesso!");
        setDeleteModalVisible(false);
        setParticipationIdToDelete(null);

        // Atualizar lista localmente sem recarregar
        setParticipations((prev) =>
          prev.filter((item) => item.participacao_id !== participationIdToDelete)
        );
      } else {
        Alert.alert("Erro", "Não foi possível excluir a participação.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  useEffect(() => {
    loadParticipations();
  }, [userId]);

  const renderItem = ({ item }) => (
    <View style={styles.participationCard}>
      <Text>Evento: {item.evento_nome}</Text>
      <Text>Data: {item.data}</Text>
      <Text>Horário: {item.horario}</Text>
      <Text>Local: {item.local}</Text>
      <Text>Participantes: {item.numero_participantes}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setParticipationIdToDelete(item.participacao_id);
          setDeleteModalVisible(true);
        }}
      >
        <Text style={styles.deleteButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Participações</Text>
      <FlatList
        data={participations}
        keyExtractor={(item) => item.participacao_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Nenhuma participação encontrada.</Text>}
      />

      {/* Modal de Confirmação */}
      <Modal visible={isDeleteModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text>Tem certeza que deseja deixar este evento?</Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setDeleteModalVisible(false);
                  setParticipationIdToDelete(null);
                }}
              />
              <Button title="Excluir" color="red" onPress={handleDeleteParticipation} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  participationCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: { color: "#fff", textAlign: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
});

export default ParticipationsScreen;
