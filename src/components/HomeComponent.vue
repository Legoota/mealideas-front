<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="1000">

        <v-img class="mb-4" height="150" src="@/assets/logo.png" />

        <v-row>
            <v-col cols="12" md="4">
                <router-link to="/meals" class="no-decoration">
                    <v-card
                        class="mx-auto home-card-justify"
                        max-width="344"
                        hover
                        prepend-icon="mdi-food-turkey"
                        title="Idées repas"
                        subtitle="Suggestions de repas">
                    </v-card>
                </router-link>
            </v-col>

            <v-col cols="12" md="4">
                <router-link to="calendar" class="no-decoration">
                    <v-card
                        class="mx-auto home-card-justify"
                        max-width="344"
                        hover
                        prepend-icon="mdi-calendar"
                        title="Calendrier"
                        subtitle="Calendrier des repas">
                    </v-card>
                </router-link>
            </v-col>

            <v-col cols="12" md="4">
                <router-link to="/editor" class="no-decoration">
                    <v-card
                        class="mx-auto home-card-justify"
                        max-width="344"
                        hover
                        prepend-icon="mdi-pencil"
                        title="Éditeur"
                        subtitle="Modification/ajout">
                    </v-card>
                </router-link>
            </v-col>
        </v-row>

        <br />

        <v-divider>Stats</v-divider>

        <v-row>
          <v-col cols="12" md="4">
            <v-card
              class="mt-8 mx-auto overflow-visible"
              max-width="400">
              <v-card-title>
                Nouveaux repas
              </v-card-title>

              <v-card-subtitle>
                Nombre de repas ajoutés cette année
              </v-card-subtitle>
              
              <v-card-text>
                <v-sheet
                  class="v-sheet--offset mx-auto"
                  color="#2C4A60"
                  elevation="12"
                  max-width="100%"
                  rounded>
                  <v-sparkline
                    :labels="mealsByMonthLabels"
                    :model-value="mealsByMonth"
                    color="white"
                    line-width="2"
                    padding="10"
                    stroke-linecap="round"
                    smooth>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card
              class=" mt-8 mx-auto"
              max-width="400">
              <v-card-item>
                <v-card-title>
                  Nombre de repas
                </v-card-title>

                <v-card-subtitle>
                  Nombre de repas enregistrés
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <span class="text-h1">{{ meals.length }}</span>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card
              class=" mt-8 mx-auto"
              max-width="400">
              <v-card-item>
                <v-card-title>
                  Favoris
                </v-card-title>

                <v-card-subtitle>
                  Repas les plus utilisés
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-data-table :items="top3meals" :headers="headers" :sort-by="[{ key: 'counter', order: 'desc' }]" hide-default-footer hide-default-header density="compact"></v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  import { Meal } from '@/models/meal';
  import axios from 'axios';

  const meals: Ref<Meal[]> = ref([]);
  const mealsByMonth: Ref<number[]> = ref([]);
  const mealsByMonthLabels = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];

  const headers = [
    { title: 'Nom', value: 'name', sortable: true },
    { title: 'Utilisations', value: 'counter', sortable: true },
  ];

  onMounted(async () => {
    await axios
      .get("http://localhost:8080/api/meals")
      .then(response => {
        meals.value = response.data;
        fillMealsByMonth();

      })
      .catch(err => {
          console.error(err);
        });
  });

  const top3meals = computed(() => {
        return meals.value.sort((a,b) => b.counter - a.counter).slice(0,3);
  });

  function fillMealsByMonth() {
    if(!meals.value || meals.value.length < 1) return [];
    mealsByMonth.value = [];
    let dates = meals.value.map(m => new Date(m.date_add).getMonth());
    for(let i = 0; i < 12; i++) {
      let temp = dates.filter(d => d === i).length;
      mealsByMonth.value.push(temp);
    }
  }
</script>

<style>
    .home-card-justify .v-card-item {
        justify-content: center;
    }

    .no-decoration {
        text-decoration: none;
    }
</style>