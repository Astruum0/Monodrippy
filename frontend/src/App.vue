<template>
  
  <div id="app">
    <nav>
      <router-link to="/"></router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: "Kabel";
  src: url('@/assets/fonts/KabelBd-Normal.ttf') format("truetype");
}
body {
  background: url('assets/bg.jpg');
}

#app {
  @import 'assets/variable.scss';
  @import 'node_modules/bootstrap/scss/bootstrap.scss';
  background: url('assets/bg.jpg');
  font-family: "Kabel";
  text-align: center;
  color: #2c3e50;

  
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden
}
</style>
