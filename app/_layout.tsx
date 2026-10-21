import { Stack } from "expo-router";
import "react-native-reanimated";

import {
  AuthProvider,
  useAuth
} from "./src/context/AuthContext";


function RootNavigator() {
  const { token, isLoadingSession } = useAuth();

  if (isLoadingSession) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>

      {/* Solo usuarios autenticados */}
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(protected)" />
        
      </Stack.Protected>

      {/* Solo usuarios NO autenticados */}
      <Stack.Protected guard={!token}>
        <Stack.Screen name="(public)" />
      </Stack.Protected>

    </Stack>
  );
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}