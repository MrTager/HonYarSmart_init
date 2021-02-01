<template>
    <div class="RoundChick" :class="{'open':state == 1,'close':state == 0}" @click="change()">
    </div>
</template>
<script>
/**
 * 圆形电源开关组件
 */
import Honyar from "@/utils/WebAPI";

export default {
    name:"RoundChick",
    props:[
        "enable"
    ],
    data(){
        return {
            open:"",
            close:"",
            now_icon:"",
            state:this.enable,
        }
    },
    methods:{
        change(){
            this.state == 0 ? this.state = 1 : this.state = 0;
            this.state == 0 ? this.$set(this,"now_icon",this.close) : this.$set(this,"now_icon",this.open);
            this.$emit("event",this.state)
        }
    },
    mounted(){
        
    },
    created(){
    }
}
</script>
<style lang="scss" scoped>
@mixin text_limit() {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.RoundChick{
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 19px;
}
.open{
    background-image: url('../../assets/images/icon/button/roundChick_on.png');
    background-size: 38px 38px;
}
.close{
    background-image: url('../../assets/images/icon/button/roundChick_off.png');
    background-size: 38px 38px;
}

</style>