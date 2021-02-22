<template>
    <div class="TimeSelect">
        <div v-if="setType == 1" class="TimeSelect_timer_Container">
            <div class="TimeSelect_timer_Container_hour" >
                <div class="TimeSelect_hour_txt">时</div>
                <ul class="TimeSelect_hour_ul"  ref="TimeSelect_hour_ul">
                    <!-- <div class="TimeSelect_hour_txt">时</div> -->
                    <li class="TimeSelect_hour_li" v-for="(item,i) in timer_hour" :key="i" >
                    {{item}}
                    </li>
                </ul>
            </div>
            <div class="TimeSelect_timer_Container_minute">
            <div class="TimeSelect_minute_txt">分</div>
                <ul class="TimeSelect_minute_ul" ref="TimeSelect_minute_ul">
                    <li class="TimeSelect_minute_li" v-for="(item,i) in timer_minute" :key="i">
                    {{item}}
                    </li>
                </ul>
            </div>
            <div class="TimeSelect_cover"></div>
            <div class="TimeSelect_cover_line"></div>
            <div></div>
        </div>
        <div v-if="setType == 0" class="TimeSelect_countDown_Container">
            <div class="TimeSelect_countDown_Container_hour">
            <div class="TimeSelect_hour_txt">时</div>
                <ul class="TimeSelect_hour_ul" ref="TimeSelect_hour_ul_count">
                    <li class="TimeSelect_hour_li" v-for="(item,i) in countDown_hour" :key="i" >
                    {{item}}
                    </li>
                </ul>
            </div>
            <div class="TimeSelect_countDown_Container_minute">
            <div class="TimeSelect_minute_txt">分</div>
                <ul class="TimeSelect_minute_ul" ref="TimeSelect_minute_ul_count">
                    <li class="TimeSelect_minute_li" v-for="(item,i) in timer_minute" :key="i">
                    {{item}}
                    </li>
                </ul>
            </div>
            <div class="TimeSelect_countDown_Container_second">
                <ul class="TimeSelect_minute_ul" ref="TimeSelect_second_ul_count">
                    <li class="TimeSelect_minute_li" v-for="(item,i) in timer_second" :key="i">
                    {{item}}
                    </li>
                </ul>
            </div>
            <div class="TimeSelect_cover"></div>
            <div class="TimeSelect_cover_line"></div>
            <div class="TimeSelect_second_txt">秒</div>
        </div>
    </div>
</template>
<script>
/**
 * 底部按钮开关组件
 */
import Honyar from "@/utils/WebAPI";

const aspect_ratio = Number(window.screen.width)/750

