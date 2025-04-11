<template>
  <v-container>
    <v-row>
      <!-- Gráfico de Vendas de Produtos por Data -->
      <v-col cols="7" md="4" lg="4">
        <v-card class="pa-1" style="min-height: 150px;" elevation="10">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Top clientes - Produtos
            <v-btn rounded="0" variant="plain" size="small">
              <v-icon icon="mdi-information"> </v-icon>
              <v-tooltip activator="parent" location="start">Clientes que mais gastaram com produtos, ranqueados por
                valor gasto</v-tooltip>
            </v-btn>
          </v-card-title>
          <v-row style="max-height: 90px;">
            <v-col style="width: 100%;">
              <v-select v-model="periodoVClientesCompraram" :items="periodos" item-title="text" item-value="value"
                label="Selecione o Período" density="compact" outlined />
            </v-col>
          </v-row>
          <v-list style="width: 100%; overflow-y: auto; max-height: 300px;">
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
                      <v-col cols="3" class="text-truncate" style="min-width: 85px;">
                        <v-tooltip :text="cliente.cliente_nome">
                          <template v-slot:activator="{ props }">
                            <v-list-item-title v-bind="props" style="font-size: 14px;" class="text-truncate">{{
                              cliente.cliente_nome
                              }}</v-list-item-title>
                          </template>
                        </v-tooltip>
                      </v-col>

                    </v-col>

                    <v-col cols="5" class="text-right">
                      <v-list-item-subtitle style="font-size: 12px;">{{ cliente.quantidade_produtos_comprados }}
                        Produtos
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
      <v-col cols="4" md="6" lg="4">
        <v-card class="pa-1" style="min-height: 250px; position: relative;" elevation="10">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Comparação Lucro vs Gasto
          </v-card-title>

          <v-row style="max-height: 70px;">
            <v-col>
              <v-select v-model="periodoLucroGasto" :items="periodos" item-title="text" item-value="value"
                label="Selecione o Período" density="compact" />
            </v-col>
          </v-row>

          <!-- Gráfico -->
          <DoughnutChart :data="lucroVsGastoData" :options="chartOptionsLucroGasto" style="z-index: 600;" />

          <!-- Lucro Total Fixado no Bottom -->
          <v-card class=" text-center" style="
            position: absolute;
            bottom: 0;
            left: 0;
            max-height: 40px;
            width: 100%;
            z-index: 605;
            border-radius: 0;">
            <v-card-title class="text-h6">
              <span :style="{ color: lucroTotal.cor, fontWeight: 'bold' }">
                {{ lucroTotal.lucroTotal >= 0 ? 'Lucro Total: R$' : 'Prejuízo Total: R$' }}
                {{ lucroTotal.lucroTotal.toFixed(2) || '---' }}
              </span>
            </v-card-title>
          </v-card>
        </v-card>
      </v-col>


      <!-- Ranking dos Produtos Mais Vendidos -->
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-1" style="min-height: 100px;" elevation="10">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Produtos mais vendidos
            <v-btn variant="plain" size="small">
              <v-icon icon="mdi-information"> </v-icon>
              <v-tooltip activator="parent" location="start">Produtos mais vendidos, ranqueados por
                quantidade de vendas.</v-tooltip>
            </v-btn>
          </v-card-title>
          <v-row style="max-height: 90px;">
            <v-col style="width: 100%;">
              <v-select
                item-title="text"
                item-value="value"
                v-model="periodoMaisVendidos"
                :items="periodos"
                label="Selecione o Período"
                density="compact"
                outlined
              />
            </v-col>
            <v-col style="width: 100%;">
              <v-select
                item-title="nome"
                item-value="id"
                v-model="categoriaSelecionada"
                :items="categorias"
                label="Filtrar por Categoria"
                density="compact"
                outlined
                clearable
              />
            </v-col>
          </v-row>
          <v-list style="overflow-y: auto; max-height: 300px;">
            <v-list-item-group v-for="(produto, index) in produtosMaisVendidos" :key="index">
              <v-list-item>
                <v-list-item-content>
                  <v-row class="d-flex align-center" style="flex-wrap: nowrap;">
                    <!-- Flex wrap e gap entre os itens -->
                    <!-- Posição de Ranking -->
                    <v-col cols="2" class="text-center" style="min-width: 56px;">
                      <v-icon :class="getRankingClass(index)" size="small">{{ getMedalIcon(index) }}</v-icon>
                      <span class="font-weight-bold" style="font-size: 13px;">{{ index + 1 }}º</span>
                    </v-col>

                    <!-- Nome do Produto -->
                    <v-col cols="3" class="text-truncate" style="min-width: 85px;">
                      <v-tooltip :text="produto.produto_nome">
                        <template v-slot:activator="{ props }">
                          <v-list-item-title v-bind="props" style="font-size: 14px;">{{ produto.produto_nome
                            }}</v-list-item-title>
                        </template>
                      </v-tooltip>
                    </v-col>

                    <!-- Quantidade de Vendas -->
                    <v-col cols="2" class="text-right" style="display: flex; align-items: start; min-width: 60px;">
                      <v-list-item-subtitle style="font-size: 12px;">{{ produto.quantidade_vendida }}
                        vendas</v-list-item-subtitle>
                    </v-col>

                    <!-- Total Vendido -->
                    <v-col cols="3" class="text-right" style="min-width: 120px; display: flex; align-items: start;">
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
        <v-card class="pa-1" style="min-height: 300px; width: 100%;" elevation="10">
          <v-card-title style="font-size: 16px;font-weight: bold;">
            Quantidade de produtos vendidos
          </v-card-title>
          <v-row cols="auto" class="px-8 my-1" style="max-height: 80px;">
            <v-select item-title="text" item-value="value" v-model="periodoVendasProdutos" :items="periodos"
              label="Selecione o Período" density="compact" />
          </v-row>
          <LineChart :data="vendasProdutosData" :options="chartOptions" />
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="6">
        <v-card class="pa-1" style="min-height: 300px; width: 100%;" elevation="10">
          <v-row no-gutters>
            <!-- Gráfico do Método de Pagamento (50%) -->
            <v-col cols="6" md="6">
              <v-card-title style="font-size: 14px; font-weight: bold;">
                Vendas de produtos<br> p/ Método de Pagamento
              </v-card-title>
              <v-row cols="auto" class="px-4 my-1" style="max-height: 80px;">
                <v-select item-title="text" item-value="value" v-model="periogoPagamentos" :items="periodos"
                  label="Selecione o Período" density="compact" />
              </v-row>
              <DoughnutChart :data="vendasPorMetodoPagamentoData" :options="chartOptionsVendasPagamento" />
            </v-col>

            <v-divider class="mx-2" vertical></v-divider>

            <v-col cols="6" md="5" style="min-width: 220px;">
              <v-card-title style="font-size: 16px; font-weight: bold;">
                Informações adicionais
              </v-card-title>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title style="font-size: 14px;">
                      Produtos sem Estoque
                    </v-list-item-title>
                    <v-list-item-subtitle style="font-size: 12px; color: red;">
                      {{ produtosSemEstoque.length }} Produtos <v-icon @click="goToProdutos">mdi-arrow-right-circle
                      </v-icon>

                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title style="font-size: 14px;">
                      Produtos vendidos no total
                    </v-list-item-title>
                    <v-list-item-subtitle style="font-size: 12px;">
                      {{ quantidadeReceitaProdutos.total_produtos_vendidos || '--' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title style="font-size: 14px;">
                      Receita total com produtos
                    </v-list-item-title>
                    <v-list-item-subtitle style="font-size: 12px;">
                      <span v-if="quantidadeReceitaProdutos.receita_total_produtos">
                        {{ 'R$ ' +
                          quantidadeReceitaProdutos.receita_total_produtos.toFixed(2) || '--' }}</span>
                      <span v-else>---</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="10">
          <v-card-title>Produtos Mais Vendidos por Categoria</v-card-title>
          <v-row style="max-height: 90px;">
            <v-col style="width: 100%;">
              <v-select
                item-title="text"
                item-value="value"
                v-model="periodoMaisVendidos"
                :items="periodos"
                label="Selecione o Período"
                density="compact"
                outlined
              />
            </v-col>
            <v-col style="width: 100%;">
              <v-select
                item-title="nome"
                item-value="id"
                v-model="categoriaSelecionada"
                :items="categorias"
                label="Filtrar por Categoria"
                density="compact"
                outlined
                clearable
              />
            </v-col>
          </v-row>
          <Bar :data="produtosMaisVendidosData" :options="chartOptions" />
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="10">
          <v-card-title>Lucro Total por Categoria</v-card-title>
          <v-row style="max-height: 90px;">
            <v-col style="width: 100%;">
              <v-select
                item-title="text"
                item-value="value"
                v-model="periodoMaisVendidos"
                :items="periodos"
                label="Selecione o Período"
                density="compact"
                outlined
              />
            </v-col>
            <v-col style="width: 100%;">
              <v-select
                item-title="nome"
                item-value="id"
                v-model="categoriaSelecionada"
                :items="categorias"
                label="Filtrar por Categoria"
                density="compact"
                outlined
                clearable
              />
            </v-col>
          </v-row>
          <Bar :data="lucroTotalPorCategoriaData" :options="chartOptions" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Line, Doughnut, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement } from 'chart.js';

// Registrando os tipos do chart.js
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement);

