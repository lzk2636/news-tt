<template>
  <div id="container">
    <div class="inputForm">
      <van-cell-group>
        <van-field left-icon="phone-o" v-model="phone" placeholder="请输入手机号" />
        <van-field left-icon="paid" v-model="code" placeholder="请输入验证码" />
      </van-cell-group>
    </div>

    <div class="login-button">
      <van-button type="info" size="large" @click="login">登录</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { http } from "@/utils/http";
// import vanButton from '../../../node_modules/@vant/weapp/dist/button'

export default Vue.extend({
 
  data() {
    return {
      phone: "",
      code: ""
    };
  },
  onLoad() {},
  methods: {
    async login() {
      let res: any = await http({
        url: "authorizations",
        method: "POST",
        data: {
          mobile: this.phone,
          code: this.code
        }
      });
      // const data=
      if (res.statusCode === 201) {
        this.$store.commit("increment", res.data.data);
        uni.setStorageSync("my_token", res.data.data);
        // console.log(res)
        uni.reLaunch({
          url: "/pages/home/index"
        });
      }
    }
  }
});
</script>

<style lang="less" scoped>
#container {
  .login-button {
    margin: 10px;
  }
  .inputForm {
    // width: 55px;
  }
}
</style>
