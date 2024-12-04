import React, { useState, useEffect,useContext  } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  Picker,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { UserContext } from "./userContext";
  
const DashboardScreen = () =>
 {
  const { userId } = useContext(UserContext); 
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [isAvailableModalVisible, setAvailableModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    nome: "",
    esporte: "",
    data: "",
    horario: "",
    local: "",
    max_participantes: "",
    nivel_habilidade: "",
  });

  const apiBaseUrl = "http://localhost:3000/api";
 
  // Carregar eventos
  const loadEvents = async (endpoint, setState) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setState(data);
      } else {
        Alert.alert("Erro", "Não foi possível carregar os eventos.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  // Carregar eventos disponíveis 
  const loadAvailableEvents = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/events/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableEvents(data);
      } else {
        Alert.alert("Erro", "Não foi possível carregar os eventos disponíveis.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  // Criar novo evento
  const handleCreateEvent = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/events/organizer/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_organizador: userId,
          ...newEvent,
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Evento criado com sucesso!");
        setCreateModalVisible(false);
        setNewEvent({
          nome: "",
          esporte: "",
          data: "",
          horario: "",
          local: "",
          max_participantes: "",
          nivel_habilidade: "",
        });
        loadEvents(`users/${userId}/upcoming-events`, setUpcomingEvents);
      } else {
        Alert.alert("Erro", "Não foi possível criar o evento.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  // Participar de um evento
  const participateInEvent = async (eventId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/events/${eventId}/participate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: "Confirmado" }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Participação confirmada!");
        loadAvailableEvents(); // Atualiza os eventos disponíveis
      } else {
        Alert.alert("Erro", "Não foi possível participar do evento.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  useEffect(() => {
    loadAvailableEvents();
    loadEvents(`users/${userId}/upcoming-events`, setUpcomingEvents);
    loadEvents(`users/${userId}/subscribed-events`, setSubscribedEvents);
    loadEvents(`users/${userId}/past-events`, setPastEvents);
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Próximos Eventos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        <FlatList
          data={upcomingEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.nome}</Text>
              <Text>{item.data}</Text>
            </View>
          )}
        />
      </View>
  {/* Eventos Inscritos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos Inscritos</Text>
        <FlatList
          data={subscribedEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.nome}</Text>
              <Text>{item.data}</Text>
            </View>
          )}
        />
      </View>

      {/* Eventos Passados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos Passados</Text>
        <FlatList
          data={pastEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.nome}</Text>
              <Text>{item.data}</Text>
            </View>
          )}
        />
      </View>
      {/* Botões de Ação */}
      <View style={styles.actions}>
        <Button
          title="Eventos Disponíveis"
          onPress={() => {
            loadAvailableEvents();
            setAvailableModalVisible(true);
          }}
        />
    </View>
      
    

      {/* Modal com eventos disponíveis */}
      <Modal visible={isAvailableModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Eventos Disponíveis</Text>
          <FlatList
            data={availableEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventCard}>
                <Text>Nome: {item.nome}</Text>
                <Text>Esporte: {item.esporte}</Text>
                <Text>Data: {item.data}</Text>
                <Text>Local: {item.local}</Text>
                <TouchableOpacity
                  style={styles.participateButton}
                  onPress={() => participateInEvent(item.id)}
                >
                  <Text style={styles.participateText}>Participar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Button title="Fechar" onPress={() => setAvailableModalVisible(false)} />
        </View>
      </Modal>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: { backgroundColor: "#f8f9fa", padding: 10, marginBottom: 10, borderRadius: 5 },
  actions: { marginVertical: 20 ,marginBottom: 10},
  modalContainer: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  eventCard: { padding: 15, marginVertical: 10, backgroundColor: "#f8f9fa", borderRadius: 5 },
  participateButton: { marginTop: 10, backgroundColor: "blue", padding: 10, borderRadius: 5 },
  participateText: { color: "#fff", textAlign: "center" },
   button:{ marginBottom: 10}
});

export default DashboardScreen;
