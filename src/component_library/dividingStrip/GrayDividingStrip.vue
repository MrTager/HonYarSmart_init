<template>
    <div class="GrayDividingStrip">
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"GrayDividingStrip",
}
</script>
<style lang="scss" scoped>
@mixin text_limit() {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.GrayDividingStrip{
    width: 100%;
    height: 20px;
    background-color: rgba(248, 248, 248, 1);
    box-shadow: 0 0 1px 1px rgb(236, 236, 236);
    margin:1px 0px;
}
</style>