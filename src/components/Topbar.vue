<template>
  <div class="header">
    <div class="logo">
      <img src="../assets/logo.png" alt />
      <h1>学生管理系统</h1>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-nav"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-submenu index="/aboutme">
        <template slot="title">{{name}}</template>
        <el-menu-item index="/">注销</el-menu-item>
      </el-submenu>
      <el-menu-item index="1"  @click="gotocourse(params)" >
        <el-badge value="admin" class="item" type="warning">课程管理</el-badge>
      </el-menu-item>
      <el-menu-item index="2"  @click="gotostudent(params)">
        <el-badge value="admin" class="item" type="warning">学生管理</el-badge>
      </el-menu-item>
       <el-menu-item index="3"  @click="gotoselect(params)">
        <el-badge value="admin" class="item" type="warning">学生选课管理</el-badge>
      </el-menu-item>
      <!-- </el-menu-item> -->
    </el-menu>
    <div class="line"></div>
  </div>
</template>
<script>
export default {
  name:'topbar',
  props:['name','params'],
  data() {
    return {
     activeIndex:"2"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    gotocourse(params){
    this.activeIndex="1"
    this.$router.push({
      name:'courses',
      params:params
      })
      
    },
    gotostudent(params){
      this.activeIndex="2"
      this.$router.push({
      name:'students',
      params:params
      })
      
    },
    gotoselect(params){
      this.activeIndex="3"
      this.$router.push({
      name:'select',
      params:params,
      })
   
    }
  }
};
</script>

<style lang="less" scoped>
body {
  .header {
    position: relative;
    .el-menu-nav {
      // padding-right: %;
      li {
        float: right;
        padding-right: 3em;
      }
    }
    .logo {
      position: absolute;
      z-index: 999;
      left: 2em;
      top: 0.7em;
      img {
        width: 2.2em;
        vertical-align: bottom;
      }
      h1 {
        display: inline;
        vertical-align: center;
        color: #fff;
        font-size: 1.7em;
        font-weight: 300;
        font-family: "Courier New", Courier, monospace;
      }
    }
  }
}
</style>