<template>
  <v-container fluid class="contas-container pa-6">
    <!-- Header Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Contas a Pagar
                <v-tooltip
                  location="bottom"
                  max-width="400"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-help-circle"
                      variant="text"
                      color="white"
                      size="small"
                      class="ml-2"
                      v-bind="props"
                    />
                  </template>
                  <div class="pa-2">
                    <p class="mb-2"><strong>Como usar esta tela:</strong></p>
                    <ul class="ml-2">
                      <li>O painel superior mostra um resumo das contas: total pendente, vencendo hoje, vencidas e próximas</li>
                      <li>Você pode visualizar as contas em três formatos:
                        <ul class="ml-4 mt-1">
                          <li><strong>Lista:</strong> Visualização em tabela com todas as informações</li>
                          <li><strong>Kanban:</strong> Organização por status (pendente, pago, vencida)</li>
                        </ul>
                      </li>
                      <li>Use os filtros superiores para:
                        <ul class="ml-4 mt-1">
                          <li>Selecionar período específico</li>
                          <li>Filtrar por status</li>
                          <li>Buscar por fornecedor</li>
                        </ul>
                      </li>
                      <li>Ações disponíveis:
                        <ul class="ml-4 mt-1">
                          <li>Adicionar nova conta</li>
                          <li>Editar conta existente</li>
                          <li>Marcar como paga</li>
                          <li>Excluir conta</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </v-tooltip>
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Gerencie suas contas e mantenha o fluxo de caixa organizado
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-img src="@/assets/logo.png" alt="Logo" />
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dashboard Cards -->
    <v-row class="mt-4">
      <!-- Total Pendente -->
      <v-col cols="12" md="3">
        <v-card class="dashboard-card" elevation="2" :color="totalPendente > 0 ? 'error' : 'success'">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" color="white" class="mr-4">
              {{ totalPendente > 0 ? 'mdi-alert-circle' : 'mdi-check-circle' }}
            </v-icon>
            <div>
              <div class="text-subtitle-2 text-white">Total Pendente</div>
              <div class="text-h5 font-weight-bold text-white">
                R$ {{ formatarValor(totalPendente) }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Vencendo Hoje -->
      <v-col cols="12" md="3">
        <v-card class="dashboard-card" elevation="2" :color="contasHoje.length > 0 ? 'warning' : 'success'">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" color="white" class="mr-4">mdi-calendar-today</v-icon>
            <div>
              <div class="text-subtitle-2 text-white">Vencendo Hoje</div>
              <div class="text-h5 font-weight-bold text-white">
                {{ contasHoje.length }} {{ contasHoje.length === 1 ? 'conta' : 'contas' }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Vencidas -->
      <v-col cols="12" md="3">
        <v-card class="dashboard-card" elevation="2" :color="contasVencidas.length > 0 ? 'error' : 'success'">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" color="white" class="mr-4">mdi-calendar-alert</v-icon>
            <div>
              <div class="text-subtitle-2 text-white">Contas Vencidas</div>
              <div class="text-h5 font-weight-bold text-white">
                {{ contasVencidas.length }} {{ contasVencidas.length === 1 ? 'conta' : 'contas' }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Próximos 7 dias -->
      <v-col cols="12" md="3">
        <v-card class="dashboard-card" elevation="2" color="info">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" color="white" class="mr-4">mdi-calendar-clock</v-icon>
            <div>
              <div class="text-subtitle-2 text-white">Próximos 7 dias</div>
              <div class="text-h5 font-weight-bold text-white">
                {{ contasProximas.length }} {{ contasProximas.length === 1 ? 'conta' : 'contas' }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="content-card" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-file-document-multiple</v-icon>
              <span class="text-h6 font-weight-medium">Gerenciar Contas</span>
            </div>
            <v-btn
              color="primary"
              @click="openModal('create')"
              class="add-btn"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Nova Conta
            </v-btn>
          </v-card-title>

          <v-divider />

          <!-- Filtros e Pesquisa -->
          <v-card-text class="pa-6">
            <v-row class="mb-4">
              <!-- Período -->
              <v-col cols="12" md="4">
                <v-select
                  v-model="periodoSelecionado"
                  :items="periodos"
                  label="Período"
                  prepend-inner-icon="mdi-calendar-range"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                />
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="4">
                <v-select
                  v-model="statusSelecionado"
                  :items="statusOptions"
                  label="Status"
                  prepend-inner-icon="mdi-flag"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                />
              </v-col>

              <!-- Fornecedor -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="fornecedorFilter"
                  label="Fornecedor"
                  prepend-inner-icon="mdi-domain"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  clearable
                />
              </v-col>
            </v-row>

            <!-- Tabs de Visualização -->
            <v-tabs v-model="activeTab" class="mb-4">
              <v-tab value="lista">
                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                Lista
              </v-tab>
              <v-tab value="kanban">
                <v-icon class="mr-2">mdi-view-column</v-icon>
                Kanban
              </v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
              <!-- Vista em Lista -->
              <v-window-item value="lista">
                <v-data-table
                  :headers="headers"
                  :items="filteredContas"
                  :sort-by="sortBy"
                  :sort-desc="sortDesc"
                  class="elevation-0 rounded-lg"
                  hover
                >
                  <template v-slot:item.descricao="{ item }">
                    <div class="d-flex align-center">
                      <v-icon :color="getStatusColor(item.status)" class="mr-2">
                        {{ getStatusIcon(item.status) }}
                      </v-icon>
                      <div>
                        <div class="font-weight-medium">{{ item.descricao }}</div>
                        <div class="text-caption text-grey">{{ item.fornecedor }}</div>
                      </div>
                    </div>
                  </template>

                  <template v-slot:item.valor="{ item }">
                    <span class="font-weight-bold" :class="getValorColor(item)">
                      R$ {{ formatarValor(item.valor) }}
                    </span>
                  </template>

                  <template v-slot:item.data_vencimento="{ item }">
                    <div class="d-flex align-center">
                      <v-icon size="small" :color="getVencimentoColor(item)" class="mr-1">
                        {{ getVencimentoIcon(item) }}
                      </v-icon>
                      {{ formatarData(item.data_vencimento) }}
                    </div>
                  </template>

                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="getStatusColor(item.status)"
                      variant="tonal"
                      size="small"
                      class="font-weight-medium"
                    >
                      {{ getStatusText(item.status) }}
                    </v-chip>
                  </template>

                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex align-center">
                      <v-btn
                        v-if="item.status === 'pendente'"
                        icon="mdi-check"
                        size="small"
                        color="success"
                        variant="text"
                        @click="marcarComoPaga(item)"
                        class="action-btn"
                        title="Marcar como paga"
                      />
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        color="primary"
                        variant="text"
                        @click="openModal('edit', item)"
                        class="action-btn"
                        title="Editar"
                      />
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        color="error"
                        variant="text"
                        @click="confirmarExclusao(item)"
                        class="action-btn"
                        title="Excluir"
                      />
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <!-- Vista em Kanban -->
              <v-window-item value="kanban">
                <v-row class="kanban-board">
                  <v-col cols="12" md="4" v-for="status in kanbanStatus" :key="status">
                    <v-card class="kanban-column h-100" elevation="1">
                      <v-card-title class="d-flex align-center py-3 px-4">
                        <v-icon :color="getStatusColor(status)" class="mr-2">
                          {{ getStatusIcon(status) }}
                        </v-icon>
                        {{ getStatusText(status) }}
                        <v-chip
                          :color="getStatusColor(status)"
                          variant="tonal"
                          size="small"
                          class="ml-2"
                        >
                          {{ getContasPorStatus(status).length }}
                        </v-chip>
                      </v-card-title>
                      <v-divider />
                      <v-card-text class="pa-2">
                        <v-list class="kanban-list">
                          <v-list-item
                            v-for="conta in getContasPorStatus(status)"
                            :key="conta.id"
                            class="mb-2 rounded-lg"
                            :class="{'vencida': isVencida(conta)}"
                          >
                            <template v-slot:prepend>
                              <v-icon :color="getVencimentoColor(conta)" size="small">
                                {{ getVencimentoIcon(conta) }}
                              </v-icon>
                            </template>
                            <v-list-item-title class="font-weight-medium">
                              {{ conta.descricao }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              <div class="d-flex justify-space-between align-center">
                                <span>{{ formatarData(conta.data_vencimento) }}</span>
                                <span class="font-weight-bold" :class="getValorColor(conta)">
                                  R$ {{ formatarValor(conta.valor) }}
                                </span>
                              </div>
                            </v-list-item-subtitle>
                            <template v-slot:append>
                              <div class="d-flex align-center">
                                <v-btn
                                  v-if="status === 'pendente'"
                                  icon="mdi-check"
                                  size="x-small"
                                  color="success"
                                  variant="text"
                                  @click.stop="marcarComoPaga(conta)"
                                />
                                <v-btn
                                  icon="mdi-pencil"
                                  size="x-small"
                                  color="primary"
                                  variant="text"
                                  @click.stop="openModal('edit', conta)"
                                />
                              </div>
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Conta -->
    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon :color="editingConta ? 'primary' : 'success'" size="32" class="mr-4">
            {{ editingConta ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h6 font-weight-bold">{{ editingConta ? 'Editar Conta' : 'Nova Conta' }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="formIsValid">
            <v-text-field
              v-model="conta.descricao"
              label="Descrição"
              prepend-inner-icon="mdi-text"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-text-field
              v-model="conta.fornecedor"
              label="Fornecedor"
              prepend-inner-icon="mdi-domain"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-number-input
              v-model="conta.valor"
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
              v-model="conta.data_vencimento"
              label="Data de Vencimento"
              type="date"
              prepend-inner-icon="mdi-calendar"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-select
              v-model="conta.tipo"
              :items="tiposContas"
              label="Tipo"
              prepend-inner-icon="mdi-tag"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-textarea
              v-model="conta.observacao"
              label="Observação"
              prepend-inner-icon="mdi-text-box"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              rows="3"
              auto-grow
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
            @click="salvarConta"
            :disabled="!formIsValid"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Pagamento -->
    <v-dialog v-model="modalPagamento" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="success" size="32" class="mr-4">mdi-check-circle</v-icon>
          <span class="text-h6 font-weight-bold">Registrar Pagamento</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-form ref="formPagamento" v-model="formPagamentoIsValid">
            <v-text-field
              v-model="pagamento.data_pagamento"
              label="Data do Pagamento"
              type="date"
              prepend-inner-icon="mdi-calendar"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-select
              v-model="pagamento.forma_pagamento"
              :items="formasPagamento"
              label="Forma de Pagamento"
              prepend-inner-icon="mdi-credit-card"
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
            @click="modalPagamento = false"
            variant="outlined"
            color="grey"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="confirmarPagamento"
            :disabled="!formPagamentoIsValid"
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Confirmar Pagamento
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

// Declare the window interface with the API
declare global {
  interface Window {
    api: {
      getAllContasPagar: () => Promise<ContaPagar[]>;
      updateContaPagar: (
        id: number,
        descricao: string,
        valor: number,
        data_vencimento: string,
        fornecedor: string,
        tipo: string,
        observacao?: string,
        forma_pagamento?: string
      ) => Promise<void>;
      createContaPagar: (
        descricao: string,
        valor: number,
        data_vencimento: string,
        fornecedor: string,
        tipo: string,
        observacao?: string,
        forma_pagamento?: string
      ) => Promise<void>;
      marcarContaComoPaga: (id: number) => Promise<void>;
      deleteContaPagar: (id: number) => Promise<void>;
    };
  }
}

interface ContaPagar {
  id: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  fornecedor: string;
  tipo: string;
  observacao?: string;
  forma_pagamento?: string;
  status: string;
}

interface ContaPagarForm {
  descricao: string;
  valor: number;
  data_vencimento: string;
  fornecedor: string;
  tipo: string;
  observacao?: string;
  forma_pagamento?: string;
  status: string;
}

interface TableHeader {
  title: string;
  key: string;
  sortable: boolean;
  value?: string;
  text?: string;
  width?: string;
}

interface SortItem {
  key: string;
  order: 'asc' | 'desc';
}

export default defineComponent({
  name: 'ContasPagarView',
  setup() {
    // Estados
    const contas = ref<ContaPagar[]>([]);
    const modalOpen = ref(false);
    const modalPagamento = ref(false);
    const editingConta = ref<ContaPagar | null>(null);
    const contaPagamento = ref<ContaPagar | null>(null);
    const formIsValid = ref(false);
    const formPagamentoIsValid = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('');
    const activeTab = ref('lista');
    const periodoSelecionado = ref('Hoje');
    const statusSelecionado = ref('Todas');
    const fornecedorFilter = ref('');
    const sortBy = ref<SortItem[]>([{ key: 'data_vencimento', order: 'asc' }]);
    const sortDesc = ref(false);

    // Computed
    const filteredContas = computed(() => {
      return contas.value.filter(conta => {
        // Filtro por período
        if (!filtrarPorPeriodo(conta)) return false;

        // Filtro por status
        if (statusSelecionado.value !== 'Todas') {
          if (statusSelecionado.value === 'Pendentes' && conta.status !== 'pendente') return false;
          if (statusSelecionado.value === 'Pagas' && conta.status !== 'pago') return false;
          if (statusSelecionado.value === 'Vencidas' && !isVencida(conta)) return false;
        }

        // Filtro por fornecedor
        if (fornecedorFilter.value && !conta.fornecedor.toLowerCase().includes(fornecedorFilter.value.toLowerCase())) {
          return false;
        }

        return true;
      });
    });

    // Dados do formulário
    const conta = ref<ContaPagarForm>({
      descricao: '',
      valor: 0,
      data_vencimento: new Date().toISOString().split('T')[0],
      fornecedor: '',
      tipo: '',
      observacao: '',
      forma_pagamento: '',
      status: 'Pendente'
    });

    const pagamento = ref({
      data_pagamento: new Date().toISOString().split('T')[0],
      forma_pagamento: ''
    });

    // Opções e configurações
    const periodos = [
      'Hoje',
      'Esta Semana',
      'Este Mês',
      'Este Ano',
      'Todas'
    ];

    const statusOptions = [
      'Todas',
      'Pendentes',
      'Pagas',
      'Vencidas'
    ];

    const tiposContas = [
      'Fornecedor',
      'Serviço',
      'Imposto',
      'Funcionário',
      'Aluguel',
      'Energia',
      'Água',
      'Internet',
      'Outros'
    ];

    const formasPagamento = [
      'Dinheiro',
      'Cartão de Débito',
      'Cartão de Crédito',
      'PIX',
      'Transferência',
      'Boleto'
    ];

    const kanbanStatus = ['pendente', 'pago', 'vencida'];

    const headers: TableHeader[] = [
      { title: 'Descrição', key: 'descricao', sortable: true, value: 'descricao', text: 'Descrição', width: '300px' },
      { title: 'Valor', key: 'valor', sortable: true, value: 'valor', text: 'Valor', width: '120px' },
      { title: 'Vencimento', key: 'data_vencimento', sortable: true, value: 'data_vencimento', text: 'Vencimento', width: '120px' },
      { title: 'Fornecedor', key: 'fornecedor', sortable: true, value: 'fornecedor', text: 'Fornecedor', width: '200px' },
      { title: 'Status', key: 'status', sortable: true, value: 'status', text: 'Status', width: '120px' },
      { title: 'Ações', key: 'actions', sortable: false, value: 'actions', text: 'Ações', width: '120px' }
    ];

    // Função auxiliar para ajustar a data considerando o fuso horário
    const ajustarData = (dataString: string) => {
      const [ano, mes, dia] = dataString.split('-').map(Number);
      return new Date(ano, mes - 1, dia, 12, 0, 0); // Define meio-dia para evitar problemas com fuso horário
    };

    // Função auxiliar para comparar se duas datas são o mesmo dia
    const mesmodia = (data1: Date, data2: Date) => {
      return data1.getDate() === data2.getDate() &&
             data1.getMonth() === data2.getMonth() &&
             data1.getFullYear() === data2.getFullYear();
    };

    const contasVencidas = computed(() => {
      const hoje = new Date();
      hoje.setHours(12, 0, 0, 0);

      return contas.value.filter(conta => {
        if (conta.status !== 'pendente') return false;

        const dataVencimento = ajustarData(conta.data_vencimento);
        const diaAposVencimento = new Date(dataVencimento);
        diaAposVencimento.setDate(diaAposVencimento.getDate() + 1);

        return hoje >= diaAposVencimento;
      });
    });

    const contasHoje = computed(() => {
      const hoje = new Date();
      hoje.setHours(12, 0, 0, 0);

      return contas.value.filter(conta => {
        if (conta.status !== 'pendente') return false;

        const dataVencimento = ajustarData(conta.data_vencimento);

        // Não incluir contas vencidas
        const diaAposVencimento = new Date(dataVencimento);
        diaAposVencimento.setDate(diaAposVencimento.getDate() + 1);
        if (hoje >= diaAposVencimento) return false;

        return mesmodia(dataVencimento, hoje);
      });
    });

    const contasProximas = computed(() => {
      const hoje = new Date();
      hoje.setHours(12, 0, 0, 0);

      const seteDias = new Date(hoje);
      seteDias.setDate(seteDias.getDate() + 7);
      seteDias.setHours(12, 0, 0, 0);

      return contas.value.filter(conta => {
        if (conta.status !== 'pendente') return false;

        const dataVencimento = ajustarData(conta.data_vencimento);

        // Não incluir contas vencidas
        const diaAposVencimento = new Date(dataVencimento);
        diaAposVencimento.setDate(diaAposVencimento.getDate() + 1);
        if (hoje >= diaAposVencimento) return false;

        // Não incluir contas que vencem hoje
        if (mesmodia(dataVencimento, hoje)) return false;

        return dataVencimento > hoje && dataVencimento <= seteDias;
      });
    });

    const totalPendente = computed(() => {
      return contas.value
        .filter(conta => conta.status === 'pendente')
        .reduce((total, conta) => total + conta.valor, 0);
    });

    // Métodos
    const loadContas = async () => {
      try {
        const response = await window.api.getAllContasPagar();
        contas.value = response;
      } catch (error) {
        console.error('Erro ao carregar contas:', error);
        showError('Erro ao carregar contas');
      }
    };

    const openModal = (type: 'create' | 'edit', item?: ContaPagar) => {
      if (type === 'edit' && item) {
        editingConta.value = item;
        conta.value = { ...item };
      } else {
        editingConta.value = null;
        conta.value = {
          descricao: '',
          valor: 0,
          data_vencimento: '',
          fornecedor: '',
          tipo: '',
          observacao: '',
          forma_pagamento: '',
          status: 'Pendente'
        };
      }
      modalOpen.value = true;
    };

    const salvarConta = async () => {
      try {
        if (editingConta.value?.id) {
          await window.api.updateContaPagar(
            editingConta.value.id,
            conta.value.descricao,
            conta.value.valor,
            conta.value.data_vencimento,
            conta.value.fornecedor,
            conta.value.tipo,
            conta.value.observacao,
            conta.value.forma_pagamento
          );
          showSuccess('Conta atualizada com sucesso!');
        } else {
          await window.api.createContaPagar(
            conta.value.descricao,
            conta.value.valor,
            conta.value.data_vencimento,
            conta.value.fornecedor,
            conta.value.tipo,
            conta.value.observacao,
            conta.value.forma_pagamento
          );
          showSuccess('Conta criada com sucesso!');
        }
        modalOpen.value = false;
        await loadContas();
      } catch (error) {
        console.error('Erro ao salvar conta:', error);
        showError('Erro ao salvar conta');
      }
    };

    const marcarComoPaga = (conta: ContaPagar) => {
      contaPagamento.value = conta;
      modalPagamento.value = true;
    };

    const confirmarPagamento = async () => {
      try {
        if (!contaPagamento.value) return;

        await window.api.marcarContaComoPaga(
          contaPagamento.value.id
        );

        modalPagamento.value = false;
        showSuccess('Pagamento registrado com sucesso!');
        await loadContas();
      } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        showError('Erro ao registrar pagamento');
      }
    };

    const confirmarExclusao = async (conta: ContaPagar) => {
      if (confirm('Tem certeza que deseja excluir esta conta?')) {
        try {
          await window.api.deleteContaPagar(conta.id);
          showSuccess('Conta excluída com sucesso!');
          await loadContas();
        } catch (error) {
          console.error('Erro ao excluir conta:', error);
          showError('Erro ao excluir conta');
        }
      }
    };

    // Funções auxiliares
    const formatarValor = (valor: number) => {
      return valor.toFixed(2).replace('.', ',');
    };

    const formatarData = (data: string) => {
      const dataObj = ajustarData(data);
      return dataObj.toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status: string) => {
      const colors: { [key: string]: string } = {
        'pendente': 'warning',
        'pago': 'success',
        'vencida': 'error'
      };
      return colors[status] || 'grey';
    };

    const getStatusIcon = (status: string) => {
      const icons: { [key: string]: string } = {
        'pendente': 'mdi-clock-outline',
        'pago': 'mdi-check-circle',
        'vencida': 'mdi-alert-circle'
      };
      return icons[status] || 'mdi-help-circle';
    };

    const getStatusText = (status: string) => {
      const texts: { [key: string]: string } = {
        'pendente': 'Pendente',
        'pago': 'Pago',
        'vencida': 'Vencida'
      };
      return texts[status] || status;
    };

    const getValorColor = (conta: ContaPagar) => {
      return conta.status === 'pago' ? 'text-success' : 'text-error';
    };

    const getVencimentoColor = (conta: ContaPagar) => {
      if (conta.status === 'pago') return 'success';
      return isVencida(conta) ? 'error' : 'warning';
    };

    const getVencimentoIcon = (conta: ContaPagar) => {
      if (conta.status === 'pago') return 'mdi-check-circle';
      return isVencida(conta) ? 'mdi-alert-circle' : 'mdi-clock-outline';
    };

    const isVencida = (conta: ContaPagar) => {
      if (conta.status === 'pago') return false;

      const hoje = new Date();
      hoje.setHours(12, 0, 0, 0);

      const dataVencimento = ajustarData(conta.data_vencimento);
      const diaAposVencimento = new Date(dataVencimento);
      diaAposVencimento.setDate(diaAposVencimento.getDate() + 1);

      return hoje >= diaAposVencimento;
    };

    const filtrarPorPeriodo = (conta: ContaPagar) => {
      const hoje = new Date();
      hoje.setHours(12, 0, 0, 0);

      const dataVencimento = ajustarData(conta.data_vencimento);

      switch (periodoSelecionado.value) {
        case 'Hoje':
          return mesmodia(dataVencimento, hoje);
        case 'Esta Semana': {
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          inicioSemana.setHours(12, 0, 0, 0);

          const fimSemana = new Date(inicioSemana);
          fimSemana.setDate(fimSemana.getDate() + 6);
          fimSemana.setHours(12, 0, 0, 0);

          return dataVencimento >= inicioSemana && dataVencimento <= fimSemana;
        }
        case 'Este Mês':
          return dataVencimento.getMonth() === hoje.getMonth() &&
                 dataVencimento.getFullYear() === hoje.getFullYear();
        case 'Este Ano':
          return dataVencimento.getFullYear() === hoje.getFullYear();
        default:
          return true;
      }
    };

    const getContasPorStatus = (status: string) => {
      if (status === 'vencida') {
        return contas.value.filter(conta => isVencida(conta));
      }
      return contas.value.filter(conta => conta.status === status);
    };

    const showSuccess = (message: string) => {
      snackbarText.value = message;
      snackbarColor.value = 'success';
      snackbar.value = true;
    };

    const showError = (message: string) => {
      snackbarText.value = message;
      snackbarColor.value = 'error';
      snackbar.value = true;
    };

    // Lifecycle hooks
    onMounted(loadContas);

    return {
      contas,
      modalOpen,
      modalPagamento,
      editingConta,
      conta,
      pagamento,
      formIsValid,
      formPagamentoIsValid,
      headers,
      periodos,
      statusOptions,
      tiposContas,
      formasPagamento,
      kanbanStatus,
      activeTab,
      snackbar,
      snackbarText,
      snackbarColor,
      sortBy,
      sortDesc,
      filteredContas,
      contasVencidas,
      contasHoje,
      contasProximas,
      totalPendente,
      openModal,
      salvarConta,
      marcarComoPaga,
      confirmarPagamento,
      confirmarExclusao,
      formatarValor,
      formatarData,
      getStatusColor,
      getStatusIcon,
      getStatusText,
      getValorColor,
      getVencimentoColor,
      getVencimentoIcon,
      isVencida,
      getContasPorStatus,
      periodoSelecionado,
      statusSelecionado,
      fornecedorFilter
    };
  }
});
</script>

<style scoped>
.contas-container {
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

.dashboard-card {
  border-radius: 16px;
  transition: transform 0.2s ease-in-out;
}

.dashboard-card:hover {
  transform: translateY(-4px);
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

.kanban-board {
  min-height: 400px;
}

.kanban-column {
  border-radius: 12px;
}

.kanban-list {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.kanban-list .v-list-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.kanban-list .v-list-item:hover {
  transform: translateX(4px);
  background-color: rgba(99, 102, 241, 0.05);
}

.kanban-list .v-list-item.vencida {
  border-left: 3px solid var(--v-error-base);
}

.calendar-view,
.calendar-content,
.calendar-event,
.event-title,
.event-amount,
.event-preview-card,
.calendar-day,
.day-number,
.has-events,
.event-indicator,
.day-events-card {
  display: none;
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

:deep(.v-calendar-weekly__head-weekday) {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 0;
  color: var(--v-theme-primary);
}

:deep(.v-calendar-weekly__day) {
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

:deep(.v-calendar-weekly__day--today) {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

:deep(.v-calendar-weekly__day:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.calendar-day {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.day-number {
  font-weight: 500;
}

.has-events {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-radius: 4px;
}

.event-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
}

.day-events-card {
  border-radius: 16px;
  overflow: hidden;
}
</style>
