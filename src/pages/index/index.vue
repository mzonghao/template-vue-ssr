<template>
  <div class="content">
    11122333445
    <div @click="goToNext">
      gotonext
    </div>
    <div @click="messageText('1111')">
      ddd
    </div>
    <div @click="messageText('2222')">
      fff
    </div>
  </div>
</template>

<script>
  import { DI } from 'core';
  import { Message } from 'components';

  export default {
    name: 'index',
    asyncData() {
      return DI.get('requestCommon').getUsers()
        .then(data => (data))
        .catch((e) => {
          DI.get('ssr').handleError(e);
        });
    },

    mounted() {
      DI.get('utils').setTitle('首页');
    },

    computed: {
      list() {
        return DI.get('ssr').getContent('index');
      }
    },

    methods: {
      goToNext() {
        DI.get('router').push('/next');
      },

      messageText(text) {
        Message(text);
      }
    }
  };
</script>