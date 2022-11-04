<template>
  <div id="app">
    <nav>
      <router-link to="/"></router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  background: url('assets/bg.jpg');
}

#app {
  @import 'assets/variable.scss';
  @import 'node_modules/bootstrap/scss/bootstrap.scss';
  background: url('assets/bg.jpg');
  @font-face {
    font-family: "Kabel";
    src: url('./assets/fonts/KabelBd-Normal.ttf') format("truetype");
  }
  font-family: "Kabel", Arial;
  text-align: center;
  color: #2c3e50;

  
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
