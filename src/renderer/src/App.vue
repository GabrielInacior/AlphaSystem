<template>
  <v-app>
    <v-row no-gutters class="full-height">
      <v-col cols="auto" class="sidebar">
        <Sidebar />
      </v-col>

      <v-col class="content">
        <router-view />
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

<style>
.full-height {
  min-height: 100vh;
  display: flex;
}

.content {
  flex-grow: 1;
  min-height: 100%;
}

</style>


