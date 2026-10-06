<template>
    <div id="ordPlanManage" class="ordPlanManagePage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="ordPlanManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>订单包列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="订单包列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openAddPlanPage()" v-entity="1003031">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openCopyPlanPage()" v-entity="1003101">复制</el-button>
                    <el-button type="primary" plain size="mini" @click="openPlanDetailPage()" v-entity="1003032">查看</el-button>
                    <el-button type="primary" plain size="mini" @click="planToOrder()" v-entity="1003033">查看运作订单</el-button>
                    <el-button type="primary" plain size="mini" @click="cancelPlan()" v-entity="1003034">取消</el-button>
                    <el-button type="primary" plain size="mini" @click="openSync(true)" v-entity="1003099">补单</el-button>
                    <el-button type="danger" plain size="mini" @click="deletePlan()" v-entity="1003100">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="ordPlanManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true"
                         :showSetTable="true" @dblclickItem="dblclickItem">
                <template v-slot:default="{ item }">
                    <a href="javascript:void(0);" :class="!item.qrcodeFileUrl ? 'disabled' : 'link'"
                       @click.stop="visitCode(item)" style="margin: 0 10px;">小程序码</a>
                </template>
            </tableCommon>
        </div>
        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

        <!-- 同步 begin -->
        <el-dialog title="补单" :visible.sync="showSync" width="360px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openSync(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>身份证号</label>
                        <div class="input-text">
                            <el-input v-model="syncInfo.idCard" maxlength="30" @input="forceUpdate"
                                      placeholder="请输入身份证号"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>车牌号码</label>
                        <div class="input-text">
                            <el-input v-model="syncInfo.plateNumber" maxlength="30" @input="forceUpdate"
                                      placeholder="请输入车牌号码"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>宝奇运单号</label>
                        <div class="input-text">
                            <el-input v-model="syncInfo.thrdWaybillNum" maxlength="30" @input="forceUpdate"
                                      placeholder="请输入宝奇运单号"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openSync(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="syncOrderInfo()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 同步 end -->

        <el-dialog title="订单包二维码" :visible.sync="showImgDialog" width="420px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="showImgDialog = false">
            <div class="orderView" ref="orderView">
                <div class="orderHeader">
                    <img src="@/static/image/logo.png" alt="">
                    <div class="oderNumInfo">
                        <div class="name">订单号</div>
                        <div class="value">{{ currentItem.planNum }}</div>
                    </div>
                </div>
                <div class="oderInfo">
                    <div class="item">
                        <div class="label">订单类型：</div>
                        <div class="text">
                            <p class="site">{{ currentItem.orderTypeName }}</p>
                        </div>
                    </div>
                    <div class="item" v-for="item in currentItem.workData">
                        <div class="label">{{ item.workTypeName }}货地址：</div>
                        <div class="text">
                            <p class="site">{{ item.workName }}</p>
                            <p class="tip">{{ item.workAddressStr }}</p>
                        </div>
                    </div>
                </div>
                <div class="codeView">
                    <div class="title" v-if="currentItem.thrdPlanNum">宝奇司机APP</div>
                    <div class="title" v-else>易迁易小程序</div>
                    <img :src="currentItem.qrcodeFileUrl" alt="">
                    <div class="tip">
                        <p>分享扫描二维码查看相关信息</p>
                        <p>二维码始终有效</p>
                    </div>
                </div>
            </div>
            <div class="downloadBtn">
                <el-button type="success" @click="downloadImg()">下载/分享图片</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import ordPlanManage from './ordPlanManage.js'

export default ordPlanManage
</script>
<style lang="scss" scoped>
.ordPlanManagePage {
    .orderView {
        background: linear-gradient(135deg, #e70b1d 0%, #c41a2e 100%);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(231, 11, 29, 0.3);
        color: white;

        .orderHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);

            img {
                height: 40px;
                filter: brightness(0) invert(1);
            }

            .oderNumInfo {
                text-align: right;

                .name {
                    font-size: 14px;
                    color: #fff;
                    margin-bottom: 5px;
                }

                .value {
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                }
            }
        }

        .oderInfo {
            margin-bottom: 20px;

            .item {
                display: flex;
                margin-bottom: 5px;

                .label {
                    width: 80px;
                    font-weight: 500;
                    color: #fff;
                    flex-shrink: 0;
                    line-height: 1.5;
                    font-size: 14px;
                }

                .text {
                    flex: 1;

                    .site {
                        color: #fff;
                        font-weight: 500;
                        line-height: 1.5;
                        font-size: 14px;
                    }

                    .tip {
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.6);
                        line-height: 1.5;
                    }
                }
            }
        }

        .codeView {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

            .title {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #e70b1d;
            }

            img {
                width: 150px;
                height: 150px;
                margin-bottom: 15px;

            }

            .tip {
                p {
                    margin: 5px 0;
                    font-size: 13px;
                    color: #666;

                    &:first-child {
                        font-weight: 500;
                        color: #333;
                    }
                }
            }
        }
    }

    .downloadBtn {
        margin-top: 20px;
        text-align: center;
    }
}
</style>
