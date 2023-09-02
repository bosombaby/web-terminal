<template>
  <div>关于本站：web-terminal 极客范儿的浏览器主页</div>
  <div>
    <a href="https://github.com/bosombaby/web-terminal" target="_blank">
      代码开源，欢迎 star 和贡献~
    </a>
  </div>
  <div></div>
  <div>
    作者：
    <a href="https://resume.vrteam.top/" target="_blank"> bosom </a>
  </div>
</template>

<script setup lang="ts">
interface InfoBoxProps {
  seconds: string;
  name: string;
}

const props = withDefaults(defineProps<InfoBoxProps>(), {});
</script>

<style scoped></style>
