<template>
  <v-container fluid class="fiado-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Vendas Pendentes
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Gerencie as vendas a prazo e fiados
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-icon size="36" color="white">mdi-account-clock</v-icon>
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
              <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
              <span class="text-h6 font-weight-medium">Vendas Pendentes (Fiado)</span>
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <!-- Search and Filter Section -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchCliente"
                  label="Filtrar por Cliente"
                  prepend-inner-icon="mdi-account-search"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  placeholder="Digite o nome do cliente..."
                  clearable
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchData"
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
              :items="filteredFiados"
              class="elevation-0 rounded-lg"
              density="comfortable"
              hover
              :no-data-text="'Nenhuma venda pendente encontrada'"
              :loading-text="'Carregando vendas pendentes...'"
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
                        v-if="header.sortable !== false && header.value !== 'status'"
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

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'pago' ? 'success' : 'error'"
                  variant="tonal"
                  size="small"
                  class="font-weight-medium"
                >
                  <v-icon size="small" class="mr-1">
                    {{ item.status === 'pago' ? 'mdi-check-circle' : 'mdi-close-circle' }}
                  </v-icon>
                  {{ item.status === 'pago' ? 'Pago' : 'Pendente' }}
                </v-chip>
              </template>

              <template v-slot:item.valor_total="{ item }">
                <span class="font-weight-bold">
                  R$ {{ item.valor_total.toFixed(2) || '0.00' }}
                </span>
              </template>

              <template v-slot:item.desconto="{ item }">
                <span class="font-weight-bold text-error">
                  R$ {{ item.desconto?.toFixed(2) || '0.00' }}
                </span>
              </template>

              <template v-slot:item.divida="{ item }">
                <span class="font-weight-bold text-error">
                  R$ {{ (item.valor_total - item.valor_pago).toFixed(2) || '0.00' }}
                </span>
              </template>

              <template v-slot:item.data="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" color="primary" class="mr-1">mdi-calendar</v-icon>
                  {{ formatData(item.data) }}
                </div>
              </template>

              <template v-slot:item.valor_pago="{ item }">
                <span class="font-weight-bold text-success">
                  R$ {{ item.valor_pago.toFixed(2) || '0.00' }}
                </span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  v-if="item.status !== 'pago'"
                  color="success"
                  variant="tonal"
                  size="small"
                  @click="markAsPaid(item)"
                  class="action-btn"
                >
                  <v-icon left size="small">mdi-check</v-icon>
                  Alterar status
                </v-btn>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-6">
                  <v-icon color="grey" size="48" class="mb-2">mdi-cash-check</v-icon>
                  <div class="text-subtitle-1 text-grey">Nenhuma venda pendente encontrada</div>
                  <div class="text-caption text-grey">Não há fiados pendentes no momento</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Detalhes do Fiado -->
    <v-dialog v-model="modalOpen" max-width="600px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="primary" size="32" class="mr-4">mdi-cash-multiple</v-icon>
          <span class="text-h6 font-weight-bold">Detalhes do Fiado</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-list class="bg-transparent">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-4">mdi-account</v-icon>
              </template>
              <v-list-item-title class="font-weight-bold">Cliente: {{ fiadoSelecionado?.nome_cliente }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success" class="mr-4">mdi-cash</v-icon>
              </template>
              <v-list-item-title>Valor total da venda: <span class="font-weight-bold text-success">R$ {{ fiadoSelecionado?.valor_total.toFixed(2) || '0.00' }}</span></v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="error" class="mr-4">mdi-cash-minus</v-icon>
              </template>
              <v-list-item-title>Valor pago pelo cliente: <span class="font-weight-bold text-error">R$ {{ fiadoSelecionado?.valor_pago.toFixed(2) || '0.00' }}</span></v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="error" class="mr-4">mdi-percent</v-icon>
              </template>
              <v-list-item-title>Desconto aplicado: <span class="font-weight-bold text-error">R$ {{ fiadoSelecionado?.desconto?.toFixed(2) || '0.00' }}</span></v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-4">mdi-calendar</v-icon>
              </template>
              <v-list-item-title v-if="fiadoSelecionado?.data">Data: {{ formatData(fiadoSelecionado?.data) }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-4">mdi-credit-card</v-icon>
              </template>
              <v-list-item-title>Método de pagamento: {{ fiadoSelecionado?.metodo_pagamento }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <!-- Seção de Dívida Atual -->
          <v-card class="debt-card mb-4" elevation="0">
            <v-card-text class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon color="error" size="32" class="mr-4">mdi-alert-circle</v-icon>
                <span class="text-h6 font-weight-bold">Dívida Atual</span>
              </div>
              <span class="text-h5 font-weight-bold text-error">
                R$ {{ ((fiadoSelecionado?.valor_total ?? 0) - (fiadoSelecionado?.valor_pago ?? 0)).toFixed(2) }}
              </span>
            </v-card-text>
          </v-card>

          <v-divider class="my-4"></v-divider>

          <div class="text-subtitle-1 font-weight-bold mb-2">Itens da Venda</div>
          <v-list dense class="bg-transparent" style="max-height: 200px; overflow-y: auto;">
            <v-list-item v-for="item in fiadoSelecionado?.itens" :key="item.produto_id || item.servico_id" class="mb-2">
              <template v-slot:prepend>
                <v-icon color="primary" size="small" class="mr-2">
                  {{ item.produto_id ? 'mdi-package-variant' : 'mdi-tools' }}
                </v-icon>
              </template>
              <v-list-item-title>
                {{ item.nome_item }} -
                <span class="font-weight-bold">
                  R$ {{ item.valor_unitario }} x {{ item.quantidade }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <v-autocomplete
            v-model="metodoPagamento"
            :items="metodosPagamento"
            label="Forma de Pagamento"
            prepend-inner-icon="mdi-credit-card"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-4"
            required
          />

          <v-text-field
            v-model="valorPago"
            label="Valor Pago"
            prepend-inner-icon="mdi-currency-brl"
            density="compact"
            variant="outlined"
            hide-details
            prefix="R$"
            type="number"
            step="0.01"
            min="0"
            :max="(fiadoSelecionado?.valor_total ?? 0) - (fiadoSelecionado?.valor_pago ?? 0)"
            :rules="[
              val => val >= 0 || 'Valor deve ser maior que zero',
              val => val <= ((fiadoSelecionado?.valor_total ?? 0) - (fiadoSelecionado?.valor_pago ?? 0)) || 'Valor não pode ser maior que a dívida'
            ]"
            :error-messages="valorPagoError"
            @input="validarValorPago"
            required
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            @click="closeModal"
            variant="outlined"
            color="grey"
            class="mr-2"
          >
            <v-icon class="mr-2">mdi-close</v-icon>
            Fechar
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="confirmarPagamento"
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Confirmar Pagamento
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { VendaEntity } from '@renderer/entities/VendaEntity';

interface SortItem {
  key: string;
  order: 'asc' | 'desc';
}

export default defineComponent({
  name: 'FiadoView',
  setup() {
    const fiados = ref<VendaEntity[]>([]); // Lista de vendas não pagas
    const search = ref(''); // Filtro de busca
    const modalOpen = ref(false); // Controle do modal
    const fiadoSelecionado = ref<VendaEntity | null>(null); // Fiado selecionado para detalhes
    const metodoPagamento = ref(''); // Forma de pagamento
    const metodosPagamento = ref(['Cartão', 'Dinheiro', 'Pix']); // Lista de métodos de pagamento
    const valorPago = ref(0); // Valor pago pelo cliente
    const valorPagoError = ref(''); // Erro de valor pago
    const searchCliente = ref('');
    const searchData = ref(null);

    const headers = [
      { text: 'Cliente', value: 'nome_cliente', sortable: true },
      { text: 'Valor Pago', value: 'valor_pago', sortable: true },
      { text: 'Valor Total', value: 'valor_total', sortable: true },
      { text: 'Desconto', value: 'desconto', sortable: true },
      { text: 'Dívida', value: 'divida', sortable: true },
      { text: 'Tipo Pagamento', value: 'metodo_pagamento', sortable: true },
      { text: 'Data', value: 'data', sortable: true },
      { text: 'Status', value: 'status', sortable: false },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const filteredFiados = computed(() =>
      fiados.value.filter(f => {
        const filtroCliente = searchCliente.value
          ? f.nome_cliente.toLowerCase().includes(searchCliente.value.toLowerCase())
          : true;

        const filtroData = searchData.value
          ? formatDateForComparison(f.data) === searchData.value
          : true;

        return filtroCliente && filtroData;
      }).map(f => ({
        ...f,
        desconto: f.desconto || 0,
        divida: (f.valor_total) - f.valor_pago // valor_total já vem com desconto aplicado
      }))
    );

    const sortBy = ref<SortItem[]>([{ key: 'data', order: 'desc' }]);
    const sortDesc = ref(true);

    const handleSort = (key: string) => {
      if (!key) return;

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
      if (!key) return 'mdi-arrow-up-down';
      if (sortBy.value[0]?.key !== key) return 'mdi-arrow-up-down';
      return sortDesc.value ? 'mdi-arrow-down' : 'mdi-arrow-up';
    };

    const handleSortBy = (value: SortItem[]) => {
      sortBy.value = value;
    };

    const handleSortDesc = (value: boolean) => {
      sortDesc.value = value;
    };

    // Função para formatar a data para comparação, retirando hora, minuto e segundo
    const formatDateForComparison = (data: string) => {
      const date = new Date(data);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const loadFiados = async () => {
      try {
        const dadosFiados = await window.api.getVendasFiado();
        fiados.value = dadosFiados.map((venda: any) => new VendaEntity(venda));
      } catch (err) {
        console.error('Erro ao carregar fiados:', err);
      }
    };

    const markAsPaid = async (item: VendaEntity) => {
      try {
        fiadoSelecionado.value = item;
        metodoPagamento.value = item.metodo_pagamento || ''; // Popula com o pagamento do fiado selecionado
        modalOpen.value = true; // Abre o modal
      } catch (err) {
        console.error('Erro ao marcar como pago:', err);
      }
    };


    const confirmarPagamento = async () => {
      if (!metodoPagamento.value) {
        alert('Selecione uma forma de pagamento');
        return;
      }

      const item = fiadoSelecionado.value;
      if (item) {
        const valorRestante = item.valor_total - item.valor_pago;
        if (valorPago.value >= valorRestante) {
          await window.api.updateVenda(
            item.id,
            item.valor_total,
            item.valor_pago + valorPago.value,
            metodoPagamento.value,
            'pago',
            item.data
          );
        } else {
          await window.api.updateVenda(
            item.id,
            item.valor_total,
            item.valor_pago + valorPago.value,
            metodoPagamento.value,
            'pendente',
            item.data
          );
        }
        loadFiados();
        modalOpen.value = false;
        resetModalFields();
      }
    };

    const closeModal = () => {
      modalOpen.value = false;
      resetModalFields(); // Reseta os campos quando o modal for fechado
    };

    const resetModalFields = () => {
      metodoPagamento.value = '';  // Reseta a forma de pagamento
      valorPago.value = 0;         // Reseta o valor pago
      valorPagoError.value = '';   // Reseta o erro de valor pago
    };

    // Formatar a data para o formato "dd/mm/yy - hora:minuto"
    const formatData = (data: string) => {
      const date = new Date(data);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear().toString().slice(2);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };

    const validarValorPago = () => {
      if (!fiadoSelecionado.value) return;

      const dividaTotal = fiadoSelecionado.value.valor_total - fiadoSelecionado.value.valor_pago;

      // Verifica se o valor é negativo
      if (valorPago.value < 0) {
        valorPago.value = 0;
        valorPagoError.value = 'Valor não pode ser negativo';
        return;
      }

      // Verifica se o valor é maior que a dívida
      if (valorPago.value > dividaTotal) {
        valorPago.value = dividaTotal;
        valorPagoError.value = 'Valor não pode ser maior que a dívida';
      } else {
        valorPagoError.value = '';
      }
    };

    onMounted(loadFiados); // Carrega os fiados ao montar o componente

    return {
      fiados,
      search,
      headers,
      filteredFiados,
      markAsPaid,
      modalOpen,
      fiadoSelecionado,
      formatData,
      metodoPagamento,
      metodosPagamento,
      searchCliente,
      searchData,
      confirmarPagamento,
      closeModal,
      valorPago,
      valorPagoError,
      sortBy,
      sortDesc,
      handleSort,
      handleSortBy,
      handleSortDesc,
      getSortIcon,
      validarValorPago,
    };
  }
});
</script>

<style scoped>
.fiado-container {
  background-color: var(--color-background);
  min-height: 100vh;
}

.welcome-card {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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

.action-btn {
  text-transform: none;
  letter-spacing: normal;
}

.modal-card {
  border-radius: 16px;
  overflow: hidden;
}

.debt-card {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 12px;
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
