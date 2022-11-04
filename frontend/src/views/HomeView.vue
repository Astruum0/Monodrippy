<template>
  <div class="home">
    <div class="container">
      <div class="row justify-content-center">
        <img alt="Vue logo" src="../assets/logo.png" class="w-50">
      </div>
      <div class="row">
        <div class="col-3">
          
        </div>
        <div class="col-6">
          <div class="col-12 my-5">
            <button type="submit" class="btn btn-primary btn-bold px-5  home-btn">
              <h3 class="mb-0">Create a Room</h3>
            </button>
          </div>
          <div class="col-12 mb-5">
            <JoinRoom/>
          </div>
        </div>
        <div class="col-3">

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import JoinRoom from '@/components/JoinRoom.vue'; // @ is an alias to /src

@Component({
  components: {
    JoinRoom,
  },
})

export default class HomeView extends Vue {}
</script>

<style lang="scss">

.home-btn{
  width: 410px;
}

</style>
