<template>
    <div id="dataBoardMain">
        <div class="common-info">
            <div class="list">
                <div class="listItem">
                    <h3 class="typeTitle" v-entity="1007080">费用数据</h3>
                    <div class="typeList clearfix" v-entity="1007080">
                        <div class="item" @click="go(1)">
                            <div class="icon">
                                <img src="@/static/image/kb_icon1.png" alt="">
                            </div>
                            <div class="con">
                                <h5>仓库成本收入</h5>
                                <p>成本收入明细</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="listItem">
                    <h3 class="typeTitle" v-entity="1007082">管理数据</h3>
                    <div class="typeList clearfix" v-entity="1007082">
                        <div class="item" @click="go(2)">
                            <div class="icon">
                                <img src="@/static/image/kb_icon2.png" alt="">
                            </div>
                            <div class="con">
                                <h5>巡检看板</h5>
                                <p>巡检数据看板</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="listItem">
                    <h3 class="typeTitle" v-entity="1007083">运作数据</h3>
                    <div class="typeList clearfix" v-entity="1007083">
                        <div class="item" @click="go(3)">
                            <div class="icon">
                                <img src="@/static/image/kb_icon3.png" alt="">
                            </div>
                            <div class="con">
                                <h5>仓储运作数据看板</h5>
                                <p>入库、出库、短驳、操作、器具、盘点等相关操作汇总数据看板</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list">
                <div class="listItem">
                    <h3 class="typeTitle" v-entity="1007180">订单数据</h3>
                    <div class="typeList clearfix" v-entity="1007180">
                        <div class="item" @click="go(4)">
                            <div class="icon">
                                <img src="@/static/image/kb_icon4.png" alt="">
                            </div>
                            <div class="con">
                                <h5>订单数据看板</h5>
                                <p>订单数据统计及明细看板</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dataBoardMain from './dataBoardMain.js'
export default dataBoardMain;
</script>

<style lang="scss" scoped>
#dataBoardMain {
    background: #fff;

    .common-info {
        padding: 30px;
        border: none;
    }
    .list{
        display: flex;
        gap:3%;
        .listItem{
            width: 32%;
        }
    }

    .typeTitle {
        color: $main-color;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .typeList {
        margin-bottom: 50px;

        .item {
            width: 100%;
            float: left;
            box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
            display: flex;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                background: #fafafa;
            }

            .icon {
                padding: 15px 20px;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    height: 45px;
                }
            }

            .con {
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: center;
                padding: 10px 10px 10px 0;

                h5 {
                    font-size: 14px;
                    font-weight: bold;
                }
                p{
                    min-height: 40px;
                }
            }
        }
    }
}
</style>
