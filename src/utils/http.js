let BASE_URL = "http://ttapi.research.itcast.cn/app/v1_0/"
import store from '@/store/index.ts'
// var JSONbig = require('../../node_modules/json-bigint');
export const http = ({ url = "", method="GET", tips = "正在加载中....", header = { Authorization: "" }, data = {}, allUrl = "",dataType="json" }) => {
  uni.showLoading({
    title: tips
  })
  let token = store.state.userInfo.token
  let httpUrl = ''

  if (token) {
    header.Authorization = `Bearer ${token}`
  }
  if (url !== '') {
    httpUrl = `${BASE_URL}${url}`
  }
  if (allUrl !== '') {
    httpUrl = allUrl
  }
  // console.log(httpUrl)

  return new Promise((resolve, reject) => {
    uni.request({
      url: httpUrl,
      data,
      dataType,
      header,
      method,
      success: res => {
         resolve(res)
      },
      fail: err => {
        reject(err);
        // console.log(err)
      },
      complete(res) {
        // JSONbig.parse(JSONbig.stringify(res))
        uni.hideLoading()
         
      }
    })
  })
}