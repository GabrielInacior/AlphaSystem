<template>
  <v-container fluid class="vendas-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Nova Venda
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Registre produtos e serviços vendidos
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-icon size="36" color="white">mdi-cash-register</v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Produtos e Serviços -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="selection-card" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-cart</v-icon>
              <span class="text-h6 font-weight-medium">Selecionar Produtos e Serviços</span>
            </div>
            <v-btn
              color="primary"
              variant="tonal"
              @click="expanded = expanded.length ? [] : [0]"
              class="toggle-btn"
            >
              <v-icon>{{ expanded.length ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              {{ expanded.length ? 'Recolher' : 'Expandir' }}
            </v-btn>
          </v-card-title>
          <v-expand-transition>
            <div v-show="expanded.length">
              <v-divider />
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" md="6" class="pr-2">
                    <v-card class="product-card h-100" elevation="0">
                      <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
                          <span class="text-subtitle-1 font-weight-medium">Produtos</span>
                        </div>
                        <v-btn
                          color="primary"
                          size="small"
                          @click="openModalProduto"
                          class="add-btn"
                        >
                          <v-icon size="small" class="mr-1">mdi-plus</v-icon>
                          Novo Produto
                        </v-btn>
                      </v-card-title>
                      <v-divider />
                      <v-card-text class="pa-4">
                        <v-text-field
                          v-model="filtroProduto"
                          label="Buscar Produto"
                          prepend-inner-icon="mdi-magnify"
                          density="compact"
                          variant="outlined"
                          hide-details
                          class="search-field mb-4"
                        />
                        <v-list class="product-list" style="max-height: 300px; overflow-y: auto;">
                          <v-list-item
                            v-for="produto in produtosFiltrados"
                            :key="produto.id"
                            @click="adicionarProduto(produto)"
                            class="mb-2 rounded-lg"
                            :class="{
                              'bg-primary-lighten-5': itensVenda.some(item => item.id === produto.id && item.tipo === 'produto'),
                              'estoque-insuficiente': produto.qtdEstoque === 0
                            }"
                          >
                            <template v-slot:prepend>
                              <v-avatar color="primary" size="40">
                                <span class="text-h6 text-white">{{ produto.nome.charAt(0) }}</span>
                              </v-avatar>
                            </template>
                            <v-list-item-title class="font-weight-medium">{{ produto.nome }}</v-list-item-title>
                            <v-list-item-subtitle class="d-flex align-center justify-space-between">
                              <span :class="{ 'text-error': produto.qtdEstoque === 0 }">
                                <v-icon size="small" :color="produto.qtdEstoque === 0 ? 'error' : 'success'" class="mr-1">
                                  {{ produto.qtdEstoque === 0 ? 'mdi-alert-circle' : 'mdi-check-circle' }}
                                </v-icon>
                                {{ produto.qtdEstoque }} em estoque
                              </span>
                              <span class="text-primary font-weight-bold">R$ {{ produto.preco.toFixed(2) }}</span>
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-alert
                            v-if="produtosFiltrados.length === 0"
                            type="info"
                            variant="tonal"
                            class="mt-4"
                            icon="mdi-information"
                          >
                            Nenhum produto encontrado
                          </v-alert>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6" class="pl-2">
                    <v-card class="service-card h-100" elevation="0">
                      <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
                        <div class="d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-tools</v-icon>
                          <span class="text-subtitle-1 font-weight-medium">Serviços</span>
                        </div>
                        <v-btn
                          color="primary"
                          size="small"
                          @click="openModalServico"
                          class="add-btn"
                        >
                          <v-icon size="small" class="mr-1">mdi-plus</v-icon>
                          Novo Serviço
                        </v-btn>
                      </v-card-title>
                      <v-divider />
                      <v-card-text class="pa-4">
                        <v-text-field
                          v-model="filtroServico"
                          label="Buscar Serviço"
                          prepend-inner-icon="mdi-magnify"
                          density="compact"
                          variant="outlined"
                          hide-details
                          class="search-field mb-4"
                        />
                        <v-list class="service-list" style="max-height: 300px; overflow-y: auto;">
                          <v-list-item
                            v-for="servico in servicosFiltrados"
                            :key="servico.id"
                            @click="adicionarServico(servico)"
                            class="mb-2 rounded-lg"
                            :class="{'bg-primary-lighten-5': itensVenda.some(item => item.id === servico.id && item.tipo === 'servico')}"
                          >
                            <template v-slot:prepend>
                              <v-avatar color="primary" size="40">
                                <span class="text-h6 text-white">{{ servico.nome.charAt(0) }}</span>
                              </v-avatar>
                            </template>
                            <v-list-item-title class="font-weight-medium">{{ servico.nome }}</v-list-item-title>
                            <v-list-item-subtitle class="d-flex align-center justify-space-between">
                              <span>
                                <v-icon size="small" color="success" class="mr-1">mdi-check-circle</v-icon>
                                Disponível
                              </span>
                              <span class="text-primary font-weight-bold">R$ {{ servico.preco.toFixed(2) }}</span>
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-alert
                            v-if="servicosFiltrados.length === 0"
                            type="info"
                            variant="tonal"
                            class="mt-4"
                            icon="mdi-information"
                          >
                            Nenhum serviço encontrado
                          </v-alert>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resumo da Venda -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="summary-card" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-cart-check</v-icon>
              <span class="text-h6 font-weight-medium">Resumo da Venda</span>
            </div>
            <v-chip
              v-if="itensVenda.length > 0"
              color="success"
              class="font-weight-bold"
            >
              {{ itensVenda.length }} {{ itensVenda.length === 1 ? 'item' : 'itens' }}
            </v-chip>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="clienteSelecionado"
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
              </v-col>
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-btn
                  color="primary"
                  @click="openModalCliente"
                  class="add-client-btn"
                >
                  <v-icon class="mr-2">mdi-plus</v-icon>
                  Cadastrar Novo Cliente
                </v-btn>
              </v-col>
            </v-row>

            <!-- Lista de Itens -->
            <v-card class="items-card mt-4" elevation="0">
              <v-card-title class="d-flex align-center py-3 px-4">
                <v-icon color="primary" class="mr-2">mdi-list-status</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Itens da Venda</span>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-0">
                <v-table class="items-table">
                  <thead>
                    <tr>
                      <th class="text-left">Item</th>
                      <th class="text-center">Tipo</th>
                      <th class="text-center">Qtd</th>
                      <th class="text-right">Preço Unit.</th>
                      <th class="text-right">Total</th>
                      <th class="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in itensVenda" :key="index" :class="{'bg-primary-lighten-5': index % 2 === 0}">
                      <td>
                        <div class="d-flex align-center">
                          <v-avatar :color="item.tipo === 'produto' ? 'primary' : 'success'" size="32" class="mr-3">
                            <span class="text-caption text-white">{{ item.nome.charAt(0) }}</span>
                          </v-avatar>
                          <span class="font-weight-medium text-truncate" style="max-width: 120px;" :title="item.nome">{{ item.nome }}</span>
                        </div>
                      </td>
                      <td class="text-center">
                        <v-chip
                          :color="item.tipo === 'produto' ? 'primary' : 'success'"
                          size="small"
                          variant="tonal"
                        >
                          {{ item.tipo === 'produto' ? 'Produto' : 'Serviço' }}
                        </v-chip>
                      </td>
                      <td class="text-center">
                        <div class="d-flex align-center justify-center">
                          <v-btn
                            icon="mdi-minus"
                            size="small"
                            variant="text"
                            @click="alterarQuantidade(item, -1)"
                            :disabled="item.quantidade <= 1"
                            class="quantity-btn"
                          />
                          <span class="mx-2 font-weight-medium">{{ item.quantidade }}</span>
                          <v-btn
                            icon="mdi-plus"
                            size="small"
                            variant="text"
                            @click="alterarQuantidade(item, 1)"
                            class="quantity-btn"
                          />
                        </div>
                      </td>
                      <td class="text-right">R$ {{ item.preco.toFixed(2) }}</td>
                      <td class="text-right font-weight-bold">R$ {{ (item.preco * item.quantidade).toFixed(2) }}</td>
                      <td class="text-center">
                        <v-btn
                          icon="mdi-delete"
                          size="small"
                          color="error"
                          variant="text"
                          @click="removerItemVenda(item)"
                        />
                      </td>
                    </tr>
                    <tr v-if="itensVenda.length === 0">
                      <td colspan="6" class="text-center py-4">
                        <v-icon color="grey" size="48" class="mb-2">mdi-cart-off</v-icon>
                        <div class="text-subtitle-1 text-grey">Nenhum item adicionado à venda</div>
                        <div class="text-caption text-grey">Selecione produtos ou serviços acima</div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>

            <!-- Informações de Pagamento -->
            <v-card class="payment-card mt-6" elevation="0">
              <v-card-title class="d-flex align-center py-3 px-4">
                <v-icon color="primary" class="mr-2">mdi-credit-card</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Informações de Pagamento</span>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-number-input
                      v-model="valorPago"
                      label="Valor Pago"
                      prefix="R$"
                      :precision="2"
                      :min="0"
                      :max="totalVenda"
                      density="compact"
                      variant="outlined"
                      hide-details
                      class="mb-4"
                      prepend-inner-icon="mdi-cash"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="metodoPagamento"
                      :items="metodosPagamento"
                      label="Forma de Pagamento"
                      density="compact"
                      variant="outlined"
                      hide-details
                      class="mb-4"
                      prepend-inner-icon="mdi-credit-card"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex align-center">
                    <v-btn
                      color="success"
                      variant="tonal"
                      @click="pagarDeUmaVez"
                      :disabled="itensVenda.length === 0"
                      class="fill-btn"
                    >
                      <v-icon class="mr-2">mdi-cash-multiple</v-icon>
                      Preencher Valor Total
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-number-input
                      v-model="desconto"
                      label="Desconto"
                      prefix="R$"
                      :precision="2"
                      :min="0"
                      :max="totalVenda"
                      density="compact"
                      variant="outlined"
                      hide-details
                      class="mb-4"
                      prepend-inner-icon="mdi-percent"
                      @update:model-value="calcularTotalComDesconto"
                    />
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="32" class="mr-4">mdi-cart-check</v-icon>
                    <span class="text-h6 font-weight-bold">Total da Venda</span>
                  </div>
                  <div class="text-right">
                    <div v-if="desconto > 0" class="text-caption text-medium-emphasis text-decoration-line-through">
                      R$ {{ formatarValor(totalVenda) }}
                    </div>
                    <span class="text-h4 font-weight-bold" :class="{'text-success': desconto > 0, 'text-primary': desconto === 0}">
                      R$ {{ formatarValor(totalComDesconto) }}
                    </span>
                    <div v-if="desconto > 0" class="text-caption text-success">
                      Desconto: R$ {{ formatarValor(desconto) }}
                    </div>
                  </div>
                </div>

                <div v-if="valorPago < totalComDesconto" class="mt-4">
                  <v-alert
                    type="warning"
                    variant="tonal"
                    icon="mdi-alert-circle"
                    class="mb-4"
                  >
                    <div class="d-flex align-center justify-space-between">
                      <span>Valor pendente (Fiado):</span>
                      <span class="font-weight-bold">R$ {{ formatarValor(totalComDesconto - valorPago) }}</span>
                    </div>
                  </v-alert>
                </div>

                <div class="d-flex justify-space-between align-center mt-6">
                  <v-alert
                    v-if="itensVenda.length > 0 && !clienteSelecionado"
                    type="error"
                    variant="tonal"
                    icon="mdi-alert-circle"
                    density="compact"
                    class="mb-0"
                    style="max-width: 400px;"
                  >
                    Selecione um cliente para finalizar a venda
                  </v-alert>
                  <v-spacer v-else></v-spacer>
                  <v-btn
                    @click="finalizarVenda"
                    variant="flat"
                    :color="valorPago < totalComDesconto ? 'warning' : 'primary'"
                    size="large"
                    :disabled="!clienteSelecionado || itensVenda.length === 0"
                    class="finish-btn"
                  >
                    <v-icon class="mr-2">{{ valorPago < totalComDesconto ? 'mdi-alert' : 'mdi-check' }}</v-icon>
                    {{ valorPago < totalComDesconto ? 'Finalizar Venda a Fiado' : 'Finalizar Venda' }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modais -->
    <v-dialog v-model="modalConfirmacaoFiado" max-width="500px">
      <v-card class="fiado-dialog">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="warning" size="32" class="mr-4">mdi-alert</v-icon>
          <span class="text-h6 font-weight-bold">Atenção!</span>
        </v-card-title>
        <v-card-text class="pa-6">
          <div class="text-body-1 mb-4">
            O valor pago é menor que o valor total da venda. Esse registro será salvo como uma venda pendente (Fiado).
          </div>
          <div class="d-flex align-center mb-4">
            <v-icon color="error" class="mr-2">mdi-cash-minus</v-icon>
            <span class="text-subtitle-1">Valor pendente: <strong class="text-error">R$ {{ (totalComDesconto - valorPago).toFixed(2) }}</strong></span>
          </div>
          <div class="text-body-2 text-grey">
            Deseja continuar com a venda pendente?
          </div>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            @click="closeModalFiado"
            variant="outlined"
            color="grey"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            @click="confirmarFiado"
            color="error"
            variant="flat"
          >
            Finalizar Venda Pendente
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showModalSucesso" max-width="400px">
      <v-card class="success-dialog">
        <v-card-text class="pa-6 text-center">
          <v-icon color="success" size="64" class="mb-4">mdi-check-circle</v-icon>
          <h2 class="text-h5 font-weight-bold mb-2">Venda Finalizada com Sucesso!</h2>
          <p class="text-body-1 text-grey">
            A venda foi registrada no sistema.
          </p>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0 justify-center">
          <v-btn
            color="primary"
            variant="flat"
            @click="closeModalSucesso"
            class="px-6"
          >
            Fechar
          </v-btn>
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
    const desconto = ref(0);
    const totalComDesconto = ref(0);
    const metodosPagamento = ['Cartão', 'Dinheiro', 'PIX'];
    const filtroProduto = ref('');
    const expanded = ref([0]);
    const modalConfirmacaoFiado = ref(false);

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
      desconto.value = 0;
      totalComDesconto.value = 0;
      metodoPagamento.value = 'Cartão';
      totalVenda.value = 0;
    };

    const openModalFiado = () => {
      modalConfirmacaoFiado.value = true;
    }

    const closeModalFiado = () => {
      modalConfirmacaoFiado.value = false;
    }

    const pagarDeUmaVez = () => {
      valorPago.value = totalComDesconto.value;
    }

    const calcularTotalComDesconto = () => {
      if (desconto.value > totalVenda.value) {
        desconto.value = totalVenda.value;
      }
      totalComDesconto.value = totalVenda.value - desconto.value;

      // Se o valor pago for maior que o novo total com desconto, ajusta
      if (valorPago.value > totalComDesconto.value) {
        valorPago.value = totalComDesconto.value;
      }
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
        produtos.value = [...responseProdutos]; // Crie uma nova referência
        const responseServicos = await window.api.getAllServicos();
        servicos.value = [...responseServicos]; // Crie uma nova referência
      } catch (error) {
        console.error(error);
      }
    };

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
      if (produto.id && produtoEmEstoque(produto.id)) {
        const item = itensVenda.value.find(i => i.id === produto.id && i.tipo === 'produto');
        const estoqueDisponivel = produtoEmEstoque(produto.id);
        if (item) {
          if (item.quantidade < estoqueDisponivel) {
            item.quantidade++;
          }

        } else {
          itensVenda.value.push({ ...produto, quantidade: 1, tipo: 'produto' });
        }
        atualizarTotalVenda();
      } else {
        alert('Produto sem estoque disponível!');
      }
    };

    const adicionarServico = (servico: ServicoEntity) => {
      const itemExistente = itensVenda.value.find(item => item.id === servico.id && item.tipo === 'servico');
      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        itensVenda.value.push({
          id: servico.id,
          nome: servico.nome,
          tipo: 'servico',
          preco: servico.preco,
          quantidade: 1,
          qtdEstoque: null // ou 0 ou undefined, já que serviço não usa estoque
        });
      }
      atualizarTotalVenda();
    };

    const removerItemVenda = (item: any) => {
      itensVenda.value = itensVenda.value.filter(i => i.id !== item.id);
      atualizarTotalVenda();
    }

    const produtoEmEstoque = (produtoId: number): number => {
      const produto = produtos.value.find(p => p.id === produtoId);
      return produto ? produto.qtdEstoque : 0;
    };

    const alterarQuantidade = (item: any, valor: number) => {
      const itemIndex = itensVenda.value.findIndex(i => i.id === item.id && i.tipo === item.tipo);
      if (itemIndex !== -1) {
        const novoValor = itensVenda.value[itemIndex].quantidade + valor;
        if (novoValor >= 1) {
          itensVenda.value[itemIndex].quantidade = novoValor;
          atualizarTotalVenda();
        }
      }
    };

    const atualizarTotalVenda = () => {
      totalVenda.value = itensVenda.value.reduce((total, item) => total + (item.preco * item.quantidade), 0);
      calcularTotalComDesconto();
    }

    const formatarValor = (valor: number) => {
      return valor.toFixed(2).replace('.', ',');
    }

    const finalizarVenda = async () => {
      // Calcula o valor total com desconto para comparação
      const valorTotalComDesconto = totalVenda.value - desconto.value;

      if (valorPago.value < valorTotalComDesconto) {
        modalConfirmacaoFiado.value = true;
        return;
      }

      processarVenda();
    };

    const processarVenda = async () => {
      try {
        if (!clienteSelecionado.value) {
          alert('Selecione um cliente antes de finalizar a venda.');
          return;
        }

        const itensComValorTotal = itensVenda.value
          .map(item => {
            if (item.tipo === "produto") {
              return {
                produto_id: item.id,
                servico_id: null,
                quantidade: item.quantidade,
                nome_item: item.nome,
                valor_unitario: item.preco,
                valor_total: item.preco * item.quantidade,
              };
            } else if (item.tipo === "servico") {
              return {
                produto_id: null,
                servico_id: item.id,
                nome_item: item.nome,
                quantidade: item.quantidade,
                valor_unitario: item.preco,
                valor_total: item.preco * item.quantidade,
              };
            }
            return null;
          })
          .filter(Boolean);

        atualizarTotalVenda();

        // Calcula o valor total final (já com desconto)
        const valorTotalComDesconto = totalVenda.value - desconto.value;

        const venda: VendaEntity = {
          id: 0,
          cliente_id: clienteSelecionado.value,
          nome_cliente: "",
          metodo_pagamento: metodoPagamento.value,
          status: valorPago.value >= valorTotalComDesconto ? "pago" : "pendente",
          valor_pago: valorPago.value,
          valor_total: valorTotalComDesconto, // Valor total já com desconto
          desconto: desconto.value,
          data: new Date().toISOString(),
          itens: itensComValorTotal as any,
        };

        await window.api.createVenda(
          venda.cliente_id,
          venda.valor_total, // Valor total já com desconto
          venda.valor_pago,
          venda.metodo_pagamento,
          venda.status,
          venda.data,
          venda.itens,
          venda.desconto
        );

        resetarVenda();
        carregarProdutosServicos();
        carregarClientes();
        showModalSucesso.value = true;
      } catch (error) {
        console.error('Erro ao finalizar venda:', error);
      }
    };

    const confirmarFiado = () => {
      modalConfirmacaoFiado.value = false;
      processarVenda();
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
      totalComDesconto,
      desconto,
      clienteSelecionado,
      metodosPagamento,
      metodoPagamento,
      valorPago,
      pagarDeUmaVez,
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
      modalConfirmacaoFiado,
      closeModalFiado,
      openModalFiado,
      calcularTotalComDesconto,
      confirmarFiado,
    };
  }
});
</script>

