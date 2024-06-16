<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="1000">
      <v-calendar
        v-model="value"
        view-mode="month"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      ></v-calendar>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  const value = new Date();

</script>
