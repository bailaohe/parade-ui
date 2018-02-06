<template>
 <el-card class="log-card">
  <div slot="header" class="logheader">
    <span>Task </span>
    <el-button type="text" @click='refreshLog'>[{{task}}]</el-button>
    <el-button style="float: right;" type="text" @click='refreshLog'>Refresh</el-button>
  </div>
  <div v-for="line in logLines" :key="line" class="logtext">
      <span>{{line}}</span>
  </div>
</el-card> 
</template>
<script>
import API from '@/commons/api';
export default {
  props: {
    execId: {
      required: true
    },
    task: {
      required: true
    }
  },
  mounted() {
    this.refreshLog()
  },
  data() {
    return {
      logLines: []
    }
  },
  methods: {
    refreshLog() {
      API.LOAD_LOG.issue({execId: this.execId, task: this.task}).then(response => {
        this.logLines = response.data
      })
    }
  },
  watch: {
    execId: function(e) {
      this.refreshLog()
    },
    task: function(e) {
      this.refreshLog()
    }
  }
}
</script>

<style>
.log-card .el-card__body {
   background: #263238; 
}
.log-card .el-card__header {
    padding-bottom: 4px; 
    padding-top: 4px; 
}
.logtext {
    font-size: 14px;
    white-space: pre-wrap;
    position: relative;
    font-family: Roboto Mono,monospace!important;
    font-size: 14px;
    background: #263238;
    color: #e9eded;
    cursor: text;
}
.logheader {
    font-size: 16px;
}

/* .logheader:before,
.logheader:after {
      display: table;
      content: "";
}
.logheader:after {
      clear: both
} */
</style>

