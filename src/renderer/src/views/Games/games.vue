<template>
  <v-container fluid class="games-container pa-6">
    <!-- Header Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Área de Jogos
                <v-tooltip location="bottom" max-width="400">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-help-circle"
                      variant="text"
                      color="white"
                      size="small"
                      class="ml-2"
                      v-bind="props"
                    />
                  </template>
                  <div class="pa-2">
                    <p class="mb-2"><strong>Como jogar:</strong></p>
                    <ul class="ml-2">
                      <li>Selecione um dos jogos clássicos disponíveis</li>
                      <li>Use as teclas direcionais ou mouse para controlar</li>
                      <li>Tente bater seu próprio recorde!</li>
                      <li>Divirta-se nos momentos de pausa</li>
                    </ul>
                  </div>
                </v-tooltip>
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Relaxe e divirta-se com nossos jogos clássicos
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-icon size="36" color="white">mdi-gamepad-variant</v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Games Grid -->
    <v-row class="mt-4">
      <!-- Snake -->
      <v-col cols="12" md="4">
        <v-card
          class="game-card"
          elevation="2"
          @click="selectGame('snake')"
          :class="{ 'selected': selectedGame === 'snake' }"
        >
          <v-card-text class="d-flex align-center pa-6">
            <div class="game-icon mr-6">
              <v-icon size="48" :color="selectedGame === 'snake' ? 'white' : 'primary'">mdi-snake</v-icon>
            </div>
            <div>
              <div :class="['text-h5', 'font-weight-bold', 'mb-1', selectedGame === 'snake' ? 'text-white' : 'text-primary']">
                Snake
              </div>
              <div :class="['text-body-2', selectedGame === 'snake' ? 'text-white' : 'text-medium-emphasis']">
                O clássico jogo da cobrinha
              </div>
              <div class="mt-2">
                <v-chip
                  size="small"
                  :color="selectedGame === 'snake' ? 'white' : 'primary'"
                  :text-color="selectedGame === 'snake' ? 'primary' : 'white'"
                  variant="flat"
                >
                  Recorde: {{ snakeHighScore }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Pong -->
      <v-col cols="12" md="4">
        <v-card
          class="game-card"
          elevation="2"
          @click="selectGame('pong')"
          :class="{ 'selected': selectedGame === 'pong' }"
        >
          <v-card-text class="d-flex align-center pa-6">
            <div class="game-icon mr-6">
              <v-icon size="48" :color="selectedGame === 'pong' ? 'white' : 'primary'">mdi-table-tennis</v-icon>
            </div>
            <div>
              <div :class="['text-h5', 'font-weight-bold', 'mb-1', selectedGame === 'pong' ? 'text-white' : 'text-primary']">
                Pong
              </div>
              <div :class="['text-body-2', selectedGame === 'pong' ? 'text-white' : 'text-medium-emphasis']">
                O primeiro sucesso dos videogames
              </div>
              <div class="mt-2">
                <v-chip
                  size="small"
                  :color="selectedGame === 'pong' ? 'white' : 'primary'"
                  :text-color="selectedGame === 'pong' ? 'primary' : 'white'"
                  variant="flat"
                >
                  Recorde: {{ pongHighScore }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Flappy Bird -->
      <v-col cols="12" md="4">
        <v-card
          class="game-card"
          elevation="2"
          @click="selectGame('flappy')"
          :class="{ 'selected': selectedGame === 'flappy' }"
        >
          <v-card-text class="d-flex align-center pa-6">
            <div class="game-icon mr-6">
              <v-icon size="48" :color="selectedGame === 'flappy' ? 'white' : 'primary'">mdi-bird</v-icon>
            </div>
            <div>
              <div :class="['text-h5', 'font-weight-bold', 'mb-1', selectedGame === 'flappy' ? 'text-white' : 'text-primary']">
                Flappy Bird
              </div>
              <div :class="['text-body-2', selectedGame === 'flappy' ? 'text-white' : 'text-medium-emphasis']">
                O desafiador pássaro saltitante
              </div>
              <div class="mt-2">
                <v-chip
                  size="small"
                  :color="selectedGame === 'flappy' ? 'white' : 'primary'"
                  :text-color="selectedGame === 'flappy' ? 'primary' : 'white'"
                  variant="flat"
                >
                  Recorde: {{ flappyHighScore }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Game Area -->
    <v-row class="mt-4" v-if="selectedGame">
      <v-col cols="12">
        <v-card class="game-area" elevation="2">
          <v-card-title class="d-flex align-center py-4 px-6">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              color="primary"
              class="mr-4"
              @click="selectedGame = null"
            />
            <span class="text-h6 font-weight-medium">
              {{ getGameTitle }}
            </span>
            <v-spacer />
            <v-btn
              icon="mdi-refresh"
              variant="text"
              color="primary"
              @click="restartGame"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-0">
            <component
              :is="currentGameComponent"
              @update-score="updateScore"
              class="game-component"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import SnakeGame from './components/SnakeGame.vue';
import PongGame from './components/PongGame.vue';
import FlappyBirdGame from './components/FlappyBirdGame.vue';

export default defineComponent({
  name: 'GamesView',
  components: {
    SnakeGame,
    PongGame,
    FlappyBirdGame
  },
  setup() {
    const selectedGame = ref<string | null>(null);
    const snakeHighScore = ref(0);
    const pongHighScore = ref(0);
    const flappyHighScore = ref(0);

    const currentGameComponent = computed(() => {
      switch (selectedGame.value) {
        case 'snake':
          return SnakeGame;
        case 'pong':
          return PongGame;
        case 'flappy':
          return FlappyBirdGame;
        default:
          return null;
      }
    });

    const getGameTitle = computed(() => {
      switch (selectedGame.value) {
        case 'snake':
          return 'Snake - Jogo da Cobrinha';
        case 'pong':
          return 'Pong - Tênis de Mesa';
        case 'flappy':
          return 'Flappy Bird';
        default:
          return '';
      }
    });

    const selectGame = (game: string) => {
      selectedGame.value = game;
    };

    const restartGame = () => {
      // Será implementado quando criarmos os componentes dos jogos
    };

    const updateScore = (game: string, score: number) => {
      switch (game) {
        case 'snake':
          if (score > snakeHighScore.value) snakeHighScore.value = score;
          break;
        case 'pong':
          if (score > pongHighScore.value) pongHighScore.value = score;
          break;
        case 'flappy':
          if (score > flappyHighScore.value) flappyHighScore.value = score;
          break;
      }
    };

    return {
      selectedGame,
      snakeHighScore,
      pongHighScore,
      flappyHighScore,
      currentGameComponent,
      getGameTitle,
      selectGame,
      restartGame,
      updateScore
    };
  }
});
</script>

<style scoped>
.games-container {
  background-color: var(--v-theme-background);
  min-height: 100vh;
}

.welcome-card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 16px;
  overflow: hidden;
}

.welcome-text {
  color: white;
}

.welcome-avatar {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.game-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
  border-color: var(--v-theme-primary);
}

.game-card.selected {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px -4px rgba(99, 102, 241, 0.4);
}

.game-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(var(--v-theme-primary), 0.1);
}

.selected .game-icon {
  background: rgba(255, 255, 255, 0.2);
}

.game-area {
  border-radius: 12px;
  min-height: 600px;
}

.game-component {
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 960px) {
  .game-area {
    min-height: 400px;
  }

  .game-component {
    height: 400px;
  }
}
</style>
