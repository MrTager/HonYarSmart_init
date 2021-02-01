<template>
    <div class="TimeSelect">
        <!-- <div class="hour">
            <Select-Item></Select-Item>
        </div> -->
        <SelectPanel></SelectPanel>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";
import SelectItem from "./component/Select_item"
import SelectPanel from "./component/SelectPanel"


export default {
    name:"TimeSelect",
    props:[
    ],
    data(){
        return {
            aspect_ratio:0,
        }
	},
	components:{
        "Select-Item":SelectItem,
        "SelectPanel":SelectPanel
	},
    methods:{

    },
    mounted(){
        let _this = this;

    },
    created(){
        let _this = this;
        let s_width = Number(window.screen.width);
        _this.aspect_ratio = s_width/750
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
.TimeSelect{
    position: relative;
	width: 100%;
	height: 483px;
//	background-color: burlywood;

}
.hour{
    position: absolute;
    width: 200px;
    height: 100%;
}
</style>