<template>
  <div class="d-flex flex-row align-center ga-2">
    <div
      :class="[
        'text-h6 font-weight-bold',
        isOnSale ? 'text-primary' : 'text-secondary',
      ]"
    >
      {{ formatPrice(currentPrice) }}
    </div>
    <div
      v-if="isOnSale"
      class="text-caption text-decoration-line-through text-disabled"
    >
      {{ formatPrice(originalPrice) }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPrice?: number | null;
  originalPrice?: number | null;
  containerClass?: string;
}>();

const isOnSale = computed(() => {
  return props.originalPrice && props.originalPrice > (props.currentPrice || 0);
});

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return "";
  return `${price.toFixed(2)} $`;
};
</script>
