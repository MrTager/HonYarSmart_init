<template>
    <div class="Power" >
      <div class="power_button" :class="{'power_active':power_state == 1}" @click="power_set()">
        <img class="power_icon" src="@/assets/images/deviceControl/powerstate.png" alt />
      </div>
    </div>
</template>
<script>
export default {
    name:'Power',
    data(){
        return {
          power_state: 0,
        }
    },
    props:["powerstate"],
    watch:{
        powerstate:{
            handler(newVal,oldVal){
                let _this = this;
                _this.power_state = newVal
            },
            immediate: true,
            deep: true,
            
        }
        
    },
    methods:{
        power_set(){
            this.$emit('power_set')
        }
    },
    mounted(){
    },
    created(){
    }
}
</script>
<style lang="scss" scoped>
.Power{
    position: absolute;
    width: 100%;
    height: 7.6rem;
    bottom: 2.1rem;
}
.power_button {
  position: absolute;
  width: 7.6rem;
  height: 7.6rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3.8rem;
  border: 0.1rem solid gray;
  left: calc(50% - 3.8rem);
}
.power_icon {
  position: absolute;
  width: 2.9rem;
  height: 3.1rem;
  top: calc(50% - 1.55rem);
  left: calc(50% - 1.45rem);
}
.power_active {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>