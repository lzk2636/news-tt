<template>
  <view class="userContiner">
    <van-nav-bar left-arrow @click-left="onClickLeft" right-text="保存" @click-right="toSave" />
    <van-cell-group>
      <van-cell title="头像" value="内容" @click="upload()" is-link>
        <template slot="default">
          <image :src="users.photo" />
        </template>
      </van-cell>
      <van-cell title="呢称" :value="users.name" is-link @click="userShow=true"></van-cell>
      <van-cell title="介绍" :value="users.intro" is-link  @click="userShow=true"></van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="性别" :value="users.gender==0?'男':'女'" is-link  @click="userShow=true"/>
      <van-cell title="生日" :value="users.birthday" is-link @click="userShow=true" />
    </van-cell-group>

    <van-dialog
      v-model="shows"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
      :closeOnPopstate="true"
    >
      <van-cell-group>
        <van-cell title="从相册选择">
          <template slot="title">
            <van-uploader :after-read="afterRead">
              <van-button>从相册选择</van-button>
            </van-uploader>
          </template>
        </van-cell>

        <van-cell title="拍照" @click="createcamera"></van-cell>
        <van-cell title="取消" @click="canclelImage"></van-cell>
      </van-cell-group>
    </van-dialog>
    <editUserInfo v-model="userShow" :users="users"/>
  </view>
</template>

<script>
import { http } from "@/utils/http";
import axios from "axios";

import JSONbig from 'json-bigint'
export default {

  name: "po",
  components:{
    editUserInfo:()=>import('@/components/userEditComponts')
  },
  data() {
    return {
      shows: false,
      userShow:false,
      token: this.$store.state.userInfo.token,
      users: {},
      cameraContext :uni.createCameraContext()
    };
  },
  async onShow() {
    let res = await http({
      url: "user/profile",
      dataType:'text'
    });
    // console.log(res);
    res.data=JSONbig.parse(res.data)
    if (res.statusCode === 200) {
      this.users = res.data.data;
    }
    // 获取指定用户信息
    let userInfo = await http({
      url:"users/"+res.data.data.id
    })
    if(res.statusCode===200){
      this.users.intro=userInfo.data.data.intro
    }
    console.log(this.users)

  },
  methods: {
    async toSave(){
      let res = await axios({
        url:"http://ttapi.research.itcast.cn/app/v1_0/user/profile",
        method:"PATCH",
        headers:{'Authorization':`Bearer ${this.token}`},
        data:{
          name:this.users.name,
          gender:Number(this.users.gender),
          birthday:this.users.birthday,
          intro:this.users.intro
        }
      })
      // console.log(res)
      // if(res.status===201){
        
      //   this.users={...res.data.data}
      // }
    },
    createcamera(){
      // const camera=uni.createCameraContext()
      //  console.log(uni.createCameraContext())
      this.camera.takePhoto({
        quality:"high",
        success:(res)=>{
          console.log(res)
        }
      })
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(URL.createObjectURL(file.file));
      var formdata = new FormData();

      formdata.append("photo", file.file);
      uni.previewImage({
        urls: [URL.createObjectURL(file.file)],
        success: () => {
          this.shows = false;
          this.$dialog
            .confirm({
              // title: '标题',
              message: "是不是设置该图片为图像"
            })
            .then(async () => {
              console.log(66988);
              let res = await axios({
                url: "http://ttapi.research.itcast.cn/app/v1_0/user/photo",
                method: "patch",
                headers: { Authorization: `Bearer ${this.token}` },
                data: formdata
              });
              if (res.status === 201) {
                console.log(this);
                this.shows = false;
              }
              // this.shows=false
            });
        }
      });

      // this.shows = false;
    },
    onClickLeft() {
      uni.navigateBack();
    },
    upload() {
      this.shows = true;
    },
    canclelImage() {
      this.shows = false;
    }
  }
};
</script>

<style lang="less">
.userContiner {
  .van-nav-bar {
    background-color: #3194ff;
    .van-icon-arrow-left:before {
      color: #fff;
    }
    .van-nav-bar__right {
      .van-nav-bar__text {
        color: #fff;
        &:active {
          background-color: #3194ff;
          color: #ccc;
        }
      }
    }
  }
  .van-cell-group {
    margin-bottom: 10px;
    .van-cell {
      image {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
  }
  .van-dialog {
    .van-cell {
      text-align: center;
    }
  }
}
</style>