<template>
  <v-container style="height: 90vh; width: 100%;">
    <v-card style="height: 100%; width: 100%;">
      <v-card-title>
        Produtos
        <v-spacer></v-spacer>
        <!-- Filtro de busca -->
        <v-row density="compact">
          <v-col cols="12" sm="6" md="4">
            <v-text-field density="compact" v-model="search" label="Buscar produto" clearable dense outlined
              class="filter-input" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn  color="primary" @click="openModal(null)">Novo Produto</v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table density="compact" style="height: 74%; width: 100%;" :headers="headers" :items="filteredProdutos"
        class="elevation-1" items-per-page-text="Itens por página" no-data-text="Nenhum produto encontrado">
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.value" class="font-weight-bold text-left">
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template v-slot:item.custo="{ item }">
          <span>R$ {{ item.custo.toFixed(2) || 'Não informado' }}</span>
        </template>
        <template v-slot:item.preco="{ item }">
          <span>R$ {{ item.preco.toFixed(2) || 'Não informado' }}</span>
        </template>
        <template v-slot:item.qtdEstoque="{ item }">
          <span v-if="item.qtdEstoque === 0" style="color: red; font-weight: bold;">{{ item.qtdEstoque }} <v-icon
              style="font-size: 15px!important;" icon="mdi-alert"></v-icon></span>
          <span v-else>{{ item.qtdEstoque + ' Unidade(s)' || 'Não informado' }} </span>
        </template>
        <template v-slot:item.lucroPorcentagem="{ item }">
          <td :style="{ color: item.lucroPorcentagem < 0 ? 'red' : '#1976D2' }">
            {{
              isFinite(item.lucroPorcentagem) && item.lucroPorcentagem !== null
                ? `${item.lucroPorcentagem.toFixed(2)}%`
                : 'Indisponível'
            }}
          </td>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="confirmarExclusao(item.id)" v-if="item.id">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingProduto ? 'Editar Produto' : 'Novo Produto' }}
        </v-card-title>
        <v-card-text>
          <v-text-field density="compact" v-model="produto.nome" label="Nome" required
            :rules="[val => !!val || 'Nome é obrigatório']" :error-messages="nomeError"></v-text-field>

          <v-number-input density="compact" v-model="produto.custo" label="Custo de compra" required :min="0"
            :rules="[val => val >= 0 || 'Custo deve ser maior ou igual a zero']" :error-messages="custoError"
            prefix="R$" :precision="2" control-variant="stacked"></v-number-input>

          <v-number-input density="compact" v-model="produto.preco" label="Preço de venda" required :min="0"
            :rules="[val => val > 0 || 'Preço deve ser maior que zero']" :error-messages="precoError" prefix="R$"
            :precision="2" control-variant="stacked"></v-number-input>

          <v-number-input density="compact" v-model="produto.qtdEstoque" label="Quantidade em Estoque" required :min="0"
            :rules="[val => val >= 0 || 'Quantidade deve ser maior ou igual a zero']" :error-messages="estoqueError"
            suffix="UN" :precision="0" control-variant="stacked"></v-number-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" :disabled="isSaveDisabled" @click="saveProduto">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalConfirmacaoExclusao" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Deseja realmente excluir esse produto?</v-card-title>
        <v-card-actions>
          <v-btn @click="modalConfirmacaoExclusao = false" color="grey">Cancelar</v-btn>
          <v-btn @click="deleteProduto()" color="red" :disabled="excluindoProduto">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { ProdutoEntity } from '@renderer/entities/ProdutoEntity';

