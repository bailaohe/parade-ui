<template>
  <div v-loading="flowLoading" id="tg" style="width: 100%"></div>
</template>

<script>
import API from "@/commons/api";
import G6 from "@antv/g6";
import Plugins from "@antv/g6-plugins";

export default {
  props: ["execId"],
  data() {
    return {
      tasks: [],
      deps: {},
      execSnap: {},
      taskItemProps: {
        children: "deps",
        label: "name"
      },
      flowLoading: true
    };
  },
  computed: {
    execState() {
      return this.execSnap
    }
  },
  methods: {
    refreshGraph() {
      // 第三步：设置数据
      var nodes = this.tasks.map(task => {
        return {
          id: task,
          label: task,
          shape: "rect",
          color: this.execState[task] == 1 ? 'grey' :
                 this.execState[task] == 2 ? 'blue' :
                 this.execState[task] == 3 ? 'green' :
                 this.execState[task] == 4 ? 'red' : 'yellow'
        };
      });

      nodes.push({
        id: this.flow,
        label: this.flow,
        shape: "rect"
      });

      var edges = Array.concat(
        ...Object.keys(this.deps).map(target => {
          return this.deps[target].map(source => {
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
    API.LOAD_EXEC.issue({ id: this.execId }).then(response => {
      const flow = response.data.flow;
      this.tasks = flow.tasks;
      this.deps = flow.deps;
      this.flow = flow.name;

      const tasks = response.data.exec.tasks;
      for (let t of tasks) {
        this.execSnap[t['task']] = t['status']
      }
      console.log(this.execSnap)
      this.refreshGraph();
      this.flowLoading = false;
    });
  }
};
</script>

<style>

</style>
