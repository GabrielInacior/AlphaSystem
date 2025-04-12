<template>
  <v-container fluid class="despesa-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Despesas
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Gerencie suas despesas e mantenha o controle financeiro
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-icon size="36" color="white">mdi-cash-minus</v-icon>
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
              <v-icon color="primary" class="mr-2">mdi-cash-remove</v-icon>
              <span class="text-h6 font-weight-medium">Lista de Despesas</span>
            </div>
            <v-btn
              color="primary"
              @click="openModal('create')"
              class="add-btn"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Nova Despesa
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <!-- Search and Filter Section -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="descricaoFilter"
                  label="Filtrar por Descrição"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  placeholder="Digite a descrição..."
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="dataFilter"
                  label="Filtrar por Data"
                  type="date"
                  prepend-inner-icon="mdi-calendar"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="tipoFilter"
                  label="Filtrar por Tipo"
                  prepend-inner-icon="mdi-tag"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  clearable
                  placeholder="Digite o tipo de despesa..."
                />
              </v-col>
            </v-row>

            <!-- Data Table -->
            <v-data-table
              :headers="headers"
              :items="filteredDespesas"
              class="elevation-0 rounded-lg"
              density="comfortable"
              hover
              :no-data-text="'Nenhuma despesa encontrada'"
              :loading-text="'Carregando despesas...'"
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

              <template v-slot:item.descricao="{ item }">
                <div class="text-truncate" style="max-width: 300px;" :title="item.descricao">
                  {{ item.descricao }}
                </div>
              </template>

              <template v-slot:item.valor="{ item }">
                <span class="font-weight-bold text-error">
                  R$ {{ item.valor.toFixed(2) }}
                </span>
              </template>

              <template v-slot:item.data="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" color="primary" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDateForDisplay(item.data) }}
                </div>
              </template>

              <template v-slot:item.tipo="{ item }">
                <v-chip
                  :color="getTipoColor(item.tipo)"
                  variant="tonal"
                  size="small"
                  class="font-weight-medium"
                >
                  <v-icon size="small" class="mr-1">
                    {{ item.tipo === 'Fixo' ? 'mdi-clock-outline' : 'mdi-chart-line' }}
                  </v-icon>
                  {{ item.tipo }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    color="primary"
                    variant="text"
                    @click="openModal('edit', item)"
                    class="action-btn"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    variant="text"
                    @click="deleteDespesa(item.id)"
                    class="action-btn"
                  />
                </div>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-6">
                  <v-icon color="grey" size="48" class="mb-2">mdi-cash-remove</v-icon>
                  <div class="text-subtitle-1 text-grey">Nenhuma despesa encontrada</div>
                  <div class="text-caption text-grey">Clique em "Nova Despesa" para adicionar</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Despesa -->
    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon :color="editingDespesa ? 'primary' : 'success'" size="32" class="mr-4">
            {{ editingDespesa ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h6 font-weight-bold">{{ editingDespesa ? 'Editar Despesa' : 'Nova Despesa' }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="formIsValid">
            <v-text-field
              v-model="despesa.descricao"
              label="Descrição"
              prepend-inner-icon="mdi-text"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-number-input
              v-model="despesa.valor"
              label="Valor"
              prepend-inner-icon="mdi-currency-brl"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              prefix="R$"
              :min="0"
              :precision="2"
              required
            />
            <v-text-field
              v-model="despesa.data"
              label="Data"
              type="date"
              prepend-inner-icon="mdi-calendar"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-combobox
              v-model="despesa.tipo"
              label="Tipo de Despesa"
              :items="tipoDespesas"
              prepend-inner-icon="mdi-tag"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
          </v-form>
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
            @click="saveDespesa"
            :disabled="!formIsValid"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

interface Despesa {
  id: number
  descricao: string
  valor: number
  data: string
  tipo: string
}

interface TableHeader {
  title: string
  key: string
  sortable: boolean
  value?: string
  text?: string
  width?: string
}

interface SortItem {
  key: string;
  order: 'asc' | 'desc';
}

export default defineComponent({
  name: 'DespesaView',
  setup() {
    const despesas = ref<Despesa[]>([]);
    const tipoFilter = ref<string | null>(null);
    const descricaoFilter = ref('');
    const tipoDespesas = ['Loja', 'Barbearia'];
    const dataFilter = ref<string | null>(null);
    const modalOpen = ref(false);
    const editingDespesa = ref<Despesa | null>(null);
    const despesa = ref<Despesa>({
      id: 0,
      descricao: '',
      valor: 0,
      data: '',
      tipo: ''
    });
    const formIsValid = ref(false);
    const deleteModalOpen = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('');
    const sortBy = ref<SortItem[]>([{ key: 'data', order: 'desc' }]);
    const sortDesc = ref(true);

    const headers: TableHeader[] = [
      { title: 'Descrição', key: 'descricao', sortable: true, value: 'descricao', text: 'Descrição', width: '300px' },
      { title: 'Valor', key: 'valor', sortable: true, value: 'valor', text: 'Valor', width: '120px' },
      { title: 'Data', key: 'data', sortable: true, value: 'data', text: 'Data', width: '120px' },
      { title: 'Tipo', key: 'tipo', sortable: true, value: 'tipo', text: 'Tipo', width: '120px' },
      { title: 'Ações', key: 'actions', sortable: false, value: 'actions', text: 'Ações', width: '120px' }
    ];

    const getTipoColor = (tipo: string) => {
      const colors: { [key: string]: string } = {
        'Fixo': 'info',
        'Variável': 'success',
      };
      return colors[tipo] || 'grey';
    };

    const formatDateForComparison = (data: string | null): string => {
      if (!data) return '';
      return new Date(data).toISOString().split('T')[0];
    };

    const filteredDespesas = computed(() => {
      return despesas.value.filter((d) => {
        const descricaoMatch = d.descricao.toLowerCase().includes(descricaoFilter.value.toLowerCase());
        const dataMatch = dataFilter.value
          ? formatDateForComparison(d.data) === formatDateForComparison(dataFilter.value)
          : true;
        const tipoMatch = tipoFilter.value
          ? d.tipo.toLowerCase().includes(tipoFilter.value.toLowerCase())
          : true;
        return descricaoMatch && dataMatch && tipoMatch;
      });
    });

    const formatDateForDisplay = (date: string | null): string => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('pt-BR');
    };

    const loadDespesas = async () => {
      despesas.value = await window.api.getAllDespesas();
    };

    const openModal = (type: 'create' | 'edit', item?: Despesa) => {
      if (type === 'edit' && item) {
        editingDespesa.value = {
          ...item,
          data: item.data ? new Date(item.data).toISOString().split('T')[0] : ''
        }
        despesa.value = { ...editingDespesa.value }
      } else {
        editingDespesa.value = null
        despesa.value = { id: 0, descricao: '', valor: 0, data: '', tipo: '' }
      }
      modalOpen.value = true
    };

    const saveDespesa = async () => {
      try {
        // Validação dos campos obrigatórios
        if (!despesa.value.descricao || !despesa.value.valor || !despesa.value.data || !despesa.value.tipo) {
          snackbarText.value = 'Preencha todos os campos obrigatórios';
          snackbarColor.value = 'error';
          snackbar.value = true;
          return;
        }

        if (editingDespesa.value?.id) {
          await window.api.updateDespesa(
            editingDespesa.value.id,
            despesa.value.descricao,
            Number(despesa.value.valor),
            despesa.value.data,
            despesa.value.tipo
          );
          snackbarText.value = 'Despesa atualizada com sucesso!';
        } else {
          await window.api.createDespesa(
            despesa.value.descricao,
            Number(despesa.value.valor),
            despesa.value.data,
            despesa.value.tipo
          );
          snackbarText.value = 'Despesa criada com sucesso!';
        }
        snackbarColor.value = 'success';
        snackbar.value = true;
        modalOpen.value = false;
        await loadDespesas();
      } catch (error) {
        console.error('Erro ao salvar despesa:', error);
        snackbarText.value = 'Erro ao salvar despesa';
        snackbarColor.value = 'error';
        snackbar.value = true;
      }
    };

    const deleteDespesa = async (id: number) => {
      try {
        await window.api.deleteDespesa(id)
        await loadDespesas()
        snackbarText.value = 'Despesa excluída com sucesso!'
        snackbarColor.value = 'success'
        snackbar.value = true
      } catch (error) {
        console.error('Erro ao excluir despesa:', error)
        snackbarText.value = 'Erro ao excluir despesa'
        snackbarColor.value = 'error'
        snackbar.value = true
      }
    };

    const handleSort = (key: string) => {
      const header = headers.find(h => h.value === key);
      if (!header || !header.sortable) return;

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
      const header = headers.find(h => h.value === key);
      if (!header || !header.sortable) return '';

      if (sortBy.value[0]?.key !== key) return 'mdi-arrow-up-down';
      return sortDesc.value ? 'mdi-arrow-down' : 'mdi-arrow-up';
    };

    const handleSortBy = (value: SortItem[]) => {
      sortBy.value = value;
    };

    const handleSortDesc = (value: boolean) => {
      sortDesc.value = value;
    };

    const customFilter = (item: any, queryText: string) => {
      const text = item.text.toLowerCase();
      const searchText = queryText.toLowerCase();
      return text.indexOf(searchText) > -1;
    };

    const handleTypeSearch = (val: string) => {
      if (val && !tipoDespesas.includes(val)) {
        tipoDespesas.push(val);
      }
    };

    onMounted(loadDespesas);

    return {
      despesas,
      descricaoFilter,
      dataFilter,
      modalOpen,
      editingDespesa,
      despesa,
      headers,
      filteredDespesas,
      formatDateForDisplay,
      openModal,
      tipoFilter,
      tipoDespesas,
      saveDespesa,
      deleteDespesa,
      formIsValid,
      getTipoColor,
      deleteModalOpen,
      snackbar,
      snackbarText,
      snackbarColor,
      sortBy,
      sortDesc,
      handleSort,
      handleSortBy,
      handleSortDesc,
      getSortIcon,
      customFilter,
      handleTypeSearch,
    };
  }
});
</script>

<style scoped>
.despesa-container {
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
