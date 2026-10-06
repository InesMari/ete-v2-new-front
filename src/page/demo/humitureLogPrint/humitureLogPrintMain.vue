<template>
  <div id="humitureLogPrintMain" class="humitureLogPrintMainPage">
      <div class="list clearfix">
        <div v-for="item in list" class="item" @click="openTab(item)">
            <div class="time"></div>
            <div class="con">
            <div class="name">{{item.name}}</div>
            <div class="introduce">{{item.introduce}}</div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
    name: 'businessAnalysisMain',
    props: [],
    data() {
        return {
            list:[
                {
                    entityId:1007121,
                    name:'福鼎温湿度记录表',
                    path:'/demo/humitureLogPrint/humitureLogPrintFd.vue',
                    introduce:'各物流基地预算与实绩经营结果分析表，全年度各月份数据能全部展示，横向对比数据差异点（针对总部汇总输出)'
                },
            ]
        }
    },
    mounted() {
    },
    methods: {
        selectCallback(data) {
            this.tab = data;
            this.componentName = data.router;
        },
        /**
         * 往上层调用打开页面的
         * @returns {*}
         */
        openTab(item) {
            let urlId = item.path.substring(item.path.lastIndexOf("/") + 1, item.path.lastIndexOf(".vue"));
            this.$emit("openTab",{
                urlId: urlId + (new Date()).getTime(),
                urlName: item.name,
                urlPathName: "/"+item.entityId,
                urlPath: item.path});
        },

    },
    components: {
        
    }
}
</script>

<style lang="scss">
.humitureLogPrintMainPage{
    .list{
        padding-top: 10px;
        .item{
            float: left;
            width: 19%;
            margin-right: 1%;
            margin-bottom: 15px;
            position: relative;
            border-radius: 8px;
            box-sizing: border-box;
            cursor: pointer;
            .time{
                border-top-left-radius: 10px;
                background: #fff;
                padding: 12px 0 0 15px;
                width: calc(100% - 90px);
                position: relative;
                line-height: 1;
                height: 12px;
                &::after{
                    content: "";
                    @include trigon(24px,#fff,bottom);
                    position: absolute;
                    right: -24px;
                    bottom:0;
                    transform: scaleX(1.8);
                    -webkit-transform: scaleX(1.8);
                    z-index: -1;
                }
            }
            .con{
                background: #fff;
                border-radius: 10px;
                border-top-left-radius: initial;
                padding: 0 15px 12px;
            }
            .name{
                color: #333;
                font-size: 18px;
                margin-bottom:10px;
                font-weight: bold;
                position: relative;
                top: -10px;
            }
            .introduce{
                line-height: 20px;
                height: 90px;
                text-align: justify;
            }
            .info{
                margin-top: 25px;
                li{
                    min-width: 100px;
                    width: 50%;
                    text-align: center;
                }
                .icon{
                    border:1px solid #65be44;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    margin:0 auto 20px;
                    img{
                        width: 20px;
                    }
                }
                p{
                    margin-bottom: 10px;
                    .num{
                        font-size: 0.8vw;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}
</style>
