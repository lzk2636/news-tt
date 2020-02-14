<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoads">
    <van-cell v-for="(item,index) in list" :key="index">
      <template slot="title">
        <image :src="item.aut_photo" />
        <view class="commentContent">
          <view class="usename">{{item.aut_name}}</view>
          <view class="conntent">{{item.content}}</view>
          <view class="times">
            {{item.pubdate | formatDate}}
            <van-button type="default" size="mini" round @click="toRecomment(item)">回复{{item.reply_count}}</van-button>
          </view>
        </view>
        <van-icon name="star">0</van-icon>
        <!-- {{artId}} -->
      </template>
    </van-cell>
  </van-list>
</template>

<script>
import { http } from "@/utils/http";
import Bus from '@/utils/bus';
import JSONbig from "json-bigint";
export default {
  props:  ['artId'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      time: 1
    }
  },
  created(){
    Bus.$on('commentOne',res=>{
      // console.log(res)

      this.list.unshift(res)
      Bus.$emit("allCount",this.list.length)
      // console.log(this.list.length)
    })
  },
  methods: {
    toRecomment(item){
      // console.log(item)
      this.$emit('openReComment',true);
      Bus.$emit('showComment',item)


    },
    async onLoads() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.time === 1) {
        let res = await http({
          url: "comments",
          data: {
            type: "a",
            source: this.artId,
            // offset:this.offset,
            limit: 10
          },
          dataType:'text'
        });
        if (res.statusCode === 200) {
          res.data= JSONbig.parse(res.data)
          this.list = res.data.data.results;
          this.loading = false;
          this.offset = res.data.data.last_id;
          console.log(res.data)
          Bus.$emit("allCount",res.data.data.total_count)
          if(res.data.data.results.length===0 || res.data.data.last_id===null ){

            this.finished=true
            return ;
          }
        }
        this.time++;
      } else {
        let res1 = await http({
          url: "comments",
          data: {
            type: "a",
            source: this.artId,
            offset: this.offset,
            limit: 10
          },
          dataType:'text'
        });
        if (res1.statusCode === 200) {
           res1.data= JSONbig.parse(res1.data)
          this.list = [...this.list, ...res1.data.data.results];
          this.loading = false;
          this.offset = res1.data.data.last_id;
        }
        if (this.offset === res1.data.data.end_id||res1.data.data.last_id===null) {
          this.finished = true;
        }
      }
    }
  }
};
</script>

<style lang="less">
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