<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    position="left"
    :style="{ height: '100%', width: '80%' }"
  >
    <van-cell title="我的频道">
      <template slot="default">
        <van-button
          type="danger"
          hairline
          round
          plain
          size="small"
          v-if="isShowDelete"
          @click="isShowDelete=false"
        >编辑</van-button>
        <van-button
          type="danger"
          hairline
          round
          plain
          size="small"
          v-else
          @click="isShowDelete=true"
        >完成</van-button>
      </template>
    </van-cell>
    <van-grid>
      <van-grid-item v-for="(item, index) in cannelList" :key="index" @click="$emit('update:active',index)">
        <template slot="default">
          <span class="small" :class="{active:active==index}">{{item.name}}</span>
        </template>
        <van-icon name="clear" class="red" v-if="isShowDelete&& index>0" @click="remove(item)" />
      </van-grid-item>
    </van-grid>
    <van-cell title="推荐频道"></van-cell>
    <van-grid>
      <van-grid-item
        v-for="(item, index) in otherChannelList"
        :key="index"
        @click="addChannel(item)"
      >
        <template slot="default">
          <span class="small">{{item.name}}</span>
        </template>
      </van-grid-item>
    </van-grid>
  {{active}}
  </van-popup>
</template>
<script lang="ts">
import Vue from "vue";
import { http } from "@/utils/http";
import store from "@/store/index";
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: true
    },
    cannelList: {
      type: Array,
      default: []
    },
    allChannel: {
      type: Array,
      default: []
    },
    active:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      // allChannel: [],
      isShowDelete: false
    };
  },
  onLoad() {},

  methods: {
    // 移除频道数据
    async remove(item: any) {
      let id = this.cannelList.findIndex(el => {
        return el.id == item.id;
      });
      // console.log(id);
      this.cannelList.splice(id, 1);
      if (store.state.userInfo.token) {
        if (this.cannelList.length === 1) {
          await http({
            url: "user/channels",
            method: "PUT",
            data: {
              channels: [{
                id:item.id,
                seq:item.id
              }]
            }
          });
          return
        }
        await http({
          url: "user/channels",
          method: "PUT",
          data: {
            channels: this.cannelList.slice(1).map((el, index) => {
              // if (index > 0) {
              return {
                id: el.id,
                seq: el.id
              };
              // }
            })
          }
        });
        // console.log(res);
      } else {
        uni.setStorageSync("cannelList", this.cannelList);
      }
    },
    // 添加频道数据
    async addChannel(item: any) {
      // console.log(store.state.userInfo.token)
      if (store.state.userInfo.token) {
        this.cannelList.push(item);
        let res = await http({
          url: "/user/channels",
          method: "PUT",
          data: {
            channels: this.cannelList.slice(1).map((el, index) => {
              // if (index > 0) {
              return {
                id: el.id,
                seq: el.id
              };
              // }
            })
          }
        });
        console.log(res);
      } else {
        this.cannelList.push({ id: item.id, name: item.name, list: [] });
        uni.setStorageSync("cannelList", this.cannelList);
      }
    },
    // async AllChannel() {
    //   let res: any = await http({
    //     url: "channels"
    //   });
    //   console.log(res);
    //   if (res.statusCode === 200) {
    //     this.allChannel = res.data.data.channels;
    //   }
    // }
  },
  computed: {
    otherChannelList: function() {
      let list = this.cannelList.map((el: any) => {
        return el.name;
      });
      // console.log(list)
      return this.allChannel.filter((item: any) => {
        return list.includes(item.name) === false;
      });
    }
  }
});
</script>

<style lang='less'>
.active{
  color:red !important;
}
.red {
  position: absolute;
  top: 0px;
  right: 0px;
  color: #f00;
  // display: none;
}
.small {
  font-size: 12px;
  color: #615f5f;
}
</style>