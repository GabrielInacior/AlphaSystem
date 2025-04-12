<template>
  <v-container s>
    <!-- Cabeçalho fixo -->
    <v-row class="navbar-container"
      style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000;">
      <div class="navbar-content">
        <!-- Clima (Lado Esquerdo) -->
        <div class="weather-section" :style="{ marginLeft: !sideBarStore.rail ? '310px' : '60px' }">
          <v-card class="weather-card" variant="flat">
            <v-row no-gutters>
              <v-col class="d-flex align-center justify-start px-2" style="max-width: 40px;">
                <v-icon :icon="weather.icon || 'mdi-weather-sunset'" size="24px" color="primary"></v-icon>
              </v-col>
              <v-col class="d-flex flex-column">
                <p class="weather-temp">{{ weather.temperature }}°C</p>
                <p class="weather-desc">{{ weather.description }}</p>
              </v-col>
            </v-row>
          </v-card>
        </div>

        <v-spacer></v-spacer>

        <!-- Ações (Lado Direito) -->
        <div class="actions-section">
          <!-- Relógio e Data -->
          <v-card class="time-card" variant="flat">
            <div class="time-container">
              <p class="time-text">{{ time }}</p>
              <p class="date-text">{{ date }}</p>
            </div>
          </v-card>

          <v-divider vertical class="mx-4 divider-height"></v-divider>

          <!-- Grupo de Botões -->
          <div class="button-group">
            <!-- Botão de Tema -->
            <v-btn
              :color="currentTheme === 'light' ? 'primary' : 'warning'"
              variant="tonal"
              class="action-btn theme-btn"
              @click="toggleTheme"
            >
              <v-icon :icon="currentTheme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" class="action-icon"></v-icon>
              <span class="action-text">{{ currentTheme === 'light' ? 'Modo Claro' : 'Modo Escuro' }}</span>
            </v-btn>

            <!-- Botão de Desligar -->
            <v-btn
              color="error"
              variant="tonal"
              class="action-btn power-btn ml-2"
              @click="logout"
            >
              <v-icon icon="mdi-power" class="action-icon"></v-icon>
              <span class="action-text">Sair</span>
            </v-btn>
          </div>
        </div>
      </div>
    </v-row>

    <!-- Área principal de conteúdo (router-view) -->
    <v-row style="padding-top: 20px; z-index: 20!important;">
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

declare global {
  interface Window {
    api: {
      closeWindow: () => void;
    };
  }
}

export default defineComponent({
  name: 'Home',
  componentes: { Inicio },
  setup() {
    const sideBarStore = useUserSideBarStore();
    const time = ref('');
    const date = ref('');
    const theme = useTheme();
    const currentTheme = ref('light');
    const weather = ref({
      temperature: '---',
      description: '---',
      icon: 'mdi-weather-sunset'
    });

    const toggleTheme = () => {
      const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
      currentTheme.value = newTheme;
      theme.global.name.value = newTheme;
    };

    const logout = () => {
      if (window.api && typeof window.api.closeWindow === 'function') {
        window.api.closeWindow();
      }
    };

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
      currentTheme,
      toggleTheme,
      logout
    };
  }
});
</script>

<style scoped>
.navbar-container {
  width: 100%;
  height: 70px;
  background: rgba(var(--v-theme-background), 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.navbar-content {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
  padding: 0 24px;
  width: 100%;
}

.weather-section {
  display: flex;
  align-items: center;
}

.weather-card {
  background: rgba(var(--v-theme-surface), 0.5) !important;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.weather-card:hover {
  background: rgba(var(--v-theme-surface), 0.7) !important;
  transform: translateY(-1px);
}

.weather-temp {
  font-size: 18px;
  margin: 0;
  font-weight: 500;
  line-height: 1.2;
}

.weather-desc {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
  line-height: 1.2;
}

.actions-section {
  display: flex;
  align-items: center;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 12px;
  padding: 8px 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  transition: all 0.3s ease;
}

.actions-section:hover {
  background: rgba(var(--v-theme-surface), 0.7);
  transform: translateY(-1px);
}

.time-card {
  background: transparent !important;
  width: auto;
}

.time-container {
  text-align: right;
  padding: 0 4px;
}

.time-text {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.date-text {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
  line-height: 1.2;
}

.divider-height {
  height: 40px;
  opacity: 0.2;
}

.button-group {
  display: flex;
  align-items: center;
}

.action-btn {
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.action-icon {
  margin-right: 8px;
  font-size: 20px;
}

.action-text {
  font-size: 14px;
  font-weight: 500;
}

.theme-btn {
  background: rgba(var(--v-theme-primary), 0.1);
}

.theme-btn:hover {
  background: rgba(var(--v-theme-primary), 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.power-btn {
  background: rgba(var(--v-theme-error), 0.1);
}

.power-btn:hover {
  background: rgba(var(--v-theme-error), 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
