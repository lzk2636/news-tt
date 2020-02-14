
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
            <!-- <van-button type="default" size="mini" round @click="toRecomment(item)">回复{{item.reply_count}}</van-button> -->
          </view>
        </view>
        <van-icon name="star">0</van-icon>
        <!-- {{artId}} -->
      </template>
    </van-cell>
    <!-- {{commId}} -->
  </van-list>
</template>


<script>
import { http } from '@/utils/http'
import Bus from "@/utils/bus";
export default {
  props:['commId'],
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      time:1,
      offset:0,
    }
  },
 watch:{
   commId:function(){
    //  this.time=1;
     this.onLoads()
    //  console.log(this.list.length)
   }
 },
  methods:{
    //获取评论列表
    async onLoads(){
    
    if(this.time===1){
      // 因为第一次不用传source
      let res = await http({
        url:'comments',
        data:{
          type:'c',
          source:this.commId.toString(),
          limit:12
        }
      })
      // console.log(res)
      if(res.statusCode===200){
        this.list=res.data.data.results
        this.loading=false
        this.offset=res.data.data.last_id
        if(res.data.data.last_id===null || res.data.data.end_id===res.data.data.last_id){
          this.finished=true
          return false
        }
      }
      this.time++;
    }else{
      let res2= await http({
        url:"comments",
        data:{
          type:'c',
          source:this.commId.toString(),
          limit:12,
          offset:this.offset
        }
      })
      if(res2.statusCode===200){
       
        this.list=[...this.list,...res2.data.data.results]
        this.loading=false
        this.offset=res2.data.data.last_id
        if(res2.data.data.last_id===null || res2.data.data.end_id===res2.data.data.last_id){
          this.finished=true
          this.time=1;
        }
      
      }
    }

    }
  },
  created(){
    Bus.$on('recommentOne',res=>{
      this.list.unshift(res)
      this.$emit("recommentCount",this.list.length)
      //  Bus.$emit("recommentCount",this.list.length)
    })
  }

}
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