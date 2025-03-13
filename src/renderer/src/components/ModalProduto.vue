<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title>Adicionar Produto</v-card-title>
      <v-card-text>
        <v-text-field density="compact" v-model="produto.nome" label="Nome" required :rules="[val => !!val || 'Nome é obrigatório']"
          :error-messages="nomeError"></v-text-field>

        <v-number-input density="compact" v-model="produto.custo" label="Custo de compra" required :min="0"
          :rules="[val => val >= 0 || 'Custo deve ser maior ou igual a zero']" :error-messages="custoError" prefix="R$"
          :precision="2" control-variant="stacked"></v-number-input>

        <v-number-input density="compact" v-model="produto.preco" label="Preço de venda" required :min="0"
          :rules="[val => val > 0 || 'Preço deve ser maior que zero']" :error-messages="precoError" prefix="R$"
          :precision="2" control-variant="stacked"></v-number-input>

        <v-number-input density="compact" v-model="produto.qtdEstoque" label="Quantidade em Estoque" required :min="0"
          :rules="[val => val >= 0 || 'Quantidade deve ser maior ou igual a zero']" :error-messages="estoqueError"
          suffix="UN" :precision="0" control-variant="stacked"></v-number-input>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeModal()">Cancelar</v-btn>
        <v-btn color="primary" :disabled="isSaveDisabled" @click="saveProduto">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { ProdutoEntity } from '@renderer/entities/ProdutoEntity';

export default defineComponent({
  name: 'ModalProduto',
  props: {
    isOpen: Boolean
  },
  setup(props, { emit }) {
    const produto = ref<ProdutoEntity>(new ProdutoEntity({ nome: '', custo: 0, preco: 0, qtdEstoque: 0 }));
    // Erros
    const nomeError = ref<string | null>(null);
    const custoError = ref<string | null>(null);
    const precoError = ref<string | null>(null);
    const estoqueError = ref<string | null>(null);

    const saveProduto = async () => {
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

      await window.api.createProduto(
        produto.value.nome,
        produto.value.custo,
        produto.value.preco,
        produto.value.qtdEstoque
      );

      emit('sucesso');
      closeModal();
    };

    const isSaveDisabled = computed(() => {
      return !produto.value.nome ||
        produto.value.custo === null || produto.value.custo < 0 ||
        produto.value.preco === null || produto.value.preco <= 0 ||
        produto.value.qtdEstoque === null || produto.value.qtdEstoque < 0;
    });

    const closeModal = () => {
      emit('close');
    }

    watch(() => props.isOpen, (val) => {
      if (!val) {
        produto.value = new ProdutoEntity({ nome: '', custo: 0, preco: 0, qtdEstoque: 0 });
      }
    });

    return {
      produto,
      nomeError,
      estoqueError,
      precoError,
      custoError,
      isSaveDisabled,
      saveProduto,
      closeModal,
    };
  },
});
</script>
