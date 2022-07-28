<template>
  <div>test page</div>
</template>

<script>
import { allRooms } from "../api/rest-sample"
export default {
    name: "testPage",
    created: {
      allRooms
    }
}
</script>

<style>

</style>