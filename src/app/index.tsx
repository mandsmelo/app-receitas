
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Receita = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
};

export default function Home() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarReceitas() {
      try {
        const resposta = await axios.get(
          'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken'
        );

        setReceitas(resposta.data.meals || []);
      } catch {
        setErro('Erro ao carregar as receitas. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    }

    buscarReceitas();
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#E85D04" />
        <Text>Carregando receitas...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text>{erro}</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.link}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🍗 Receitas com Frango</Text>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item.idMeal}
        ListEmptyComponent={<Text>Nenhuma receita encontrada.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/detalhes',
                params: { id: item.idMeal },
              })
            }
          >
            <Image
              source={{ uri: item.strMealThumb }}
              style={styles.imagem}
            />
            <Text style={styles.nome}>{item.strMeal}</Text>
            <Text style={styles.link}>Ver detalhes →</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 16,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9D3C00',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },
  imagem: {
    width: '100%',
    height: 190,
    borderRadius: 8,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333333',
  },
  link: {
    color: '#E85D04',
    marginTop: 6,
    fontWeight: '600',
  },
});
