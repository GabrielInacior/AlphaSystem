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
            <div class="d-flex align-center">
              <v-btn color="white" variant="tonal" class="mr-4" prepend-icon="mdi-file-pdf-box"
                @click="gerarRelatorioDespesas" :loading="gerandoRelatorio">
                Gerar Relatório
              </v-btn>
              <v-btn icon variant="text" color="white" class="mr-4" size="small">
                <v-icon>mdi-information</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  <div class="tooltip-content">
                    <p class="font-weight-bold mb-1">Como gerar um relatório:</p>
                    <ol class="mb-0">
                      <li>Clique no botão "Gerar Relatório"</li>
                      <li>O sistema criará um PDF com os dados atuais da tela</li>
                      <li>O arquivo será salvo automaticamente no seu computador</li>
                      <li>Você pode compartilhar este PDF com sua equipe ou contador</li>
                    </ol>
                    <p class="mt-2 mb-0 text-caption">Dica: Ajuste os filtros antes de gerar o relatório para obter dados específicos.</p>
                  </div>
                </v-tooltip>
              </v-btn>
              <v-avatar size="64" class="welcome-avatar">
                <v-icon size="36" color="white">mdi-cash-minus</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Origem Filter -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="filter-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
              <span class="text-subtitle-1 font-weight-medium mr-4">Filtrar por Origem:</span>
              <v-btn-toggle
                v-model="origemFilter"
                mandatory
                color="primary"
                class="rounded-lg"
              >
                <v-btn value="todos" class="px-4">
                  <v-icon left>mdi-filter</v-icon>
                  Todos
                </v-btn>
                <v-btn value="Loja" class="px-4">
                  <v-icon left>mdi-store</v-icon>
                  Loja
                </v-btn>
                <v-btn value="Barbearia" class="px-4">
                  <v-icon left>mdi-content-cut</v-icon>
                  Barbearia
                </v-btn>
                <v-btn value="Outro" class="px-4">
                  <v-icon left>mdi-dots-horizontal</v-icon>
                  Outro
                </v-btn>
              </v-btn-toggle>
            </div>
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
            <!-- Estatísticas de Despesas -->
            <v-row class="mb-4">
              <v-col cols="12" sm="3" md="3">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center py-2 px-3">
                    <v-icon color="error" size="24" class="mr-2">mdi-cash-minus</v-icon>
                    <div class="stat-content">
                      <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
                        Total de Despesas
                        <v-tooltip location="top" text="Valor total de todas as despesas registradas">
                          <template v-slot:activator="{ props }">
                            <v-icon size="16" class="ml-1" v-bind="props">mdi-information</v-icon>
                          </template>
                        </v-tooltip>
                      </div>
                      <div class="text-h6 font-weight-bold text-error">R$ {{ totalDespesas.toFixed(2) }}</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center py-2 px-3">
                    <v-icon color="info" size="24" class="mr-2">mdi-calendar</v-icon>
                    <div class="stat-content">
                      <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
                        Despesas do Mês
                        <v-tooltip location="top" text="Valor total das despesas do mês atual">
                          <template v-slot:activator="{ props }">
                            <v-icon size="16" class="ml-1" v-bind="props">mdi-information</v-icon>
                          </template>
                        </v-tooltip>
                      </div>
                      <div class="text-h6 font-weight-bold text-info">R$ {{ despesasMesAtual.toFixed(2) }}</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center py-2 px-3">
                    <v-icon color="warning" size="24" class="mr-2">mdi-cash-multiple</v-icon>
                    <div class="stat-content">
                      <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
                        Média Mensal
                        <v-tooltip location="top" text="Média de despesas por mês">
                          <template v-slot:activator="{ props }">
                            <v-icon size="16" class="ml-1" v-bind="props">mdi-information</v-icon>
                          </template>
                        </v-tooltip>
                      </div>
                      <div class="text-h6 font-weight-bold text-warning">R$ {{ mediaMensalDespesas.toFixed(2) }}</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center py-2 px-3">
                    <v-icon color="primary" size="24" class="mr-2">mdi-tag-multiple</v-icon>
                    <div class="stat-content">
                      <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
                        Maior Gasto por Tipo
                        <v-tooltip location="top" text="Tipo de despesa com maior valor total">
                          <template v-slot:activator="{ props }">
                            <v-icon size="16" class="ml-1" v-bind="props">mdi-information</v-icon>
                          </template>
                        </v-tooltip>
                      </div>
                      <div class="text-h6 font-weight-bold text-primary">
                        {{ tipoMaiorGasto.tipo }}
                        <div class="text-caption text-medium-emphasis">
                          R$ {{ tipoMaiorGasto.valor.toFixed(2) }}
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

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
                <div class="text-truncate" style="max-width: 280px;" :title="item.descricao">
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

              <template v-slot:item.origem="{ item }">
                <v-chip
                  :color="getOrigemColor(item.origem)"
                  variant="tonal"
                  size="small"
                  style="width: 90px;"
                  class="font-weight-medium"
                >
                  <v-icon size="small" class="mr-1">
                    {{ getOrigemIcon(item.origem) }}
                  </v-icon>
                  {{ item.origem }}
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
            <v-select
              v-model="despesa.origem"
              label="Origem"
              :items="['Loja', 'Barbearia', 'Outro']"
              prepend-inner-icon="mdi-domain"
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import jsPDF from 'jspdf';

