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
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  import { Meal } from '@/models/meal';
  import axios from "axios";

  const DEFAULT_MEAL_NUMBER = 14; // 1 week
  const meals : Ref<Meal[]> = ref([]);

  let numberOfMeals: Ref<number> = ref(DEFAULT_MEAL_NUMBER);
  let beforeDate: Ref<Date> = ref(new Date());
  let snackbar: Ref<boolean> = ref(false);
  let snackbarText: Ref<string> = ref("");
  let snackbarColor: Ref<string> = ref("green");

  function reset() {
    numberOfMeals.value = DEFAULT_MEAL_NUMBER;
    beforeDate.value = new Date();
  };

  function cancel() {
    console.log("cancel");
  }

  async function generate() {
    console.log("generate with", numberOfMeals.value, beforeDate.value);
    await axios
      .get("http://localhost:8080/api/meals/getAllBeforeForType/" + 1)
      .then(response => {
        meals.value = response.data
      })
      .catch(err => {
          console.error(err);
          snackbarColor.value = "red";
          snackbarText.value = "Erreur lors de la récupération des repas !";
          snackbar.value = true;
        });
  }
</script>
