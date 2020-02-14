<template>
  <div class="question-contianer">
    <view class="weui-search-bar">
      <view class="weui-search-bar__form">
        <view class="weui-search-bar__box">
          <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
          <input
            type="text"
            class="weui-search-bar__input"
            v-model="inputVal"
            placeholder="搜索"
            :focus="inputShowed"
            @input="searchInput"
            @confirm="search"
          />
          <view class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
            <icon type="clear" size="14"></icon>
          </view>
        </view>
        <label class="weui-search-bar__label" v-show="!inputShowed" @click="showInput">
          <icon class="weui-icon-search" type="search" size="14"></icon>
          <view class="weui-search-bar__text">搜索</view>
        </label>
      </view>
      <view class="weui-search-bar__cancel-btn" v-show="inputShowed" @click="hideInput">取消</view>
    </view>
    <view class="weui-cells searchbar-result" v-if="inputVal.length > 0">
      <view
        class="weui-cell__bd"
        v-for="(item, index) in options"
        :key="index"
        @click="toSearch(index)"
      >
        <view v-html="item"></view>
      </view>
    </view>

    <view class="historyQuestion" v-if="history.length!==0">
      <view class="historyName">
      <text>历史查询</text>
      <van-icon name="delete" class="delete" @click="clearHistory"/>
      </view>
      <view class="context">
        <view class="item" v-for="(item, index) in history" :key="index" @click="searchContent(item)">
          <text>{{item}}</text>
        </view>
      </view>
    </view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { http } from "@/utils/http";
export default Vue.extend({
  data() {
    const options:any[]=[]
    const newData:any[]=[]
    const historyList:any[]=[]
    return {
      inputShowed: false,
      inputVal: "",
      options: options,
      newData: newData,
      timeId: 0,
      historyList: historyList,
      history: []
    };
  },
  onShow() {
    let history = uni.getStorageSync("searchHistory");
    this.history = history;
  },
  onLoad() {},
  methods: {
    clearHistory(){
      uni.removeStorageSync("searchHistory")
      this.history=[]
    },
    toSearch(i: number) {
      // console.log(this.newData[i])
      this.$store.commit("keywords", this.newData[i]);
      this.historyList.unshift(this.newData[i]);
      uni.setStorageSync("searchHistory", this.historyList);
      uni.switchTab({
        url: "/pages/video/index"
      });
      this.inputShowed = false;
      this.inputVal = "";
    },
    searchContent(item:String) {
      // console.log(this.newData[i])
      this.$store.commit("keywords", item);
      uni.switchTab({
        url: "/pages/video/index"
      });
    },
    searchInput() {
      clearInterval(this.timeId);
      this.timeId = setInterval(async () => {
        clearInterval(this.timeId);
        let res: any = await http({
          url: "suggestion",
          data: {
            q: this.inputVal
          }
        });
        // console.log(res)
        this.newData = res.data.data.options;

        this.options = this.newData.map(item => {
          return item.split(this.inputVal)
            .join(`<span style='color:red'>${this.inputVal}</span>`);
        });
      }, 1000);
    },
    search() {},
    showInput: function() {
      this.inputShowed = true;
    },
    hideInput: function() {
      this.inputShowed = false;
      this.inputVal = "";
    },
    clearInput: function() {
      this.inputVal = "";
    }
  }
});
</script>

<style lang="less">
.question-contianer {
  // padding: 5px;
}
.historyQuestion {
  // padding-left: 5px;

  background-color: #fff;
  .historyName {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    font-weight: 400;
    border-bottom: 1px solid #ccc;
    padding-left: 5px;
    .delete{
      line-height: 50px;
    }
  }
  .context {
    // padding-left: 5px;
    display: flex;
    // justify-content: space-evenly;
    flex-wrap: wrap;
    .item {
      font-size: 16px;
      line-height: 30px;
      height: 30px;
      text-align: center;
      border: 1px solid #ccc;
      // border-right: 0px;
      width: 24%;
      overflow: hidden;
      margin-left: 1px;
    }
  }
}

/*!
 * WeUI v2.0.1 (https://github.com/weui/weui-wxss)
 * Copyright 2019 Tencent, Inc.
 * Licensed under the MIT license
 */
.weui-search-bar {
  position: relative;
  padding: 8px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  background-color: #3296fa;
  -webkit-text-size-adjust: 100%;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.weui-icon-search {
  margin-right: 8px;
  font-size: 14px;
  vertical-align: top;
  margin-top: 0.64em;
  height: 1em;
  line-height: 1em;
}
.weui-icon-search_in-box {
  position: absolute;
  left: 12px;
  top: 50%;
  margin-top: -8px;
}
.weui-search-bar__text {
  display: inline-block;
  font-size: 14px;
  vertical-align: top;
}
.weui-search-bar__form {
  position: relative;
  -webkit-box-flex: 1;
  -webkit-flex: auto;
  flex: auto;
  border-radius: 4px;
  background: #fff;
}
.weui-search-bar__box {
  position: relative;
  padding-left: 32px;
  padding-right: 32px;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
}
.weui-search-bar__input {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  caret-color: #07c160;
}
.weui-icon-clear {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 0 12px;
  font-size: 0;
}
.weui-icon-clear:after {
  content: "";
  height: 100%;
  vertical-align: middle;
  display: inline-block;
  width: 0;
  overflow: hidden;
}
.weui-search-bar__label {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  border-radius: 4px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  background: #fff;
  line-height: 32px;
}
.weui-search-bar__cancel-btn {
  margin-left: 8px;
  line-height: 32px;
  color: #fff;
  white-space: nowrap;
}
.weui-cell__bd {
  background-color: #fff;
  border: 1px solid #ccc;
}
</style>
