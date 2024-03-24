<template>
  <div
    id="threejs"
    class="outline-none cursor-move scene-container"
    ref="sceneContainer"
  ></div>
</template>
<script>
import {
  DirectionalLight,
  AmbientLight,
  Vector2,
  Vector3,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Color,
} from 'three';

import * as OBC from 'openbim-components';
import { GroupSelector } from './GroupSelector.js';

import SpriteText from 'three-spritetext';
import authHeader from '@/services/auth-header';
import projectHeader from '@/services/project-header';

export default {
  name: 'ifc-port',
  data() {
    return {
      //camera: null,
      //controls: null,
      //renderer: null,
      camPos: null,
      //avatar: null,
      //highlightMaterial: null,
      //isDragging: false,
      //dragObject: null,

      //// create Vector to calculate Camera Direction

      //plane: new Plane(),
      //pNormal: new Vector3(0, 1, 0),
      //raycaster: new Raycaster(),
      //shift: new Vector3(),
      vector: new Vector3(),
      //found: null,
      //planeIntersect: new Vector3(),
      //pIntersect: new Vector3(),
      // obc components

      container: null,
      components: new OBC.Components(),
      scene: null,
      groupSelector: null,
    };
  },
  computed: {
    othercamPos() {
      return this.$store.state.viewport.othercamPos;
    },
    takeScreenshotNow() {
      return this.$store.state.viewport.takeScreenshot;
    },
    connectedPlayers() {
      return this.$store.state.viewport.players;
    },
    selectedSubprojects() {
      return this.$store.state.viewport.subprojectsPositions;
    },
    loadedSubprojects() {
      return this.scene.children
        .filter((x) => x.name.startsWith('subprojectId:'))
        .map((x) => parseInt(x.name.replace('subprojectId:', '')));
    },
    hasSubproject() {
      return !!this.$store.state.curproject.theproject.subprojects;
    },
    loadedSubprojectIds() {
      return this.scene.children
        .filter((x) => x.name.startsWith('subprojectId:'))
        .map((x) => parseInt(x.name.replace('subprojectId:', '')));
    },
    allowedSubprojectIds() {
      return this.selectedSubprojects.map((x) => x.id);
    },
    subprojectsToRemove() {
      return this.loadedSubprojectIds.filter(
        (id) => !this.allowedSubprojectIds.includes(id),
      );
    },
  },
  methods: {
    init() {
      // set container
      this.container = this.$refs.sceneContainer;
      this.components.scene = new OBC.SimpleScene(this.components);
      this.components.renderer = new OBC.PostproductionRenderer(
        this.components,
        this.container,
      );
      // TODO: Set renderer size based on container size .setSize(container.clientWidth, container.clientHeight);

      this.components.camera = new OBC.OrthoPerspectiveCamera(this.components);
      this.components.raycaster = new OBC.SimpleRaycaster(this.components);
      this.components.init();

      this.components.scene.setup();

      this.components.renderer.postproduction.enabled = true;

      this.scene = this.components.scene.get();

      this.components.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

      const directionalLight = new DirectionalLight();
      directionalLight.position.set(5, 10, 3);
      directionalLight.intensity = 0.5;
      this.scene.add(directionalLight);

      const ambientLight = new AmbientLight();
      ambientLight.intensity = 0.5;
      this.scene.add(ambientLight);
      this.scene.background = new Color('#eeeeee');

      console.log('poso', this.components.camera.controls);
      //read own position
      this.components.camera.controls.addEventListener('controlend', () =>
        this.updateCamera(),
      );
      this.loadModel();
      // TODO highlightMaterial color

      //   this.highlightMaterial = new MeshPhongMaterial({
      //     color: 0x00b1ff,
      //     depthTest: false,
      //     transparent: true,
      //     opacity: 0.3,
      //   });
      this.groupSelector = new GroupSelector(this.components);
    },

    insertAvatar() {
      this.connectedPlayers.forEach((player) => {
        this.loadAvatar(1, player.username);
      });
    },
    updateAvatar() {
      this.connectedPlayers.forEach((player) => {
        this.moveObject(player.username, player.position);
      });
    },

    updateObjectPostition(positionsArray) {
      positionsArray.forEach((posi) => {
        this.moveSubproject(posi);
      });
    },

    insertSubproject(addSubproject) {
      addSubproject.forEach((sb) => {
        this.loadSubproject(sb);
      });
    },

    removeSubproject(rmSubprojectIds) {
      rmSubprojectIds.forEach((subprojectId) => {
        this.unloadSubproject(subprojectId);
      });
    },
    removeSubproject(rmSubproject) {
      Array.prototype.forEach.call(rmSubproject, (sb) => {
        this.unloadSubproject(sb);
      });
    },

    loadAvatar(avatarId, name) {
      // TODO: load avatar file from server. custom avatars gltb,ifc or fragments
      if (!this.scene.getObjectByName(name)) {
        console.log('loadAvatar', avatarId, name);
        const geometry = new SphereGeometry(1, 32, 32); // radius, widthSegments, heightSegments
        const material = new MeshBasicMaterial({ color: 0xffffff }); // white color
        const sphere = new Mesh(geometry, material);
        sphere.scale.set(0.4, 0.4, 0.4); // scale the sphere
        sphere.name = name; // set the name of the sphere

        // add Text
        const myText = new SpriteText(name);
        myText.textHeight = 2;
        myText.strokeWidth = 1;
        myText.strokeColor = 'black';
        myText.position.y = sphere.position.y - 3; // position the text below the sphere
        sphere.add(myText); // add the text to the sphere

        this.scene.add(sphere);
      }
    },
    async loadSubproject(subproject) {
      if (!this.scene.getObjectByName(`subprojectId:${subproject.id}`)) {
        const parentProject = this.scene.children.find((x) =>
          x.name.match(/projectId/),
        );
        try {
          const fragments = this.components.tools.get(OBC.FragmentManager);
          console.log(fragments);

          const response = await fetch(
            `${this.$app_url}/api/project/get_projectfileifc/${subproject.id}`,
            {
              method: 'GET',
              headers: {
                Authorization: authHeader(),
              },
            },
          );
          console.log(response);

          const data = await response.arrayBuffer();
          const buffer = new Uint8Array(data);
          const group = await fragments.load(buffer);

          group.name = `subprojectId:${subproject.id}`;
          console.log('loadSubproject', group);
          console.log('loadSubprojectf', parentProject);

          if (
            subproject.position.x === 0 &&
            subproject.position.y === 0 &&
            subproject.position.z === 0
          ) {
            group.position.x = parentProject?.position.x || 0;
            group.position.y = parentProject?.position.y || 0;
            group.position.z = parentProject?.position.z || 0;
            this.$store.dispatch('viewport/setSuprojectPosition', {
              id: subproject.id,
              position: group.position,
            });
          } else {
            group.position.x = subproject.position.x;
            group.position.y = subproject.position.y;
            group.position.z = subproject.position.z;
          }

          console.log('added Position', group.position);

          this.scene.add(group);
          this.updateCamera();
        } catch (err) {
          console.log('Error loading IFC.');
          console.log(err);
        }
      }
    },
    unloadSubproject(subproject) {
      const group = this.scene.getObjectByName(`subprojectId:${subproject}`);
      if (group) {
        this.scene.remove(group);
      }
    },
    moveObject(oModelName, posi) {
      const selObject = this.scene.getObjectByName(oModelName);
      if (selObject) {
        //selAvatar.rotation.x = player.dir.x;
        //selAvatar.rotation.y = player.dir.y;
        //selAvatar.rotation.z = player.dir.z;
        selObject.position.x = posi.x;
        selObject.position.y = posi.y;
        selObject.position.z = posi.z;
      }
    },
    moveSubproject(posi) {
      const selObject = this.scene.getObjectByName(`subprojectId:${posi.id}`);
      if (selObject) {
        selObject.position.x = posi.position.x;
        selObject.position.y = posi.position.y;
        selObject.position.z = posi.position.z;
        selObject.rotation.y = posi.rotation.y;
      }
    },
    async loadModel() {
      const fragments = new OBC.FragmentManager(this.components);
      if (fragments.groups.length) return;
      const file = await fetch(
        `${this.$app_url}/api/project/get_projectfileifc/${projectHeader()}`,
        {
          method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
          headers: {
            Authorization: authHeader(),
            // Add other headers as needed
          },
        },
      );
      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      const group = await fragments.load(buffer);
      group.name = 'projectId';
      console.log(this.components.renderer);
    },

    getCameraPosition() {
      // TODO : move camera to position with controls
      if (this.othercamPos.position) {
        this.components.camera._perspectiveCamera.position.x =
          this.othercamPos.position.x;
        this.components.camera._perspectivecamera.position.y =
          this.othercamPos.position.y;
        this.components.camera._perspectivecamera.position.z =
          this.othercamPos.position.z;
        //this.controls.update();
      }
    },
    roundNumbers(obj) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'number') {
          // obj[key] = value.toFixed(2) // 1.9999 -> "2.00"
          obj[key] = +value.toFixed(2); // 1.9999 -> 2
        }
      });
      return obj;
    },

    updateCamera() {
      this.updateAvatar();
      this.updateObjectPostition(this.selectedSubprojects);
      let position = this.components.camera.controls.getPosition();
      this.camPos = {
        x: position.x.toFixed(2),
        y: position.y.toFixed(2),
        z: position.z.toFixed(2),

        dir: this.roundNumbers(
          this.components.camera
            .get('Perspective')
            .getWorldDirection(this.vector),
        ),
      };
      this.$store.dispatch('viewport/setowncamPos', this.camPos);
    }, // Debounce for 100ms

    takeScreenshot() {
      let renderer = this.components.renderer._renderer.render(
        this.components.scene.get(),
        this.components.camera.get(),
      );

      let screenshot = renderer.domElement.toDataURL();

      this.$store.dispatch('viewport/imgStore', screenshot);
    },

    //  pointerMove(event) {
    //    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //    this.raycaster.setFromCamera(this.mouse, this.camera);
    //    if (this.isDragging) {
    //      this.raycaster.ray.intersectPlane(this.plane, this.planeIntersect);
    //      this.dragObject.position.addVectors(this.planeIntersect, this.shift);
    //      this.updateCamera();
    //    }
    //  },
    //    pointerDown() {
    //      const intersects = this.raycaster.intersectObjects(
    //        this.scene.children,
    //        false,
    //      );
    //      console.log('pointerDown', intersects);
    //      if (intersects.length) {
    //        this.found = intersects[0];
    //        //dont move parent Project
    //        if (this.found.object.name !== 'projectId') {
    //          this.controls.enabled = false;
    //          this.pIntersect.copy(this.found.point);
    //          this.plane.setFromNormalAndCoplanarPoint(
    //            this.pNormal,
    //            this.pIntersect,
    //          );
    //          this.shift.subVectors(this.found.object.position, this.found.point);
    //          this.isDragging = true;
    //          this.dragObject = this.found.object;
    //          this.found.object.userData.color = this.found.object.material;
    //          this.found.object.material = this.highlightMaterial;
    //        }
    //      }
    //    },
    //    pointerUp() {
    //      if (this.isDragging) {
    //        this.isDragging = false;
    //        if (this.dragObject.name.match(/subprojectId/)) {
    //          this.$store.dispatch('viewport/setSuprojectPosition', {
    //            id: parseInt(this.dragObject.name.replace('subprojectId:', '')),
    //            position: this.dragObject.position,
    //          });
    //        }
    //        this.controls.enabled = true;
    //        this.found.object.material = this.found.object.userData.color;
    //        this.dragObject = null;
    //        this.updateObjectPostition(this.selectedSubprojects);
    //        this.updateCamera();
    //      }
    //    },
    pullSpPositions() {
      this.$http
        .get(
          `/view/get_selectedsubprojects/${this.$store.state.curproject.theproject.id}`,
        )
        .then(
          (response) => {
            console.log('pullSpPositions', response.data.selectedSubprojects);
            if (response.data.selectedSubprojects.length > 0) {
              console.log(
                'pulllength',
                response.data.selectedSubprojects.length,
              );
              return this.$store.dispatch(
                'viewport/pullSubprojectPositions',
                response.data.selectedSubprojects,
              );
            }
          },
          (error) => {
            this.content =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
          },
        );
    },
  },
  watch: {
    connectedPlayers(oldval, newval) {
      if (oldval.length !== newval.length) {
        this.insertAvatar();
      }
      this.updateCamera();
    },
    selectedSubprojects(newVal, oldVal) {
      if (newVal.length !== oldVal.length) {
        console.log('selectedSubprojects', newVal, oldVal);
        this.insertSubproject(newVal);
        this.removeSubproject(this.subprojectsToRemove);
        this.updateObjectPostition(newVal);
        this.updateCamera();
      }
    },
    othercamPos() {
      // watch it
      this.getCameraPosition();
    },
    takeScreenshotNow() {
      this.takeScreenshot();
    },
  },
  mounted() {
    this.init();
    if (this.hasSubproject) {
      this.pullSpPositions();
    }
    //    this.controls.addEventListener('change', this.updateCamera);
    //    this.container.addEventListener('pointerdown', this.pointerDown);
    //this.container.addEventListener('pointermove', this.pointerMove);
    //    this.container.addEventListener('pointerup', this.pointerUp);
    // call this only in static scenes (i.e., if there is no animation loop)
  },
  created() {
    // window.addEventListener('resize', this.resizeWindow);
  },
  destroyed() {
    this.components.dispose();
    // window.removeEventListener('resize', this.resizeWindow);
    //    this.controls.removeEventListener('change', this.updateCamera);
    //    this.container.removeEventListener('pointerdown', this.pointerDown);
    //this.container.removeEventListener('pointermove', this.pointerMove);
    //    this.container.removeEventListener('pointerup', this.pointerUp);
  },
};
</script>

<style>
.scene-container {
  height: 100%;
  width: 100%;
}
</style>
