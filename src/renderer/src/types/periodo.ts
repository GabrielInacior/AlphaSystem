export type Periodo = 'dia' | 'semana' | 'mes' | 'ano' | 'todos';

export interface PeriodoOption {
  value: Periodo;
  text: string;
}

export const periodos: PeriodoOption[] = [
  { value: 'dia', text: 'Últimas 24 horas' },
  { value: 'semana', text: 'Última Semana' },
  { value: 'mes', text: 'Último Mês' },
  { value: 'ano', text: 'Último Ano' },
  { value: 'todos', text: 'Todos' }
];
