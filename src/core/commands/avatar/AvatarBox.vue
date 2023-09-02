<template>
  <div class="avatar-box">
    <a-image :width="150" :src="avatar_link" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface AvatarBoxProps {
  prompt: string;
  type: string;
}
const props = withDefaults(defineProps<AvatarBoxProps>(), {});

const avatar_link = ref("");
avatar_link.value = `https://deno-avatar.deno.dev/avatar/${props.prompt}.${props.type}`;
</script>

<style scoped>
.avatar-box {
  margin: 10px 5px;
}
</style>
