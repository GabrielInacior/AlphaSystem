<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-2">
          <v-card-text class="text-h6">
            {{ saudacao }}, Bia e Raphael! Sejam bem-vindos ao <strong>AlphaSystem</strong>!
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Gráfico de Vendas de Produtos por Data -->
      <v-col cols="7" md="4" lg="4">
        <v-card class="pa-1" style="min-height: 250px;">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Clientes Aniversariantes
          </v-card-title>

          <!-- Lista de Clientes Aniversariantes com Scroll -->
          <v-list style="width: 100%; max-height: 250px; overflow-y: auto;" v-if="clientesAniversariantes.length > 0">
            <v-list-item-group v-for="(cliente, index) in clientesAniversariantes" :key="index">
              <v-list-item>
                <v-list-item-content>
                  <v-row class="d-flex align-center" style="width: 100%; ">
                    <v-col cols="2" class="text-center">
                      <v-icon small icon="mdi-cake"></v-icon>
                    </v-col>

                    <v-col cols="4">
                      <v-list-item-title style="font-size: 14px;" class="text-truncate">{{ cliente.nome
                        }}</v-list-item-title>
                    </v-col>

                    <v-col cols="6">
                      <v-list-item-subtitle style="font-size: 12px;">{{ cliente.telefone }}</v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-list-item-group>
          </v-list>
          <v-card-text class="text-h6" v-else>
            Nenhum cliente aniversáriante hoje!
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico Comparação Lucro x Gasto -->
      <v-col cols="4" md="6" lg="4">
        <v-card class="pa-1" style="min-height: 250px; position: relative;">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Comparação Seviços vs Produtos
          </v-card-title>

          <v-row style="max-height: 70px;">
            <v-col>
              <v-select v-model="periodoVendasXServicos" :items="periodos" item-title="text" item-value="value"
                label="Selecione o Período" density="compact" />
            </v-col>
          </v-row>

          <!-- Gráfico -->
          <DoughnutChart :data="produtosXServicosData" :options="chartOptionsServicosXProdutos"
            style="height: 200px; max-height: 300px;" />
        </v-card>
      </v-col>

      <!-- Ranking dos Produtos Mais Vendidos -->
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-1" style="min-height: 250px;">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Produtos mais vendidos
          </v-card-title>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default defineComponent({
  name: 'Inicio',
  components: {
    DoughnutChart: Doughnut
  },
  setup() {
    const vendasProdutosXServicos = ref<any[]>([]);
    const produtosXServicosData = ref<any>({
      labels: ['Produtos', 'Serviços'],
      datasets: [
        {
          label: 'Vendas',
          data: [0, 0], // Inicializa com valores 0, serão atualizados após a resposta da API
          backgroundColor: ['#FF6384', '#36A2EB'], // Cores para o gráfico
        }
      ]
    });

    const chartOptionsServicosXProdutos = ref<any>({
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw;
              return `R$ ${value.toFixed(2)}`; // Formatação para valores em Reais
            },
          },
        },
      },
      layout: {
        padding: 20
      }
    });

    const clientesAniversariantes = ref<any[]>([]);
    const periodoVendasXServicos = ref('dia');
    const periodos = [
      { value: 'dia', text: 'Últimas 24 horas' },
      { value: 'semana', text: 'Última Semana' },
      { value: 'mes', text: 'Último Mês' },
      { value: 'ano', text: 'Último Ano' },
      { value: 'todos', text: 'Todos' },
    ];
    const saudacao = ref('');

    const definirSaudacao = () => {
      const hora = new Date().getHours();
      if (hora >= 4 && hora < 12) {
        saudacao.value = 'Bom dia';
      } else if (hora >= 12 && hora < 19) {
        saudacao.value = 'Boa tarde';
      } else {
        saudacao.value = 'Boa noite';
      }
    };

    const getClientesAniversariantes = async () => {
      const produtosResponse = await window.api.getClientesAniversariantes();
      clientesAniversariantes.value = produtosResponse;
      console.log(clientesAniversariantes.value);
    };

    const getVendasProdutosVsServicos = async (periodo: string) => {
      const produtosResponse = await window.api.getVendasProdutosVsServicos(periodo);
      vendasProdutosXServicos.value = produtosResponse;
      console.log(vendasProdutosXServicos);

      // Definindo os dados do gráfico de produtos vs serviços
      const totalProdutosVendidos = produtosResponse.total_produtos_vendidos;
      const totalServicosVendidos = produtosResponse.total_servicos_vendidos;

      // Preparando os dados para o gráfico
      const vendasData = {
        labels: ['Produtos', 'Serviços'],
        datasets: [
          {
            label: 'Vendas Produtos vs Serviços',
            data: [totalProdutosVendidos, totalServicosVendidos],
            backgroundColor: ['#1976D2', '#eec201'],
            hoverBackgroundColor: ['#12589e', '#ffd900'],
          },
        ],
      };

      // Configuração do gráfico
      chartOptionsServicosXProdutos.value = {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return `R$: ${value.toFixed(2)}`;
              },
            },
          },
        },
        layout: {
          padding: 20,
        },
      };

      produtosXServicosData.value = vendasData;
    };

    const carregarDados = async () => {
      await getClientesAniversariantes();
      await getVendasProdutosVsServicos(periodoVendasXServicos.value);
    };

    onMounted(() => {
      carregarDados();
      definirSaudacao();
    });

    return {
      vendasProdutosXServicos,
      saudacao,
      periodoVendasXServicos,
      clientesAniversariantes,
      chartOptionsServicosXProdutos,
      produtosXServicosData,
      periodos,
    }
  }
});
</script>

<style>
.teste {
  color: #ffd900;
}
</style>
