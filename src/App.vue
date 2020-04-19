
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import 'view-design/dist/styles/iview.css'
// import Index from "@/views/index"
export default {
 
}
</script>

<style>
@media (max-width: 768px) { 
  html body {
    font-size: 1rem;
  }
}
@media (min-width: 769px) { 
  html body {
    font-size: 1.6rem;
  }
}
html {
  font-size: 10px;
}
a {
  text-decoration: none;
  color: black;
}
a:hover {
  color: black;
}
</style>
