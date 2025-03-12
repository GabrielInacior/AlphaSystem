<template>
  <v-container>
    <!-- Produtos e Serviços -->
    <v-expansion-panels v-model="expanded" class="my-3">
      <v-expansion-panel title="Nova venda">
        <v-expansion-panel-text class="pb-4" style="max-height: 450px; overflow-y: auto;">
          <v-row class="align-center search-bar" style="max-height: 200px;">
            <v-col cols="12" sm="6">
              <v-autocomplete v-model="clienteSelecionado" :items="clientes" item-title="nome" item-value="id"
                label="Cliente" prepend-inner-icon="mdi-account" required>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex align-center pa-0 pr-3">
              <v-btn color="primary" @click="openModalCliente" height="40" class="search-btn"
                style="margin-bottom: 5px;">
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="start">Cadastrar novo cliente</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="elevation-4">
            <v-col cols="12" sm="6">
              <v-card class="scroll-card elevation-0">
                <v-card-title class="text-h6">Produtos</v-card-title>
                <v-row class="align-center search-bar" style="max-height: 200px;">
                  <v-col cols="9" class="px-5 ml-2">
                    <v-text-field v-model="filtroProduto" label="Buscar Produto" prepend-inner-icon="mdi-magnify" dense
                      hide-details class="search-input" />
                  </v-col>
                  <v-col cols="auto" class="d-flex align-center pa-0 pr-3">
                    <v-btn color="primary" @click="openModalProduto" height="40" class="search-btn">
                      <v-icon>mdi-plus</v-icon>
                      <v-tooltip activator="parent" location="start">Cadastrar novo produto</v-tooltip>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-list dense class="lista-scroll" style="height: 200px; overflow-y: auto;">
                  <v-list-item v-for="produto in produtosFiltrados" :key="produto.id"
                    @click="adicionarProduto(produto)">
                    <v-list-item-title>
                      {{ produto.nome }}
                      <!-- Ícone de selecionado para produto -->
                      <v-icon v-if="itensVenda.some(item => item.id === produto.id && item.tipo === 'produto')"
                        class="ml-2" color="primary">
                        mdi-plus
                      </v-icon>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-right">R$ {{ produto.preco.toFixed(2) }}</v-list-item-subtitle>
                    <v-divider></v-divider>
                  </v-list-item>

                </v-list>
              </v-card>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col cols="12" sm="6">
              <v-card class="scroll-card elevation-0">
                <v-card-title class="text-h6">Serviços</v-card-title>
                <v-row class="align-center search-bar" style="max-height: 200px;">
                  <v-col cols="9" class="px-5 ml-2">
                    <v-text-field v-model="filtroServico" label="Buscar Serviço" prepend-inner-icon="mdi-magnify" dense
                      hide-details class="search-input" />
                  </v-col>
                  <v-col cols="auto" class="d-flex align-center pa-0 pr-3">
                    <v-btn color="primary" @click="openModalServico" height="40" class="search-btn">
                      <v-icon>mdi-plus</v-icon>
                      <v-tooltip activator="parent" location="start">Cadastrar novo serviço</v-tooltip>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-list dense class="lista-scroll" style="height: 200px; overflow-y: auto;">
                  <v-list-item v-for="servico in servicosFiltrados" :key="servico.id"
                    @click="adicionarServico(servico)">
                    <v-list-item-title>
                      {{ servico.nome }}
                      <!-- Ícone de selecionado para serviço -->
                      <v-icon v-if="itensVenda.some(item => item.id === servico.id && item.tipo === 'servico')"
                        class="ml-2" color="primary">
                        mdi-plus
                      </v-icon>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-right">R$ {{ servico.preco.toFixed(2) }}</v-list-item-subtitle>
                    <v-divider></v-divider>
                  </v-list-item>

                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Resumo da Venda -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h6">Resumo da Venda</v-card-title>
          <v-divider></v-divider>

          <!-- Lista rolável de itens -->
          <v-table dense style="max-height: 300px; overflow-y: auto;">
            <thead>
              <tr>
                <th>Produto/Serviço</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Preço Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itensVenda" :key="item.id">
                <td>{{ item.nome }}</td>
                <td>{{ item.tipo === 'produto' ? 'Produto' : 'Serviço' }}</td>
                <td class="d-flex align-center">
                  <v-btn icon size="small" @click="alterarQuantidade(item, -1)" :disabled="item.quantidade <= 1"
                    class="mr-2" variant="text">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  {{ item.quantidade }}
                  <v-btn icon size="small" @click="alterarQuantidade(item, 1)" class="ml-2" variant="text">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </td>
                <td>R$ {{ item.preco.toFixed(2) }}</td>
                <td>R$ {{ (item.preco * item.quantidade).toFixed(2) }}</td>
                <td>
                  <v-btn icon size="small" color="error" @click="removerItemVenda(item)" variant="text">
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-divider></v-divider>

          <!-- Total da Venda -->
          <v-card-text class="text-right text-h6">
            Total: <strong>R$ {{ formatarValor(totalVenda) }}</strong>
          </v-card-text>

          <!-- Informações de Pagamento -->
          <v-row class="pt-3 px-4">
            <v-col cols="12" sm="5">
              <v-number-input v-model="valorPago" label="Valor Pago" prefix="R$" :precision="2"
                hint="O valor pago pelo cliente. Se for menor que o valor total a venda  será pendente (fiado)"
                prepend-inner-icon="mdi-cash" required>
              </v-number-input>
            </v-col>

            <v-col cols="12" sm="4">
              <v-autocomplete v-model="metodoPagamento" :items="metodosPagamento" label="Forma de Pagamento"
                prepend-inner-icon="mdi-credit-card" required>
              </v-autocomplete>
            </v-col>

            <v-col cols="auto">
              <v-btn @click="finalizarVenda" variant="flat" :disabled="!clienteSelecionado || itensVenda.length === 0">
                <v-icon>mdi-check</v-icon>
                Finalizar Venda
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showModalSucesso" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Venda Finalizada com Sucesso</v-card-title>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="primary" @click="closeModalSucesso">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ModalProduto v-model="showModalProduto" @close="closeModalProduto" :isOpen="showModalProduto"
      @sucesso="carregarProdutosServicos()" />
    <ModalCliente v-model="showModalCliente" @close="closeModalCliente" :isOpen="showModalCliente"
      @sucesso="carregarClientes()" />
    <ModalServico v-model="showModalServico" @close="closeModalServico" @sucesso="carregarProdutosServicos()" />
  </v-container>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { ProdutoEntity } from '@renderer/entities/ProdutoEntity';
