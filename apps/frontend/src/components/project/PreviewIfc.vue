<template>
  <div ref="sceneContainer" class="scene-container"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SimpleGrid } from 'openbim-components';

export default {
  name: 'PreviewIfc',
  data() {
    return {
      container: null,
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      grid: null,
      cube: null,
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.dispose();
  },
  methods: {
    init() {
      // Set container
      this.container = this.$refs.sceneContainer;

      // Create scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#eeeeee');

      // Create camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.container.clientWidth / this.container.clientHeight,
        0.1,
        1000,
      );
      this.camera.position.set(10, 10, 10);
      this.camera.lookAt(0, 0, 0);

      // Create renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight,
      );
      this.container.appendChild(this.renderer.domElement);

      // Create controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      // Add grid
      this.grid = new SimpleGrid({
        scene: this.scene,
        controls: this.controls,
      });

      // Add cube
      const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
      const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
      this.cube = new THREE.Mesh(boxGeometry, boxMaterial);
      this.cube.position.set(0, 1.5, 0);
      this.scene.add(this.cube);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(10, 10, 10);
      this.scene.add(pointLight);

      // Start animation loop
      this.animate();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    dispose() {
      this.renderer.dispose();
      this.scene.dispose();
    },
  },
};
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100%;
}
</style>