interface Despesa {
  id: number
  descricao: string
  valor: number
  data: string
  tipo: string
  origem: string
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
    const allDespesas = ref<Despesa[]>([]); // Store all despesas
    const origemFilter = ref('todos');
    const tipoFilter = ref<string | null>(null);
    const descricaoFilter = ref('');
    const tipoDespesas = [
      'Aluguel',
      'Água',
      'Luz',
      'Internet',
      'Telefone',
      'Funcionários',
      'Produtos',
      'Manutenção',
      'Limpeza',
      'Marketing',
      'Impostos',
      'Seguros',
      'Equipamentos',
      'Móveis',
      'Decoração',
      'Treinamento',
      'Viagens',
      'Alimentação',
      'Outros'
    ];
    const dataFilter = ref<string | null>(null);
    const modalOpen = ref(false);
    const editingDespesa = ref<Despesa | null>(null);
    const despesa = ref<Despesa>({
      id: 0,
      descricao: '',
      valor: 0,
      data: '',
      tipo: '',
      origem: 'Loja'
    });
    const formIsValid = ref(false);
    const deleteModalOpen = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('');
    const sortBy = ref<SortItem[]>([{ key: 'data', order: 'desc' }]);
    const sortDesc = ref(true);
    const gerandoRelatorio = ref(false);

    const headers: TableHeader[] = [
      { title: 'Descrição', key: 'descricao', sortable: true, value: 'descricao', text: 'Descrição', width: '300px' },
      { title: 'Valor', key: 'valor', sortable: true, value: 'valor', text: 'Valor', width: '120px' },
      { title: 'Data', key: 'data', sortable: true, value: 'data', text: 'Data', width: '120px' },
      { title: 'Tipo', key: 'tipo', sortable: true, value: 'tipo', text: 'Tipo', width: '120px' },
      { title: 'Origem', key: 'origem', sortable: true, value: 'origem', text: 'Origem', width: '50px' },
      { title: 'Ações', key: 'actions', sortable: false, value: 'actions', text: 'Ações', width: '120px' }
    ];

