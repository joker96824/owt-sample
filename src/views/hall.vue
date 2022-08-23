<template>
  <Button @click="addNewRoom()">new room</Button>
  <Button @click="deleteRoom('62feff0ef05f6c30b01cf302')">Delete</Button>
  <div class="room-box">
    <div class="room-box-item"
    v-for="(room,index) in room_info"
    :key="index"
    @click="joinRoom(room._id)"
  >
    {{room._id}},{{room.name}}
    
  </div>
  </div>
  
  <!-- <testPage v-show="true"/> -->
</template>

<script>
// import testPage from '../../components/testPage.vue'
import { allRooms,createRoom,deleteRoom } from "../api/rest-sample"
import { useRouter } from 'vue-router'
import { Button } from 'ant-design-vue';

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
    Button,
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
    },
    addNewRoom(){
      createRoom('test',{},(response)=>{
        console.log(response)
      })
    },
    deleteRoom(room_id) {
      deleteRoom(room_id,(response)=>{
        console.log(response)
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
