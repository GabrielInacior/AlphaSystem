<template>
  <v-container fluid class="dashboard-container pa-4">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h5 font-weight-bold welcome-text mb-2">
                Dashboard de Serviços
              </h1>
              <div class="text-subtitle-2 text-white opacity-75">
                Visão geral do seu negócio de serviços
              </div>
            </div>
            <div class="d-flex align-center">
              <v-btn color="white" variant="tonal" class="mr-4" prepend-icon="mdi-file-pdf-box"
                @click="gerarRelatorioServicos" :loading="gerandoRelatorio">
                Gerar Relatório
              </v-btn>
              <v-btn icon variant="text" color="white" class="mr-4" size="small">
                <v-icon>mdi-information</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  <div class="tooltip-content">
                    <p class="font-weight-bold mb-1">Como gerar um relatório:</p>
                    <ol class="mb-0">
                      <li>Clique no botão "Gerar Relatório"</li>
                      <li>O sistema criará um PDF com os dados atuais da tela</li>
                      <li>O arquivo será salvo automaticamente no seu computador</li>
                      <li>Você pode compartilhar este PDF com sua equipe ou clientes</li>
                    </ol>
                    <p class="mt-2 mb-0 text-caption">Dica: Ajuste os filtros de período antes de gerar o relatório para
                      obter dados específicos.</p>
                  </div>
                </v-tooltip>
              </v-btn>
              <v-avatar size="64" class="welcome-avatar">
                <v-icon size="36" color="white">mdi-content-cut</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <!-- Dashboard Cards -->
      <v-col cols="12" md="4">
        <v-card class="dashboard-card" elevation="2" color="info">
          <v-card-text class="d-flex align-center">
            <div class="d-flex flex-column w-100">
              <div class="d-flex align-center mb-2">
                <v-icon color="white" size="20" class="mr-2">mdi-calendar-today</v-icon>
                <span class="text-caption text-white">Hoje</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="48" color="white" class="mr-4">mdi-account-multiple-check</v-icon>
                <div>
                  <div class="text-subtitle-2 text-white">Clientes Atendidos</div>
                  <div class="text-h5 font-weight-bold text-white">
                    {{ clientesAtendidosHoje }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="dashboard-card" elevation="2" color="success">
          <v-card-text class="d-flex align-center">
            <div class="d-flex flex-column w-100">
              <div class="d-flex align-center mb-2">
                <v-icon color="white" size="20" class="mr-2">mdi-calendar-today</v-icon>
                <span class="text-caption text-white">Hoje</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="48" color="white" class="mr-4">mdi-cash-multiple</v-icon>
                <div>
                  <div class="text-subtitle-2 text-white">Receita Total</div>
                  <div class="text-h5 font-weight-bold text-white">
                    R$ {{ (valorAtendimentosHoje || 0).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="dashboard-card" elevation="2" color="primary">
          <v-card-text class="d-flex align-center">
            <div class="d-flex flex-column w-100">
              <div class="d-flex align-center mb-2">
                <v-icon color="white" size="20" class="mr-2">mdi-calendar-today</v-icon>
                <span class="text-caption text-white">Hoje</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="48" color="white" class="mr-4">mdi-star</v-icon>
                <div class="w-100">
                  <div class="text-subtitle-2 text-white">Serviço Mais Vendido</div>
                  <div class="text-h5 font-weight-bold text-white text-truncate" style="max-width: 200px;">
                    {{ servicoMaisVendidoHoje?.servico_nome || 'Nenhum serviço' }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- Top Clientes - Serviços -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="chart-card h-100" elevation="2">
          <v-card-title class="d-flex flex-column py-3 px-4">
            <div class="d-flex align-center justify-space-between w-100 mb-2">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Top Clientes - Serviços</span>
              </div>
            </div>
            <v-select v-model="periodoVClientesCompraram" :items="periodos" item-title="text" item-value="value"
              label="Período" density="compact" class="period-select" variant="outlined" hide-details
              style="max-width: 200px" />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
            <v-list class="mt-2" style="max-height: 250px; overflow-y: auto;">
              <v-list-item v-for="(cliente, index) in melhoresClientes" :key="index" class="mb-1 rounded-lg"
                :class="{ 'bg-primary-lighten-5': index % 2 === 0 }">
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="32">
                    <span class="text-subtitle-2 text-white">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{ cliente.cliente_nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center text-caption">
                  <v-icon size="small" color="primary" class="mr-1">mdi-tools</v-icon>
                  {{ cliente.quantidade_servicos_comprados }} Serviços comprados
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-alert v-if="melhoresClientes.length === 0" type="info" variant="tonal" class="mt-3"
              icon="mdi-information">
              Nenhum cliente encontrado neste período
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Informações Gerais -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="chart-card h-100" elevation="2">
          <v-card-title class="d-flex flex-column py-3 px-4">
            <div class="d-flex align-center justify-space-between w-100 mb-2">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Visão Geral</span>
              </div>
            </div>
            <v-select v-model="periodoLucroGasto" :items="periodos" item-title="text" item-value="value" label="Período"
              density="compact" class="period-select" variant="outlined" hide-details style="max-width: 200px" />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
            <v-row>
              <!-- Card de Lucro Total -->

              <!-- Estatísticas -->
              <v-col cols="6">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="text-center pa-3">
                    <v-icon color="primary" size="32" class="mb-2">mdi-tools</v-icon>
                    <div class="text-h6 font-weight-bold">{{ quantidadeReceitaServicos.total_servicos_vendidos || 0 }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Serviços Vendidos</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="6">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="text-center pa-3">
                    <v-icon color="success" size="32" class="mb-2">mdi-cash</v-icon>
                    <div class="text-h6 font-weight-bold text-success">
                      R$ {{ (quantidadeReceitaServicos.receita_total_servicos || 0).toFixed(2) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Receita Total</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Média por Serviço -->
              <v-col cols="12">
                <v-card class="stat-card" elevation="0">
                  <v-card-text class="d-flex align-center justify-space-between py-2 px-3">
                    <div class="d-flex align-center">
                      <v-icon color="info" size="24" class="mr-2">mdi-chart-areaspline</v-icon>
                      <span class="text-subtitle-1 font-weight-bold">Média por Serviço</span>
                    </div>
                    <span class="text-h6 font-weight-bold text-info">
                      {{ quantidadeReceitaServicos.total_servicos_vendidos &&
                        quantidadeReceitaServicos.receita_total_servicos
                        ?
                        'R$ ' + (quantidadeReceitaServicos.receita_total_servicos /
                          quantidadeReceitaServicos.total_servicos_vendidos).toFixed(2) :
                        'R$ 0,00' }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Serviços Mais Vendidos -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="chart-card h-100" elevation="2">
          <v-card-title class="d-flex flex-column py-3 px-4">
            <div class="d-flex align-center justify-space-between w-100 mb-2">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-tools</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Serviços Mais Vendidos</span>
              </div>
            </div>
            <v-select v-model="periodoMaisVendidos" :items="periodos" item-title="text" item-value="value"
              label="Período" density="compact" class="period-select" variant="outlined" hide-details
              style="max-width: 200px" />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
            <v-list class="mt-2" style="max-height: 250px; overflow-y: auto;">
              <v-list-item v-for="(servico, index) in servicosMaisVendidos" :key="index" class="mb-1 rounded-lg"
                :class="{ 'bg-primary-lighten-5': index % 2 === 0 }">
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="32">
                    <span class="text-subtitle-2 text-white">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{ servico.servico_nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center justify-space-between text-caption">
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
            <v-alert v-if="servicosMaisVendidos.length === 0" type="info" variant="tonal" class="mt-3"
              icon="mdi-information">
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
          <v-card-title class="d-flex flex-column py-4 px-6">
            <div class="d-flex align-center justify-space-between w-100 mb-2">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                <span class="text-h6 font-weight-medium">Quantidade de Serviços Vendidos</span>
              </div>
            </div>
            <v-select v-model="periodoVendasServicos" :items="periodosGraficos" item-title="text" item-value="value"
              label="Período" density="compact" class="period-select" variant="outlined" hide-details
              style="max-width: 200px" />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <div class="chart-container mt-2">
              <apexchart type="line" :options="chartOptionsVendas" :series="vendasServicosSeries" height="350" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>


      <!-- Vendas por Método de Pagamento e Informações -->
      <v-col cols="12" md="6">
        <v-card class="chart-card h-100" elevation="2">
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-card-title class="d-flex flex-column py-3 px-4">
                <div class="d-flex align-center justify-space-between w-100 mb-2">
                  <div class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-credit-card</v-icon>
                    <span class="text-subtitle-1 font-weight-medium">Vendas por Método de Pagamento</span>
                  </div>
                </div>
                <v-select v-model="periogoPagamentos" :items="periodos" item-title="text" item-value="value"
                  label="Período" density="compact" class="period-select" variant="outlined" hide-details
                  style="max-width: 200px" />
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-3">
                <div class="chart-container mt-2">
                  <apexchart type="donut" :options="chartOptionsPagamento" :series="vendasPorMetodoPagamentoSeries"
                    height="250" />
                </div>
              </v-card-text>
            </v-col>

            <v-divider vertical />

            <v-col cols="12" md="6">
              <v-card-title class="d-flex flex-column py-3 px-4">
                <div class="d-flex align-center justify-space-between w-100 mb-2">
                  <div class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-credit-card</v-icon>
                    <span class="text-subtitle-1 font-weight-medium">Insights de Pagamento</span>
                  </div>
                </div>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-3">
                <v-list class="info-list bg-transparent">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-medium-emphasis">Método Mais
                      Utilizado</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold">
                        {{ chartOptionsPagamento.labels[0] || '---' }}
                      </span>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success" class="mr-2">mdi-chart-pie</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-medium-emphasis">Distribuição de
                      Pagamentos</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold text-success">
                        {{ chartOptionsPagamento.labels.length }} métodos
                      </span>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="info" class="mr-2">mdi-percent</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2 text-medium-emphasis">Participação do
                      Principal</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold text-info">
                        {{vendasPorMetodoPagamentoSeries.length > 0 && chartOptionsPagamento.labels.length > 0 ?
                          Math.round((vendasPorMetodoPagamentoSeries[0] / vendasPorMetodoPagamentoSeries.reduce((a, b) =>
                            a + b, 0)) * 100) + '%' :
                          '---'}}
                      </span>
                    </template>
                  </v-list-item>
                </v-list>

                <v-card class="payment-insights-card mt-3" elevation="0">
                  <v-card-text class="d-flex flex-column py-2 px-3">
                    <div class="d-flex align-center mb-1">
                      <v-icon color="white" size="24" class="mr-2">mdi-trending-up</v-icon>
                      <span class="text-subtitle-1 font-weight-bold text-white">Crescimento de Pagamentos</span>
                    </div>
                    <span class="text-h5 font-weight-bold text-white text-break">
                      {{vendasPorMetodoPagamentoSeries.length > 0 ?
                        'R$ ' + vendasPorMetodoPagamentoSeries.reduce((a, b) => a + b, 0).toFixed(2) :
                        '---'}}
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
import type { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Tipos
interface ServicoVendido {
  servico_nome: string;
  quantidade_vendida: number;
  total_vendido: number;
}

interface Cliente {
  cliente_nome: string;
  quantidade_servicos_comprados: number;
}

interface QuantidadeReceita {
  total_servicos_vendidos: number;
  receita_total_servicos: number;
}

// Tipos para as opções do gráfico
interface ChartOptions extends ApexOptions {
  xaxis: {
    categories: string[];
    labels: {
      style: {
        colors: string;
        fontSize: string;
        fontFamily: string;
      };
      rotate?: number;
    };
    axisBorder: {
      show: boolean;
    };
    axisTicks: {
      show: boolean;
    };
  };
}

// Verificar se o componente ApexChart está disponível
console.log('[APEXCHART] Componente disponível:', !!VueApexCharts);

export default defineComponent({
  name: 'BarbeariaView',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    const router = useRouter();
    const vendasServicosSeries = ref<any[]>([]);
    const vendasPorMetodoPagamentoSeries = ref<number[]>([]);
    const lucroTotal = ref({ lucroTotal: 0, cor: '#8B5CF6' });
    const servicosMaisVendidos = ref<ServicoVendido[]>([]);
    const servicosSemEstoque = ref<any[]>([]);
    const quantidadeReceitaServicos = ref<QuantidadeReceita>({ total_servicos_vendidos: 0, receita_total_servicos: 0 });
    const melhoresClientes = ref<Cliente[]>([]);
    const gerandoRelatorio = ref(false);
    const clientesAtendidosHoje = ref(0);
    const valorAtendimentosHoje = ref(0);
    const servicoMaisVendidoHoje = ref<any>(null);

    // Períodos
    const periodoVendasServicos = ref('semana');
    const periodoMaisVendidos = ref('semana');
    const periodoVClientesCompraram = ref('semana');
    const periogoPagamentos = ref('semana');
    const periodoLucroGasto = ref('semana');

    const periodos = [
      { value: 'dia', text: 'Hoje' },
      { value: 'semana', text: 'Última Semana' },
      { value: 'mes', text: 'Último Mês' },
      { value: 'ano', text: 'Último Ano' },
      { value: 'todos', text: 'Todos' },
    ];

    const periodosGraficos = [
      { value: 'dia', text: 'Hoje' },
      { value: 'semana', text: 'Última Semana' },
      { value: 'mes', text: 'Último Mês' },
      { value: 'ano', text: 'Último Ano' },
    ];

    // Opções dos gráficos ApexCharts
    const chartOptionsVendas = ref<ChartOptions>({
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        foreColor: '#94A3B8' // Cor base para todos os textos do gráfico
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        lineCap: 'round'
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        size: 6,
        strokeWidth: 0,
        hover: {
          size: 8
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#94A3B8',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif'
          },
          rotate: -45
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: [
        {
          title: {
            text: 'Quantidade',
            style: {
              color: '#94A3B8',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif'
            }
          },
          labels: {
            style: {
              colors: '#94A3B8',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif'
            }
          }
        }
      ],
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    });
    const chartOptionsPagamento = ref({
      chart: {
        type: 'donut',
        foreColor: '#CBD5E1', // Cor base mais clara para todos os textos do gráfico
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
                color: '#CBD5E1'
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                color: '#CBD5E1',
                formatter: function (val: number) {
                  return 'R$ ' + val.toFixed(2);
                }
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                color: '#CBD5E1',
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
        labels: {
          colors: '#CBD5E1'
        },
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

    const getServicosMaisVendidos = async (periodo: string) => {
      try {
        const servicosResponse = await window.api.getServicosMaisVendidos(periodo);
        servicosMaisVendidos.value = servicosResponse;
      } catch (error) {
        console.error('Erro ao buscar serviços mais vendidos:', error);
      }
    };

    const getQuantidadeEReceitaServicos = async () => {
      try {
        const servicosResponse = await window.api.getQuantidadeEReceitaServicos(periodoLucroGasto.value);
        quantidadeReceitaServicos.value = servicosResponse || {
          total_servicos_vendidos: 0,
          receita_total_servicos: 0
        };
      } catch (error) {
        console.error('Erro ao buscar quantidade e receita:', error);
        quantidadeReceitaServicos.value = {
          total_servicos_vendidos: 0,
          receita_total_servicos: 0
        };
      }
    };

    const getServicosSemEstoque = async () => {
      servicosSemEstoque.value = [];
    };

    const getClientesMaisCompraramServicos = async (periodo: string, limite: number) => {
      const clientesResponse = await window.api.getClientesMaisCompraramServicos(periodo, limite);
      melhoresClientes.value = clientesResponse;
    };

    const getVendasServicosPorMetodoPagamento = async (periodo: string) => {
      try {
        const vendasResponse = await window.api.getVendasServicosPorMetodoPagamento(periodo);
        const labels: string[] = [];
        const data: number[] = [];

        if (vendasResponse && Array.isArray(vendasResponse)) {
          vendasResponse.forEach((item: any) => {
            if (item && item.metodo && typeof item.total_vendas === 'number') {
              labels.push(item.metodo);
              data.push(item.total_vendas);
            }
          });
        }

        chartOptionsPagamento.value.labels = labels;
        vendasPorMetodoPagamentoSeries.value = data;
      } catch (error) {
        console.error('Erro ao buscar vendas por método de pagamento:', error);
        chartOptionsPagamento.value.labels = [];
        vendasPorMetodoPagamentoSeries.value = [];
      }
    };

    const getVendasServicosPorData = async (periodo: string) => {
      try {
        const vendasServicosResponse = await window.api.getVendasServicosPorData(periodo);
        console.log('[VENDAS SERVIÇOS RESPONSE]', vendasServicosResponse);

        const labels: string[] = [];
        const dataQuantidade: number[] = [];
        const dataTotalVendido: number[] = [];
        const hoje = new Date();

        switch (periodo) {
          case 'dia': {
            vendasServicosResponse.forEach(item => {
              const dataHora = new Date(item.periodo);

              // Subtrair 3 horas
              dataHora.setHours(dataHora.getHours() - 3);

              // Formatar a hora no formato correto
              const horaFormatada = dataHora.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              });

              labels.push(horaFormatada);
              dataQuantidade.push(Number(item.quantidade_vendida));
              dataTotalVendido.push(Number(item.total_vendido));
            });

            const dados = labels.map((label, index) => ({
              hora: parseInt(label),
              label,
              quantidade: dataQuantidade[index],
              total: dataTotalVendido[index]
            })).sort((a, b) => a.hora - b.hora);

            labels.splice(0, labels.length, ...dados.map(d => d.label));
            dataQuantidade.splice(0, dataQuantidade.length, ...dados.map(d => d.quantidade));
            dataTotalVendido.splice(0, dataTotalVendido.length, ...dados.map(d => d.total));
            break;
          }


          case 'semana': {
            const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            const dataInicio = new Date(hoje);
            dataInicio.setDate(hoje.getDate() - 6);
            const dadosExistentes = new Map();

            vendasServicosResponse.forEach(item => {
              const data = new Date(item.periodo);
              dadosExistentes.set(data.getDay(), {
                quantidade: Number(item.quantidade_vendida),
                total: Number(item.total_vendido)
              });
            });

            for (let i = 0; i < 7; i++) {
              const data = new Date(dataInicio);
              data.setDate(dataInicio.getDate() + i);
              const dados = dadosExistentes.get(data.getDay()) || { quantidade: 0, total: 0 };

              labels.push(diasSemana[data.getDay()]);
              dataQuantidade.push(dados.quantidade);
              dataTotalVendido.push(dados.total);
            }

            break;
          }

          case 'mes': {
            // Criar um Map para agrupar os dados por data
            const dadosPorData = new Map<string, { quantidade: number; total: number }>();

            vendasServicosResponse.forEach(item => {
              const data = new Date(item.periodo);
              const dataFormatada = data.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit'
              });

              if (!dadosPorData.has(dataFormatada)) {
                dadosPorData.set(dataFormatada, {
                  quantidade: 0,
                  total: 0
                });
              }

              const dadosAtuais = dadosPorData.get(dataFormatada)!;
              dadosPorData.set(dataFormatada, {
                quantidade: dadosAtuais.quantidade + Number(item.quantidade_vendida),
                total: dadosAtuais.total + Number(item.total_vendido)
              });
            });

            // Converter o Map para arrays ordenados
            const dadosOrdenados = Array.from(dadosPorData.entries())
              .map(([data, valores]) => ({
                data: new Date(`2024-${data.split('/')[1]}-${data.split('/')[0]}`),
                label: data,
                quantidade: valores.quantidade,
                total: valores.total
              }))
              .sort((a, b) => a.data.getTime() - b.data.getTime());

            // Atualizar os arrays de dados
            labels.splice(0, labels.length, ...dadosOrdenados.map(d => d.label));
            dataQuantidade.splice(0, dataQuantidade.length, ...dadosOrdenados.map(d => d.quantidade));
            dataTotalVendido.splice(0, dataTotalVendido.length, ...dadosOrdenados.map(d => d.total));
            break;
          }

          case 'ano': {
            const meses = [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];

            const dadosPorMes = new Map<number, { quantidade: number; total: number }>();
            for (let i = 0; i < 12; i++) {
              dadosPorMes.set(i, { quantidade: 0, total: 0 });
            }

            vendasServicosResponse.forEach(item => {
              const [ano, mes] = item.periodo.split('-').map(Number);
              const dateObj = new Date(ano, mes - 1);
              const mesIndex = dateObj.getMonth();

              const atual = dadosPorMes.get(mesIndex)!;
              dadosPorMes.set(mesIndex, {
                quantidade: atual.quantidade + Number(item.quantidade_vendida),
                total: atual.total + Number(item.total_vendido)
              });
            });

            for (let i = 0; i < 12; i++) {
              const dados = dadosPorMes.get(i)!;
              labels.push(meses[i]);
              dataQuantidade.push(dados.quantidade);
              dataTotalVendido.push(dados.total);
            }

            break;
          }
        }

        chartOptionsVendas.value = {
          ...chartOptionsVendas.value,
          xaxis: {
            ...chartOptionsVendas.value.xaxis,
            categories: labels
          }
        };

        vendasServicosSeries.value = [
          {
            name: 'Quantidade Vendida',
            data: dataQuantidade,
            color: '#2196F3'
          },
          {
            name: 'Valor Total Vendido (R$)',
            data: dataTotalVendido,
            color: '#4CAF50'
          }
        ];

      } catch (error) {
        console.error('Erro ao buscar dados de serviços:', error);
        chartOptionsVendas.value.xaxis.categories = [];
        vendasServicosSeries.value = [
          {
            name: 'Quantidade Vendida',
            data: [],
            color: '#2196F3'
          },
          {
            name: 'Valor Total Vendido (R$)',
            data: [],
            color: '#4CAF50'
          }
        ];
      }
    };


    const getClientesAtendidosHoje = async () => {
      try {
        const response = await window.api.getClientesAtendidosHoje();
        clientesAtendidosHoje.value = response?.total_clientes || 0;
      } catch (error) {
        console.error('Erro ao buscar clientes atendidos hoje:', error);
        clientesAtendidosHoje.value = 0;
      }
    };

    const getValorAtendimentosHoje = async () => {
      try {
        const response = await window.api.getValorAtendimentosHoje();
        valorAtendimentosHoje.value = response?.valor_total || 0;
      } catch (error) {
        console.error('Erro ao buscar valor dos atendimentos de hoje:', error);
        valorAtendimentosHoje.value = 0;
      }
    };

    const getServicoMaisVendidoHoje = async () => {
      try {
        const response = await window.api.getServicoMaisVendidoHoje();
        servicoMaisVendidoHoje.value = response;
      } catch (error) {
        console.error('Erro ao buscar serviço mais vendido hoje:', error);
        servicoMaisVendidoHoje.value = null;
      }
    };

    // Modificar a função carregarDados
    const carregarDados = async () => {
      await getVendasServicosPorData(periodoVendasServicos.value);
      await getServicosMaisVendidos(periodoMaisVendidos.value);
      await getClientesMaisCompraramServicos(periodoVClientesCompraram.value, 50);
      await getServicosSemEstoque();
      await getQuantidadeEReceitaServicos();
      await getVendasServicosPorMetodoPagamento(periogoPagamentos.value);
      await getClientesAtendidosHoje();
      await getValorAtendimentosHoje();
      await getServicoMaisVendidoHoje();
    };

    // Watch para atualizar o gráfico quando o período mudar
    watch(periodoVendasServicos, async (newPeriodo) => {
      await getVendasServicosPorData(newPeriodo);
    });

    // Adicionar watchers para os outros períodos
    watch(periodoMaisVendidos, async (newPeriodo) => {
      await getServicosMaisVendidos(newPeriodo);
    });

    watch(periodoVClientesCompraram, async (newPeriodo) => {
      await getClientesMaisCompraramServicos(newPeriodo, 50);
    });

    watch(periogoPagamentos, async (newPeriodo) => {
      await getVendasServicosPorMetodoPagamento(newPeriodo);
    });

    watch(periodoLucroGasto, async (newPeriodo) => {
      await getQuantidadeEReceitaServicos();
    });

    onMounted(async () => {
      await carregarDados();
    });

    const goToProdutos = () => {
      router.push('/produtos');
    };

    const gerarRelatorioServicos = async () => {
      try {
        gerandoRelatorio.value = true;

        // Criar um novo documento PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();

        // Título do relatório
        pdf.setFontSize(20);
        pdf.setTextColor(99, 102, 241); // Cor roxa
        pdf.text('Relatório de Serviços', pageWidth / 2, 20, { align: 'center' });

        // Data e hora da geração
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR');
        pdf.text(`Gerado em: ${dataAtual} às ${horaAtual}`, pageWidth / 2, 30, { align: 'center' });

        // Informações de período
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Período do Relatório:', 20, 45);

        // Adicionar informações de período selecionado
        const periodoText = periodos.find(p => p.value === periodoVendasServicos.value)?.text || 'Período não definido';
        pdf.setFontSize(10);
        pdf.text(`Vendas: ${periodoText}`, 30, 55);

        const periodoMaisVendidosText = periodos.find(p => p.value === periodoMaisVendidos.value)?.text || 'Período não definido';
        pdf.text(`Serviços Mais Vendidos: ${periodoMaisVendidosText}`, 30, 62);

        const periodoClientesText = periodos.find(p => p.value === periodoVClientesCompraram.value)?.text || 'Período não definido';
        pdf.text(`Clientes: ${periodoClientesText}`, 30, 69);

        const periodoPagamentosText = periodos.find(p => p.value === periogoPagamentos.value)?.text || 'Período não definido';
        pdf.text(`Pagamentos: ${periodoPagamentosText}`, 30, 76);

        // Resumo de vendas
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Resumo de Vendas', 20, 90);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Total de Serviços Vendidos: ${quantidadeReceitaServicos.value?.total_servicos_vendidos || 0}`, 30, 100);
        pdf.text(`Receita Total: R$ ${quantidadeReceitaServicos.value?.receita_total_servicos?.toFixed(2) || '0.00'}`, 30, 107);

        // Serviços mais vendidos
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Serviços Mais Vendidos', 20, 120);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);

        let yPos = 130;
        servicosMaisVendidos.value.slice(0, 5).forEach((servico, index) => {
          pdf.text(`${index + 1}. ${servico.servico_nome}`, 30, yPos);
          pdf.text(`   Quantidade: ${servico.quantidade_vendida} | Total: R$ ${servico.total_vendido.toFixed(2)}`, 30, yPos + 7);
          yPos += 15;
        });

        // Clientes que mais compraram
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Clientes que Mais Compraram', 20, yPos + 10);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);

        yPos += 20;
        melhoresClientes.value.slice(0, 5).forEach((cliente, index) => {
          pdf.text(`${index + 1}. ${cliente.cliente_nome}`, 30, yPos);
          pdf.text(`   Serviços comprados: ${cliente.quantidade_servicos_comprados}`, 30, yPos + 7);
          yPos += 15;
        });

        // Métodos de Pagamento
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Métodos de Pagamento', 20, yPos + 10);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);

        yPos += 20;

        // Obter os métodos de pagamento do gráfico de donut
        const metodosPagamento = chartOptionsPagamento.value.labels || [];
        const valoresPagamento = vendasPorMetodoPagamentoSeries.value || [];

        // Calcular o total de vendas por método de pagamento
        const totalVendas = valoresPagamento.reduce((sum, val) => sum + val, 0);

        // Adicionar cada método de pagamento com sua porcentagem
        metodosPagamento.forEach((metodo, index) => {
          const valor = valoresPagamento[index] || 0;
          const porcentagem = totalVendas > 0 ? ((valor / totalVendas) * 100).toFixed(1) : '0.0';

          pdf.text(`${index + 1}. ${metodo}`, 30, yPos);
          pdf.text(`   Valor: R$ ${valor.toFixed(2)} | ${porcentagem}% do total`, 30, yPos + 7);
          yPos += 15;
        });

        // Salvar o PDF
        pdf.save('relatorio-servicos.pdf');

        gerandoRelatorio.value = false;
      } catch (error) {
        console.error('Erro ao gerar relatório de serviços:', error);
        gerandoRelatorio.value = false;
      }
    };

    return {
      vendasServicosSeries,
      servicosMaisVendidos,
      melhoresClientes,
      periodoVendasServicos,
      periodoMaisVendidos,
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
      gerarRelatorioServicos,
      gerandoRelatorio,
      clientesAtendidosHoje,
      valorAtendimentosHoje,
      periodosGraficos,
      servicoMaisVendidoHoje
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
  border-radius: 12px;
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
  border-radius: 12px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06);
}

.chart-container {
  position: relative;
  height: 100%;
  min-height: 250px;
}

.profit-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.info-list {
  border-radius: 8px;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Vuetify Overrides */
:deep(.v-list-item) {
  min-height: 48px;
  padding: 4px 12px;
}

:deep(.v-list-item--active) {
  background: transparent;
}

:deep(.v-card-title) {
  font-size: 1rem;
}

:deep(.v-select .v-field) {
  border-radius: 6px;
  min-height: 32px;
}

:deep(.v-select .v-field__input) {
  padding-top: 4px;
  padding-bottom: 4px;
}

:deep(.v-select .v-field__append-inner) {
  padding-top: 4px;
}

:deep(.v-alert) {
  border-radius: 6px;
}

.stat-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  border: 1px solid rgba(var(--v-border-color), 0.12);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1);
}

.text-info {
  color: #0EA5E9 !important;
}

@media (max-width: 1366px) {
  .dashboard-container {
    padding: 8px !important;
  }

  .chart-container {
    min-height: 200px;
  }

  :deep(.v-select .v-field) {
    font-size: 0.875rem;
  }

  .welcome-card {
    border-radius: 8px;
  }

  .chart-card {
    border-radius: 8px;
  }

  .stat-card {
    margin-bottom: 8px;
  }

  .text-h6 {
    font-size: 1.1rem !important;
  }

  .text-subtitle-1 {
    font-size: 0.9rem !important;
  }
}

.payment-insights-card {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 8px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.text-break {
  word-break: break-word;
  white-space: normal;
}

@media (max-width: 1366px) {
  .payment-insights-card .text-h5 {
    font-size: 1.1rem !important;
  }
}
</style>
