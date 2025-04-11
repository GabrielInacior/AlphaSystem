<template>
  <v-container fluid class="dashboard-container pa-6">
    <v-row>
      <!-- Top Clientes - Produtos -->
      <v-col cols="12" md="4">
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
              <span class="text-h6 font-weight-medium">Top Clientes - Produtos</span>
            </div>
            <v-btn variant="plain" size="small">
              <v-icon icon="mdi-information" />
              <v-tooltip activator="parent" location="start">
                Clientes que mais gastaram com produtos, ranqueados por valor gasto
              </v-tooltip>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="periodoVClientesCompraram"
                  :items="periodos"
                  item-title="text"
                  item-value="value"
                  label="Selecione o Período"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
            </v-col>
              <v-col cols="12">
              <v-select
                v-model="categoriaClientesMaisCompraram"
                :items="categorias"
                  item-title="nome"
                  item-value="id"
                label="Filtrar por Categoria"
                density="compact"
                  variant="outlined"
                clearable
                  hide-details
              />
            </v-col>
          </v-row>
            <v-list class="mt-4" style="max-height: 300px; overflow-y: auto;">
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
                  <v-icon size="small" color="primary" class="mr-1">mdi-package-variant</v-icon>
                  {{ cliente.quantidade_produtos_comprados }} Produtos comprados
                </v-list-item-subtitle>
              </v-list-item>
          </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Comparação Lucro vs Gasto -->
      <v-col cols="12" md="4">
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
              <span class="text-h6 font-weight-medium">Comparação Lucro vs Gasto</span>
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="periodoLucroGasto"
                  :items="periodos"
                  item-title="text"
                  item-value="value"
                  label="Selecione o Período"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
            </v-col>
              <v-col cols="12">
              <v-select
                v-model="categoriaLucroGasto"
                :items="categorias"
                  item-title="nome"
                  item-value="id"
                label="Filtrar por Categoria"
                density="compact"
                  variant="outlined"
                clearable
                  hide-details
              />
            </v-col>
          </v-row>
            <div class="chart-container mt-4">
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

      <!-- Produtos Mais Vendidos -->
      <v-col cols="12" md="4">
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
              <span class="text-h6 font-weight-medium">Produtos Mais Vendidos</span>
            </div>
            <v-btn variant="plain" size="small">
              <v-icon icon="mdi-information" />
              <v-tooltip activator="parent" location="start">
                Produtos mais vendidos, ranqueados por quantidade de vendas
              </v-tooltip>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12">
              <v-select
                v-model="periodoMaisVendidos"
                :items="periodos"
                  item-title="text"
                  item-value="value"
                label="Selecione o Período"
                density="compact"
                  variant="outlined"
                  hide-details
              />
            </v-col>
              <v-col cols="12">
              <v-select
                v-model="categoriaProdutosMaisVendidos"
                :items="categorias"
                  item-title="nome"
                  item-value="id"
                label="Filtrar por Categoria"
                density="compact"
                  variant="outlined"
                clearable
                  hide-details
              />
            </v-col>
          </v-row>
            <v-list class="mt-4" style="max-height: 300px; overflow-y: auto;">
              <v-list-item
                v-for="(produto, index) in produtosMaisVendidos"
                :key="index"
                class="mb-2 rounded-lg"
                :class="{'bg-primary-lighten-5': index % 2 === 0}"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="40">
                    <span class="text-h6 text-white">{{ index + 1 }}</span>
                  </v-avatar>
                        </template>
                <v-list-item-title class="font-weight-medium">{{ produto.produto_nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center justify-space-between">
                  <span>
                    <v-icon size="small" color="primary" class="mr-1">mdi-package-variant</v-icon>
                    {{ produto.quantidade_vendida }} vendas
                  </span>
                  <span class="text-success font-weight-bold">
                    R$ {{ produto.total_vendido.toFixed(2) }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item>
          </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- Quantidade de Produtos Vendidos -->
      <v-col cols="12" md="6">
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center py-4 px-6">
            <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
            <span class="text-h6 font-weight-medium">Quantidade de Produtos Vendidos</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6">
            <v-select
                  v-model="periodoVendasProdutos"
                  :items="periodos"
                  item-title="text"
                  item-value="value"
                  label="Selecione o Período"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
              v-model="categoriaVendasProdutos"
              :items="categorias"
                  item-title="nome"
                  item-value="id"
              label="Filtrar por Categoria"
              density="compact"
                  variant="outlined"
              clearable
                  hide-details
            />
              </v-col>
          </v-row>
            <div class="chart-container mt-4">
              <apexchart
                type="line"
                :options="chartOptionsVendas"
                :series="vendasProdutosSeries"
                height="350"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Vendas por Método de Pagamento e Informações -->
      <v-col cols="12" md="6">
        <v-card class="h-100" elevation="2">
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-card-title class="d-flex align-center py-4 px-6">
                <v-icon color="primary" class="mr-2">mdi-credit-card</v-icon>
                <span class="text-h6 font-weight-medium">Vendas por Método de Pagamento</span>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12">
                <v-select
                      v-model="periogoPagamentos"
                      :items="periodos"
                      item-title="text"
                      item-value="value"
                      label="Selecione o Período"
                      density="compact"
                      variant="outlined"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-select
                  v-model="categoriaMetodoPagamento"
                  :items="categorias"
                      item-title="nome"
                      item-value="id"
                  label="Filtrar por Categoria"
                  density="compact"
                      variant="outlined"
                  clearable
                      hide-details
                />
                  </v-col>
              </v-row>
                <div class="chart-container mt-4">
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
                <v-list>
                <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="error" class="mr-4">mdi-alert-circle</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">Produtos sem Estoque</v-list-item-title>
                    <template v-slot:append>
                      <v-btn
                        variant="text"
                        color="error"
                        class="font-weight-bold"
                        @click="goToProdutos"
                      >
                        {{ produtosSemEstoque.length }}
                        <v-icon class="ml-1">mdi-arrow-right</v-icon>
                      </v-btn>
                    </template>
                </v-list-item>

                <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success" class="mr-4">mdi-package-variant</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">Produtos Vendidos no Total</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-h6 font-weight-bold">
                        {{ quantidadeReceitaProdutos.total_produtos_vendidos || '---' }}
                      </span>
                    </template>
                </v-list-item>

                <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="info" class="mr-4">mdi-cash</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">Receita Total com Produtos</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-h6 font-weight-bold text-success">
                        {{ quantidadeReceitaProdutos.receita_total_produtos ?
                           'R$ ' + quantidadeReceitaProdutos.receita_total_produtos.toFixed(2) :
                           '---' }}
                      </span>
                    </template>
                </v-list-item>
              </v-list>
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
  name: 'LojaView',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    const router = useRouter();
    const vendasProdutosSeries = ref<any[]>([]);
    const vendasPorMetodoPagamentoSeries = ref<number[]>([]);
    const lucroVsGastoSeries = ref<number[]>([]);
    const lucroTotal = ref({ lucroTotal: 0, cor: '#42A5F5' });
    const produtosMaisVendidos = ref<any[]>([]);
    const produtosSemEstoque = ref<any[]>([]);
    const quantidadeReceitaProdutos = ref<any>([]);
    const melhoresClientes = ref<any[]>([]);

    // Períodos
    const periodoVendasProdutos = ref('semana');
    const periodoMaisVendidos = ref('semana');
    const periodoVClientesCompraram = ref('semana');
    const periogoPagamentos = ref('semana');
    const periodoLucroGasto = ref('semana');

    // Categorias
    const categoriaVendasProdutos = ref<number | null>(null);
    const categoriaProdutosMaisVendidos = ref<number | null>(null);
    const categoriaClientesMaisCompraram = ref<number | null>(null);
    const categoriaMetodoPagamento = ref<number | null>(null);
    const categoriaLucroGasto = ref<number | null>(null);

    const periodos = [
      { value: 'dia', text: 'Últimas 24 horas' },
      { value: 'semana', text: 'Última Semana' },
      { value: 'mes', text: 'Último Mês' },
      { value: 'ano', text: 'Último Ano' },
      { value: 'todos', text: 'Todos' },
    ];
    const categorias = ref<any[]>([]);

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

    const getVendasProdutosPorData = async (periodo: string) => {
      try {
        const vendasProdutosResponse = await window.api.getVendasProdutosPorData(periodo, categoriaVendasProdutos.value);
        console.log('[VENDAS RESPONSE]', vendasProdutosResponse);

        const labels: string[] = [];
        const dataQuantidade: number[] = [];
        const dataTotalVendido: number[] = [];

        vendasProdutosResponse.forEach((item: any) => {
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
        vendasProdutosSeries.value = [
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

    const getProdutosMaisVendidos = async (periodo: string) => {
      try {
        const produtosResponse = await window.api.getProdutosMaisVendidos(periodo, categoriaProdutosMaisVendidos.value);
        produtosMaisVendidos.value = produtosResponse;
      } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
      }
    };

    const getQuantidadeEReceitaProdutos = async () => {
      const produtosResponse = await window.api.getQuantidadeEReceitaProdutos();
      quantidadeReceitaProdutos.value = produtosResponse;
    };

    const getProdutosSemEstoque = async () => {
      const produtosResponse = await window.api.getProdutosSemEstoque();
      produtosSemEstoque.value = produtosResponse;
    };

    const getClientesMaisCompraramProdutos = async (periodo: string, limite: number) => {
      const clientesResponse = await window.api.getClientesMaisCompraramProdutos(periodo, limite, categoriaClientesMaisCompraram.value);
      melhoresClientes.value = clientesResponse;
    };

    const getVendasProdutosPorMetodoPagamento = async (periodo: string) => {
      const vendasResponse = await window.api.getVendasProdutosPorMetodoPagamento(periodo, categoriaMetodoPagamento.value);
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
      const lucroVsGastoResponse = await window.api.getCustoVsLucro(periodo, categoriaLucroGasto.value);
      console.log(lucroVsGastoResponse);

      const lucroTotalValor = lucroVsGastoResponse.lucro_produtos;
      const lucroTotalCor = lucroTotalValor >= 0 ? '#42A5F5' : '#EF5350';

      lucroVsGastoSeries.value = [
        lucroVsGastoResponse.total_bruto_produtos,
        lucroVsGastoResponse.total_custo_produtos
      ];

      lucroTotal.value = {
        lucroTotal: lucroTotalValor,
        cor: lucroTotalCor,
      };
    };

    const carregarDados = async () => {
      await getVendasProdutosPorData(periodoVendasProdutos.value);
      await getProdutosMaisVendidos(periodoMaisVendidos.value);
      await getClientesMaisCompraramProdutos(periodoVClientesCompraram.value, 50);
      await getLucroVsGasto(periodoLucroGasto.value);
      await getProdutosSemEstoque();
      await getQuantidadeEReceitaProdutos();
      await getVendasProdutosPorMetodoPagamento(periogoPagamentos.value);
    };

    const loadCategorias = async () => {
      try {
        categorias.value = await window.api.getAllCategorias();
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    // Watch para atualizar os gráficos quando o período ou categoria mudar
    watch([periodoMaisVendidos, periodoLucroGasto, categoriaProdutosMaisVendidos, categoriaLucroGasto], async () => {
      try {
        await Promise.all([
          getProdutosMaisVendidos(periodoMaisVendidos.value),
          getLucroVsGasto(periodoLucroGasto.value)
        ]);
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    });

    watch([periodoVClientesCompraram, categoriaClientesMaisCompraram], async () => {
      await getClientesMaisCompraramProdutos(periodoVClientesCompraram.value, 50);
    });

    watch([periogoPagamentos, categoriaMetodoPagamento], async () => {
      await getVendasProdutosPorMetodoPagamento(periogoPagamentos.value);
    });

    watch([periodoVendasProdutos, categoriaVendasProdutos], async () => {
      await getVendasProdutosPorData(periodoVendasProdutos.value);
    });

    const goToProdutos = () => {
      router.push('/produtos');
    };

    onMounted(async () => {
      await loadCategorias();
      await carregarDados();
    });

    return {
      vendasProdutosSeries,
      lucroVsGastoSeries,
      produtosMaisVendidos,
      melhoresClientes,
      periodoVendasProdutos,
      periodoMaisVendidos,
      chartOptionsLucroGasto,
      lucroTotal,
      vendasPorMetodoPagamentoSeries,
      chartOptionsPagamento,
      periodoVClientesCompraram,
      periodoLucroGasto,
      chartOptionsVendas,
      quantidadeReceitaProdutos,
      goToProdutos,
      produtosSemEstoque,
      getRankingColor,
      periodos,
      periogoPagamentos,
      categorias,
      categoriaVendasProdutos,
      categoriaProdutosMaisVendidos,
      categoriaClientesMaisCompraram,
      categoriaMetodoPagamento,
      categoriaLucroGasto
    };
  }
});
</script>

<style scoped>
.dashboard-container {
  background-color: var(--color-background);
  min-height: 100vh;
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
