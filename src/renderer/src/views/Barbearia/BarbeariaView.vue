<template>
  <v-container>
    <v-row>
      <!-- Gráfico de Vendas de Servicos por Data -->
      <v-col cols="7" md="4" lg="4">
        <v-card class="pa-1" style="min-height: 150px;">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Top clientes - Serviços
          </v-card-title>
          <v-row style="max-height: 90px;">
            <v-col style="width: 100%;">
              <v-select v-model="periodoVClientesCompraram" :items="periodos" item-title="text" item-value="value"
                label="Selecione o Período" density="compact" outlined />
            </v-col>
          </v-row>
          <v-list style="width: 100%;">
            <v-list-item-group v-for="(cliente, index) in melhoresClientes" :key="index">
              <v-list-item>
                <v-list-item-content>
                  <v-row class="d-flex align-center" style="width: 100%; ">
                    <v-col cols="3" class="text-center">
                      <!-- Medalha com icone e a colocação em negrito -->
                      <v-icon :class="getRankingClass(index)" small>{{ getMedalIcon(index) }}</v-icon>
                      <span class="font-weight-bold">{{ index + 1 }}º</span>
                    </v-col>

                    <v-col cols="4">
                      <v-list-item-title style="font-size: 14px;" class="text-truncate">{{ cliente.cliente_nome
                      }}</v-list-item-title>
                    </v-col>

                    <v-col cols="5" class="text-right">
                      <v-list-item-subtitle style="font-size: 12px;">{{ cliente.quantidade_servicos_comprados }}
                        Serviços
                        comprados</v-list-item-subtitle>
                    </v-col>

                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

      <!-- Gráfico Comparação Lucro x Gasto -->
      <v-col cols="3" md="3" lg="3">
        <v-card class="pa-1" style="min-height: 250px; position: relative;">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Informações adicionais
          </v-card-title>

          <v-row style="max-height: 70px;">
            <v-col cols="6" md="6" style="min-width: 260px;">
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title style="font-size: 14px;">
                      Serviços vendidos no total
                    </v-list-item-title>
                    <v-list-item-subtitle style="font-size: 12px;">
                      {{ quantidadeReceitaServicos.total_servicos_vendidos || '--' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title style="font-size: 14px;">
                      Receita total com Serviços
                    </v-list-item-title>
                    <v-list-item-subtitle style="font-size: 20px; font-weight: bold;">
                      <span v-if="quantidadeReceitaServicos.receita_total_servicos">
                        {{ 'R$' +
                          quantidadeReceitaServicos.receita_total_servicos.toFixed(2) }}</span>
                      <span v-else>---</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>


      <!-- Ranking dos Servicos Mais Vendidos -->
      <v-col cols="12" md="6" lg="5">
        <v-card class="pa-1" style="min-height: 100px;">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Serviços mais vendidos
          </v-card-title>
          <v-row style="max-height: 90px;"> <!-- Adicionando flex-wrap para se ajustar ao espaço -->
            <v-col style="width: 100%;">
              <v-select item-title="text" item-value="value" v-model="periodoMaisVendidos" :items="periodos"
                label="Selecione o Período" density="compact" outlined />
            </v-col>
          </v-row>
          <v-list>
            <v-list-item-group v-for="(produto, index) in servicosMaisVendidos" :key="index">
              <v-list-item>
                <v-list-item-content>
                  <v-row class="d-flex align-center" style="gap: 8px; flex-wrap: wrap;">
                    <!-- Flex wrap e gap entre os itens -->
                    <!-- Posição de Ranking -->
                    <v-col cols="2" class="text-center">
                      <v-icon :class="getRankingClass(index)" small>{{ getMedalIcon(index) }}</v-icon>
                      <span class="font-weight-bold">{{ index + 1 }}º</span>
                    </v-col>

                    <!-- Nome do Produto -->
                    <v-col cols="3" class="text-truncate">
                      <v-list-item-title style="font-size: 14px;">{{ produto.servico_nome }}</v-list-item-title>
                    </v-col>

                    <!-- Quantidade de Vendas -->
                    <v-col cols="2" class="text-right">
                      <v-list-item-subtitle style="font-size: 12px;">{{ produto.quantidade_vendida }}
                        vendas</v-list-item-subtitle>
                    </v-col>

                    <!-- Total Vendido -->
                    <v-col cols="3" class="text-right">
                      <v-list-item-subtitle style="font-size: 12px;">{{ 'R$' + produto.total_vendido.toFixed(2) || '---'
                        }}</v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>

              <!-- Divider entre os itens -->
              <v-divider></v-divider>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

    </v-row>

    <v-row>
      <v-col cols="12" md="6" lg="6">
        <v-card class="pa-1" style="min-height: 300px; width: 100%;">
          <v-card-title style="font-size: 16px;font-weight: bold;">
            Evoluçao de servicos vendidos
          </v-card-title>
          <v-row cols="auto" class="px-8 my-1" style="max-height: 80px;">
            <v-select item-title="text" item-value="value" v-model="periodoVendasServicos" :items="periodos"
              label="Selecione o Período" density="compact" />
          </v-row>
          <LineChart :data="vendasServicosData" :options="chartOptions" />
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="6">
        <v-card class="pa-1" style="min-height: 300px; width: 100%;">
          <v-row no-gutters>
            <!-- Gráfico do Método de Pagamento (50%) -->
            <v-col cols="12" md="12">
              <v-card-title style="font-size: 14px; font-weight: bold;">
                Vendas de serviços <br> p/ Método de Pagamento
              </v-card-title>
              <v-row cols="auto" class="px-4 my-1" style="max-height: 80px;">
                <v-select item-title="text" item-value="value" v-model="periogoPagamentos" :items="periodos"
                  label="Selecione o Período" density="compact" />
              </v-row>
              <DoughnutChart :data="vendasPorMetodoPagamentoData" :options="chartOptionsVendasPagamento" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Line, Doughnut, } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement } from 'chart.js';

