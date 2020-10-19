<template>
    <div v-if="warnFlag" class="warning" :class="[{warning_close:warnFlag==false}]">
        <div class="warning_window">
            <div class="warning_title">{{warning_info.title}}</div>
            <img class="warning_img" src="../assets/images/smoke_warn.png">
            <span class="warning_info">{{warning_info.time}}{{'  '}}{{warning_info.content}}</span>
            <div class="warning_confirm" @click="warningClick">确定</div>
        </div>
    </div>
</template>
<script>


export default {
    name:"warning",
    data(){
        return {
            warnFlag:true,
            warning_info:{
                title:"烟雾告警",
                content:"烟雾浓度超标！",
                time:"08:52:00",
            },
        }
    },
    props:['warning_msg'],
    watch:{
        warning_msg:{
            handler:function(newVal, oldVal){
                if(newVal){
                    this.warning_info = newVal
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods:{
        warningClick(event){
            event.stopPropagation()
            setTimeout(()=>{
                this.warnFlag = !this.warnFlag
                this.$emit('warn_confrim')
            },100)
            
        }
    }
}
</script>
<style lang="scss" scoped>
    .warning{
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 888;
        background-color: rgba(0,0,0,0.5);
        animation: show_warning 0.5s 1 ease-in-out;
    }
    .warning_close{
        animation: close_warning 0.5s 1 ease-in-out;
    }
    @keyframes show_warning {
        0% {
            opacity: 0;
        }  
        100% {
            opacity: 1;
        }
    }
    @keyframes close_warning {
        0% {
            opacity: 1;
        }  
        100% {
            opacity: 0;
        }
    }
    .warning_window{
        position: absolute;
        width: 60rem;
        height: 35.2rem;
        border-radius: 2rem;
        background-color: #C10000;
        top: 20.1rem;
        left: calc(50% - 30rem);
    }
    .warning_title{
        position: absolute;
        font-size: 2.8rem;
        width: 100%;
        height: 2.8rem;
        text-align: center;
        top: 3.4rem;
        color: white;
    }
    .warning_img{
        position: absolute;
        width: 10.8rem;
        height: 9.6rem;
        top: 12.7rem;
        left: 11.3rem;
    }
    .warning_info{
        position: absolute;
        font-size: 2.4rem;
        height: 2.4rem;
        width: 28rem;
        top: 16.3rem;
        left: 25.7rem;
        color: white;
        word-wrap:break-word
    }
    .warning_confirm{
        position: absolute;
        width: 14rem;
        height: 6rem;
        border-radius: 3rem;
        background-color: #7C0000;
        font-size: 2.4rem;
        top: 26.4rem;
        left: calc(50% - 7rem);
        color: white;
        text-align: center;
        line-height: 6rem;
    }
    .warning_confirm:active{
        background-color: white;
        color: #7C0000;
    }
</style>