<template>
  <v-container style="height: 90vh; width: 100%;">
    <v-card style="height: 100%; width: 100%;" elevation="10">
      <v-card-title>
        Produtos
        <v-spacer></v-spacer>
        <!-- Filtro de busca -->
        <v-row density="compact">
          <v-col cols="12" sm="6" md="4">
            <v-text-field density="compact" v-model="search" label="Buscar produto" dense outlined
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
          <v-text-field density="compact" v-model="produto.nome" label="Nome do Produto" required
            :error-messages="nomeError"></v-text-field>

          <v-text-field density="compact" v-model="produto.custo" label="Custo de Compra" required type="number" prefix="R$"
            :error-messages="custoError"></v-text-field>

          <v-text-field density="compact" v-model="produto.preco" label="Preço de Venda" required type="number" prefix="R$"
            :error-messages="precoError"></v-text-field>

          <v-select density="compact" v-model="produto.categoria_id" label="Categoria" :items="categorias"
            item-title="nome" item-value="id" :error-messages="categoriaError" required></v-select>

          <v-number-input
            density="compact"
            v-model="produto.qtdEstoque"
            label="Quantidade em Estoque"
            required
            :min="0"
            :rules="[val => val >= 0 || 'Quantidade deve ser maior ou igual a zero']"
            :error-messages="estoqueError"
            suffix="UN"
            :precision="0"
            control-variant="stacked"
          ></v-number-input>
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
    const produto = ref({
      id: null,
      nome: '',
      custo: 0,
      preco: 0,
      qtdEstoque: 0,
      categoria_id: null,
    });
    const produtoIdParaExcluir = ref<number | null>(null);

    // Erros
    const nomeError = ref<string | null>(null);
    const custoError = ref<string | null>(null);
    const precoError = ref<string | null>(null);
    const estoqueError = ref<string | null>(null);

    const categorias = ref<any[]>([]);
    const categoriaError = ref<string | null>(null);

    const confirmarExclusao = (id: number) => {
      produtoIdParaExcluir.value = id; // Guarda o ID do produto para exclusão
      modalConfirmacaoExclusao.value = true; // Abre o modal de confirmação
    };

    const headers = [
      { text: 'Nome', value: 'nome' },
      { text: 'Categoria', value: 'categoria_nome' },
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

    const loadCategorias = async () => {
      try {
        categorias.value = await window.api.getAllCategorias();
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        showSnackbar('Erro ao carregar categorias', 'error');
      }
    };

    const showSnackbar = (text: string, color: string = 'success') => {
      // Implementação básica de notificação
      console.log(`${color}: ${text}`);
      // Se você tiver um sistema de notificações, pode implementá-lo aqui
    };

    const openModal = (item: any) => {
      if (item) {
        produto.value = { ...item };
      } else {
        produto.value = {
          id: null,
          nome: '',
          custo: 0,
          preco: 0,
          qtdEstoque: 0,
          categoria_id: null,
        };
      }
      modalOpen.value = true;
    };

    const saveProduto = async () => {
      if (!produto.value.nome) {
        nomeError.value = 'Nome é obrigatório';
        return;
      }
      if (produto.value.custo <= 0) {
        custoError.value = 'Custo deve ser maior que zero';
        return;
      }
      if (produto.value.preco <= 0) {
        precoError.value = 'Preço deve ser maior que zero';
        return;
      }
      if (produto.value.qtdEstoque < 0) {
        estoqueError.value = 'Quantidade deve ser maior ou igual a zero';
        return;
      }
      if (!produto.value.categoria_id) {
        categoriaError.value = 'Categoria é obrigatória';
        return;
      }

      try {
        if (produto.value.id) {
          await window.api.updateProduto(
            produto.value.id,
            produto.value.nome,
            produto.value.custo,
            produto.value.preco,
            produto.value.qtdEstoque,
            produto.value.categoria_id
          );
        } else {
          await window.api.createProduto(
            produto.value.nome,
            produto.value.custo,
            produto.value.preco,
            produto.value.qtdEstoque,
            produto.value.categoria_id
          );
        }
        await loadProdutos();
        modalOpen.value = false;
      } catch (error) {
        console.error('Erro ao salvar produto:', error);
      }
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
      return !produto.value.nome || produto.value.custo === null || produto.value.preco === null || produto.value.qtdEstoque === null || produto.value.categoria_id === null;
    });

    const validateForm = () => {
      let isValid = true;
      nomeError.value = null;
      precoError.value = null;
      estoqueError.value = null;
      categoriaError.value = null;

      if (!produto.value.nome.trim()) {
        nomeError.value = 'Nome é obrigatório';
        isValid = false;
      }

      if (!produto.value.preco || produto.value.preco <= 0) {
        precoError.value = 'Preço deve ser maior que zero';
        isValid = false;
      }

      if (!produto.value.categoria_id) {
        categoriaError.value = 'Categoria é obrigatória';
        isValid = false;
      }

      if (produto.value.qtdEstoque < 0) {
        estoqueError.value = 'Quantidade não pode ser negativa';
        isValid = false;
      }

      return isValid;
    };

    onMounted(async () => {
      await Promise.all([
        loadProdutos(),
        loadCategorias()
      ]);
    });

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
      categorias,
      categoriaError,
      isSaveDisabled,
      validateForm
    };
  }
});
</script>

<style scoped>
.filter-input {
  max-width: 300px;
}
</style>
