<template>
  <view class="info-contianer">
    <van-nav-bar left-arrow @click-left="onClickLeft" />
    <view class="title">{{infoDetails.title}}</view>
    <view class="userInfo">
      <image :src="infoDetails.aut_photo" />
      <view class="user-phone">
        <view class="phone">{{infoDetails.aut_name}}</view>
        <view class="time">{{infoDetails.pubdate | formatDate}}</view>
      </view>
      <van-button
        type="info"
        icon="plus"
        v-if="!infoDetails.is_followed"
        @click="followUser(infoDetails.aut_id)"
      >关注</van-button>
      <van-button type="info" v-else @click="unfollowUser(infoDetails.aut_id)">已关注</van-button>
    </view>
    <view class="content" v-html="infoDetails.content"></view>
    <view class="likings">
      <van-button
        :class="{red:infoDetails.attitude===1}"
        plain
        round
        hairline
        type="default"
        size="small"
        icon="like"
        @click="linking(infoDetails.art_id)"
      >点赞</van-button>
      <van-button
        plain
        round
        hairline
        type="default"
        size="small"
        icon="delete"
        :class="{red:infoDetails.attitude===0}"
        @click="unlikings(infoDetails.art_id)"
      >不喜欢</van-button>
    </view>
    <view class="commentList">
      <comment-list :artId="artId"  @openReComment="openComment"></comment-list>
    </view>
    <!-- <view class="inputValue">
        <input placeholder="写评论"/>
        <van-icon name="chat-o" info="99+" />
        <van-icon name="star-o" />
    </view> -->
    <input-comment :artId="artId" @commentOne="addComment" :collects.sync="infoDetails.is_collected"></input-comment>
    <recomment v-model="show" :artId="artId"></recomment>
  </view>
</template>

<script>
import { http } from "@/utils/http";
import JSONbig from "json-bigint";
export default {
  components: {
    commentList: () => import("@/components/commentComponents"),
    inputComment:()=>import('@/components/inputComment'),
    recomment:()=>import('@/components/recommentComponents')
  },
  data() {
    return {
      show:false,
      infoDetails: {},
      // value:""
      commentObj:{}
    };
  },
  methods: {
    openComment(item){
      console.log(item)
      this.show=item
    },
    // 添加评论
    addComment(data){
      // console.log(data)
      this.commentObj=data
    },
    // 文章喜欢
    async unlikings(id) {
      if (this.infoDetails.attitude === -1 || this.infoDetails.attitude === 1) {
        let res = await http({
          url: "article/dislikes",
          data: {
            target: id.toString()
          },
          method: "POST"
        });
        // console.log(res)
        if (res.statusCode === 201) {
          this.infoDetails.attitude = 0;
        }
      } else if (this.infoDetails.attitude === 0) {
        let res = await http({
          url: "article/dislikes/" + id.toString(),

          method: "DELETE"
        });
        // console.log(res)
        if (res.statusCode === 204) {
          this.infoDetails.attitude = -1;
        }
      }
    },
    // 文章点赞
    async linking(id) {
      if (this.$login()) return;
      if (this.infoDetails.attitude === -1 || this.infoDetails.attitude === 0) {
        let res = await http({
          url: "article/likings",
          data: {
            target: id.toString()
          },
          method: "POST"
        });
        // console.log(res)
        if (res.statusCode === 201) {
          this.infoDetails.attitude = 1;
        }
      } else if (this.infoDetails.attitude === 1) {
        let res = await http({
          url: "article/likings/" + id.toString(),

          method: "DELETE"
        });
        // console.log(res)
        if (res.statusCode === 204) {
          this.infoDetails.attitude = -1;
        }
      }

      // console.log(res);
    },
    // 取消用户
    async unfollowUser(id) {
      if (this.$login()) return;
      let res = await http({
        url: "user/followings/" + id.toString(),
        method: "DELETE"
      });
      if (res.statusCode === 204) {
        this.infoDetails.is_followed = false;
      }
    },
    //关注用户
    async followUser(id) {
      // console.log(id)

      if (this.$login()) return;
      let res = await http({
        url: "user/followings",
        method: "POST",
        data: {
          target: id.toString()
        }
      });
      if (res.statusCode === 201) {
        this.infoDetails.is_followed = true;
      }
      console.log(res);
    },

    onClickLeft() {
      // 在C页面内 navigateBack，将返回A页面
      uni.navigateBack();
    }
  },
  async onLoad(options) {
    // console.log(options);
    this.artId = options.id;
    let res = await http({
      url: "articles/" + options.id,
      dataType: "text"
    });
    res.data = JSONbig.parse(res.data);
    // console.log(res);
    this.infoDetails = res.data.data;
  }
};
</script>

<style lang="less" scoped>
.red {
  border-color: #f00;
  color: red;
}
page {
  background-color: #fff;
}
.info-contianer {
  background-color: #fff;
  .van-nav-bar {
    background-color: #3194ff;

    .van-icon-arrow-left:before {
      color: #fff;
    }
  }
  .title {
    padding: 15px;
    font-size: 27px;
    background-color: #fff;
  }
  .userInfo {
    background-color: #fff;
    display: flex;
    padding: 5px;
    image {
      width: 47px;
      height: 47px;
      border-radius: 50%;
    }
    .user-phone {
      margin-left: 5px;
      flex: 1;
    }
  }
  .content {
    background-color: #fff;
    padding: 5px;
  }
  .likings {
    padding: 10px;
    display: flex;
    justify-content: space-evenly;
  }
  // .inputValue {
  //   border-top: 1px solid #ccc;
  //   position: fixed;
  //   bottom: 0;
  //   left: 0;
  //   // height: 50px;
  //   padding:10px 0;
  //   width: 100%;
  //   display: flex;
  //   justify-content: space-evenly;
  //   align-content: center;
  //   // line-height: 50px;
  //   input{
  //    border:1px solid #ccc;
  //    border-radius: 15px;
  //    text-indent: 1rem;
  //   }
  //   .van-icon {
  //     padding-top: 5px;
  //   }
  // }
}
</style>