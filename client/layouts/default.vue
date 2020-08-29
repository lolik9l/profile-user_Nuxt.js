<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      fixed
      app
    >
      <v-list
        dense
        nav
        >
        <v-list-item two-line >
          <v-list-item-avatar>
            <img
              :src="`/images/users/${userData.id}/avatar/${userData.avatar}`"
              :alt="userData.name"
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ userData.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ userData.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mb-2"></v-divider>
        <v-list-item
          v-for="item in itemsNav"
          :key="item.title"
          link
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </v-list>
      <template v-slot:append>
        <v-btn link href="/login" block @click="logout">Выход</v-btn>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        Профиль пользователя  
      </v-toolbar-title> 
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      app
      class="justify-end"
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    itemsNav: [
      { title: 'Главная', to: "/", icon: 'mdi-home' },
      { title: 'Фото', to: "/photo", icon: 'mdi-image' },
      { title: 'Ваши публикации', to: "/publications", icon: 'mdi-bullhorn' },
      { title: 'Настройки профиля', to: "/settings", icon: 'mdi-cog-outline' },
    ],
  }),
  middleware: ['auth'],
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  },
  computed: {
    userData() {
      return this.$store.getters["user"];
    }
  },
  created() {
    this.$vuetify.theme.dark = true;
  }
}
</script>
