<template>
    <div class="pageOne">
        <span class="time">{{Time.hour}}:{{Time.min}}</span>
        <span class="dateValue">{{Time.year}}/{{Time.mon}}/{{Time.day}} {{Time.week}}</span>
        <div class="itemBox news">
            <div class="newsPanel"></div>
            <div class="ItemGroup">
            <div class="newsItem" v-for="(item,i) in nowNewsData" :key="i">
                <router-link :to="{path:'/news',query:{url:item.url}}" tag="div" replace>
                <img class="newsImg" src="../assets/images/news.png"/>
                <span class="newsName">{{item.title}}</span>
                <span class="newsSource">{{item.source}}</span>
                </router-link>
            </div>
            </div>
        </div>
        <div class="itemBox videoTalk">
            <div class="newsPanel"></div>
            <span class="itemBox_title">可视对讲</span>
            <div class="videoTalk_item videoTalk_1" @click="goVideoTalk()"><img class="videoTalk_icon" src="@/assets/images/home_3.png"><span class="videoTalk_name">入户门</span></div>
            <div class="videoTalk_item videoTalk_2" @click="goVideoTalk()"><img class="videoTalk_icon" src="@/assets/images/home_1.png"><span class="videoTalk_name">户户通</span></div>
            <div class="videoTalk_item videoTalk_3" @click="goVideoTalk()"><img class="videoTalk_icon" src="@/assets/images/home_2.png"><span class="videoTalk_name">呼叫物业</span></div>
        </div>
        <div class="itemBox propertyMsg">
            <div class="newsPanel"></div>
            <span class="itemBox_title">物业消息</span>
            <div class="propertyMsg_group">
                <div class="propertyMsg_item">
                    <img class="propertyMsg_item_icon" src="@/assets/images/msg.png" alt="">
                    <span class="propertyMsg_item_name">电梯安全指南</span>
                    <span class="propertyMsg_item_time">2020/05/20</span>
                </div>
                <div class="propertyMsg_item">
                    <img class="propertyMsg_item_icon" src="@/assets/images/msg.png" alt="">
                    <span class="propertyMsg_item_name">小区智慧停车管理</span>
                    <span class="propertyMsg_item_time">2020/05/20</span>
                </div>
                <div class="propertyMsg_item">
                    <img class="propertyMsg_item_icon" src="@/assets/images/msg.png" alt="">
                    <span class="propertyMsg_item_name">关于升级安全设施相关通知</span>
                    <span class="propertyMsg_item_time">2020/05/20</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Tool from '@/utils/Tool';
