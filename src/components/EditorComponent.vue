<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <template v-slot:text>
      <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>
      <v-data-table :items="meals" :headers="headers" :sort-by="[{ key: 'date_lastuse', order: 'desc' }]"></v-data-table>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import { Meal } from "../models/meal.ts";
  import { ref } from "vue";
  import axios from "axios";

  const meals = ref([]);
 
  const headers = [
    { title: 'Nom', value: 'name' },
    { title: 'Date d\'ajout', value: 'date_add' },
    { title: 'Utilisé le', value: 'date_lastuse' },
    { title: 'Nombre de fois', value: 'counter' },
    { title: 'Type', value: 'type' }
  ];

  let dialog: boolean = false;
  let dialogDelete: boolean = false;
  let search: string = '';

  onMounted(async () => {
    await axios
      .get('http://localhost:8080/api/meals')
      .then(response => {
        meals.value = response.data
      })
      .catch(err => console.error(err));
  })
</script>
