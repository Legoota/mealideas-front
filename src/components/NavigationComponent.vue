<template>
    <v-bottom-navigation grow>
        <v-btn value="home" @click="changeRoute('')">
            <v-icon>mdi-home</v-icon>
            <span>Accueil</span>
      </v-btn>

      <v-btn value="meals" @click="changeRoute('meals')">
        <v-icon>mdi-food-turkey</v-icon>
        <span>Idées</span>
      </v-btn>

      <v-btn value="calendar" @click="changeRoute('calendar')">
        <v-icon>mdi-calendar</v-icon>
        <span>Calendrier</span>
      </v-btn>

      <v-btn value="editor" @click="changeRoute('editor')">
        <v-icon>mdi-pencil</v-icon>
        <span>Édition</span>
      </v-btn>
    </v-bottom-navigation>
</template>

<script setup lang="ts">
    const router = useRouter();

    function changeRoute(to: string) {
        if(to == "") {
            router.push({path: "/"});
        }
        else {
            router.push('/' + to);
        }
    }
</script>
