<template>
  <div>
    <div class="input-group">
      <span class="input-group-text">Ton pseudo</span>
      <input type="text" id="pseudo" aria-label="Pseudo" class="form-control" @keyup="getValue">
    </div>
    <div v-for="room in rooms" :key="room">
      <div @click="onClick" :id="room.id" class="card card-primary mt-5 container room" style="cursor: pointer;">
        <div class="row">
          <div class="col-12 col-md-6 my-3">
            <h1 class="room-name">Serveur {{room.id}}</h1>
            <div v-if="room.hasStarted == true" class="d-flex justify-content-center">
              <p class="mb-0">Partie en cours</p>
            </div>
            <div class="d-flex justify-content-center" v-else>
              <p class="mb-0">Disponible</p>
              <div id="cercle" class="mx-2 my-auto"></div>
            </div>
          </div>
          <div class="col-12 col-md-6 d-none d-md-flex justify-content-end">
            <span class="room-people my-auto me-3">{{room.players.length}}/4</span>
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
import GameCanvas from '@/components/GameCanvas.vue';

let JoinRoom = {

  components  : {
    GameCanvas  
  },

  data: function () {
    return {
      rooms: [],
      pseudo: "",
      selected: -1,
    }
  },
  props: {
    id_room: Number,
    id_player: String,
  },

  methods: {
    onClick(e) {
      if (this.pseudo == "") {
        alert("Vous n'avez pas renseignez votre peusdo")
      } else {
        console.log(e);
        var select  = $(e.target).closest(".card").attr("id");
        this.selected = select;
        this.setCookie(this.selected, this.pseudo)
        window.location.href='/game'
      }
    },
    setCookie(id,pseudo) {
      document.cookie = "id_cookie" + "=" + id 
      document.cookie = "pseudo_cookie" + "=" + pseudo 

    },
    getValue() {
      // Sélectionner l'élément input et récupérer sa valeur
      var input = document.getElementById("pseudo").value;
      this.pseudo = input;
      console.log(this.pseudo)
    },
    getBoards() {
      return fetch(`http://api.arthurvella.com:3001/boards/`)
        .then(res => res.json())
        .then(data => this.rooms = data)
    }
  },

  mounted: function() {
    this.getBoards()
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