<style scoped>
.vendas-container {
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

.selection-card, .summary-card {
  border-radius: 16px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.selection-card:hover, .summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06);
}

.product-card, .service-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover, .service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
}

.product-card .v-card-text, .service-card .v-card-text {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-list, .service-list {
  flex-grow: 1;
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
  min-height: 200px;
}

.v-list-item {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.v-list-item:hover {
  background-color: rgba(99, 102, 241, 0.05);
  border-color: rgba(99, 102, 241, 0.1);
  transform: translateX(4px);
}

.estoque-insuficiente {
  background-color: rgba(255, 0, 0, 0.05);
  border-color: rgba(255, 0, 0, 0.1);
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

.quantity-btn {
  min-width: 32px;
  height: 32px;
}

.items-table {
  border-radius: 8px;
  overflow: hidden;
}

.finish-btn {
  min-width: 200px;
}

.fiado-dialog, .success-dialog {
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
:deep(.v-list-item) {
  min-height: 64px;
  padding: 8px 16px;
}

:deep(.v-list-item--active) {
  background: transparent;
}

:deep(.v-card-title) {
  font-size: 1.25rem;
}

:deep(.v-select .v-field) {
  border-radius: 8px;
}

:deep(.v-alert) {
  border-radius: 8px;
}

:deep(.v-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-table th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

:deep(.v-table td) {
  padding: 12px 16px;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
}

.payment-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.payment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments for side-by-side layout */
@media (min-width: 960px) {
  .product-card, .service-card {
    height: 100%;
  }

  .product-list, .service-list {
    max-height: 400px;
  }
}
</style>
