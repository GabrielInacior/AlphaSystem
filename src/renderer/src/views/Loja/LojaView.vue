<template>
  <v-container>
    <v-row>
      <!-- Gráfico de Vendas de Produtos por Data -->
      <v-col cols="7" md="4" lg="4">
        <v-card class="pa-1" style="min-height: 150px;">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Top clientes - Produtos
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
        <v-card class="pa-1" style="min-height: 250px; position: relative;">
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
                {{ lucroTotal.lucroTotal.toFixed(2) }}
              </span>
            </v-card-title>
          </v-card>
        </v-card>
      </v-col>


      <!-- Ranking dos Produtos Mais Vendidos -->
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-1" style="min-height: 100px;">
          <v-card-title style="font-size: 16px; font-weight: bold;">
            Produtos mais vendidos
          </v-card-title>
          <v-row style="max-height: 90px;"> <!-- Adicionando flex-wrap para se ajustar ao espaço -->
            <v-col style="width: 100%;">
              <v-select item-title="text" item-value="value" v-model="periodoMaisVendidos" :items="periodos"
                label="Selecione o Período" density="compact" outlined />
            </v-col>
          </v-row>
          <v-list>
            <v-list-item-group v-for="(produto, index) in produtosMaisVendidos" :key="index">
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
                      <v-list-item-title style="font-size: 14px;">{{ produto.produto_nome }}</v-list-item-title>
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
        <v-card class="pa-1" style="min-height: 300px; width: 100%;">
          <v-row no-gutters>
            <!-- Gráfico do Método de Pagamento (50%) -->
            <v-col cols="6" md="5">
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

            <v-col cols="6" md="6" style="min-width: 260px;">
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
                        {{ 'R$' +
                          quantidadeReceitaProdutos.receita_total_produtos.toFixed(2) }}</span>
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
  name: 'LojaView',
  components: {
    LineChart: Line,
    DoughnutChart: Doughnut
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
    const quantidadeReceitaProdutos = ref<any>([]);
    const melhoresClientes = ref<any[]>([]);
    const exemploData = ref<any>({ labels: [], datasets: [] });
    const chartOptionsLucroGasto = ref<any>();
    const periodoVendasProdutos = ref('dia');
    const periodoMaisVendidos = ref('dia');
    const periodoVClientesCompraram = ref('dia');
    const periogoPagamentos = ref('dia');
    const periodoLucroGasto = ref('dia');
    const periodos = [
      { value: 'dia', text: 'Hoje' },
      { value: 'semana', text: 'Última Semana' },
      { value: 'mes', text: 'Último Mês' },
      { value: 'ano', text: 'Último Ano' },
      { value: 'todos', text: 'Todos' },
    ];

    const getVendasProdutosPorData = async (periodo: string) => {
      const vendasProdutosResponse = await window.api.getVendasProdutosPorData(periodo);
      console.log(vendasProdutosResponse)
      let labels: string[] = [];
      let data: number[] = [];

      vendasProdutosResponse.forEach((item: any) => {
        let label: string;
        switch (periodo) {
          case 'dia':
            label = new Date(item.periodo + ":00").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            break;
          case 'semana':
            label = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][parseInt(item.periodo)];
            break;
          case 'mes':
            const date = new Date(item.periodo);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            label = `${day}/${month}`;
            break;
          case 'ano':
            label = new Date(item.periodo).toLocaleString('default', { month: 'long' });
            break;
          case 'todos':
            label = item.periodo;
            break;
          default:
            label = new Date(item.periodo).toLocaleDateString();
        }

        labels.push(label);
        data.push(item.quantidade_total_vendida);
      });

      vendasProdutosData.value = {
        labels: labels,
        datasets: [{
          label: 'Vendas de Produtos',
          data: data,
          backgroundColor: 'rgba(66, 165, 245, 0.2)',  // Cor de fundo das barras
          borderColor: '#42A5F5',  // Cor da borda das barras
          borderWidth: 1,  // Largura da borda
          hoverBackgroundColor: '#42A5F5',  // Cor ao passar o mouse
          hoverBorderColor: '#1E88E5',  // Cor da borda ao passar o mouse
        }]
      };
    };

    const getProdutosMaisVendidos = async (periodo: string) => {
      const produtosResponse = await window.api.getProdutosMaisVendidos(periodo);
      produtosMaisVendidos.value = produtosResponse;
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
      const lucroTotalValor = lucroVsGastoResponse.lucro_produtos - lucroVsGastoResponse.total_custo_produtos;

      // Definindo a cor do lucro total
      const lucroTotalCor = lucroTotalValor >= 0 ? '#42A5F5' : '#EF5350';

      lucroVsGastoData.value = {
        labels: ['Vendas', 'Custo'],
        datasets: [
          {
            label: 'Vendas vs Gasto',
            data: [lucroVsGastoResponse.lucro_produtos, lucroVsGastoResponse.total_custo_produtos],
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
      await getClientesMaisCompraramProdutos(periodoVClientesCompraram.value, 5);
      await getLucroVsGasto(periodoLucroGasto.value);
      await getProdutosSemEstoque();
      await getQuantidadeEReceitaProdutos();
      await getVendasProdutosPorMetodoPagamento(periogoPagamentos.value);
    };

    onMounted(() => {
      carregarDados();
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
        await getClientesMaisCompraramProdutos(val, 5);
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
