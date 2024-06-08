<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900">

        <v-img class="mb-4" height="150" src="@/assets/logo.png" />

        <v-row>
            <v-col cols="12" md="4">
                <router-link to="/meals">
                    <v-card
                        class="mx-auto"
                        max-width="344"
                        hover>
                        <v-card-item>
                        <v-card-title>
                            Idées repas
                        </v-card-title>

                        <v-card-subtitle>
                            Suggestions de repas
                        </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </v-card-text>
                    </v-card>
                </router-link>
            </v-col>

            <v-col cols="12" md="4">
                <router-link to="calendar">
                    <v-card
                        class="mx-auto"
                        max-width="344"
                        hover>
                        <v-card-item>
                        <v-card-title>
                            Calendrier
                        </v-card-title>

                        <v-card-subtitle>
                            Calendrier des repas
                        </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </v-card-text>
                    </v-card>
                </router-link>
            </v-col>

            <v-col cols="12" md="4">
                <router-link to="/editor">
                    <v-card
                        class="mx-auto"
                        max-width="344"
                        hover>
                        <v-card-item>
                        <v-card-title>
                            Éditeur
                        </v-card-title>

                        <v-card-subtitle>
                            Modification/ajout
                        </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </v-card-text>
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
