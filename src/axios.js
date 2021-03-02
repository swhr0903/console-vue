import axios from "axios";
import Element from "element-ui";
import router from "./router";
import store from "./store";

axios.defaults.baseURL = "http://www.frank.com";

// 前置拦截
axios.interceptors.request.use(
  (config) => {
    config.headers.version = "v1";
    if (localStorage.JWT_TOKEN) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = "Bearer ${localStorage.JWT_TOKEN}";
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
    if (status === 200) {
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
