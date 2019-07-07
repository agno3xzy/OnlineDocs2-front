<template>
    <img class="background-img" src='../../static/image/login.png' @load="showPage"> 
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        showPage() {
            (document.getElementById('loading')).style.display = "none" 
        }
    }
}
</script>

<style scoped>
    @import '../../static/css/keyframe.css';
.background-img {
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    min-width: 1400px;
    min-height: 800px;
    filter:contrast(70%);
    opacity: 0; 
    animation: fadeIn 1s ease 0s 1;
    animation-fill-mode: forwards;
}
</style>