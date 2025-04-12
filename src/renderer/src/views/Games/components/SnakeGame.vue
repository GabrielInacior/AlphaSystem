<template>
  <div class="snake-game">
    <div id="snake-game-container" ref="gameContainer"></div>
    <div class="game-overlay" v-if="!isPlaying">
      <div class="game-info">
        <h2 class="text-h5 font-weight-bold mb-4">Snake Game</h2>
        <div class="score-display mb-4">
          <div class="current-score">
            Pontuação: {{ score }}
          </div>
          <div class="high-score">
            Recorde: {{ highScore }}
          </div>
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
        <h2 class="text-h5 font-weight-bold mb-4">Como Jogar Snake</h2>
        <div class="tutorial-content mb-4">
          <div class="tutorial-section mb-3">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Controles:</h3>
            <div class="key-list">
              <div class="key-item">
                <v-icon color="primary">mdi-keyboard</v-icon>
                <span>W - Mover para cima</span>
              </div>
              <div class="key-item">
                <v-icon color="primary">mdi-keyboard</v-icon>
                <span>S - Mover para baixo</span>
              </div>
              <div class="key-item">
                <v-icon color="primary">mdi-keyboard</v-icon>
                <span>A - Mover para esquerda</span>
              </div>
              <div class="key-item">
                <v-icon color="primary">mdi-keyboard</v-icon>
                <span>D - Mover para direita</span>
              </div>
            </div>
          </div>
          <div class="tutorial-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Objetivo:</h3>
            <p>Coma a comida (círculo vermelho) para crescer e aumentar sua pontuação.</p>
            <p>Evite colidir com as paredes ou com o próprio corpo da cobra.</p>
            <p>O jogo fica mais rápido conforme sua pontuação aumenta.</p>
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
  name: 'SnakeGame',
  emits: ['update-score'],
  setup(props, { emit }) {
    const gameContainer = ref<HTMLElement | null>(null);
    const isPlaying = ref(false);
    const gameOver = ref(false);
    const showTutorial = ref(false);
    const score = ref(0);
    const highScore = ref(0);
    let game: Phaser.Game | null = null;

    const TILE_SIZE = 20;
    const GAME_WIDTH = 400;
    const GAME_HEIGHT = 400;
    const SPEED = 200; // Velocidade inicial bem lenta
    const SNAKE_COLOR = 0x8b5cf6; // Cor roxa padrão do sistema

    class Snake {
      scene: Phaser.Scene;
      body: Phaser.GameObjects.Rectangle[];
      direction: string;
      nextDirection: string;

      constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.body = [];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';

        const startX = 160;
        const startY = 160;

        for (let i = 0; i < 3; i++) {
          this.body.push(
            this.scene.add.rectangle(startX - i * TILE_SIZE, startY, TILE_SIZE, TILE_SIZE, SNAKE_COLOR)
          );
        }

        this.scene.time.addEvent({
          delay: SPEED,
          loop: true,
          callback: this.move,
          callbackScope: this
        });
      }

      setDirection(newDir: string) {
        const opposite: Record<string, string> = { LEFT: 'RIGHT', RIGHT: 'LEFT', UP: 'DOWN', DOWN: 'UP' };
        if (newDir !== opposite[this.direction]) {
          this.nextDirection = newDir;
        }
      }

      move() {
        const head = this.body[0];
        const newHead = this.scene.add.rectangle(head.x, head.y, TILE_SIZE, TILE_SIZE, SNAKE_COLOR);

        this.direction = this.nextDirection;

        switch (this.direction) {
          case 'LEFT': newHead.x -= TILE_SIZE; break;
          case 'RIGHT': newHead.x += TILE_SIZE; break;
          case 'UP': newHead.y -= TILE_SIZE; break;
          case 'DOWN': newHead.y += TILE_SIZE; break;
        }

        this.body.unshift(newHead);

        if ((this.scene as SnakeScene).isFoodCollision(newHead)) {
          (this.scene as SnakeScene).spawnFood();
          score.value += 10;
          if (score.value > highScore.value) {
            highScore.value = score.value;
            emit('update-score', 'snake', highScore.value);
          }

          // Atualizar texto de pontuação
          if ((this.scene as SnakeScene).scoreText) {
            (this.scene as SnakeScene).scoreText?.setText(`Pontuação: ${score.value}`);
          }
        } else {
          this.body.pop()?.destroy();
        }

        if ((this.scene as SnakeScene).isCollision(newHead)) {
          (this.scene as SnakeScene).endGame();
        }
      }
    }

    class Food {
      scene: Phaser.Scene;
      food: Phaser.GameObjects.Rectangle | null;

      constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.food = null;
        this.spawn();
      }

      spawn() {
        if (this.food) this.food.destroy();

        // Definir margens de segurança para evitar que a comida apareça na borda
        const margin = TILE_SIZE;
        const safeWidth = GAME_WIDTH - (2 * margin);
        const safeHeight = GAME_HEIGHT - (2 * margin);

        // Gerar posição aleatória dentro da área segura
        const x = Phaser.Math.Snap.To(margin + Math.floor(Math.random() * safeWidth), TILE_SIZE);
        const y = Phaser.Math.Snap.To(margin + Math.floor(Math.random() * safeHeight), TILE_SIZE);

        this.food = this.scene.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0xff0000);
      }

      get position() {
        return this.food ? { x: this.food.x, y: this.food.y } : { x: 0, y: 0 };
      }
    }

    class SnakeScene extends Phaser.Scene {
      snake: Snake | null = null;
      food: Food | null = null;
      scoreText: Phaser.GameObjects.Text | null = null;
      gameOverText: Phaser.GameObjects.Text | null = null;
      isGameOver: boolean = false;

      constructor() {
        super({ key: 'SnakeScene' });
      }

      create() {
        // Configurar o fundo
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000).setOrigin(0, 0);

        // Desenhar a grade
        this.drawGrid();

        // Adicionar texto de pontuação
        this.scoreText = this.add.text(10, 10, 'Pontuação: 0', { fontSize: '20px', color: '#ffffff' });

        // Configurar controles
        this.input.keyboard?.on('keydown', (e: KeyboardEvent) => {
          if (!this.snake) return;

          switch (e.key.toLowerCase()) {
            case 'a': this.snake.setDirection('LEFT'); break;
            case 'd': this.snake.setDirection('RIGHT'); break;
            case 'w': this.snake.setDirection('UP'); break;
            case 's': this.snake.setDirection('DOWN'); break;
          }
        });
      }

      startGame() {
        // Inicializar a cobra e a comida
        this.snake = new Snake(this);
        this.food = new Food(this);
        this.isGameOver = false;
      }

      drawGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(0.5, 0x333333);

        for (let i = 0; i <= GAME_WIDTH; i += TILE_SIZE) {
          graphics.moveTo(i, 0);
          graphics.lineTo(i, GAME_HEIGHT);
        }

        for (let i = 0; i <= GAME_HEIGHT; i += TILE_SIZE) {
          graphics.moveTo(0, i);
          graphics.lineTo(GAME_WIDTH, i);
        }

        graphics.strokePath();
      }

      isFoodCollision(head: Phaser.GameObjects.Rectangle) {
        if (!this.food) return false;
        const { x, y } = this.food.position;
        return head.x === x && head.y === y;
      }

      isCollision(head: Phaser.GameObjects.Rectangle) {
        if (!this.snake) return false;
        const hitWall = head.x < 0 || head.x >= GAME_WIDTH || head.y < 0 || head.y >= GAME_HEIGHT;
        const hitSelf = this.snake.body.slice(1).some(part => part.x === head.x && part.y === head.y);
        return hitWall || hitSelf;
      }

      spawnFood() {
        if (this.food) {
          this.food.spawn();
        }
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
        parent: 'snake-game-container',
        backgroundColor: '#000000',
        scene: SnakeScene
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
        const scene = game?.scene.getScene('SnakeScene') as SnakeScene;
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
      startGame,
      restartGame
    };
  }
});
</script>

<style scoped>
.snake-game {
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

#snake-game-container {
  width: 400px;
  height: 400px;
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
</style>
