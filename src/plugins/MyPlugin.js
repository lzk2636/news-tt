import store from '@/store/index.ts'
class MyPlugin {
  static install(Vue, options) {
    // 4. 添加实例方法
    Vue.prototype.$login = function (methodOptions) {
      let user = store.state.userInfo
      if (!user.token) {
        // console.log('开始的生活')
        uni.navigateTo({
          url: '/pages/login/index'
        });
        return true
      }
      // console.log('wwww')
      return false
      // 逻辑...
    }
  }

}
export default MyPlugin