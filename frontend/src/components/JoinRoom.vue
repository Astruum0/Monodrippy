<template>
  <div>
    <div v-for="room in rooms" :key="room">
      <div class="card card-primary mt-5 container room">
        <div class="row">
          <div class="col-12 col-md-6 my-3">
            <h1 class="room-name">{{room.name}}</h1>
            <div v-if="room.locked == true" class="d-flex justify-content-center">
              <p class="mb-0">Partie en cours</p>
            </div>
            <div class="d-flex justify-content-center" v-else>
              <p class="mb-0">Disponible</p>
              <div id="cercle" class="mx-2 my-auto"></div>
            </div>
          </div>
          <div class="col-12 col-md-6 d-none d-md-flex justify-content-end">
            <span class="room-people my-auto me-3">{{room.people}}/4</span>
          </div>
          <div class="col-12 col-md-6 d-flex d-md-none justify-content-center">
            <span class="room-people my-auto ">{{room.people}}/4</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <button type="submit" class="btn btn-primary btn-bold px-5 home-btn " @click="ClickJoin">
    <h3 class="mb-0">Join a Room</h3>
  </button> -->
</template>

<script lang="js">

let JoinRoom = {

  data:   function() {
    return {
      visible: false,
      rooms: [
        {
          name: 'Serveur 1',
          people: 4,
          locked: true,
        },
        {
          name: 'Serveur 2',
          people: 2,
          locked: false,
        },
      ]
    }
  },

  methods: {
  
  }
}

export default JoinRoom
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.room-name{
  color: white;
  text-shadow: 2px 2px 5px #232323;
}

.room-people{
  color: white;
  font-size: 3.5rem;
  text-shadow: 2px 2px 5px #232323;
}

#cercle {
    width: 10px;
    height: 10px;
    border-radius: 20px;
    background: rgb(5, 224, 5);
}
</style>
