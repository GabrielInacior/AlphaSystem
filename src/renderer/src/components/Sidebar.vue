<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" :width="rail ? 160 : 300" permanent style="height: 100vh;" app class="sidebar">
    <!-- Logo and Toggle Section -->
    <div class="sidebar-header">
      <v-list-item class="logo-item" title="Barbearia Alpha" nav density="compact">
        <template v-slot:prepend>
          <v-img :width="50" aspect-ratio="16/9" cover :src="currentTheme === 'light' ? LogoPreta : LogoBranca"
            class="logo-img"></v-img>
        </template>
        <template v-slot:append>
          <v-btn v-if="!rail" rounded="0" variant="plain" @click.stop="toggleRail" class="toggle-btn">
            <v-icon icon="mdi-chevron-left"></v-icon>
            <v-tooltip activator="parent" location="start">Esconder barra lateral</v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
    </div>

    <!-- Main Navigation -->
    <v-list v-model:opened="open" density="compact" class="sidebar-menu">
      <!-- Início -->
      <v-list-item prepend-icon="mdi-home" title="Início" @click="navigateToPage('inicio')" class="menu-item">
        <template v-slot:prepend>
          <v-icon color="primary">mdi-home</v-icon>
        </template>
      </v-list-item>

      <!-- Loja Section -->
      <v-list-group v-if="!rail" value="Loja" class="menu-group">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-store" title="Loja" class="menu-item">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-store</v-icon>
            </template>
          </v-list-item>
        </template>
        <v-list-item @click="navigateToPage('loja')" prepend-icon="mdi-store-cog" density="compact" class="submenu-item">Visão Geral: Loja</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('produtos')" prepend-icon="mdi-package-variant" class="submenu-item">Gerenciar Produtos</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('categorias')" prepend-icon="mdi-shape" class="submenu-item">Gerenciar Categorias</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('contas-pagar')" prepend-icon="mdi-file-document-multiple" class="submenu-item">Contas a Pagar</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('despesas')" prepend-icon="mdi-cash-remove" class="submenu-item">Gerenciar Despesas</v-list-item>
      </v-list-group>

      <v-menu v-if="rail" :location="'end'" transition="slide-x-transition" v-model="lojaOpen" class="rail-menu">
        <template v-slot:activator="{ props }">
          <v-btn class="rail-btn" v-bind="props" variant="plain">
            <v-icon :size="25" color="primary">mdi-store</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" class="rail-submenu">
          <v-list-item @click="navigateToPage('loja')" prepend-icon="mdi-store-cog" density="compact">Visão Geral: Loja</v-list-item>
          <v-list-item density="compact" @click="navigateToPage('produtos')" prepend-icon="mdi-package-variant">Gerenciar Produtos</v-list-item>
          <v-list-item density="compact" @click="navigateToPage('categorias')" prepend-icon="mdi-shape">Gerenciar Categorias</v-list-item>
          <v-list-item density="compact" @click="navigateToPage('contas-pagar')" prepend-icon="mdi-file-document-multiple">Contas a Pagar</v-list-item>
          <v-list-item density="compact" @click="navigateToPage('despesas')" prepend-icon="mdi-cash-remove">Gerenciar Despesas</v-list-item>
        </v-list>
      </v-menu>

      <!-- Barbearia Section -->
      <v-list-group v-if="!rail" value="Barbearia" class="menu-group">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-content-cut" title="Barbearia" class="menu-item">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-content-cut</v-icon>
            </template>
          </v-list-item>
        </template>
        <v-list-item density="compact" @click="navigateToPage('barbearia')" prepend-icon="mdi-content-cut" class="submenu-item">Visão Geral: Barbearia</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('servicos')" prepend-icon="mdi-hair-dryer-outline" class="submenu-item">Gerenciar Serviços</v-list-item>
      </v-list-group>

      <v-menu v-if="rail" :location="'end'" transition="slide-x-transition" v-model="barbeariaOpen" class="rail-menu">
        <template v-slot:activator="{ props }">
          <v-btn class="rail-btn" v-bind="props" variant="plain">
            <v-icon :size="25" color="primary">mdi-content-cut</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" class="rail-submenu">
          <v-list-item @click="navigateToPage('barbearia')" prepend-icon="mdi-content-cut">Visão Geral: Barbearia</v-list-item>
          <v-list-item @click="navigateToPage('servicos')" prepend-icon="mdi-hair-dryer-outline">Gerenciar Serviços</v-list-item>
        </v-list>
      </v-menu>

      <!-- Clientes Section -->
      <v-list-group v-if="!rail" value="Clientes" class="menu-group">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-account-group" title="Clientes" class="menu-item">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-account-group</v-icon>
            </template>
          </v-list-item>
        </template>
        <v-list-item @click="navigateToPage('clientes')" prepend-icon="mdi-account-multiple-plus" class="submenu-item">Gerenciar Clientes</v-list-item>
      </v-list-group>

      <v-menu v-if="rail" :location="'end'" transition="slide-x-transition" v-model="clientesOpen" class="rail-menu">
        <template v-slot:activator="{ props }">
          <v-btn class="rail-btn" v-bind="props" variant="plain">
            <v-icon :size="25" color="primary">mdi-account-group</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" class="rail-submenu">
          <v-list-item @click="navigateToPage('clientes')" prepend-icon="mdi-account-multiple-plus">Gerenciar Clientes</v-list-item>
        </v-list>
      </v-menu>

      <!-- Vendas Section -->
      <v-list-group v-if="!rail" value="Vendas" class="menu-group">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-cash-register" title="Vendas" class="menu-item">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-cash-register</v-icon>
            </template>
          </v-list-item>
        </template>
        <v-list-item density="compact" @click="navigateToPage('vendas')" prepend-icon="mdi-account-cash" class="submenu-item">Registrar Nova Venda</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('historico-vendas')" prepend-icon="mdi-clipboard-text-clock-outline" class="submenu-item">Histórico de Vendas</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('fiados')" prepend-icon="mdi-account-clock" class="submenu-item">Vendas Pendentes (Fiado)</v-list-item>
      </v-list-group>

      <v-menu v-if="rail" :location="'end'" transition="slide-x-transition" v-model="vendaOpen" class="rail-menu">
        <template v-slot:activator="{ props }">
          <v-btn class="rail-btn" v-bind="props" variant="plain">
            <v-icon :size="25" color="primary">mdi-cash-register</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" class="rail-submenu">
          <v-list-item @click="navigateToPage('vendas')" prepend-icon="mdi-account-cash">Registrar Nova venda</v-list-item>
          <v-list-item @click="navigateToPage('historico-vendas')" prepend-icon="mdi-clipboard-text-clock-outline">Histórico de Vendas</v-list-item>
          <v-list-item @click="navigateToPage('fiados')" prepend-icon="mdi-account-clock">Vendas pendentes(Fiado)</v-list-item>
        </v-list>
      </v-menu>

      <!-- Games Section -->
      <v-list-item v-if="!rail" prepend-icon="mdi-gamepad-variant" title="Jogos" @click="navigateToPage('games')" class="menu-item">
        <template v-slot:prepend>
          <v-icon color="primary">mdi-gamepad-variant</v-icon>
        </template>
      </v-list-item>

      <v-btn v-if="rail" class="rail-btn" variant="plain" @click="navigateToPage('games')">
        <v-icon :size="25" color="primary">mdi-gamepad-variant</v-icon>
        <v-tooltip activator="parent" location="start">Jogos</v-tooltip>
      </v-btn>
    </v-list>
  </v-navigation-drawer>

  <!-- Expand Button (when sidebar is collapsed) -->
  <v-btn v-if="rail" variant="tonal" class="expand-btn" density="default" size="x-small" @click.stop="toggleRail">
    <v-icon icon="mdi-chevron-double-right"></v-icon>
    <v-tooltip activator="parent" location="start">Expandir barra lateral</v-tooltip>
  </v-btn>

  <v-main style="height: 100vh;"></v-main>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import LogoAlpha from '../assets/LogoAlpha.png';
