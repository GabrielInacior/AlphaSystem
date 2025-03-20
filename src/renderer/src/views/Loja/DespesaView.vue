<template>
  <v-container style="height: 90vh; width: 100%;">
    <v-card style="height: 100%; width: 100%;">
      <v-card-title>
        Despesas
        <v-spacer></v-spacer>
        <!-- Filtros -->
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field density="compact" v-model="descricaoFilter" label="Filtrar por Descrição" clearable
              dense></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field density="compact" v-model="dataFilter" label="Filtrar por Data" type="date"
              clearable></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-select v-model="tipoFilter" density="compact" label="Filtrar por Tipo" :items="tipoDespesas" clearable ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-btn color="primary" @click="openModal(null)">Nova Despesa</v-btn>
          </v-col>

        </v-row>

      </v-card-title>

      <v-data-table density="compact" style="height: 74%; width: 100%" :headers="headers" :items="filteredDespesas"
        no-data-text="Nenhum despesa encontrada" class="elevation-1" items-per-page-text="Itens por página">
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.value" class="font-weight-bold text-left">
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template v-slot:item.valor="{ item }">
          <span>R$ {{ item.valor.toFixed(2) }}</span>
        </template>
        <template v-slot:item.data="{ item }">
          <span>{{ item.data }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openModal(item)">mdi-pencil</v-icon>
          <v-icon small color="red" @click="deleteDespesa(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="modalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingDespesa ? 'Editar Despesa' : 'Nova Despesa' }}
        </v-card-title>
        <v-card-text>
          <v-text-field density="compact" v-model="despesa.descricao" label="Descrição" required></v-text-field>
          <v-number-input density="compact" v-model="despesa.valor" label="Valor" required :min="0"
            :rules="[val => val >= 0 || 'Valor deve ser maior ou igual a zero']" prefix="R$" :precision="2"
            control-variant="stacked"></v-number-input>
          <v-text-field density="compact" v-model="despesa.data" label="Data" type="date" required></v-text-field>
          <v-select v-model="despesa.tipo" label="Tipo de Despesa" :items="tipoDespesas" required density="compact"
            clearable></v-select>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" :disabled="!despesa.descricao && !despesa.data && despesa.valor === 0"
            @click="saveDespesa">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'DespesaView',
  setup() {
    const despesas = ref<any[]>([]);
    const tipoFilter = ref<string | null>(null);
    const descricaoFilter = ref('');
    const tipoDespesas = [
      'Administrativa',
      'Comercial',
      'Financeira',
      'Operacional',
      'Tributária',
      'Extraordinária'
    ];
    const dataFilter = ref(null);
    const modalOpen = ref(false);
    const editingDespesa = ref<any | null>(null);
    const despesa = ref({ descricao: '', valor: 0, data: null, tipo: '' });

    const headers = [
      { text: 'Descrição', value: 'descricao' },
      { text: 'Valor', value: 'valor' },
      { text: 'Data', value: 'data' },
      { text: 'Tipo', value: 'tipo' },
      { text: 'Ações', value: 'actions', sortable: false }
    ];

    const formatDateForComparison = (data: string) => {
      const date = new Date(data);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const filteredDespesas = computed(() => {
      return despesas.value.filter(d => {
        const descricaoMatch = d.descricao.toLowerCase().includes(descricaoFilter.value.toLowerCase());
        const dataMatch = dataFilter.value
          ? formatDateForComparison(d.data) === formatDateForComparison(dataFilter.value)
          : true;
        const tipoMatch = tipoFilter.value ? d.tipo === tipoFilter.value : true;

        return descricaoMatch && dataMatch && tipoMatch;
      });
    });


    const formatDateForDisplay = (date: string) => {
      const formattedDate = new Date(date);
      // Ajuste para o fuso horário local
      formattedDate.setMinutes(formattedDate.getMinutes() - formattedDate.getTimezoneOffset());
      return formattedDate.toLocaleDateString();
    };


    const loadDespesas = async () => {
      despesas.value = await window.api.getAllDespesas();
    };

    const openModal = (editItem: any) => {
      editingDespesa.value = editItem;
      if (editingDespesa.value) {
        const dataFormatada = editItem.data ? new Date(editItem.data).toISOString().split('T')[0] : '';
        editingDespesa.value = { ...editItem, data: dataFormatada };
      }
      despesa.value = editItem ? { ...editItem } : { descricao: '', valor: 0, data: null, tipo: '' };
      modalOpen.value = true;
    };

    const saveDespesa = async () => {
      if (editingDespesa.value) {
        await window.api.updateDespesa(editingDespesa.value.id, despesa.value.descricao, despesa.value.valor, despesa.value.data, despesa.value.tipo);
      } else {
        await window.api.createDespesa(despesa.value.descricao, despesa.value.valor, despesa.value.data, despesa.value.tipo);
      }
      modalOpen.value = false;
      loadDespesas();
    };

    const deleteDespesa = async (id: number) => {
      await window.api.deleteDespesa(id);
      loadDespesas();
    };

    onMounted(loadDespesas);

    return {
      despesas,
      descricaoFilter,
      dataFilter,
      modalOpen,
      editingDespesa,
      despesa,
      headers,
      filteredDespesas,
      formatDateForDisplay,
      openModal,
      tipoFilter,
      tipoDespesas,
      saveDespesa,
      deleteDespesa
    };
  }
});
</script>