    const getTipoColor = (tipo: string) => {
      const colors: { [key: string]: string } = {
        'Aluguel': 'error',
        'Água': 'info',
        'Luz': 'warning',
        'Internet': 'primary',
        'Telefone': 'secondary',
        'Funcionários': 'error',
        'Produtos': 'success',
        'Manutenção': 'warning',
        'Limpeza': 'info',
        'Marketing': 'primary',
        'Impostos': 'error',
        'Seguros': 'info',
        'Equipamentos': 'secondary',
        'Móveis': 'warning',
        'Decoração': 'primary',
        'Treinamento': 'success',
        'Viagens': 'info',
        'Alimentação': 'warning',
        'Outros': 'grey'
      };
      return colors[tipo] || 'grey';
    };

    const getOrigemColor = (origem: string) => {
      const colors: { [key: string]: string } = {
        'Loja': 'primary',
        'Barbearia': 'success',
        'Outro': 'warning'
      };
      return colors[origem] || 'grey';
    };

    const getOrigemIcon = (origem: string) => {
      const icons: { [key: string]: string } = {
        'Loja': 'mdi-store',
        'Barbearia': 'mdi-content-cut',
        'Outro': 'mdi-dots-horizontal'
      };
      return icons[origem] || 'mdi-help';
    };

    const formatDateForComparison = (data: string | null): string => {
      if (!data) return '';
      return new Date(data).toISOString().split('T')[0];
    };

