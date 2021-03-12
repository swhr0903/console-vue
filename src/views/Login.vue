<template>
  <div>
    <el-container>
      <el-header>
        <router-link to="/blogs">
          <img
            src="https://www.markerhub.com/dist/images/logo/markerhub-logo.png"
            style="height: 60%; margin-top: 10px"
          />
        </router-link>
      </el-header>

      <el-main>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              maxlength="12"
              v-model="ruleForm.username"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登录</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        password: "000000",
        username: "admin",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getToken();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getPublicKey: async function(username) {
      let publicKey;
      await this.$axios
        .post("/encrypt/getPublicKey/" + username, {})
        .then((res) => {
          if (res.data.code == "00000") {
            publicKey = res.data.data;
          }
        });
      return publicKey;
    },
    login: async function(publicKey) {
      let encrypted = this.$encrypt(publicKey, this.ruleForm.password);
      var params = new URLSearchParams();
      params.append("username", this.ruleForm.username);
      params.append("password", encrypted);
      await this.$axios.post("/auth", params);
    },
    oauthAuth: async function() {
      let params;
      await this.$axios
        .post(
          "/oauth/authorize?client_id=web&response_type=code&redirect_uri=http://www.frank.com/oauth/callback&state=cn",
          {}
        )
        .then((res) => {
          if (res.data != null) {
            params = res.data;
          }
        });
      return params;
    },
    getToken: async function() {
      let params;
      let publicKey = await this.getPublicKey(this.ruleForm.username);
      if (Object.keys(publicKey).length > 0) {
        await this.login(publicKey);
        params = await this.oauthAuth();
      }
      if (Object.keys(params).length > 0) {
        let authorization_code = params.code;
        await this.$axios
          .post(
            "http://www.frank.com/oauth/token?grant_type=authorization_code&client_id=web" +
              "&client_secret=$2a$10$SOL5PyvzJzzRWfam8ykp3OmdRkdFzPCgQNq02arvDYPHcWYkwS/ZK" +
              "&code=" +
              authorization_code +
              "&redirect_uri=http://www.frank.com/oauth/callback",
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  // mounted() {
  //   this.$notify({
  //     title: "看这里：",
  //     message: "关注公众号：MarkerHub，回复【vueblog】，领取项目资料与源码",
  //     duration: 1500,
  //   });
  // },
};
</script>
