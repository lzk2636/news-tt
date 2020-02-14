<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  mpType: "app",
  onLaunch() {
    // console.log("App Launch");
    // console.log(this)
  let token =  uni.getStorageSync("my_token")
  if(token){
    // increment (state,payload) {
      this.$store.commit("increment",token)
      uni.reLaunch({
          url:"/pages/home/index"
      })
  }
  // console.log(token)
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  }
});
</script>

<style>
/*每个页面公共css */
 @import "vant/lib/index.css";
page {
  background: #f5f7f9;
  height: 100%;
}
</style>
