<template>
  <div ref="container" class="full-screen"></div>
</template>

<script>
import * as THREE from 'three';
import * as OBC from 'openbim-components';
import * as WEBIFC from 'web-ifc';
import projectHeader from '../../services/project-header';

export default {
  name: 'PreviewIfc',
  data() {
    return {
      components: null,
      fragmentIfcLoader: null,
      fragments: null,
      settings: {
        loadFragments: this.loadIfcAsFragments,
        disposeFragments: this.disposeFragments,
      },
      mainToolbar: null,
      scene: null,
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.dispose();
  },
  methods: {
    async init() {
      const container = this.$refs.container;

      this.components = new OBC.Components();
      this.components.scene = new OBC.SimpleScene(this.components);
      this.components.renderer = new OBC.PostproductionRenderer(
        this.components,
        container,
      );
      this.components.camera = new OBC.SimpleCamera(this.components);
      this.components.raycaster = new OBC.SimpleRaycaster(this.components);

      this.components.init();
      this.components.renderer.postproduction.enabled = true;

      this.scene = this.components.scene.get();

      this.components.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
      this.components.scene.setup();

      this.scene.background = new THREE.Color('#eeeeee');

      this.fragments = new OBC.FragmentManager(this.components);
      this.fragmentIfcLoader = new OBC.FragmentIfcLoader(this.components);

      await this.fragmentIfcLoader.setup();

      const excludedCats = [
        WEBIFC.IFCTENDONANCHOR,
        WEBIFC.IFCREINFORCINGBAR,
        WEBIFC.IFCTENFORCINGELEMENT,
      ];

      for (const cat of excludedCats) {
        this.fragmentIfcLoader.settings.excludedCategories.add(cat);
      }

      this.fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
      this.fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

      const mainToolbar = new OBC.Toolbar(this.components, {
        name: 'Main Toolbar',
        position: 'bottom',
      });
      this.components.ui.addToolbar(mainToolbar);
      const ifcButton = this.fragmentIfcLoader.uiElement.get('main');

      const uploadToServerButton = new OBC.Button(this.components);
      uploadToServerButton.materialIcon = 'upload';
      uploadToServerButton.tooltip = 'Upload fragments to server';

      uploadToServerButton.onClick.add(this.uploadFragments);

      mainToolbar.addChild(ifcButton);
      mainToolbar.addChild(uploadToServerButton);
      this.mainToolbar = mainToolbar;
    },

    dispose() {
      this.components.dispose();
    },

    async uploadFragments() {
      if (!this.fragments.groups.length) return;

      const group = this.fragments.groups[0];
      const data = this.fragments.export(group);
      const blob = new Blob([data]);
      const fragmentFile = new File([blob], 'small.frag');

      const formData = new FormData();
      formData.append('file', fragmentFile);

      try {
        const response = await this.$http.post(
          `/project/uploadifc/${projectHeader()}`,
          formData,
        );
        this.$notify({
          title: 'Yay, all done!',
          text: response.data.log,
          group: 'info',
          duration: 7000,
        });
      } catch (error) {
        this.$notify({
          title: 'Ooops...',
          text:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
          group: 'error',
        });
      }
    },
  },
};
</script>

<style scoped>
.full-screen {
  width: 100%;
  height: 100%;
}
</style>
