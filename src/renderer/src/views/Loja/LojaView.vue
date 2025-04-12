<template>
  <v-container fluid class="dashboard-container pa-4">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h5 font-weight-bold welcome-text mb-2">
                Dashboard de Produtos
              </h1>
              <div class="text-subtitle-2 text-white opacity-75">
                Visão geral do seu negócio de produtos
              </div>
            </div>
            <div class="d-flex align-center">
              <v-btn
                color="white"
                variant="tonal"
                class="mr-4"
                prepend-icon="mdi-file-pdf-box"
                @click="gerarRelatorioProdutos"
                :loading="gerandoRelatorio"
              >
                Gerar Relatório
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="white"
                class="mr-4"
                size="small"
              >
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
                    <p class="mt-2 mb-0 text-caption">Dica: Ajuste os filtros de período antes de gerar o relatório para obter dados específicos.</p>
                  </div>
                </v-tooltip>
              </v-btn>
              <v-avatar size="48" class="welcome-avatar">
                <v-img src="@/assets/logo.png" alt="Logo" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Top Clientes - Produtos -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
              <span class="text-subtitle-1 font-weight-medium">Top Clientes - Produtos</span>
            </div>
            <v-btn variant="plain" size="small">
              <v-icon icon="mdi-information" />
              <v-tooltip activator="parent" location="start">
                Clientes que mais gastaram com produtos, ranqueados por valor gasto
              </v-tooltip>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
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
            <v-list class="mt-3" style="max-height: 250px; overflow-y: auto;">
              <v-list-item
                v-for="(cliente, index) in melhoresClientes"
                :key="index"
                class="mb-1 rounded-lg"
                :class="{'bg-primary-lighten-5': index % 2 === 0}"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="32">
                    <span class="text-subtitle-2 text-white">{{ index + 1 }}</span>
                  </v-avatar>
                          </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{ cliente.cliente_nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center text-caption">
                  <v-icon size="small" color="primary" class="mr-1">mdi-package-variant</v-icon>
                  {{ cliente.quantidade_produtos_comprados }} Produtos comprados
                </v-list-item-subtitle>
              </v-list-item>
          </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Comparação Lucro vs Gasto -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center py-3 px-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
              <span class="text-subtitle-1 font-weight-medium">Comparação Lucro vs Gasto</span>
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
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
            <div class="chart-container mt-3">
              <apexchart
                type="donut"
                :options="chartOptionsLucroGasto"
                :series="lucroVsGastoSeries"
                height="250"
              />
            </div>
            <v-card class="profit-card mt-3" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between py-2 px-3">
                <div class="d-flex align-center">
                  <v-icon :color="lucroTotal.cor" size="24" class="mr-2">mdi-chart-line</v-icon>
                  <span class="text-subtitle-1 font-weight-bold" :style="{ color: lucroTotal.cor }">
                    {{ lucroTotal.lucroTotal >= 0 ? 'Lucro Total' : 'Prejuízo Total' }}
              </span>
                </div>
                <span class="text-h5 font-weight-bold" :style="{ color: lucroTotal.cor }">
                  R$ {{ lucroTotal.lucroTotal.toFixed(2) }}
                </span>
              </v-card-text>
          </v-card>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Produtos Mais Vendidos -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
              <span class="text-subtitle-1 font-weight-medium">Produtos Mais Vendidos</span>
            </div>
            <v-btn variant="plain" size="small">
              <v-icon icon="mdi-information" />
              <v-tooltip activator="parent" location="start">
                Produtos mais vendidos, ranqueados por quantidade de vendas
              </v-tooltip>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
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
            <v-list class="mt-3" style="max-height: 250px; overflow-y: auto;">
              <v-list-item
                v-for="(produto, index) in produtosMaisVendidos"
                :key="index"
                class="mb-1 rounded-lg"
                :class="{'bg-primary-lighten-5': index % 2 === 0}"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getRankingColor(index)" size="32">
                    <span class="text-subtitle-2 text-white">{{ index + 1 }}</span>
                  </v-avatar>
                        </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{ produto.produto_nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center justify-space-between text-caption">
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

    <v-row class="mt-2">
      <!-- Quantidade de Produtos Vendidos -->
      <v-col cols="12" md="6">
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center py-3 px-4">
            <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Quantidade de Produtos Vendidos</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
            <v-row>
              <v-col cols="12" sm="6">
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
              <v-col cols="12" sm="6">
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
            <div class="chart-container mt-3">
              <apexchart
                type="line"
                :options="chartOptionsVendas"
                :series="vendasProdutosSeries"
                height="300"
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
              <v-card-title class="d-flex align-center py-3 px-4">
                <v-icon color="primary" class="mr-2">mdi-credit-card</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Vendas por Método de Pagamento</span>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-3">
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
                  <div class="chart-container mt-3">
                    <apexchart
                      type="donut"
                      :options="chartOptionsPagamento"
                      :series="vendasPorMetodoPagamentoSeries"
                      height="250"
                    />
                  </div>
                </v-card-text>
            </v-col>

              <v-divider vertical />

              <v-col cols="12" md="6">
                <v-card-title class="d-flex align-center py-3 px-4">
                  <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                  <span class="text-subtitle-1 font-weight-medium">Informações Adicionais</span>
              </v-card-title>
                <v-divider />
                <v-card-text class="pa-3">
                  <v-list>
                <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2 font-weight-medium">Produtos sem Estoque</v-list-item-title>
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
                        <v-icon color="success" class="mr-2">mdi-package-variant</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2 font-weight-medium">Produtos Vendidos no Total</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-subtitle-1 font-weight-bold">
                          {{ quantidadeReceitaProdutos.total_produtos_vendidos || '---' }}
                        </span>
                      </template>
                </v-list-item>

                <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="info" class="mr-2">mdi-cash</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2 font-weight-medium">Receita Total com Produtos</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-subtitle-1 font-weight-bold text-success">
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

    <!-- Card de Vendas por Categoria -->
    <v-col cols="12">
      <v-card class="h-100">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
            Vendas por Categoria
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="small"
                  class="ml-2"
                  color="grey"
                >
                  mdi-information
                </v-icon>
              </template>
              Distribuição de vendas por categoria de produtos
            </v-tooltip>
          </div>
          <v-select
            v-model="periodoVendasCategoria"
            :items="periodos"
            item-title="text"
            item-value="value"
            density="compact"
            variant="outlined"
            hide-details
            class="periodo-select"
            style="max-width: 200px"
          ></v-select>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <v-data-table
                :headers="headersCategoria"
                :items="vendasPorCategoria"
                :items-per-page="5"
                class="elevation-0 sales-table"
                height="400"
              >
                <template v-slot:header.percentual>
                  <div class="d-flex align-center">
                    <span class="text-subtitle-2 font-weight-bold">Participação</span>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          v-bind="props"
                          size="small"
                          class="ml-1"
                          color="grey"
                        >
                          mdi-information
                        </v-icon>
                      </template>
                      Percentual que esta categoria representa do total de vendas. Calculado dividindo o valor total vendido desta categoria pelo valor total de todas as categorias.
                    </v-tooltip>
                  </div>
                </template>

                <template v-slot:item="{ item }">
                  <tr>
                    <td class="py-4">
                      <div class="d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-tag</v-icon>
                        <span class="font-weight-medium">{{ item.categoria_nome }}</span>
                      </div>
                    </td>
                    <td class="py-4">
                      <div class="d-flex align-center">
                        <v-icon color="success" size="small" class="mr-1">mdi-package-variant</v-icon>
                        <span>{{ item.quantidade_total_vendida }}</span>
                      </div>
                    </td>
                    <td class="py-4">
                      <div class="d-flex align-center">
                        <v-icon color="info" size="small" class="mr-1">mdi-currency-usd</v-icon>
                        <span class="font-weight-bold">R$ {{ item.total_vendido.toFixed(2) }}</span>
                      </div>
                    </td>
                    <td class="py-6">
                      <div class="d-flex flex-column">
                        <v-progress-linear
                          :model-value="item.percentual"
                          color="primary"
                          height="12"
                          rounded
                          class="mt-1"
                        >
                          <template v-slot:default="{ value }">
                            <span class="text-caption font-weight-bold">{{ Math.ceil(value) }}%</span>
                          </template>
                        </v-progress-linear>
                      </div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="insights-card h-100" elevation="0">
                <v-card-text>
                  <div class="d-flex flex-column gap-4">
                    <div class="insight-item">
                      <div class="d-flex align-center mb-2">
                        <v-icon color="primary" class="mr-2">mdi-trophy</v-icon>
                        <div class="text-subtitle-2 text-grey">Categoria Mais Vendida</div>
                      </div>
                      <div class="text-h6 font-weight-bold">
                        {{ vendasPorCategoria[0]?.categoria_nome || '---' }}
                      </div>
                    </div>

                    <div class="insight-item">
                      <div class="d-flex align-center mb-2">
                        <v-icon color="info" class="mr-2">mdi-tag-multiple</v-icon>
                        <div class="text-subtitle-2 text-grey">Total de Categorias</div>
                      </div>
                      <div class="text-h6 font-weight-bold">
                        {{ vendasPorCategoria.length }}
                      </div>
                    </div>

                    <div class="insight-item">
                      <div class="d-flex align-center mb-2">
                        <v-icon color="success" class="mr-2">mdi-chart-pie</v-icon>
                        <div class="text-subtitle-2 text-grey">Participação da Principal</div>
                      </div>
                      <div class="text-h6 font-weight-bold text-primary">
                        {{ (vendasPorCategoria[0]?.percentual || 0).toFixed(1) }}%
                      </div>
                    </div>

                    <div class="insight-item">
                      <div class="d-flex align-center mb-2">
                        <v-icon color="warning" class="mr-2">mdi-currency-usd</v-icon>
                        <div class="text-subtitle-2 text-grey">Valor Total Bruto </div>
                      </div>
                      <div class="text-h6 font-weight-bold text-success">
                        R$ {{ vendasPorCategoria.reduce((total, item) => total + (item?.total_vendido || 0), 0).toFixed(2) }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

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
    const gerandoRelatorio = ref(false);

    // Períodos
    const periodoVendasProdutos = ref('semana');
    const periodoMaisVendidos = ref('semana');
    const periodoVClientesCompraram = ref('semana');
    const periogoPagamentos = ref('semana');
    const periodoLucroGasto = ref('semana');
    const periodoVendasCategoria = ref('semana');

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
    const vendasPorCategoria = ref<any[]>([]);

    // Headers para a tabela de vendas por categoria
    const headersCategoria = [
      {
        title: 'Categoria',
        key: 'categoria_nome',
        tooltip: 'Nome da categoria do produto'
      },
      {
        title: 'Quantidade',
        key: 'quantidade_total_vendida',
        tooltip: 'Total de produtos vendidos nesta categoria'
      },
      {
        title: 'Total Vendido',
        key: 'total_vendido',
        tooltip: 'Valor total das vendas desta categoria'
      },
      {
        title: 'Participação',
        key: 'percentual',
        tooltip: 'Percentual que esta categoria representa do total de vendas. Calculado dividindo o valor total vendido desta categoria pelo valor total de todas as categorias.'
      }
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
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
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
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
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
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      labels: ['Vendas', 'Custo'],
      colors: ['#8B5CF6', '#EF5350'],
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

        console.log(vendasProdutosResponse)

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
      try {
        const lucroVsGastoResponse = await window.api.getCustoVsLucro(periodo);
        console.log('[LUCRO VS GASTO RESPONSE]', lucroVsGastoResponse);

        if (!lucroVsGastoResponse) {
          lucroVsGastoSeries.value = [0, 0];
          lucroTotal.value = {
            lucroTotal: 0,
            cor: '#8B5CF6',
          };
          return;
        }

        const lucroTotalValor = lucroVsGastoResponse.lucro_produtos || 0;
        const lucroTotalCor = lucroTotalValor >= 0 ? '#8B5CF6' : '#EF5350';

        lucroVsGastoSeries.value = [
          lucroVsGastoResponse.total_bruto_produtos || 0,
          lucroVsGastoResponse.total_custo_produtos || 0
        ];

      lucroTotal.value = {
        lucroTotal: lucroTotalValor,
        cor: lucroTotalCor,
      };
      } catch (error) {
        console.error('Erro ao buscar dados de lucro vs gasto:', error);
        lucroVsGastoSeries.value = [0, 0];
        lucroTotal.value = {
          lucroTotal: 0,
          cor: '#8B5CF6',
        };
      }
    };

    const getVendasPorCategoria = async (periodo: string) => {
      try {
        const vendasResponse = await window.api.getVendasProdutosPorData(periodo);
        console.log('[VENDAS POR CATEGORIA RESPONSE]', vendasResponse);

        // Agrupar dados por categoria
        const vendasPorCategoriaMap = new Map();

        vendasResponse.forEach((item: any) => {
          const categoriaNome = item.categoria_nome || 'Sem Categoria';
          const quantidade = Number(item.quantidade_total_vendida) || 0;
          const totalVendido = Number(item.total_vendido) || 0;

          if (!vendasPorCategoriaMap.has(categoriaNome)) {
            vendasPorCategoriaMap.set(categoriaNome, {
              categoria_nome: categoriaNome,
              quantidade_total_vendida: 0,
              total_vendido: 0
            });
          }

          const categoriaAtual = vendasPorCategoriaMap.get(categoriaNome);
          categoriaAtual.quantidade_total_vendida += quantidade;
          categoriaAtual.total_vendido += totalVendido;
        });

        // Calcular o total geral para percentuais
        const totalGeral = Array.from(vendasPorCategoriaMap.values())
          .reduce((total, item) => total + item.total_vendido, 0);

        // Converter para array e adicionar percentual
        const vendasArray = Array.from(vendasPorCategoriaMap.values())
          .map(item => ({
            categoria_nome: item.categoria_nome,
            quantidade_total_vendida: item.quantidade_total_vendida,
            total_vendido: item.total_vendido,
            percentual: totalGeral > 0 ? (item.total_vendido / totalGeral) * 100 : 0
          }))
          .sort((a, b) => b.total_vendido - a.total_vendido);

        console.log('Vendas processadas:', vendasArray);
        vendasPorCategoria.value = vendasArray;
      } catch (error) {
        console.error('Erro ao buscar vendas por categoria:', error);
        vendasPorCategoria.value = [];
      }
    };

    const loadCategorias = async () => {
      try {
        const categoriasResponse = await window.api.getAllCategorias();
        categorias.value = categoriasResponse;
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    const carregarDados = async () => {
      await Promise.all([
        getVendasProdutosPorData(periodoVendasProdutos.value),
        getProdutosMaisVendidos(periodoMaisVendidos.value),
        getClientesMaisCompraramProdutos(periodoVClientesCompraram.value, 50),
        getLucroVsGasto(periodoLucroGasto.value),
        getProdutosSemEstoque(),
        getQuantidadeEReceitaProdutos(),
        getVendasProdutosPorMetodoPagamento(periogoPagamentos.value),
        getVendasPorCategoria(periodoVendasCategoria.value)
      ]);
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

    watch(periodoVendasCategoria, async () => {
      await getVendasPorCategoria(periodoVendasCategoria.value);
    });

    const goToProdutos = () => {
      router.push('/produtos');
    };

    const gerarRelatorioProdutos = async () => {
      try {
        gerandoRelatorio.value = true;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;

        // Título
        doc.setFontSize(20);
        doc.text('Relatório de Produtos', pageWidth / 2, 20, { align: 'center' });

        // Data de geração
        doc.setFontSize(10);
        doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, 30, { align: 'center' });

        // Informações do período
        doc.setFontSize(12);
        doc.text('Informações do Período:', margin, 45);
        doc.setFontSize(10);
        doc.text(`Vendas: ${periodoVendasProdutos.value}`, margin, 55);
        doc.text(`Mais Vendidos: ${periodoMaisVendidos.value}`, margin, 65);
        doc.text(`Categorias: ${periodoVendasCategoria.value}`, margin, 75);

        // Resumo de Vendas
        doc.setFontSize(12);
        doc.text('Resumo de Vendas', margin, 90);
        doc.setFontSize(10);
        doc.text(`Total de Vendas: R$ ${lucroTotal.value.lucroTotal.toFixed(2)}`, margin, 100);
        doc.text(`Quantidade Vendida: ${quantidadeReceitaProdutos.value?.total_produtos_vendidos || 0}`, margin, 110);
        doc.text(`Ticket Médio: R$ ${lucroTotal.value.lucroTotal.toFixed(2)}`, margin, 120);

        // Produtos Mais Vendidos
        doc.setFontSize(12);
        doc.text('Produtos Mais Vendidos', margin, 135);
        doc.setFontSize(10);
        let y = 145;
        produtosMaisVendidos.value.slice(0, 5).forEach((produto, index) => {
          doc.text(`${index + 1}. ${produto.produto_nome}`, margin, y);
          doc.text(`   Quantidade: ${produto.quantidade_vendida}`, margin + 5, y + 5);
          doc.text(`   Total: R$ ${produto.total_vendido.toFixed(2)}`, margin + 5, y + 10);
          y += 20;
        });

        // Vendas por Categoria
        doc.setFontSize(12);
        doc.text('Vendas por Categoria', margin, y + 10);
        doc.setFontSize(10);
        y += 20;
        vendasPorCategoria.value.forEach((categoria, index) => {
          doc.text(`${index + 1}. ${categoria.categoria_nome}`, margin, y);
          doc.text(`   Quantidade: ${categoria.quantidade_total_vendida}`, margin + 5, y + 5);
          doc.text(`   Total: R$ ${categoria.total_vendido.toFixed(2)}`, margin + 5, y + 10);
          doc.text(`   Participação: ${categoria.percentual.toFixed(1)}%`, margin + 5, y + 15);
          y += 25;
        });

        // Insights por Categoria
        doc.setFontSize(12);
        doc.text('Insights por Categoria', margin, y + 10);
        doc.setFontSize(10);
        y += 20;
        doc.text(`Categoria Mais Vendida: ${vendasPorCategoria.value[0]?.categoria_nome || '---'}`, margin, y);
        y += 10;
        doc.text(`Total de Categorias: ${vendasPorCategoria.value.length}`, margin, y);
        y += 10;
        doc.text(`Participação da Principal: ${vendasPorCategoria.value[0]?.percentual.toFixed(1) || '0.0'}%`, margin, y);
        y += 10;
        doc.text(`Valor Total por Categorias: R$ ${vendasPorCategoria.value.reduce((total, item) => total + item.total_vendido, 0).toFixed(2)}`, margin, y);

        // Salvar o PDF
        doc.save('relatorio-produtos.pdf');
      } catch (error) {
        console.error('Erro ao gerar relatório:', error);
      } finally {
        gerandoRelatorio.value = false;
      }
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
      categoriaLucroGasto,
      gerarRelatorioProdutos,
      gerandoRelatorio,
      periodoVendasCategoria,
      headersCategoria,
      vendasPorCategoria
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

.chart-container {
  position: relative;
  height: 100%;
  min-height: 250px;
}

.profit-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(var(--v-border-color), 0.12);
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

@media (max-width: 1366px) {
  .dashboard-container {
    padding: 8px !important;
  }

  .welcome-card {
    border-radius: 8px;
  }

  .chart-container {
  min-height: 200px;
}

  :deep(.v-select .v-field) {
    font-size: 0.875rem;
  }
}

.tooltip-content {
  max-width: 300px;
  padding: 8px;
}

.tooltip-content ol {
  padding-left: 16px;
}

.tooltip-content li {
  margin-bottom: 4px;
}

.insights-card {
  border-radius: 12px;
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

.insight-item {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.insight-item:hover {
  transform: translateY(-2px);
}

.gap-4 {
  gap: 16px;
}

.sales-table {
  border-radius: 8px;
  overflow: hidden;
}

.sales-table :deep(th) {
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  height: 56px;
}

.sales-table :deep(td) {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  height: 80px;
}

.sales-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  max-height: 400px;
  overflow-y: auto;
}

.sales-table :deep(.v-data-table__wrapper::-webkit-scrollbar) {
  width: 6px;
}

.sales-table :deep(.v-data-table__wrapper::-webkit-scrollbar-track) {
  border-radius: 3px;
}

.sales-table :deep(.v-data-table__wrapper::-webkit-scrollbar-thumb) {
  border-radius: 3px;
}

.sales-table :deep(.v-data-table__wrapper::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}
</style>
