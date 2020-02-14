<template>
  <div class="login-container">
    <van-nav-bar title="首页" />
    <van-tabs v-model="active" ref="tabs">
      <van-tab :title="item.name" v-for="(item, index) in cannelList" :key="index">
        <van-cell v-for="(info, indexed) in item.list" :key="indexed" @click="toInfoDetail(info)">
          <template slot="default">
            <p class="title">{{info.title}}</p>
            <block v-if="info.cover.type>=1">
              <div class="imageConatiner">
                <image :src="images" v-for="(images, index) in info.cover.images" :key="index" />
              </div>
            </block>
            <p class="other">
              <span>用户名:{{info.aut_name}}</span>
              <span>评论数:{{info.comm_count}}</span>
              <span>时间:{{info.pubdate | formatDate }}</span>
              {{info.art_id}}
            </p>
          </template>
        </van-cell>
      </van-tab>
    </van-tabs>
    <van-icon name="wap-nav" class="my-icon" @click="editChannels" />
    <editChannels
      v-model="show"
      :cannelList="cannelList"
      :allChannel="allChannel"
      :active.sync="active"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { http } from "@/utils/http";
import JSONbig from "json-bigint";
import editChannels from "@/components/editsChannels/index.vue";
import store from "@/store/index";

export default Vue.extend({
  name: "home",
  components: {
    editChannels
  },
  data() {
    return {
      active: 0,
      show: false,
      // formatDate:"",
      cannelList: [
        {
          id: 0,
          list: []
        }
      ],
      allChannel: []
    };
  },

  onLoad() {
    this.cannelsList();
    this.AllChannel();
    this.currentNews();
  },
  watch: {
    active: function(news: number) {
      this.currentNews();
    }
  },
  onReady() {},
  methods: {
    // 获取详细信息
    toInfoDetail(item){
      let id=item.art_id
      uni.navigateTo({
        url:"/pages/infoDetail/index?id="+id
      })
    },
    async AllChannel() {
      // if (store.state.userInfo.token) {
      let res: any = await http({
        url: "channels"
      });
      // console.log(res);
      if (res.statusCode === 200) {
        this.allChannel = res.data.data.channels;
      }
      // }
    },
    editChannels() {
      this.show = true;
    },
    async currentNews() {
      // console.log( this.cannelList)
      let res: any = await http({
        allUrl: "http://ttapi.research.itcast.cn/app/v1_1/articles",
        data: {
          channel_id: this.cannelList[this.active].id,
          timestamp: Date.now(),
          with_top: 0
        },
        dataType:'text'
      });
      if (res.statusCode === 401) {
        uni.navigateTo({
          url: "/pages/login/index"
        });
        return;
      }
      res.data=JSONbig.parse(res.data)
      // console.log(res);
      this.cannelList[this.active].list = [
        ...this.cannelList[this.active].list,
        ...res.data.data.results
      ];

      if (res.data.data.results.length === 0) {
        uni.showToast({
          title: "没有数据了........"
        });
      }
    },

    // 获取用户频道列表
    async cannelsList() {
      if (store.state.userInfo.token) {
        let res: any = await http({
          url: "user/channels"
        });
        if (res.statusCode === 401) {
          uni.navigateTo({
            url: "/pages/login/index"
          });
          return;
        }
        if (res.statusCode === 200) {
          this.cannelList = res.data.data.channels;
          this.setNewAttruted();
        }
      } else {
        this.cannelList =
          uni.getStorageSync("cannelList") === ""
            ? []
            : uni.getStorageSync("cannelList");

        // console.log(this.cannelList)
        if (this.cannelList.length === 0) {
          let res: any = await http({
            url: "user/channels"
          });
          if (res.statusCode === 200) {
            this.cannelList = res.data.data.channels;
            this.setNewAttruted();
            this.currentNews()
          }
        }
      }
    },
    setNewAttruted() {
      this.cannelList.forEach(item => {
        this.$set(item, "list", []);
      });
    }
  },
  async onReachBottom() {
    this.currentNews();
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.cannelList[this.active].list = [];
    this.currentNews();
    setTimeout(function() {
      uni.stopPullDownRefresh();
    }, 1000);
  }
});
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  .title {
    font-size: 21px;
    font-weight: 500;
  }
  .other {
    span {
      margin-left: 5px;
    }
  }
  .imageConatiner {
    display: flex;
    image {
      width: 150px;
      height: 97px;
    }
  }
}
.van-nav-bar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background-color: #3296fa;
  color: #fff;
  .van-ellipsis {
    color: #fff;
  }
}
.van-tabs {
  position: absolute;
  //  bottom: 555px;
  top: 46px;
  left: 0;
  width: 100%;
  .van-tab {
    position: absolute;
    height: 100%;
  }
  .van-tabs__content {
    position: fixed;
    top: 90px;
  }
}
.my-icon {
  position: fixed;
  background-color: #fff;
  top: 50px;
  right: 0;
  font-size: 30px;
}
</style>
