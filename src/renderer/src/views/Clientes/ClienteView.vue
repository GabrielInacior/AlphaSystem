<template>
  <v-container style="height: 90vh; width: 100%; display: flex; flex-direction: column;">
    <v-card style="height: 100%; width: 100%; display: flex; flex-direction: column;">

      <v-card-title>
        Clientes

        <v-row dense>
          <v-col cols="12" sm="6" md="4">
            <v-text-field density="compact" v-model="searchNome" label="Filtrar por Nome" dense outlined color="grey"
              class="search-input" />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field density="compact" v-model="searchTelefone" label="Filtrar por Telefone" dense outlined
              color="grey" class="search-input" @input="formatTelefoneFiltro()" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn color="primary" @click="openModal(null)">Novo Cliente</v-btn>
          </v-col>

        </v-row>
      </v-card-title>


      <v-data-table density="compact" style="height: 74%; width: 100%;" :headers="headers" :items="filteredClientes"
        class="elevation-1" items-per-page-text="Itens por página" no-data-text="Nenhum cliente encontrado">
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.value" class="font-weight-bold text-left">
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template v-slot:item.aniversario="{ item }">
          {{ item.aniversario ? item.aniversario : 'Não informado' }}
        </template>

        <template v-slot:item.telefone="{ item }">
          {{ item.telefone ? item.telefone : 'Não informado' }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteCliente(item.id)" v-if="item.id">mdi-delete</v-icon>
        </template>
      </v-data-table>

    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingCliente ? 'Editar Cliente' : 'Novo Cliente' }}
        </v-card-title>
        <v-card-text>
          <!-- Campo Nome com validação -->
          <v-text-field density="compact" v-model="cliente.nome" label="Nome" :rules="[nameRule]"
            required></v-text-field>
          <v-text-field density="compact" v-model="cliente.aniversario" label="Aniversário" type="date"
            required></v-text-field>
          <v-text-field density="compact" v-model="cliente.telefone" label="Telefone" @input="formatTelefone"
            :rules="telefoneRules"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <!-- Botão Salvar desabilitado caso o nome esteja vazio -->
          <v-btn color="primary" @click="saveCliente" :disabled="!cliente.nome">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { ClienteEntity } from '@renderer/entities/ClienteEntity';

export default defineComponent({
  name: 'ClienteView',
  setup() {
    const clientes = ref<ClienteEntity[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingCliente = ref<ClienteEntity | null>(null);
    const cliente = ref<ClienteEntity>(new ClienteEntity({ nome: '', aniversario: null, telefone: '' }));

    const headers = [
      { text: 'Nome', value: 'nome' },
      { text: 'Aniversário', value: 'aniversario' },
      { text: 'Telefone', value: 'telefone' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const searchNome = ref('');
    const searchTelefone = ref('');

    const filteredClientes = computed(() =>
      clientes.value.filter(c =>
        (c.nome?.toLowerCase() || '').includes(searchNome.value.toLowerCase()) &&
        (c.telefone || '').includes(searchTelefone.value)
      )
    );

    const nameRule = (v: string) => !!v || 'O nome é obrigatório';

    const telefoneRules = [
      (v: string) =>
        /^(\(\d{2}\)\s\d{5}-\d{4})$/.test(v) || 'Formato inválido. Exemplo: (17) 99731-2191',
      (v: string) =>
        v.replace(/\D/g, '').length >= 10 || 'Número incompleto. O telefone deve ter pelo menos 10 dígitos.'
    ];

    const loadClientes = async () => {
      const dadosClientes = await window.api.getAllClientes();
      clientes.value = dadosClientes.map((cliente: any) => new ClienteEntity(cliente));
    };

    const openModal = (editItem: ClienteEntity | null) => {
      editingCliente.value = editItem;
      cliente.value = editItem ? new ClienteEntity(editItem) : new ClienteEntity({ nome: '', aniversario: null, telefone: '' });
      modalOpen.value = true;
    };

    const saveCliente = async () => {
      if (editingCliente.value) {
        await window.api.updateCliente(editingCliente.value.id || 0, cliente.value.nome, cliente.value.aniversario || null, cliente.value.telefone || '');
      } else {
        await window.api.createCliente(cliente.value.nome, cliente.value.aniversario || null, cliente.value.telefone || '');
      }
      modalOpen.value = false;
      loadClientes();
    };

    const deleteCliente = async (id: number) => {
      await window.api.deleteCliente(id);
      loadClientes();
    };

    const formatTelefone = () => {
      if (cliente.value.telefone) {
        let telefone = cliente.value.telefone.replace(/\D/g, '');
        if (telefone.length <= 2) {
          telefone = `(${telefone}`;
        } else if (telefone.length <= 6) {
          telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
        } else {
          telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
        }
        cliente.value.telefone = telefone;
      } else {
        return;
      }
    };

    const formatTelefoneFiltro = () => {
      let telefone = searchTelefone.value.replace(/\D/g, ''); // Remover caracteres não numéricos

      if (telefone.length === 0) {
        searchTelefone.value = ''; // Permitir apagar tudo
        return;
      }

      if (telefone.length <= 2) {
        searchTelefone.value = `(${telefone}`;
      } else if (telefone.length <= 6) {
        searchTelefone.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
      } else if (telefone.length <= 10) {
        searchTelefone.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
      } else {
        searchTelefone.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
      }
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
      searchNome,
      searchTelefone,
      saveCliente,
      deleteCliente,
      formatTelefone,
      formatTelefoneFiltro,
      telefoneRules,
      nameRule
    };
  }
});
</script>
