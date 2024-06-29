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

      <v-btn prepend-icon="mdi-check-circle" color="success" @click="generate">
        Générer
      </v-btn>

      <v-btn prepend-icon="mdi-delete-circle" color="error" @click="cancel">
        Annuler
      </v-btn>

      <v-btn prepend-icon="mdi-cancel" color="warning" @click="reset">
        Réinitialiser valeurs
      </v-btn>

      <v-data-table :items="meals" :headers="headers" :sort-by="[{ key: 'date_lastuse', order: 'desc' }]" v-model="selectedMeals" show-select>

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
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  import { Meal } from '@/models/meal';
  import { useDate } from 'vuetify';
  import axios from "axios";

  const DEFAULT_MEAL_NUMBER = 14; // 1 week
  const meals : Ref<Meal[]> = ref([]);

  const headers = [
    { title: 'Nom', value: 'name', sortable: true },
    { title: 'Utilisé le', value: 'date_lastuse', sortable: true },
    { title: 'Utilisations', value: 'counter', sortable: true },
    { title: 'Type', value: 'type', sortable: true },
    { title: 'Statut', key: 'status', sortable: false },
  ];

  let numberOfMeals: Ref<number> = ref(DEFAULT_MEAL_NUMBER);
  let beforeDate: Ref<Date> = ref(new Date());
  let snackbar: Ref<boolean> = ref(false);
  let snackbarText: Ref<string> = ref("");
  let snackbarColor: Ref<string> = ref("green");
  
  let selectedMeals: Ref<number[]> = ref([]);

  function reset() {
    numberOfMeals.value = DEFAULT_MEAL_NUMBER;
    beforeDate.value = new Date();
  };

  function cancel() {
    meals.value = [];
  }

  function isLocked(id: number) {
    return selectedMeals.value.includes(id);
  }

  async function generate() {
    console.log("generate with", numberOfMeals.value, beforeDate.value);
    await axios
      .get("http://localhost:8080/api/meals/getAllBeforeForType/" + 1, { params : { date: beforeDate.value }})
      .then(response => {
        meals.value = response.data;
        snackbarColor.value = "green";
        snackbarText.value = meals.value.length + " repas possibles récupérés";
        snackbar.value = true;
      })
      .catch(err => {
          console.error(err);
          snackbarColor.value = "red";
          snackbarText.value = "Erreur lors de la récupération des repas !";
          snackbar.value = true;
        });
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
