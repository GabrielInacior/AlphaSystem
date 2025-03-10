<template>
  <v-container>
    <v-card>
      <v-card-title>
        Serviços
        <v-spacer></v-spacer>
        <v-text-field v-model="search" label="Buscar serviço" clearable dense></v-text-field>
        <v-btn color="primary" @click="openModal(null)">Novo Serviço</v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredServicos"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteServico(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingServico ? 'Editar Serviço' : 'Novo Serviço' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="servico.nome" label="Nome" required></v-text-field>
          <v-text-field v-model="servico.preco" label="Preço" type="number" required></v-text-field>
          <v-text-field v-model="servico.desconto" label="Desconto" type="number" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveServico">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'ServicoView',
  setup() {
    const servicos = ref<any[]>([]);
    const search = ref('');
    const modalOpen = ref(false);
    const editingServico = ref<any | null>(null);
    const servico = ref({ nome: '', preco: 0, desconto: 0 });

    const headers = [
      { text: 'Nome', value: 'nome' },
      { text: 'Preço', value: 'preco' },
      { text: 'Desconto', value: 'desconto' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const filteredServicos = computed(() =>
      servicos.value.filter(s => s.nome.toLowerCase().includes(search.value.toLowerCase()))
    );

    const loadServicos = async () => {
      servicos.value = await window.api.getAllServicos();
    };

    const openModal = (editItem: any) => {
      editingServico.value = editItem;
      servico.value = editItem ? { ...editItem } : { nome: '', preco: 0, desconto: 0 };
      modalOpen.value = true;
    };

    const saveServico = async () => {
      if (editingServico.value) {
        await window.api.updateServico(editingServico.value.id, servico.value.nome, servico.value.preco, servico.value.desconto);
      } else {
        await window.api.createServico(servico.value.nome, servico.value.preco, servico.value.desconto);
      }
      modalOpen.value = false;
      loadServicos();
    };

    const deleteServico = async (id: number) => {
      await window.api.deleteServico(id);
      loadServicos();
    };

    onMounted(loadServicos);

    return {
      servicos,
      search,
      modalOpen,
      editingServico,
      servico,
      headers,
      filteredServicos,
      openModal,
      saveServico,
      deleteServico
    };
  }
});
</script>
