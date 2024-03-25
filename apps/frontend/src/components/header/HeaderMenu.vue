<!-- // Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE -->

<template>
  <header id="top" class="flex flex-col w-full">
    <div v-if="$route.path !== '/view'">
      <fixed-header>
        <FirstHeader />
      </fixed-header>
    </div>
    <div v-else>
      <FirstHeader />
    </div>

    <div
      id="sub-menu"
      class="flex flex-col items-center justify-between w-full px-4 py-1 text-white bg-codearch-700 sm:flex-row sm:px-6"
    >
      <div
        id="menu"
        class="flex-col items-center self-end hidden w-full h-full py-1 pb-4 sm:w-auto sm:self-center sm:flex sm:flex-row sm:py-0 sm:pb-0"
      >
        <router-link
          to="/"
          class="w-full py-1 border-b-2 border-transparent outline-none lg:p-2 hover:border-codearch-400"
          exact-active-class="border-codearch-400"
        >
          Home
        </router-link>
        <router-link
          to="/projects"
          class="w-full py-1 border-b-2 border-transparent outline-none lg:p-2 hover:border-codearch-400"
          active-class="border-codearch-400"
        >
          Project</router-link
        >
        <router-link
          to="/view"
          class="w-full py-1 border-b-2 border-transparent outline-none lg:p-2 hover:border-codearch-400"
          v-if="currentProject && currentProject.id"
          active-class="border-codearch-400"
        >
          View</router-link
        >
        <router-link
          to="/chat"
          class="w-full py-1 border-b-2 border-transparent outline-none lg:p-2 hover:border-codearch-400"
          active-class="border-codearch-400"
        >
          Chat</router-link
        >
        <router-link
          to="/learning"
          class="w-full py-1 border-b-2 border-transparent outline-none lg:p-2 hover:border-codearch-400"
          active-class="border-codearch-400"
        >
          Learning</router-link
        >
      </div>
      <div
        class="flex self-end hidden float-right w-full h-full py-1 pb-4 iterms-end sm:w-auto sm:float-right sm:flex sm:py-0 sm:pb-0"
      ></div>
    </div>
  </header>
</template>

<script>
import FixedHeader from './FixedHeader.vue';
import FirstHeader from './FirstHeader.vue';

export default {
  name: 'header-menu',
  data() {
    return {};
  },
  components: {
    FixedHeader,
    FirstHeader,
  },
  computed: {
    currentProject() {
      return this.$store.state.curproject.theproject;
    },
  },
};
</script>

<style>
.navbar.vue-fixed-header--isFixed {
  position: fixed;
  left: 0;
  top: 0;
}
</style>
