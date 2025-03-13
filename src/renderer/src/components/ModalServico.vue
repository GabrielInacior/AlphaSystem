<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title>Adicionar Serviço</v-card-title>
      <v-card-text>
        <v-text-field density="compact" v-model="servico.nome" label="Nome" required :rules="[val => !!val || 'Nome é obrigatório']"
          :error-messages="nomeError"></v-text-field>

        <!-- Preço (R$) -->
        <v-number-input density="compact" v-model="servico.preco" label="Preço (R$)" required :min="0"
          :rules="[val => !!val || 'Preço é obrigatório']" :error-messages="precoError" prefix="R$" :precision="2"
          control-variant="stacked"></v-number-input>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeModal">Fechar</v-btn>
        <v-btn color="primary" :disabled="isSaveDisabled" @click="saveServico">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { ServicoEntity } from '@renderer/entities/ServicoEntity';

export default defineComponent({
  name: 'ModalServico',
  props: {
    isOpen: Boolean,
  },
  setup(props, { emit }) {
    const servico = ref<ServicoEntity>(new ServicoEntity({ nome: '', preco: 0}));
    const nomeError = ref<string | null>(null);
    const precoError = ref<string | null>(null);

    const saveServico = async () => {
      // Validação
      if (!servico.value.nome) {
        nomeError.value = 'Nome é obrigatório';
        return;
      } else {
        nomeError.value = null;
      }

      if (!servico.value.preco) {
        precoError.value = 'Preço é obrigatório';
        return;
      } else {
        precoError.value = null;
      }

      await window.api.createServico(servico.value.nome, servico.value.preco);
      emit('sucesso');
      closeModal();
    };


    const isSaveDisabled = computed(() => {
      return !servico.value.nome || !servico.value.preco;
    })


    const closeModal = () => {
      emit('close');
    }

    watch(() => props.isOpen, (val) => {
      if (!val) {
        servico.value = new ServicoEntity({ nome: '', preco: 0});
      }
    });

    return {
      closeModal,
      servico,
      nomeError,
      precoError,
      saveServico,
      isSaveDisabled,
    };
  },
});
</script>
