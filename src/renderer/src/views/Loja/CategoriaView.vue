<template>
  <v-container style="height: 90vh; width: 100%;">
    <v-card style="height: 100%; width: 100%;" elevation="10">
      <v-card-title>
        Categorias de Produtos
        <v-spacer></v-spacer>
        <!-- Filtro de busca -->
        <v-row density="compact">
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              density="compact"
              v-model="search"
              label="Buscar categoria"
              dense
              outlined
              class="filter-input"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn color="primary" @click="openModal(null)">Nova Categoria</v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        density="compact"
        style="height: 74%; width: 100%;"
        :headers="headers"
        :items="filteredCategorias"
        :search="search"
        :loading="loading"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-2" @click="openModal(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="confirmDelete(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal de Categoria -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.nome"
                  label="Nome"
                  :error-messages="nomeError"
                  @input="validateNome"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.descricao"
                  label="Descrição"
                  :error-messages="descricaoError"
                  @input="validateDescricao"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">
            Cancelar
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Confirmação de Exclusão -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir esta categoria?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialogDelete = false">
            Cancelar
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="deleteItem">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para mensagens -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Categoria {
  id: number | null
  nome: string
  descricao: string
}

const router = useRouter()
const search = ref('')
const dialog = ref(false)
const dialogDelete = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const categorias = ref<Categoria[]>([])
const itemToDelete = ref<Categoria | null>(null)

const headers = [
  { title: 'Nome', key: 'nome' },
  { title: 'Descrição', key: 'descricao' },
  { title: 'Ações', key: 'actions', sortable: false }
]

const defaultItem: Categoria = {
  id: null,
  nome: '',
  descricao: ''
}

const editedItem = ref<Categoria>({ ...defaultItem })
const editedIndex = ref(-1)

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Nova Categoria' : 'Editar Categoria'
})

const filteredCategorias = computed(() => {
  return categorias.value
})

const nomeError = ref<string | null>(null)
const descricaoError = ref<string | null>(null)

const validateNome = () => {
  if (!editedItem.value.nome) {
    nomeError.value = 'Nome é obrigatório'
  } else if (editedItem.value.nome.length < 3) {
    nomeError.value = 'Nome deve ter pelo menos 3 caracteres'
  } else {
    nomeError.value = null
  }
}

const validateDescricao = () => {
  if (editedItem.value.descricao && editedItem.value.descricao.length > 500) {
    descricaoError.value = 'Descrição deve ter no máximo 500 caracteres'
  } else {
    descricaoError.value = null
  }
}

const loadCategorias = async () => {
  loading.value = true
  try {
    const data = await window.api.getAllCategorias()
    categorias.value = data
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
    showSnackbar('Erro ao carregar categorias', 'error')
  } finally {
    loading.value = false
  }
}

const openModal = (item: Categoria | null) => {
  editedIndex.value = item ? categorias.value.indexOf(item) : -1
  editedItem.value = item ? { ...item } : { ...defaultItem }
  dialog.value = true
}

const close = () => {
  dialog.value = false
  editedItem.value = { ...defaultItem }
  editedIndex.value = -1
  nomeError.value = null
  descricaoError.value = null
}

const save = async () => {
  validateNome()
  validateDescricao()

  if (nomeError.value || descricaoError.value) {
    return
  }

  try {
    if (editedIndex.value > -1 && editedItem.value.id !== null) {
      const updatedCategoria = await window.api.updateCategoria(
        editedItem.value.id,
        editedItem.value.nome,
        editedItem.value.descricao
      )
      Object.assign(categorias.value[editedIndex.value], updatedCategoria)
      showSnackbar('Categoria atualizada com sucesso', 'success')
    } else {
      const newCategoriaId = await window.api.createCategoria(
        editedItem.value.nome,
        editedItem.value.descricao
      )
      if (typeof newCategoriaId === 'number') {
        const newCategoria: Categoria = {
          id: newCategoriaId,
          nome: editedItem.value.nome,
          descricao: editedItem.value.descricao
        }
        categorias.value.push(newCategoria)
        showSnackbar('Categoria criada com sucesso', 'success')
      }
    }
    close()
  } catch (error) {
    console.error('Erro ao salvar categoria:', error)
    showSnackbar('Erro ao salvar categoria', 'error')
  }
}

const confirmDelete = (item: Categoria) => {
  itemToDelete.value = item
  dialogDelete.value = true
}

const deleteItem = async () => {
  try {
    if (itemToDelete.value && itemToDelete.value.id !== null) {
      await window.api.deleteCategoria(itemToDelete.value.id)
      const index = categorias.value.indexOf(itemToDelete.value)
      categorias.value.splice(index, 1)
      showSnackbar('Categoria excluída com sucesso', 'success')
    }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    showSnackbar('Erro ao excluir categoria', 'error')
  } finally {
    dialogDelete.value = false
    itemToDelete.value = null
  }
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  loadCategorias()
})
</script>

<style scoped>
.filter-input {
  max-width: 300px;
}
</style>
