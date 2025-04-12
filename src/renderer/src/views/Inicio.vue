<template>
  <v-container fluid class="dashboard-container pa-4">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between py-3 px-4">
            <div>
              <h1 class="text-h5 font-weight-bold welcome-text mb-1">
                {{ saudacao }}, Bia e Raphael!
              </h1>
              <div class="text-subtitle-2 text-white opacity-75">
                Aqui está o resumo do seu negócio
              </div>
            </div>
            <div class="d-flex align-center">
              <v-btn
                color="white"
                variant="tonal"
                class="mr-4"
                prepend-icon="mdi-file-pdf-box"
                @click="gerarRelatorioInicio"
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

    <v-row class="mt-2">
      <!-- Sales Comparison Chart -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="chart-card h-100" elevation="2">
          <v-card-title class="d-flex align-center py-3 px-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-chart-donut</v-icon>
              <span class="text-subtitle-1 font-weight-medium">Comparação Serviços vs Produtos</span>
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-select
              v-model="periodoVendasXServicos"
              :items="periodos"
              item-title="text"
              item-value="value"
              label="Período"
              density="compact"
              class="period-select mb-4"
              variant="outlined"
              hide-details
              style="max-width: 200px"
            />
            <apexchart
              type="donut"
              :options="chartOptions"
              :series="chartSeries"
              height="250"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- General Information -->
      <v-col cols="12" sm="6" md="8">
        <v-card class="info-card h-100" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-information</v-icon>
              <span class="text-subtitle-1 font-weight-medium">Informações Gerais</span>
            </div>
            <v-select
              v-model="periodoInfoGerais"
              :items="periodos"
              item-title="text"
              item-value="value"
              label="Período"
              density="compact"
              class="period-select"
              variant="outlined"
              hide-details
              style="max-width: 150px"
            />
          </v-card-title>
          <v-divider />

          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" sm="6">
                <v-list class="info-list bg-transparent">
                  <v-list-item class="mb-2">
                    <template v-slot:prepend>
                      <v-icon color="success" class="mr-2">mdi-cart</v-icon>
                    </template>
                    <v-list-item-title class="text-caption text-medium-emphasis">Total Vendas Produtos</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold text-success">R$ {{ infoGerais?.total_produtos_vendidos?.toFixed(2) || '---' }}</span>
                    </template>
                  </v-list-item>

                  <v-list-item class="mb-2">
                    <template v-slot:prepend>
                      <v-icon color="error" class="mr-2">mdi-cash-minus</v-icon>
                    </template>
                    <v-list-item-title class="text-caption text-medium-emphasis">Custo Produtos</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold text-error">R$ {{ infoGerais?.total_custo_produtos?.toFixed(2) || '---' }}</span>
                    </template>
                  </v-list-item>

                  <v-list-item class="mb-2">
                    <template v-slot:prepend>
                      <v-icon color="success" class="mr-2">mdi-handshake</v-icon>
                    </template>
                    <v-list-item-title class="text-caption text-medium-emphasis">Total Vendas Serviços</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold text-success">R$ {{ infoGerais?.total_servicos_vendidos?.toFixed(2) || '---' }}</span>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="error" class="mr-2">mdi-cash-remove</v-icon>
                    </template>
                    <v-list-item-title class="text-caption text-medium-emphasis">Total Despesas</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold text-error">R$ {{ infoGerais?.total_despesas?.toFixed(2) || '---' }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" sm="6">
                <v-list class="info-list bg-transparent">
                  <v-list-item class="mb-2">
                    <template v-slot:prepend>
                      <v-icon color="info" class="mr-2">mdi-package-variant</v-icon>
                    </template>
                    <v-list-item-title class="text-caption text-medium-emphasis">Qtd. Produtos Vendidos</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold">{{ infoGerais?.qtd_produtos_vendidos || '---' }}</span>
                    </template>
                  </v-list-item>

                  <v-list-item class="mb-2">
                    <template v-slot:prepend>
                      <v-icon color="info" class="mr-2">mdi-tools</v-icon>
                    </template>
                    <v-list-item-title class="text-caption text-medium-emphasis">Qtd. Serviços Vendidos</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold">{{ infoGerais?.qtd_servicos_vendidos || '---' }}</span>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="info" class="mr-2">mdi-file-document-outline</v-icon>
                    </template>
                    <v-list-item-title class="text-caption text-medium-emphasis">Qtd. Despesas</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-subtitle-1 font-weight-bold">{{ infoGerais?.qtd_despesas || '---' }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <v-card class="profit-card mt-4" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between py-2 px-3">
                <div class="d-flex align-center">
                  <v-icon color="white" size="24" class="mr-2">mdi-chart-line</v-icon>
                  <span class="text-subtitle-1 font-weight-bold text-white">Lucro Total</span>
                </div>
                <span class="text-h5 font-weight-bold text-white">R$ {{ infoGerais?.lucro_total?.toFixed(2) || '---' }}</span>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <!-- Birthdays Section -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="birthday-card h-100" elevation="2">
          <v-card-title class="d-flex align-center py-3 px-4">
            <v-icon color="primary" class="mr-2">mdi-cake-variant</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Aniversariantes do Mês</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
            <v-list v-if="clientesAniversariantes.length > 0" class="birthday-list">
              <v-list-item
                v-for="(cliente, index) in clientesAniversariantes"
                :key="index"
                class="mb-1 rounded-lg"
                :class="{'bg-primary-lighten-5': index % 2 === 0}"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary" size="32">
                    <span class="text-subtitle-2 text-white">{{ cliente.nome.charAt(0) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{ cliente.nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center text-caption">
                  <v-icon size="small" color="primary" class="mr-1">mdi-cake</v-icon>
                  {{ cliente.aniversario }} • {{ calcularIdade(cliente.aniversario) }} anos
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-alert
              v-else
              type="info"
              variant="tonal"
              class="mt-2"
              icon="mdi-information"
              density="compact"
            >
              Nenhum cliente aniversariante neste mês
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Debtors Section -->
      <v-col cols="12" sm="6" md="8">
        <v-card class="debtors-card h-100" elevation="2">
          <v-card-title class="d-flex align-center py-3 px-4">
            <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Maiores Devedores</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-3">
            <v-list v-if="clientesDevendo.length > 0" class="debtors-list">
              <v-list-item
                v-for="(cliente, index) in clientesDevendo"
                :key="index"
                class="mb-1 rounded-lg"
                :class="{'bg-error-lighten-5': index % 2 === 0}"
              >
                <template v-slot:prepend>
                  <v-avatar color="error" size="32">
                    <span class="text-subtitle-2 text-white">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">{{ cliente.cliente_nome }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center text-caption">
                  <v-icon size="small" color="error" class="mr-1">mdi-phone</v-icon>
                  {{ cliente.cliente_telefone || "Não cadastrado" }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-right">
                    <div class="text-caption text-medium-emphasis">Deve</div>
                    <div class="text-subtitle-2 font-weight-bold text-error">R$ {{ cliente.total_devido.toFixed(2) }}</div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
            <v-alert
              v-else
              type="success"
              variant="tonal"
              class="mt-2"
              icon="mdi-check-circle"
              density="compact"
            >
              Nenhum cliente devedor encontrado
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default defineComponent({
  name: 'Inicio',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    const vendasProdutosXServicos = ref<any[]>([]);
    const infoGerais = ref<any>(null);
    const chartSeries = ref<number[]>([0, 0]);
    const gerandoRelatorio = ref(false);

    const chartOptions = ref<any>({
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
      labels: ['Produtos', 'Serviços'],
      colors: ['#FF6B6B', '#8B5CF6'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#FF8E53', '#6366F1'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
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
                color: '#888888',
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
        color: '#888888',
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
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
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

      // Atualizando os dados do gráfico
      chartSeries.value = [
        produtosResponse.total_produtos_vendidos,
        produtosResponse.total_servicos_vendidos
      ];
    };

    const carregarDados = async () => {
      await getClientesAniversariantes();
      await getClientesDevendo();
      await getLucroTotal(periodoInfoGerais.value);
      await getVendasProdutosVsServicos(periodoVendasXServicos.value);
    };

    const gerarRelatorioInicio = async () => {
      try {
        gerandoRelatorio.value = true;

        // Criar um novo documento PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();

        // Título do relatório
        pdf.setFontSize(20);
        pdf.setTextColor(99, 102, 241); // Cor roxa
        pdf.text('Relatório Geral do Negócio', pageWidth / 2, 20, { align: 'center' });

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
        const periodoText = periodos.find(p => p.value === periodoVendasXServicos.value)?.text || 'Período não definido';
        pdf.setFontSize(10);
        pdf.text(`Vendas Produtos vs Serviços: ${periodoText}`, 30, 55);

        const periodoInfoText = periodos.find(p => p.value === periodoInfoGerais.value)?.text || 'Período não definido';
        pdf.text(`Informações Gerais: ${periodoInfoText}`, 30, 62);

        // Resumo de vendas
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Resumo de Vendas', 20, 75);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Total Vendas Produtos: R$ ${infoGerais.value?.total_produtos_vendidos?.toFixed(2) || '0.00'}`, 30, 85);
        pdf.text(`Total Vendas Serviços: R$ ${infoGerais.value?.total_servicos_vendidos?.toFixed(2) || '0.00'}`, 30, 92);
        pdf.text(`Lucro Total: R$ ${infoGerais.value?.lucro_total?.toFixed(2) || '0.00'}`, 30, 99);

        // Custos e despesas
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Custos e Despesas', 20, 112);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Custo Produtos: R$ ${infoGerais.value?.total_custo_produtos?.toFixed(2) || '0.00'}`, 30, 122);
        pdf.text(`Total Despesas: R$ ${infoGerais.value?.total_despesas?.toFixed(2) || '0.00'}`, 30, 129);

        // Quantidades
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Quantidades', 20, 142);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Qtd. Produtos Vendidos: ${infoGerais.value?.qtd_produtos_vendidos || 0}`, 30, 152);
        pdf.text(`Qtd. Serviços Vendidos: ${infoGerais.value?.qtd_servicos_vendidos || 0}`, 30, 159);
        pdf.text(`Qtd. Despesas: ${infoGerais.value?.qtd_despesas || 0}`, 30, 166);

        // Distribuição de vendas
        pdf.setFontSize(14);
        pdf.setTextColor(99, 102, 241);
        pdf.text('Distribuição de Vendas', 20, 179);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);

        const totalVendas = (infoGerais.value?.total_produtos_vendidos || 0) + (infoGerais.value?.total_servicos_vendidos || 0);
        const percentualProdutos = totalVendas > 0 ? ((infoGerais.value?.total_produtos_vendidos || 0) / totalVendas * 100).toFixed(1) : '0.0';
        const percentualServicos = totalVendas > 0 ? ((infoGerais.value?.total_servicos_vendidos || 0) / totalVendas * 100).toFixed(1) : '0.0';

        pdf.text(`Produtos: R$ ${infoGerais.value?.total_produtos_vendidos?.toFixed(2) || '0.00'} (${percentualProdutos}%)`, 30, 189);
        pdf.text(`Serviços: R$ ${infoGerais.value?.total_servicos_vendidos?.toFixed(2) || '0.00'} (${percentualServicos}%)`, 30, 196);

        // Salvar o PDF
        pdf.save('relatorio-geral.pdf');

        gerandoRelatorio.value = false;
      } catch (error) {
        console.error('Erro ao gerar relatório geral:', error);
        gerandoRelatorio.value = false;
      }
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
      chartOptions,
      chartSeries,
      infoGerais,
      getClientesDevendo,
      clientesDevendo,
      calcularIdade,
      periodos,
      periodoInfoGerais,
      gerarRelatorioInicio,
      gerandoRelatorio
    }
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

.chart-card, .info-card, .birthday-card, .debtors-card {
  border-radius: 12px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.chart-card:hover, .info-card:hover, .birthday-card:hover, .debtors-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
}

.info-list {
  border-radius: 8px;
}

.profit-card {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 8px;
  padding: 12px;
}

.birthday-list, .debtors-list {
  max-height: 300px;
  overflow-y: auto;
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

.period-select {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

@media (max-width: 1366px) {
  .dashboard-container {
    padding: 8px !important;
  }

  .welcome-card {
    margin-bottom: 8px;
  }

  .chart-container {
    height: 200px;
  }

  .birthday-list, .debtors-list {
    max-height: 250px;
  }

  :deep(.v-select .v-field) {
    font-size: 0.875rem;
  }

  .period-select {
    max-width: 180px !important;
  }
}
</style>