// Registrando os tipos do chart.js
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement);

export default defineComponent({
  name: 'BarbeariaView',
  components: {
    LineChart: Line,
    DoughnutChart: Doughnut
  },
  setup() {
    // Dados e opções dos gráficos
    const router = useRouter();
    const vendasServicosData = ref<any>({ labels: [], datasets: [] });
    const vendasPorMetodoPagamentoData = ref<any>({ labels: [], datasets: [] });
    const servicosMaisVendidos = ref<any[]>([]);
    const servicosSemEstoque = ref<any[]>([]);
    const chartOptionVendas = ref<any>();
    const quantidadeReceitaServicos = ref<any>([]);
    const melhoresClientes = ref<any[]>([]);
    const exemploData = ref<any>({ labels: [], datasets: [] });
    const chartOptionsLucroGasto = ref<any>();
    const periodoVendasServicos = ref('semana');
    const periodoMaisVendidos = ref('semana');
    const periodoVClientesCompraram = ref('semana');
    const periogoPagamentos = ref('semana');
    const periodos = [
      { value: 'dia', text: 'Hoje' },
      { value: 'semana', text: 'Última Semana' },
      { value: 'mes', text: 'Último Mês' },
      { value: 'ano', text: 'Último Ano' },
      { value: 'todos', text: 'Todos' },
    ];

    const getVendasServicosPorData = async (periodo: string) => {
      try {
        const vendasServicosResponse = await window.api.getVendasServicosPorData(periodo);
        console.log('[VENDAS RESPONSE]', vendasServicosResponse);

        const labels: string[] = [];
        const dataTotalVendido: number[] = [];

        let lastPeriod = ''; // Variável para acompanhar o período anterior
        let periodSum = 0; // Variável para somar os valores no mesmo período

        vendasServicosResponse.forEach((item: any) => {
          let label = '';

          switch (periodo) {
            case 'dia':
              label = new Date(item.periodo + ':00').toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              break;

            case 'semana':
              const diasDaSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
              const dataPeriodo = new Date(item.periodo);
              let diaSemana = dataPeriodo.getDay();

              // Adiciona 1 ao valor de getDay(), mas se for 7, faz reset para 0
              diaSemana = (diaSemana + 1) % 7;

              label = diasDaSemana[diaSemana];

              if (!labels.includes(label)) {
                labels.push(label);
                dataTotalVendido.push(0);  // Inicializa o valor para este dia da semana
              }

              // Encontra o índice do dia da semana e soma os valores
              const dayIndex = labels.indexOf(label);
              dataTotalVendido[dayIndex] += Number(item.total_vendido);
              break;

            case 'mes':
              const dataInicio = new Date(item.periodo);
              const dataFim = new Date(dataInicio);
              dataFim.setDate(dataFim.getDate() + 1);

              const formatarData = (data: Date) =>
                data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

              label = `${formatarData(dataInicio)} a ${formatarData(dataFim)}`;

              if (lastPeriod === label) {
                periodSum += Number(item.total_vendido);
              } else {
                if (lastPeriod !== '') {
                  labels.push(lastPeriod);
                  dataTotalVendido.push(periodSum);
                }
                periodSum = Number(item.total_vendido);
              }

              lastPeriod = label;
              break;

            case 'ano':
              const mesAno = new Date(item.periodo);
              label = mesAno.toLocaleString('default', { month: 'long' });
              break;

            case 'todos':
              label = item.periodo;
              break;

            default:
              label = new Date(item.periodo).toLocaleDateString();
          }
        });

        // Adiciona o último valor após o loop
        if (lastPeriod !== '') {
          labels.push(lastPeriod);
          dataTotalVendido.push(periodSum);
        }

        vendasServicosData.value = {
          labels,
          datasets: [
            {
              label: 'Valor Total Vendido (R$)',
              data: dataTotalVendido,
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              borderColor: '#4CAF50',
              borderWidth: 2,
              hoverBackgroundColor: '#4CAF50',
              hoverBorderColor: '#2E7D32',
              tension: 0.3,
              fill: false,
              yAxisID: 'y1',
            },
          ],
        };

        chartOptionVendas.value = {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                text: 'Valor Total (R$)',
              },
            },
          },
        };

      } catch (error) {
        console.error('Erro ao buscar dados de vendas:', error);
      }
    };

    const getServicosMaisVendidos = async (periodo: string) => {
      const produtosResponse = await window.api.getServicosMaisVendidos(periodo);
      servicosMaisVendidos.value = produtosResponse;
    };

    const getQuantidadeEReceitaServicos = async () => {
      const produtosResponse = await window.api.getQuantidadeEReceitaServicos();
      quantidadeReceitaServicos.value = produtosResponse;
    };

    const getProdutosSemEstoque = async () => {
      const produtosResponse = await window.api.getProdutosSemEstoque();
      servicosSemEstoque.value = produtosResponse;
    };

    const getClientesMaisCompraramServicos = async (periodo: string, limite: number) => {
      const clientesResponse = await window.api.getClientesMaisCompraramServicos(periodo, limite);
      melhoresClientes.value = clientesResponse;
    };

    const getVendasServicosPorMetodoPagamento = async (periodo: string) => {
      const vendasResponse = await window.api.getVendasServicosPorMetodoPagamento(periodo);
      const labels: string[] = [];
      const data: number[] = [];
      const colors: string[] = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EF5350']; // Cores pré-definidas para métodos de pagamento

      vendasResponse.forEach((item: any) => {
        labels.push(item.metodo); // Corrigido para 'metodo'
        data.push(item.total_vendas); // Corrigido para 'total_vendas'
      });

      vendasPorMetodoPagamentoData.value = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, labels.length),
            hoverBackgroundColor: colors.slice(0, labels.length).map(color => color + 'CC'), // Adicionando transparência no hover
          },
        ],
      };
    };

    const goToProdutos = () => {
      router.push('produtos');
    }


    const getMedalIcon = (index) => {
      if (index === 0) {
        return 'mdi-medal';
      } else if (index === 1) {
        return 'mdi-medal';
      } else if (index === 2) {
        return 'mdi-medal';
      }
      return '';
    };

    const getRankingClass = (index) => {
      if (index === 0) return 'gold-rank';
      else if (index === 1) return 'silver-rank';
      else if (index === 2) return 'bronze-rank';
      return '';
    };

    const carregarDados = async () => {
      await getVendasServicosPorData(periodoVendasServicos.value);
      await getServicosMaisVendidos(periodoMaisVendidos.value);
      await getClientesMaisCompraramServicos(periodoVClientesCompraram.value, 5);
      await getProdutosSemEstoque();
      await getQuantidadeEReceitaServicos();
      await getVendasServicosPorMetodoPagamento(periogoPagamentos.value);
    };

    onMounted(() => {
      carregarDados();
    });


    watch(() => periodoMaisVendidos.value, async (val) => {
      if (val) {
        await getServicosMaisVendidos(val);
      }
    });

    watch(() => periodoVClientesCompraram.value, async (val) => {
      if (val) {
        await getClientesMaisCompraramServicos(val, 5);
      }
    });

    watch(() => periogoPagamentos.value, async (val) => {
      if (val) {
        await getVendasServicosPorMetodoPagamento(val);
      }
    });

    watch(() => periodoVendasServicos.value, async (val) => {
      if (val) {
        await getVendasServicosPorData(val);
      }
    });

    // Opções do gráfico (geral para todos)
    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,  // Inicia o eixo Y do zero
          ticks: {
            stepSize: 1,  // Intervalo de passos no eixo Y
          }
        },
        x: {
          beginAtZero: true,  // Inicia o eixo X do zero
        },
      },
      maintainAspectRatio: false,  // Evita o gráfico de expandir infinitamente
      plugins: {
        title: {
          display: true,
          text: 'Gráfico de Vendas e Comparações'
        }
      },
      layout: {
        padding: 20
      }
    };

    const chartOptionsVendasPagamento = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              const value = tooltipItem.raw || 0;
              return ` R$ ${value.toFixed(2)}`;
            },
          },
        },
      },
    });

    return {
      vendasServicosData,
      servicosMaisVendidos,
      melhoresClientes,
      periodoVendasServicos,
      periodoMaisVendidos,
      chartOptionsLucroGasto,
      vendasPorMetodoPagamentoData,
      chartOptionsVendasPagamento,
      periodoVClientesCompraram,
      exemploData,
      chartOptions,
      quantidadeReceitaServicos,
      goToProdutos,
      servicosSemEstoque,
      getMedalIcon,
      getRankingClass,
      periodos,
      periogoPagamentos,
    };
  }
});
</script>

<style scoped>
.v-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.gold-rank {
  color: #FFD700;
  /* Ouro */
}

.silver-rank {
  color: #C0C0C0;
  /* Prata */
}

.bronze-rank {
  color: #CD7F32;
  /* Bronze */
}

.other-place {
  background-color: #e0e0e0;
  /* Cor para os outros lugares */
  color: black;
  /* Cor do texto */
}


.v-card canvas {
  flex-grow: 1;
  /* Faz o gráfico preencher o espaço disponível */
  min-height: 200px;
  /* Limita a altura mínima dos gráficos para telas menores */
  max-height: 300px;
}

@media screen {}
</style>
