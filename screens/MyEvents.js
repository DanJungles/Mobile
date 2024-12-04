import React, { useState, useEffect,useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  Picker,
  Alert,
  StyleSheet,
} from "react-native";
import { UserContext } from "./userContext";

const EventosScreen = () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    esporte: "",
    data: "",
    horario: "",
    local: "",
    max_participantes: "",
    nivel_habilidade: "",
  });

  const apiUrl = "http://localhost:3000/api/events";
   const { userId } = useContext(UserContext); // Exemplo de ID do usuário
 console.log(userId)
  // Carregar eventos
  const loadEvents = async () => {
    try {
      const response = await fetch(`${apiUrl}/organizer/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        Alert.alert("Erro", "Não foi possível carregar os eventos.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  // Salvar evento
  const handleSaveEvent = async () => {
    const method = selectedEvent ? "PUT" : "POST";
    const url = selectedEvent
      ? `${apiUrl}/${selectedEvent.id}`
      : `${apiUrl}/organizer/${userId}`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id_organizador: userId,
        }),
      });

      if (response.ok) {
        Alert.alert(
          "Sucesso",
          selectedEvent ? "Evento atualizado!" : "Evento criado!"
        );
        setModalVisible(false);
        setFormData({
          nome: "",
          esporte: "",
          data: "",
          horario: "",
          local: "",
          max_participantes: "",
          nivel_habilidade: "",
        });
        setSelectedEvent(null);
        loadEvents();
      } else {
        Alert.alert("Erro", "Não foi possível salvar o evento.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  // Excluir evento
  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`${apiUrl}/${selectedEvent.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Evento excluído!");
        setDeleteModalVisible(false);
        setSelectedEvent(null);
        loadEvents();
      } else {
        Alert.alert("Erro", "Não foi possível excluir o evento.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Eventos</Text>
      <Button
        title="Criar Evento"
        onPress={() => {
          setFormData({
            nome: "",
            esporte: "",
            data: "",
            horario: "",
            local: "",
            max_participantes: "",
            nivel_habilidade: "",
          });
          setSelectedEvent(null);
          setModalVisible(true);
        }}
      />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text>Nome: {item.nome}</Text>
            <Text>Esporte: {item.esporte}</Text>
            <Text>Data: {item.data}</Text>
            <Text>Local: {item.local}</Text>
            <Text>Participantes: {item.max_participantes}</Text>
            <Text style={styles.button}>Nível: {item.nivel_habilidade}</Text>
            <View style={styles.actionButtons}>
              <Button
                title="Editar"
                onPress={() => {
                  setFormData({
                    nome: item.nome,
                    esporte: item.id_esporte,
                    data: item.data,
                    horario: item.horario,
                    local: item.local,
                    max_participantes: item.max_participantes,
                    nivel_habilidade: item.nivel_habilidade,
                  });
                  setSelectedEvent(item);
                  setModalVisible(true);
                }}
              />
              <Button
                title="Excluir"
                color="red"
                onPress={() => {
                  setSelectedEvent(item);
                  setDeleteModalVisible(true);
                }}
              />
            </View>
          </View>
        )}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {selectedEvent ? "Editar Evento" : "Criar Evento"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Evento"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
          />
          <Picker
            selectedValue={formData.esporte}
            onValueChange={(value) =>
              setFormData({ ...formData, esporte: value })
            }
            style={styles.input}
          >
            <Picker.Item label="Selecione o esporte" value="" />
            <Picker.Item label="Futebol" value="1" />
            <Picker.Item label="Basquete" value="2" />
            <Picker.Item label="Vôlei" value="3" />
            <Picker.Item label="Tênis" value="4" />
            <Picker.Item label="Natação" value="5" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Data"
            value={formData.data}
            onChangeText={(text) => setFormData({ ...formData, data: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Horário"
            value={formData.horario}
            onChangeText={(text) => setFormData({ ...formData, horario: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Local"
            value={formData.local}
            onChangeText={(text) => setFormData({ ...formData, local: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Máx. Participantes"
            value={formData.max_participantes}
            onChangeText={(text) =>
              setFormData({ ...formData, max_participantes: text })
            }
            keyboardType="numeric"
          />
          <Picker
            selectedValue={formData.nivel_habilidade}
            onValueChange={(value) =>
              setFormData({ ...formData, nivel_habilidade: value })
            }
            style={styles.input}
          >
            <Picker.Item label="Selecione o nível" value="" />
            <Picker.Item label="Iniciante" value="iniciante" />
            <Picker.Item label="Intermediário" value="intermediario" />
            <Picker.Item label="Avançado" value="avancado" />
          </Picker>
          <View style={styles.button}>
                    <Button title="Salvar" onPress={handleSaveEvent} />
          </View>
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <Modal visible={deleteModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Tem certeza que deseja excluir este evento?</Text>
          <Button title="Excluir" color="red" onPress={handleDeleteEvent} />
          <Button
            title="Cancelar"
            onPress={() => setDeleteModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  eventCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
  },
  actionButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalContainer: { flex: 1, padding: 20, justifyContent: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  button:{marginBottom:10}
});

export default EventosScreen;
