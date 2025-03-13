<template>
  <v-container s>
    <!-- Cabeçalho fixo -->
    <v-row class="d-flex justify-space-between align-center"
      style="position: fixed; top: 0; left: 0; right: 0; padding: 10px; height: 92px; z-index: 1000"
      :style="{ backgroundColor: theme.current.value.colors.background }">
    <v-col class="d-flex align-center" cols="auto" :style="{ marginLeft: !sideBarStore.rail ? '310px' : '60px' }">
      <v-row>
        <v-col class="d-flex align-center justify-start" style="font-size: 18px; max-width: 30px;">
          <v-icon :icon="weather.icon || 'mdi-weather-sunset'" size="24px"></v-icon>
        </v-col>
        <v-col class="d-flex flex-column">
          <p style="font-size: 18px; margin: 0;">{{ weather.temperature }}°C</p>
          <p style="font-size: 14px; margin: 0;">{{ weather.description }}</p>
        </v-col>
      </v-row>
    </v-col>

    <v-col class="d-flex align-center justify-end" cols="auto" style="width: 10;">
      <v-row>
        <v-col class="text-right">
          <p style="font-size: 24px; font-weight: bold; margin: 0;">{{ time }}</p>
          <p style="font-size: 14px; margin: 0;">{{ date }}</p>
        </v-col>
      </v-row>
    </v-col>
    <v-divider></v-divider>
    </v-row>

    <!-- Área principal de conteúdo (router-view) -->
    <v-row style="padding-top: 50px; z-index: 20!important;">
      <router-view />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Inicio from './Inicio.vue';
import { useTheme } from 'vuetify/lib/framework.mjs';
import axios from 'axios';
import { useUserSideBarStore } from '@renderer/store/userSideBarStore';

export default defineComponent({
  name: 'Home',
  componentes: { Inicio },
  setup() {
    const sideBarStore = useUserSideBarStore(); // Usando o store do Pinia corretamente
    const time = ref('');
    const date = ref('');
    const theme = useTheme();
    const weather = ref({
      temperature: '---',
      description: '---',
      icon: 'mdi-weather-sunset'
    });

    const updateTime = () => {
      const now = new Date();
      time.value = now.toLocaleTimeString();
      date.value = now.toLocaleDateString('pt-BR');
    };

    const fetchWeather = async () => {
      try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: -20.3000, // Latitude de Marinópolis, SP
            longitude: -50.4000, // Longitude de Marinópolis, SP
            current_weather: true,
            language: 'pt-BR'
          }
        });
        console.log(response.data);
        const data = response.data.current_weather;
        weather.value = {
          temperature: data.temperature,
          description: getWeatherDescription(data.weathercode),
          icon: getWeatherIcon(data.weathercode)
        };
      } catch (error) {
        console.error('Erro ao obter dados do clima:', error);
      }
    };

    // Função para mapear o código do clima para um ícone
    const getWeatherIcon = (weatherCode: number): string => {
      const weatherIcons: { [key: number]: string } = {
        0: 'mdi-weather-sunny', // Céu limpo
        1: 'mdi-weather-partly-cloudy', // Parcialmente limpo
        2: 'mdi-weather-partly-cloudy', // Paricalmento nublado
        3: 'mdi-weather-cloudy', // Chuvoso
        45: 'mdi-weather-fog', // Nevoeiro
        48: 'mdi-weather-fog', // Nevoeiro
        51: 'mdi-weather-rainy', // Chuva leve
        53: 'mdi-weather-rainy', // Chuva moderada
        55: 'mdi-weather-rainy', // Chuva densa
        56: 'mdi-weather-rainy', // Chuvisco congelante leve
        57: 'mdi-weather-rainy', // Chuvisco congelante denso
        61: 'mdi-weather-rainy', // Chuva leve
        63: 'mdi-weather-rainy', // Chuva moderada
        65: 'mdi-weather-rainy', // Chuva forte
        66: 'mdi-weather-rainy', // Chuva congelante leve
        67: 'mdi-weather-rainy', // Chuva congelante forte
        71: 'mdi-weather-snowy', // Neve leve
        73: 'mdi-weather-snowy', // Neve moderada
        75: 'mdi-weather-snowy', // Neve forte
        77: 'mdi-weather-snowy', // Grãos de neve
        80: 'mdi-weather-rainy', // Chuva leve
        81: 'mdi-weather-rainy', // Chuva moderada
        82: 'mdi-weather-rainy', // Chuva forte
        85: 'mdi-weather-snowy', // Neve leve
        86: 'mdi-weather-snowy', // Neve forte
        95: 'mdi-weather-lightning', // Tempestade leve
        96: 'mdi-weather-lightning', // Tempestade com granizo leve
        99: 'mdi-weather-lightning' // Tempestade com granizo forte
      };
      return weatherIcons[weatherCode] || 'mdi-weather-sunset';
    };

    // Função para mapear o código do clima para uma descrição
    const getWeatherDescription = (weatherCode: number): string => {
      const weatherDescriptions: { [key: number]: string } = {
        0: 'Céu limpo',
        1: 'Parcialmente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Nevoeiro',
        48: 'Nevoeiro',
        51: 'Chuvisco leve',
        53: 'Chuvisco moderado',
        55: 'Chuvisco denso',
        56: 'Chuvisco congelante leve',
        57: 'Chuvisco congelante denso',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        66: 'Chuva congelante leve',
        67: 'Chuva congelante forte',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve forte',
        77: 'Grãos de neve',
        80: 'Chuva leve',
        81: 'Chuva moderada',
        82: 'Chuva forte',
        85: 'Neve leve',
        86: 'Neve forte',
        95: 'Tempestade leve',
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
      };
      return weatherDescriptions[weatherCode] || 'Clima desconhecido';
    };

    onMounted(() => {
      updateTime();
      setInterval(updateTime, 1000);
      fetchWeather();
      setInterval(fetchWeather, 1800000);
    });

    return {
      time,
      date,
      theme,
      sideBarStore,
      weather,
    };
  }
});
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>
