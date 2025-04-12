<template>
  <div class="pong-game">
    <div id="pong-game-container" ref="gameContainer"></div>
    <div class="game-overlay" v-if="!isPlaying">
      <div class="game-info">
        <h2 class="text-h5 font-weight-bold mb-4">Pong Game</h2>
        <div class="score-display mb-4">
          <div class="current-score">
            Pontuação: {{ score }}
          </div>
          <div class="high-score">
            Recorde: {{ highScore }}
          </div>
        </div>
        <div class="game-mode-selector mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Modo de Jogo:</h3>
          <v-btn-toggle
            v-model="gameMode"
            mandatory
            color="primary"
            class="mb-4"
          >
            <v-btn value="single">1 Jogador</v-btn>
            <v-btn value="double">2 Jogadores</v-btn>
          </v-btn-toggle>
        </div>
        <div class="d-flex justify-center gap-4">
          <v-btn
            color="primary"
            size="large"
            class="start-btn"
            @click="startGame"
          >
            Iniciar Jogo
          </v-btn>
          <v-btn
            color="secondary"
            size="large"
            class="tutorial-btn"
            @click="showTutorial = true"
          >
            Tutorial
          </v-btn>
        </div>
      </div>
    </div>
    <div class="game-overlay" v-if="gameOver">
      <div class="game-info">
        <h2 class="text-h5 font-weight-bold mb-4">Game Over!</h2>
        <div class="score-display mb-4">
          <div class="final-score">
            Pontuação Final: {{ score }}
          </div>
          <div class="high-score">
            Recorde: {{ highScore }}
          </div>
        </div>
        <div class="game-mode-selector mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Modo de Jogo:</h3>
          <v-btn-toggle
            v-model="gameMode"
            mandatory
            color="primary"
            class="mb-4"
          >
            <v-btn value="single">1 Jogador</v-btn>
            <v-btn value="double">2 Jogadores</v-btn>
          </v-btn-toggle>
        </div>
        <div class="d-flex justify-center gap-4">
          <v-btn
            color="primary"
            size="large"
            class="restart-btn"
            @click="restartGame"
          >
            Jogar Novamente
          </v-btn>
          <v-btn
            color="secondary"
            size="large"
            class="tutorial-btn"
            @click="showTutorial = true"
          >
            Tutorial
          </v-btn>
        </div>
      </div>
    </div>
    <div class="game-overlay" v-if="showTutorial">
      <div class="game-info tutorial-info">
        <h2 class="text-h5 font-weight-bold mb-4">Como Jogar Pong</h2>
        <div class="tutorial-content mb-4">
          <div class="tutorial-section mb-3">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Modos de Jogo:</h3>
            <div class="mode-list mb-3">
              <div class="mode-item">
                <v-icon color="primary">mdi-account</v-icon>
                <span><strong>1 Jogador:</strong> Jogue contra a IA</span>
              </div>
              <div class="mode-item">
                <v-icon color="primary">mdi-account-group</v-icon>
                <span><strong>2 Jogadores:</strong> Jogue com um amigo</span>
              </div>
            </div>
          </div>
          <div class="tutorial-section mb-3">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Controles:</h3>
            <div class="key-list">
              <div class="key-item">
                <v-icon color="primary">mdi-keyboard</v-icon>
                <span>W - Mover raquete esquerda para cima</span>
              </div>
              <div class="key-item">
                <v-icon color="primary">mdi-keyboard</v-icon>
                <span>S - Mover raquete esquerda para baixo</span>
              </div>
              <div class="key-item" v-if="gameMode === 'double'">
                <v-icon color="primary">mdi-keyboard</v-icon>
                <span>↑ - Mover raquete direita para cima</span>
              </div>
              <div class="key-item" v-if="gameMode === 'double'">
                <v-icon color="primary">mdi-keyboard</v-icon>
                <span>↓ - Mover raquete direita para baixo</span>
              </div>
              <div class="key-item" v-if="gameMode === 'single'">
                <v-icon color="primary">mdi-robot</v-icon>
                <span>A raquete direita é controlada pela IA</span>
              </div>
            </div>
          </div>
          <div class="tutorial-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Objetivo:</h3>
            <p>Use as raquetes para rebater a bola e evitar que ela passe por trás delas.</p>
            <p>Ganhe pontos cada vez que a bola bater em sua raquete.</p>
            <p>O jogo termina quando a bola passar por trás de uma das raquetes.</p>
          </div>
        </div>
        <v-btn
          color="primary"
          size="large"
          class="close-tutorial-btn"
          @click="showTutorial = false"
        >
          Fechar Tutorial
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';

