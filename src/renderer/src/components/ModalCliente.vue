<template>
  <v-dialog v-model="isOpen" max-width="500px" class="modal-dialog">
    <v-card class="modal-card">
      <v-card-title class="modal-title">
        <v-icon icon="mdi-account-plus" class="mr-2"></v-icon>
        Novo Cliente
      </v-card-title>
      <v-card-text class="modal-content">
        <v-text-field
          density="compact"
          v-model="cliente.nome"
          label="Nome"
          :rules="[nameRule]"
          required
          variant="outlined"
          class="mb-4"
          prepend-inner-icon="mdi-account"
        ></v-text-field>
        <v-text-field
          density="compact"
          v-model="cliente.aniversario"
          label="Aniversário"
          type="date"
          required
          variant="outlined"
          class="mb-4"
          prepend-inner-icon="mdi-cake-variant"
        ></v-text-field>
        <v-text-field
          density="compact"
          v-model="cliente.telefone"
          label="Telefone"
          @input="formatTelefone"
          :rules="telefoneRules"
          variant="outlined"
          class="mb-4"
          prepend-inner-icon="mdi-phone"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="modal-actions">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="closeModal"
          class="cancel-btn"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="saveCliente"
          :disabled="!cliente.nome"
          class="save-btn"
        >
          <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ClienteEntity } from '@renderer/entities/ClienteEntity';

export default defineComponent({
  name: 'ModalCliente',
  props: {
    isOpen: Boolean
  },
  setup(props, { emit }) {
    const cliente = ref<ClienteEntity>(new ClienteEntity({ nome: '', aniversario: '', telefone: '' }));

    const nameRule = (v: string) => !!v || 'O nome é obrigatório';

    const telefoneRules = [
      (v: string) =>
        /^(\(\d{2}\)\s\d{5}-\d{4})$/.test(v) || 'Formato inválido. Exemplo: (17) 99731-2191',
      (v: string) =>
        v.replace(/\D/g, '').length >= 10 || 'Número incompleto. O telefone deve ter pelo menos 10 dígitos.'
    ];

    const formatTelefone = () => {
      if (cliente.value.telefone) {
        let telefone = cliente.value.telefone.replace(/\D/g, '');
        if (telefone.length <= 2) {
          telefone = `(${telefone}`;
        } else if (telefone.length <= 6) {
          telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
        } else {
          telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
        }
        cliente.value.telefone = telefone;
      }
    };

    const saveCliente = async () => {
      window.api.createCliente(
        cliente.value.nome,
        cliente.value.aniversario ?? '',
        cliente.value.telefone ?? ''
      );
      closeModal();
      emit('sucesso');
    };

    const closeModal = () => {
      emit('close');
    };

    watch(() => props.isOpen, (val) => {
      if (val) {
        cliente.value = new ClienteEntity({ nome: '', aniversario: '', telefone: '' });
      }
    });

    return {
      cliente,
      nameRule,
      telefoneRules,
      formatTelefone,
      saveCliente,
      closeModal,
    };
  }
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
</style>
