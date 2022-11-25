<template>
  <div>
    <div class="input-group">
      <span class="input-group-text">Ton pseudo</span>
      <input type="text" id="pseudo" aria-label="Pseudo" class="form-control">
      <button type="button" @click="getValue">Valider le pseudo</button>
    </div>
    <div v-for="room in rooms" :key="room">
      <div @click="onClick" :id="room.id" class="card card-primary mt-5 container room" style="cursor: pointer;">
        <div class="row">
          <div class="col-12 col-md-6 my-3">
<<<<<<< HEAD
            <h1 class="room-name">{{ room.name }}</h1>
            <div v-if="room.locked == true" class="d-flex justify-content-center">
=======
            <h1 class="room-name">Serveur {{room.id}}</h1>
            <div v-if="room.hasStarted == true" class="d-flex justify-content-center">
>>>>>>> fdba1a3723947f83489af15da3ba8fd5a1a43682
              <p class="mb-0">Partie en cours</p>
            </div>
            <div class="d-flex justify-content-center" v-else>
              <p class="mb-0">Disponible</p>
              <div id="cercle" class="mx-2 my-auto"></div>
            </div>
          </div>
          <div class="col-12 col-md-6 d-none d-md-flex justify-content-end">
<<<<<<< HEAD
            <span class="room-people my-auto me-3">{{ room.people }}/4</span>
=======
            <span class="room-people my-auto me-3">{{room.players.length}}/4</span>
>>>>>>> fdba1a3723947f83489af15da3ba8fd5a1a43682
          </div>
          <div class="col-12 col-md-6 d-flex d-md-none justify-content-center">
            <span class="room-people my-auto ">{{ room.people }}/4</span>
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
import $ from 'jquery';
let JoinRoom = {

  data: function () {
    return {
<<<<<<< HEAD
      visible: false,
      rooms: [
        {
          id: 0,
          name: 'Serveur 1',
          people: 4,
          locked: true,
        },
        {
          id: 1,
          name: 'Serveur 2',
          people: 2,
          locked: false,
        },
      ],
      pseudo: "",
      selected: -1,
=======
      rooms: []
>>>>>>> fdba1a3723947f83489af15da3ba8fd5a1a43682
    }
  },

  methods: {
<<<<<<< HEAD
    onClick(e) {
      console.log(e);
      var select  = $(e.target).closest(".card").attr("id");
      console.log(select);
      this.selected = select;
    },
    getValue() {
      // Sélectionner l'élément input et récupérer sa valeur
      var input = document.getElementById("pseudo").value;
      this.pseudo = input;
    }
=======
    getBoards() {
      return fetch(`http://localhost:3001/boards/`)
        .then(res => res.json())
        .then(data => this.rooms = data)
    }
  },

  mounted: function() {
    this.getBoards()
>>>>>>> fdba1a3723947f83489af15da3ba8fd5a1a43682
  }
}

export default JoinRoom
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.room-name {
  color: white;
  text-shadow: 2px 2px 5px #232323;
}

.room-people {
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

.input-group-text {
  background-color: red !important;
  color: white !important;
  text-shadow: 2px 2px 5px #232323;
}
</style>