export default defineComponent({
  name: 'PongGame',
  emits: ['update-score'],
  setup(props, { emit }) {
    const gameContainer = ref<HTMLElement | null>(null);
    const isPlaying = ref(false);
    const gameOver = ref(false);
    const showTutorial = ref(false);
    const score = ref(0);
    const highScore = ref(0);
    const gameMode = ref('single'); // 'single' ou 'double'
    let game: Phaser.Game | null = null;

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const PADDLE_COLOR = 0x8b5cf6; // Cor roxa padrão do sistema
    const BALL_COLOR = 0xffffff;
    const PADDLE_SPEED = 90; // Aumentado de 5 para 12 para raquetes mais rápidas
    const BALL_SPEED = 1; // Reduzido de 4 para 3 para bola mais lenta inicialmente
    const BALL_SPEED_INCREMENT = 0.5; // Incremento de velocidade a cada 50 pontos

    class PongScene extends Phaser.Scene {
      private ball: Phaser.GameObjects.Rectangle | null = null;
      private leftPaddle: Phaser.GameObjects.Rectangle | null = null;
      private rightPaddle: Phaser.GameObjects.Rectangle | null = null;
      private scoreText: Phaser.GameObjects.Text | null = null;
      private gameOverText: Phaser.GameObjects.Text | null = null;
      private isGameOver: boolean = false;
      private ballVelocityX: number = 0;
      private ballVelocityY: number = 0;
      private paddleHeight: number = 100;
      private paddleWidth: number = 10;
      private ballSize: number = 10;
      private leftPaddleTargetY: number = 0;
      private rightPaddleTargetY: number = 0;
      private paddleMoveSpeed: number = 0.15; // Velocidade de transição suave (0-1)
      private aiDifficulty: number = 0.8; // 0-1, onde 1 é perfeito e 0 é aleatório
      private aiReactionDelay: number = 0.2; // Delay de reação da IA em segundos
      private aiReactionTimer: number = 0;
      private isTwoPlayerMode: boolean = false;

      constructor() {
        super({ key: 'PongScene' });
      }

      create() {
        // Configurar o fundo
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000).setOrigin(0, 0);

        // Desenhar a linha central
        const centerLine = this.add.graphics();
        centerLine.lineStyle(2, 0x333333);
        centerLine.beginPath();
        centerLine.moveTo(GAME_WIDTH / 2, 0);
        centerLine.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
        centerLine.strokePath();

        // Adicionar texto de pontuação
        this.scoreText = this.add.text(GAME_WIDTH / 2, 50, '0', { fontSize: '32px', color: '#ffffff' });
        this.scoreText.setOrigin(0.5);

        // Configurar controles
        if (this.input.keyboard) {
          this.input.keyboard.on('keydown-W', () => {
            if (this.leftPaddle && this.leftPaddleTargetY > this.paddleHeight / 2) {
              this.leftPaddleTargetY -= PADDLE_SPEED;
            }
          });

          this.input.keyboard.on('keydown-S', () => {
            if (this.leftPaddle && this.leftPaddleTargetY < GAME_HEIGHT - this.paddleHeight / 2) {
              this.leftPaddleTargetY += PADDLE_SPEED;
            }
          });
        }
      }

      startGame() {
        // Definir o modo de jogo
        this.isTwoPlayerMode = gameMode.value === 'double';

        // Criar as raquetes
        this.leftPaddle = this.add.rectangle(0, GAME_HEIGHT / 2, this.paddleWidth, this.paddleHeight, PADDLE_COLOR);
        this.leftPaddle.setOrigin(0, 0.5);
        this.leftPaddleTargetY = GAME_HEIGHT / 2;

        this.rightPaddle = this.add.rectangle(GAME_WIDTH - this.paddleWidth, GAME_HEIGHT / 2, this.paddleWidth, this.paddleHeight, PADDLE_COLOR);
        this.rightPaddle.setOrigin(0, 0.5);
        this.rightPaddleTargetY = GAME_HEIGHT / 2;

        // Criar a bola
        this.ball = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.ballSize, this.ballSize, BALL_COLOR);

        // Definir direção inicial da bola
        this.ballVelocityX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        this.ballVelocityY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);

        this.isGameOver = false;
        this.aiReactionTimer = 0;

        // Configurar controles para o segundo jogador se estiver no modo de 2 jogadores
        if (this.isTwoPlayerMode && this.input.keyboard) {
          this.input.keyboard.on('keydown-UP', () => {
            if (this.rightPaddle && this.rightPaddleTargetY > this.paddleHeight / 2) {
              this.rightPaddleTargetY -= PADDLE_SPEED;
            }
          });

          this.input.keyboard.on('keydown-DOWN', () => {
            if (this.rightPaddle && this.rightPaddleTargetY < GAME_HEIGHT - this.paddleHeight / 2) {
              this.rightPaddleTargetY += PADDLE_SPEED;
            }
          });
        }

        // Iniciar o loop do jogo
        this.time.addEvent({
          delay: 16, // Aproximadamente 60 FPS
          callback: this.update,
          callbackScope: this,
          loop: true
        });
      }

      update(time: number, delta: number) {
        if (this.isGameOver || !this.ball || !this.leftPaddle || !this.rightPaddle) return;

        // Movimento suave das raquetes
        if (this.leftPaddle) {
          this.leftPaddle.y = Phaser.Math.Linear(
            this.leftPaddle.y,
            this.leftPaddleTargetY,
            this.paddleMoveSpeed
          );
        }

        if (this.rightPaddle) {
          this.rightPaddle.y = Phaser.Math.Linear(
            this.rightPaddle.y,
            this.rightPaddleTargetY,
            this.paddleMoveSpeed
          );
        }

        // Mover a bola
        this.ball.x += this.ballVelocityX;
        this.ball.y += this.ballVelocityY;

        // Colisão com o topo e o fundo
        if (this.ball.y <= this.ballSize / 2 || this.ball.y >= GAME_HEIGHT - this.ballSize / 2) {
          this.ballVelocityY *= -1;
        }

        // Colisão com a raquete esquerda
        if (
          this.ball.x <= this.paddleWidth &&
          this.ball.y >= this.leftPaddle.y - this.paddleHeight / 2 &&
          this.ball.y <= this.leftPaddle.y + this.paddleHeight / 2
        ) {
          this.ballVelocityX *= -1;
          score.value += 1;

          // Aumentar a velocidade da bola a cada 5 pontos
          if (score.value % 5 === 0) {
            const speedMultiplier = 1 + (score.value / 5) * 0.1; // Aumenta 10% a cada 5 pontos
            this.ballVelocityX = BALL_SPEED * speedMultiplier * (this.ballVelocityX > 0 ? 1 : -1);
            this.ballVelocityY = BALL_SPEED * speedMultiplier * (this.ballVelocityY > 0 ? 1 : -1);
          }

          if (score.value > highScore.value) {
            highScore.value = score.value;
            emit('update-score', 'pong', highScore.value);
          }

          // Atualizar texto de pontuação
          if (this.scoreText) {
            this.scoreText.setText(score.value.toString());
          }
        }

        // Colisão com a raquete direita
        if (
          this.ball.x >= GAME_WIDTH - this.paddleWidth &&
          this.ball.y >= this.rightPaddle.y - this.paddleHeight / 2 &&
          this.ball.y <= this.rightPaddle.y + this.paddleHeight / 2
        ) {
          this.ballVelocityX *= -1;
          score.value += 1;

          // Aumentar a velocidade da bola a cada 5 pontos
          if (score.value % 5 === 0) {
            const speedMultiplier = 1 + (score.value / 5) * 0.1; // Aumenta 10% a cada 5 pontos
            this.ballVelocityX = BALL_SPEED * speedMultiplier * (this.ballVelocityX > 0 ? 1 : -1);
            this.ballVelocityY = BALL_SPEED * speedMultiplier * (this.ballVelocityY > 0 ? 1 : -1);
          }

          if (score.value > highScore.value) {
            highScore.value = score.value;
            emit('update-score', 'pong', highScore.value);
          }

          // Atualizar texto de pontuação
          if (this.scoreText) {
            this.scoreText.setText(score.value.toString());
          }
        }

        // Game over se a bola passar por trás das raquetes
        if (this.ball.x < 0 || this.ball.x > GAME_WIDTH) {
          this.endGame();
        }

        // IA para controlar a raquete direita apenas no modo de 1 jogador
        if (!this.isTwoPlayerMode) {
          this.updateAI(delta);
        }
      }

      updateAI(delta: number) {
        if (!this.ball || !this.rightPaddle || this.ballVelocityX <= 0) return;

        // Incrementar o timer de reação
        this.aiReactionTimer += delta / 1000; // Converter para segundos

        // Só reagir após o delay de reação
        if (this.aiReactionTimer < this.aiReactionDelay) return;

        // Resetar o timer
        this.aiReactionTimer = 0;

        // Calcular onde a bola vai estar
        const timeToReachPaddle = (GAME_WIDTH - this.paddleWidth - this.ball.x) / this.ballVelocityX;
        const predictedY = this.ball.y + this.ballVelocityY * timeToReachPaddle;

        // Adicionar um pouco de aleatoriedade baseada na dificuldade
        const randomFactor = (1 - this.aiDifficulty) * 100;
        const targetY = predictedY + (Math.random() * randomFactor - randomFactor / 2);

        // Limitar o movimento dentro dos limites do campo
        const minY = this.paddleHeight / 2;
        const maxY = GAME_HEIGHT - this.paddleHeight / 2;
        this.rightPaddleTargetY = Phaser.Math.Clamp(targetY, minY, maxY);
      }

      endGame() {
        this.isGameOver = true;
        gameOver.value = true;
        isPlaying.value = false;

        // Adicionar texto de game over
        this.gameOverText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'GAME OVER', {
          fontSize: '48px',
          color: '#ff0000',
          fontStyle: 'bold'
        }).setOrigin(0.5);
      }
    }

    const initGame = () => {
      if (!gameContainer.value) return;

      // Destruir o jogo anterior se existir
      if (game) {
        game.destroy(true);
        game = null;
      }

      // Configurar o jogo Phaser
      const config = {
        type: Phaser.AUTO,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        parent: 'pong-game-container',
        backgroundColor: '#000000',
        scene: PongScene
      };

      // Criar o jogo
      game = new Phaser.Game(config);
    };

    const startGame = () => {
      score.value = 0;
      gameOver.value = false;
      isPlaying.value = true;
      initGame();

      // Iniciar o jogo após um pequeno delay para garantir que a cena esteja pronta
      setTimeout(() => {
        const scene = game?.scene.getScene('PongScene') as PongScene;
        if (scene) {
          scene.startGame();
        }
      }, 100);
    };

    const restartGame = () => {
      gameOver.value = false;
      startGame();
    };

    onMounted(() => {
      // Inicializar o jogo quando o componente for montado, mas não iniciar o jogo
      initGame();
    });

    onUnmounted(() => {
      // Destruir o jogo quando o componente for desmontado
      if (game) {
        game.destroy(true);
        game = null;
      }
    });

    return {
      gameContainer,
      isPlaying,
      gameOver,
      showTutorial,
      score,
      highScore,
      gameMode,
      startGame,
      restartGame
    };
  }
});
</script>

<style scoped>
.pong-game {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--v-theme-background);
  border-radius: 12px;
  overflow: hidden;
}

#pong-game-container {
  width: 800px;
  height: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-background), 0.9);
  backdrop-filter: blur(8px);
}

.game-info {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: var(--v-theme-surface);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tutorial-info {
  max-width: 500px;
  width: 90%;
}

.tutorial-content {
  text-align: left;
}

.tutorial-section {
  margin-bottom: 1.5rem;
}

.mode-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mode-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 8px;
}

.key-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.key-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-display {
  font-size: 1.25rem;
  font-weight: 500;
}

.current-score,
.final-score {
  color: var(--v-theme-primary);
  margin-bottom: 0.5rem;
}

.high-score {
  color: var(--v-theme-secondary);
}

.start-btn,
.restart-btn,
.tutorial-btn,
.close-tutorial-btn {
  min-width: 200px;
}

.gap-4 {
  gap: 1rem;
}

.game-mode-selector {
  margin-bottom: 1.5rem;
}
</style>
