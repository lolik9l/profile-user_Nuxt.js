<template>
  <v-layout>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-alert
          text
          tile
          type="error"
          transition="scale-transition"
          icon="mdi-alert"
          :value="!!errorMessage"
        >
          {{ errorMessage }}
        </v-alert>
        <v-card class="elevation-12">
          <v-toolbar
            light
            flat
            dark
          >
            <v-toolbar-title>Введите данные для входа:</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form 
              ref="form"
              v-model="valid"
            >
              <v-text-field
                label="Логин"
                name="login"
                v-model.trim="login"
                :rules="loginRules"
                prepend-icon="mdi-account"
                type="text"
                required
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-text-field
                class="mt-5"
                label="Пароль"
                name="password"
                v-model.trim="password"
                :rules="passwordRules"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="mt-3">
            <v-btn :loading="progress" x-large dark block @click.prevent="send">Войти</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
  export default {
    layout: "auth",
    data: () => ({
      errorMessage: "",
      progress: false,
      valid: false,
      login: "",
      loginRules: [
        v => !!v || 'Введите логин!',
      ],
      password: "",
      passwordRules: [
        v => !!v || 'Введите пароль!',
      ]
    }),
    methods: {
      async send() {
        if (this.valid) {
          this.progress = true;
          try {
            await this.$store.dispatch("login", {
              login: this.login,
              password: this.password
            });
            this.$router.push({ path: '/'});
          } catch(e) {
            this.errorMessage = e;
            console.error(e);
          }
          this.progress = false;
        } else {
          this.$refs.form.validate();
        }
      }
    },
    computed: {
      hasToken() {
        return this.$store.getters["hasToken"]
      }
    },
    async mounted() {
      if (!this.hasToken) {
        //если токен не записан в store то достаем его с localStorage если он там есть
        const token = localStorage.getItem('token');
        if(!token) return;
        //пороверяем токен на сервере
        const res = await this.$store.dispatch("auth", { token });
        if(!res) return;
      }
      this.$router.push({ path: '/'});
    }
  }
</script>