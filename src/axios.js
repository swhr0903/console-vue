import axios from "axios";
import Element from "element-ui";
import router from "./router";
import store from "./store";

axios.defaults.baseURL = "http://www.frank.com";

// 前置拦截
axios.interceptors.request.use(
  (config) => {
    config.headers.version = "v1";
    let url = config.url;
    if (!url.match(new RegExp("|login|oauth|encrypt"))) {
      var token = store.getters.getAccessToken;
      if (token) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = token;
      } else {
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (response) => {
    let status = response.status;
    let code = response.data.code;
    if (status === 200) {
      if (code == "A0230") {
        const refresh_token = store.getters.getRefreshToken;
        return axios
          .post(
            "http://www.frank.com/oauth/token?grant_type=refresh_token&client_id=web" +
              "&client_secret=$2a$10$SOL5PyvzJzzRWfam8ykp3OmdRkdFzPCgQNq02arvDYPHcWYkwS/ZK" +
              "&refresh_token=" +
              refresh_token,
            {}
          )
          .then(({ res }) => {
            let data = res.data.data;
            this.$store.commit("setToken", {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresIn: data.expiresIn,
            });
            originalRequest.headers.Authorization = data.accessToken;
            return axios(originalRequest);
          });
      }
      return response;
    } else {
      Element.Message.error(res.msg, { duration: 3 * 1000 });
      return Promise.reject(response.data.msg);
    }
  },
  (error) => {
    console.log(error);
    if (error.response.data) {
      error.message = error.response.data.msg;
    }

    if (error.response.status === 401) {
      store.commit("REMOVE_INFO");
      router.push("/login");
    }

    Element.Message.error(error.message, { duration: 3 * 1000 });
    return Promise.reject(error);
  }
);

async function getToken() {
  let refresh_code = cookie.get("refresh_code");
  if (Object.keys(refresh_code).length == 0) {
    this.$router.push("/login");
  } else {
    await this.$axios
      .post(
        "http://www.frank.com/oauth/token?grant_type=refresh_token&client_id=web" +
          "&client_secret=$2a$10$SOL5PyvzJzzRWfam8ykp3OmdRkdFzPCgQNq02arvDYPHcWYkwS/ZK" +
          "&refresh_token=" +
          refresh_token,
        {}
      )
      .then((res) => {
        let data = res.data.data;
        this.$store.commit("setToken", {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
        });
        this.$router.push("/");
      });
  }
}
