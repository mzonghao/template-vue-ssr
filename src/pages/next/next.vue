<template>
  <div :class="styles.content">
    <div
      :class="styles.button"
      @click="goTo('/')"
    >去主页</div>
    <div :class="styles.container">
      <div :class="styles.title">
        <span>这是首页，渲染</span>
        <span :class="styles.strong"> 500 </span>
        <span>条数据</span>
      </div>
      <table cellspacing="2">
        <thead>
        <tr>
          <th>姓名</th>
          <th>城市</th>
          <th>管理员</th>
          <th>创建时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users">
          <td>{{user.name}}</td>
          <td>{{user.city}}</td>
          <td>{{user.isAdmin | translateIsAdmin}}</td>
          <td>{{user.createdAt | formatDate}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { DI } from 'core';
  import styles from '../index/index.less';

  export default {
    name: 'next',
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