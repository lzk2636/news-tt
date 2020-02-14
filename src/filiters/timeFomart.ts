import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime' // 全局使用简体中文
import Vue from 'vue'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
Vue.filter('formatDate', function (time:string) {
  return dayjs().from(dayjs(time)) // 2 年以前
})