import { ServicoEntity } from '@renderer/entities/ServicoEntity';
import { VendaEntity } from '../../entities/VendaEntity';
import ModalProduto from '@renderer/components/ModalProduto.vue';
import ModalCliente from '@renderer/components/ModalCliente.vue';
import ModalServico from '@renderer/components/ModalServico.vue';

export default defineComponent({
  name: 'VendasView',
  components: { ModalProduto, ModalServico, ModalCliente },
  setup() {
    const clienteSelecionado = ref<number | null>(null);
    const servicos = ref<ServicoEntity[]>([]);
    const produtos = ref<ProdutoEntity[]>([]);
    const metodoPagamento = ref('Cartão');
    const valorPago = ref(0);
    const totalVenda = ref(0);
    const metodosPagamento = ['Cartão', 'Dinheiro', 'PIX'];
    const filtroProduto = ref('');
    const expanded = ref([0]);

    const filtroServico = ref('');
    const clientes = ref<{ id: number; nome: string }[]>([]);
    const itensVenda = ref<any[]>([]);
    const showModalProduto = ref(false);
    const showModalServico = ref(false);
    const showModalCliente = ref(false);

    const showModalSucesso = ref(false);

    const closeModalSucesso = () => {
      showModalSucesso.value = false;
    };

    const resetarVenda = () => {
      clienteSelecionado.value = null;
      itensVenda.value = [];
      valorPago.value = 0;
      metodoPagamento.value = 'Cartão';
      totalVenda.value = 0;
    };


    const openModalProduto = () => {
      showModalProduto.value = true;
    }

    const closeModalProduto = () => {
      showModalProduto.value = false;
    }

    const openModalServico = () => {
      showModalServico.value = true;
    }

    const closeModalServico = () => {
      showModalServico.value = false;
    }

    const openModalCliente = () => {
      showModalCliente.value = true;
    }

    const closeModalCliente = () => {
      showModalCliente.value = false;
    }

    const carregarClientes = async () => {
      try {
        const response = await window.api.getAllClientes();
        clientes.value = response;
      } catch (error) {
        console.error(error);
      }
    }

    const carregarProdutosServicos = async () => {
      try {
        const responseProdutos = await window.api.getAllProdutos();
        produtos.value = responseProdutos;
        const responseServicos = await window.api.getAllServicos();
        servicos.value = responseServicos;
      } catch (error) {
        console.error(error);
      }
    }

    onMounted(() => {
      carregarClientes();
      carregarProdutosServicos();
    });

    const produtosFiltrados = computed(() => {
      return produtos.value.filter(produto => produto.nome.toLowerCase().includes(filtroProduto.value.toLowerCase()));
    });

    const servicosFiltrados = computed(() => {
      return servicos.value.filter(servico => servico.nome.toLowerCase().includes(filtroServico.value.toLowerCase()));
    });

    const adicionarProduto = (produto: ProdutoEntity) => {
      const item = itensVenda.value.find(i => i.id === produto.id && i.tipo === 'produto');
      if (item) {
        item.quantidade++;
      } else {
        itensVenda.value.push({ ...produto, quantidade: 1, tipo: 'produto' });
      }
      atualizarTotalVenda();
    }

    const adicionarServico = (servico: ServicoEntity) => {
      const item = itensVenda.value.find(i => i.id === servico.id && i.tipo === 'servico');
      if (item) {
        item.quantidade++;
      } else {
        itensVenda.value.push({ ...servico, quantidade: 1, tipo: 'servico' });
      }
      atualizarTotalVenda();
    }

    const removerItemVenda = (item: any) => {
      itensVenda.value = itensVenda.value.filter(i => i.id !== item.id);
      atualizarTotalVenda();
    }

    const alterarQuantidade = (item: any, quantidade: number) => {
      const itemVenda = itensVenda.value.find(i => i.id === item.id);
      if (itemVenda) {
        itemVenda.quantidade += quantidade;
        if (itemVenda.quantidade <= 0) {
          itensVenda.value = itensVenda.value.filter(i => i.id !== item.id);
        }
      }
      atualizarTotalVenda();
    }

    const atualizarTotalVenda = () => {
      totalVenda.value = itensVenda.value.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    const formatarValor = (valor: number) => {
      return valor.toFixed(2).replace('.', ',');
    }

    const finalizarVenda = async () => {
      try {
        const itensComValorTotal = itensVenda.value.map(item => {
          if (item.tipo === 'produto') {
            const valorTotal = item.preco * item.quantidade;
            return {
              produto_id: item.id,
              servico_id: null,
              quantidade: item.quantidade,
              nome_item: item.nome,
              valor_unitario: item.preco,
              valor_total: valorTotal,
            };
          } else if (item.tipo === 'servico') {
            return {
              produto_id: null,
              servico_id: item.id,
              nome_item: item.nome,
              quantidade: 1,
              valor_unitario: item.preco,
              valor_total: item.preco,
            };
          }
        }).filter(Boolean);

        const venda: VendaEntity = {
          id: 0,
          cliente_id: clienteSelecionado.value!,
          nome_cliente: '',
          metodo_pagamento: metodoPagamento.value,
          status: valorPago.value >= totalVenda.value ? 'pago' : 'pendente',
          valor_pago: valorPago.value,
          valor_total: totalVenda.value,
          data: new Date().toISOString(),
          itens: itensComValorTotal,
        };

        const vendaCriada = await window.api.createVenda(
          venda.cliente_id,
          venda.valor_total,
          venda.metodo_pagamento,
          venda.status,
          venda.data,
          venda.itens
        );

        console.log('Venda finalizada com sucesso', vendaCriada);
      } catch (error) {
        console.error('Erro ao finalizar venda:', error);
      } finally {
        resetarVenda();
        showModalSucesso.value = true;
      }
    };

    return {
      filtroProduto,
      filtroServico,
      produtosFiltrados,
      servicosFiltrados,
      produtos,
      servicos,
      carregarProdutosServicos,
      carregarClientes,
      itensVenda,
      totalVenda,
      clienteSelecionado,
      metodosPagamento,
      metodoPagamento,
      valorPago,
      alterarQuantidade,
      showModalProduto,
      showModalServico,
      adicionarProduto,
      adicionarServico,
      finalizarVenda,
      formatarValor,
      expanded,
      openModalProduto,
      closeModalProduto,
      clientes,
      openModalServico,
      closeModalServico,
      removerItemVenda,
      showModalCliente,
      openModalCliente,
      showModalSucesso,
      closeModalSucesso,
      closeModalCliente,
    };
  }
});
</script>

<style scoped>
/* Adicionar estilo personalizado aqui */
</style>