export default defineComponent({
  name: 'ProdutoView',
  setup() {
    const produtos = ref<ProdutoEntity[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingProduto = ref<ProdutoEntity | null>(null);
    const excluindoProduto = ref(false);
    const modalConfirmacaoExclusao = ref(false);
    const produto = ref<ProdutoEntity>(new ProdutoEntity({ nome: '', custo: 0, preco: 0, qtdEstoque: 0 }));
    const produtoIdParaExcluir = ref<number | null>(null);

    // Erros
    const nomeError = ref<string | null>(null);
    const custoError = ref<string | null>(null);
    const precoError = ref<string | null>(null);
    const estoqueError = ref<string | null>(null);

    const confirmarExclusao = (id: number) => {
      produtoIdParaExcluir.value = id; // Guarda o ID do produto para exclusão
      modalConfirmacaoExclusao.value = true; // Abre o modal de confirmação
    };

    const headers = [
      { text: 'Nome', value: 'nome' },
      { text: 'Custo de compra', value: 'custo' },
      { text: 'Preço de venda', value: 'preco' },
      { text: 'Quantidade em Estoque', value: 'qtdEstoque' },
      { text: 'Lucro (%)', value: 'lucroPorcentagem' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const filteredProdutos = computed(() =>
      produtos.value.filter(p => p.nome.toLowerCase().includes(search.value.toLowerCase()))
    );

    const loadProdutos = async () => {
      const dadosProdutos = await window.api.getAllProdutos();
      produtos.value = dadosProdutos.map((produto: any) => new ProdutoEntity(produto));
    };

    const openModal = (editItem: ProdutoEntity | null) => {
      editingProduto.value = editItem;
      produto.value = editItem ? new ProdutoEntity(editItem) : new ProdutoEntity({ nome: '', custo: 0, preco: 0, qtdEstoque: 0 });

      nomeError.value = null;
      custoError.value = null;
      precoError.value = null;
      estoqueError.value = null;

      modalOpen.value = true;
    };

    const saveProduto = async () => {
      if (produtos.value.some(p => p.nome.toLowerCase() === produto.value.nome.toLowerCase() && p.id !== editingProduto.value?.id)) {
        nomeError.value = 'Produto com esse nome já existe';
        return;
      }

      if (!produto.value.nome) {
        nomeError.value = 'Nome é obrigatório';
        return;
      } else {
        nomeError.value = null;
      }

      if (produto.value.custo === null || produto.value.custo < 0) {
        custoError.value = 'Custo deve ser maior ou igual a zero';
        return;
      } else {
        custoError.value = null;
      }

      if (produto.value.preco === null || produto.value.preco <= 0) {
        precoError.value = 'Preço deve ser maior que zero';
        return;
      } else {
        precoError.value = null;
      }

      if (produto.value.qtdEstoque === null || produto.value.qtdEstoque < 0) {
        estoqueError.value = 'Quantidade deve ser maior ou igual a zero';
        return;
      } else {
        estoqueError.value = null;
      }

      if (editingProduto.value) {
        await window.api.updateProduto(
          editingProduto.value.id || 0,
          produto.value.nome,
          produto.value.custo,
          produto.value.preco,
          produto.value.qtdEstoque
        );
      } else {
        await window.api.createProduto(
          produto.value.nome,
          produto.value.custo,
          produto.value.preco,
          produto.value.qtdEstoque
        );
      }

      modalOpen.value = false;
      await loadProdutos();
    };

    const deleteProduto = async () => {
      if (!produtoIdParaExcluir.value) return;
      excluindoProduto.value = true;
      await window.api.deleteProduto(produtoIdParaExcluir.value);
      modalConfirmacaoExclusao.value = false;
      excluindoProduto.value = false;
      await loadProdutos();
    };

    const isSaveDisabled = computed(() => {
      return !produto.value.nome || produto.value.custo === null || produto.value.preco === null || produto.value.qtdEstoque === null;
    });

    onMounted(loadProdutos);

    return {
      produtos,
      search,
      modalOpen,
      editingProduto,
      produto,
      confirmarExclusao,
      deleteProduto,
      headers,
      openModal,
      filteredProdutos,
      saveProduto,
      modalConfirmacaoExclusao,
      excluindoProduto,
      nomeError,
      custoError,
      precoError,
      estoqueError,
      isSaveDisabled
    };
  }
});
</script>

<style scoped>
.filter-input {
  max-width: 300px;
}
</style>