import { useUserSideBarStore } from '@renderer/store/userSideBarStore';
import LogoAlphaBranca from '../assets/LogoAlphaBranca.png';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter();
    const drawer = ref(true);
    const rail = computed(() => useUserSideBarStore().rail);

    const currentTheme = ref('light');
    const lojaOpen = ref(false);
    const vendaOpen = ref(false);
    const barbeariaOpen = ref(false);
    const clientesOpen = ref(false);
    const LogoPreta = LogoAlpha;
    const LogoBranca = LogoAlphaBranca;
    const open = ref(['Loja', 'Barbearia', 'Clientes', 'Vendas']);

    const { global } = useTheme();

    onMounted(() => {
      currentTheme.value = 'light';
    });

    watch(() => global.name.value, (newTheme) => {
      currentTheme.value = newTheme;
    });

    const toggleRail = () => {
      useUserSideBarStore().toggleRail();
    };
    const navigateToPage = (page: string) => {
      router.push({ name: page });
    };

    return {
      drawer,
      rail,
      toggleRail,
      currentTheme,
      navigateToPage,
      LogoPreta,
      LogoBranca,
      open,
      lojaOpen,
      vendaOpen,
      barbeariaOpen,
      clientesOpen,
    };
  },
});
</script>

<style scoped>
.sidebar {
  background: rgb(var(--v-theme-sidebarbg)) !important;
  border-right: 1px solid var(--color-border) !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  margin: 8px;
  border-radius: 16px;
  height: calc(100vh - 16px) !important;
  position: relative;
}

:deep(.v-theme--dark) .sidebar {
  background: rgb(var(--v-theme-sidebarbg)) !important;
}

.sidebar-header {
  padding: 16px 8px;
  border-bottom: 1px solid var(--color-border);
  background: rgb(var(--v-theme-sidebarbg));
  border-radius: 16px 16px 0 0;
}

:deep(.v-theme--dark) .sidebar-header {
  background: rgb(var(--v-theme-sidebarbg));
}

