<template>
  <table cellspacing="2">
    <thead>
    <tr>
      <th>姓名</th>
      <th>手机号</th>
      <th>城市</th>
      <th>权限</th>
      <th>创建时间</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="user in users">
      <td>{{user.name}}</td>
      <td>{{user.mobile}}</td>
      <td>{{user.city}}</td>
      <td>{{user.permission | translatePermission}}</td>
      <td>{{user.createdAt | formatDate}}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    props: ['users']
  };
</script>

<style scoped>
  table {
    width: 100%;
    border: 1px solid #F05A50;
    text-align: center;
    font-size: 12px;
  }
  td {
    border: 1px solid #F05A50;
  }
</style>