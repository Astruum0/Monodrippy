<template>
  <div class="home">
    <div class="container">
      <div class="row justify-content-center">
        <img alt="Vue logo" src="../assets/logo.png" class="w-50">
      </div>
      <div class="row">
        <div class="col-3 d-none d-md-block">
          
        </div>
        <div class="col-12 col-md-6">
          <div class="col-12 mb-5 px-lg-2 px-3">
            <JoinRoom/>
          </div>
        </div>
        <div class="col-3 d-none d-md-block">

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
