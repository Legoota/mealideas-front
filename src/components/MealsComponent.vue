<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="1000">
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
  let numberOfMeals: Ref<number> = ref(0);
  let beforeDate: Ref<Date> = ref(new Date());

  function reset() {
    numberOfMeals.value = 0;
    beforeDate.value = new Date();
  };

  function cancel() {
    console.log("cancel");
  }

  function generate() {
    console.log("generate with ", numberOfMeals.value, beforeDate.value);
  }
</script>
