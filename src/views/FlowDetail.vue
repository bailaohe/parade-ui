<template>
  <el-tabs 
    v-loading="flowLoading"
    type="card" style="width: 100%">
    <el-tab-pane label="graph">
        <div id="tg"></div>
    </el-tab-pane>
    <el-tab-pane label="List">
      <el-tree :data="taskList" :props="taskItemProps"></el-tree>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import API from "@/commons/api";
import G6 from "@antv/g6";
import Plugins from "@antv/g6-plugins";

export default {
  props: ["flow"],
  data() {
    return {
      tasks: [],
      deps: {},
      taskItemProps: {
        children: "deps",
        label: "name"
      },
      flowLoading: true
    };
  },
  computed: {
    taskList() {
      return this.tasks.map((task, idx) => {
        return {
          name: "#" + idx + ". " + task,
          deps:
            task in this.deps
              ? this.deps[task].map(dep => {
                  return {
                    name: dep
                  };
                })
              : []
        };
      });
    }
  },
  methods: {
    refreshGraph() {
      // 第三步：设置数据
      var nodes = this.tasks.map(task => {
        return {
          id: task,
          label: task,
          shape: "rect"
        };
      });

      nodes.push({
          id: this.flow,
          label: this.flow,
          shape: "rect"
      })

      var edges = Array.concat(...Object.keys(this.deps).map(target => {
          return this.deps[target].map(source => {
              return {
                source: source,
                target: target,
                id: source + '-' + target
              }
          })
      }))

      // 第四步：配置G6画布
      const miniMap = new Plugins["tool.minimap"]();
      const dagre = new Plugins["layout.dagre"]({
        rankdir: "TB",
        nodesep: 100,
        ranksep: 200
      })
      const net = new G6.Net({
        id: "tg", // 容器ID
        width: window.innerWidth, // 画布宽
        height: 600, // 画布高
        fitView: 'cc',
        // grid: null,
        // useAnchor: false,
        plugins: [miniMap, dagre]
      })
      net.changeMode('drag')

      net.source(nodes, edges)
      net.render()
    }
  },
  mounted() {
    API.LOAD_FLOW.issue({ flow: this.flow }).then(response => {
      this.tasks = response.data.tasks;
      this.deps = response.data.deps;
      this.refreshGraph()
      this.flowLoading = false
    });
  }
};
</script>

<style>

</style>
