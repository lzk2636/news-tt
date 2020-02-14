<template>
  <div>
    <div class="sendMsg">
      <van-list finished-text="没有更多了" ref="list">
        <div class="messge" v-for="(item, index) in list" :key="index" :class="{my:item.isUser}">
          <div class="imgIcon">
            <img
              src="https://developer.mozilla.org/static/img/embed/promos/devedition-logo.63846dba2e2f.png"
            />
          </div>
          <div class="message-info">{{item.msg}}</div>
        </div>
      </van-list>
    </div>

    <van-search background="#ddd" v-model="value" show-action @search="message">
      <template slot="left-icon">
        <van-icon name="edit" />
      </template>
      <template slot="action">
        <div @click="message">确认</div>
      </template>
    </van-search>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import io from "socket.io-client";

export default Vue.extend({
  data() {
    return {
      value: "",
      list: [{ msg: "我是小同学呵呵", isUser: false }],
      socket:null,
      count:0
    };
  },
  methods: {
    message() {
      const socket = io("http://ttapi.research.itcast.cn");
      this.list.push({ msg: this.value, isUser: true });
      // 发送参数
      socket.emit('message',{msg:this.value,timestamp:Date.now()});
      socket.on('message',res=>{
        // console.log(res)
        this.list.push({msg:res.msg,isUser:false})
      })
      // this.count++
    }
    

  }
});
</script>

<style lang='less'>
div {
  .van-list {
    margin: 46px 0 54px;
    height: 100%;
    width: 100%;
  }
  .van-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #3296fa;
    .van-icon {
      color: #fff;
    }
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .van-search {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .sendMsg {
    height: 100%;
    width: 100%;

    .messge {
      display: flex;
      align-items: center;
      padding: 10px;
      .imgIcon {
        img {
          width: 46px;
          height: 46px;
          border-radius: 50%;
        }
      }
      .message-info {
        margin-left: 5px;
        font-size: 16px;
        // height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 10px;
        padding: 0 6px;
        // padding: 6px;
        background: #3296fa;
      }
    }
    .my {
      flex-direction: row-reverse;
      img {
        margin-left: 5px;
      }
    }
  }
}
</style>