export default {
    name:"SelectPanel",
    props: ['setTypes','chooseCloudHour','chooseCloudMin'],
    watch:{
        setTypes:{
            handler(newVal, oldVal) {
            console.log("类型传值",newVal)
            var _this = this;
            if(newVal !== undefined){
            this.setType = Number(newVal);
            setTimeout(function(){
                _this.initSelectPanel();
                _this.startAddListen(); 
            },250)
            }
            },
            immediate: true,
            deep:true,
        },
        chooseCloudHour:{
            immediate: true,
            deep:true,
            handler(newVal, oldVal) {
                console.log("监听传值1",newVal,oldVal)
                var _this = this;
                if(newVal !== undefined){
                    this.timer_hour_num = newVal;
                    this.$nextTick(()=>{
                    this.initSelectPanel()
                    })
                }
                
            },
            
        },
        chooseCloudMin:{
            immediate: true,
            deep:true,
            handler(newVal, oldVal) {
                console.log("监听传值2",newVal,oldVal)
                if(newVal !== undefined){
                    this.timer_minute_num = newVal;
                    this.$nextTick(()=>{
                    this.initSelectPanel()
                    })
                }
            },
        }
    },
    data() {
        return {
            aspect_ratio:0,
            setHour:1,
            setMin:20,
            setSec:20,
            setType:0,//0为倒计时，1为定时
            countDown_hour:[null,null,'00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23',null,null],
            timer_hour:[null,null,'00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23',null,null],
            timer_minute:[null,null,'00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59',null,null],
            timer_second:[null,null,'00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59',null,null],
            timer_hour_finger: {
                liHeight:483/5*aspect_ratio,
                startY: 0,
                startScroll:0,
                moveY:0,
                nowY:0,
                endY: 0,
                startTime: 0, // 开始滑动时间（单位：毫秒）
                entTime: 0, // 结束滑动时间（单位：毫秒）
                currentMove: 0,
                prevMove: 0,
            },
            timer_minute_finger:{
                liHeight:483/5*aspect_ratio,
                startY: 0,
                startScroll:0,
                moveY:0,
                nowY:0,
                endY: 0,
                startTime: 0, // 开始滑动时间（单位：毫秒）
                entTime: 0, // 结束滑动时间（单位：毫秒）
                currentMove: 0,
                prevMove: 0,
            },
            count_hour_finger:{
                liHeight:483/5*aspect_ratio,
                startY: 0,
                startScroll:0,
                moveY:0,
                nowY:0,
                endY: 0,
                startTime: 0, // 开始滑动时间（单位：毫秒）
                entTime: 0, // 结束滑动时间（单位：毫秒）
                currentMove: 0,
                prevMove: 0,
            },
            count_minute_finger:{
                liHeight:483/5*aspect_ratio,
                startY: 0,
                startScroll:0,
                moveY:0,
                nowY:0,
                endY: 0,
                startTime: 0, // 开始滑动时间（单位：毫秒）
                entTime: 0, // 结束滑动时间（单位：毫秒）
                currentMove: 0,
                prevMove: 0,
            },
            count_second_finger:{
                liHeight:483/5*aspect_ratio,
                startY: 0,
                startScroll:0,
                moveY:0,
                nowY:0,
                endY: 0,
                startTime: 0, // 开始滑动时间（单位：毫秒）
                entTime: 0, // 结束滑动时间（单位：毫秒）
                currentMove: 0,
                prevMove: 0,
            },
            timer_hour_num:5,
            timer_minute_num:25,
            count_hour_num:0,
            count_minute_num:0,
            count_second_num:0,
            range: {
                
            },
            
        }
    },
    computed: {
    
        
    },
    mounted() {
        let _this = this;
        // if(_this.setType == 1){
        //     this.$nextTick(()=>{
        //         console.log("初始化时间",this.timer_hour_num,this.timer_minute_num)
        //         console.log("卷起高度",this.timer_hour_num*this.timer_hour_finger.liHeight)
        //         this.$refs.TimeSelect_hour_ul.scrollTop = this.timer_hour_num*this.timer_hour_finger.liHeight;
        //         _this.$emit('selectTimeHour',_this.timer_hour_num);
        //         this.$refs.TimeSelect_minute_ul.scrollTop = this.timer_minute_num*this.timer_minute_finger.liHeight;
        //         _this.$emit('selectTimeMin',_this.timer_minute_num);
        //     })
        // }
        this.$nextTick(()=>{
            _this.initSelectPanel()
        })
        
    },
    beforeDestory() {
        if(this.setType == 1){
            this.$refs.TimeSelect_hour_ul.removeEventListener('touchstart', this.listenerTouchStart, false);
            this.$refs.TimeSelect_hour_ul.removeEventListener('touchmove', this.listenerTouchMove, false);
            this.$refs.TimeSelect_hour_ul.removeEventListener('touchend', this.listenerTouchEnd, false);
            this.$refs.TimeSelect_minute_ul.removeEventListener('touchstart', this.listenerTimeSelect_minute_Start, false);
            this.$refs.TimeSelect_minute_ul.removeEventListener('touchmove', this.listenerTimeSelect_minute_Move, false);
            this.$refs.TimeSelect_minute_ul.removeEventListener('touchend', this.listenerTimeSelect_minute_End, false);
        }else{
            this.$refs.TimeSelect_hour_ul_count.removeEventListener('touchstart', this.listenerCount_hour_start, false);
            this.$refs.TimeSelect_hour_ul_count.removeEventListener('touchmove', this.listenerCount_hour_move, false);
            this.$refs.TimeSelect_hour_ul_count.removeEventListener('touchend', this.listenerCount_hour_end, false);

            this.$refs.TimeSelect_minute_ul_count.removeEventListener('touchstart', this.listenerCount_minute_start, false);
            this.$refs.TimeSelect_minute_ul_count.removeEventListener('touchmove', this.listenerCount_minute_move, false);
            this.$refs.TimeSelect_minute_ul_count.removeEventListener('touchend', this.listenerCount_minute_end, false);

            this.$refs.TimeSelect_second_ul_count.removeEventListener('touchstart', this.listenerCount_second_start, false);
            this.$refs.TimeSelect_second_ul_count.removeEventListener('touchmove', this.listenerCount_second_move, false);
            this.$refs.TimeSelect_second_ul_count.removeEventListener('touchend', this.listenerCount_second_end, false);
        }
        
    },
    methods: {
        initSelectPanel(){
            let _this = this;
            if(_this.setType == 1){
                this.$refs.TimeSelect_hour_ul.scrollTop = this.timer_hour_num*this.timer_hour_finger.liHeight;
                _this.$emit('selectTimeHour',_this.timer_hour_num);
                this.$refs.TimeSelect_minute_ul.scrollTop = this.timer_minute_num*this.timer_minute_finger.liHeight;
                _this.$emit('selectTimeMin',_this.timer_minute_num);
            }
        },
        startAddListen(){
            if(this.setType == 1){
                this.$refs.TimeSelect_hour_ul.addEventListener('touchstart', this.listenerTouchStart, false);
                this.$refs.TimeSelect_hour_ul.addEventListener('touchmove', this.listenerTouchMove, false);
                this.$refs.TimeSelect_hour_ul.addEventListener('touchend', this.listenerTouchEnd, false);
                this.$refs.TimeSelect_minute_ul.addEventListener('touchstart', this.listenerTimeSelect_minute_Start, false);
                this.$refs.TimeSelect_minute_ul.addEventListener('touchmove', this.listenerTimeSelect_minute_Move, false);
                this.$refs.TimeSelect_minute_ul.addEventListener('touchend', this.listenerTimeSelect_minute_End, false);
            }else{
                this.$refs.TimeSelect_hour_ul_count.addEventListener('touchstart', this.listenerCount_hour_start, false);
                this.$refs.TimeSelect_hour_ul_count.addEventListener('touchmove', this.listenerCount_hour_move, false);
                this.$refs.TimeSelect_hour_ul_count.addEventListener('touchend', this.listenerCount_hour_end, false);

                this.$refs.TimeSelect_minute_ul_count.addEventListener('touchstart', this.listenerCount_minute_start, false);
                this.$refs.TimeSelect_minute_ul_count.addEventListener('touchmove', this.listenerCount_minute_move, false);
                this.$refs.TimeSelect_minute_ul_count.addEventListener('touchend', this.listenerCount_minute_end, false);

                this.$refs.TimeSelect_second_ul_count.addEventListener('touchstart', this.listenerCount_second_start, false);
                this.$refs.TimeSelect_second_ul_count.addEventListener('touchmove', this.listenerCount_second_move, false);
                this.$refs.TimeSelect_second_ul_count.addEventListener('touchend', this.listenerCount_second_end, false);
            }
        },


        listenerTouchStart(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            this.timer_hour_finger.startY = ev.targetTouches[0].pageY;
            this.timer_hour_finger.moveY = ev.targetTouches[0].pageY;
            this.timer_hour_finger.startScroll = ev.target.scrollTop;
        },
        listenerTouchMove(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            this.timer_hour_finger.nowY = ev.targetTouches[0].pageY;
            var m = this.timer_hour_finger.nowY - this.timer_hour_finger.moveY;
            this.timer_hour_finger.moveY = this.timer_hour_finger.nowY;
            var m2 = this.timer_hour_finger.nowY - this.timer_hour_finger.startY;
            this.$refs.TimeSelect_hour_ul.scrollTop += m*-1
            // console.log('正在滑动',this.$refs.TimeSelect_hour_ul.scrollTop += m*-1)
        },
        listenerTouchEnd(ev) {
            var _this = this;
            ev.stopPropagation();
            ev.preventDefault();
            // this.finger.endY = ev.targetTouches[0].pageY;
            
            //console.log('滑动结束',this.$refs.TimeSelect_hour_ul.scrollTop)
            var scrollT = this.$refs.TimeSelect_hour_ul.scrollTop;
            var indexLength = parseInt(scrollT/this.timer_hour_finger.liHeight);
            //多余的距离
            var overLength = Number(scrollT)%Number(this.timer_hour_finger.liHeight);
            if(overLength < 25){
            var int_1 =   setInterval(function(){
                _this.$refs.TimeSelect_hour_ul.scrollTop = indexLength*_this.timer_hour_finger.liHeight;
                setTimeout(function(){
                    clearInterval(int_1)
                },100)
            },10)
            _this.timer_hour_num = indexLength;
            _this.$emit('selectTimeHour',_this.timer_hour_num);
            }else{
            var int_2 =   setInterval(function(){
                _this.$refs.TimeSelect_hour_ul.scrollTop = (indexLength+1)*_this.timer_hour_finger.liHeight;
                setTimeout(function(){
                    clearInterval(int_2)
                },100)
            },10)
            _this.timer_hour_num = indexLength+1;
            _this.$emit('selectTimeHour',_this.timer_hour_num);
            }
            
        },



        listenerTimeSelect_minute_Start(ev){
            ev.stopPropagation();
            ev.preventDefault();

            this.timer_minute_finger.startY = ev.targetTouches[0].pageY;
            this.timer_minute_finger.moveY = ev.targetTouches[0].pageY;
            this.timer_minute_finger.startScroll = ev.target.scrollTop;
        },
        listenerTimeSelect_minute_Move(ev){
            ev.stopPropagation();
            ev.preventDefault();
            this.timer_minute_finger.nowY = ev.targetTouches[0].pageY;
            var m = this.timer_minute_finger.nowY - this.timer_minute_finger.moveY;
            this.timer_minute_finger.moveY = this.timer_minute_finger.nowY;
            var m2 = this.timer_minute_finger.nowY - this.timer_minute_finger.startY;
            this.$refs.TimeSelect_minute_ul.scrollTop += m*-1
        },
        listenerTimeSelect_minute_End(ev){
            var _this = this;
            ev.stopPropagation();
            ev.preventDefault();
            // this.finger.endY = ev.targetTouches[0].pageY;
            
            //console.log('滑动结束',this.$refs.TimeSelect_hour_ul.scrollTop)
            var scrollT = this.$refs.TimeSelect_minute_ul.scrollTop;
            var indexLength = parseInt(scrollT/this.timer_minute_finger.liHeight);
            //多余的距离
            var overLength = Number(scrollT)%Number(this.timer_minute_finger.liHeight);
            if(overLength < 25){
            var int_1 =   setInterval(function(){
                _this.$refs.TimeSelect_minute_ul.scrollTop = indexLength*_this.timer_minute_finger.liHeight ;
                setTimeout(function(){
                    clearInterval(int_1)
                },100)
            },10)
            _this.timer_minute_num = indexLength;
            _this.$emit('selectTimeMin',_this.timer_minute_num);
            }else{
            var int_2 =   setInterval(function(){
                _this.$refs.TimeSelect_minute_ul.scrollTop = (indexLength+1)*_this.timer_minute_finger.liHeight;
                setTimeout(function(){
                    clearInterval(int_2)
                },100)
            },10)
            _this.timer_minute_num = indexLength+1;
            _this.$emit('selectTimeMin',_this.timer_minute_num);
            }
        },





        listenerCount_hour_start(ev){
            ev.stopPropagation();
            ev.preventDefault();

            this.count_hour_finger.startY = ev.targetTouches[0].pageY;
            this.count_hour_finger.moveY = ev.targetTouches[0].pageY;
            this.count_hour_finger.startScroll = ev.target.scrollTop;
        },
        listenerCount_hour_move(ev){
            ev.stopPropagation();
            ev.preventDefault();
            this.count_hour_finger.nowY = ev.targetTouches[0].pageY;
            var m = this.count_hour_finger.nowY - this.count_hour_finger.moveY;
            this.count_hour_finger.moveY = this.count_hour_finger.nowY;
            var m2 = this.count_hour_finger.nowY - this.count_hour_finger.startY;
            this.$refs.TimeSelect_hour_ul_count.scrollTop += m*-1
        },
        listenerCount_hour_end(ev){
            var _this = this;
            ev.stopPropagation();
            ev.preventDefault();
            // this.finger.endY = ev.targetTouches[0].pageY;
            
            //console.log('滑动结束',this.$refs.TimeSelect_hour_ul.scrollTop)
            var scrollT = this.$refs.TimeSelect_hour_ul_count.scrollTop;
            var indexLength = parseInt(scrollT/this.count_hour_finger.liHeight);
            //多余的距离
            var overLength = Number(scrollT)%Number(this.count_hour_finger.liHeight);
            if(overLength < 25){
                var int_1 =   setInterval(function(){
                    _this.$refs.TimeSelect_hour_ul_count.scrollTop = indexLength*_this.count_hour_finger.liHeight ;
                    setTimeout(function(){
                        clearInterval(int_1)
                    },100)
                },10)
                _this.count_hour_num = indexLength;
                _this.$emit('selectHour',_this.count_hour_num);
            }else{
                var int_2 =   setInterval(function(){
                    _this.$refs.TimeSelect_hour_ul_count.scrollTop = (indexLength+1)*_this.count_hour_finger.liHeight;
                    setTimeout(function(){
                        clearInterval(int_2)
                    },100)
                },10)
                _this.count_hour_num = indexLength+1;
                _this.$emit('selectHour',_this.count_hour_num);
            }
        },


        listenerCount_minute_start(ev){
            ev.stopPropagation();
            ev.preventDefault();

            this.count_minute_finger.startY = ev.targetTouches[0].pageY;
            this.count_minute_finger.moveY = ev.targetTouches[0].pageY;
            this.count_minute_finger.startScroll = ev.target.scrollTop;
        },
        listenerCount_minute_move(ev){
            ev.stopPropagation();
            ev.preventDefault();
            this.count_minute_finger.nowY = ev.targetTouches[0].pageY;
            var m = this.count_minute_finger.nowY - this.count_minute_finger.moveY;
            this.count_minute_finger.moveY = this.count_minute_finger.nowY;
            var m2 = this.count_minute_finger.nowY - this.count_minute_finger.startY;
            this.$refs.TimeSelect_minute_ul_count.scrollTop += m*-1
        },
        listenerCount_minute_end(ev){
            var _this = this;
            ev.stopPropagation();
            ev.preventDefault();
            // this.finger.endY = ev.targetTouches[0].pageY;
            
            //console.log('滑动结束',this.$refs.TimeSelect_hour_ul.scrollTop)
            var scrollT = this.$refs.TimeSelect_minute_ul_count.scrollTop;
            var indexLength = parseInt(scrollT/this.count_minute_finger.liHeight);
            //多余的距离
            var overLength = Number(scrollT)%Number(this.count_minute_finger.liHeight);
            if(overLength < 25){
                var int_1 =   setInterval(function(){
                    _this.$refs.TimeSelect_minute_ul_count.scrollTop = indexLength*_this.count_minute_finger.liHeight ;
                    setTimeout(function(){
                        clearInterval(int_1)
                    },100)
                },10)
                _this.count_minute_num = indexLength;
                _this.$emit('selectMinute',_this.count_minute_num);
            }else{
                var int_2 =   setInterval(function(){
                    _this.$refs.TimeSelect_minute_ul_count.scrollTop = (indexLength+1)*_this.count_minute_finger.liHeight;
                    setTimeout(function(){
                        clearInterval(int_2)
                    },100)
                },10)
                _this.count_minute_num = indexLength+1;
                _this.$emit('selectMinute',_this.count_minute_num);
            }
        },


        listenerCount_second_start(ev){
            ev.stopPropagation();
            ev.preventDefault();
            this.count_second_finger.startY = ev.targetTouches[0].pageY;
            this.count_second_finger.moveY = ev.targetTouches[0].pageY;
            this.count_second_finger.startScroll = ev.target.scrollTop;
        },
        listenerCount_second_move(ev){
            ev.stopPropagation();
            ev.preventDefault();
            this.count_second_finger.nowY = ev.targetTouches[0].pageY;
            var m = this.count_second_finger.nowY - this.count_second_finger.moveY;
            this.count_second_finger.moveY = this.count_second_finger.nowY;
            var m2 = this.count_second_finger.nowY - this.count_second_finger.startY;
            this.$refs.TimeSelect_second_ul_count.scrollTop += m*-1
        },
        listenerCount_second_end(ev){
            var _this = this;
            ev.stopPropagation();
            ev.preventDefault();
            // this.finger.endY = ev.targetTouches[0].pageY;
            
            //console.log('滑动结束',this.$refs.TimeSelect_hour_ul.scrollTop)
            var scrollT = this.$refs.TimeSelect_second_ul_count.scrollTop;
            var indexLength = parseInt(scrollT/this.count_second_finger.liHeight);
            //多余的距离
            var overLength = Number(scrollT)%Number(this.count_second_finger.liHeight);
            if(overLength < 25){
                var int_1 =   setInterval(function(){
                    _this.$refs.TimeSelect_second_ul_count.scrollTop = indexLength*_this.count_second_finger.liHeight ;
                    setTimeout(function(){
                        clearInterval(int_1)
                    },100)
                },10)
                _this.count_second_num = indexLength;
                _this.$emit('selectSecond',_this.count_second_num)
            }else{
                var int_2 =   setInterval(function(){
                    _this.$refs.TimeSelect_second_ul_count.scrollTop = (indexLength+1)*_this.count_second_finger.liHeight;
                    setTimeout(function(){
                        clearInterval(int_2)
                    },100)
                },10)
                _this.count_second_num = indexLength+1;
                _this.$emit('selectSecond',_this.count_second_num)
            }
        },

        /**
         * 求移动速度（v = s / t），判断用户操作快慢，从而得到惯性的滑动距离
         */
        getInertiaDistance() {

        },
        //设置时间
        setHourAction(){

        },
        setMinAction(){}     
    },

    created(){
        let _this = this;
        let s_width = Number(window.screen.width);
        _this.aspect_ratio = s_width/750
    }
}
</script>
<style lang="scss" scoped>
$TimeSelectHeight:483px;
@mixin text_limit() {
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
@mixin text_css($height,$size,$color) {
    height: $height;
    line-height: $height;
    font-size: $size;
    vertical-align: middle;
    color: $color;
  }
// .Select_panel{
//     position: relative;
// 	width: 100%;
// 	height: 483px;
// 	background-color: burlywood;
// }
//时间滚动容器
.TimeSelect{
    position: relative;
	width: 100%;
	height: $TimeSelectHeight;
    background-color: white;
    &_timer_Container{
        position: absolute;
        width: 300px;
        height: $TimeSelectHeight;
        left: calc(50% - 150px);
    }
    &_timer_Container_hour{
        position: absolute;
        width: 150px;
        height: $TimeSelectHeight;
        left: 0;
        overflow: hidden;
        text-align: center;
    }
    &_timer_Container_minute{
        position: absolute;
        width: 150px;
        height: $TimeSelectHeight;
        right: 0;
        overflow: hidden;
        text-align: center;
    }
    &_hour_ul,&_minute_ul{
        position: absolute;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        
    }
    &_hour_li,&_minute_li{
        width: 100%;
        height:$TimeSelectHeight / 5;
        color: #333333;
        line-height: $TimeSelectHeight / 5;
        font-size: 35px;
    }
    &_countDown_Container{
        position: absolute;
        width: 450px;
        height: $TimeSelectHeight;
        left: calc(50% - 225px);
    }
    &_countDown_Container_hour{
        position: absolute;
        width: 150px;
        height: $TimeSelectHeight;
        left: 0;
        overflow: hidden;
        text-align: center;
    }
    &_countDown_Container_minute{
        position: absolute;
        width: 150px;
        height: $TimeSelectHeight;
        left: 150px;
        overflow: hidden;
        text-align: center;
    }
    &_countDown_Container_second{
        position: absolute;
        width: 150px;
        height: $TimeSelectHeight;
        right: 0;
        overflow: hidden;
        text-align: center;
    }
    &_cover{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(180deg,rgba(255, 255, 255, .95),rgba(255,255,255,.6)),linear-gradient(0deg,rgba(255,255,255,.95),rgba(255,255,255,.6));
        background-position: top,bottom;
        background-repeat: no-repeat;
        background-size: 100% 200px;
        pointer-events: none;
    }
    ::-webkit-scrollbar {
        /*隐藏滚轮*/
        display: none;
    }

    &_cover_line{
        position: absolute;
        width: 100%;
        left: 0;
        border-top: 1px solid #cccccc;
        border-bottom: 1px solid #cccccc;
        top: 200px;
        height: 80px;
        pointer-events: none;
    }
    &_hour_txt,&_minute_txt,&_second_txt{
        position: absolute;
        width: 14px;
        height: 14px;
        font-size: 14px;
        right: 10px;
        top: 230px;
        color: black;
    }
    &_countDown_num{
        position: absolute;
        width: 100%;
        @include text_css(50px,50px,#333333);
        text-align: center;
        top: 102px;
    }
}
ul, li{
    list-style: none;
    padding: 0;
    margin: 0;
}
</style>