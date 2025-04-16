<template>
  <v-container fluid class="credito-container pa-6">
    <!-- Header Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Créditos de Clientes
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Gerencie os créditos disponíveis dos clientes
              </div>
            </div>
            <div class="d-flex align-center">
              <v-btn color="white" variant="tonal" class="mr-4" prepend-icon="mdi-file-pdf-box"
                @click="gerarRelatorioCreditos" :loading="gerandoRelatorio">
                Gerar Relatório
              </v-btn>
              <v-btn icon variant="text" color="white" class="mr-4" size="small">
                <v-icon>mdi-information</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  <div class="tooltip-content">
                    <p class="font-weight-bold mb-1">Como gerenciar créditos:</p>
                    <ol class="mb-0">
                      <li>Adicione créditos para clientes que deixaram valores antecipados</li>
                      <li>Utilize os créditos ao realizar serviços</li>
                      <li>Acompanhe o saldo disponível de cada cliente</li>
                      <li>Estorne créditos quando necessário</li>
                    </ol>
                  </div>
                </v-tooltip>
              </v-btn>
              <v-avatar size="64" class="welcome-avatar">
                <v-icon size="36" color="white">mdi-wallet-plus</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Status Filter -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="filter-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
              <span class="text-subtitle-1 font-weight-medium mr-4">Filtrar por Status:</span>
              <v-btn-toggle
                v-model="statusFilter"
                mandatory
                color="primary"
                class="rounded-lg"
              >
                <v-btn value="todos" class="px-4">
                  <v-icon left>mdi-filter</v-icon>
                  Todos
                </v-btn>
                <v-btn value="disponivel" class="px-4">
                  <v-icon left>mdi-check-circle</v-icon>
                  Disponível
                </v-btn>
                <v-btn value="utilizado" class="px-4">
                  <v-icon left>mdi-check-circle-outline</v-icon>
                  Utilizado
                </v-btn>
              </v-btn-toggle>
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
              <v-icon color="primary" class="mr-2">mdi-wallet</v-icon>
              <span class="text-h6 font-weight-medium">Lista de Créditos</span>
            </div>
            <v-btn
              color="primary"
              @click="openModal('create')"
              class="add-btn"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Novo Crédito
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <!-- Estatísticas -->
            <v-row class="mb-4">
              <v-col cols="12" sm="4">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center py-2 px-3">
                    <v-icon color="success" size="24" class="mr-2">mdi-cash-plus</v-icon>
                    <div class="stat-content">
                      <div class="text-subtitle-2 text-medium-emphasis">Total em Créditos</div>
                      <div class="text-h6 font-weight-bold text-success">
                        R$ {{ totalCreditos.toFixed(2) }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center py-2 px-3">
                    <v-icon color="primary" size="24" class="mr-2">mdi-wallet</v-icon>
                    <div class="stat-content">
                      <div class="text-subtitle-2 text-medium-emphasis">Créditos Disponíveis</div>
                      <div class="text-h6 font-weight-bold text-primary">
                        R$ {{ creditosDisponiveis.toFixed(2) }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center py-2 px-3">
                    <v-icon color="info" size="24" class="mr-2">mdi-check-circle</v-icon>
                    <div class="stat-content">
                      <div class="text-subtitle-2 text-medium-emphasis">Créditos Utilizados</div>
                      <div class="text-h6 font-weight-bold text-info">
                        R$ {{ creditosUtilizados.toFixed(2) }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Search and Filter -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clienteFilter"
                  label="Filtrar por Cliente"
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
            </v-row>

            <!-- Data Table -->
            <v-data-table
              :headers="headers"
              :items="filteredCreditos"
              class="elevation-0 rounded-lg"
              density="comfortable"
              hover
              :no-data-text="'Nenhum crédito encontrado'"
              :loading-text="'Carregando créditos...'"
              :items-per-page="10"
            >
              <template v-slot:item.cliente_nome="{ item }">
                <div class="d-flex align-center" style="width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <v-icon size="small" color="primary" class="mr-2">mdi-account</v-icon>
                  {{ item.cliente_nome }}
                </div>
              </template>

              <template v-slot:item.valor="{ item }">
                <span class="font-weight-bold text-success">
                  R$ {{ item.valor.toFixed(2) }}
                </span>
              </template>

              <template v-slot:item.data_credito="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" color="primary" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(item.data_credito) }}
                </div>
              </template>

              <template v-slot:item.data_utilizacao="{ item }">
                <div v-if="item.data_utilizacao" class="d-flex align-center">
                  <v-icon size="small" color="info" class="mr-1">mdi-calendar-check</v-icon>
                  {{ formatDate(item.data_utilizacao) }}
                </div>
                <span v-else>-</span>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  variant="tonal"
                  size="small"
                  class="font-weight-medium"
                >
                  <v-icon size="small" class="mr-1">
                    {{ getStatusIcon(item.status) }}
                  </v-icon>
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-tooltip location="top" text="Utilizar Crédito">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="item.status === 'disponivel'"
                        icon="mdi-check-circle"
                        size="small"
                        color="success"
                        variant="text"
                        v-bind="props"
                        @click="utilizarCredito(item)"
                        class="action-btn"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip location="top" text="Estornar Crédito">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="item.status === 'utilizado'"
                        icon="mdi-restore"
                        size="small"
                        color="warning"
                        variant="text"
                        v-bind="props"
                        @click="estornarCredito(item)"
                        class="action-btn"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip location="top" text="Excluir Crédito">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="item.status === 'disponivel'"
                        icon="mdi-delete"
                        size="small"
                        color="error"
                        variant="text"
                        v-bind="props"
                        @click="deleteCredito(item)"
                        class="action-btn"
                      />
                    </template>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Crédito -->
    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="primary" size="32" class="mr-4">mdi-wallet-plus</v-icon>
          <span class="text-h6 font-weight-bold">Novo Crédito</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="formIsValid">
            <v-autocomplete
              v-model="credito.cliente_id"
              :items="clientes"
              item-title="nome"
              item-value="id"
              label="Cliente"
              prepend-inner-icon="mdi-account"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-text-field
              v-model="credito.valor"
              label="Valor"
              type="number"
              prepend-inner-icon="mdi-cash"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              prefix="R$"
              required
            />
            <v-text-field
              v-model="credito.data_credito"
              label="Data"
              type="date"
              prepend-inner-icon="mdi-calendar"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              required
            />
            <v-textarea
              v-model="credito.observacao"
              label="Observação"
              prepend-inner-icon="mdi-text"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              rows="3"
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
            @click="saveCredito"
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
import jsPDF from 'jspdf';

declare global {
  interface Window {
    api: {
      getAllCreditosClientes: () => Promise<Credito[]>;
      getAllClientes: () => Promise<Cliente[]>;
      createCreditoCliente: (clienteId: number, valor: number, data: string, observacao?: string) => Promise<void>;
      utilizarCreditoCliente: (id: number, dataUtilizacao: string) => Promise<void>;
      estornarCreditoCliente: (id: number) => Promise<void>;
      deleteCreditoCliente: (id: number) => Promise<void>;
    }
  }
}

interface Credito {
  id?: number;
  cliente_id: number;
  cliente_nome?: string;
  valor: number;
  data_credito: string;
  data_utilizacao?: string;
  status: string;
  observacao?: string;
}

interface Cliente {
  id: number;
  nome: string;
}

export default defineComponent({
  name: 'CreditoView',
  setup() {
    const creditos = ref<Credito[]>([]);
    const clientes = ref<Cliente[]>([]);
    const statusFilter = ref('todos');
    const clienteFilter = ref('');
    const dataFilter = ref('');
    const modalOpen = ref(false);
    const formIsValid = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('');
    const gerandoRelatorio = ref(false);

    const credito = ref<Credito>({
      cliente_id: 0,
      valor: 0,
      data_credito: new Date().toISOString().split('T')[0],
      status: 'disponivel'
    });

    const headers = [
      { title: 'Cliente', key: 'cliente_nome', align: 'start', sortable: true },
      { title: 'Valor', key: 'valor', align: 'start', sortable: true },
      { title: 'Data Crédito', key: 'data_credito', align: 'start', sortable: true },
      { title: 'Data Utilização', key: 'data_utilizacao', align: 'start', sortable: true },
      { title: 'Status', key: 'status', align: 'start', sortable: true },
      { title: 'Ações', key: 'actions', align: 'end', sortable: false }
    ];

    const filteredCreditos = computed(() => {
      return creditos.value.filter(c => {
        const statusMatch = statusFilter.value === 'todos' || c.status === statusFilter.value;
        const clienteMatch = !clienteFilter.value ||
          c.cliente_nome?.toLowerCase().includes(clienteFilter.value.toLowerCase());
        const dataMatch = !dataFilter.value || c.data_credito === dataFilter.value;
        return statusMatch && clienteMatch && dataMatch;
      });
    });

    const totalCreditos = computed(() => {
      return creditos.value.reduce((total, c) => total + c.valor, 0);
    });

    const creditosDisponiveis = computed(() => {
      return creditos.value
        .filter(c => c.status === 'disponivel')
        .reduce((total, c) => total + c.valor, 0);
    });

    const creditosUtilizados = computed(() => {
      return creditos.value
        .filter(c => c.status === 'utilizado')
        .reduce((total, c) => total + c.valor, 0);
    });

    const loadCreditos = async () => {
      try {
        creditos.value = await window.api.getAllCreditosClientes();
      } catch (error) {
        console.error('Erro ao carregar créditos:', error);
        showSnackbar('Erro ao carregar créditos', 'error');
      }
    };

    const loadClientes = async () => {
      try {
        clientes.value = await window.api.getAllClientes();
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        showSnackbar('Erro ao carregar clientes', 'error');
      }
    };

    const saveCredito = async () => {
      try {
        await window.api.createCreditoCliente(
          credito.value.cliente_id,
          credito.value.valor,
          credito.value.data_credito,
          credito.value.observacao
        );
        modalOpen.value = false;
        await loadCreditos();
        showSnackbar('Crédito adicionado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao salvar crédito:', error);
        showSnackbar('Erro ao salvar crédito', 'error');
      }
    };

    const utilizarCredito = async (item: Credito) => {
      try {
        if (!item.id) return;
        await window.api.utilizarCreditoCliente(
          item.id,
          new Date().toISOString().split('T')[0]
        );
        await loadCreditos();
        showSnackbar('Crédito utilizado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao utilizar crédito:', error);
        showSnackbar('Erro ao utilizar crédito', 'error');
      }
    };

    const estornarCredito = async (item: Credito) => {
      try {
        if (!item.id) return;
        await window.api.estornarCreditoCliente(item.id);
        await loadCreditos();
        showSnackbar('Crédito estornado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao estornar crédito:', error);
        showSnackbar('Erro ao estornar crédito', 'error');
      }
    };

    const deleteCredito = async (item: Credito) => {
      try {
        if (!item.id) return;
        await window.api.deleteCreditoCliente(item.id);
        await loadCreditos();
        showSnackbar('Crédito excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir crédito:', error);
        showSnackbar('Erro ao excluir crédito', 'error');
      }
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status: string) => {
      return status === 'disponivel' ? 'success' : 'info';
    };

    const getStatusIcon = (status: string) => {
      return status === 'disponivel' ? 'mdi-check-circle' : 'mdi-check-circle-outline';
    };

    const showSnackbar = (text: string, color: string) => {
      snackbarText.value = text;
      snackbarColor.value = color;
      snackbar.value = true;
    };

    const gerarRelatorioCreditos = async () => {
      try {
        gerandoRelatorio.value = true;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título
        doc.setFontSize(20);
        doc.setTextColor(99, 102, 241);
        doc.text('Relatório de Créditos de Clientes', pageWidth / 2, 20, { align: 'center' });

        // Data e hora
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR');
        doc.text(`Gerado em: ${dataAtual} às ${horaAtual}`, pageWidth / 2, 30, { align: 'center' });

        // Resumo
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Resumo de Créditos', 20, 45);

        doc.setFontSize(10);
        doc.text(`Total em Créditos: R$ ${totalCreditos.value.toFixed(2)}`, 20, 55);
        doc.text(`Créditos Disponíveis: R$ ${creditosDisponiveis.value.toFixed(2)}`, 20, 62);
        doc.text(`Créditos Utilizados: R$ ${creditosUtilizados.value.toFixed(2)}`, 20, 69);

        // Lista de Créditos
        doc.setFontSize(14);
        doc.text('Lista de Créditos', 20, 85);

        let y = 95;
        filteredCreditos.value.forEach((credito, index) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }

          doc.setFontSize(10);
          doc.text(`Cliente: ${credito.cliente_nome}`, 20, y);
          doc.text(`Valor: R$ ${credito.valor.toFixed(2)}`, 20, y + 7);
          doc.text(`Data: ${formatDate(credito.data_credito)}`, 20, y + 14);
          doc.text(`Status: ${credito.status}`, 20, y + 21);
          if (credito.data_utilizacao) {
            doc.text(`Utilizado em: ${formatDate(credito.data_utilizacao)}`, 20, y + 28);
          }
          doc.text('----------------------------------------', 20, y + 35);

          y += 45;
        });

        doc.save('relatorio-creditos.pdf');
        showSnackbar('Relatório gerado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        showSnackbar('Erro ao gerar relatório', 'error');
      } finally {
        gerandoRelatorio.value = false;
      }
    };

    const openModal = (action: string) => {
      if (action === 'create') {
        credito.value = {
          cliente_id: 0,
          valor: 0,
          data_credito: new Date().toISOString().split('T')[0],
          status: 'disponivel'
        };
        modalOpen.value = true;
      }
    };

    onMounted(async () => {
      await loadClientes();
      await loadCreditos();
    });

    return {
      creditos,
      clientes,
      statusFilter,
      clienteFilter,
      dataFilter,
      modalOpen,
      credito,
      headers,
      formIsValid,
      snackbar,
      snackbarText,
      snackbarColor,
      filteredCreditos,
      totalCreditos,
      creditosDisponiveis,
      creditosUtilizados,
      saveCredito,
      utilizarCredito,
      estornarCredito,
      deleteCredito,
      formatDate,
      getStatusColor,
      getStatusIcon,
      gerarRelatorioCreditos,
      gerandoRelatorio,
      openModal
    };
  }
});
</script>

<style scoped>
.credito-container {
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

.search-field {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-field:hover, .search-field:focus-within {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.action-btn {
  min-width: 32px;
  height: 32px;
  margin: 0 4px;
}

.modal-card {
  border-radius: 16px;
  overflow: hidden;
}

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

.filter-card {
  border-radius: 16px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1);
}
</style>
