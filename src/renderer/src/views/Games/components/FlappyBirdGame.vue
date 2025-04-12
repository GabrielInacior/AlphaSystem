<template>
  <div class="flappy-bird-game">
    <div id="flappy-bird-game-container" ref="gameContainer"></div>
    <div class="game-overlay" v-if="!isPlaying">
      <div class="game-info">
        <h2 class="text-h5 font-weight-bold mb-4">Flappy Bird</h2>
        <div class="score-display mb-4">
          <div class="current-score">
            Pontuação: {{ score }}
          </div>
          <div class="high-score">
            Recorde: {{ highScore }}
          </div>
        </div>
        <div class="d-flex flex-column align-center">
          <v-btn color="primary" size="large" class="start-btn mb-4" @click="startGame">
            Iniciar Jogo
          </v-btn>
          <v-btn color="secondary" size="large" class="tutorial-btn" @click="showTutorial = true">
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
        <div class="d-flex flex-column align-center">
          <v-btn color="primary" size="large" class="restart-btn mb-4" @click="restartGame">
            Jogar Novamente
          </v-btn>
          <v-btn color="secondary" size="large" class="tutorial-btn" @click="showTutorial = true">
            Tutorial
          </v-btn>
        </div>
      </div>
    </div>
    <div class="game-overlay" v-if="showTutorial">
      <div class="game-info tutorial-info">
        <h2 class="text-h5 font-weight-bold mb-4">Como Jogar Flappy Bird</h2>
        <div class="tutorial-content mb-4">
          <div class="tutorial-section mb-3">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Controles:</h3>
            <div class="key-list">
              <div class="key-item">
                <v-icon color="primary">mdi-keyboard-space</v-icon>
                <span>Pressione ESPAÇO para pular</span>
              </div>
            </div>
          </div>
          <div class="tutorial-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Objetivo:</h3>
            <p>Guie o pássaro através dos canos sem colidir.</p>
            <p>Ganhe pontos cada vez que passar por um cano.</p>
            <p>O jogo termina quando o pássaro colide com um cano ou com o chão.</p>
          </div>
        </div>
        <div class="d-flex justify-center">
          <v-btn color="primary" size="large" class="close-tutorial-btn" @click="showTutorial = false">
            Fechar Tutorial
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';

