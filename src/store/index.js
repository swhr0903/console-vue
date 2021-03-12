import Vue from "vue";
import Vuex from "vuex";
import cookie from "vue-cookies";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    access_token: "",
    refresh_token: "",
    expiresIn: "",
  },
  mutations: {
    setToken(state, data) {
      state.access_token = data.accessToken;
      state.refresh_token = data.refreshToken;
      cookie.set("access_token", data.accessToken, data.expiresIn);
      cookie.set("refresh_token", data.refreshToken, data.expiresIn * 10);
    },
    removeToken(state) {
      state.access_token = "";
      state.refresh_token = "";
      cookie.set("access_token", "");
      cookie.set("refresh_token", "");
    },
  },
  getters: {
    getAccessToken: (state) => {
      let accessToken =
        state.access_token &&
        state.access_token != null &&
        state.access_token != ""
          ? state.access_token
          : cookie.get("access_token");
      //console.log("accessToken---------"+accessToken)
      return accessToken;
    },
    getRefreshToken: (state) => {
      let refreshToken =
        state.refresh_token &&
        state.refresh_token != null &&
        state.refresh_token != ""
          ? state.refresh_token
          : $cookies.get("refresh_token");
      //console.log("refresh_token---------"+refresh_token)
      return refreshToken;
    },
  },
  actions: {},
  modules: {},
});
