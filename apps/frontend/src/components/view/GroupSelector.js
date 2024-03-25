import * as THREE from 'three';
import * as OBC from 'openbim-components';
import store from '@/store/index.js';

export class GroupSelector extends OBC.Component {
  static uuid = 'd9ad12be-5cdb-4065-9761-f99b1e63a983';

  constructor(components) {
    super(components);
    this.components.tools.add(GroupSelector.uuid, this);
    this.highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0x00b1ff,
      transparent: true,
      opacity: 0.5,
    });
    this.dragObject = null;
    this.isDragging = false;
    this.plane = new THREE.Plane();
    this.pNormal = new THREE.Vector3(0, 0, 0);
    this.shift = new THREE.Vector3();
    this.originalMaterials = new Map();
    this.pIntersect = new THREE.Vector3();
    this.isEnabled = false; // Add this line to keep track of the tool's enabled state

    this.components.renderer
      .get()
      .domElement.addEventListener('pointerdown', this.onPointerDown);
    this.components.renderer
      .get()
      .domElement.addEventListener('pointermove', this.onPointerMove);
    this.components.renderer
      .get()
      .domElement.addEventListener('pointerup', this.onPointerUp);
  }

  // Modify this method to toggle the tool's enabled state
  enableTool() {
    this.isEnabled = !this.isEnabled;
  }

  onPointerDown = (event) => {
    if (!this.isEnabled) return; // Check if the tool is enabled

    const fragmentManager = this.components.tools.get(OBC.FragmentManager);
    const intersect = this.components.raycaster.castRay(fragmentManager.groups);
    if (intersect) {
      const intersectedObject = intersect.object;
      const group = intersectedObject.parent;
      if (group instanceof THREE.Group) {
        this.dragObject = group;
        this.pIntersect.copy(intersect.point);
        this.plane.setFromNormalAndCoplanarPoint(this.pNormal, this.pIntersect);
        this.shift.subVectors(this.dragObject.position, this.pIntersect);
        this.dragObject.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = this.highlightMaterial;
          }
        });
        this.isDragging = true;
        this.components.camera.controls.enabled = false;
      }
    }
  };

  dispose() {
    this.components.renderer
      .get()
      .domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.components.renderer
      .get()
      .domElement.removeEventListener('pointermove', this.onPointerMove);
    this.components.renderer
      .get()
      .domElement.removeEventListener('pointerup', this.onPointerUp);
    this.highlightMaterial = null;
    this.highlightMaterial = null;
    this.dragObject = null;
    this.isDragging = null;
    this.plane = null;
    this.pNormal = null;
    this.shift = null;
    this.originalMaterials = null;
    this.pIntersect = null;
    this.isEnabled = null;
  }

  onPointerMove = (event) => {
    if (!this.isEnabled || !this.isDragging || !this.dragObject) return; // Check if the tool is enabled and dragging is in progress

    const intersect = this.components.raycaster.castRay();
    if (intersect) {
      this.planeIntersect = intersect.point.add(this.shift);
      this.dragObject.position.copy(this.planeIntersect);
    }
  };

  onPointerUp = (event) => {
    if (!this.isEnabled || !this.isDragging || !this.dragObject) return; // Check if the tool is enabled and dragging is in progress

    this.dragObject.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial();
      }
    });

    if (this.dragObject.name.match(/subprojectId/)) {
      store.dispatch('viewport/setSuprojectPosition', {
        id: parseInt(this.dragObject.name.replace('subprojectId:', '')),
        position: this.dragObject.position,
      });
    }

    this.dragObject = null;
    this.isDragging = false;
    this.components.camera.controls.enabled = true; // Re-enable controls when dragging ends
  };
}

OBC.ToolComponent.libraryUUIDs.add(GroupSelector.uuid);
