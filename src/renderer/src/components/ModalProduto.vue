<template>
  <v-dialog v-model="isOpen" max-width="500px" class="modal-dialog">
    <v-card class="modal-card">
      <v-card-title class="modal-title">
        <v-icon icon="mdi-package-variant-plus" class="mr-2"></v-icon>
        Adicionar Produto
      </v-card-title>
      <v-card-text class="modal-content">
        <v-text-field
          density="compact"
          v-model="produto.nome"
          label="Nome"
          required
          :rules="[val => !!val || 'Nome é obrigatório']"
          :error-messages="nomeError"
          variant="outlined"
          class="mb-4"
          prepend-inner-icon="mdi-package-variant"
        ></v-text-field>

        <v-number-input
          density="compact"
          v-model="produto.custo"
          label="Custo de compra"
          required
          :min="0"
          :rules="[val => val >= 0 || 'Custo deve ser maior ou igual a zero']"
          :error-messages="custoError"
          prefix="R$"
          :precision="2"
          control-variant="stacked"
          variant="outlined"
          class="mb-4"
          prepend-inner-icon="mdi-currency-brl"
        ></v-number-input>

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
          density="compact"
          v-model="produto.preco"
          label="Preço de venda"
          required
          :min="0"
          :rules="[val => val > 0 || 'Preço deve ser maior que zero']"
          :error-messages="precoError"
          prefix="R$"
          :precision="2"
          control-variant="stacked"
          variant="outlined"
          class="mb-4"
          prepend-inner-icon="mdi-tag"
        ></v-number-input>

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
          variant="outlined"
          class="mb-4"
          prepend-inner-icon="mdi-package"
        ></v-number-input>
      </v-card-text>
      <v-card-actions class="modal-actions">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="closeModal()"
          class="cancel-btn"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          :disabled="isSaveDisabled"
          @click="saveProduto"
          class="save-btn"
        >
          <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Notificação de sucesso para produtos presentes -->
    <v-snackbar
      v-model="showNotification"
      color="success"
      timeout="3000"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-gift" class="mr-2"></v-icon>
        {{ notificationMessage }}
      </div>
    </v-snackbar>
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

    // Notificação
    const showNotification = ref(false);
    const notificationMessage = ref('');

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

      // Verifica se é um produto presente (custo zero)
      const isPresente = produto.value.custo === 0;

      await window.api.createProduto(
        produto.value.nome,
        produto.value.custo,
        produto.value.preco,
        produto.value.qtdEstoque,
        0 // categoria_id (0 para produtos sem categoria)
      );

      // Notifica o usuário se salvou um presente
      if (isPresente) {
        notificationMessage.value = 'Produto presente salvo';
        showNotification.value = true;
        setTimeout(() => {
          showNotification.value = false;
        }, 3000);
      }

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
        showNotification.value = false;
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
      showNotification,
      notificationMessage
    };
  },
});
</script>

<style scoped>
.modal-dialog {
  border-radius: 16px;
}

.modal-card {
  border-radius: 16px;
  overflow: hidden;
}

.modal-title {
  background: var(--color-background-soft);
  padding: 16px 24px;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.modal-content {
  padding: 24px;
}

.modal-actions {
  padding: 16px 24px;
  background: var(--color-background-soft);
}

.cancel-btn {
  margin-right: 8px;
}

.save-btn {
  min-width: 100px;
}

:deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-field:hover) {
  background: var(--color-background-soft);
}

:deep(.v-field--focused) {
  background: var(--color-background-soft);
}

:deep(.v-number-input) {
  margin-bottom: 16px;
}

:deep(.v-number-input .v-field) {
  border-radius: 8px;
}

:deep(.v-number-input .v-field:hover) {
  background: var(--color-background-soft);
}

:deep(.v-number-input .v-field--focused) {
  background: var(--color-background-soft);
}
</style>
