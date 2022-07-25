<template>
  <div>
    <div style="width:320px;height:240" class="local">
        <video playsinline muted autoplay style="width:320px;height:240" :srcObject="localStream"></video>
    </div>
    <button @click="swapGrid">更换布局</button>
    <div class="grid-box" :class="[gridMode]">

      <div class="grid-box-item"
        v-for="(item, index) in limitVideo()"
        :key="index">
        <video  
          class="grid-box-video"
          :srcObject="item.mediaStream"
          :id="item.id"
          @click="clickVideo(index)"
          autoplay="autoplay"
          ></video>
      </div>

      <template v-if="gridMode == 'grid-header-other' && gridList.length > 5 && pointer > 1">
        <button class="left-button-bottom" @click="movePointer(-4)">←</button>
      </template>

      <template v-if="gridMode == 'grid-header-other' && gridList.length > 5 && pointer < gridList.length - 4">
        <button class="right-button-bottom" @click="movePointer(4)">→</button>
      </template>

      <template v-if="gridMode == 'grid-four-four' && gridList.length > 16 && pointer > 1">
        <button class="left-button-middle" @click="movePointer(-1)">←</button>
      </template>

      <template v-if="gridMode == 'grid-four-four' && gridList.length > 16 && pointer < gridList.length - 16">
        <button class="right-button-middle" @click="movePointer(1)  ">→</button>
      </template>
    </div>
  </div>
</template>

<script>
// import VueGridLayout from 'vue-grid-layout';
import { reactive, toRefs } from "vue";
// import axios from 'axios'
import { Conference, Base } from '../sdk/export'
import { createToken, mixStream } from "./rest-sample"

