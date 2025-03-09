<template>
  <v-app>
    <Sidebar />
    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Home from './views/Home.vue'

export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
    Home
  }
})
</script>

<style scoped>
.v-application--wrap {
  padding-top: 64px;
}
</style>
