<template>
  <v-container style="height: 90vh; width: 100%;">
    <v-card class="elevation-2" style="height: 100%; width: 100%; border-radius: 12px;">
      <v-card-title>
        <span class="text-h6">Vendas pendentes (Fiado)</span>
        <v-spacer></v-spacer>
        <v-row dense>
          <v-col cols="12" sm="6" md="4">
            <v-text-field density="compact" v-model="searchCliente" label="Filtrar por Cliente" clearable dense outlined
              color="grey" class="search-input" />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field density="compact" v-model="searchData" label="Filtrar por Data" clearable dense outlined color="grey"
            type="date" class="search-input" />
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table density="compact" :headers="headers" :items="filteredFiados" items-per-page-text="Itens por página"
        class="fiados-table elevation-1" style="height: 74%; width: 100%;" item-value="id"
        no-data-text="Nenhuma venda pendente encontrada">
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.value" class="font-weight-bold text-left">
              {{ header.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item.status="{ item }">
          <td>
            <span :class="item.status === 'pendente' ? 'text-danger' : 'text-success'">
              {{ item.status }}
            </span>
            <v-icon v-if="item.status === 'pendente'" color="red">mdi-close-circle</v-icon>
            <v-icon v-if="item.status === 'pago'" color="green">mdi-check-circle</v-icon>
          </td>
        </template>

        <template v-slot:item.valor_total="{ item }">
          <td>
            <span>
              {{ 'R$' + item.valor_total.toFixed(2) || 'Indispónivel' }}
            </span>
          </td>
        </template>

        <template v-slot:item.divida="{ item }">
          <td>
            <span style="color: red;">
              R$ -{{ (item.valor_total - item.valor_pago).toFixed(2) || 'Indisponível' }}
            </span>
          </td>
        </template>
        <template v-slot:item.data="{ item }">
          <td>{{ formatData(item.data) }}</td>
        </template>
        <template v-slot:item.valor_pago="{ item }">
          <td>
            <span>
              {{ 'R$' + item.valor_pago.toFixed(2) || 'Indispónivel' }}
            </span>
          </td>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-row dense justify="start" align="center">
            <v-col cols="auto">
              <v-btn color="success" @click="markAsPaid(item)" v-if="item.status !== 'pago'" elevation="2"
                size="x-small" class="d-flex align-center justify-center" rounded>
                <v-icon left>mdi-check</v-icon> Alterar status
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal de Detalhes do Fiado -->
    <v-dialog v-model="modalOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Detalhes do Fiado</span>
        </v-card-title>
        <v-card-text class="mt-n4">
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Cliente: {{ fiadoSelecionado?.nome_cliente
                }}</v-list-item-title>
                <v-list-item-title>Valor total da venda: <span class="text-primary">R$ {{
                  fiadoSelecionado?.valor_total.toFixed(2) || '0.00'
                    }}</span></v-list-item-title>
                <v-list-item-title>Valor pago pelo cliente: <span style="color: red;">R$ {{
                  fiadoSelecionado?.valor_pago.toFixed(2) || '0.00'
                    }}</span></v-list-item-title>
                <v-list-item-title v-if="fiadoSelecionado?.data">Data: {{ formatData(fiadoSelecionado?.data)
                }}</v-list-item-title>
                <v-list-item-title>Método de pagamento: {{ fiadoSelecionado?.metodo_pagamento }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <!-- Seção de Dívida Atual -->
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Dívida Atual</v-list-item-title>
                <v-list-item-subtitle style="color: red;">
                  R$ {{ ((fiadoSelecionado?.valor_total ?? 0) - (fiadoSelecionado?.valor_pago ?? 0)).toFixed(2) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list dense style="max-height: 200px; overflow-y: auto;">
            <v-list-item v-for="item in fiadoSelecionado?.itens" :key="item.produto_id || item.servico_id">
              <v-list-item-content>
                <v-list-item-title>{{ item.nome_item }} - <span class="font-weight-bold">R$ {{ item.valor_unitario }} x
                    {{ item.quantidade }}</span></v-list-item-title>
              </v-list-item-content>
              <v-divider></v-divider>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-autocomplete density="compact" v-model="metodoPagamento" :items="metodosPagamento"
            label="Forma de Pagamento" prepend-inner-icon="mdi-credit-card" required outlined dense color="grey"
            class="mt-2" />

          <v-number-input density="compact" v-model="valorPago" label="Valor Pago" required :min="0"
            :max="(fiadoSelecionado?.valor_total ?? 0) - (fiadoSelecionado?.valor_pago ?? 0)" prefix="R$"
            :rules="[val => val >= 0 || 'Valor deve ser maior que zero']" :error-messages="valorPagoError"
            :precision="2" control-variant="stacked" class="mt-2">
          </v-number-input>


        </v-card-text>

        <v-card-actions class="d-flex justify-end">
          <v-btn @click="closeModal" class="mr-2" outlined color="grey darken-1">Fechar</v-btn>
          <v-btn @click="confirmarPagamento" color="primary">Confirmar Pagamento</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { VendaEntity } from '@renderer/entities/VendaEntity';

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
      { text: 'Cliente', value: 'nome_cliente' },
      { text: 'Valor Pago', value: 'valor_pago' },
      { text: 'Valor Total', value: 'valor_total' },
      { text: 'Dívida', value: 'divida' },
      { text: 'Tipo Pagamento', value: 'metodo_pagamento' },
      { text: 'Data', value: 'data' },
      { text: 'Status', value: 'status' },
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
      })
    );

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
          await window.api.updateVenda(item.id, item.valor_total, item.valor_pago + valorPago.value, metodoPagamento.value, 'pago', item.data);
        } else {
          // Caso contrário, apenas atualiza o valor pago
          await window.api.updateVenda(item.id, item.valor_total, item.valor_pago + valorPago.value, metodoPagamento.value, 'pendente', item.data);
        }
        loadFiados();
        modalOpen.value = false;
        resetModalFields(); // Chama a função para resetar os campos
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
    };
  }
});
</script>
