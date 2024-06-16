<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="1000">

        <v-img class="mb-4" height="150" src="@/assets/logo.png" />

        <v-row>
            <v-col cols="12" md="4">
                <router-link to="/meals">
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
                <router-link to="calendar">
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
                <router-link to="/editor">
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
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
  //
</script>

<style>
    .home-card-justify .v-card-item {
        justify-content: center;
    }
</style>