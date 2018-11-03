<template>
  <transition>
    <div class="toast">
      <span class="toast-text">
        {{ text }}
      </span>
    </div>
  </transition>
</template>

<script>
  export default {
    props: ['text']
  };
</script>

<style scoped>
  .toast {
    position: fixed;
    left: 50%;
    top: 50%;
    max-width: 80%;
    padding: 10px;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    z-index: 1000;
    transition: opacity .3s linear;
    transform: translate(-50%, -50%);
  }
  .toast-text {
    font-size: 14px;
    display: block;
    text-align: center;
    padding-top: 0;
  }
</style>