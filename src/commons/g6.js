import G6 from "@antv/g6";

export default {
  registerTreeNode(layoutCfg) {
    // 自定义树节点
    const Util = G6.Util
    const DEFAULT_NODE_SIZE = layoutCfg.nodeSize;
    G6.registerNode('treeNode', {
      draw(cfg, group) {
        const model = cfg.model;
        const r = layoutCfg.nodeSize ? layoutCfg.nodeSize / 2 : DEFAULT_NODE_SIZE;
        const shapeCfg = {
          attrs: {
            x: cfg.x,
            y: cfg.y,
            r: r,
            stroke: '#003380',
            fill: 'white',
            fillOpacity: 1,
          },
        };
        if (model.children && model.children.length) {
          shapeCfg.class = model.isCollapsed ? 'spreadoutButton' : 'collapseButton';
          shapeCfg.attrs.fill = '#044A9A';
          shapeCfg.attrs.stroke = '#003380';
          shapeCfg.attrs.fillOpacity = 0.4;
        }
        if (model.root) {
          shapeCfg.attrs.fill = '#044A9A';
          shapeCfg.attrs.stroke = '#003380';
          shapeCfg.attrs.fillOpacity = 0.7;
        }
        shapeCfg.attrStash = Util.mix({}, shapeCfg.attrs);
        return group.addShape('circle', shapeCfg);
      },
      afterDraw(cfg, group) {
        const model = cfg.model;
        const r = layoutCfg.nodeSize ? layoutCfg.nodeSize / 2 : DEFAULT_NODE_SIZE;
        const align = model.align;
        const labelAttrs = {
          text: model.label,
          fill: '#666',
          // fontSize: 30,
          textBaseline: 'middle',
          x: cfg.x + r + DEFAULT_NODE_SIZE,
          y: cfg.y,
          textAlign: 'left',
        };
        if (align === 'R') {
          Util.mix(labelAttrs, {
            x: cfg.x - r - DEFAULT_NODE_SIZE,
            y: cfg.y,
            textAlign: 'right',
          });
        } else if (align === 'T' || align === 'CH') {
          Util.mix(labelAttrs, {
            x: cfg.x,
            y: cfg.y + r + DEFAULT_NODE_SIZE,
            textAlign: 'right',
            rotate: -Math.PI / 2,
          });
        } else if (align === 'B') {
          Util.mix(labelAttrs, {
            x: cfg.x,
            y: cfg.y - r - DEFAULT_NODE_SIZE,
            textAlign: 'left',
            rotate: -Math.PI / 2,
          });
        }
        const label = group.addShape('text', {
          attrs: labelAttrs,
        });
        return label;
      }
    });
  }
}