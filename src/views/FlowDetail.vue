<template>
  <div>
  <el-tabs 
    v-loading="flowLoading"
    type="card" style="width: 100%">
    <el-tab-pane label="Graph">
      <div id="tg"></div>
    </el-tab-pane>
    <el-tab-pane label="Tree">
      <div id="tt"></div>
    </el-tab-pane>
    <el-tab-pane label="Executions" v-if="execId==null">
      <exec :flow="flowId"></exec>
    </el-tab-pane>
    <el-tab-pane label="Jobs" v-if="execId!=null">
      <el-table
        :data="jobList"
        style="width: 100%"
        :row-class-name="jobColor">
        <el-table-column
          prop="id"
          label="#ID">
        </el-table-column>
        <el-table-column
          prop="task"
          label="Task">
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
              @click="openLog(scope.row.task)">Logs</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import API from "@/commons/api";
import Bus from "@/commons/bus";
import G6 from "@antv/g6";
import G6x from "@/commons/g6";
import Plugins from "@antv/g6-plugins";
import Exec from "@/views/Exec";

export default {
  components: {
    Exec
  },
  props: {
    flowId: {
      required: false
    },
    execId: {
      required: false
    }
  },
  data() {
    return {
      // the flow data of current detail view
      flow: {
        name: null,
        tasks: [],
        deps: {}
      },
      // store the snapshot of current executing data
      execSnap: {},
      flowLoading: true,


      taskProps: {
        children: "deps",
        label: "name"
      },

      graph: null,
      jobs: []
    };
  },
  computed: {
    taskList() {
      return this.flow.tasks.map((task, idx) => {
        return {
          name: "#" + idx + ". " + task,
          deps:
            task in this.flow.deps
              ? this.flow.deps[task].map(dep => {
                  return {
                    name: dep
                  };
                })
              : []
        };
      });
    },
    jobList() {
      return this.jobs.map((t) => {
        return {
          id: t.id,
          task: t.task,
          startTime: new Date(t.create_time).toLocaleString(),
          endTime: t.status == 3 || t.status == 4 || t.status == 5 ?
                      new Date(t.update_time).toLocaleString() : '-',
          status: t.status == 2 ? 'Executing' :
                  t.status == 3 ? 'Succeeded' :
                  t.status == 4 ? 'Failed' :
                  t.status == 5 ? 'Cancelled' : 'Pending'
        }
      })
    },
    taskTree() {
      let notRoot = {}
      for (let t of this.flow.tasks) {
        if (t in this.flow.deps) {
          for (let d of this.flow.deps[t]) {
            notRoot[d] = t
          }
        }
      }
      let nodes = this.flow.tasks.filter(t => !(t in notRoot)).map(x => {
        return {
          label: x
        }
      })

      let root = nodes[0]
      while(nodes.length > 0) {
        let node = nodes.shift()
        if (!(node.label in this.flow.deps) || this.flow.deps[node.label].length == 0) {
          continue
        }
        node.children = this.flow.deps[node.label].map(x => {
          return {
            label: x
          }
        })
        nodes = nodes.concat(node.children)
      }

      return root
    },
    taskGraph() {
      var nodes = this.flow.tasks.map(task => {
        return {
          id: task,
          label: task,
          shape: "rect",
        };
      });

      const flowId = this.flow.name
      if (!this.flow.tasks.includes(flowId)) {
        nodes.push({
          id: flowId,
          label: flowId,
          shape: "rect",
        });
      }

      var edges = Array.concat(
        ...Object.keys(this.flow.deps).map(target => {
          return this.flow.deps[target].map(source => {
            return {
              source: source,
              target: target,
              id: source + "-" + target
            };
          });
        })
      );

      return {
        "source": {
          "nodes": nodes,
          "edges": edges
        }
      }
    },
    execState() {
      let curState = this.execId != null ? this.$store.getters.getExecuting(this.execId) : {}
      return curState
    }
  },
  methods: {
    jobColor(row, index) {
      if (row.status == 'Executing') {
        return 'info-row';
      } else if (row.status == 'Succeeded') {
        return 'positive-row';
      } else if (row.status == 'Failed') {
        return 'negative-row';
      } else if (row.status == 'Cancelled') {
        return 'negative-row';
      }
      return '';
    },
    initGraph() {
      // 第四步：配置G6画布
      const Util = G6.Util
      const miniMap = new Plugins["tool.minimap"]();
      const dagre = new Plugins["layout.dagre"]({
        rankdir: "TB",
        nodesep: 100,
        ranksep: 200
      });
      const net = new G6.Net({
        id: "tg", // 容器ID
        width: window.innerWidth, // 画布宽
        height: 600, // 画布高
        fitView: "cc",
        // grid: null,
        // useAnchor: false,
        plugins: [miniMap, dagre]
      });
      net.changeMode("drag");
      net.read(Util.clone(this.taskGraph));
      net.node().tooltip( n => {
        return [
          ['desp', 'description of ' + n.name],
        ];
      })
      net.render();
      this.graph = net
    },
    initTree() {
      const Util = G6.Util
      const miniMap = new Plugins["tool.minimap"]();
      const layoutCfg = {
        "direction": "LR",
        "nodeSize": 20,
        // "rankSep": 400,
      };

      G6x.registerTreeNode(layoutCfg)
      
      const tree = new G6.Tree({
        id: 'tt',
        layoutFn: G6.Layouts.Dendrogram,
        layoutCfg: layoutCfg,
        width: window.innerWidth,
        // height: window.innerHeight,
        fitView: 'lc',
        behaviourFilter: ['wheelZoom', 'dragBlank', 'dragCanvas'],
        // fitView: 'autoZoom', // 自动缩放
        // showButton: false
        plugins: [miniMap]
      });
      tree.source(Util.clone(this.taskTree))

      tree.node()
          .shape('treeNode')
          .style({
            stroke: '#A9BCD3'  
          });
      tree.edge().shape('VH');

      tree.render();
    },
    openLog(task) {
      this.$router.push({ name: "JobLog", params: { execId: this.execId, task: task} });
    },
    refreshGraph() {
      if (this.graph != null) {
        const Util = G6.Util
        this.graph.clear();
        this.graph.read(Util.clone(this.taskGraph));

        let self = this
        this.graph.node().color(n => {
          const task = n.id
          if (task != self.flow.name) {
            return self.execState[task] == 2 ? 'blue' :
                 self.execState[task] == 3 ? 'green' :
                 self.execState[task] == 4 ? 'red' :
                 self.execState[task] == 5 ? 'orange' : 'grey'
          }
          return self.execState[task] == 3 ? 'green':
               self.execState[task] == 4 ? 'orange' :
               self.execState[task] == 5 ? 'orange' : 'grey'
        })
        this.graph.render();
      }
    }

  },
  mounted() {
    Bus.$on("execEvent", payload => {
      if (payload.event == 'task-started') {
        this.$notify({
          title: 'task started',
          message: `task [${payload.task}] started`,
          type: 'info'
        })
      } else if (payload.event == 'task-succeeded') {
        this.$notify({
          title: 'task succeeded',
          message: `task [${payload.task}] succeeded`,
          type: 'success'
        })
      } else if (payload.event == 'task-failed') {
        this.$notify({
          title: 'task failed',
          message: `task [${payload.task}] failed`,
          type: 'error'
        })
      } else if (payload.event == 'task-cancelled') {
        this.$notify({
          title: 'task cancelled',
          message: `task [${payload.task}] cancelled`,
          type: 'error'
        })
      }
      this.refreshGraph()
    })

    if (this.execId == null) {
      API.LOAD_FLOW.issue({ flow: this.flowId }).then(response => {
        this.flow = response.data;
        this.initGraph()
        this.initTree()
        this.flowLoading = false
        console.log(this.taskTree)
      });
    } else {
      API.LOAD_EXEC.issue({ id: this.execId }).then(response => {
        this.flow = response.data.flow;
        this.initGraph()
        this.flowLoading = false

        this.jobs = response.data.exec.tasks

        let executing = {}
        for (let t of response.data.exec.tasks) {
          executing[t['task']] = t['status']

        }
        executing[response.data.flow.name] = response.data.exec.flow['status']
        vm.$store.commit("updateExecuting", {
            id: this.execId,
            data: executing
        })
        Bus.$emit('execEvent', {event: 'refresh'})
      });  
    }
  }
};
</script>

<style>
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
