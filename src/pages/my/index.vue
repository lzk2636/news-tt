<template>
  <view class="userContianer">
    <view class="userInfo">
      <view class="username">
        <image :src="users.photo" @click="editUSer" />
        <view class="name">{{users.name}}</view>
        <view class="times">今天阅读0分钟</view>
      </view>
      <view class="UNusername" v-if="!users.id">
        <image src="http://toutiao.meiduo.site/Fkj6tQi3xJwVXi1u2swCElotfdCi" @click="toLogin" />
        <!-- <view class="name">1555255455545548</view>
        <view class="times">今天阅读0分钟</view>-->
      </view>
      <view class="other_info">
        <view class="info-item">
          <view class="count">{{userCount.follow_count}}</view>
          <view class="title">关注</view>
        </view>
        <view class="info-item">
          <view class="count">{{userCount.art_count}}</view>
          <view class="title">发布</view>
        </view>
        <view class="info-item">
          <view class="count">{{userCount.like_count}}</view>
          <view class="title">点赞</view>
        </view>
      </view>
    </view>
    <van-grid>
     
        <van-grid-item icon="star-o" text="收藏" @click="coOrhi"/>
      <van-grid-item icon="clock" text="历史" @click="coOrhi" />
      <van-grid-item icon="edit" text="作品" />
      <!-- <van-grid-item icon="photo-o" text="文字" /> -->
    </van-grid>
    <van-cell-group>
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <van-cell title="小智同学" is-link @click="contact"/>
    </van-cell-group>
  </view>
</template>

<script lang="ts">
import { http } from "@/utils/http";
import JSONbig from "json-bigint";
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      title: "Hello",
      users: {},
      userCount: {}
    };
  },
  async onLoad() {
    let res: any = await http({
      url: "user/profile",
      dataType: "text"
    });
    if (res.statusCode === 200) {
      res.data = JSONbig.parse(res.data);
      this.users = res.data.data;
    }
    let userInfo: any = await http({
      url: "user"
    });
    if (userInfo.statusCode === 200) {
      this.userCount = userInfo.data.data;
    }
  },
  methods: {
    coOrhi(){
      uni.navigateTo({
        url:"/pages/collect/index"
      })
    },
    toLogin() {
      uni.navigateTo({
        url: "/pages/login/index"
      });
    },
    editUSer() {
      uni.navigateTo({
        url: "/pages/editUser/index"
      });
    },
    contact(){
      uni.navigateTo({
        url:"/pages/contact/index"
      })
    }
  }
});
</script>

<style lang="less" scoped>
.userContianer {
  .userInfo {
    background-color: #3e9df8;
    .UNusername {
      text-align: center;
      image {
        width: 55px;
        height: 55px;
        border-radius: 50%;
      }
    }
    .username {
      padding: 20px 0;
      display: flex;
      margin-left: 30px;
      // text-align: center;
      image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .name {
        flex: 1;
        color: #fff;
        text-indent: 1rem;
      }
      .times {
        background: #2b6ead;
        width: 57px;
        height: 42px;
        font-size: 14px;
        color: #fff;
        padding: 0 5px;
        text-align: center;
        border-bottom-left-radius: 11px;
        border-top-left-radius: 11px;
      }
    }
    .other_info {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      margin-left: 15px;
      .info-item {
        font-size: 16px;
        text-align: center;
        color: #fff;
        width: 100px;
      }
    }
  }
  .van-grid {
    background-color: #fff;
    display: flex;
    justify-content: space-evenly;
  }
}
</style>
