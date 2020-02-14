<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event.target)"
    position="bottom"
    :style="{ height: '80%' }"
  >
    <van-cell-group>
      <van-field v-model="users.name"  label="呢称" maxlength="7"/>
     
      <van-field
        v-model="users.intro"
        rows="5"
        autosize
        label="简介"
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
      />
      <van-radio-group v-model="users.gender">
        <van-radio name="0" checked-color="#07c160">男</van-radio>
        <van-radio name="1" checked-color="#07c160">女</van-radio>
      </van-radio-group>
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmDate"
      />
    </van-cell-group>
  </van-popup>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "userEdit",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    users: {
      type: Object,
      default: {}
    }
  },
  created() {
    console.log(dayjs(new Date()).format("YYYY-MM-DD"));
  },
  methods: {
    confirmDate() {
      this.users.birthday = dayjs(this.currentDate).format("YYYY-MM-DD");
    }
  },
  data() {
    return {
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    };
  }
};
</script>

<style lang="less">
.van-radio-group {
  padding: 10px 0;
  display: flex;
  justify-content: space-evenly;
}
</style>