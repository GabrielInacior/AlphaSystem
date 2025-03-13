<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" :width="300" permanent style="height: 100vh;" app class="ss">
    <v-list v-model:opened="open" density="compact">
      <!-- Item do cabeçalho da barra lateral -->
      <v-list-item class="first-item" title="Barbearia Alpha" nav density="compact">
        <template v-slot:prepend>
          <v-img :width="50" aspect-ratio="16/9" cover :src="currentTheme === 'light' ? LogoPreta : LogoBranca"
            style="margin-right: 15px;"></v-img>
        </template>
        <template v-slot:append>
          <v-btn variant="plain" @click.stop="toggleRail" style="font-size: 25px !important;">
            <v-icon icon="mdi-chevron-left" style="width: 20px!important;"></v-icon>
            <v-tooltip activator="parent" location="start">Esconder barra lateral</v-tooltip>
          </v-btn>
        </template>
      </v-list-item>

      <v-list-item prepend-icon="mdi-home" title="Início" @click="navigateToPage('inicio')"></v-list-item>
      <v-list-group v-if="!rail" value="Loja">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-store" title="Loja"></v-list-item>
        </template>
        <v-list-item @click="navigateToPage('loja')" prepend-icon="mdi-store-cog" density="compact">Loja</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('produtos')"
          prepend-icon="mdi-clipboard-list-outline">Gerenciar
          Produtos</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('despesas')" prepend-icon="mdi-currency-usd">Gerenciar
          Despesas
        </v-list-item>
      </v-list-group>

      <v-menu v-if="rail" :location="'end'" transition="slide-x-transition" v-model="lojaOpen">
        <template v-slot:activator="{ props }">
          <v-btn class="align-center elevation-0 my-1 custom-list-item" v-bind="props" variant="plain">
            <v-icon :size="25" color="icon">mdi-store</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="navigateToPage('loja')" prepend-icon="mdi-store-cog">Loja</v-list-item>
          <v-list-item @click="navigateToPage('produtos')" prepend-icon="mdi-clipboard-list-outline">Gerenciar
            Produtos</v-list-item>
          <v-list-item @click="navigateToPage('despesas')" prepend-icon="mdi-currency-usd">Gerenciar Despesas
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Menu de Barbearia -->
      <v-list-group v-if="!rail" value="Barbearia">
        <template v-slot:activator="{ props }">
          <v-list-item  v-bind="props" prepend-icon="mdi-content-cut" title="Barbearia"></v-list-item>
        </template>
        <v-list-item density="compact" @click="navigateToPage('barbearia')"
          prepend-icon="mdi-content-cut">Barbearia</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('servicos')" prepend-icon="mdi-currency-usd">Gerenciar
          Serviços</v-list-item>
      </v-list-group>
      <v-menu v-if="rail" :location="'end'" transition="slide-x-transition" v-model="barbeariaOpen">
        <template v-slot:activator="{ props }">
          <v-btn class="align-center elevation-0 my-1 custom-list-item" v-bind="props" variant="plain">
            <v-icon :size="25" color="icon">mdi-content-cut</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="navigateToPage('barbearia')" prepend-icon="mdi-content-cut">Barbearia</v-list-item>
          <v-list-item @click="navigateToPage('servicos')" prepend-icon="mdi-currency-usd">Gerenciar
            Serviços</v-list-item>
        </v-list>

      </v-menu>

      <!-- Menu de Clientes -->
      <v-list-group v-if="!rail" value="Clientes">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-account-group" title="Clientes"></v-list-item>
        </template>
        <v-list-item @click="navigateToPage('clientes')" prepend-icon="mdi-account-multiple-plus">Gerenciar
          Clientes</v-list-item>

      </v-list-group>
      <v-menu v-if="rail" :location="'end'" transition="slide-x-transition" v-model="clientesOpen">
        <template v-slot:activator="{ props }">
          <v-btn class="align-center elevation-0 my-1 custom-list-item" v-bind="props" variant="plain">
            <v-icon :size="25" color="icon">mdi-account-group</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="navigateToPage('clientes')" prepend-icon="mdi-account-multiple-plus">Gerenciar
            Clientes</v-list-item>
        </v-list>
      </v-menu>

      <v-list-group v-if="!rail" value="Vendas">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-store" title="Vendas"></v-list-item>
        </template>
        <v-list-item density="compact" @click="navigateToPage('vendas')" prepend-icon="mdi-store-cog">Registrar Nova
          Venda</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('historico-vendas')"
          prepend-icon="mdi-store-cog">Histórico de
          Vendas</v-list-item>
        <v-list-item density="compact" @click="navigateToPage('fiados')"
          prepend-icon="mdi-account-multiple-minus">Vendas
          Pendentes<br>(Fiado)</v-list-item>

      </v-list-group>

      <v-menu v-if="rail" :location="'end'" transition="slide-x-transition" v-model="vendaOpen">
        <template v-slot:activator="{ props }">
          <v-btn class="align-center elevation-0 my-1 custom-list-item" v-bind="props" variant="plain">
            <v-icon :size="25" color="icon">mdi-store</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="navigateToPage('vendas')" prepend-icon="mdi-store-cog">Registrar Nova venda</v-list-item>
          <v-list-item @click="navigateToPage('historico-vendas')" prepend-icon="mdi-store-cog">Histórico de
            Vendas</v-list-item>
          <v-list-item @click="navigateToPage('fiados')" prepend-icon="mdi-account-multiple-minus">Vendas
            pendentes(Fiado)</v-list-item>
        </v-list>
      </v-menu>

    </v-list>

    <v-list density="compact" nav style="position: absolute; bottom: 0; width: 100%;">
      <v-list-item @click="toggleTheme" prepend-icon="mdi-theme-light-dark" title="Alterar Tema"> <v-tooltip v-if="rail"
          activator="parent" location="start">Alterar tema</v-tooltip></v-list-item>
      <v-list-item title="Sair" prepend-icon="mdi-power" @click="logout">
        <v-tooltip v-if="rail" activator="parent" location="start">Sair para a área de trabalho</v-tooltip>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-btn v-if="rail" variant="tonal" class="botaozao" density="default" size="x-small" @click.stop="toggleRail">
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

    const toggleTheme = () => {
      const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
      global.name.value = newTheme;
    };

    const toggleRail = () => {
      useUserSideBarStore().toggleRail();
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
      toggleRail,
      currentTheme,
      navigateToPage,
      toggleTheme,
      logout,
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
.first-item :deep(.v-list-item-title) {
  font-size: 18px;
  font-weight: bold;
}

.botaozao {
  position: absolute;
  top: 2%;
  width: 10px !important;
  z-index: 1001 !important;
  font-size: 25px !important;
  height: 35px !important;
  left: 41px;
  transform: translateY(-50%);
}

.custom-list-item {
  width: 100%;
  text-align: left;
}

.ss {
  font-size: 14px !important;
}
</style>
