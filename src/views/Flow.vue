<template>
  <el-table
    v-loading="listLoading"
    :data="flows"
    @expand="handleExpandChange"
    style="width: 100%">
    <el-table-column type="expand">
      <template scope="props">
          <flow-detail :flow="props.row.name"></flow-detail>
      </template>
    </el-table-column>
    <el-table-column
      label="#ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="Name"
      prop="name">
    </el-table-column>
    <el-table-column
      label="Description"
      prop="desc">
    </el-table-column>
    <!-- <el-table-column
      label="last execute.">
      <template scope="scope">
        <el-icon name="time"></el-icon>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column> -->
    <el-table-column label="Operation">
      <template scope="scope">
        <el-button
          v-loading="execPending"
          size="small"
          type="success"
          @click="handleFlowExec(scope.$index, scope.row)">Run</el-button>
        <el-button
          size="small"
          type="info"
          @click="handleFlowEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleFlowDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Vue from "vue";
import API from "@/commons/api";
import SocketChannel from "@/commons/sock";
import FlowDetail from "@/views/FlowDetail";
import io from 'socket.io-client';
 

export default {
  components: {
    FlowDetail
  },
  methods: {
    handleExpandChange(flow, expanded) {
      if (expanded) {
      }
    },
    getTaskList(flow) {
      flowDetail = this.flowDetails[flow];
    },
    handleFlowExec(idx, flow) {
      this.execPending = true;
      API.EXEC_FLOW
        .issue({ flow: flow.name })
        .then(response => {
          const execId = response.data;
          SocketChannel.EXEC.open(execId)
          this.execPending = false;
          this.$router.push({ name: "ExecDetail", params: { execId: execId } });
        })
        .catch(error => {
          this.execPending = false;
        });
    },
    handleFlowDelete(idx, flow) {
      API.DELETE_FLOW.issue({ flow: flow.name }).then(response => {
        debugger
        this.refreshFlowList()
      });
    },
    refreshFlowList() {
      this.listLoading = true;
      this.flows = [];
      API.LIST_FLOW.issue().then(response => {
        for (let [idx, flow] of response.data.entries()) {
          this.flows.push({
            id: idx + 1,
            name: flow,
            desc: "description of flow " + flow
          });
        }
        this.listLoading = false;
      });
    }
  },
  data() {
    return {
      listLoading: true,
      execPending: false,
      flows: [],
      flowDetails: {}
    };
  },
  created() {
    this.refreshFlowList()
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

/* .box-card { */
/* width: 480px; */
/* } */
</style>
