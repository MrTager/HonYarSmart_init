<template>
    <div class="ListModal">
        <div class="model_panel">
            <div class="model_panel_header">
                <div class="cancel" @click="cancel">取消</div>
                <div class="title">{{titleName}}</div>
                <div class="confirm" @click="confirm">确定</div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";
import { ListItemChick,ListItemValue } from "@/component_library"

export default {
    name:"ListModal",
    components:{
        "List-Item-Chick":ListItemChick,
        "List-Item-Value":ListItemValue
    },
    props:[
        "title"
    ],
    data(){
        return {
            titleName:this.title
        }
    },
    methods:{
        cancel(){
            this.$emit("cancel")
        },
        confirm(){
            this.$emit("confirm")
        }
    },
    created(){
        let _this = this;
    },
    destroyed(){
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
.ListModal{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    background-color: rgba(0,0,0,0.5);
    z-index: 990;
    pointer-events:auto;
    animation:createModal 0.3s 1;
	/*Safari 和 Chrome:*/
	-webkit-animation:createModal 0.3s 1;
}
.model_panel{
    position: absolute;
    width: 700px;
    border-radius: 20px;
    background-color: white;
    bottom: 30px;
    left: calc(50% - 350px);
    overflow: hidden;
    animation:create 0.3s 1;
	/*Safari 和 Chrome:*/
	-webkit-animation:create 0.3s 1;
    &_header{
        position: relative;
        width: 100%;
        height: 50px;
        margin: 30px 0px;
        top: 0px;
        .cancel{
            position: absolute;
            width: 80px;
            height: 100%;
            line-height: 100%;
            left: 40px;
            font-size: 34px;
            color: rgba(102, 102, 102, 1);
        }
        .confirm{
            position: absolute;
            width: 80px;
            height: 100%;
            line-height: 100%;
            right: 40px;
            font-size: 34px;
            color: rgba(0, 208, 186, 1);
        }
        .title{
            position: absolute;
            width: 400px;
            height: 100%;
            line-height: 100%;
            left: calc(50% - 200px);
            text-align: center;
            font-size: 34px;
            color: black;
            @include text_limit();
        }
    }
}
@keyframes createModal
{
	from {background-color: rgba(0,0,0,0);}
	to { background-color: rgba(0,0,0,0.5);}
}

/*Safari 和 Chrome:*/
@-webkit-keyframes createModal
{
	from {background-color: rgba(0,0,0,0);}
	to { background-color: rgba(0,0,0,0.5);}
}
@keyframes removeModal
{
	from {background-color: rgba(0,0,0,0.5);}
	to { background-color: rgba(0,0,0,0);}
}

/*Safari 和 Chrome:*/
@-webkit-keyframes removeModal
{
	from {background-color: rgba(0,0,0,0.5);}
	to { background-color: rgba(0,0,0,0);}
}
@keyframes create
{
	from {bottom: -100vh}
	to { bottom: 30px;}
}

/*Safari 和 Chrome:*/
@-webkit-keyframes create
{
	from {bottom: -100vh}
	to { bottom: 30px;}
}
@keyframes remove
{
	from {bottom: 30px}
	to { bottom: -100vh;}
}

/*Safari 和 Chrome:*/
@-webkit-keyframes remove
{
	from {bottom: 30px}
	to { bottom: -100vh;}
}
</style>