export default defineComponent({
  name: 'FlappyBirdGame',
  emits: ['update-score'],
  setup(props, { emit }) {
    const gameContainer = ref<HTMLElement | null>(null);
    const isPlaying = ref(false);
    const gameOver = ref(false);
    const showTutorial = ref(false);
    const score = ref(0);
    const highScore = ref(0);
    let game: Phaser.Game | null = null;
    let flappyScene: FlappyScene | null = null;

    class FlappyScene extends Phaser.Scene {
      // Propriedades
      private bird: Phaser.GameObjects.Rectangle | null = null;
      private pipes: Phaser.GameObjects.Group | null = null;
      private scoreText: Phaser.GameObjects.Text | null = null;
      private gravity = 0.17;
      private jumpForce = -5.3;
      private velocityY = 0;
      private isGameStarted = false;
      private isGameOver = false;
      private pipeSpeed = 2;
      private pipeGap = 150;
      private pipeInterval = 2000;
      private lastPipeGapY = 300;
      private gapTransitionSpeed = 0.1;
      private lastCloudTime = 0;
      private clouds: Phaser.GameObjects.Group | null = null;
      private background?: Phaser.GameObjects.Rectangle;
      private pipeWidth = 50;

      constructor() {
        super({ key: 'FlappyScene' });
      }

      create() {
        this.initBackground();
        this.initBird();
        this.initPipes();
        this.initScore();
        this.initControls();
      }

      private initBackground() {
        // Fundo com gradiente
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x6366f1, 0x6366f1, 0x8b5cf6, 0x8b5cf6, 1);
        gradient.fillRect(0, 0, 400, 600);

        // Adiciona estrelas ao fundo
        this.addStars();

        // Adiciona lua com opacidade reduzida
        const moon = this.add.circle(350, 80, 40, 0xFFFFFF);
        moon.setAlpha(0.3);

        // Nuvens com efeito de transparência
        this.clouds = this.add.group();
        this.time.addEvent({ delay: 1000, callback: this.spawnCloud, callbackScope: this, loop: true });

        // Teto e chão com gradiente
        const ceilingGradient = this.add.graphics();
        ceilingGradient.fillGradientStyle(0x8B4513, 0x8B4513, 0x654321, 0x654321, 1);
        ceilingGradient.fillRect(0, 0, 400, 30);

        const floorGradient = this.add.graphics();
        floorGradient.fillGradientStyle(0x8B4513, 0x8B4513, 0x654321, 0x654321, 1);
        floorGradient.fillRect(0, 570, 400, 30);
      }

      private addStars() {
        // Adiciona estrelas ao fundo
        for (let i = 0; i < 50; i++) {
          const x = Phaser.Math.Between(0, 400);
          const y = Phaser.Math.Between(0, 550);
          const size = Phaser.Math.FloatBetween(0.5, 1.5);
          const alpha = Phaser.Math.FloatBetween(0.3, 0.8);

          const star = this.add.circle(x, y, size, 0xFFFFFF);
          star.setAlpha(alpha);

          // Adiciona um efeito de cintilação aleatório
          this.tweens.add({
            targets: star,
            alpha: alpha * 0.5,
            duration: Phaser.Math.Between(1000, 3000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      }

      private initBird() {
        // Pássaro com gradiente e borda
        this.bird = this.add.rectangle(100, 300, 30, 30, 0xFFFF00);

        // Adiciona um brilho ao pássaro
        const birdGlow = this.add.graphics();
        birdGlow.lineStyle(2, 0xFFFFFF, 0.5);
        birdGlow.strokeCircle(100, 300, 18);
      }

      private initPipes() {
        this.pipes = this.add.group();
        this.time.addEvent({
          delay: this.pipeInterval,
          callback: this.createPipe,
          callbackScope: this,
          loop: true
        });
      }

      private initScore() {
        // Texto de pontuação com sombra e estilo melhorado
        this.scoreText = this.add.text(200, 50, '0', {
          fontSize: '32px',
          fontFamily: 'Arial',
          color: '#ffffff',
          stroke: '#000',
          strokeThickness: 4,
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: '#000',
            blur: 4,
            stroke: true,
            fill: true
          }
        }).setOrigin(0.5);
      }

      private initControls() {
        // Instruções com estilo melhorado
        const instruction = this.add.text(200, 200, 'Pressione ESPAÇO para pular', {
          fontSize: '20px',
          fontFamily: 'Arial',
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: { x: 15, y: 10 },
          shadow: {
            offsetX: 1,
            offsetY: 1,
            color: '#000',
            blur: 2,
            stroke: true,
            fill: true
          }
        }).setOrigin(0.5);

        this.input.keyboard?.on('keydown-SPACE', () => {
          if (this.isGameOver) return;

          if (!this.isGameStarted) {
            instruction.destroy();
            this.isGameStarted = true;
          }

          this.velocityY = this.jumpForce;
          this.tweens.add({
            targets: this.bird,
            scaleX: 1.2,
            scaleY: 0.8,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
          });
        });

        this.time.addEvent({
          delay: 16,
          callback: this.updateGame,
          callbackScope: this,
          loop: true
        });
      }

      private updateGame() {
        if (!this.bird || !this.isGameStarted || this.isGameOver) return;

        this.velocityY += this.gravity;
        this.bird.y += this.velocityY;
        this.bird.rotation = Phaser.Math.Clamp(this.velocityY * 0.1, -0.5, 0.5);

        this.updatePipes();
        this.updateClouds();

        if (this.bird.y > 570 || this.bird.y < 30) {
          this.endGame();
        }
      }

      private updatePipes() {
        this.pipes?.getChildren().forEach((pipe: any) => {
          pipe.x -= this.pipeSpeed;

          if (this.checkCollision(this.bird!, pipe)) {
            this.endGame();
            return;
          }

          if (pipe.scored !== true && pipe.x + this.pipeWidth < this.bird!.x) {
            pipe.scored = true;
            score.value += 0.5; // soma 1 para cada par de canos
            this.updateScoreDisplay();
          }

          if (pipe.x < -this.pipeWidth) {
            pipe.destroy();
          }
        });
      }

      private updateScoreDisplay() {
        if (!this.scoreText) return;
        this.scoreText.setText(Math.floor(score.value).toString());

        if (score.value > highScore.value) {
          highScore.value = Math.floor(score.value);
          emit('update-score', 'flappy', highScore.value);
        }

        this.tweens.add({
          targets: this.scoreText,
          scale: 1.5,
          duration: 100,
          yoyo: true,
          ease: 'Power2'
        });
      }

      private createPipe() {
        const margem = 50;
        const minGapY = this.pipeGap / 2 + margem;
        const maxGapY = 600 - this.pipeGap / 2 - margem;

        // 20% de chance de fazer uma mudança brusca
        const abruptChange = Math.random() < 0.2;

        const targetGapY = Phaser.Math.Between(minGapY, maxGapY);

        if (abruptChange) {
          this.lastPipeGapY = targetGapY; // mudança brusca
        } else {
          this.lastPipeGapY = Phaser.Math.Linear(this.lastPipeGapY, targetGapY, this.gapTransitionSpeed); // transição suave
        }

        const gapY = this.lastPipeGapY;
        const topHeight = gapY - this.pipeGap / 2;
        const bottomY = gapY + this.pipeGap / 2;
        const bottomHeight = 600 - bottomY;

        // Canos com design melhorado
        // Cano superior
        const topPipe = this.add.rectangle(400, 0, this.pipeWidth, topHeight, 0x00AA00).setOrigin(0);

        // Adiciona gradiente ao cano superior
        const topPipeGradient = this.add.graphics();
        topPipeGradient.fillGradientStyle(0x00AA00, 0x00AA00, 0x008800, 0x008800, 1);
        topPipeGradient.fillRect(400, 0, this.pipeWidth, topHeight);

        // Adiciona borda ao cano superior
        const topPipeBorder = this.add.graphics();
        topPipeBorder.lineStyle(2, 0xFFFFFF, 0.8);
        topPipeBorder.strokeRect(400, 0, this.pipeWidth, topHeight);

        // Adiciona detalhes ao cano superior
        const topPipeDetail = this.add.graphics();
        topPipeDetail.lineStyle(1, 0x00FF00, 0.5);
        for (let i = 0; i < topHeight; i += 20) {
          topPipeDetail.strokeRect(400, i, this.pipeWidth, 10);
        }

        // Cano inferior
        const bottomPipe = this.add.rectangle(400, bottomY, this.pipeWidth, bottomHeight, 0x00AA00).setOrigin(0);

        // Adiciona gradiente ao cano inferior
        const bottomPipeGradient = this.add.graphics();
        bottomPipeGradient.fillGradientStyle(0x00AA00, 0x00AA00, 0x008800, 0x008800, 1);
        bottomPipeGradient.fillRect(400, bottomY, this.pipeWidth, bottomHeight);

        // Adiciona borda ao cano inferior
        const bottomPipeBorder = this.add.graphics();
        bottomPipeBorder.lineStyle(2, 0xFFFFFF, 0.8);
        bottomPipeBorder.strokeRect(400, bottomY, this.pipeWidth, bottomHeight);

        // Adiciona detalhes ao cano inferior
        const bottomPipeDetail = this.add.graphics();
        bottomPipeDetail.lineStyle(1, 0x00FF00, 0.5);
        for (let i = bottomY; i < 600; i += 20) {
          bottomPipeDetail.strokeRect(400, i, this.pipeWidth, 10);
        }

        (topPipe as any).scored = false;
        (bottomPipe as any).scored = false;

        this.pipes?.add(topPipe);
        this.pipes?.add(bottomPipe);
      }

      private spawnCloud() {
        if (!this.clouds || this.clouds.getLength() >= 3) return;
        const y = Phaser.Math.Between(50, 300);

        // Nuvens com gradiente e transparência
        const cloud = this.add.rectangle(450, y, 60, 30, 0xFFFFFF);
        cloud.setAlpha(0.8);

        // Adiciona um brilho à nuvem
        const cloudGlow = this.add.graphics();
        cloudGlow.lineStyle(1, 0xFFFFFF, 0.3);
        cloudGlow.strokeCircle(450, y, 20);

        this.clouds.add(cloud);
      }

      private updateClouds() {
        this.clouds?.getChildren().forEach((cloud: any) => {
          cloud.x -= 0.5;
          if (cloud.x < -30) {
            cloud.destroy();
          }
        });
      }

      private checkCollision(a: Phaser.GameObjects.Rectangle, b: Phaser.GameObjects.Rectangle): boolean {
        return Phaser.Geom.Intersects.RectangleToRectangle(a.getBounds(), b.getBounds());
      }

      private endGame() {
        this.isGameOver = true;
        this.scene.pause();
        gameOver.value = true;
        isPlaying.value = false;

        // Adiciona efeito de flash ao game over
        const flash = this.add.rectangle(200, 300, 400, 600, 0xFFFFFF);
        flash.setAlpha(0.3);
        this.tweens.add({
          targets: flash,
          alpha: 0,
          duration: 500,
          ease: 'Power2',
          onComplete: () => flash.destroy()
        });
      }
    }

    const initGame = () => {
      if (!gameContainer.value) return;

      if (game) {
        game.destroy(true);
        game = null;
      }

      const config = {
        type: Phaser.AUTO,
        width: 400,
        height: 600,
        parent: 'flappy-bird-game-container',
        backgroundColor: '#87CEEB',
        scene: FlappyScene
      };

      game = new Phaser.Game(config);

      flappyScene = game.scene.getScene('FlappyScene') as FlappyScene;
    };

    const startGame = () => {
      score.value = 0;
      gameOver.value = false;
      isPlaying.value = true;
      initGame();
    };

    const restartGame = () => {
      gameOver.value = false;
      startGame();
    };

    onMounted(() => {
      initGame();
    });

    onUnmounted(() => {
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
.flappy-bird-game {
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

#flappy-bird-game-container {
  width: 400px;
  height: 600px;
  border-radius: 12px;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.1);
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
  background: rgba(var(--v-theme-background), 0.85);
  backdrop-filter: blur(10px);
}

.game-info {
  text-align: center;
  padding: 2.5rem;
  border-radius: 16px;
  background: var(--v-theme-surface);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  max-width: 90%;
  width: 400px;
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
  padding: 1rem;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
}

.key-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.key-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 8px;
}

.score-display {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
}

.current-score,
.final-score {
  color: var(--v-theme-primary);
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.high-score {
  color: var(--v-theme-secondary);
  font-weight: bold;
}

.start-btn,
.restart-btn,
.tutorial-btn,
.close-tutorial-btn {
  min-width: 200px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
