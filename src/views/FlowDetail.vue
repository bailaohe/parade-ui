<template>
  <el-tabs 
    v-loading="flowLoading"
    type="card" style="width: 100%">
    <el-tab-pane label="graph">
        <div id="tg"></div>
    </el-tab-pane>
    <el-tab-pane label="List">
      <el-tree :data="taskList" :props="taskProps"></el-tree>
    </el-tab-pane>
    <el-tab-pane label="Logs" v-if="execId!=null">
      <el-tree :data="taskList" :props="taskProps"></el-tree>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
import API from "@/commons/api";
import Bus from "@/commons/bus";
import G6 from "@antv/g6";
import Plugins from "@antv/g6-plugins";

export default {
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

      graph: null
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
    taskGraph() {
      var nodes = this.flow.tasks.map(task => {
        return {
          id: task,
          label: task,
          shape: "rect",
        };
      });

      const flowId = this.flow.name
      nodes.push({
        id: flowId,
        label: flowId,
        shape: "rect",
      });

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
      net.render();
      this.graph = net
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
                 self.execState[task] == 5 ? 'yellow' : 'grey'
          }
          return self.execState[task] == 3 ? 'green':
               self.execState[task] == 4 ? 'red' :
               self.execState[task] == 5 ? 'yellow' : 'grey'
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
        this.flowLoading = false
      });
    } else {
      API.LOAD_EXEC.issue({ id: this.execId }).then(response => {
        this.flow = response.data.flow;
        this.initGraph()
        this.flowLoading = false

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

</style>
