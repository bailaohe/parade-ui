<template>
  <div v-loading="listLoading">
    <el-row>
      <el-table
        :data="execList"
        style="width: 100%"
        :row-class-name="execColor">
        <el-table-column
          prop="id"
          label="#ID">
        </el-table-column>
        <el-table-column
          prop="flow"
          label="Flow">
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="Start Time">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="End Time">
        </el-table-column>
        <el-table-column
          prop="status"
          label="Status">
        </el-table-column>
            <el-table-column label="Operation">
      <template scope="scope">
        <el-button
          size="small"
          type="info"
          @click="openExec(scope.row.flow, scope.row.id)">Detail</el-button>
      </template>
    </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        @size-change="pageSizeChanged"
        @current-change="pageNoChanged"
        :current-page.sync="pageNo"
        :page-size="30"
        layout="total, prev, pager, next, sizes"
        :total="totalExec"
        :page-sizes="pageSizeOptions">
      </el-pagination>
    </el-row>
  </div>
</template>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-table .info-row {
    background: #c9e5f5;
  }

  .el-table .positive-row {
    background: #e2f0e4;
  }

  .el-table .negative-row {
    background: #f0e4e2;
  }
</style>

<script>
  import Vue from "vue";
  import API from "@/commons/api";

  export default {
    props: {
      flow: {
        required: false
      }
    },
    created() {
      this.listExec();
    },
    methods: {
      pageSizeChanged(val) {
        this.pageSize = val
        this.listExec()
      },
      pageNoChanged(val) {
        this.pageNo = val
        this.listExec()
      },

      execColor(row, index) {
        if (row.status == 'Executing') {
          return 'info-row';
        } else if (row.status == 'Succeeded') {
          return 'positive-row';
        } else if (row.status == 'Failed') {
          return 'negative-row';
        }
        return '';
      },
      openExec(flow, execId) {
        this.$router.push({ name: "ExecDetail", params: { flowId: flow, execId: execId } });
      },
      listExec() {
        this.listLoading = true;
        let param = {pageSize: this.pageSize, pageNo: this.pageNo}
        if (this.flow != null) {
          param = {...param, flow: this.flow}
        }
        API.LIST_EXEC.issue(param).then(response => {
          this.totalExec = response.data.total
          let execList = response.data.data.map((exec) => {
            return {
              id: exec.id,
              flow: exec.flow,
              startTime: exec.create_time,
              endTime: exec.status == 3 || exec.status == 4 ?
                      exec.update_time : '-',
              status: exec.status == 3 ? 'Succeeded' :
                      exec.status == 4 ? 'Failed' : 'Executing'
            };
          });
          this.execList = execList
          this.listLoading = false;
        });
      }
    },
    data() {
      return {
        pageNo: 1,
        pageSize: 30,
        listLoading: true,
        totalExec: 100,
        pageSizeOptions: [5, 10, 20, 30, 50],
        execList: []
      }
    }
  }
</script>