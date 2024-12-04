import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';

// Importar as telas
import LoginScreen from './screens/Login';
import DashboardScreen from './screens/Dashboard';
import ProfileScreen from './screens/Profile';
import ParticipationsScreen from './screens/Participations';
import EventsScreen from './screens/MyEvents';
import UsersScreen from './screens/Users';
import LogoutScreen from "./screens/Logout";
import { UserProvider } from "./screens/userContext";

// Criar o Drawer Navigator
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <Drawer.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#212529' },
            headerTintColor: '#fff',
            drawerActiveBackgroundColor: '#212529',
            drawerActiveTintColor: '#fff',
            drawerInactiveTintColor: '#000',
          }}
        >
          {/* Tela de Login como rota inicial, mas oculta no drawer */}
          <Drawer.Screen
            name="Login"
            component={LoginScreen}
            options={{     headerShown: false,drawerItemStyle: { display: 'none' } }}
          />
          {/* Demais telas visíveis no drawer */}
          <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
          <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
          <Drawer.Screen name="Participations" component={ParticipationsScreen} options={{ title: 'Participações' }} />
          <Drawer.Screen name="Events" component={EventsScreen} options={{ title: 'Eventos' }} />
          <Drawer.Screen name="Usuarios" component={UsersScreen} options={{ title: 'Usuários' }} />
               <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: 'Logout' }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
