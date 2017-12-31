<template>
  <canvas id="canvas" class="canvas">
  </canvas>
</template>

<script>


export default {
  props: ['container'],
  mounted() {
    function colorValue(min) {
      return Math.floor((Math.random() * 225) + min);
    }

    function createColorStyle(r, g, b) {
      return `rgba(${r}, ${g}, ${b}, 0.8)`;
    }

    function Color(min) {
      const innerMin = min || 0;
      this.r = colorValue(innerMin);
      this.g = colorValue(innerMin);
      this.b = colorValue(innerMin);
      this.style = createColorStyle(this.r, this.g, this.b);
    }

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = (new Color(150)).style;

    const mousePosition = {
      x: canvas.width - 100,
      y: canvas.height - 60,
    };

    const dots = {
      nb: 250,
      distance: 100,
      d_radius: 150,
      array: [],
    };

    function mixComponents(comp1, weight1, comp2, weight2) {
      return ((comp1 * weight1) + (comp2 * weight2)) / (weight1 + weight2);
    }

    function averageColorStyles(dot1, dot2) {
      const color1 = dot1.color;
      const color2 = dot2.color;

      const r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius);
      const g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius);
      const b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
      return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    }

    function Dot() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;

      this.vx = -0.5 + Math.random();
      this.vy = -0.5 + Math.random();

      this.radius = Math.random() * 2;
      this.color = new Color();
    }

    Dot.prototype = {
      draw: function draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color.style;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
      },
    };

    function createDots() {
      for (let i = 0; i < dots.nb; i++) {
        dots.array.push(new Dot());
      }
    }

    function moveDots() {
      for (let i = 0; i < dots.nb; i++) {
        const dot = dots.array[i];

        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        } else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    }

    function connectDots() {
      for (let i = 0; i < dots.nb; i++) {
        for (let j = 0; j < dots.nb; j++) {
          const idot = dots.array[i];
          const jdot = dots.array[j];

          if (
            (idot.x - jdot.x) < dots.distance
            && (idot.y - jdot.y) < dots.distance
            && (idot.x - jdot.x) > -dots.distance
            && (idot.y - jdot.y) > -dots.distance) {
            if (
              (idot.x - mousePosition.x) < dots.d_radius
              && (idot.y - mousePosition.y) < dots.d_radius
              && (idot.x - mousePosition.x) > -dots.d_radius
              && (idot.y - mousePosition.y) > -dots.d_radius) {
              ctx.beginPath();
              ctx.strokeStyle = averageColorStyles(idot, jdot);
              ctx.moveTo(idot.x, idot.y);
              ctx.lineTo(jdot.x, jdot.y);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    }

    function drawDots() {
      for (let i = 0; i < dots.nb; i++) {
        const dot = dots.array[i];
        dot.draw();
      }
    }

    function animateDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveDots();
      connectDots();
      drawDots();

      requestAnimationFrame(animateDots);
    }

    document.getElementById(this.container).addEventListener('mousemove', (e) => {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
    });

    document.getElementById(this.container).addEventListener('mouseleave', () => {
      mousePosition.x = canvas.width / 2;
      mousePosition.y = canvas.height / 2;
    });

    createDots();
    requestAnimationFrame(animateDots);
  },
};
</script>

<style lang="less">
.canvas {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
}
</style>
