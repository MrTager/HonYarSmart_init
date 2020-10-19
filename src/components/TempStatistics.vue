<template>
    <div  class="tempStatistics" >
    <div class="line-chart unselectable">
    <svg :viewBox="`0 0 ${110*mul} ${10*mul}`" version="1.1">
      <defs>
        <circle id="circle"  cx="0" cy="0" :r="`${0.1*mul}`"></circle>
        <filter x="-37.5%" y="-37.5%" width="175.0%" height="175.0%" filterUnits="objectBoundingBox" id="filter">
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
          <feGaussianBlur stdDeviation="2.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
          <!-- <rect :width="`${4*mul}`" height="20" x="0" y='120' style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />; -->
        </filter>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />  
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        </linearGradient>
        <rect id="react" :width="`${4.5*mul}`" :height="`${1*mul}`" :rx="`${0.4*mul}`" />
        <rect id="react_two" :width="`${4.5*mul}`" :height="`${1*mul}`" :rx="`${0.25*mul}`" style="fill:rgb(55,55,55);stroke-width:0;stroke:rgb(0,0,0)" />
        <!-- style="fill:rgb(50,211,73);stroke-width:0;stroke:rgb(0,0,0)"  -->
      </defs>
      <g stroke="none" :stroke-width="`${0.05*mul}`" fill="none" fill-rule="evenodd">
        <g :transform="`translate(-${3.2*mul}.000000, -${25.2*mul}.000000)`">
          <g :transform="`translate(${3.2*mul}.000000, ${25.2*mul}.000000)`">
            <!-- <g transform="translate(0.000000, 60.000000)" fill="#ECECEC"> -->
              <!-- <rect transform="translate(28.000000, 123.500000) rotate(-270.000000) translate(-28.000000, -123.500000) " x="-94" y="123" width="244" height="1"></rect>
              <rect transform="translate(142.000000, 123.500000) rotate(-270.000000) translate(-142.000000, -123.500000) " x="20" y="123" width="244" height="1"></rect>
              <rect transform="translate(255.000000, 123.500000) rotate(-270.000000) translate(-255.000000, -123.500000) " x="133" y="123" width="244" height="1"></rect>
              <rect transform="translate(369.000000, 123.500000) rotate(-270.000000) translate(-369.000000, -123.500000) " x="247" y="123" width="244" height="1"></rect>
              <rect transform="translate(482.000000, 123.500000) rotate(-270.000000) translate(-482.000000, -123.500000) " x="360" y="123" width="244" height="1"></rect>
              <rect transform="translate(595.000000, 123.500000) rotate(-270.000000) translate(-595.000000, -123.500000) " x="473" y="123" width="244" height="1"></rect>
              <rect transform="translate(311.500000, 123.500000) scale(1, -1) translate(-311.500000, -123.500000) " x="28" y="123" width="567" height="1"></rect>
              <rect x="0" y="61" width="622" height="1"></rect>
              <rect x="0" y="183" width="622" height="1"></rect> -->
            <!-- </g> -->
            <g id="line" :transform="'translate(0,'+`${mul*1}`+'.000000)'">
              <path :d="path"  stroke="#47E0FF" :stroke-width="`${0.1*mul}`"  stroke-linecap="round" transform="translate(1)"></path>
              <g :transform="'translate(' + value.x + ',' + value.y + ')'" v-for="(value, index) in valueArr" :key="index">
                <use fill="black"  fill-opacity="1" filter="url(#filter)" xlink:href="#circle"></use>
                <use fill="#47E0FF" fill-rule="evenodd" xlink:href="#circle"></use>
                <use  :x="`${-1*mul*4.5}`" :y="`${mul*5.2 - value.y}`" :fill="`rgb(0,${255-parseInt(value.humidity_num*2)},${255-parseInt(value.humidity_num)})`" xlink:href="#react"></use>
                <text :x="`${-1*mul*2.9}`" :y="`${mul*5.9 - value.y}`" fill="#ffffff">{{value.humidity}}</text>
                <use  :x="`${-1*mul*4.5}`" :y="`${mul*6.45 - value.y}`" xlink:href="#react_two"></use>
                <text :x="`${-1*mul*2.9}`" :y="`${mul*7.2 - value.y}`" fill="#ffffff">{{value.winSpeed}}</text>
                <text :x="index == 0 ? `0`: `${-1*mul*0.5}` " :y="`${mul*8.3 - value.y}`" fill="#ffffff">{{value.hour}}</text>
                <text id="tempTxt" x="0" :y="`${0.75*mul}`" fill="#ffffff">{{value.temp}}</text>
                <text id="tempTxt" :x="`${0.2*mul}`" :y="`${1.4*mul}`" fill="#ffffff">{{value.condition}}</text>
              </g> 
            </g>
          </g>
        </g>
      </g>
    </svg>
    <!-- <button @click="reload">Reload</button> -->
  </div>
    </div>
</template>
<script>
import TWEEN from '@tweenjs/tween.js';

let _s_width = Number(window.screen.width)
    /**根字体大小 */
let _mul = (_s_width/1280)*20
function mapping (val, inputMin, inputMax, outputMin, outputMax) {
  return ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin
}
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}
const MAX_HEIGHT = _mul*3.5
const MIN_HEIGHT = 0

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate)
let _valueArr = [];
for(let i = 0;i<25;i++){
  let obj = {};
  obj['x'] = 0*_mul*4.5;
  obj['y'] = 0;
  _valueArr.push(obj);
}

