<template>
  <div :class="styles.content">
    <div
      :class="styles.button"
      @click="goTo('/next')"
    >去下一页</div>
    <div
      :class="styles.button"
      @click="messageText('调用Message')"
    >调用Message</div>
    <div :class="styles.container">
      <div :class="styles.title">
        <span>这是首页，渲染</span>
        <span :class="styles.strong"> {{users.length}} </span>
        <span>条数据</span>
      </div>
      <user-table :users="users"></user-table>
    </div>
  </div>
</template>

<script>
  import { DI } from 'core';
  import { Message, UserTable } from 'components';
  import styles from './index.less';

  export default {
    name: 'index',

    components: {
      'user-table': UserTable
    },

    asyncData() {
      return DI.get('requestCommon').getUsers('100')
        .then(data => (data))
        .catch((e) => {
          DI.get('ssr').handleError(e);
        });
    },

    data() {
      return {
        styles
      };
    },

    mounted() {
      DI.get('utils').setTitle('首页');
    },

    computed: {
      prefetchData() {
        return DI.get('ssr').getContent('index');
      },

      users() {
        const { result } = this.prefetchData;
        return this.prefetchData ? result.data : [];
      }
    },

    methods: {
      goTo(link) {
        DI.get('router').push(link);
      },

      messageText(text) {
        Message(text);
      }
    }
  };
</script>