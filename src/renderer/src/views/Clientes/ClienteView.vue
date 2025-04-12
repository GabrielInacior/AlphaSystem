<template>
  <v-container fluid class="cliente-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Clientes
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Gerencie seus clientes e histórico de compras
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-icon size="36" color="white">mdi-account-group</v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="content-card" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
              <span class="text-h6 font-weight-medium">Lista de Clientes</span>
            </div>
            <v-btn
              color="primary"
              @click="openModal(null)"
              class="add-btn"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Novo Cliente
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <!-- Search and Filter Section -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchNome"
                  label="Buscar por nome"
                  prepend-inner-icon="mdi-account-search"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  placeholder="Digite o nome do cliente..."
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchTelefone"
                  label="Buscar por telefone"
                  prepend-inner-icon="mdi-phone-search"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  placeholder="Digite o telefone..."
                  @input="formatTelefoneFiltro()"
                />
              </v-col>
            </v-row>

            <!-- Data Table -->
            <v-data-table
              :headers="headers"
              :items="filteredClientes"
              class="elevation-0 rounded-lg"
              density="comfortable"
              hover
              :no-data-text="'Nenhum cliente encontrado'"
              :loading-text="'Carregando clientes...'"
            >
              <template v-slot:headers>
                <tr>
                  <th v-for="header in headers" :key="header.value" class="text-left font-weight-bold">
                    {{ header.text }}
                  </th>
                </tr>
              </template>

              <template v-slot:item.aniversario="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" color="primary" class="mr-1">mdi-cake</v-icon>
                  {{ item.aniversario ? formatDate(item.aniversario) : 'Não informado' }}
                </div>
              </template>

              <template v-slot:item.telefone="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" color="primary" class="mr-1">mdi-phone</v-icon>
                  {{ item.telefone ? item.telefone : 'Não informado' }}
                </div>
              </template>

              <template v-slot:item.nome="{ item }">
                <div class="text-truncate" style="max-width: 250px;" :title="item.nome">
                  {{ item.nome }}
                </div>
              </template>

              <template v-slot:item.itens="{ item }">
                <div class="text-truncate" style="max-width: 300px;" :title="item.itens">
                  {{ item.itens }}
                </div>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    color="primary"
                    variant="text"
                    @click="openModal(item)"
                    class="action-btn"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    variant="text"
                    @click="deleteCliente(item.id)"
                    v-if="item.id"
                    class="action-btn"
                  />
                  <v-btn
                    icon="mdi-history"
                    size="small"
                    color="info"
                    variant="text"
                    @click="openHistoricoModal(item)"
                    v-if="item.id"
                    class="action-btn"
                  />
                </div>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-6">
                  <v-icon color="grey" size="48" class="mb-2">mdi-account-off</v-icon>
                  <div class="text-subtitle-1 text-grey">Nenhum cliente encontrado</div>
                  <div class="text-caption text-grey">Clique em "Novo Cliente" para adicionar</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Cliente -->
    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon :color="editingCliente ? 'primary' : 'success'" size="32" class="mr-4">
            {{ editingCliente ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h6 font-weight-bold">{{ editingCliente ? 'Editar Cliente' : 'Novo Cliente' }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field
            v-model="cliente.nome"
            label="Nome do Cliente"
            prepend-inner-icon="mdi-account"
            density="compact"
            variant="outlined"
            :error-messages="[nameRule(cliente.nome)]"
            class="mb-4"
            required
          />

          <v-text-field
            v-model="cliente.aniversario"
            label="Data de Aniversário"
            prepend-inner-icon="mdi-cake"
            density="compact"
            variant="outlined"
            type="date"
            class="mb-4"
            required
          />

          <v-text-field
            v-model="cliente.telefone"
            label="Telefone"
            prepend-inner-icon="mdi-phone"
            density="compact"
            variant="outlined"
            :error-messages="telefoneRules.map(rule => rule(cliente.telefone)).filter(Boolean)"
            class="mb-4"
            @input="formatTelefone"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            @click="modalOpen = false"
            variant="outlined"
            color="grey"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveCliente"
            :disabled="!cliente.nome"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Histórico de Compras -->
    <v-dialog v-model="historicoModalOpen" max-width="800px" persistent>
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="info" size="32" class="mr-4">mdi-history</v-icon>
          <span class="text-h6 font-weight-bold">Histórico de Compras - {{ clienteSelecionado?.nome }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeHistoricoModal" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-data-table
            :headers="historicoHeaders"
            :items="historicoCompras"
            density="comfortable"
            class="elevation-0 rounded-lg"
            hover
            :no-data-text="'Nenhuma compra encontrada'"
          >
            <template v-slot:headers>
              <tr>
                <th v-for="header in historicoHeaders" :key="header.value" class="text-left font-weight-bold">
                  {{ header.text }}
                </th>
              </tr>
            </template>

            <template v-slot:item.valor_total="{ item }">
              <span class="font-weight-bold text-success">R$ {{ item.valor_total.toFixed(2) }}</span>
            </template>

            <template v-slot:item.data="{ item }">
              <div class="d-flex align-center">
                <v-icon size="small" color="primary" class="mr-1">mdi-calendar</v-icon>
                {{ formatDate(item.data) }}
              </div>
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip
                :color="item.status === 'pago' ? 'success' : 'warning'"
                size="small"
                class="font-weight-bold"
              >
                <v-icon size="small" class="mr-1">
                  {{ item.status === 'pago' ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                </v-icon>
                {{ item.status === 'pago' ? 'Pago' : 'Pendente' }}
              </v-chip>
            </template>

            <template v-slot:no-data>
              <div class="text-center py-6">
                <v-icon color="grey" size="48" class="mb-2">mdi-cart-off</v-icon>
                <div class="text-subtitle-1 text-grey">Nenhuma compra encontrada</div>
                <div class="text-caption text-grey">Este cliente ainda não realizou compras</div>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            @click="closeHistoricoModal"
          >
            <v-icon class="mr-2">mdi-close</v-icon>
            Fechar
          </v-btn>
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
    const historicoModalOpen = ref(false);
    const editingCliente = ref<ClienteEntity | null>(null);
    const clienteSelecionado = ref<ClienteEntity | null>(null);
    const historicoCompras = ref<any[]>([]);
    const cliente = ref<ClienteEntity>(new ClienteEntity({ nome: '', aniversario: null, telefone: '' }));

    const headers = [
      { text: 'Nome', value: 'nome', sortable: true, width: '250px' },
      { text: 'Aniversário', value: 'aniversario', sortable: true, width: '150px' },
      { text: 'Telefone', value: 'telefone', sortable: true, width: '150px' },
      { text: 'Ações', value: 'actions', sortable: false, width: '120px' }
    ];

    const historicoHeaders = [
      { text: 'Data', value: 'data', sortable: true, width: '120px' },
      { text: 'Itens', value: 'itens', sortable: true, width: '300px' },
      { text: 'Valor Total', value: 'valor_total', sortable: true, width: '120px' },
      { text: 'Método de Pagamento', value: 'metodo_pagamento', sortable: true, width: '150px' },
      { text: 'Status', value: 'status', sortable: true, width: '120px' }
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

    const openHistoricoModal = async (cliente: ClienteEntity) => {
      try {
        historicoModalOpen.value = true;
        clienteSelecionado.value = cliente;
        const historico = await window.api.getHistoricoComprasCliente(cliente.id || 0);
        historicoCompras.value = historico;
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        historicoModalOpen.value = false;
      }
    };

    const closeHistoricoModal = () => {
      historicoModalOpen.value = false;
      clienteSelecionado.value = null;
      historicoCompras.value = [];
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('pt-BR');
    };

    const saveCliente = async () => {
      if (editingCliente.value) {
        await window.api.updateCliente(
          editingCliente.value.id || 0,
          cliente.value.nome,
          cliente.value.aniversario || '',
          cliente.value.telefone || ''
        );
      } else {
        await window.api.createCliente(
          cliente.value.nome,
          cliente.value.aniversario || '',
          cliente.value.telefone || ''
        );
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
      historicoModalOpen,
      editingCliente,
      clienteSelecionado,
      historicoCompras,
      cliente,
      headers,
      historicoHeaders,
      filteredClientes,
      openModal,
      openHistoricoModal,
      closeHistoricoModal,
      searchNome,
      searchTelefone,
      saveCliente,
      deleteCliente,
      formatTelefone,
      formatTelefoneFiltro,
      formatDate,
      telefoneRules,
      nameRule
    };
  }
});
</script>

<style scoped>
.cliente-container {
  background-color: var(--color-background);
  min-height: 100vh;
}

.welcome-card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 16px;
  overflow: hidden;
}

.welcome-text {
  color: white;
}

.welcome-avatar {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.content-card {
  border-radius: 16px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06);
}

.search-field {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-field:hover, .search-field:focus-within {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.add-btn {
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.05);
}

.action-btn {
  min-width: 32px;
  height: 32px;
}

.modal-card {
  border-radius: 16px;
  overflow: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Vuetify Overrides */
:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

:deep(.v-data-table td) {
  padding: 12px 16px;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
}

:deep(.v-alert) {
  border-radius: 8px;
}
</style>
