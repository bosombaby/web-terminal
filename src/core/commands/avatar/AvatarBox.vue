<template>
  <div class="avatar-box">
    <a-image :width="150" :src="avatar_link" />
    <!-- <a-button ghost :size="small" 
      >下载</a-button
    > -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DownloadOutlined } from "@ant-design/icons-vue";
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 5px;
}
.avatar-box :deep(.ant-btn) {
  max-width: 80px;
}
</style>
