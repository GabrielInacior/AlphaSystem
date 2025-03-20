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
import { defineComponent, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
    Sidebar
  },
  setup() {
    const router = useRouter();

    onMounted(() => {
      router.push({ name: 'inicio' });
    });

  },
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


