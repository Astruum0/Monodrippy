<template>
  <button v-if="visible == false" type="submit" class="btn btn-primary btn-bold px-5 home-btn " @click="ClickJoin">
    <h3 class="mb-0">Join a Room</h3>
  </button>
  <div v-else class="d-flex justify-content-between">
    <input type="text">
    <button type="submit" class="btn btn-primary btn-bold px-5">Join</button>
  </div>
</template>

<script lang="js">

let JoinRoom = {

  data:   function() {
    return {
      visible: false
    }
  },

  methods: {
    ClickJoin() {
      this.visible = !this.visible
      console.log(this.visible);
    }
  }
}

export default JoinRoom
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
