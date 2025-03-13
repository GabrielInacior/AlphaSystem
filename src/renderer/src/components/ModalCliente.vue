<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title>
        Novo Cliente
      </v-card-title>
      <v-card-text>
        <!-- Campo Nome com validação -->
        <v-text-field density="compact" v-model="cliente.nome" label="Nome" :rules="[nameRule]" required></v-text-field>
        <v-text-field density="compact" v-model="cliente.aniversario" label="Aniversário" type="date" required></v-text-field>
        <v-text-field density="compact" v-model="cliente.telefone" label="Telefone" @input="formatTelefone"
          :rules="telefoneRules"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeModal">Cancelar</v-btn>
        <v-btn color="primary" @click="saveCliente" :disabled="!cliente.nome">Salvar</v-btn>
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
