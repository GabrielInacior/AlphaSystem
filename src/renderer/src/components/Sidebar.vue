<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" :width="309" permanent style="height: 100vh;" app>
    <v-list-item class="first-item" title="Barbearia Alpha" nav>
      <template v-slot:prepend>
        <v-avatar size="40px">
          <img src="../assets/LogoAlpha.png" style="width: 95%;"/>
        </v-avatar>
      </template>
      <template v-slot:append>
        <v-btn variant="flat" @click.stop="alterRail" style="width: 30px!important; height: 30px!important;  font-size: 25px !important;">
          <v-icon icon="mdi-chevron-double-left" style="width: 20px!important;"></v-icon>
          <v-tooltip activator="parent" location="start">Esconder barra lateral</v-tooltip>
        </v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Início" @click="navigateToPage('inicio')"></v-list-item>
      <v-list-item prepend-icon="mdi-store" title="Loja" @click="navigateToPage('loja')"></v-list-item>
      <v-list-item prepend-icon="mdi-content-cut" title="Barbearia" @click="navigateToPage('barbearia')"></v-list-item>
      <v-list-item prepend-icon="mdi-account-group" title="Clientes" @click="navigateToPage('clientes')"></v-list-item>
    </v-list>

    <v-list density="compact" nav style="position: absolute; bottom: 0; width: 100%;">
      <v-list-item @click="toggleTheme" prepend-icon="mdi-theme-light-dark" title="Alterar Tema"></v-list-item>
      <v-list-item title="Sair" prepend-icon="mdi-power" @click="logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-btn v-if="rail" variant="flat" class="botaozao" @click.stop="alterRail">
    <v-icon icon="mdi-chevron-double-right"></v-icon>
    <v-tooltip activator="parent" location="start">Expandir barra lateral</v-tooltip>
  </v-btn>

  <v-main style="height: 100vh;"></v-main>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter();
    const drawer = ref(true);
    const rail = ref(false);
    const currentTheme = ref('light'); // Inicializando o tema

    const { global } = useTheme();

    // Define o currentTheme como 'light' no início
    onMounted(() => {
      currentTheme.value = 'light';
    });

    // Observa o global.name e atualiza currentTheme
    watch(() => global.name.value, (newTheme) => {
      currentTheme.value = newTheme;
    });

    const toggleTheme = () => {
      const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
      global.name.value = newTheme;
    };

    const alterRail = () => {
      rail.value = !rail.value;
    };

    const navigateToPage = (page: string) => {
      router.push({ name: page });
    };

    const logout = () => {
      window.api.closeWindow();
    };

    return {
      drawer,
      rail,
      alterRail,
      currentTheme,
      navigateToPage,
      toggleTheme,
      logout,
    };
  },
});
</script>

<style scoped>
.first-item :deep(.v-list-item-title) {
  font-size: 18px;
  font-weight: bold;
}

.botaozao {
  position: absolute;
  top: 50%;
  width: 10px !important;
  font-size: 25px !important;
  height: 35px !important;
  left: 39px;
  transform: translateY(-50%);
}
</style>
