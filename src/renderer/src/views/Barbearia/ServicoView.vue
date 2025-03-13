<template>
  <v-container style="height: 90vh; width: 100%;">
    <v-card style="height: 100%; width: 100%;">
      <v-card-title>
        Serviços
        <v-spacer></v-spacer>
        <!-- Filtro de busca -->
        <v-row dense>
          <v-col cols="12" sm="6" md="4">
            <v-text-field density="compact" v-model="search" label="Buscar serviço" clearable dense outlined class="filter-input" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn color="primary" @click="openModal(null)">Novo Serviço</v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table density="compact" style="height: 74%; width: 100%;" :headers="headers" :items="filteredServicos"
        class="elevation-1" items-per-page-text="Itens por página" no-data-text="Nenhum serviço encontrado">
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.value" class="font-weight-bold text-left">
              {{ header.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item.preco="{ item }">
          <span>R$ {{ item.preco.toFixed(2) }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteServico(item.id)" v-if="item.id">mdi-delete</v-icon>
        </template>
      </v-data-table>

    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingServico ? 'Editar Serviço' : 'Novo Serviço' }}
        </v-card-title>
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
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" :disabled="isSaveDisabled" @click="saveServico">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { ServicoEntity } from '@renderer/entities/ServicoEntity';

export default defineComponent({
  name: 'ServicoView',
  setup() {
    const servicos = ref<ServicoEntity[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingServico = ref<ServicoEntity | null>(null);
    const servico = ref<ServicoEntity>(new ServicoEntity({ nome: '', preco: 0,}));

    // Erros
    const nomeError = ref<string | null>(null);
    const precoError = ref<string | null>(null);

    const headers = [
      { text: 'Nome', value: 'nome' },
      { text: 'Preço', value: 'preco' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const filteredServicos = computed(() =>
      servicos.value.filter(s => s.nome.toLowerCase().includes(search.value.toLowerCase()))
    );

    const loadServicos = async () => {
      const dadosServicos = await window.api.getAllServicos();
      servicos.value = dadosServicos.map((servico: any) => new ServicoEntity(servico)); // Mapeia para ServicoEntity
    };

    const openModal = (editItem: ServicoEntity | null) => {
      editingServico.value = editItem;
      servico.value = editItem ? new ServicoEntity(editItem) : new ServicoEntity({ nome: '', preco: 0 });
      nomeError.value = null;
      precoError.value = null;
      modalOpen.value = true;
    };

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


      if (editingServico.value) {
        await window.api.updateServico(editingServico.value.id || 0, servico.value.nome, servico.value.preco);
      } else {
        await window.api.createServico(servico.value.nome, servico.value.preco);
      }
      modalOpen.value = false;
      loadServicos();
    };

    const deleteServico = async (id: number) => {
      await window.api.deleteServico(id);
      loadServicos();
    };

    const isSaveDisabled = computed(() => {
      return !servico.value.nome || !servico.value.preco;
    });

    const valorReais = ref(0);
    const valorPorcentagem = ref(0);


    watch(valorReais, (newValorReais) => {
      if (servico.value.preco > 0) {
        valorPorcentagem.value = (newValorReais / servico.value.preco) * 100;
      }
    });

    watch(valorPorcentagem, (newValorPorcentagem) => {
      if (servico.value.preco > 0) {
        valorReais.value = (newValorPorcentagem * servico.value.preco) / 100;
      }
    });

    onMounted(loadServicos);

    return {
      servicos,
      search,
      modalOpen,
      editingServico,
      servico,
      headers,
      filteredServicos,
      nomeError,
      precoError,
      openModal,
      saveServico,
      deleteServico,
      isSaveDisabled,
      valorReais,
      valorPorcentagem
    };
  }
});
</script>
