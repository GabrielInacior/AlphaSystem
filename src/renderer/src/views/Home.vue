<template>
  <v-container>
    <v-row>
      <v-col v-if="isBarbearia">
        <h1>Barbearia - Insights</h1>
        <!-- Exemplo de visualização de dados da barbearia -->
      </v-col>
      <v-col v-if="isLoja">
        <h1>Loja - Insights</h1>
        <!-- Exemplo de visualização de dados da loja -->
      </v-col>
      <v-col v-if="!isBarbearia && !isLoja">
        <h1>Bem-vindo!</h1>
        <p>Selecione um módulo (Barbearia ou Loja) para ver os insights.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Home',
  setup() {
    const route = useRoute()

    const isBarbearia = computed(() => route.name === 'barbearia')
    const isLoja = computed(() => route.name === 'loja')

    return {
      isBarbearia,
      isLoja
    }
  }
})
</script>
