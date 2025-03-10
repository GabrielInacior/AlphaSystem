<template>
  <v-container>
    <v-card>
      <v-card-title>
        Despesas
        <v-spacer></v-spacer>
        <v-text-field v-model="search" label="Buscar Despesa" clearable dense></v-text-field>
        <v-btn color="primary" @click="openModal(null)">Nova Despesa</v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredDespesas"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteDespesa(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingDespesa ? 'Editar Despesa' : 'Nova Despesa' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="despesa.descricao" label="Descrição" required></v-text-field>
          <v-text-field v-model="despesa.valor" label="Valor" type="number" required></v-text-field>
          <v-text-field v-model="despesa.data" label="Data" type="date" required></v-text-field>
          <v-text-field v-model="despesa.tipo" label="Tipo" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveDespesa">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'DespesaView',
  setup() {
    const despesas = ref<any[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingDespesa = ref<any | null>(null);
    const despesa = ref({ descricao: '', valor: 0, data: '', tipo: '' });

    const headers = [
      { text: 'Descrição', value: 'descricao' },
      { text: 'Valor', value: 'valor' },
      { text: 'Data', value: 'data' },
      { text: 'Tipo', value: 'tipo' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const filteredDespesas = computed(() =>
      despesas.value.filter(d => d.descricao.toLowerCase().includes(search.value.toLowerCase()))
    );

    const loadDespesas = async () => {
      despesas.value = await window.api.getAllDespesas();
    };

    const openModal = (editItem: any) => {
      editingDespesa.value = editItem;
      despesa.value = editItem ? { ...editItem } : { descricao: '', valor: 0, data: '', tipo: '' };
      modalOpen.value = true;
    };

    const saveDespesa = async () => {
      if (editingDespesa.value) {
        await window.api.updateDespesa(editingDespesa.value.id, despesa.value.descricao, despesa.value.valor, despesa.value.data, despesa.value.tipo);
      } else {
        await window.api.createDespesa(despesa.value.descricao, despesa.value.valor, despesa.value.data, despesa.value.tipo);
      }
      modalOpen.value = false;
      loadDespesas();
    };

    const deleteDespesa = async (id: number) => {
      await window.api.deleteDespesa(id);
      loadDespesas();
    };

    onMounted(loadDespesas);

    return {
      despesas,
      search,
      modalOpen,
      editingDespesa,
      despesa,
      headers,
      filteredDespesas,
      openModal,
      saveDespesa,
      deleteDespesa
    };
  }
});
</script>
