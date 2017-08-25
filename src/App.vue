<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!--Change <hello></hello> to <todo></todo>-->
    <todo></todo>
  </div>
</template>

<script>
import Todo from './components/Todo' // change Hello to Todo

export default {
  name: 'app',
  components: {
    Todo // change Hello to Todo
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
