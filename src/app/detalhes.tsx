
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
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

export default function Detalhes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [receita, setReceita] = useState<Receita | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarReceita() {
      try {
        const resposta = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );

        setReceita(resposta.data.meals?.[0] || null);
      } catch (error) {
        console.log('Erro ao buscar detalhes:', error);
      } finally {
        setCarregando(false);
      }
    }

    if (id) {
      buscarReceita();
    } else {
      setCarregando(false);
    }
  }, [id]);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#E85D04" />
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!receita) {
    return (
      <View style={styles.centro}>
        <Text>Não foi possível encontrar esta receita.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: receita.strMealThumb }}
        style={styles.imagem}
      />

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{receita.strMeal}</Text>
        <Text style={styles.info}>
          Categoria: {receita.strCategory || 'Não informada'}
        </Text>
        <Text style={styles.info}>
          Origem: {receita.strArea || 'Não informada'}
        </Text>

        <Text style={styles.subtitulo}>Modo de preparo</Text>
        <Text style={styles.descricao}>
          {receita.strInstructions || 'Instruções não disponíveis.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  imagem: {
    width: '100%',
    height: 280,
  },
  conteudo: {
    padding: 20,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#9D3C00',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  descricao: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444444',
    textAlign: 'justify',
  },
});
