import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from "element-ui";
import axios from "axios";
import JsEncrypt from "jsencrypt";

import "element-ui/lib/theme-chalk/index.css";

import "./axios";
import "./permission";

Vue.use(Element);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$jsEncrypt = JsEncrypt;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

Vue.prototype.$encrypt = function(publicKey, data) {
  let encrypt = new this.$jsEncrypt();
  encrypt.setPublicKey(publicKey);
  let result = encrypt.encrypt(data);
  return result;
};
Vue.prototype.$decrypt = function(privateKey, data) {
  let decrypt = new this.$jsEncrypt();
  decrypt.setPrivateKey(privateKey);
  let result = decrypt.decrypt(data);
  return result;
};