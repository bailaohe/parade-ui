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
    execState() {
      return this.execSnap
    }
  },
  methods: {
    refreshGraph() {
      // 第三步：设置数据
      var nodes = this.flow.tasks.map(task => {
        return {
          id: task,
          label: task,
          shape: "rect",
          color: this.execState[task] == 2 ? 'blue' :
                 this.execState[task] == 3 ? 'green' :
                 this.execState[task] == 4 ? 'red' :
                 this.execState[task] == 5 ? 'yellow' : 'grey'
        };
      });

      const flowId = this.flow.name
      nodes.push({
        id: flowId,
        label: flowId,
        shape: "rect",
        color: this.execState[flowId] == 3 ? 'green':
               this.execState[flowId] == 4 ? 'red' :
               this.execState[flowId] == 5 ? 'yellow' : 'grey'
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

      // 第四步：配置G6画布
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

      net.source(nodes, edges);
      net.render();
    }
  },
  mounted() {
    if (this.execId == null) {
      API.LOAD_FLOW.issue({ flow: this.flowId }).then(response => {
        this.flow = response.data;
        this.refreshGraph()
        this.flowLoading = false
      });
    } else {
      API.LOAD_EXEC.issue({ id: this.execId }).then(response => {
        this.flow = response.data.flow;

        for (let t of response.data.exec.tasks) {
          this.execSnap[t['task']] = t['status']
        }
        this.execSnap[this.flow.name] = response.data.exec.flow['status']
        this.refreshGraph();
        this.flowLoading = false;
      });  
    }
  }
};
</script>

<style>

</style>
