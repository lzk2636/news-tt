<template>
  <view>
    <van-cell-group>
      <van-cell v-for="(item, index) in resultList" @click="toDetail(item.art_id)" :key="index">
        <template slot="default">
          <view class="title">{{item.title}}</view>
          <view class="grid">
          <block v-for="(imagesSrc, imageIndex) in item.cover.images" :key="imageIndex">
            <image :src="imagesSrc"></image>
          
          </block>
          
          </view>
          <view class="info">
          <text class="msg">{{item.aut_name}}</text>
          <text class="msg">{{item.comm_count}}评论</text>
          <text class="msg">{{item.pubdate | formatDate}}} </text>          
          </view>
           <view class="image-box">
              <view class="item">
                <text class="image-title">{{item.comm_count}}</text>
                <van-icon name="comment-o" />
              </view>
              <view class="item">
                <text class="image-title">{{item.like_count}}</text>
                <van-icon name="good-job-o" />
              </view>
              <view class="item">
                <text class="image-title">分享</text>
                <van-icon name="friends-o" />
              </view>
            </view>
        </template>
      </van-cell>
    </van-cell-group>
  </view>
</template>

<script lang="ts">
import { http } from '@/utils/http'
import Vue from "vue";
export default Vue.extend({
  data() {
    const resultList:any[]=[]
    return {
      resultList:resultList,
      count:1,
      page:1,
    };
  },
  onLoad(options) {},
  async onShow() {
    this.resultList=[]
    this.page=1
    // console.log(this.$store.state.keywords);
    if(this.$store.state.keywords.trim().length<=0) return
    let res:any = await http({
      url:"search",
      data:{
        page:this.page,
        per_page:10,
        q:this.$store.state.keywords
      }
    })
    // console.log(res)
    if(res.statusCode===401){
      this.$toast.fail("若传递token，但token过期，则返回401")
      return
    }
    if(res.statusCode===200){
    this.resultList=[...this.resultList,...res.data.data.results]

    }




  },
  methods: {
    toDetail(id:any){
      uni.navigateTo({
        url:"/pages/infoDetail/index?id="+id
      })

    }
  },
  async onReachBottom(){
    console.log(this.page++)
     let res:any = await http({
      url:"search",
      data:{
        page:this.page,
        per_page:10,
        q:this.$store.state.keywords
      }
    })
      if(res.statusCode===401){
      this.$toast.fail("若传递token，但token过期，则返回401")
      return
    }
    if(res.statusCode===200){
    this.resultList=[...this.resultList,...res.data.data.results]

    }
  },
});
</script>

<style lang='less' scoped>
.title {
  font-size: 16px;
  font-weight: 500;
  color: #3a3a3a;
}
.grid {
  display: flex;
  // padding: 15px;
  justify-content: space-between;
  image {
    width: 123px;
    height: 73px;
  }
}
.image-box {
  height: 45px;
  display: flex;
  justify-content: space-between;
  // align-items: center;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    border: 1px solid #ccc;
    // text-align: center;
    text{
      margin-right: 5px;
    }
    .van-icon{
      font-size: 20px;
    }

  }
  .item:nth-child(2) {
    border-width: 1px 0 1px 0;
  }
}
.info {
  .msg {
    margin-left: 5px;
  }
}
</style>
