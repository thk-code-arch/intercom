<!-- // Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE -->

<template>
  <div class="grid grid-cols-2 gap-2">
    <div
      class="flex flex-col justify-center h-32 m-2 text-center bg-white rounded"
    >
      Notes
      <router-link to="/profile" />
    </div>
    <div
      class="flex flex-col justify-center h-32 m-2 text-center bg-white rounded"
    >
      News
      <router-link to="/profile" />
    </div>
    <div
      class="flex flex-col justify-center h-32 m-2 text-center bg-white rounded"
    >
      Calendar
      <router-link to="/profile" />
    </div>
    <router-link
      to="/profile"
      class="flex flex-col justify-center h-32 m-2 text-center bg-white rounded"
    >
      Profile Settings
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HomeMenu',
  components: {},
  computed: {},
  mounted() {},
  data() {
    return {};
  },
  methods: {},
};
</script>
