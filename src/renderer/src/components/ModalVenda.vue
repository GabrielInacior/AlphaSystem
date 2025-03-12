<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title>{{ tipoVenda === 'produto' ? 'Nova Venda de Produto' : 'Nova Venda de Serviço' }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="salvarVenda">
          <v-select
            v-if="clientes && clientes.length"
            label="Cliente"
            :items="clientes"
            item-title="nome"
            item-value="id"
            v-model="cliente_id"
            required
          ></v-select>

          <v-select
            v-if="tipoVenda === 'produto'"
            label="Produto"
            :items="itens"
            item-title="nome"
            item-value="id"
            v-model="item_id"
            required
            @update:modelValue="calcularValorTotal"
          ></v-select>

          <v-select
            v-if="tipoVenda === 'servico'"
            label="Serviço"
            :items="itens"
            item-title="nome"
            item-value="id"
            v-model="item_id"
            required
            @update:modelValue="calcularValorTotal"
          ></v-select>

          <v-text-field
            v-if="tipoVenda === 'produto'"
            label="Quantidade"
            type="number"
            v-model="quantidade"
            required
            @input="calcularValorTotal"
          ></v-text-field>

          <v-text-field
            label="Valor Total"
            type="number"
            v-model="valor_total"
            readonly
          ></v-text-field>

          <v-select label="Pagamento" :items="metodosPagamento" v-model="metodo_pagamento" required></v-select>

          <v-btn type="submit" color="primary" class="mt-4" block>Registrar Venda</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ClienteEntity } from '@renderer/entities/ClienteEntity';
import { ProdutoEntity } from '@renderer/entities/ProdutoEntity';
import { ServicoEntity } from '@renderer/entities/ServicoEntity';

export default defineComponent({
  name: 'ModalVenda',
  props: {
    isOpen: Boolean,
    tipoVenda: String, // 'produto' ou 'servico'
    clientes: Array<ClienteEntity>,
    itens: Array<ProdutoEntity | ServicoEntity>, // Produtos ou Serviços
  },
  setup(props, { emit }) {
    const cliente_id = ref(null);
    const item_id = ref(null);
    const quantidade = ref(1);
    const valor_total = ref(0);
    const metodo_pagamento = ref('');
    const metodosPagamento = ['Pix', 'Cartão', 'Dinheiro'];

    const calcularValorTotal = () => {
      const itemSelecionado = props.itens?.find((item: any) => item.id === item_id.value);
      if (!itemSelecionado) return;

      const preco = 'preco' in itemSelecionado ? itemSelecionado.preco : itemSelecionado.custo;
      valor_total.value = props.tipoVenda === 'produto' ? preco * quantidade.value : preco;
    };

    const salvarVenda = async () => {
      if (!cliente_id.value || !item_id.value || !valor_total.value || !metodo_pagamento.value) return;

      if (props.tipoVenda === 'produto') {
        await window.api.createVendaProduto(cliente_id.value, item_id.value, parseInt(quantidade.value), parseFloat(valor_total.value), metodo_pagamento.value, new Date().toISOString());
      } else {
        await window.api.createVendaServico(cliente_id.value, item_id.value, parseFloat(valor_total.value), metodo_pagamento.value, new Date().toISOString());
      }

      emit('close'); // Fecha o modal após salvar
    };

    watch(() => props.isOpen, (val) => {
      if (!val) {
        cliente_id.value = null;
        item_id.value = null;
        quantidade.value = 1;
        valor_total.value = 0;
        metodo_pagamento.value = '';
      }
    });

    return {
      cliente_id,
      item_id,
      quantidade,
      valor_total,
      metodo_pagamento,
      metodosPagamento,
      salvarVenda,
      calcularValorTotal
    };
  },
});
</script>