.logo-item {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logo-item:hover {
  background: var(--color-background-mute) !important;
}

.logo-img {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.toggle-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: var(--color-background-mute) !important;
}

.sidebar-menu {
  padding: 8px;
  background: rgb(var(--v-theme-sidebarbg));
}

:deep(.v-theme--dark) .sidebar-menu {
  background: rgb(var(--v-theme-sidebarbg));
}

.menu-item {
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: var(--color-background-mute) !important;
  transform: translateX(4px);
}

.menu-group {
  border-radius: 12px;
  margin-bottom: 4px;
  overflow: hidden;
}

.submenu-item {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.3s ease;
}

.submenu-item:hover {
  background: var(--color-background-mute) !important;
  transform: translateX(4px);
}

.rail-btn {
  width: 100%;
  text-align: center;
  border-radius: 12px;
  margin: 4px 0;
  transition: all 0.3s ease;
  height: 48px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

.rail-btn .v-icon {
  margin: 0 !important;
  font-size: 24px !important;
}

.rail-btn:hover {
  background: var(--color-background-mute) !important;
  transform: translateX(4px);
}

:deep(.v-theme--dark) .rail-btn:hover {
  background: var(--color-background-mute) !important;
}

:deep(.v-list-item--active.rail-btn) {
  background: var(--color-primary) !important;
  color: white !important;
}

:deep(.v-list-item--active.rail-btn .v-icon) {
  color: white !important;
}

.rail-menu {
  border-radius: 12px;
  overflow: hidden;
  margin-left: 8px;
}

.rail-submenu {
  background: rgb(var(--v-theme-sidebarbg)) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 12px !important;
  padding: 8px;
  min-width: 200px;
}

:deep(.v-theme--dark) .rail-submenu {
  background: rgb(var(--v-theme-sidebarbg)) !important;
  border-color: var(--color-border) !important;
}

.expand-btn {
  position: relative;
  top: 50%;
  width: 32px !important;
  z-index: 1001 !important;
  font-size: 20px !important;
  height: 64px !important;
  margin-left: 60px;
  transform: translateY(-50%);
  background: rgb(var(--v-theme-sidebarbg)) !important;
  border: 1px solid var(--color-border) !important;
  color: var(--color-text) !important;
  transition: all 0.3s ease !important;
  border-radius: 0 8px 8px 0 !important;
  box-shadow: 2px 0 8px -2px rgba(0, 0, 0, 0.1) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  margin-top: 0 !important;
}

:deep(.v-theme--dark) .expand-btn {
  background: rgb(var(--v-theme-sidebarbg)) !important;
}

.expand-btn:hover {
  background: rgb(var(--v-theme-sidebarbg)) !important;
  transform: translateY(-50%) translateX(4px);
  box-shadow: 4px 0 12px -2px rgba(0, 0, 0, 0.15) !important;
}

:deep(.v-theme--dark) .expand-btn:hover {
  background: rgb(var(--v-theme-sidebarbg)) !important;
}

:deep(.v-navigation-drawer--rail) {
  width: 160px !important;
  margin-right: 32px !important;
  display: flex;
  flex-direction: column;
  position: relative;
}

:deep(.v-navigation-drawer--rail .v-list) {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

:deep(.v-navigation-drawer--rail .v-list-item) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

:deep(.v-navigation-drawer--rail .v-list-item__prepend) {
  margin-inline-end: 0 !important;
  margin-inline-start: 0 !important;
}

/* Vuetify Overrides */
:deep(.v-list-item) {
  color: var(--color-text) !important;
  transition: all 0.3s ease !important;
  min-height: 48px !important;
}

:deep(.v-list-item--active) {
  background: var(--color-primary) !important;
  color: white !important;
  border-radius: 12px;
}

:deep(.v-list-item--active:hover) {
  background: var(--color-secondary) !important;
}

:deep(.v-list-item__prepend) {
  color: var(--color-text) !important;
}

:deep(.v-list-item--active .v-list-item__prepend) {
  color: white !important;
}

:deep(.v-list-group__header) {
  color: var(--color-text) !important;
  border-radius: 12px;
}

:deep(.v-list-group__items) {
  background: var(--color-background-soft) !important;
  padding: 4px 0;
}

:deep(.v-menu) {
  background: rgb(var(--v-theme-sidebarbg)) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 12px !important;
  margin-left: 8px !important;
}

:deep(.v-menu .v-list) {
  background: rgb(var(--v-theme-sidebarbg)) !important;
  padding: 4px !important;
}

:deep(.v-menu .v-list-item) {
  color: var(--color-text) !important;
  border-radius: 8px;
  margin: 4px 0;
  min-height: 40px !important;
}

:deep(.v-menu .v-list-item:hover) {
  background: var(--color-background-mute) !important;
  transform: translateX(4px);
}

:deep(.v-divider) {
  border-color: var(--color-border) !important;
}

:deep(.v-tooltip) {
  background: var(--color-background-mute) !important;
  color: var(--color-text) !important;
  border-radius: 8px !important;
  font-size: 12px !important;
  padding: 8px 12px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}
</style>
