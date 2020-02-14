<template>
  <van-tabs v-model="active">
    <van-tab :title="item.title" v-for="(item, indexs) in itemList" :key="indexs">
      <van-list
        v-model="item.loading"
        :finished="item.finished"
        finished-text="没有更多了"
        @load="onLoads"
      >
        <van-cell v-for="(itemson,index) in item.list" :key="index" @click="toDetail(itemson.art_id)">
          <template slot="default">
            <view class="title">{{itemson.title}}</view>
            <view class="grid">
              <block v-for="(imagesSrc, imageIndex) in itemson.cover.images" :key="imageIndex">
                <image :src="imagesSrc"></image>
              </block>
            </view>
            <view class="info">
              <text class="msg">{{itemson.aut_name}}</text>
              <text class="msg">{{itemson.comm_count}}评论</text>
              <text class="msg">{{itemson.pubdate | formatDate}}}</text>
            </view>
            <view class="image-box">
              <view class="item">
                <text class="image-title">{{itemson.comm_count}}</text>
                <van-icon name="comment-o" />
              </view>
              <view class="item">
                <text class="image-title">{{itemson.like_count}}</text>
                <van-icon name="good-job-o" />
              </view>
              <view class="item">
                <text class="image-title">分享</text>
                <van-icon name="friends-o" />
              </view>
            </view>
          </template>
        </van-cell>
      </van-list>
    </van-tab>
  </van-tabs>
</template>

<script>
import { http } from "../../utils/http";
import JSONbig from "json-bigint";
export default {
  name: "collect",
  data() {
    return {
      page: 1,
      active: 0,
      itemList: [
        {
          title: "收藏",
          loading: false,
          finished: false,
          list: [],
          page: 1
        },
        {
          title: "历史",
          loading: false,
          finished: false,
          list: [],
          page: 1
        }
      ]
    };
  },
  methods: {
    toDetail(id){
      uni.navigateTo({
        url:"/pages/infoDetail/index?id="+id
      })

    },
    async onLoads() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (this.active === 0) {
        // this.page = 1;
        let res = await http({
          url: "article/collections",
          dataType: "text",
          data: {
            page: this.itemList[this.active].page
          }
        });
        res.data = JSONbig.parse(res.data);
        if (res.statusCode === 200) {
          this.itemList[this.active].list = [
            ...this.itemList[this.active].list,
            ...res.data.data.results
          ];
        }
        this.itemList[this.active].page++;
        this.itemList[this.active].loading = false;
        if (res.data.data.results.length === 0) {
          this.itemList[this.active].finished = true;
        }
        // console.log(res);
      } else {
        // this.page = 1;
        let res = await http({
          url: "user/histories",
          dataType: "text",
          data: {
            page: this.itemList[this.active].page
          }
        });
        res.data = JSONbig.parse(res.data);
        if (res.statusCode === 200) {
          this.itemList[this.active].list = [
            ...this.itemList[this.active].list,
            ...res.data.data.results
          ];
        }
        this.itemList[this.active].page++;
        this.itemList[this.active].loading = false;
        if (res.data.data.results.length === 0) {
          this.itemList[this.active].finished = true;
        }
      }

      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.itemList[this.active].list.push(
      //       this.itemList[this.active].list.length + 1
      //     );
      //   }

      //   // 加载状态结束
      //   this.itemList[this.active].loading = false;

      //   // 数据全部加载完成
      //   if (this.itemList[this.active].list.length >= 40) {
      //     this.itemList[this.active].finished = true;
      //   }
      // }, 1000);
    }
  }
};
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