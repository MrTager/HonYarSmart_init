<template>
    <div class="BlankDividingStrip">
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"BlankDividingStrip",
}
</script>
<style lang="scss" scoped>
@mixin text_limit() {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.BlankDividingStrip{
    width: 100%;
    height: 80px;
}
</style>