<template>
  <el-row style="height: 100%;">
    <el-col :span="24" class="header-box">
      <el-menu theme="dark" 
      :default-active="activeIndex" mode="horizontal" @select="selectIndex">
        <span class="title">Parade Admin</span>
        <el-menu-item index="Flow">Flows</el-menu-item>
        <el-menu-item index="Exec">Executions</el-menu-item>
        <!-- <el-menu-item index="Task">Tasks</el-menu-item> -->
        <!-- <el-menu-item index="History">History</el-menu-item> -->
        <!-- <el-menu-item index="Setting">Settings</el-menu-item> -->
        <span class="user">
          <el-tag type="success">parade</el-tag>
          <el-button type="primary" @click="logout" style="margin-left:10px;" size="small">Logout</el-button>
        </span>
      </el-menu>
    </el-col>
    <el-col :span="24" class="content">
      <el-card>
        <div slot="header" class="crumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>Parade</el-breadcrumb-item>
            <el-breadcrumb-item>{{activeIndexName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapState([
        'activeIndex'
      ]),
      ...mapGetters([
        'activeIndexName',
      ])
    },
    methods: {
      selectIndex(key, keyPath) {
        this.$store.commit('setActiveClass', ['Exec', 'Execs'])
        this.$router.push({name: key})
      },
      logout () {
        this.$alert('确认登出？', {
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              localStorage.removeItem('knock_knock')
              this.$router.push({name: 'Login'})
            }
          }
        })
      }
    }
  }
</script>

<style>
.header-box {
  position: fixed;
  z-index: 100;
}
.header-box .el-menu{
  border-radius: 0px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  float: left;
  height: 60px;
  line-height: 60px;
  margin: 0 20px;
  position: relative;
  box-sizing: border-box;
}
.user {
  font-size: 16px;
  color: #fff;
  float: right;
  height: 60px;
  line-height: 60px;
  margin: 0 20px;
  position: relative;
  box-sizing: border-box;
}
.content {
  margin-top: 60px;
  padding: 10px;
}
/* .content .crumb { */
  /* margin-bottom: 20px; */
/* } */
</style>