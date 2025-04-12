<template>
  <v-container fluid class="servico-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Serviços
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Gerencie os serviços oferecidos pela barbearia
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-icon size="36" color="white">mdi-hair-dryer</v-icon>
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
              <v-icon color="primary" class="mr-2">mdi-tools</v-icon>
              <span class="text-h6 font-weight-medium">Lista de Serviços</span>
            </div>
            <v-btn
              color="primary"
              @click="openModal(null)"
              class="add-btn"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Novo Serviço
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <!-- Search and Filter Section -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  label="Buscar serviço"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  placeholder="Digite para filtrar..."
                />
              </v-col>
            </v-row>

            <!-- Data Table -->
            <v-data-table
              :headers="headers"
              :items="filteredServicos"
              class="elevation-0 rounded-lg"
              density="comfortable"
              hover
              :no-data-text="'Nenhum serviço encontrado'"
              :loading-text="'Carregando serviços...'"
              :sort-by="sortBy"
              :sort-desc="sortDesc"
              :items-per-page="10"
              :items-per-page-options="[5, 10, 25, 50]"
              @update:sort-by="handleSortBy"
              @update:sort-desc="handleSortDesc"
            >
              <template v-slot:headers>
                <tr>
                  <th v-for="header in headers" :key="header.value" class="text-left font-weight-bold">
                    <div class="d-flex align-center">
                      {{ header.text }}
                      <v-icon
                        v-if="header.sortable !== false"
                        size="small"
                        color="grey"
                        class="sort-icon ml-1"
                        @click="handleSort(header.value)"
                      >
                        {{ getSortIcon(header.value) }}
                      </v-icon>
                    </div>
                  </th>
                </tr>
              </template>

              <template v-slot:item.nome="{ item }">
                <div class="text-truncate" style="max-width: 300px;" :title="item.nome">
                  {{ item.nome }}
                </div>
              </template>

              <template v-slot:item.preco="{ item }">
                <span class="font-weight-bold text-primary">R$ {{ item.preco.toFixed(2) }}</span>
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
                    @click="confirmarExclusao(item.id)"
                    v-if="item.id"
                    class="action-btn"
                  />
                </div>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-6">
                  <v-icon color="grey" size="48" class="mb-2">mdi-tools-off</v-icon>
                  <div class="text-subtitle-1 text-grey">Nenhum serviço encontrado</div>
                  <div class="text-caption text-grey">Clique em "Novo Serviço" para adicionar</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Edição/Criação -->
    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon :color="editingServico ? 'primary' : 'success'" size="32" class="mr-4">
            {{ editingServico ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h6 font-weight-bold">{{ editingServico ? 'Editar Serviço' : 'Novo Serviço' }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field
            v-model="servico.nome"
            label="Nome do Serviço"
            prepend-inner-icon="mdi-tag"
            density="compact"
            variant="outlined"
            :error-messages="nomeError"
            class="mb-4"
            required
          />

          <v-number-input
            v-model="servico.preco"
            label="Preço"
            prepend-inner-icon="mdi-currency-usd"
            density="compact"
            variant="outlined"
            :error-messages="precoError"
            class="mb-4"
            prefix="R$"
            :min="0"
            :precision="2"
            required
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
            :disabled="isSaveDisabled"
            @click="saveServico"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Confirmação de Exclusão -->
    <v-dialog v-model="modalConfirmacaoExclusao" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="error" size="32" class="mr-4">mdi-alert</v-icon>
          <span class="text-h6 font-weight-bold">Confirmar Exclusão</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <div class="text-body-1 mb-4">
            Tem certeza que deseja excluir este serviço?
          </div>
          <div class="text-body-2 text-grey">
            Esta ação não pode ser desfeita.
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            @click="modalConfirmacaoExclusao = false"
            variant="outlined"
            color="grey"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :disabled="excluindoVenda"
            @click="deleteServico"
          >
            <v-icon class="mr-2">mdi-delete</v-icon>
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { ServicoEntity } from '@renderer/entities/ServicoEntity';

export default defineComponent({
  name: 'ServicoView',
  setup() {
    const servicos = ref<ServicoEntity[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingServico = ref<ServicoEntity | null>(null);
    const excluindoVenda = ref(false);
    const modalConfirmacaoExclusao = ref(false);
    const servico = ref<ServicoEntity>(new ServicoEntity({ nome: '', preco: 0, }));
    const servicoIdParaExcluir = ref<number | null>(null);

    // Erros
    const nomeError = ref<string | null>(null);
    const precoError = ref<string | null>(null);

    const confirmarExclusao = (id: number) => {
      servicoIdParaExcluir.value = id; // Guarda o ID da venda para exclusão
      modalConfirmacaoExclusao.value = true; // Abre o modal de confirmação
    };

    const sortBy = ref([{ key: 'nome', order: 'asc' }]);
    const sortDesc = ref(false);

    const handleSort = (key: string) => {
      if (sortBy.value[0]?.key === key) {
        // Se já está ordenando por esta coluna, inverte a direção
        sortDesc.value = !sortDesc.value;
        sortBy.value = [{ key, order: sortDesc.value ? 'desc' : 'asc' }];
      } else {
        // Se é uma nova coluna, ordena ascendente
        sortBy.value = [{ key, order: 'asc' }];
        sortDesc.value = false;
      }
    };

    const getSortIcon = (key: string) => {
      if (sortBy.value[0]?.key !== key) return 'mdi-arrow-up-down';
      return sortDesc.value ? 'mdi-arrow-down' : 'mdi-arrow-up';
    };

    const handleSortBy = (value: any) => {
      sortBy.value = value;
    };

    const handleSortDesc = (value: boolean) => {
      sortDesc.value = value;
    };

    const headers = [
      { text: 'Nome', value: 'nome', width: '300px' },
      { text: 'Preço', value: 'preco', width: '150px' },
      { text: 'Ações', value: 'actions', sortable: false, width: '120px' }
    ];

    const filteredServicos = computed(() =>
      servicos.value.filter(s => s.nome.toLowerCase().includes(search.value.toLowerCase()))
    );

    const loadServicos = async () => {
      const dadosServicos = await window.api.getAllServicos();
      servicos.value = dadosServicos.map((servico: any) => new ServicoEntity(servico)); // Mapeia para ServicoEntity
    };

    const openModal = (editItem: ServicoEntity | null) => {
      editingServico.value = editItem;
      servico.value = editItem ? new ServicoEntity(editItem) : new ServicoEntity({ nome: '', preco: 0 });
      nomeError.value = null;
      precoError.value = null;
      modalOpen.value = true;
    };

    const saveServico = async () => {
      // Validação
      if (!servico.value.nome) {
        nomeError.value = 'Nome é obrigatório';
        return;
      } else {
        nomeError.value = null;
      }

      if (!servico.value.preco) {
        precoError.value = 'Preço é obrigatório';
        return;
      } else {
        precoError.value = null;
      }

      // Verificação de duplicidade
      const isDuplicate = servicos.value.some(s =>
        s.nome?.toLowerCase() === servico.value.nome?.toLowerCase() &&
        s.id !== editingServico.value?.id
      );

      if (isDuplicate) {
        nomeError.value = 'Já existe um serviço com este nome.';
        return;
      } else {
        nomeError.value = null;
      }


      // Se está editando, atualiza o serviço, caso contrário, cria um novo
      if (editingServico.value) {
        await window.api.updateServico(editingServico.value.id || 0, servico.value.nome, servico.value.preco);
      } else {
        await window.api.createServico(servico.value.nome, servico.value.preco);
      }

      modalOpen.value = false;
      loadServicos();
    };


    const deleteServico = async () => {
      if (servicoIdParaExcluir.value !== null) {
        excluindoVenda.value = true;
        modalConfirmacaoExclusao.value = false;
        await window.api.deleteServico(servicoIdParaExcluir.value);
        loadServicos();
        excluindoVenda.value = false;
      } else {
        return
      }

    };

    const isSaveDisabled = computed(() => {
      return !servico.value.nome || !servico.value.preco;
    });

    const valorReais = ref(0);
    const valorPorcentagem = ref(0);


    watch(valorReais, (newValorReais) => {
      if (servico.value.preco > 0) {
        valorPorcentagem.value = (newValorReais / servico.value.preco) * 100;
      }
    });

    watch(valorPorcentagem, (newValorPorcentagem) => {
      if (servico.value.preco > 0) {
        valorReais.value = (newValorPorcentagem * servico.value.preco) / 100;
      }
    });

    onMounted(loadServicos);

    return {
      servicos,
      search,
      modalOpen,
      editingServico,
      servico,
      headers,
      filteredServicos,
      nomeError,
      precoError,
      openModal,
      saveServico,
      deleteServico,
      excluindoVenda,
      isSaveDisabled,
      confirmarExclusao,
      modalConfirmacaoExclusao,
      valorReais,
      valorPorcentagem,
      sortBy,
      sortDesc,
      handleSort,
      handleSortBy,
      handleSortDesc,
      getSortIcon,
    };
  }
});
</script>

<style scoped>
.servico-container {
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

.sort-icon {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.sort-icon:hover {
  opacity: 1;
}
</style>
