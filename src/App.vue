<script setup>
</script>

<template>
  <aside>
    <header>
      <icon name="heart-rate" fill="red"/>
      <h1>Causes of Death</h1>
    </header>
    <hr>

  </aside>
  <main></main>
</template>

<style scoped lang="scss">
$text: white;

aside {
  padding: 30px;
  background-color: #252526;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    margin: 0;
    color: $text;
  }
}

hr {
  border: none;
  border-bottom: 1px solid $text;
  margin: 20px 0 20px 0
}

main {
  flex: 1;
}
</style>
