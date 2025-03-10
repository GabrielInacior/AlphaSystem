<template>
  <v-container>
    <v-card>
      <v-card-title>
        Produtos
        <v-spacer></v-spacer>
        <v-text-field v-model="search" label="Buscar produto" clearable dense></v-text-field>
        <v-btn color="primary" @click="openModal(null)">Novo Produto</v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredProdutos"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteProduto(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingProduto ? 'Editar Produto' : 'Novo Produto' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="produto.nome" label="Nome" required></v-text-field>
          <v-text-field v-model="produto.custo" label="Custo" type="number" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveProduto">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'ProdutoView',
  setup() {
    const produtos = ref<any[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingProduto = ref<any | null>(null);
    const produto = ref({ nome: '', custo: 0 });

    const headers = [
      { text: 'Nome', value: 'nome' },
      { text: 'Custo', value: 'custo' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const filteredProdutos = computed(() =>
      produtos.value.filter(p => p.nome.toLowerCase().includes(search.value.toLowerCase()))
    );

    const loadProdutos = async () => {
      produtos.value = await window.api.getAllProdutos();
    };

    const openModal = (editItem: any) => {
      editingProduto.value = editItem;
      produto.value = editItem ? { ...editItem } : { nome: '', custo: 0 };
      modalOpen.value = true;
    };

    const saveProduto = async () => {
      if (editingProduto.value) {
        await window.api.updateProduto(editingProduto.value.id, produto.value.nome, produto.value.custo);
      } else {
        await window.api.createProduto(produto.value.nome, produto.value.custo);
      }
      modalOpen.value = false;
      loadProdutos();
    };

    const deleteProduto = async (id: number) => {
      await window.api.deleteProduto(id);
      loadProdutos();
    };

    onMounted(loadProdutos);

    return {
      produtos,
      search,
      modalOpen,
      editingProduto,
      produto,
      headers,
      filteredProdutos,
      openModal,
      saveProduto,
      deleteProduto
    };
  }
});
</script>