    // Filter by origem first, then apply other filters
    const filteredDespesas = computed(() => {
      // First filter by origem
      let filtered = allDespesas.value;
      if (origemFilter.value !== 'todos') {
        filtered = filtered.filter(d => d.origem === origemFilter.value);
      }

      // Then apply other filters
      return filtered.filter((d) => {
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
      allDespesas.value = await window.api.getAllDespesas();
      // Apply origem filter
      if (origemFilter.value !== 'todos') {
        despesas.value = allDespesas.value.filter(d => d.origem === origemFilter.value);
      } else {
        despesas.value = allDespesas.value;
      }
    };

    // Watch for origem filter changes
    watch(origemFilter, () => {
      if (origemFilter.value !== 'todos') {
        despesas.value = allDespesas.value.filter(d => d.origem === origemFilter.value);
      } else {
        despesas.value = allDespesas.value;
      }
    });

    const openModal = (type: 'create' | 'edit', item?: Despesa) => {
      if (type === 'edit' && item) {
        editingDespesa.value = {
          ...item,
          data: item.data ? new Date(item.data).toISOString().split('T')[0] : ''
        }
        despesa.value = { ...editingDespesa.value }
      } else {
        editingDespesa.value = null
        despesa.value = { id: 0, descricao: '', valor: 0, data: '', tipo: '', origem: 'Loja' }
      }
      modalOpen.value = true
    };

    const saveDespesa = async () => {
      try {
        if (!despesa.value.descricao || !despesa.value.valor || !despesa.value.data || !despesa.value.tipo || !despesa.value.origem) {
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
            despesa.value.tipo,
            despesa.value.origem
          );
          snackbarText.value = 'Despesa atualizada com sucesso!';
        } else {
          await window.api.createDespesa(
            despesa.value.descricao,
            Number(despesa.value.valor),
            despesa.value.data,
            despesa.value.tipo,
            despesa.value.origem
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

    const handleSort = (key: string | undefined) => {
      if (!key) return;

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

    const getSortIcon = (key: string | undefined) => {
      if (!key) return '';

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

    // Estatísticas de Despesas
    const totalDespesas = computed(() => {
      return despesas.value.reduce((total, despesa) => total + despesa.valor, 0);
    });

    const despesasMesAtual = computed(() => {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      return despesas.value
        .filter(despesa => new Date(despesa.data) >= primeiroDiaMes)
        .reduce((total, despesa) => total + despesa.valor, 0);
    });

    const mediaMensalDespesas = computed(() => {
      if (despesas.value.length === 0) return 0;

      const hoje = new Date();
      const primeiroDiaAno = new Date(hoje.getFullYear(), 0, 1);
      const mesesPassados = hoje.getMonth() + 1; // +1 porque getMonth() retorna 0-11

      const despesasAno = despesas.value
        .filter(despesa => new Date(despesa.data) >= primeiroDiaAno)
        .reduce((total, despesa) => total + despesa.valor, 0);

      return despesasAno / mesesPassados;
    });

    const maiorDespesa = computed(() => {
      if (despesas.value.length === 0) return 0;
      return Math.max(...despesas.value.map(despesa => despesa.valor));
    });

    const tipoMaiorGasto = computed(() => {
      if (despesas.value.length === 0) return { tipo: 'Nenhuma', valor: 0 };

      // Agrupa as despesas por tipo e soma os valores
      const gastosPorTipo = despesas.value.reduce((acc, despesa) => {
        acc[despesa.tipo] = (acc[despesa.tipo] || 0) + despesa.valor;
        return acc;
      }, {} as Record<string, number>);

      // Encontra o tipo com maior gasto
      const tipoMaiorGasto = Object.entries(gastosPorTipo).reduce((maior, [tipo, valor]) => {
        return valor > (maior.valor || 0) ? { tipo, valor } : maior;
      }, { tipo: '', valor: 0 });

      return tipoMaiorGasto;
    });

    const gerarRelatorioDespesas = async () => {
      try {
        gerandoRelatorio.value = true;

        // Criar um novo documento PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();

        // Título do relatório
        pdf.setFontSize(20);
        pdf.setTextColor(99, 102, 241); // Cor roxa
        pdf.text('Relatório de Despesas', pageWidth / 2, 20, { align: 'center' });

        // Data e hora da geração
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR');
        pdf.text(`Gerado em: ${dataAtual} às ${horaAtual}`, pageWidth / 2, 30, { align: 'center' });

        // Informações de filtros aplicados
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Filtros Aplicados:', 20, 45);

        // Adicionar informações de filtros
        pdf.setFontSize(10);
        pdf.text(`Origem: ${origemFilter.value === 'todos' ? 'Todas' : origemFilter.value}`, 30, 55);

        if (descricaoFilter.value) {
          pdf.text(`Descrição: ${descricaoFilter.value}`, 30, 62);
        }

        if (dataFilter.value) {
          pdf.text(`Data: ${formatDateForDisplay(dataFilter.value)}`, 30, 69);
        }

        if (tipoFilter.value) {
          pdf.text(`Tipo: ${tipoFilter.value}`, 30, 76);
        }

        // Resumo de despesas
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Resumo de Despesas', 20, 90);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Total de Despesas: R$ ${totalDespesas.value.toFixed(2)}`, 30, 100);
        pdf.text(`Despesas do Mês Atual: R$ ${despesasMesAtual.value.toFixed(2)}`, 30, 107);
        pdf.text(`Média Mensal: R$ ${mediaMensalDespesas.value.toFixed(2)}`, 30, 114);
        pdf.text(`Maior Gasto por Tipo: ${tipoMaiorGasto.value.tipo} (R$ ${tipoMaiorGasto.value.valor.toFixed(2)})`, 30, 121);

        // Despesas por origem
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Despesas por Origem', 20, 135);

        // Calcular totais por origem
        const despesasPorOrigem = filteredDespesas.value.reduce((acc, despesa) => {
          acc[despesa.origem] = (acc[despesa.origem] || 0) + despesa.valor;
          return acc;
        }, {} as Record<string, number>);

        let yPos = 145;
        Object.entries(despesasPorOrigem).forEach(([origem, valor]) => {
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${origem}: R$ ${valor.toFixed(2)}`, 30, yPos);
          yPos += 7;
        });

        // Despesas por tipo
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Despesas por Tipo', 20, yPos + 10);

        // Calcular totais por tipo
        const despesasPorTipo = filteredDespesas.value.reduce((acc, despesa) => {
          acc[despesa.tipo] = (acc[despesa.tipo] || 0) + despesa.valor;
          return acc;
        }, {} as Record<string, number>);

        yPos += 20;
        Object.entries(despesasPorTipo).forEach(([tipo, valor]) => {
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${tipo}: R$ ${valor.toFixed(2)}`, 30, yPos);
          yPos += 7;
        });

        // Lista de despesas
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Lista de Despesas', 20, yPos + 10);

        // Cabeçalho da tabela
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);
        pdf.setFillColor(99, 102, 241);
        pdf.rect(20, yPos + 15, 170, 7, 'F');
        pdf.text('Descrição', 25, yPos + 19);
        pdf.text('Valor', 90, yPos + 19);
        pdf.text('Data', 120, yPos + 19);
        pdf.text('Tipo', 150, yPos + 19);

        // Dados da tabela
        yPos += 22;
        pdf.setTextColor(0, 0, 0);

        let rowCount = 0;
        let pageCount = 1;

        filteredDespesas.value.forEach((despesa, index) => {
          // Verificar se precisa de uma nova página
          if (yPos > 270) {
            pdf.addPage();
            pageCount++;
            yPos = 20;

            // Cabeçalho da tabela na nova página
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);
            pdf.setFillColor(99, 102, 241);
            pdf.rect(20, yPos, 170, 7, 'F');
            pdf.text('Descrição', 25, yPos + 4);
            pdf.text('Valor', 90, yPos + 4);
            pdf.text('Data', 120, yPos + 4);
            pdf.text('Tipo', 150, yPos + 4);

            yPos += 7;
          }

          // Alternar cores das linhas
          if (rowCount % 2 === 0) {
            pdf.setFillColor(245, 245, 245);
            pdf.rect(20, yPos, 170, 7, 'F');
          }

          // Dados da linha
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(8);

          // Truncar descrição se necessário
          const descricao = despesa.descricao.length > 30 ? despesa.descricao.substring(0, 27) + '...' : despesa.descricao;

          pdf.text(descricao, 25, yPos + 4);
          pdf.text(`R$ ${despesa.valor.toFixed(2)}`, 90, yPos + 4);
          pdf.text(formatDateForDisplay(despesa.data), 120, yPos + 4);
          pdf.text(despesa.tipo, 150, yPos + 4);

          yPos += 7;
          rowCount++;
        });

        // Adicionar número da página
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
        }

        // Salvar o PDF
        pdf.save('relatorio-despesas.pdf');

        gerandoRelatorio.value = false;
      } catch (error) {
        console.error('Erro ao gerar relatório de despesas:', error);
        gerandoRelatorio.value = false;
      }
    };

    onMounted(loadDespesas);

    return {
      despesas,
      origemFilter,
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
      totalDespesas,
      despesasMesAtual,
      mediaMensalDespesas,
      maiorDespesa,
      tipoMaiorGasto,
      getOrigemColor,
      getOrigemIcon,
      gerarRelatorioDespesas,
      gerandoRelatorio,
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

.stat-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 12px;
  border: 1px solid rgba(var(--v-border-color), 0.12);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1);
}

.stat-content {
  min-width: 0;
  flex: 1;
}

.stat-content .text-subtitle-2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-content .text-h6 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-content .text-caption {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 960px) {
  .stat-card .v-card-text {
    padding: 8px !important;
  }

  .stat-content .text-subtitle-2 {
    font-size: 0.75rem !important;
  }

  .stat-content .text-h6 {
    font-size: 0.9rem !important;
  }

  .stat-content .text-caption {
    font-size: 0.7rem !important;
  }
}

@media (max-width: 600px) {
  .stat-card {
    margin-bottom: 8px;
  }

  .stat-card .v-card-text {
    padding: 12px !important;
  }

  .stat-content .text-subtitle-2 {
    font-size: 0.8rem !important;
  }

  .stat-content .text-h6 {
    font-size: 1rem !important;
  }

  .stat-content .text-caption {
    font-size: 0.75rem !important;
  }
}

.filter-card {
  border-radius: 16px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1);
}
</style>
