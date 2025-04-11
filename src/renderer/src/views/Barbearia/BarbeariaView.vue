<template>
  <v-container fluid class="dashboard-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Dashboard de Serviços
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Visão geral do seu negócio de serviços
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-img src="@/assets/logo.png" alt="Logo" />
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- Top Clientes - Serviços -->
      <v-col cols="12" md="4">
        <v-card class="chart-card h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
              <span class="text-h6 font-weight-medium">Top Clientes - Serviços</span>
            </div>
            <v-select
              v-model="periodoVClientesCompraram"
              :items="periodos"
              item-title="text"
              item-value="value"
              label="Período"
              density="compact"
              class="period-select"
              variant="outlined"
              hide-details
              style="max-width: 200px"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-list class="mt-2" style="max-height: 300px; overflow-y: auto;">
              <v-list-item
                v-for="(cliente, index) in melhoresClientes"
                :key="index"
                class="mb-2 rounded-lg"
                :class="{'bg-primary-lighten-5': index % 2 === 0}"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="40">
                    <span class="text-h6 text-white">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ cliente.cliente_nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon size="small" color="primary" class="mr-1">mdi-tools</v-icon>
                  {{ cliente.quantidade_servicos_comprados }} Serviços comprados
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-alert
              v-if="melhoresClientes.length === 0"
              type="info"
              variant="tonal"
              class="mt-4"
              icon="mdi-information"
            >
              Nenhum cliente encontrado neste período
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Comparação Lucro vs Gasto -->
      <v-col cols="12" md="4">
        <v-card class="chart-card h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
              <span class="text-h6 font-weight-medium">Comparação Lucro vs Gasto</span>
            </div>
            <v-select
              v-model="periodoLucroGasto"
              :items="periodos"
              item-title="text"
              item-value="value"
              label="Período"
              density="compact"
              class="period-select"
              variant="outlined"
              hide-details
              style="max-width: 200px"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <div class="chart-container mt-2">
              <apexchart
                type="donut"
                :options="chartOptionsLucroGasto"
                :series="lucroVsGastoSeries"
                height="300"
              />
            </div>
            <v-card class="profit-card mt-4" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon :color="lucroTotal.cor" size="32" class="mr-4">mdi-chart-line</v-icon>
                  <span class="text-h6 font-weight-bold" :style="{ color: lucroTotal.cor }">
                    {{ lucroTotal.lucroTotal >= 0 ? 'Lucro Total' : 'Prejuízo Total' }}
                  </span>
                </div>
                <span class="text-h4 font-weight-bold" :style="{ color: lucroTotal.cor }">
                  R$ {{ lucroTotal.lucroTotal.toFixed(2) }}
                </span>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Serviços Mais Vendidos -->
      <v-col cols="12" md="4">
        <v-card class="chart-card h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-tools</v-icon>
              <span class="text-h6 font-weight-medium">Serviços Mais Vendidos</span>
            </div>
            <v-select
              v-model="periodoMaisVendidos"
              :items="periodos"
              item-title="text"
              item-value="value"
              label="Período"
              density="compact"
              class="period-select"
              variant="outlined"
              hide-details
              style="max-width: 200px"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-list class="mt-2" style="max-height: 300px; overflow-y: auto;">
              <v-list-item
                v-for="(servico, index) in servicosMaisVendidos"
                :key="index"
                class="mb-2 rounded-lg"
                :class="{'bg-primary-lighten-5': index % 2 === 0}"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="40">
                    <span class="text-h6 text-white">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ servico.servico_nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center justify-space-between">
                  <span>
                    <v-icon size="small" color="primary" class="mr-1">mdi-tools</v-icon>
                    {{ servico.quantidade_vendida }} vendas
                  </span>
                  <span class="text-success font-weight-bold">
                    R$ {{ servico.total_vendido.toFixed(2) }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-alert
              v-if="servicosMaisVendidos.length === 0"
              type="info"
              variant="tonal"
              class="mt-4"
              icon="mdi-information"
            >
              Nenhum serviço vendido neste período
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- Quantidade de Serviços Vendidos -->
      <v-col cols="12" md="6">
        <v-card class="chart-card h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
              <span class="text-h6 font-weight-medium">Quantidade de Serviços Vendidos</span>
            </div>
            <v-select
              v-model="periodoVendasServicos"
              :items="periodos"
              item-title="text"
              item-value="value"
              label="Período"
              density="compact"
              class="period-select"
              variant="outlined"
              hide-details
              style="max-width: 200px"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <div class="chart-container mt-2">
              <apexchart
                type="line"
                :options="chartOptionsVendas"
                :series="vendasServicosSeries"
                height="350"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Vendas por Método de Pagamento e Informações -->
      <v-col cols="12" md="6">
        <v-card class="chart-card h-100" elevation="2">
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
                <div class="d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-credit-card</v-icon>
                  <span class="text-h6 font-weight-medium">Vendas por Método de Pagamento</span>
                </div>
                <v-select
                  v-model="periogoPagamentos"
                  :items="periodos"
                  item-title="text"
                  item-value="value"
                  label="Período"
                  density="compact"
                  class="period-select"
                  variant="outlined"
                  hide-details
                  style="max-width: 200px"
                />
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <div class="chart-container mt-2">
                  <apexchart
                    type="donut"
                    :options="chartOptionsPagamento"
                    :series="vendasPorMetodoPagamentoSeries"
                    height="300"
                  />
                </div>
              </v-card-text>
            </v-col>

            <v-divider vertical />

            <v-col cols="12" md="6">
              <v-card-title class="d-flex align-center py-4 px-6">
                <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                <span class="text-h6 font-weight-medium">Informações Adicionais</span>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <v-list class="info-list bg-transparent">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success" class="mr-4">mdi-tools</v-icon>
                    </template>
                    <v-list-item-title class="text-subtitle-2 text-medium-emphasis">Serviços Vendidos no Total</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-h6 font-weight-bold">
                        {{ quantidadeReceitaServicos.total_servicos_vendidos || '---' }}
                      </span>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="info" class="mr-4">mdi-cash</v-icon>
                    </template>
                    <v-list-item-title class="text-subtitle-2 text-medium-emphasis">Receita Total com Serviços</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-h6 font-weight-bold text-success">
                        {{ quantidadeReceitaServicos.receita_total_servicos ?
                           'R$ ' + quantidadeReceitaServicos.receita_total_servicos.toFixed(2) :
                           '---' }}
                      </span>
                    </template>
                  </v-list-item>
                </v-list>

                <v-card class="profit-card mt-4" elevation="0">
                  <v-card-text class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="white" size="32" class="mr-4">mdi-chart-line</v-icon>
                      <span class="text-h6 font-weight-bold text-white">Média por Serviço</span>
                    </div>
                    <span class="text-h4 font-weight-bold text-white">
                      {{ quantidadeReceitaServicos.total_servicos_vendidos && quantidadeReceitaServicos.receita_total_servicos ?
                         'R$ ' + (quantidadeReceitaServicos.receita_total_servicos / quantidadeReceitaServicos.total_servicos_vendidos).toFixed(2) :
                         '---' }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'BarbeariaView',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    const router = useRouter();
    const vendasServicosSeries = ref<any[]>([]);
    const vendasPorMetodoPagamentoSeries = ref<number[]>([]);
    const lucroVsGastoSeries = ref<number[]>([]);
    const lucroTotal = ref({ lucroTotal: 0, cor: '#42A5F5' });
    const servicosMaisVendidos = ref<any[]>([]);
    const servicosSemEstoque = ref<any[]>([]);
    const quantidadeReceitaServicos = ref<any>([]);
    const melhoresClientes = ref<any[]>([]);

    // Períodos
    const periodoVendasServicos = ref('semana');
    const periodoMaisVendidos = ref('semana');
    const periodoVClientesCompraram = ref('semana');
    const periogoPagamentos = ref('semana');
    const periodoLucroGasto = ref('semana');

    const periodos = [
      { value: 'dia', text: 'Últimas 24 horas' },
      { value: 'semana', text: 'Última Semana' },
      { value: 'mes', text: 'Último Mês' },
      { value: 'ano', text: 'Último Ano' },
      { value: 'todos', text: 'Todos' },
    ];

    // Opções dos gráficos ApexCharts
    const chartOptionsVendas = ref({
      chart: {
        type: 'line',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 3,
          left: 1,
          top: 1
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        borderColor: '#f1f1f1',
        row: {
          colors: ['transparent', 'transparent'],
          opacity: 0.5
        }
      },
      markers: {
        size: 4,
        colors: ['#FF6B6B', '#4CAF50'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#666'
          }
        }
      },
      yaxis: [
        {
          title: {
            text: 'Quantidade',
            style: {
              color: '#FF6B6B'
            }
          },
          labels: {
            style: {
              colors: '#666'
            }
          }
        },
        {
          opposite: true,
          title: {
            text: 'Valor Total (R$)',
            style: {
              color: '#4CAF50'
            }
          },
          labels: {
            style: {
              colors: '#666'
            },
            formatter: (value: number) => 'R$ ' + value.toFixed(2)
          }
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: [
          {
            formatter: (value: number) => value.toFixed(0)
          },
          {
            formatter: (value: number) => 'R$ ' + value.toFixed(2)
          }
        ]
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      }
    });

    const chartOptionsPagamento = ref({
      chart: {
        type: 'donut',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 3,
          left: 1,
          top: 1
        }
      },
      labels: [],
      colors: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EF5350'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                color: '#1a202c'
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                color: '#1a202c',
                formatter: function (val: number) {
                  return 'R$ ' + val.toFixed(2);
                }
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                color: '#1a202c',
                formatter: function (w: any) {
                  const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                  return 'R$ ' + total.toFixed(2);
                }
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        markers: {
          width: 12,
          height: 12,
          radius: 6
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        },
        y: {
          formatter: function (val: number) {
            return 'R$ ' + val.toFixed(2);
          }
        }
      }
    });

    const chartOptionsLucroGasto = ref({
      chart: {
        type: 'donut',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 3,
          left: 1,
          top: 1
        }
      },
      labels: ['Vendas', 'Custo'],
      colors: ['#1976D2', '#EF5350'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                color: '#1a202c'
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                color: '#1a202c',
                formatter: function (val: number) {
                  return 'R$ ' + val.toFixed(2);
                }
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        markers: {
          width: 12,
          height: 12,
          radius: 6
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        },
        y: {
          formatter: function (val: number) {
            return 'R$ ' + val.toFixed(2);
          }
        }
      }
    });

    const getRankingColor = (index: number) => {
      if (index === 0) return '#FFD700'; // Ouro
      if (index === 1) return '#C0C0C0'; // Prata
      if (index === 2) return '#CD7F32'; // Bronze
      return '#42A5F5'; // Azul padrão
    };

    const getVendasServicosPorData = async (periodo: string) => {
      try {
        const vendasServicosResponse = await window.api.getVendasServicosPorData(periodo);
        console.log('[VENDAS RESPONSE]', vendasServicosResponse);

        const labels: string[] = [];
        const dataQuantidade: number[] = [];
        const dataTotalVendido: number[] = [];

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
              let diaSemana = new Date(item.periodo).getDay();
              diaSemana = (diaSemana + 1) % 7;
              label = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][diaSemana];
              break;
            case 'mes':
              const dataInicio = new Date(item.periodo);
              const dataFim = new Date(dataInicio);
              dataFim.setDate(dataFim.getDate() + 1);
              const formatarData = (data: Date) =>
                data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
              label = `${formatarData(dataInicio)} a ${formatarData(dataFim)}`;
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

          labels.push(label);
          dataQuantidade.push(Number(item.quantidade_total_vendida));
          dataTotalVendido.push(Number(item.total_vendido));
        });

        chartOptionsVendas.value.xaxis.categories = labels;
        vendasServicosSeries.value = [
          {
            name: 'Quantidade Vendida',
            data: dataQuantidade,
            color: '#FF6B6B'
          },
          {
            name: 'Valor Total Vendido (R$)',
            data: dataTotalVendido,
            color: '#4CAF50'
          }
        ];
      } catch (error) {
        console.error('Erro ao buscar dados de vendas:', error);
      }
    };

    const getServicosMaisVendidos = async (periodo: string) => {
      try {
        const servicosResponse = await window.api.getServicosMaisVendidos(periodo);
        servicosMaisVendidos.value = servicosResponse;
      } catch (error) {
        console.error('Erro ao buscar serviços mais vendidos:', error);
      }
    };

    const getQuantidadeEReceitaServicos = async () => {
      const servicosResponse = await window.api.getQuantidadeEReceitaServicos();
      quantidadeReceitaServicos.value = servicosResponse;
    };

    const getServicosSemEstoque = async () => {
      const servicosResponse = await window.api.getServicosSemEstoque();
      servicosSemEstoque.value = servicosResponse;
    };

    const getClientesMaisCompraramServicos = async (periodo: string, limite: number) => {
      const clientesResponse = await window.api.getClientesMaisCompraramServicos(periodo, limite);
      melhoresClientes.value = clientesResponse;
    };

    const getVendasServicosPorMetodoPagamento = async (periodo: string) => {
      const vendasResponse = await window.api.getVendasServicosPorMetodoPagamento(periodo);
      const labels: string[] = [];
      const data: number[] = [];

      vendasResponse.forEach((item: any) => {
        labels.push(item.metodo);
        data.push(item.total_vendas);
      });

      chartOptionsPagamento.value.labels = labels;
      vendasPorMetodoPagamentoSeries.value = data;
    };

    const getLucroVsGasto = async (periodo: string) => {
      const lucroVsGastoResponse = await window.api.getCustoVsLucro(periodo);
      console.log(lucroVsGastoResponse);

      const lucroTotalValor = lucroVsGastoResponse.lucro_servicos;
      const lucroTotalCor = lucroTotalValor >= 0 ? '#42A5F5' : '#EF5350';

      lucroVsGastoSeries.value = [
        lucroVsGastoResponse.total_bruto_servicos,
        lucroVsGastoResponse.total_custo_servicos
      ];

      lucroTotal.value = {
        lucroTotal: lucroTotalValor,
        cor: lucroTotalCor,
      };
    };

    const carregarDados = async () => {
      await getVendasServicosPorData(periodoVendasServicos.value);
      await getServicosMaisVendidos(periodoMaisVendidos.value);
      await getClientesMaisCompraramServicos(periodoVClientesCompraram.value, 50);
      await getLucroVsGasto(periodoLucroGasto.value);
      await getServicosSemEstoque();
      await getQuantidadeEReceitaServicos();
      await getVendasServicosPorMetodoPagamento(periogoPagamentos.value);
    };

    // Watch para atualizar os gráficos quando o período mudar
    watch([periodoMaisVendidos, periodoLucroGasto], async () => {
      try {
        await Promise.all([
          getServicosMaisVendidos(periodoMaisVendidos.value),
          getLucroVsGasto(periodoLucroGasto.value)
        ]);
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    });

    watch([periodoVClientesCompraram], async () => {
      await getClientesMaisCompraramServicos(periodoVClientesCompraram.value, 50);
    });

    watch([periogoPagamentos], async () => {
      await getVendasServicosPorMetodoPagamento(periogoPagamentos.value);
    });

    watch([periodoVendasServicos], async () => {
      await getVendasServicosPorData(periodoVendasServicos.value);
    });

    const goToProdutos = () => {
      router.push('/produtos');
    };

    onMounted(async () => {
      await carregarDados();
    });

    return {
      vendasServicosSeries,
      lucroVsGastoSeries,
      servicosMaisVendidos,
      melhoresClientes,
      periodoVendasServicos,
      periodoMaisVendidos,
      chartOptionsLucroGasto,
      lucroTotal,
      vendasPorMetodoPagamentoSeries,
      chartOptionsPagamento,
      periodoVClientesCompraram,
      periodoLucroGasto,
      chartOptionsVendas,
      quantidadeReceitaServicos,
      goToProdutos,
      servicosSemEstoque,
      getRankingColor,
      periodos,
      periogoPagamentos,
    };
  }
});
</script>

<style scoped>
.dashboard-container {
  background-color: var(--color-background);
  min-height: 100vh;
}

.welcome-card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 16px;
  overflow: hidden;
}

.welcome-text {
  color: white;
}

.welcome-avatar {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.chart-card {
  border-radius: 16px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06);
}

.chart-container {
  position: relative;
  height: 100%;
  min-height: 300px;
}

.profit-card {
  border-radius: 12px;
  padding: 16px;
}

.info-list {
  border-radius: 12px;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Vuetify Overrides */
:deep(.v-list-item) {
  min-height: 64px;
  padding: 8px 16px;
}

:deep(.v-list-item--active) {
  background: transparent;
}

:deep(.v-card-title) {
  font-size: 1.25rem;
}

:deep(.v-select .v-field) {
  border-radius: 8px;
}

:deep(.v-alert) {
  border-radius: 8px;
}
</style>
