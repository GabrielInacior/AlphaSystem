<template>
  <v-app>
    <v-row>
      <!-- Sidebar -->
      <v-col cols="auto">
        <Sidebar />
      </v-col>

      <!-- Conteúdo principal -->
      <v-col cols="12" sm="9">
        <router-view /> <!-- Exibe as views da rota -->
      </v-col>
    </v-row>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from './components/Sidebar.vue'

export default defineComponent({
  name: 'App',
  components: {
    Sidebar
  }
})
</script>

