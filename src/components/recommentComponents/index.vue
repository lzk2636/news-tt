<template>
  <van-popup
  @input="$emit('input',$event.target)"
  :value="value"
  closeable
  position="bottom"
  :style="{ height: '50%' }"
  >
  <!-- 以下评论列表 -->
   <van-cell>
      <template slot="title">
        <image :src="item.aut_photo" />
        <view class="commentContent">
          <view class="usename">{{item.aut_name}}</view>
          <view class="conntent">{{item.content}}</view>
          <view class="times">
            {{item.pubdate | formatDate}}
            <!-- <van-button type="default" size="mini" round @click="toRecomment(item)">回复{{item.reply_count}}</van-button> -->
          </view>
        </view>
        <van-icon name="star">0</van-icon>
      <!-- {{item.reply_count}} -->
      </template>
    </van-cell>
    <van-cell>
      以下是对该评论的回复
    </van-cell>
    <recommentList :commId="commId" @recommentCount='recommentCount'></recommentList>
  
  
  <input-comment :commId="commId" :artId="artId" :value="value"></input-comment>
  </van-popup>
</template>

<script>
import Bus from '@/utils/bus'
export default {
  components:{
    inputComment:()=>import('@/components/inputComment'),
    recommentList:()=>import('@/components/recommentList')
  },
  props:{
    value:{
      type:Boolean,
      default:false
    },
    artId:{
      type:String,
      default:""
    }
  },
  methods:{
   recommentCount(count){
    //  console.log(count)
     this.item.reply_count=count
   }
  },
  created(){
    Bus.$on("showComment",res=>{
      // console.log(res)
      this.item=res
      this.commId=res.com_id
    })
  },
  data () {
    return {
      item:{},
      commId:0,
      allCount:0
    }
  }

}
</script>

<style lang="less" scoped>
.van-cell {
  .van-cell__title {
    display: flex;
    image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .commentContent {
      flex: 1;
      margin-left: 10px;
      .van-button {
        background-color: #eff7f8;
        margin-left: 10px;
      }
    }
  }
}
</style>