export default {
  name: 'owtSample',
  props: {
    msg: String
  },
  setup(){
    const state = reactive({
      gridList: [],
      gridMode: "grid-twoheaders-other",
      pointer: 1,
      axios_message: '',
      localStream: null,
      conference: null,
    });

    state.conference = new Conference.ConferenceClient()

    createToken('', 'user', 'presenter',(response)=>{
      state.conference.join(response).then(resp => {
          let myRoom = resp.id;
          console.log("join result:",resp)
          // audioConstraintsForMic
          let audioConstraints = new Base.AudioTrackConstraints(Base.AudioSourceInfo.MIC);
          // videoConstraintsForCamera
          let videoConstraints = new Base.VideoTrackConstraints(Base.VideoSourceInfo.CAMERA);

          let mediaStream;
          Base.MediaStreamFactory.createMediaStream(new Base.StreamConstraints(
            audioConstraints, videoConstraints)).then(stream => {
            let publishOption;
            // publishOption = {video:[
            //     {rid: 'q', active: true/*, scaleResolutionDownBy: 4.0*/},
            //     {rid: 'h', active: true/*, scaleResolutionDownBy: 2.0*/},
            //     {rid: 'f', active: true}
            // ]};
            mediaStream = stream;
            let localStream
            localStream = new Base.LocalStream(
              mediaStream, new Base.StreamSourceInfo('mic', 'camera'));
            state.localStream = stream;

            state.conference.publish(localStream, publishOption).then(publication => {
              // publicationGlobal = publication;
              mixStream(myRoom,publication.id,'common')
              // mixStream(myRoom, publication.id, 'common')
              publication.addEventListener('error', (err) => {
                console.log('Publication error: ' + err.error.message);
              });
            });
          }, err => {
            console.error('Failed to create MediaStream, ' + err);
          });
          var streams = resp.remoteStreams;
          
          for (const stream of streams){
            subscribeVideo(stream)
          }
        }).catch((err) => {console.log(err)})
    })
    
    const subscribeVideo = function(stream){
      state.conference.subscribe(stream)
      state.gridList.push(stream)
      stream.addEventListener('ended',()=>{
        let index = state.gridList.findIndex(item => {
          return item.id === stream.id
        })
        state.gridList.splice(index, 1)
      })

    }

    // 有新的流加入时添加视频流进入gridlist
    state.conference.addEventListener('streamadded', (event) => {
        console.log('A new stream is added ', event.stream.id, event);
    //     isSelf = isSelf?isSelf:event.stream.id != publicationGlobal.id;
    //     if (subscribeForward && isSelf) {
    //         videoSFU(event.stream)
    //     }
    //     // subscribeForward && isSelf && subscribeAndRenderVideo(event.stream);
    //     mixStream(myRoom, event.stream.id, 'common');
      subscribeVideo(event.stream)
      // const currentMode = state.gridMode
      // state.gridMode = currentMode
    //     this.$forceUpdate()
    });


    // 关闭窗口时自动关闭conference
    window.onbeforeunload = function(){
      state.conference.leave()
      // publicationGlobal.stop();
    }

    // 点击某一个视频时 根据情况修改视频模式
    const clickVideo = function(index){
      if (state.gridMode == 'grid-header-other' && index!= 0){
        state.gridList.unshift(state.gridList.splice(index, 1)[0])
      }else if (state.gridMode == 'grid-twoheaders-other'){
        switch(index){
          case 0:
            break
          case 1:
            state.gridList.unshift(state.gridList.splice(index, 1)[0])
            break
          default:
            state.gridList.unshift(state.gridList.splice(index, 1)[0])
            state.gridList.unshift(state.gridList.splice(1, 1)[0])
        }
      }

      // if (state.gridMode != "grid-header-other"){
      //   // 将选中的视频切换到首位并放大
      //   state.pointer = 1
      //   state.gridList.unshift(state.gridList.splice(index, 1)[0])
      //   state.gridMode = "grid-header-other"
      // }else if (index === 0){
      //   // 在已存在放大的视频并点击该视频时，使其恢复并重置布局
      //   state.gridMode = ""
      //   state.pointer = 1
      //   updateGrid()
      // }else{
      //   // 在已存在放大的视频并点击其它视频时，更换在首位的视频以更换其他的放大视频
      //   state.gridList.unshift(state.gridList.splice(index, 1)[0])
      // }

    }

    // 根据视频流数量确定布局模式
    const updateGrid = function(){
      const gridLength = state.gridList.length
      if(gridLength <= 1){
        state.gridMode = ""
      }else if(gridLength <= 4){
        state.gridMode = "grid-two-two"
      }else if(gridLength <= 9){
        state.gridMode = "grid-three-three"
      }else{
        state.gridMode = "grid-four-four"
      }
    }

    // 移动指针
    const movePointer = function(num){
      state.pointer += num
      state.pointer = Math.max(state.pointer,1)
      state.pointer = Math.min(state.pointer,state.gridList.length-4)
    }

    // 有视频放大或视频总数大于16时，筛选视频列表
    const limitVideo = function(){
      if(state.gridMode != "grid-header-other"){
        return state.gridList.slice((state.pointer-1)*16,state.pointer*16)
      }
      var showList = []
      showList.push(state.gridList[0])
      showList = showList.concat(state.gridList.slice(state.pointer,state.pointer+4))
      return showList
    }

    const swapGrid = function() {
      if(state.gridMode == 'grid-header-other'){
        state.gridMode = 'grid-twoheaders-other'
      }else if(state.gridMode == 'grid-twoheaders-other'){
        updateGrid()
      }else{
        state.gridMode = 'grid-header-other'
      }
      state.pointer = 1
    }

    return {
      ...toRefs(state),
      clickVideo,
      updateGrid,
      movePointer,
      limitVideo,
      swapGrid,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
// @import "@/common/mixin.scss";
.grid-box {
  width: 800px;
  height: 600px;
  display: grid;
  position: relative;
  .grid-box-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    cursor: pointer;
    position:relative;
    .grid-box-video{
      width:100%;
      height:100%;
    }
  }
  .selected {
    border: 3px solid red !important;
  }
}
.grid-two-two {
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: repeat(2, 50%);
}
.grid-three-three {
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(3, 33.3%);
}
.grid-four-four {
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(4, 25%);
}
.grid-header-other{
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(4, 25%);
  .grid-box-item:nth-child(1) {
    grid-column:1 / 5;
    grid-row: 1 / 4;
  }
}
.header-more {
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(4, 25%);
  .grid-box-item:nth-child(1) {
    grid-column: 1 / 5;
    grid-row: 1 / 4;
  }
}
.left-button-bottom {
  position:absolute;
  height: 10%;
  left: 10px;
  bottom:7.5%;
}
.right-button-bottom {
  position:absolute;
  height: 10%;
  right: 10px;
  bottom:7.5%;
}
.left-button-middle {
  position:absolute;
  height: 10%;
  left: 10px;
  bottom:45%;
}
.right-button-middle {
  position:absolute;
  height: 10%;
  right: 10px;
  bottom:45%;
}
.grid-twoheaders-other {
  grid-template-columns: repeat(5, 20%);
  grid-template-rows: repeat(3, 33%);
  .grid-box-item:nth-child(1) {
    grid-column: 1 / 4;
    grid-row: 1 / 3;
  }
  .grid-box-item:nth-child(2) {
    grid-column: 4 / 6;
    grid-row: 1 / 3;
  }
}
</style>