export default {
    name:"pageOne",
    data(){
        return {
           Time:{},
           nowNewsData:[],
           nowNewsIndex:0,
        }
    },
    props:[],
    watch:{
    //   warningFlag:{
    //     handler:function(newVal, oldVal) {
    //       if(newVal){
    //         this.warnFlag = newVal
    //       }
    //     },
    //     immediate: true,
    //     deep: true
    //   },
    },
    computed:{
        ...mapState({

        })
    },
    methods:{
         /**获取新闻条目 */
        getNews(){
                let _this = this;
                Tool.get_News("GET",'http://interface.sina.cn/wap_api/layout_col.d.json?&showcid=56261',(res)=>{
                    let new_newsArray = [];
                    if(JSON.parse(res).code == 200){
                            let news_body = JSON.parse(res).data.result.data.list;
                            let count = JSON.parse(res).data.result.data.count;
                                if(count >= 5){
                                        for(let i =0;i<news_body.length;i++){
                                        let news_item = {};
                                        news_item["title"] = news_body[i].title;
                                        news_item["source"] = news_body[i].source;
                                        news_item["url"] = news_body[i].URL;
                                        new_newsArray.push(news_item);
                                        }
                                        _this.nowNewsData = [];
                                        _this.nowNewsIndex = 0;
                                        _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex])
                                        _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+1])
                                        _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+2])
                                        _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+3])
                                        _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+4])
                                        //_this.sql_flag.news = true;
                                        // Tool.add_change_sql('update','web_news',_this.nowNewsData,(res)=>{
                                        //     if(JSON.parse(res).code == 200){
                                        //     }else{
                                        //     console.error('存入数据库失败',res)
                                        //     }
                                        // });
                                        setInterval(()=>{
                                            _this.nowNewsData = [];
                                            if(_this.nowNewsIndex + 5 < new_newsArray.length-1){
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex])
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+1])
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+2])
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+3])
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+4])
                                                    _this.nowNewsIndex += 5;

                                            }else{
                                                    _this.nowNewsIndex = 0;
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex])
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+1])
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+2])
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+3])
                                                    _this.nowNewsData.push(new_newsArray[_this.nowNewsIndex+4])

                                            }
                                        },5000)
                                }else if(count > 0 && count<5){
                                        for(let i =0;i<news_body.length;i++){
                                        let news_item = {};
                                        news_item["title"] = news_body[i].title;
                                        news_item["source"] = news_body[i].source;
                                        news_item["url"] = news_body[i].URL;
                                        new_newsArray.push(news_item);
                                        }
                                        _this.nowNewsData = [];
                                        _this.nowNewsIndex = 0;
                                        for(let u=0;u<new_newsArray.length;u++){
                                            _this.nowNewsData.push(new_newsArray[u]);
                                        }
                                }else if(count == 0){
                                        _this.nowNewsData = [{
                                            "title":"施迤给出滕文竹想要的答案~ 我苍天啊……",
                                            "URL":"https://k.sina.cn/article_6086152999_m16ac3532703300plbf.html?from=mood&cid=56261",
                                            "source":"迷魂追爱",
                                        },
                                        {  
                                            "title":"我们为什么总爱上火？@主持人王宁 这个去火秘方超好用",
                                            "URL":"https://k.sina.cn/article_7211561239_m1add7b117033010jvt.html?from=ent&subch=oent&cid=56261",
                                            "source":"央视频",
                                        },
                                        {
                                            "title":"盱眙县政府党组成员、县投资促进局局长、四级调研员樊金鸿接受纪律审查和监察调查",
                                            "URL":"https://news.sina.cn/gn/2020-06-24/detail-iircuyvk0239233.d.html?&cid=56261",
                                            "source":"江苏省纪委监委网站",
                                        },
                                        {  
                                            "title":"我们为什么总爱上火？@主持人王宁 这个去火秘方超好用",
                                            "URL":"https://k.sina.cn/article_7211561239_m1add7b117033010jvt.html?from=ent&subch=oent&cid=56261",
                                            "source":"央视频",
                                        },
                                        {
                                            "title":"盱眙县政府党组成员、县投资促进局局长、四级调研员樊金鸿接受纪律审查和监察调查",
                                            "URL":"https://news.sina.cn/gn/2020-06-24/detail-iircuyvk0239233.d.html?&cid=56261",
                                            "source":"江苏省纪委监委网站",
                                        }]
                                }


                    }else{
                            Tool.show_toast('获取新闻失败'+res,(res)=>{})
                    }

                })
        },
        //视频对讲跳转页面
        goVideoTalk(){
            Tool.getIntercomSystem((res)=>{

            })
        }
    },
    mounted(){
        this.getNews()
    },
    created(){
        let _this = this;
        setInterval(()=>{
            _this.Time = Tool.getTime();
        },1000)
    }
}
//头部高度80
</script>
<style lang="scss" scoped>
    @mixin text_con(){
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .pageOne{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .time{
        position: absolute;
        width: 15.7rem;
        height: 6rem;
        font-size: 6rem;
        line-height: 6rem;
        color: white;
        top: 8.1rem;
        left: 8.2rem;
    }
    .dateValue{
        position: absolute;
        width: 25.1rem;
        height: 2.8rem;
        font-size: 3rem;
        color: white;
        top: 9.9rem;
        left: 27.7rem;
    }
    .itemBox{
        border-radius: 2rem;
        overflow: hidden;
        box-shadow:0px 10px 30px 0px rgba(0, 0, 0, 0.35);
    }
    .itemBox_title{
        position: absolute;
        width:9rem;
        height:2.2rem;
        font-size: 2.2rem;
        color: white;
        text-align: left;
        left: 2.4rem;
        top: 2.3rem;
    }
    .newsPanel{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #7596C8;
        opacity: 0.5;
    }
    .news{
        position: absolute;
        width: 51rem;
        height: 50rem;
        left: 5rem;
        top: 16.5rem;
        .ItemGroup{
            position: absolute;
            width: calc(100% - 4.6rem);
            left: 2.3rem;
            top: 3.7rem;
        }
        .newsItem{
            position: relative;
            height: 6.2rem;
            width: 100%;
            margin-top: 1.9rem;
            margin-bottom: 1.9rem;
        }
        .newsImg{
            position: absolute;
            width: 5.6rem;
            height: 5.6rem;
            left: 0;
            top: 0;
        }
        .newsName{
            position: absolute;
            font-size:2.2rem;
            width: 36.7rem;
            height: 2.4rem;
            line-height: 2.4rem;
            left: 7.7rem;
            text-align: left;
            @include text_con();
            top: 0.3rem;
        }
        .newsSource{
            position: absolute;
            width: 20rem;
            font-size: 1.6rem;
            height: 1.7rem;
            line-height: 1.7rem;
            color: #FFFFFF;
            top: 4.3rem;
            left: 7.7rem;
            text-align: left;
        }

    }
    .videoTalk{
        position: absolute;
        width: 63.5rem;
        height: 25.6rem;
        left: 59.5rem;
        top: 16.5rem;
        &_item{
            position: absolute;
            width: 33.3%;
            height: 20rem;
            top: 2.8rem;
        }
        &_1{
            left: 0;
            border-right: 0.1rem solid rgba(255,255,255,0.2);
            border-radius: 0.05rem;
        }
        &_2{
            left: 33.3%;
            border-right: 0.1rem solid rgba(255,255,255,0.2);
            border-radius: 0.05rem;
        }
        &_3{
            left: 66.6%;
        }
        &_icon{
            position: absolute;
            width: 6.4rem;
            height: 6.2rem;
            top: 5.9rem;
            left: calc(50% - 3.2rem);

        }
        &_name{
            position: absolute;
            width: 100%;
            height: 1.8rem;
            font-size: 1.8rem;
            top: 15.4rem;
            left: 0;
        }
    }
    .propertyMsg{
        position: absolute;
        width: 63.5rem;
        height: 20.8rem;
        top: 45.7rem;
        left: 59.5rem;
        &_group{
            position: absolute;
            width: 100%;
            top: 5.9rem;
        }
        &_item{
            position: relative;
            margin-top: 1.1rem;
            margin-bottom: 1.1rem;
            width: 100%;
            height: 2.4rem;
            text-align: left;
            &_icon{
                position: absolute;
                width: 2.4rem;
                height: 2.4rem;
                margin-left: 2.5rem;
            }
            &_name{
                position: absolute;
                width: 38rem;
                height: 2.4rem;
                font-size: 2.4rem;
                margin-left: 6.2rem;
                line-height: 2.4rem;
                @include text_con();
            }
            &_time{
               position: absolute;
               width: 9.9rem;
               height: 1.6rem;
               font-size: 1.6rem;
               line-height: 1.6rem;
               top: 0.5rem;
               margin-left: 46rem;
            }
        }
    }

</style>