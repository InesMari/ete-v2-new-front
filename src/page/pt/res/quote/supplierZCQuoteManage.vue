<template xmlns="http://www.w3.org/1999/html">
    <div id="supplierZCQuoteManage" class="supplierZCQuoteManage">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query" searchKey="supplierZCQuoteManageSearch"></searchList>

        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>供应商整车报价列表
                    (<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)
                    </span>
                    <el-tooltip effect="light" content="供应商整车报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addZCQuote()" v-entity="1002077">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="copyZCQuote()" v-entity="1002089">复制</el-button>
                    <el-button type="primary" plain size="mini" @click="updateZCQuote()" v-entity="1002078">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteZCQuote()" v-entity="1002079">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="showUpload(true)" v-entity="1002080">批量导入</el-button>
                    <el-button type="primary" plain size="mini" @click="showModify(true)" v-entity="1002252">修改失效日期</el-button>
                    <el-button type="primary" plain size="mini" @click="exportData()" v-entity="1002081">导出Excel</el-button>
                </div>
            </div>
                <tableCommon :class="{'table':showTableDetail}" tableName="supplierZCQuoteManageTable" ref="table" :head="head" :showNum="true"
                             :showSetTable="true" @dblclickItem="dblclickItem"  :singleSelect="false" @changeRows="changeRowsCallback">
                    <template v-slot:diyColorTd="{item}">
                        <span :style="item.validState==1?'color:red!important':''">{{item.validStateName}}</span>
                    </template>
                    <template v-slot:default="{item}">
                        <a href="javascript:void(0);" class="link" @click.stop="open(item)">{{ item.contractNum }}</a>
                    </template>
                </tableCommon>
                <div class="tableDetail" v-show="showTableDetail">
                    <div class="con" v-show="quoteData.quoteNum">
                        <label class="label">报价单号:</label>
                        <span style="color: red;">{{quoteData.quoteNum}}</span>
                        <label class="label">供应商:</label>
                        <span>{{quoteData.tenantName}}</span>
                        <label class="label">线路:</label>
                        <span>{{quoteData.routeName}}</span>
                    </div>
                    <div class="con" v-show="quoteData.createUserName">
                        <label class="label">创建人:</label>
                        <span>{{quoteData.createUserName}}</span>
                        <label class="label">创建时间:</label>
                        <span>{{quoteData.createDate}}</span>
                    </div>
                    <div class="table_height">
                        <table class="tableCommon" ref="quoteDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>计费方式</th>
                                    <th>报价车型</th>
                                    <th>车长</th>
                                    <th>货物</th>
                                    <th>运费单价/元</th>
                                    <th>点位费单价/元</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item,index) in quoteDetailData">
                                <td>{{ index }}</td>
                                <td>{{ item.billingTypeName }}</td>
                                <td>{{ item.quoteVehicleTypeName }}</td>
                                <td>{{ item.vehicleLengthName }}</td>
                                <td>{{ item.goodsName }}</td>
                                <td>{{ item.feePrice }}</td>
                                <td>{{ item.pointFee }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
        <!-- 报价导入 开始-->
        <el-dialog title="报价导入" :visible.sync="showUploadPage" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="500px" @close="showUpload(false)">
            <div class="common-info" style="border:none;padding:0;">
                <div style="padding: 0 22px;">
                    <em style="font-size:14px;">
                        注：<br/>
                        1、报价级别：按作业点，按区域。<br/>
                        2、中途点1，中途点2，点位费单价没有的情况，不填为空。<br/>
                        3、计费方式：按整车，按毛重，按净重，按体积，按件数。<br/>
                        4、报价车型，车长，货物，没有限定的情况，请输入'通用'，多个的情况请用英文逗号隔开或者新增一行数据。<br/>
                        5、同一供应商下,相同的起始点、中途点、目的地、计费方式、报价车型、车长、货物、只能存在一条。通用等于全选。<br/>
                    </em>
                </div>
                <ul class="content clearfix" style="margin-top:10px;">
                    <li class="item item100" style="margin-top:10px;margin-left: 24px;">
                        <my-import ref="myImport" :handle-success="uploadSuccess" :noneDialog="true" template="/download/supplierZcQuote.xlsx" title="报价导入"
                                   tip="仅允许导入“xls”或“xlsx”格式文件！" bean="ZCQuoteNewTF" method="importQuote" :param="param"></my-import>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showUpload(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="upload()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 报价导入 结束-->

      <!-- 修改失效日期 begin-->
      <el-dialog title="修改失效日期" :visible.sync="modifyShow" width="360px" :close-on-click-modal="false"
                 :close-on-press-escape="false" @close="showModify(false)">
        <div class="fcCommonPage">
            <div class="common-info" style="border:none;padding:0;">
              <ul class="content clearfix;">
                <li class="item item100">
                  <label class="label-term"><em>*</em>失效日期</label>
                  <div class="input-text">
                    <el-date-picker v-model="modifyInfo.expireDate" type="date" placeholder="失效日期" value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
                  </div>
                </li>
              </ul>
              <div class="page-bot-btn " style="margin-top:0px;padding-right:0px; ">
                <el-button size="mini" @click="showModify(false)">关闭</el-button>
                <el-button type="primary" size="mini" @click="sureModify()">确定</el-button>
              </div>
          </div>
        </div>
      </el-dialog>
      <!-- 修改失效日期 end-->
    </div>
</template>

<script>
import supplierZCQuoteManage from './supplierZCQuoteManage.js'
export default supplierZCQuoteManage
</script>
<style lang="scss">
.supplierZCQuoteManage {
    .table {
        width: 40%;
        float: left;
    }
    .tableDetail {
        width: 59%;
        float: right;
        border:$border;
        padding: 10px 20px;
        box-sizing: border-box;
        .con{
            line-height: 24px;
            margin-bottom: 10px;
            span{
                margin-right: 20px;
            }
        }
    }
    .table_height {
        border: $border;
        border-bottom: none;
        overflow: auto;
    }
}
</style>
