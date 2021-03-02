import Vue from "vue";
import Vuex from "vuex";
import cookie from "vue-cookies";

Vue.use(Vuex);

export default new Vuex.Store({
  // state: {
  //   access_token: "",
  //   refresh_token: "",
  //   expiresIn: "",
  //   //userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
  // },
  mutations: {
    setToken(state, data) {
      state.access_token = data.accessToken;
      state.refresh_token = data.refreshToken;
      cookie.set("access_token", data.accessToken, data.expiresIn);
      cookie.set("refresh_token", data.refreshToken, data.expiresIn);
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
      return cookie.get("access_token");
    },
  },
  actions: {},
  modules: {},
});
