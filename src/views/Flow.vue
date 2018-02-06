<template>
<div>
  <el-table
    v-loading="listLoading"
    :data="flows"
    style="width: 100%">
    <el-table-column type="expand">
      <template scope="props">
          <flow-detail :flow-id="props.row.name"></flow-detail>
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
    <el-table-column label="Operation">
      <template scope="scope">
        <el-button
          v-loading="execPending"
          size="small"
          type="success"
          @click="execFlow(scope.$index, scope.row)">Run</el-button>
        <el-button
          size="small"
          type="danger"
          @click="deleteFlow(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import Vue from "vue";
import API from "@/commons/api";
import SocketChannel from "@/commons/sock";
import FlowDetail from "@/views/FlowDetail";
import io from "socket.io-client";

export default {
  components: {
    FlowDetail
  },
  methods: {
    execFlow(idx, flow) {
      this.execPending = true;
      API.EXEC_FLOW.issue({ flow: flow.name })
        .then(response => {
          const execId = response.data;
          SocketChannel.EXEC.open(execId);
          this.execPending = false;
          this.$router.push({ name: "ExecDetail", params: { flowId: flow.name, execId: execId } });
        })
        .catch(error => {
          this.execPending = false;
        });
    },
    deleteFlow(idx, flow) {
      this.$confirm(`Do you want to delete this flow: ${flow.name}?`, 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          API.DELETE_FLOW.issue({ flow: flow.name }).then(response => {
            this.listFlow();
          });
        }).catch(() => {
        });
    },
    listFlow() {
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
    this.listFlow();
  }
};
</script>

<style>
</style>
