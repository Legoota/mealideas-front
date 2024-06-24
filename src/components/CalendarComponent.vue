<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="1000">
      <v-calendar
        v-model="value"
        view-mode="month"
        :events="mealDates"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      ></v-calendar>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { Meal } from '@/models/meal';
import axios from "axios";

  const value: Ref<Date[]> = ref([new Date()]);
  const meals : Ref<Meal[]> = ref([]);

  onMounted(async () => {
  await axios
    .get('http://localhost:8080/api/meals')
    .then(response => {
      meals.value = response.data
    })
    .catch(err => {
        console.error(err);
      });
  });

  const mealDates = computed(() => {
    if(!meals || !meals.value || meals.value.length < 1) return [];
    let mealsToAdd = meals.value.filter(m => m.date_lastuse);
    return mealsToAdd.map(m => { 
      return {
        title: m.name,
        start: new Date(m.date_lastuse || new Date()),
        end: new Date(m.date_lastuse || new Date()),
        allDay: true,
        color: ["green", "red", "blue"][m.type -1]
      }
    });
  });

</script>
