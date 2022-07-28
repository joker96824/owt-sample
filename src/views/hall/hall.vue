<template>
  <div 
    v-for="(room,index) in room_info"
    :key="index"
  >{{room._id}},{{room.name}}</div>
  <!-- <testPage v-show="true"/> -->
</template>

<script>
// import testPage from '../../components/testPage.vue'
import { allRooms } from "../../api/rest-sample"

export default {
  // eslint-disable-next-line
  name: 'Hall',
  data() {
    return {
      room_info: null,
    }
  },
  components: {
    // testPage,
  },
  created() {
    allRooms((response)=>{
      this.room_info = JSON.parse(response)
    })
  }
}
</script>

<style>
.room-box {
  width:1000px;
}
</style>
