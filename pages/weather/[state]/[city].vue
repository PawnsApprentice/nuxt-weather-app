<template>
  <div>
    <Suspense>
      <template #default>
        <AsyncCityView />
      </template>
      <template #fallback>
        <CityViewSkeleton />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
const route = useRoute();
const { state, city } = route.params;
</script>

<style scoped></style>
