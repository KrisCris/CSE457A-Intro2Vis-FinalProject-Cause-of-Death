<script setup>
const src = `${import.meta.env.BASE_URL}Documents/ProcessBook.html`;
</script>

<template>
  <iframe :src="src" frameborder="0"></iframe>
</template>

<style scoped lang="scss">
iframe {
  width: 100%;
  height: 100%;
}
</style>
