<template>
  <v-container>
    <v-card>
      <v-card-title>
        Fiados
        <v-spacer></v-spacer>
        <v-text-field v-model="search" label="Buscar Fiado" clearable dense></v-text-field>
        <v-btn color="primary" @click="openModal(null)">Novo Fiado</v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredFiados"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteFiado(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingFiado ? 'Editar Fiado' : 'Novo Fiado' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="fiado.cliente_id" label="ID Cliente" required></v-text-field>
          <v-text-field v-model="fiado.valor" label="Valor" type="number" required></v-text-field>
          <v-text-field v-model="fiado.data" label="Data" type="date" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveFiado">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'FiadoView',
  setup() {
    const fiados = ref<any[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingFiado = ref<any | null>(null);
    const fiado = ref({ cliente_id: 0, valor: 0, data: '' });

    const headers = [
      { text: 'ID Cliente', value: 'cliente_id' },
      { text: 'Valor', value: 'valor' },
      { text: 'Data', value: 'data' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const filteredFiados = computed(() =>
      fiados.value.filter(f => String(f.cliente_id).includes(search.value))
    );

    const loadFiados = async () => {
      fiados.value = await window.api.getAllFiados();
    };

    const openModal = (editItem: any) => {
      editingFiado.value = editItem;
      fiado.value = editItem ? { ...editItem } : { cliente_id: 0, valor: 0, data: '' };
      modalOpen.value = true;
    };

    const saveFiado = async () => {
      if (editingFiado.value) {
        await window.api.updateFiado(editingFiado.value.id, fiado.value.cliente_id, fiado.value.valor, fiado.value.data);
      } else {
        await window.api.createFiado(fiado.value.cliente_id, fiado.value.valor, fiado.value.data);
      }
      modalOpen.value = false;
      loadFiados();
    };

    const deleteFiado = async (id: number) => {
      await window.api.deleteFiado(id);
      loadFiados();
    };

    onMounted(loadFiados);

    return {
      fiados,
      search,
      modalOpen,
      editingFiado,
      fiado,
      headers,
      filteredFiados,
      openModal,
      saveFiado,
      deleteFiado
    };
  }
});
</script>