export default defineComponent({
  name: 'LojaView',
  components: {
    LineChart: Line,
    DoughnutChart: Doughnut,
    BarChart: Bar
  },
  setup() {
    // Dados e opções dos gráficos
    const router = useRouter();
    const vendasProdutosData = ref<any>({ labels: [], datasets: [] });
    const vendasPorMetodoPagamentoData = ref<any>({ labels: [], datasets: [] });
    const lucroVsGastoData = ref<any>({ labels: ['Lucro', 'Gasto'], datasets: [] });
    const lucroTotal = ref({ lucroTotal: 0, cor: '#42A5F5' }); // Definindo lucroTotal como um objeto reativo
    const produtosMaisVendidos = ref<any[]>([]);
    const produtosSemEstoque = ref<any[]>([]);
    const chartOptionVendas = ref<any>();
    const quantidadeReceitaProdutos = ref<any>([]);
    const melhoresClientes = ref<any[]>([]);
    const exemploData = ref<any>({ labels: [], datasets: [] });
    const chartOptionsLucroGasto = ref<any>();
    const periodoVendasProdutos = ref('semana');
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
    const categorias = ref<any[]>([]);
    const categoriaSelecionada = ref<number | null>(null);
    const produtosMaisVendidosData = ref<any>({ labels: [], datasets: [] });
    const lucroTotalPorCategoriaData = ref<any>({ labels: [], datasets: [] });
    const loading = ref(false);

    const getVendasProdutosPorData = async (periodo: string) => {
      try {
        const vendasProdutosResponse = await window.api.getVendasProdutosPorData(periodo)
        console.log('[VENDAS RESPONSE]', vendasProdutosResponse)

        const labels: string[] = []
        const dataQuantidade: number[] = []
        const dataTotalVendido: number[] = []

        vendasProdutosResponse.forEach((item: any) => {
          let label = ''

          switch (periodo) {
            case 'dia':
              label = new Date(item.periodo + ':00').toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
              break

            case 'semana':
              let diaSemana = new Date(item.periodo).getDay()
              diaSemana = (diaSemana + 1) % 7;
              label = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][diaSemana]
              break

            case 'mes':
              const dataInicio = new Date(item.periodo)
              const dataFim = new Date(dataInicio)
              dataFim.setDate(dataFim.getDate() + 1)

              const formatarData = (data: Date) =>
                data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

              label = `${formatarData(dataInicio)} a ${formatarData(dataFim)}`
              break

            case 'ano':
              const mesAno = new Date(item.periodo)
              label = mesAno.toLocaleString('default', { month: 'long' })
              break

            case 'todos':
              label = item.periodo
              break

            default:
              label = new Date(item.periodo).toLocaleDateString()
          }

          labels.push(label)
          dataQuantidade.push(Number(item.quantidade_total_vendida))
          dataTotalVendido.push(Number(item.total_vendido))
        })

        vendasProdutosData.value = {
          labels,
          datasets: [
            {
              label: 'Quantidade Vendida',
              data: dataQuantidade,
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              borderColor: '#42A5F5',
              borderWidth: 2,
              hoverBackgroundColor: '#42A5F5',
              hoverBorderColor: '#1E88E5',
              tension: 0.3,
              fill: false,
              yAxisID: 'y',
            },
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
        }

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
              position: 'left',
              title: {
                display: true,
                text: 'Quantidade',
              },
            },
            y1: {
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
        }

      } catch (error) {
        console.error('Erro ao buscar dados de vendas:', error)
      }
    }

    const getProdutosMaisVendidos = async (periodo: string) => {
      try {
        const produtosResponse = await window.api.getProdutosMaisVendidosPorCategoria(periodo);
        produtosMaisVendidos.value = categoriaSelecionada.value
          ? produtosResponse.filter((p: any) => p.categoria_id === categoriaSelecionada.value)
          : produtosResponse;

        // Atualizar o gráfico de produtos mais vendidos
        const labels = produtosMaisVendidos.value.map((p: any) => p.produto_nome);
        const data = produtosMaisVendidos.value.map((p: any) => p.quantidade_vendida);

        produtosMaisVendidosData.value = {
          labels,
          datasets: [{
            label: 'Quantidade Vendida',
            data,
            backgroundColor: generateColors(data.length)
          }]
        };
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
      const clientesResponse = await window.api.getClientesMaisCompraramProdutos(periodo, limite);
      melhoresClientes.value = clientesResponse;
    };

    const getVendasProdutosPorMetodoPagamento = async (periodo: string) => {
      const vendasResponse = await window.api.getVendasProdutosPorMetodoPagamento(periodo);
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

      console.log(vendasPorMetodoPagamentoData.value);
    };

    const goToProdutos = () => {
      router.push('produtos');
    }

    const getLucroVsGasto = async (periodo: string) => {
      const lucroVsGastoResponse = await window.api.getCustoVsLucro(periodo);
      console.log(lucroVsGastoResponse);

      // Calculando o lucro total
      const lucroTotalValor = lucroVsGastoResponse.lucro_produtos;

      // Definindo a cor do lucro total
      const lucroTotalCor = lucroTotalValor >= 0 ? '#42A5F5' : '#EF5350';

      lucroVsGastoData.value = {
        labels: ['Vendas', 'Custo'],
        datasets: [
          {
            label: 'Vendas vs Gasto',
            data: [lucroVsGastoResponse.total_bruto_produtos, lucroVsGastoResponse.total_custo_produtos],
            backgroundColor: ['#1976D2', '#EF5350'],
            hoverBackgroundColor: ['#12589e', '#FF7043'],
          },
        ],
      };

      lucroTotal.value = {
        lucroTotal: lucroTotalValor,
        cor: lucroTotalCor,
      };

      chartOptionsLucroGasto.value = {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return `R$ ${value.toFixed(2)}`;
              },
            },
          },
        },
        layout: {
          padding: 20
        }
      };
    };

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

    const generateColors = (count: number) => {
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40'
      ];
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
      }
      return result;
    };

    const loadLucroTotalPorCategoria = async (periodo: string) => {
      try {
        const dados = await window.api.getLucroTotalPorCategoria(periodo);
        const dadosFiltrados = categoriaSelecionada.value
          ? dados.filter((item: any) => item.categoria_id === categoriaSelecionada.value)
          : dados;

        lucroTotalPorCategoriaData.value = {
          labels: dadosFiltrados.map((item: any) => item.categoria_nome),
          datasets: [{
            label: 'Lucro Total (R$)',
            data: dadosFiltrados.map((item: any) => item.lucro_total),
            backgroundColor: generateColors(dadosFiltrados.length)
          }]
        };
      } catch (error) {
        console.error('Erro ao carregar lucro total por categoria:', error);
      }
    };

    // Watch para atualizar os gráficos quando o período ou categoria mudar
    watch([periodoMaisVendidos, periodoLucroGasto, categoriaSelecionada], async () => {
      try {
        await Promise.all([
          getProdutosMaisVendidos(periodoMaisVendidos.value),
          loadLucroTotalPorCategoria(periodoMaisVendidos.value)
        ]);
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    });

    onMounted(async () => {
      await loadCategorias();
      await getProdutosMaisVendidos(periodoMaisVendidos.value);
      await loadLucroTotalPorCategoria(periodoMaisVendidos.value);
    });

    watch(() => periodoLucroGasto.value, async (val) => {
      if (val) {
        await getLucroVsGasto(val);
      }
    });

    watch(() => periodoMaisVendidos.value, async (val) => {
      if (val) {
        await getProdutosMaisVendidos(val);
      }
    });

    watch(() => periodoVClientesCompraram.value, async (val) => {
      if (val) {
        await getClientesMaisCompraramProdutos(val, 50);
      }
    });

    watch(() => periogoPagamentos.value, async (val) => {
      if (val) {
        await getVendasProdutosPorMetodoPagamento(val);
      }
    });

    watch(() => periodoVendasProdutos.value, async (val) => {
      if (val) {
        await getVendasProdutosPorData(val);
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
      vendasProdutosData,
      lucroVsGastoData,
      produtosMaisVendidos,
      melhoresClientes,
      periodoVendasProdutos,
      periodoMaisVendidos,
      chartOptionsLucroGasto,
      lucroTotal,
      vendasPorMetodoPagamentoData,
      chartOptionsVendasPagamento,
      periodoVClientesCompraram,
      periodoLucroGasto,
      exemploData,
      chartOptions,
      quantidadeReceitaProdutos,
      goToProdutos,
      produtosSemEstoque,
      getMedalIcon,
      getRankingClass,
      periodos,
      periogoPagamentos,
      categorias,
      categoriaSelecionada,
      produtosMaisVendidosData,
      lucroTotalPorCategoriaData,
      loading,
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
