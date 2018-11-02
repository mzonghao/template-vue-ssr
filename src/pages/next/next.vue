<template>
  <div class="content">
    34444333
  </div>
</template>

<script>
  import { DI } from 'core';

  export default {
    name: 'next',
    asyncData() {
      return DI.get('requestCommon').getUsers()
        .then(data => (data))
        .catch((e) => {
          console.log(e, 'error');
        });
    },

    mounted() {
      console.log(this.list, 'list');
    },

    computed: {
      list() {
        return DI.get('ssr').getContent('next');
      }
    }
  };
</script>