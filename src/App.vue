<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
html, body {
  font-family: "Helvetica Neue",
    Helvetica,"PingFang SC","Hiragino Sans GB",
    "Microsoft YaHei","微软雅黑",Arial,sans-serif;
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  overflow: auto;
  background-color: #f1f6f8;
}
#app {
  height: 100%;
}
#app .main{
  height: 100%;
}

input, button, textarea {
  border: 0;
  margin: 0;
  padding: 0;
  font-size: 1em;
  line-height: 1em;
  /*-webkit-appearance:none;*/
  background-color: rgba(0, 0, 0, 0);
}

input:focus {
  outline: none;
}
</style>
