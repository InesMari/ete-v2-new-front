<template>
    <div id="humitureLogPrint" class="humitureLogPrintPage">
        <div class="list clearfix">
            <el-popover placement="bottom" width="400" v-for="item in list" class="item" v-model="item.visible" @hide="clear">
                <div class="common-info" style="border:none;padding:0;">
                    <ul class="content clearfix">
                        <li class="item item100">
                            <label class="label-term" style="width: 65px;">选择月份:</label>
                            <div class="input-text">
                                <el-date-picker v-model="param.month" type="month" placeholder="选择月份" value-format="yyyyMM"></el-date-picker>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="item.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="go(item)">确定</el-button>
                </div>
                <div slot="reference">
                    <div class="time"></div>
                    <div class="con">
                        <div class="name">{{ item.name }}</div>
                        <div class="introduce">{{ item.introduce }}</div>
                    </div>
                </div>
            </el-popover>
        </div>
    </div>
</template>

<script>
export default {
    name: 'businessAnalysisMain',
    data() {
        return {
            listShow:true,
            param: {},
            list: [
                {
                    entityId: 0,
                    name: '随机时间段温湿度记录表',
                    path: '/pt/wms/sensor/humitureLogPrintFd.vue',
                    introduce: '随机时间段温湿度记录表'
                },
                {
                    entityId: 0,
                    name: '固定时间段温湿度记录表',
                    path: '/pt/wms/sensor/humitureLogPrintPy.vue',
                    introduce: '固定时间段温湿度记录表'
                },
            ],
            month: '',
        }
    },
    mounted() {
        this.month = this.common.formatDate.getMonth(new Date()).replace(/-/g, '');
    },
    methods: {
        clear(){
            this.param={
                month:this.month,
            };
        },
        go(item) {
            if(!this.param.month){
                this.$message.error("请选择月份");
                return;
            }
            this.param.id = this.$route.query.id;
            this.param.deviceAddress = this.$route.query.deviceAddress;
            this.param.location = this.$route.query.location;
            this.$emit("openTab",{
                urlId: new Date().getTime(),
                query: this.param,
                urlName: item.name,
                urlPathName: "/humitureLogPrint",
                urlPath: item.path});
        },

    },
    components: {
        
    }
}
</script>

<style lang="scss">
.humitureLogPrintPage {
    .list {
        padding-top: 10px;

        .item {
            float: left;
            width: 19%;
            margin-right: 1%;
            margin-bottom: 15px;
            position: relative;
            border-radius: 8px;
            box-sizing: border-box;
            cursor: pointer;

            .time {
                border-top-left-radius: 10px;
                background: #fff;
                padding: 12px 0 0 15px;
                width: calc(100% - 90px);
                position: relative;
                line-height: 1;
                height: 12px;

                &::after {
                    content: "";
                    @include trigon(24px, #fff, bottom);
                    position: absolute;
                    right: -24px;
                    bottom: 0;
                    transform: scaleX(1.8);
                    -webkit-transform: scaleX(1.8);
                    z-index: -1;
                }
            }

            .con {
                background: #fff;
                border-radius: 10px;
                border-top-left-radius: initial;
                padding: 0 15px 12px;
            }

            .name {
                color: #333;
                font-size: 18px;
                margin-bottom: 10px;
                font-weight: bold;
                position: relative;
                top: -10px;
            }

            .introduce {
                line-height: 20px;
                height: 90px;
                text-align: justify;
            }

            .info {
                margin-top: 25px;

                li {
                    min-width: 100px;
                    width: 50%;
                    text-align: center;
                }

                .icon {
                    border: 1px solid #65be44;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    margin: 0 auto 20px;

                    img {
                        width: 20px;
                    }
                }

                p {
                    margin-bottom: 10px;

                    .num {
                        font-size: 0.8vw;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}</style>
