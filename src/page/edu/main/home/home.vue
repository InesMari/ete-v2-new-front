<template>
  <div id="eduHome" class="eduHome">
    <router-view @openTab="openTab"></router-view>
  </div>
</template>

<script>
  import home from "./home.js"
  export default home
</script>

<style lang="scss" src="./home.scss" scoped></style>
