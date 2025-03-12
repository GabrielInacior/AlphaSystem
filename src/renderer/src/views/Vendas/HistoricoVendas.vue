<template>
  <v-container style="height: 90vh; width: 100%; display: flex; flex-direction: column;">
    <v-card style="height: 100%; width: 100%; display: flex; flex-direction: column;">
      <v-card-title>
        Histórico de Vendas
        <v-spacer></v-spacer>
        <v-row dense>
          <!-- Filtros existentes -->
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="searchCliente" label="Filtrar por Cliente" dense outlined color="grey"
              class="search-input" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="searchData" label="Filtrar por Data" clearable dense outlined color="grey"
              type="date" class="search-input" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select v-model="searchPagamento" :items="metodosPagamento" label="Filtrar por Método de Pagamento" dense
              outlined color="grey" class="search-input">
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
      </v-card-title>

      <v-data-table density="compact" style="height: 74%; width: 100%;" :headers="headers" :items="filteredVendas"
        class="elevation-1" items-per-page-text="Itens por página" no-data-text="Nenhum registro de venda encontrado">
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.value" class="font-weight-bold text-left">{{ header.text }}</th>
          </tr>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditarVenda(item)">mdi-pencil</v-icon> <!-- Ícone de editar -->
          <v-icon small color="red" @click="confirmarExclusao(item.id)">mdi-delete</v-icon> <!-- Ícone de excluir -->
        </template>

        <template v-slot:item.itens="{ item }">
          <td>
            <div v-for="itens in item.itens" :key="itens.produto_id || itens.servico_id">
              <span v-if="itens.produto_id">{{ itens.nome_item }} - R$ {{ itens.valor_unitario }} x {{ itens.quantidade
                }}</span>
              <span v-else>{{ itens.nome_item }} - R$ {{ itens.valor_unitario }} x {{ itens.quantidade }}</span>
            </div>
          </td>
        </template>

        <template v-slot:item.valor_total="{ item }">
          <td>
            <span>
              {{ 'R$' + item.valor_total.toFixed(2) || 'Indispónivel' }}
            </span>
          </td>
        </template>

        <template v-slot:item.data="{ item }">
          <td>{{ formatData(item.data) }}</td>
        </template>

        <template v-slot:item.status="{ item }">
          <td>
            <span>{{ item.status }}</span>
            <v-icon v-if="item.status === 'pago'" color="green">mdi-check-circle</v-icon>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalConfirmacaoExclusao" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Deseja realmente excluir esse registro de venda?</v-card-title>
        <v-card-actions>
          <v-btn @click="modalConfirmacaoExclusao = false" color="grey">Cancelar</v-btn>
          <v-btn @click="excluirVenda()" color="red" :disabled="excluindoVenda">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para editar a venda -->
    <v-dialog v-model="modalEditar" max-width="500px">
      <v-card>
        <v-card-title>Editar Venda</v-card-title>
        <v-card-text>
          <v-form ref="formEditarVenda" v-model="formIsValid">
            <v-text-field v-model="vendaEdicao.valor_pago" label="Valor Pago" type="number" required prefix="R$"
              :rules="[(v) => v > 0 || 'Valor deve ser maior que zero']" />
            <v-select v-model="vendaEdicao.metodo_pagamento" :items="metodosPagamento" label="Método de Pagamento"
              required />
            <v-select v-model="vendaEdicao.status" :items="['pago', 'pendente']" label="Status" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalEditar = false">Cancelar</v-btn>
          <v-btn :disabled="!formIsValid" @click="editarVenda">Salvar</v-btn>
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
    const searchCliente = ref(''); // Filtro de busca por nome de cliente
    const searchData = ref(''); // Filtro de busca por data
    const searchPagamento = ref(''); // Filtro de busca por método de pagamento
    const modalOpen = ref(false); // Controle do modal
    const excluindoVenda = ref(false);
    const modalConfirmacaoExclusao = ref(false);
    const modalEditar = ref(false); // Modal de edição
    const formIsValid = ref(false); // Validação do formulário de edição
    const vendaIdParaExcluir = ref<number | null>(null);
    const vendaSelecionada = ref<VendaEntity | null>(null); // Venda selecionada para detalhes
    const vendaEdicao = ref<any>({}); // Venda para edição

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
          ? formatData(venda.data).includes(searchData.value)
          : true;

        const filtroPagamento = searchPagamento.value
          ? venda.metodo_pagamento?.toLowerCase().includes(searchPagamento.value.toLowerCase())
          : true;

        return filtroCliente && filtroData && filtroPagamento;
      })
    );

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
      vendaEdicao.value = { ...venda }; // Preenche os campos com os dados da venda
      modalEditar.value = true;
    };

    // Função para editar a venda
    const editarVenda = async () => {
      try {
        const { id, valor_pago, metodo_pagamento, status } = vendaEdicao.value;
        await window.api.updateVenda(id, valor_pago, metodo_pagamento, status); // Atualiza a venda
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
      vendaEdicao,
      formIsValid,
      headers,
      metodosPagamento,
      confirmarExclusao,
      modalConfirmacaoExclusao,
      excluindoVenda,
      filteredVendas,
      openEditarVenda,
      editarVenda,
      excluirVenda, // Adicionando a função de excluir
      formatData,
      carregarVendas,
    };
  }
});
</script>

<style scoped></style>
