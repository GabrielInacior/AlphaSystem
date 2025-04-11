<template>
  <v-container fluid class="historico-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Histórico de Vendas
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Acompanhe todas as vendas realizadas
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-img src="@/assets/logo.png" alt="Logo" />
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
              <v-icon color="primary" class="mr-2">mdi-history</v-icon>
              <span class="text-h6 font-weight-medium">Registros de Vendas</span>
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <!-- Search and Filter Section -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchCliente"
                  label="Filtrar por Cliente"
                  prepend-inner-icon="mdi-account-search"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  placeholder="Digite o nome do cliente..."
                />
              </v-col>
              <v-col cols="12" md="4">
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
              <v-col cols="12" md="4">
                <v-select
                  v-model="searchPagamento"
                  :items="metodosPagamento"
                  label="Filtrar por Método de Pagamento"
                  prepend-inner-icon="mdi-credit-card"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  clearable
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="searchPagamento = ''">
                      <v-list-item-content>
                        <v-list-item-title>Todos</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <!-- Data Table -->
            <v-data-table
              :headers="headers"
              :items="filteredVendas"
              class="elevation-0 rounded-lg"
              density="comfortable"
              hover
              :no-data-text="'Nenhum registro de venda encontrado'"
              :loading-text="'Carregando vendas...'"
            >
              <template v-slot:headers>
                <tr>
                  <th v-for="header in headers" :key="header.value" class="text-left font-weight-bold">
                    {{ header.text }}
                  </th>
                </tr>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    color="primary"
                    variant="text"
                    @click="openEditarVenda(item)"
                    class="action-btn"
                  />
                  <v-btn
                    icon="mdi-information-variant"
                    size="small"
                    color="info"
                    variant="text"
                    @click="openVendaInfo(item)"
                    class="action-btn"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    variant="text"
                    @click="confirmarExclusao(item.id)"
                    class="action-btn"
                  />
                </div>
              </template>

              <template v-slot:item.itens="{ item }">
                <div class="d-flex flex-column">
                  <div v-for="itens in item.itens" :key="itens.produto_id || itens.servico_id" class="mb-1">
                    <span v-if="itens.produto_id">{{ itens.nome_item }} - R$ {{ itens.valor_unitario }} x {{ itens.quantidade }}</span>
                    <span v-else>{{ itens.nome_item }} - R$ {{ itens.valor_unitario }} x {{ itens.quantidade }}</span>
                  </div>
                </div>
              </template>

              <template v-slot:item.valor_total="{ item }">
                <span class="font-weight-bold text-success">
                  R$ {{ item.valor_total.toFixed(2) || '0.00' }}
                </span>
              </template>

              <template v-slot:item.data="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" color="primary" class="mr-1">mdi-calendar</v-icon>
                  {{ formatData(item.data) }}
                </div>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'pago' ? 'success' : 'warning'"
                  variant="tonal"
                  size="small"
                  class="font-weight-medium"
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
                  <div class="text-subtitle-1 text-grey">Nenhum registro de venda encontrado</div>
                  <div class="text-caption text-grey">Não há vendas registradas no período selecionado</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Confirmação de Exclusão -->
    <v-dialog v-model="modalConfirmacaoExclusao" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="error" size="32" class="mr-4">mdi-alert-circle</v-icon>
          <span class="text-h6 font-weight-bold">Confirmar Exclusão</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <p class="text-body-1">Deseja realmente excluir esse registro de venda?</p>
          <p class="text-caption text-medium-emphasis">Esta ação não pode ser desfeita.</p>
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
            @click="excluirVenda"
            :disabled="excluindoVenda"
          >
            <v-icon class="mr-2">mdi-delete</v-icon>
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Informações da Venda -->
    <v-dialog v-model="modalInfo" max-width="600px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="info" size="32" class="mr-4">mdi-information</v-icon>
          <span class="text-h6 font-weight-bold">Detalhes da Venda</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-list class="bg-transparent">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-4">mdi-account</v-icon>
              </template>
              <v-list-item-title class="font-weight-bold">Cliente: {{ vendaInfo?.nome_cliente }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success" class="mr-4">mdi-cash</v-icon>
              </template>
              <v-list-item-title>Valor total da venda: <span class="font-weight-bold text-success">R$ {{ vendaInfo?.valor_total.toFixed(2) || '0.00' }}</span></v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="info" class="mr-4">mdi-cash-multiple</v-icon>
              </template>
              <v-list-item-title>Valor pago pelo cliente: <span class="font-weight-bold">R$ {{ vendaInfo?.valor_pago.toFixed(2) || '0.00' }}</span></v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-4">mdi-calendar</v-icon>
              </template>
              <v-list-item-title v-if="vendaInfo?.data">Data: {{ formatData(vendaInfo?.data) }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-4">mdi-credit-card</v-icon>
              </template>
              <v-list-item-title>Método de pagamento: {{ vendaInfo?.metodo_pagamento }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <div class="text-subtitle-1 font-weight-bold mb-2">Itens da Venda</div>
          <v-list dense class="bg-transparent" style="max-height: 200px; overflow-y: auto;">
            <v-list-item v-for="item in vendaInfo?.itens" :key="item.produto_id || item.servico_id" class="mb-2">
              <template v-slot:prepend>
                <v-icon color="primary" size="small" class="mr-2">
                  {{ item.produto_id ? 'mdi-package-variant' : 'mdi-tools' }}
                </v-icon>
              </template>
              <v-list-item-title>
                {{ item.nome_item || 'Item excluído' }} -
                <span class="font-weight-bold">
                  {{ item.valor_unitario ? 'R$' + item.valor_unitario.toFixed(2) : '---' }} -
                  {{ item.quantidade + ' Unidade(s)' }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            @click="modalInfo = false"
          >
            <v-icon class="mr-2">mdi-close</v-icon>
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para editar a venda -->
    <v-dialog v-model="modalEditar" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="primary" size="32" class="mr-4">mdi-pencil</v-icon>
          <span class="text-h6 font-weight-bold">Editar Venda</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-form ref="formEditarVenda" v-model="formIsValid">
            <v-text-field
              v-model="vendaEdicao.valor_total"
              label="Valor Total"
              prepend-inner-icon="mdi-currency-brl"
              density="compact"
              variant="outlined"
              hide-details
              prefix="R$"
              class="mb-4"
            />
            <v-text-field
              v-model="vendaEdicao.data"
              label="Data e Hora"
              type="datetime-local"
              prepend-inner-icon="mdi-calendar-clock"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              :rules="[validaData]"
              required
            />
            <v-select
              v-model="vendaEdicao.metodo_pagamento"
              :items="metodosPagamento"
              label="Método de Pagamento"
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
            @click="modalEditar = false"
            variant="outlined"
            color="grey"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!formIsValid"
            @click="editarVenda"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { VendaEntity } from '@renderer/entities/VendaEntity';

export default defineComponent({
  name: 'HistoricoVendas',
  setup() {
    const vendas = ref<VendaEntity[]>([]); // Lista de vendas
    const searchCliente = ref('');
    const searchData = ref(null); // Filtro de busca por data
    const searchPagamento = ref(''); // Filtro de busca por método de pagamento
    const excluindoVenda = ref(false);
    const modalInfo = ref(false);
    const modalConfirmacaoExclusao = ref(false);
    const modalEditar = ref(false); // Modal de edição
    const formIsValid = ref(false); // Validação do formulário de edição
    const vendaIdParaExcluir = ref<number | null>(null);
    const vendaEdicao = ref<any>({}); // Venda para edição
    const vendaInfo = ref<any>({}); // Venda para edição
    const clientes = ref(['Cliente 1', 'Cliente 2']); // Exemplo de lista de clientes

    // Cabeçalhos da tabela de vendas
    const headers = [
      { text: 'Cliente', value: 'nome_cliente' },
      { text: 'Valor Total', value: 'valor_total' },
      { text: 'Data', value: 'data' },
      { text: 'Método de Pagamento', value: 'metodo_pagamento' },
      { text: 'Status', value: 'status' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const confirmarExclusao = (id: number) => {
      vendaIdParaExcluir.value = id; // Guarda o ID da venda para exclusão
      modalConfirmacaoExclusao.value = true; // Abre o modal de confirmação
    };

    // Itens de método de pagamento para filtro
    const metodosPagamento = ref(['Dinheiro', 'Cartão', 'Pix',]);

    // Filtragem das vendas
    const filteredVendas = computed(() =>
      vendas.value.filter(venda => {
        const filtroCliente = searchCliente.value
          ? venda.nome_cliente?.toLowerCase().includes(searchCliente.value.toLowerCase())
          : true;

        const filtroData = searchData.value
          ? formatDateForComparison(venda.data) === searchData.value
          : true;

        const filtroPagamento = searchPagamento.value
          ? venda.metodo_pagamento?.toLowerCase().includes(searchPagamento.value.toLowerCase())
          : true;

        return filtroCliente && filtroData && filtroPagamento;
      })
    );

    const formatDateForComparison = (data: string) => {
      const date = new Date(data);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const validaData = (value: string) => {
      if (!value) return 'A data é obrigatória.';
      const regexDataHora = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!regexDataHora.test(value)) return 'Data e hora inválidas.';
      const data = new Date(value);
      if (isNaN(data.getTime())) return 'Data e hora inválidas.';
      return true;
    };


    // Carregar as vendas
    const carregarVendas = async () => {
      try {
        const dadosVendas = await window.api.getVendasPagas();
        if (Array.isArray(dadosVendas)) {
          vendas.value = dadosVendas.map((venda: any) => new VendaEntity(venda));
        }
      } catch (err) {
        console.error('Erro ao carregar vendas:', err);
      }
    };

    // Abrir o modal para editar venda
    const openEditarVenda = (venda: VendaEntity) => {
      if (venda.data) {
        const dataOriginal = new Date(venda.data);
        dataOriginal.setHours(dataOriginal.getHours() - 3); // Ajusta a data subtraindo 3 horas
        const dataFormatada = dataOriginal.toISOString().slice(0, 16); // Formato para datetime-local
        vendaEdicao.value = { ...venda, data: dataFormatada };
      } else {
        vendaEdicao.value = { ...venda, data: '' };
      }
      modalEditar.value = true;
    };


    const openVendaInfo = (venda: VendaEntity) => {
      const dataFormatada = venda.data ? new Date(venda.data).toISOString().split('T')[0] : '';
      vendaInfo.value = { ...venda, data: dataFormatada };
      modalInfo.value = true;
    };

    // Função para editar a venda
    const editarVenda = async () => {
      try {
        const { id, valor_total, valor_pago, data, metodo_pagamento, status } = vendaEdicao.value;
        vendaEdicao.value.valor_pago = vendaEdicao.value.valor_total;
        await window.api.updateVenda(id, valor_total, valor_pago, metodo_pagamento, status, new Date(data).toISOString()); // Atualiza a venda
        modalEditar.value = false; // Fecha o modal
        carregarVendas(); // Recarrega as vendas
      } catch (error) {
        console.error('Erro ao atualizar a venda:', error);
      }
    };

    // Função para excluir a venda
    const excluirVenda = async () => {
      try {
        if (vendaIdParaExcluir.value === null) return; // Verifica se o ID está definido
        excluindoVenda.value = true;
        await window.api.deleteVenda(vendaIdParaExcluir.value); // Exclui a venda
        carregarVendas(); // Recarrega as vendas
        modalConfirmacaoExclusao.value = false; // Fecha o modal após excluir
      } catch (error) {
        console.error('Erro ao excluir a venda:', error);
      } finally {
        excluindoVenda.value = false;
      }
    };

    // Formatar a data
    const formatData = (data: string) => {
      const date = new Date(data);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear().toString().slice(2);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };

    onMounted(() => {
      carregarVendas();
    });

    return {
      vendas,
      searchCliente,
      searchData,
      searchPagamento,
      modalEditar,
      vendaInfo,
      vendaEdicao,
      formIsValid,
      headers,
      metodosPagamento,
      confirmarExclusao,
      modalConfirmacaoExclusao,
      excluindoVenda,
      filteredVendas,
      openEditarVenda,
      validaData,
      editarVenda,
      excluirVenda, // Adicionando a função de excluir
      formatData,
      carregarVendas,
      openVendaInfo,
      modalInfo,
    };
  }
});
</script>

<style scoped>
.historico-container {
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
  background-color: #f8fafc;
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
