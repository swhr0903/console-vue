import router from "./router";
import store from "./store";

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    const token = store.getters.getAccessToken;
    if (token) {
      if (to.path === "/login") {
    
      } else {
        next();
      }
    } else {
      next({
        path: "/login",
      });
    }
  } else {
    next();
  }
});
