<template>
  <div :class="styles.content">
    <div
      :class="styles.button"
      @click="goTo('/')"
    >去主页</div>
    <div :class="styles.container">
      <div :class="styles.title">
        <span>这是次页，渲染</span>
        <span :class="styles.strong"> {{users.length}} </span>
        <span>条数据</span>
      </div>
      <user-table :users="users"></user-table>
    </div>
  </div>
</template>

<script>
  import { DI } from 'core';
  import { UserTable } from 'components';
  import styles from '../index/index.less';

  export default {
    name: 'next',

    components: {
      'user-table': UserTable
    },

    asyncData() {
      return DI.get('requestCommon').getUsers('500')
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
      DI.get('utils').setTitle('次页');
    },

    computed: {
      prefetchData() {
        return DI.get('ssr').getContent('next');
      },

      users() {
        return this.prefetchData ? this.prefetchData.results : [];
      }
    },

    methods: {
      goTo(link) {
        DI.get('router').push(link);
      }
    }
  };
</script>