<template>
  <div class="room-box">
    <div class="room-box-item"
    v-for="(room,index) in room_info"
    :key="index"
    @click="joinRoom(room._id)"
  >{{room._id}},{{room.name}}</div>
  </div>
  
  <!-- <testPage v-show="true"/> -->
</template>

<script>
// import testPage from '../../components/testPage.vue'
import { allRooms } from "../api/rest-sample"
import { useRouter } from 'vue-router'

export default {
  // eslint-disable-next-line
  name: 'Hall',
  data() {
    return {
      room_info: null,
      route: useRouter()
    }
  },
  components: {
    // testPage,
  },
  created() {
    allRooms((response)=>{
      this.room_info = JSON.parse(response)
    })
  },
  methods:{
    joinRoom(room_id) {
      this.route.push({
        name: 'owtSample',
        params: {
          room_id: room_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.room-box {
  width: 800px;
  height: 600px;
  display: grid;
  position: relative;
  .room-box-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    cursor: pointer;
    position:relative;
  }
}
</style>
