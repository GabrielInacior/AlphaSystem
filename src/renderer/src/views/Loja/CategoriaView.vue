<template>
  <v-container fluid class="categoria-container pa-6">
    <!-- Header Section with Parallax Effect -->
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold welcome-text mb-2">
                Categorias
              </h1>
              <div class="text-subtitle-1 text-white opacity-75">
                Gerencie as categorias de produtos da loja
              </div>
            </div>
            <v-avatar size="64" class="welcome-avatar">
              <v-img src="@/assets/logo.png" alt="Logo" />
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="content-card" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-shape</v-icon>
              <span class="text-h6 font-weight-medium">Lista de Categorias</span>
            </div>
            <v-btn
              color="primary"
              @click="openModal(null)"
              class="add-btn"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Nova Categoria
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <!-- Search and Filter Section -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  label="Buscar categoria"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="search-field"
                  placeholder="Digite para filtrar..."
                />
              </v-col>
            </v-row>

            <!-- Data Table -->
            <v-data-table
              :headers="headers"
              :items="filteredCategorias"
              class="elevation-0 rounded-lg"
              density="comfortable"
              hover
              :no-data-text="'Nenhuma categoria encontrada'"
              :loading-text="'Carregando categorias...'"
            >
              <template v-slot:headers>
                <tr>
                  <th v-for="header in headers" :key="header.key" class="text-left font-weight-bold">
                    {{ header.title }}
                  </th>
                </tr>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    color="primary"
                    variant="text"
                    @click="openModal(item)"
                    class="action-btn"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    variant="text"
                    @click="confirmDelete(item)"
                    class="action-btn"
                  />
                </div>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-6">
                  <v-icon color="grey" size="48" class="mb-2">mdi-shape-off</v-icon>
                  <div class="text-subtitle-1 text-grey">Nenhuma categoria encontrada</div>
                  <div class="text-caption text-grey">Clique em "Nova Categoria" para adicionar</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Categoria -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon :color="editedIndex === -1 ? 'success' : 'primary'" size="32" class="mr-4">
            {{ editedIndex === -1 ? 'mdi-plus-circle' : 'mdi-pencil' }}
          </v-icon>
          <span class="text-h6 font-weight-bold">{{ formTitle }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-text-field
            v-model="editedItem.nome"
            label="Nome da Categoria"
            prepend-inner-icon="mdi-tag"
            density="compact"
            variant="outlined"
            :error-messages="nomeError"
            @input="validateNome"
            class="mb-4"
            required
          />

          <v-textarea
            v-model="editedItem.descricao"
            label="Descrição"
            prepend-inner-icon="mdi-text"
            density="compact"
            variant="outlined"
            :error-messages="descricaoError"
            @input="validateDescricao"
            class="mb-4"
            rows="3"
            auto-grow
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            @click="close"
            variant="outlined"
            color="grey"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="save"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Confirmação de Exclusão -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="modal-card">
        <v-card-title class="d-flex align-center py-4 px-6">
          <v-icon color="error" size="32" class="mr-4">mdi-alert</v-icon>
          <span class="text-h6 font-weight-bold">Confirmar Exclusão</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <div class="text-body-1 mb-4">
            Tem certeza que deseja excluir esta categoria?
          </div>
          <div class="text-body-2 text-grey">
            Esta ação não pode ser desfeita.
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            @click="dialogDelete = false"
            variant="outlined"
            color="grey"
            class="mr-2"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="deleteItem"
          >
            <v-icon class="mr-2">mdi-delete</v-icon>
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para mensagens -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
      <div class="d-flex align-center">
        <v-icon :color="snackbarColor === 'success' ? 'white' : 'white'" class="mr-2">
          {{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ snackbarText }}
      </div>
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
  return categorias.value.filter(c =>
    c.nome.toLowerCase().includes(search.value.toLowerCase()) ||
    c.descricao.toLowerCase().includes(search.value.toLowerCase())
  )
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
.categoria-container {
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

.content-card {
  border-radius: 16px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06);
}

.search-field {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-field:hover, .search-field:focus-within {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.add-btn {
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.05);
}

.action-btn {
  min-width: 32px;
  height: 32px;
}

.modal-card {
  border-radius: 16px;
  overflow: hidden;
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
:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table th) {
  background-color: #f8fafc;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

:deep(.v-data-table td) {
  padding: 12px 16px;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
}

:deep(.v-alert) {
  border-radius: 8px;
}
</style>
