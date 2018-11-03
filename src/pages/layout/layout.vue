<template>
  <div :class="styles.container">
    <div
        :class="styles.layout"
        v-text="title"
    ></div>
    <router-view></router-view>
  </div>
</template>
<script>
  import { DI } from 'core';
  import styles from './layout.less';

  export default {
    name: 'layout',

    data() {
      return {
        title: '',
        styles
      };
    },

    beforeMount() {
      DI.get('vue').$on('set-title', (title) => {
        this.title = title;
      });
    }
  };
</script>