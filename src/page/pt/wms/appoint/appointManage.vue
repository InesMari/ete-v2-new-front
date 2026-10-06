<template>
    <div id="appointManage">
        <!--      <select-work v-show="showSelWork"></select-work>-->
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="appointManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓库预约列表</span>
                    <el-tooltip effect="light" content="仓库预约列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1005112" @click="toFullScreen">全屏展示</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1005115" @click="download">导出Excel</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1005153" @click="cancelAppoint">取消预约</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1005282" @click="openDialog">修改到货厂商</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1005286" @click="checkInAppoint">报到</el-button>
                  <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="appointManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true">
                <template v-slot:default="{item, code}">
                    <el-button type="primary" size="mini" v-if="code=='caozuo'" :style="item.state==4?'background:#aaa;':(item.state!=1?(item.opType==1?'background:rgba(0,128,0,0.4);':'background:rgba(255,0,0,0.4);'):(item.opType==1?'background:green;':'background:red;'))"
                               :disabled="item.state!=1" v-entity="1005286" @click.stop="updateWmsAppointInfoState(item,1)">{{item.opType == 2 ? '出库' : '入库'}}报到
                    </el-button>
                    <el-button type="primary" size="mini" v-if="code=='caozuo'" :style="item.state==4?'background:#aaa;':''"
                               :disabled="item.state!=2" @click.stop="updateWmsAppointInfoState(item,3)">开始{{item.opType == 2 ? '装货' : '卸货'}}
                    </el-button>
                    <el-button type="primary" size="mini" v-if="code=='caozuo'" :style="item.state==4?'background:#aaa;':''"
                               :disabled="item.state!=3" @click.stop="updateWmsAppointInfoState(item,4)">{{item.opType == 2 ? '装货' : '卸货'}}完成
                    </el-button>
                    <a href="javascript:void(0);" v-if="code=='url'" class="link" @click.stop="showBigImg(item)"
                       style="margin: 0 10px;">查看</a>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

        <el-dialog title="修改到货厂商" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="600px"
                   @close="opDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term">原到货厂商</label>
                        <div class="input-text">
                            <el-input v-model="info.oldFromTenantName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">新到货厂商</label>
                        <div class="input-text">
                            <el-input v-model="info.fromTenantName"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button @click="opDialog(false)">关闭</el-button>
                    <el-button type="primary" @click="updateWmsAppointFromTenantName" >提交</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import appointManage from './appointManage.js'
export default appointManage
</script>
<style lang="scss">
</style>