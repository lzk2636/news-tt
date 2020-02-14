<template>
  <view class="inputValue">
    <input placeholder="写评论" v-model="inputvalue" @confirm="enterValue" />
    <van-icon name="chat-o" :info="allCount" v-if="!value" />
    <van-icon name="star-o" @click="collect" :class="{red:collects===true}" v-if="!value" />
  </view>
</template>

<script>
import { http } from "@/utils/http";
import JSONbig from "json-bigint";
import Bus from "@/utils/bus";
export default {
  props: ["commId", "artId", "value", "collects"],
  data() {
    return {
      inputvalue: "",
      allCount: 0
    };
  },
  methods: {
    async enterValue() {
      // if(this.$login()) return
      // console.log(this.commId);
      if (this.commId === undefined) {
        let res = await http({
          url: "comments",
          method: "POST",
          dataType: "text",
          data: {
            target: this.artId,
            content: this.inputvalue
          }
        });
        if (res.statusCode === 201) {
          res.data = JSONbig.parse(res.data);
          Bus.$emit("commentOne", res.data.data.new_obj);
          this.inputvalue = "";
        }
      } else {
        let res = await http({
          url: "comments",
          method: "POST",
          dataType: "text",
          data: {
            art_id: this.artId,
            target: this.commId,
            content: this.inputvalue
          }
        });
        if (res.statusCode === 201) {
          res.data = JSONbig.parse(res.data);
          Bus.$emit("recommentOne", res.data.data.new_obj);
          this.inputvalue = "";
        }
      }

      // console.log(res)
    },
    // 收藏文章
    async collect() {
      if (this.collects === false) {
        let res = await http({
          url: "article/collections",
          method: "POST",
          data: {
            target: this.artId
          }
        });
        if (res.statusCode === 201) {
          // console.log(res);
          // this.is_collect=true
          this.$emit("update:collects", true);
        }
      }else{
        // 取消收藏
        let res = await http({
          url:"article/collections/"+this.artId,
          method:"DELETE"
        })
        if(res.statusCode===204){
          this.$emit('update:collects',false)
        }
      }
    }
  },
  created() {
    Bus.$on("allCount", res => {
      this.allCount = res;
    });
    // Bus.$on("recommentCount", res => {
    //   this.allCount = res;
    // });
  }
};
</script>

<style lang="less">
.red {
  color: red;
}
.inputValue {
  background-color: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  left: 0;
  // height: 50px;
  padding: 10px 0;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  // line-height: 50px;
  input {
    border: 1px solid #ccc;
    border-radius: 15px;
    text-indent: 1rem;
  }
  .van-icon {
    padding-top: 5px;
  }
}
</style>