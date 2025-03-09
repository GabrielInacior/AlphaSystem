<template>
  <v-navigation-drawer app permanent>
    <v-list>
      <v-list-item-group v-if="!$route.meta.hideSidebar">
        <v-list-item @click="goToBarbearia">
          <v-list-item-content>
            <v-list-item-title>Barbearia</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToLoja">
          <v-list-item-content>
            <v-list-item-title>Loja</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter()

    const goToBarbearia = () => {
      router.push({ name: 'barbearia' })
    }

    const goToLoja = () => {
      router.push({ name: 'loja' })
    }

    return {
      goToBarbearia,
      goToLoja
    }
  }
})
</script>
