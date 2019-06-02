<template>
  <div class="LoginPage">
    <div class="login-wrap">
        <div class="ms-title">{{$t('message.ManagementSystem')}} </div>
        <el-form label-position="right" label-width="80px" ref="ruleForm" :rules="rules" :model="ruleForm" class="form">
          <el-form-item :label="$t('message.User')" prop="username">
            <el-input @keyup.enter.native="submitForm2('ruleForm')" v-model="ruleForm.username"  :placeholder="$t('message.enterUser')" type="username" style="width:260px;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.Password')" prop="password">
            <el-input @keyup.enter.native="submitForm2('ruleForm')" v-model="ruleForm.password"  :placeholder="$t('message.EnterPassw')" type="password" style="width:260px;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.VerificationCode')" prop="gugoRul">
            <el-input @keyup.enter.native="submitForm2('ruleForm')" v-model="ruleForm.gugoRul" :placeholder="$t('message.enterVerificationCode')" type="gugoRul" style="width:260px;"></el-input>
          </el-form-item>
          <div class="login-btn">
              <el-button type="primary" @click="submitForm2('ruleForm')" 
              :element-loading-text="$t('message.HardLoading')" 
              v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.login')}} </el-button>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error(this.$t("message.userNotEmpty")));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error(this.$t("message.passwordNotEmpty")));
      } else {
        callback();
      }
    };
    var validategugo = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error(this.$t("message.chooremNotEmpty")));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        username: "admin",
        password: "123456",
        gugoRul: "123456"
      },
      fullscreenLoading: false,
      msg: "这是一个登录页面",
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [
          { validator: validatePass, trigger: "blur" }
          //{ required: true, message: '密码不能为空',trigger: 'blur'},
        ],
        gugoRul: [{ validator: validategugo, trigger: "blur" }]
      }
    };
  },
  created: function() {
    //初始化登录页面的是否登陆为false
    // localStorage.setItem("isLogin",true);
    console.log(this.$store.getters.getToken);
    //初始化多语言，为了使表格的页脚不出错
    this.$i18n.locale = localStorage.getItem("langular") || "cn";
  },
  methods: {
    submitForm2(formName){
       this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            uname: this.ruleForm.username,
            pwd: this.ruleForm.password
          }
          this.api.post("/auth/login",params).then((res) => {
            console.log(res)
               console.log("登录成功");
              this.fullscreenLoading = false;
              this.$store.commit("setToken", { token: res.data.token });

              sessionStorage.setItem("token",  res.data.token);
              sessionStorage.setItem("isLogin", true);
              localStorage.setItem("userName", this.ruleForm.username);
              // localStorage.setItem("isLogin",true);
              this.$router.push({ path: "/index" });
          }).catch(() => {
              this.fullscreenLoading = false;
              console.log("路径错误");
          });
        }
       })
    }
  }
};
</script>

<style scoped>
.LoginPage {
  width: 100%;
  height: 100%;
  background: #ccc;
}
.login-wrap {
  width: 380px;
  height: 330px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -190px;
  margin-top: -165px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  -ms-border-radius: 15px;
  -o-border-radius: 15px;
  background: white;
}
.ms-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
}
.form {
  margin-top: 40px;
  width: 90%;
}
.login-btn {
  text-align: center;
}
</style>
