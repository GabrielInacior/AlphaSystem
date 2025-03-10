<template>
  <v-container style="height: 100vh;">
    <v-card style="height: 98%;">
      <v-card-title>
        Clientes
        <v-spacer></v-spacer>
        <v-text-field v-model="search" label="Buscar cliente" clearable dense></v-text-field>
        <v-btn color="primary" @click="openModal(null)">Novo Cliente</v-btn>
      </v-card-title>

      <v-data-table style="height: 85%" :headers="headers" :items="filteredClientes"
        class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteCliente(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingCliente ? 'Editar Cliente' : 'Novo Cliente' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="cliente.nome" label="Nome" required></v-text-field>
          <v-text-field v-model="cliente.aniversario" label="Aniversário" type="date" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveCliente">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'ClienteView',
  setup() {
    const clientes = ref<any[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingCliente = ref<any | null>(null);
    const cliente = ref({ nome: '', aniversario: '' });

    const headers = [
      { text: 'Nome', value: 'nome' },
      { text: 'Aniversário', value: 'aniversario' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const filteredClientes = computed(() =>
      clientes.value.filter(c => c.nome.toLowerCase().includes(search.value.toLowerCase()))
    );

    const loadClientes = async () => {
      clientes.value = await window.api.getAllClientes();
    };

    const openModal = (editItem: any) => {
      editingCliente.value = editItem;
      cliente.value = editItem ? { ...editItem } : { nome: '', aniversario: '' };
      modalOpen.value = true;
    };

    const saveCliente = async () => {
      if (editingCliente.value) {
        await window.api.updateCliente(editingCliente.value.id, cliente.value.nome, cliente.value.aniversario);
      } else {
        await window.api.createCliente(cliente.value.nome, cliente.value.aniversario);
      }
      modalOpen.value = false;
      loadClientes();
    };

    const deleteCliente = async (id: number) => {
      await window.api.deleteCliente(id);
      loadClientes();
    };

    onMounted(loadClientes);

    return {
      clientes,
      search,
      modalOpen,
      editingCliente,
      cliente,
      headers,
      filteredClientes,
      openModal,
      saveCliente,
      deleteCliente
    };
  }
});
</script>
