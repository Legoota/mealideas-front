<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <v-snackbar
        v-model="snackbar"
        :timeout="2500"
        elevation="24"
        :color="snackbarColor">
        {{ snackbarText }}
      </v-snackbar>
      <v-data-table :items="meals" :headers="headers" :sort-by="[{ key: 'date_lastuse', order: 'desc' }]">

        <template v-slot:item.date_add="{ value }">
          {{ value ? useDate().format(value, "keyboardDateTime24h") : "-" }}
        </template>

        <template v-slot:item.date_lastuse="{ value }">
          {{ value ? useDate().format(value, "keyboardDateTime24h") : "-" }}
        </template>

        <template v-slot:item.type="{ value }">
          <v-icon>{{ mdiFoodIcon(value) }}</v-icon>
        </template>

        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Liste</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn class="mb-2" color="primary" dark v-bind="props">
                  Nouveau plat
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Dessert name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-number-input
                          v-if="editedIndex > -1"
                          label="Nombre d'utilisations"
                          :min="0"
                          v-model="editedItem.counter"
                        ></v-number-input>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-select v-model="editedItem.type" :items="types" item-title="name" item-value="id" label="Type"></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    Annuler
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="save">
                    Sauvegarder
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Êtes-vous sûr(e) de vouloir supprimer ?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Annuler</v-btn>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="deleteItemConfirm">
                    Oui
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  import { Ref, onMounted } from "vue";
  import { Meal } from "@/models/meal";
  import { Type } from "@/models/type";
  import { useDate } from 'vuetify';
  import { ref, nextTick, watch, computed } from "vue";
  import axios from "axios";

  const meals : Ref<Meal[]> = ref([]);
  const types : Ref<Type[]> = ref([]);
 
  const headers = [
    { title: 'Nom', value: 'name', sortable: true },
    { title: 'Date d\'ajout', value: 'date_add', sortable: true },
    { title: 'Utilisé le', value: 'date_lastuse', sortable: true },
    { title: 'Nombre de fois', value: 'counter', sortable: true },
    { title: 'Type', value: 'type', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
  ];

  let snackbar: Ref<boolean> = ref(false);
  let snackbarText: Ref<string> = ref("");
  let snackbarColor: Ref<string> = ref("green");
  let dialog: Ref<boolean> = ref(false);
  let dialogDelete: Ref<boolean> = ref(false);
  let editedIndex: Ref<number> = ref(-1);
  let editedItem: Ref<Meal> = ref({
    id: 0,
    name: "",
    date_add: new Date(),
    date_lastuse: new Date(),
    counter: 0,
    type: 1
  });
  let defaultItem: Ref<Meal> = ref({
    id: 0,
    name: "",
    date_add: new Date(),
    date_lastuse: new Date(),
    counter: 0,
    type: 1
  });

  onMounted(async () => {
    await axios
      .get('http://localhost:8080/api/types')
      .then(response => {
        types.value = response.data
      })
      .catch(err => {
          console.error(err);
        });
    await axios
      .get('http://localhost:8080/api/meals')
      .then(response => {
        meals.value = response.data
      })
      .catch(err => {
          console.error(err);
          snackbarColor.value = "red";
          snackbarText.value = "Erreur lors de la récupération des repas !";
          snackbar.value = true;
        });
  });

  watch(dialog, (newVal) => {
    newVal || close();
  });

  watch(dialogDelete, (newVal) => {
    newVal || closeDelete();
  });

  const formTitle = computed(() => {
        return editedIndex.value === -1 ? 'Nouveau plat' : 'Modifier plat';
  });

  function mdiFoodIcon(type: number) {
    let mdi = "";
    switch(type) {
      case 1:
        mdi = "mdi-food-turkey";
        break;
      case 2:
        mdi = "mdi-cupcake";
        break;
      case 3:
        mdi = "mdi-peanut";
        break;
      default:
        mdi = "mdi-help-box";
        break;
    }
    return mdi;
  }

  function deleteItem(item: any) {
    editedIndex.value = meals.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialogDelete.value = true;
  };

  async function deleteItemConfirm() {
    meals.value.splice(editedIndex.value, 1);
    console.log("axios delete", editedItem.value);
    await axios.delete("http://localhost:8080/api/meals/" + editedItem.value.id)
      .then(() => {
        snackbarColor.value = "green";
        snackbarText.value = "Repas supprimé !";
        snackbar.value = true;
      })
      .catch(err => {
        console.error(err);
        snackbarColor.value = "red";
        snackbarText.value = "Erreur lors de la suppression du repas !";
        snackbar.value = true;
      })
    closeDelete();
  };

  function closeDelete() {
    dialogDelete.value = false;
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem.value);
      editedIndex.value = -1;
    });
  };

  function editItem(item: any) {
    editedIndex.value = meals.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialog.value = true;
  };

  async function save() {
    if (editedIndex.value > -1) {
      Object.assign(meals.value[editedIndex.value], editedItem.value);
      await axios.put("http://localhost:8080/api/meals/" + editedItem.value.id, editedItem.value)
        .then(() => {
          snackbarColor.value = "green";
          snackbarText.value = "Repas modifié !";
          snackbar.value = true;
        })
        .catch(err => {
          console.error(err);
          snackbarColor.value = "red";
          snackbarText.value = "Erreur lors de la modification du repas !";
          snackbar.value = true;
        });
    } else {
      meals.value.push(editedItem.value);
      await axios.post("http://localhost:8080/api/meals", editedItem.value)
        .then(() => {
          snackbarColor.value = "green";
          snackbarText.value = "Repas ajouté !";
          snackbar.value = true;
        })
        .catch(err => {
          console.error(err);
          snackbarColor.value = "red";
          snackbarText.value = "Erreur lors de l'ajout du repas !";
          snackbar.value = true;
        });
    }
    close();
  };

  function close() {
    dialog.value = false;
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem.value);
      editedIndex.value = -1;
    });
  };
</script>
