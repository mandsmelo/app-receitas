import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Receitas', headerShown: true }}
      />
      <Stack.Screen
        name="detalhes"
        options={{ title: 'Detalhes da Receita' }}
      />
    </Stack>
  );
}