<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Teste de CRUD de Clientes</h1>
      </v-col>

      <!-- Criação de Cliente -->
      <v-col cols="12" md="6">
        <v-text-field label="Nome do Cliente" v-model="clienteNome" outlined />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field label="Aniversário" v-model="clienteAniversario" type="date" outlined />
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="ipcHandleCreateCliente" color="primary">Criar Cliente</v-btn>
      </v-col>

      <!-- Listagem de Clientes -->
      <v-col cols="12">
        <v-btn @click="ipcHandleGetAllClientes" color="secondary">Obter Todos os Clientes</v-btn>
      </v-col>

      <!-- Tabela de Clientes -->
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="clientes"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn small @click="ipcHandleGetCliente(item.id)" color="blue">Ver</v-btn>
            <v-btn small @click="openUpdateDialog(item)" color="yellow">Editar</v-btn>
            <v-btn small @click="ipcHandleDeleteCliente(item.id)" color="red">Deletar</v-btn>
          </template>
        </v-data-table>
      </v-col>

      <!-- Modal para Atualizar Cliente -->
      <v-dialog v-model="updateDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Atualizar Cliente</span>
          </v-card-title>
          <v-card-text>
            <v-text-field label="Nome" v-model="selectedCliente.nome" outlined />
            <v-text-field label="Aniversário" v-model="selectedCliente.aniversario" type="date" outlined />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="updateCliente" color="green">Salvar</v-btn>
            <v-btn @click="updateDialog = false" color="red">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-row>

    <pre>{{ data }}</pre>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Dados de cliente
const clienteNome = ref('')
const clienteAniversario = ref('')
const clientes = ref<any[]>([])

// Dados do Modal de Atualização
const updateDialog = ref(false)
const selectedCliente = ref<any>({})

// Cabeçalhos da Tabela
const headers = [
  { text: 'Nome', align: 'start', key: 'nome' },
  { text: 'Aniversário', align: 'start', key: 'aniversario' },
  { text: 'Ações', align: 'center', key: 'actions' }
]

// Função para criar cliente
const ipcHandleCreateCliente = async () => {
  try {
    const result = await window.api.createCliente(clienteNome.value, clienteAniversario.value)
    console.log(result) // Mensagem de sucesso ou erro
    ipcHandleGetAllClientes() // Atualiza a lista de clientes
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
  }
}

// Função para obter todos os clientes
const ipcHandleGetAllClientes = async () => {
  try {
    const result = await window.api.getAllClientes()
    clientes.value = result
  } catch (error) {
    console.error("Erro ao obter clientes:", error)
  }
}

// Função para obter cliente por ID
const ipcHandleGetCliente = async (id: number) => {
  try {
    const result = await window.api.getClienteById(id)
    console.log(result) // Exibe os dados do cliente
  } catch (error) {
    console.error("Erro ao obter cliente:", error)
  }
}

// Função para atualizar cliente
const ipcHandleUpdateCliente = async (id: number) => {
  try {
    const result = await window.api.updateCliente(id, clienteNome.value, clienteAniversario.value)
    console.log(result) // Mensagem de sucesso ou erro
    ipcHandleGetAllClientes() // Atualiza a lista de clientes
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
  }
}

// Função para deletar cliente
const ipcHandleDeleteCliente = async (id: number) => {
  try {
    const result = await window.api.deleteCliente(id)
    console.log(result) // Mensagem de sucesso ou erro
    ipcHandleGetAllClientes() // Atualiza a lista de clientes
  } catch (error) {
    console.error("Erro ao deletar cliente:", error)
  }
}

// Função para abrir o modal de atualização
const openUpdateDialog = (cliente: any) => {
  selectedCliente.value = { ...cliente }
  updateDialog.value = true
}

// Função para salvar a atualização do cliente
const updateCliente = async () => {
  try {
    const result = await window.api.updateCliente(
      selectedCliente.value.id,
      selectedCliente.value.nome,
      selectedCliente.value.aniversario
    )
    console.log(result)
    ipcHandleGetAllClientes() // Atualiza a lista de clientes
    updateDialog.value = false
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
  }
}
</script>

<style scoped>
.test-view {
  padding: 20px;
}
</style>
