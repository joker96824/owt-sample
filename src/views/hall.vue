<template>
  <addNewRoom v-if="showpop" @submit="addNewRoom"></addNewRoom>
  <Button @click="showpop=true">new room</Button>
  <div class="room-box">
    <div class="room-box-item"
    v-for="(room,index) in room_info"
    :key="index"
  >
    <div @click="joinRoom(room._id)">
      {{room._id}},{{room.name}}
    </div>
    <Button @click="removeRoom(room._id)">Delete</Button>
    
  </div>
  </div>
  
  
  <!-- <testPage v-show="true"/> -->
</template>

<script>
// import testPage from '../../components/testPage.vue'
// import { reactive, toRefs } from "vue";
/* eslint-disable */
import { allRooms,createRoom,deleteRoom } from "../api/rest-sample"
import { useRouter } from 'vue-router'
import { Button } from 'ant-design-vue';
import addNewRoom from './addNewRoom.vue'

export default {
  // eslint-disable-next-line
  name: 'Hall',
  data() {
    return {
      room_info: null,
      route: useRouter(),
      showpop: false,
    }
  },
  components: {
    Button,
    addNewRoom,
  },
  created() {
    allRooms((response)=>{
      this.room_info = JSON.parse(response)
    })
  },
  methods:{
    getAllRoom() {
      allRooms((response)=>{
        this.room_info = JSON.parse(response)
      })
    },
    joinRoom(room_id) {
      this.route.push({
        name: 'owtSample',
        params: {
          room_id: room_id
        }
      })
    },
    async addNewRoom(room){
      console.log(room)
      await new Promise((resolve,reject) => {
        createRoom(room.name,{},(response)=>{
          resolve(response)
          reject(response)
        })
      }).then()
      .catch(err => {console.log(err)})
      this.getAllRoom()
      this.showpop = false
    },

    async removeRoom(room_id) {
      await new Promise((resolve,reject) => {
        deleteRoom(room_id,(response)=>{
          resolve(response)
          reject(response)
        })
      }).then()
      .catch(err => {console.log(err)})

      this.getAllRoom()
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

