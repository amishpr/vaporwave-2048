<template>
  <div id="app">
    <Game />
  </div>
</template>

<script>
import Game from "./components/Game";

export default {
  name: "app",
  components: {
    Game
  }
};
</script>

<style>
html {
  background-image: linear-gradient(#86ede3, lightpink);
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #91207a;
  margin-top: 60px;
}
</style>
