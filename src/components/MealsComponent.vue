<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="1000">
      <v-snackbar
        v-model="snackbar"
        :timeout="2500"
        elevation="24"
        :color="snackbarColor">
        {{ snackbarText }}
      </v-snackbar>

      <v-number-input
        label="Nombre de repas"
        :min="0"
        v-model="numberOfMeals">
      </v-number-input>

      <v-date-input
        v-model="beforeDate"
        label="Dernière utilisation avant le"
        variant="solo-filled"
        prepend-icon="">
      </v-date-input>

      <v-select 
        v-model="typeOfMeals"
        :items="types"
        item-title="name"
        item-value="id"
        label="Type">
      </v-select>

      <div class="meal-buttons">
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn :disabled="selectedMeals.length >= numberOfMeals" prepend-icon="mdi-check-circle" color="success" @click="generate">
              {{suggestedMeals.length < 1 ? "Générer" : "Reroll"}}
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn prepend-icon="mdi-delete-circle" color="error" @click="cancel">
              Annuler
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-data-table :items="suggestedMeals" :headers="suggestionHeaders" v-model="selectedMeals" show-select return-object :items-per-page="-1">
        <template v-slot:item.date_add="{ value }">
          {{ value ? useDate().format(value, "keyboardDate") : "-" }}
        </template>

        <template v-slot:item.date_lastuse="{ value }">
          {{ value ? useDate().format(value, "keyboardDate") : "-" }}
        </template>

        <template v-slot:item.type="{ value }">
          <v-icon>{{ mdiFoodIcon(value) }}</v-icon>
        </template>

        <template v-slot:item.status="{ item }">
          <v-icon v-if="isLocked(item.id)" class="me-2" size="small" @click="">mdi-lock</v-icon>
          <v-icon v-else class="me-2" size="small" @click="">mdi-debug-step-over</v-icon>
        </template>
      </v-data-table>

      <div class="update-meals">
        <v-btn :disabled="selectedMeals.length < numberOfMeals" prepend-icon="mdi-check-circle" color="success" @click="updateSelectedMeals">
          Mettre à jour les repas sélectionnés
        </v-btn>
      </div>


        <div v-if="finalMeals.length > 0">

          <br />
          <v-divider></v-divider>
          <br />

          <span class="text-h3">Repas sélectionnés :</span>

          <v-data-table :items="finalMeals" :headers="finalHeaders" :items-per-page="-1">
            <template v-slot:item.type="{ value }">
              <v-icon>{{ mdiFoodIcon(value) }}</v-icon>
            </template>
            </v-data-table>
        </div>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  import { Meal } from '@/models/meal';
  import { Type } from '@/models/type';
  import { useDate } from 'vuetify';
  import axios from "axios";

  const DEFAULT_MEAL_NUMBER = 14; // 1 week
  const meals: Ref<Meal[]> = ref([]);
  const types: Ref<Type[]> = ref([]);

  const suggestionHeaders = [
    { title: 'Nom', value: 'name', sortable: true },
    { title: 'Utilisé le', value: 'date_lastuse', sortable: true },
    { title: 'Utilisations', value: 'counter', sortable: true },
    { title: 'Type', value: 'type', sortable: true },
    { title: 'Notes', key: 'notes', sortable: false },
    { title: 'Statut', key: 'status', sortable: false },
  ];
  const finalHeaders = [
    { title: 'Nom', value: 'name', sortable: true },
    { title: 'Type', value: 'type', sortable: true },
    { title: 'Notes', key: 'notes', sortable: false },
  ];

  let numberOfMeals: Ref<number> = ref(DEFAULT_MEAL_NUMBER);
  let beforeDate: Ref<Date> = ref(new Date());
  let typeOfMeals: Ref<number> = ref(1);
  let snackbar: Ref<boolean> = ref(false);
  let snackbarText: Ref<string> = ref("");
  let snackbarColor: Ref<string> = ref("green");
  
  let suggestedMeals: Ref<Meal[]> = ref([]);
  let selectedMeals: Ref<Meal[]> = ref([]);
  let finalMeals: Ref<Meal[]> = ref([]);

  onMounted(async () => {
    await axios
      .get("http://localhost:8080/api/types")
      .then(response => {
        types.value = response.data
      })
      .catch(err => {
          console.error(err);
        });
  });


  function cancel() {
    selectedMeals.value = [];
  }

  function isLocked(id: number) {
    return selectedMeals.value.map(m => m.id).includes(id);
  }

  async function generate() {
    await axios
      .get("http://localhost:8080/api/meals/getAllBeforeForType/" + typeOfMeals.value, { params : { date: beforeDate.value }})
      .then(response => {
        meals.value = response.data;
        snackbarColor.value = "green";
        snackbarText.value = meals.value.length + " repas possibles récupérés";
        snackbar.value = true;
        etchebest(numberOfMeals.value);
      })
      .catch(err => {
          console.error(err);
          snackbarColor.value = "red";
          snackbarText.value = "Erreur lors de la récupération des repas !";
          snackbar.value = true;
        });
  }

  function etchebest(mealNumber: number) {
    suggestedMeals.value = [];
    if(selectedMeals.value.length > 0) {
      suggestedMeals.value = suggestedMeals.value.concat(selectedMeals.value);
    }
    let suggestions = meals.value.filter(m => !selectedMeals.value.map(s => s.id).includes(m.id)).sort(() => 0.5 - Math.random());

    let numberToAdd = mealNumber - suggestedMeals.value.length;

    suggestions = suggestions.slice(0, numberToAdd);

    suggestedMeals.value = suggestedMeals.value.concat(suggestions);
  }

  async function updateSelectedMeals() {
    await axios
      .put("http://localhost:8080/api/meals/updateuse", selectedMeals.value.map(m => m.id))
      .then(response => {
        finalMeals.value.push(...selectedMeals.value);
        snackbarColor.value = "green";
        snackbarText.value = response.data + " repas enregistrés !";
        snackbar.value = true;
        selectedMeals.value = [];
        suggestedMeals.value = [];
      })
      .catch(err => {
        console.error(err);
        snackbarColor.value = "red";
        snackbarText.value = "Erreur lors de la sauvegarde de la sélection !";
        snackbar.value = true;
      })
  }

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
</script>

<style>
  .meal-buttons {
    margin-bottom: 1em;
  }

  .update-meals {
    display: flex;
    justify-content: center;
    margin: 1em;
  }
</style>