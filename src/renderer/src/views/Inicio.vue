<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-2" elevation="10">
          <v-card-text class="text-h6">
            {{ saudacao }}, Bia e Raphael! Sejam bem-vindos ao <strong>AlphaSystem</strong>!
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Gráfico de Vendas de Produtos por Data -->
      <v-col cols="4" md="6" lg="4">
        <v-card class="pa-1" style="min-height: 250px; position: relative;" elevation="10">
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

      <v-col cols="8" md="8" lg="8">
        <v-card class="pa-1" style="min-height: 250px; position: relative;" elevation="10">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Informações Gerais
          </v-card-title>

          <v-row style="max-height: 70px;">
            <v-col>
              <v-select v-model="periodoInfoGerais" :items="periodos" item-title="text" item-value="value"
                label="Selecione o Período" density="compact" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" md="6" lg="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1">Total Vendas Produtos | Custo:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="text-right">
                    <span class="font-weight-bold"><span style="color: #1976D2;">R$ {{
                      infoGerais?.total_produtos_vendidos?.toFixed(2) || '---' }}
                      </span> | <span style="color: red;">R$ {{
                        infoGerais?.total_custo_produtos.toFixed(2) || "---" }}</span></span>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1">Total Vendas Serviços:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="text-right">
                    <span class="font-weight-bold" style="color: #1976D2;">R$ {{
                      infoGerais?.total_servicos_vendidos?.toFixed(2) || '---' }}</span>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1">Total Despesas:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="text-right">
                    <span class="font-weight-bold" style="color: red;">R$ {{ infoGerais?.total_despesas?.toFixed(2) ||
                      '---'
                      }}</span>
                  </v-list-item-content>
                </v-list-item>

              </v-list>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6" md="6" lg="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1">Qtd. Produtos Vendidos:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="text-right">
                    <span class="font-weight-bold">{{ infoGerais?.qtd_produtos_vendidos || '---' }}</span>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1">Qtd. Serviços Vendidos:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="text-right">
                    <span class="font-weight-bold">{{ infoGerais?.qtd_servicos_vendidos || '---' }}</span>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1">Qtd. Despesas:</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="text-right">
                    <span class="font-weight-bold">{{ infoGerais?.qtd_despesas || '---' }}</span>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

            </v-col>
          </v-row>

          <v-row>
            <v-divider></v-divider>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-list class="w-100">
                <v-list-item class="w-100">
                  <v-list-item-content class="d-flex justify-center align-center w-100" style="align-items: center;">
                    <v-list-item-title class="text-subtitle-1 font-weight-bold ">Lucro Total:</v-list-item-title>
                    <span class="font-weight-bold text-h5" style="color: green; margin-left: 10px;">
                      R$ {{ infoGerais?.lucro_total?.toFixed(2) || '---' }}
                    </span>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>


        </v-card>
      </v-col>

    </v-row>
    <v-row>
      <v-col cols="4" md="4" lg="4">
        <v-card class="pa-1" style="min-height: 250px;" elevation="10">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Aniversariantes do Mês
          </v-card-title>

          <!-- Lista de Clientes Aniversariantes com Scroll -->
          <v-list style="width: 100%; max-height: 250px; min-height: 250px; overflow-y: auto;" v-if="clientesAniversariantes.length > 0">
            <v-list-item-group v-for="(cliente, index) in clientesAniversariantes" :key="index">
              <v-list-item>
                <v-list-item-content>
                  <v-row class="d-flex align-center" style="width: 100%;">
                    <v-col cols="2" class="text-center">
                      <v-icon small icon="mdi-cake"></v-icon>
                    </v-col>

                    <v-col cols="4">
                      <v-tooltip :text="cliente.nome">
                        <template v-slot:activator="{ props }">
                          <v-list-item-title v-bind="props" style="font-size: 14px;" class="text-truncate">{{
                            cliente.nome
                            }}</v-list-item-title>
                        </template>
                      </v-tooltip>

                    </v-col>

                    <v-col cols="6"
                      style="min-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      <v-tooltip :text="cliente.aniversario + ' ' + calcularIdade(cliente.aniversario) + ' anos'">
                        <template v-slot:activator="{ props }">
                          <v-list-item-subtitle v-bind="props" style="font-size: 12px;">
                            {{ cliente.aniversario }}: <strong>{{ calcularIdade(cliente.aniversario) }} anos </strong>
                          </v-list-item-subtitle>
                        </template>
                      </v-tooltip>

                    </v-col>

                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-list-item-group>
          </v-list>
          <v-card-text class="text-subtitle-2"
            style="height: 250px; display: flex; justify-content: center; align-items: center;" v-else>
            Nenhum cliente aniversariante nesse mês...
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Gráfico Comparação Lucro x Gasto -->

      <v-col cols="8" md="8" lg="8">
        <v-card class="pa-1" style="min-height: 250px;" elevation="10">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Maiores Devedores
          </v-card-title>

          <v-list style="width: 100%;min-height: 250px; max-height: 250px; overflow-y: auto;"
            v-if="clientesDevendo.length > 0">
            <v-list-item-group v-for="(cliente, index) in clientesDevendo" :key="index">
              <v-list-item>
                <v-list-item-content>
                  <v-row class="d-flex align-center" style="width: 100%; ">
                    <v-col cols="1" class="text-center">
                      <span class="font-weight-bold">{{ index + 1 }}º</span>
                    </v-col>

                    <v-col cols="3">
                      <v-list-item-title style="font-size: 14px;" class="text-truncate">
                        {{ cliente.cliente_nome }}</v-list-item-title>
                    </v-col>

                    <v-col cols="4">
                      <v-list-item-subtitle style="font-size: 14px;"><v-icon small icon="mdi-phone"></v-icon> {{
                        cliente.cliente_telefone || "Não cadastrado" }}</v-list-item-subtitle>
                    </v-col>
                    <v-col cols="3">
                      <v-list-item-title style="font-size: 15px;">Deve: <span
                          style="font-weight: bold; font-size: 16px;"> {{
                            'R$ ' + cliente.total_devido.toFixed(2) ||
                            '---' }}</span></v-list-item-title>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-list-item-group>
          </v-list>
          <v-card-text class="text-subtitle-2"
            style="height: 250px; display: flex; justify-content: center; align-items: center;" v-else>
            Nenhum cliente devedor encontrado...
          </v-card-text>
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
    const infoGerais = ref<any>(null);
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
    const clientesDevendo = ref<any[]>([]);
    const periodoVendasXServicos = ref('dia');
    const periodoInfoGerais = ref('dia');
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

    const calcularIdade = (aniversario: string) => {
      const nascimento = new Date(aniversario);
      const hoje = new Date();

      let idade = hoje.getFullYear() - nascimento.getFullYear();

      // Verificar se o aniversário já passou neste ano
      const mesNascimento = nascimento.getMonth();
      const diaNascimento = nascimento.getDate();
      const mesAtual = hoje.getMonth();
      const diaAtual = hoje.getDate();

      // Se o aniversário ainda não aconteceu este ano, subtrai 1 da idade
      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        idade--;
      }

      return idade;
    };

    const getClientesAniversariantes = async () => {
      const produtosResponse = await window.api.getClientesAniversariantes();
      clientesAniversariantes.value = produtosResponse;
      console.log(clientesAniversariantes.value);
    };

    const getLucroTotal = async (periodo: string) => {
      const response = await window.api.getLucroTotal(periodo);
      infoGerais.value = response;
    };

    const getClientesDevendo = async () => {
      const response = await window.api.getClientesComVendasPendentes();
      clientesDevendo.value = response;
      console.log(clientesDevendo.value);;
    }

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
      await getClientesDevendo();
      await getLucroTotal(periodoInfoGerais.value);
      await getVendasProdutosVsServicos(periodoVendasXServicos.value);
    };

    onMounted(() => {
      carregarDados();
      definirSaudacao();
    });

    watch(() => periodoVendasXServicos.value, async (val) => {
      if (val) {
        await getVendasProdutosVsServicos(val);
      }
    });

    watch(() => periodoInfoGerais.value, async (val) => {
      if (val) {
        await getLucroTotal(val);
      }
    });

    return {
      vendasProdutosXServicos,
      saudacao,
      periodoVendasXServicos,
      clientesAniversariantes,
      chartOptionsServicosXProdutos,
      infoGerais,
      getClientesDevendo,
      produtosXServicosData,
      clientesDevendo,
      calcularIdade,
      periodos,
      periodoInfoGerais,
    }
  }
});
</script>

<style>
.teste {
  color: #ffd900;
}
</style>
