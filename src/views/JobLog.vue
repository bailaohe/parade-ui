<template>
 <el-card class="box-card">
  <div slot="header" class="logheader">
    <span style="line-height: 16px;">Job Log</span>
    <el-button style="float: right;" type="text" @click='refreshLog'>Refresh</el-button>
  </div>
  <div v-for="line in logLines" :key="line" class="logtext">
      <pre>{{line}}</pre>
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
  }
}
</script>

<style>
.logtext {
    font-size: 14px;
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