let valueArr = _valueArr.map((item, index) => {
  return {
    ...item,
    y: _mul*0,// MAX_HEIGHT * 0.5
    startY: MAX_HEIGHT,//MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) / 2
    x: index*4.5*_mul,//item.x + 18
  }
})




const DEFAULT_VALUE = clone(valueArr)
let animation = {
  progress: 0
}

export default {
  name:"TempStatistics",
  data () {
    return {
      valueArr,
      animation,
      duration: 600,
      data: [],
      mul:20,//放大倍数
      dayWeatherDate:[],//24小时数据，
      nowWeather:{},//实时数据
    }
  },
  props:['oneDayWeather','shortWeather'],
  watch: {
    data (val) {
      this.formatValues(val)
      this.doAnimation()
    },
    oneDayWeather:{//24小时
        handler:function(newVal, oldVal) {
          if(newVal){
            //this.dayWeatherDate = newVal
           // console.log('子组件内收到的天气1',this.dayWeatherDate,this.nowWeather);
            if(newVal.length !== 0){
                //this.valueArr[i].y = Number(newVal[i].temp);
                let tempArr = [];
                for(let i=0;i<newVal.length;i++){
                    tempArr.push(Number(newVal[i].temp))
                }
                tempArr.sort(function (a, b) {
                            return a-b;
                        });
                let topTemp = tempArr[tempArr.length-1];
                let lowTemp = tempArr[0];
                //*************一系列算法 */
                let maxHeight = this.mul*3.5;
                
                let _newvalueArr = this.valueArr;
                for(let i = 0;i<_newvalueArr.length;i++){
                    let num = maxHeight - ((maxHeight/(topTemp-lowTemp))*(Number(newVal[i].temp)-lowTemp));
                    _newvalueArr[i].y = num;
                    //_newvalueArr[i].x = this.mul*4.5;
                    _newvalueArr[i]['temp'] = newVal[i].temp+'℃';
                    _newvalueArr[i]['winSpeed'] = newVal[i].winSpeed+'级';
                    _newvalueArr[i]['humidity'] = newVal[i].humidity+'%';
                    _newvalueArr[i]['humidity_num'] = Number(newVal[i].humidity);
                    if(Number(newVal[i].hour)<10){
                        _newvalueArr[i]['hour'] = '0'+newVal[i].hour+":00";
                    }else{
                        _newvalueArr[i]['hour'] = newVal[i].hour+":00";
                    }
                    _newvalueArr[i]['condition'] = newVal[i].condition;
                    _newvalueArr[i]['iconDay'] = newVal[i].iconDay;
                    
                }
                
            }
          }
        },
        immediate: true,
        deep: true
    },
    shortWeather:{//实时
        handler:function(newVal, oldVal) {
          if(newVal){
            //this.nowWeather = newVal
            if(newVal !== {}){
                 this.nowWeather['temp'] = newVal.temp;
            }
          }
        },
        immediate: true,
        deep: true
    }
  },
  mounted () {
    //this.data = this.genRamdomValue();
    
  },
  created(){
    let s_width = Number(window.screen.width)
    /**根字体大小 */
    this.mul = (s_width/1280)*20;
    //请求24小时接口
  },
  computed: {
    path () {
      let steps = []
      this.valueArr.forEach((curr, index) => {
        if (index === 0) {
          // 移动到起点
          steps.push('M' + curr.x + ',' + curr.y)
        }
        if (index !== this.valueArr.length - 1) {
          let next = this.valueArr[index + 1]
          // 两个控制点坐标
          var ctrl1 = {
            x: (curr.x + next.x) * 0.5,
            y: curr.y
          }
          var ctrl2 = {
            x: ctrl1.x,
            y: next.y
          }
          steps.push('C' + ctrl1.x + ',' + ctrl1.y)
          steps.push(ctrl2.x + ',' + ctrl2.y)
          steps.push(next.x + ',' + next.y)
        }
      })
      return steps.join(' ')
    }
  },
  methods: {
    reload () {
       this.valueArr = clone(DEFAULT_VALUE)
       this.data = this.genRamdomValue()
    },
    genRamdomValue () {
      return this.valueArr.map(() => {
        return {
          value: Math.random()
        }
      })
    },
    formatValues (values) {
      this.valueArr.forEach((item, index) => {
        item.targetY = mapping(values[index].value, 0, 1, MIN_HEIGHT, MAX_HEIGHT)
      })
    },
    doAnimation () {
      animation.progress = 0
      new TWEEN.Tween(animation)
        .delay(100)
        .to({progress: 1}, this.duration, TWEEN.Easing.Quadratic.Out)
        .onUpdate(this.onUpdate)
        .start()
    },
    onUpdate () {
      this.valueArr.forEach((item) => {
        item.y = item.startY + (item.targetY - item.startY) * this.animation.progress
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.line-chart {
    width: 32.7*2rem;
    height: 10*2rem;
    overflow-x: scroll;
    overflow-y: hidden;
  svg {
    margin: auto;
    display: block;
    //max-width: 100%;
    width: 110*2rem;
    height: 10*2rem;
  }
}

// button {
//   display: block;
//   margin: auto;
//   outline:none;
//   height: 40px;
//   text-align: center;
//   width: 130px;
//   border-radius:40px;
//   background: #fff;
//   border: 2px solid #1ECD97;
//   color: #1ECD97;
//   letter-spacing:1px;
//   text-shadow:0;
//   font:{
//     size:12px;
//     weight:bold;
//   }
//   cursor: pointer;
//   transition: all 0.25s ease;
//   &:hover {
//     color:white;
//     background: #1ECD97;
//   }
//   &:active {
//     //letter-spacing: 2px;
//     letter-spacing: 2px ;
//   }
// }
</style>