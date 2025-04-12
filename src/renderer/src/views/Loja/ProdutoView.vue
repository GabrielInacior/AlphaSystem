<template>
  <v-container fluid class="produto-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
        Produtos
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Gerencie o estoque e os produtos da loja
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
              <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
              <span class="text-h6 font-weight-medium">Lista de Produtos</span>
            </div>
            <v-btn
              color="primary"
              @click="openModal(null)"
              class="add-btn"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Novo Produto
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <!-- Estatísticas de Estoque -->
            <v-row class="mb-2">
              <v-col cols="12" sm="6" md="3">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center justify-space-between py-3 px-4">
                    <div class="d-flex align-center">
                      <v-icon color="info" size="32" class="mr-3">mdi-package-variant-closed</v-icon>
                      <div>
                        <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
                          Total em Estoque
                          <v-tooltip location="top" text="Quantidade total de produtos disponíveis para venda em seu estoque">
                            <template v-slot:activator="{ props }">
                              <v-icon size="small" class="ml-1" v-bind="props">mdi-information</v-icon>
                            </template>
                          </v-tooltip>
                        </div>
                        <div class="text-h5 font-weight-bold">{{ totalProdutosEmEstoque }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center justify-space-between py-3 px-4">
                    <div class="d-flex align-center">
                      <v-icon color="error" size="32" class="mr-3">mdi-currency-usd</v-icon>
                      <div>
                        <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
                          Custo Total
                          <v-tooltip location="top" text="Valor total investido em todos os produtos do seu estoque">
                            <template v-slot:activator="{ props }">
                              <v-icon size="small" class="ml-1" v-bind="props">mdi-information</v-icon>
                            </template>
                          </v-tooltip>
                        </div>
                        <div class="text-h5 font-weight-bold text-error">R$ {{ custoTotalEstoque.toFixed(2) }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center justify-space-between py-3 px-4">
                    <div class="d-flex align-center">
                      <v-icon color="success" size="32" class="mr-3">mdi-chart-line</v-icon>
                      <div>
                        <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
                          Ganho Potencial
                          <v-tooltip location="top" text="Lucro que você pode obter se vender todo o estoque atual (diferença entre preço de venda e custo)">
                            <template v-slot:activator="{ props }">
                              <v-icon size="small" class="ml-1" v-bind="props">mdi-information</v-icon>
                            </template>
                          </v-tooltip>
                        </div>
                        <div class="text-h5 font-weight-bold text-success">R$ {{ ganhoPotencial.toFixed(2) }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center justify-space-between py-3 px-4">
                    <div class="d-flex align-center">
                      <v-icon color="warning" size="32" class="mr-3">mdi-alert</v-icon>
                      <div>
                        <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
                          Produtos com Estoque Baixo
                          <v-tooltip location="top" text="Quantidade de produtos com menos de 5 unidades em estoque, indicando necessidade de reposição">
                            <template v-slot:activator="{ props }">
                              <v-icon size="small" class="ml-1" v-bind="props">mdi-information</v-icon>
                            </template>
                          </v-tooltip>
                        </div>
                        <div class="text-h5 font-weight-bold text-warning">{{ produtosComEstoqueBaixo }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
          </v-col>
            </v-row>

            <!-- Search and Filter Section -->
            <v-row class="mb-2">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  label="Buscar produto"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  placeholder="Digite para filtrar..."
                />
          </v-col>
        </v-row>

            <!-- Data Table -->
            <v-data-table
              :headers="headers"
              :items="filteredProdutos"
              class="elevation-0 rounded-lg"
              density="comfortable"
              hover
              :no-data-text="'Nenhum produto encontrado'"
              :loading-text="'Carregando produtos...'"
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
                        v-if="header.sortable !== false"
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

        <template v-slot:item.custo="{ item }">
                <span class="font-weight-bold text-error">R$ {{ item.custo.toFixed(2) || 'Não informado' }}</span>
        </template>

        <template v-slot:item.preco="{ item }">
                <span class="font-weight-bold text-success">R$ {{ item.preco.toFixed(2) || 'Não informado' }}</span>
        </template>

        <template v-slot:item.qtdEstoque="{ item }">
                <v-chip
                  :color="item.qtdEstoque === 0 ? 'error' : item.qtdEstoque < 5 ? 'warning' : 'success'"
                  size="small"
                  class="font-weight-bold"
                >
                  {{ item.qtdEstoque }} {{ item.qtdEstoque === 1 ? 'Unidade' : 'Unidades' }}
                  <v-icon v-if="item.qtdEstoque === 0" size="small" class="ml-1">mdi-alert</v-icon>
                </v-chip>
        </template>

        <template v-slot:item.lucroPorcentagem="{ item }">
                <v-chip
                  :color="item.custo === 0 ? 'success' : item.lucroPorcentagem < 0 ? 'error' : 'primary'"
                  size="small"
                  class="font-weight-bold"
                >
                  <template v-if="item.custo === 0">
                    <v-icon size="small" class="mr-1">mdi-gift</v-icon>
                    Presente
                  </template>
                  <template v-else>
            {{
              isFinite(item.lucroPorcentagem) && item.lucroPorcentagem !== null
                ? `${item.lucroPorcentagem.toFixed(2)}%`
                : 'Indisponível'
            }}
                  </template>
                </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    color="primary"
                    variant="text"
                    @click="openModal(item)"
                    class="action-btn"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    variant="text"
                    @click="confirmarExclusao(item.id)"
                    v-if="item.id"
                    class="action-btn"
                  />
                </div>
              </template>

              <template v-slot:item.nome="{ item }">
                <div class="text-truncate" style="max-width: 120px;" :title="item.nome">
                  {{ item.nome }}
                </div>
              </template>

              <template v-slot:item.categoria_nome="{ item }">
                <div class="text-truncate" style="max-width: 120px;" :title="item.categoria_nome">
                  {{ item.categoria_nome }}
                </div>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-6">
                  <v-icon color="grey" size="48" class="mb-2">mdi-package-variant-off</v-icon>
                  <div class="text-subtitle-1 text-grey">Nenhum produto encontrado</div>
                  <div class="text-caption text-grey">Clique em "Novo Produto" para adicionar</div>
                </div>
        </template>
      </v-data-table>
          </v-card-text>
    </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Edição/Criação -->
    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon :color="editingProduto ? 'primary' : 'success'" size="32" class="mr-4">
            {{ editingProduto ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <span class="text-h6 font-weight-bold">{{ editingProduto ? 'Editar Produto' : 'Novo Produto' }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field
            v-model="produto.nome"
            label="Nome do Produto"
            prepend-inner-icon="mdi-tag"
            density="compact"
            variant="outlined"
            :error-messages="nomeError"
            class="mb-4"
            required
          />

          <v-number-input
            v-model="produto.custo"
            label="Custo de Compra"
            prepend-inner-icon="mdi-currency-usd"
            density="compact"
            variant="outlined"
            :error-messages="custoError"
            class="mb-4"
            prefix="R$"
            :min="0"
            :precision="2"
            required
          />

          <v-alert
            v-if="produto.custo === 0"
            type="info"
            variant="tonal"
            class="mb-4"
            density="compact"
            icon="mdi-gift"
          >
            Produto será registrado como presente
          </v-alert>

          <v-number-input
            v-model="produto.preco"
            label="Preço de Venda"
            prepend-inner-icon="mdi-currency-brl"
            density="compact"
            variant="outlined"
            :error-messages="precoError"
            class="mb-4"
            prefix="R$"
            :min="0"
            :precision="2"
            required
          />

          <v-select
            v-model="produto.categoria_id"
            label="Categoria"
            prepend-inner-icon="mdi-shape"
            density="compact"
            variant="outlined"
            :items="categorias"
            item-title="nome"
            item-value="id"
            :error-messages="categoriaError"
            class="mb-4"
            required
          />

          <v-number-input
            v-model="produto.qtdEstoque"
            label="Quantidade em Estoque"
            prepend-inner-icon="mdi-package-variant"
            density="compact"
            variant="outlined"
            :error-messages="estoqueError"
            class="mb-4"
            :min="0"
            :rules="[val => val >= 0 || 'Quantidade deve ser maior ou igual a zero']"
            suffix="UN"
            :precision="0"
            required
          />
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
            :disabled="isSaveDisabled"
            @click="saveProduto"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Confirmação de Exclusão -->
    <v-dialog v-model="modalConfirmacaoExclusao" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="error" size="32" class="mr-4">mdi-alert</v-icon>
          <span class="text-h6 font-weight-bold">Confirmar Exclusão</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <div class="text-body-1 mb-4">
            Tem certeza que deseja excluir este produto?
          </div>
          <div class="text-body-2 text-grey">
            Esta ação não pode ser desfeita.
          </div>
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
            :disabled="excluindoProduto"
            @click="deleteProduto"
          >
            <v-icon class="mr-2">mdi-delete</v-icon>
            Excluir
          </v-btn>
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

    const sortBy = ref([{ key: 'nome', order: 'asc' }]);
    const sortDesc = ref(false);

    const handleSort = (key: string) => {
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
      if (sortBy.value[0]?.key !== key) return 'mdi-arrow-up-down';
      return sortDesc.value ? 'mdi-arrow-down' : 'mdi-arrow-up';
    };

    const handleSortBy = (value: any) => {
      sortBy.value = value;
    };

    const handleSortDesc = (value: boolean) => {
      sortDesc.value = value;
    };

    const confirmarExclusao = (id: number) => {
      produtoIdParaExcluir.value = id; // Guarda o ID do produto para exclusão
      modalConfirmacaoExclusao.value = true; // Abre o modal de confirmação
    };

    const headers = [
      { text: 'Nome', value: 'nome', sortable: true, width: '180px' },
      { text: 'Categoria', value: 'categoria_nome', sortable: true, width: '120px' },
      { text: 'Custo de compra', value: 'custo', sortable: true, width: '120px' },
      { text: 'Preço de venda', value: 'preco', sortable: true, width: '120px' },
      { text: 'Quantidade em Estoque', value: 'qtdEstoque', sortable: true, width: '150px' },
      { text: 'Lucro (%)', value: 'lucroPorcentagem', sortable: true, width: '120px' },
      { text: 'Ações', value: 'actions', sortable: false, width: '100px' }
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
      if (produto.value.custo < 0) {
        custoError.value = 'Custo deve ser maior ou igual a zero';
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
        // Verifica se é um produto presente (custo zero)
        const isPresente = produto.value.custo === 0;

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

        // Notifica o usuário se salvou um presente
        if (isPresente) {
          // Aqui você pode adicionar uma notificação visual ou mensagem de sucesso
          console.log('Produto presente salvo');
        }
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

    const totalProdutosEmEstoque = computed(() =>
      produtos.value.reduce((total, produto) => total + produto.qtdEstoque, 0)
    );

    const custoTotalEstoque = computed(() =>
      produtos.value.reduce((total, produto) => total + produto.custo, 0)
    );

    const ganhoPotencial = computed(() => {
      // Calcula o ganho potencial (preço de venda - custo) para cada produto em estoque
      return produtos.value.reduce((total, produto) => {
        const valorVendaTotal = produto.preco * produto.qtdEstoque;
        const custoTotal = produto.custo * produto.qtdEstoque;
        return total + (valorVendaTotal - custoTotal);
      }, 0);
    });

    const produtosComEstoqueBaixo = computed(() =>
      produtos.value.filter(p => p.qtdEstoque < 5).length
    );

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
      validateForm,
      totalProdutosEmEstoque,
      custoTotalEstoque,
      ganhoPotencial,
      produtosComEstoqueBaixo,
      sortBy,
      sortDesc,
      handleSort,
      handleSortBy,
      handleSortDesc,
      getSortIcon,
    };
  }
});
</script>

<style scoped>
.produto-container {
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

.add-btn {
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.05);
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
</style>
