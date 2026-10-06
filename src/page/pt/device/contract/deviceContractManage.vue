<template>
    <div id="deviceContractManage" style="height: 100%;">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">客户名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="客户名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">合同编号：</label>
                    <div class="input-text">
                        <el-input v-model="query.devContractNum" placeholder="合同编号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">器具名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.deviceName" placeholder="器具名称" type="text"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询
                    </el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>器具合同列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="器具合同列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <!--合同从报价单这里自动生成，同时追加有效期，这里不能新增以及删除，这里保留，方便以后拆分-->
                    <el-button type="primary" plain size="mini" v-entity="1001059" @click="showDialog(1, null)">新增
                    </el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001060" @click="showDialog(2, null)">修改
                    </el-button>
                    <el-button type="danger" plain size="mini" v-entity="1001061" @click="delContract">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="deviceContractManageTable" ref="table" :head="head" :showNum="true"
                         :singleSelect="true" :showSetTable="true" @dblclickItem="dblclickItem"></tableCommon>
        </div>

        <!--        新增合同-->
        <el-dialog :title="title" :visible.sync="dialogShow" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="1300px" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">仓库</label>
                        <div class="input-text">
                            <el-select v-model="info.workId" @change="changeWork" :disabled="isOnlySee"
                                       clearable filterable placeholder="请选择仓库">
                                <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                                            :value="item.workId">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>结算主体</label>
                        <div class="input-text">
                            <el-select v-model="info.settleBody" :disabled="isOnlySee"
                                       clearable filterable placeholder="请选择结算主体">
                                <el-option v-for="item in settleBodyData" :key="item.codeValue"
                                           :label="item.codeName" :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>客户名称</label>
                        <div class="input-text">
                            <el-select v-model="info.tenantId" :disabled="isOnlySee"
                                       clearable filterable placeholder="请选择客户名称">
                                <el-option v-for="item in custTenantData" :key="item.custTenantId"
                                           :label="item.custTenantName" :value="item.custTenantId">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>业务模式</label>
                        <div class="input-text">
                            <el-select v-model="info.businessMode" @change="changeBusinessMode(info.businessMode, false)"
                                       :disabled="isOnlySee" clearable filterable placeholder="请选择业务模式">
                                <el-option v-for="item in businessModeData" :key="item.codeValue"
                                           :label="item.codeName" :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>税点</label>
                        <div class="input-text">
                            <el-input v-model="info.taxRate" :disabled="isOnlySee" v-mydouble4val placeholder="请输入税点"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term">合同编号</label>
                        <div class="input-text">
                            <el-input v-model="info.devContractNum" :disabled="isOnlySee||type==2" placeholder="不填系统自动生成"></el-input>
                        </div>
                    </li>
                    <li class="item">
                      <label class="label-term">租赁开始日期</label>
                      <div class="input-text">
                        <el-date-picker v-model="info.leaseBeginDate" :disabled="isOnlySee||info.businessMode==1" type="date" class="tl" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                      </div>
                    </li>
                  <li class="item">
                    <label class="label-term">租赁结束日期</label>
                    <div class="input-text">
                      <el-date-picker v-model="info.leaseEndDate" :disabled="isOnlySee||info.businessMode==1" type="date" class="tl" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                    </div>
                  </li>
                    <li class="item" style="width: 98%">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="info.remark" :disabled="isOnlySee" placeholder="说点什么？"></el-input>
                        </div>
                    </li>
                </ul>
            </div>
            <div style="overflow: auto;max-height: 400px;">
                <scrollTable ref="scrollTable" :head="detailListHead">
                    <template v-slot="{item,code,name,index}">
                        <div v-show="code=='deviceId'">
                            <el-select v-model="item.deviceId" placeholder="请选择器具名称"
                                       @change="changePack(item)" :disabled="isOnlySee" clearable filterable>
                                <el-option v-for="item in deviceData" :key="item.id" :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                        </div>
                        <div v-show="code=='specification'">
                            <el-input v-model="item.specification" type="text" disabled placeholder="请选择器具"></el-input>
                        </div>
                        <div v-show="code=='feeItem'">
                            <el-select v-model="item.feeItem" placeholder="器具费用项目"
                                       clearable filterable :disabled="isOnlySee" >
                                <el-option v-for="item in feeItemData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                        <div v-show="code=='price'">
                            <el-input v-model="item.price" type="text" placeholder="未税单价"
                                      @input="calcFee(item)" v-mydouble4val :disabled="isOnlySee" ></el-input>
                        </div>
                        <div v-show="code=='unit'">
                            <el-select v-model="item.unit" placeholder="单价单位"
                                       filterable :disabled="isOnlySee" >
                                <el-option v-for="item in unitData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                        <div v-show="code=='nums'">
                            <el-input v-model="item.nums" type="text" @input="calcFee(item)" placeholder="数量"
                                     :disabled="isOnlySee" ></el-input>
                        </div>
                        <div v-show="code=='totalFee'">
                            <el-input v-model="item.totalFee" type="text" disabled placeholder="金额"
                                      v-mydouble4val></el-input>
                        </div>
<!--                        <div v-show="code=='leaseDate'">-->
<!--                            <el-input v-model="item.leaseDate" type="text" placeholder="合同有效期"-->
<!--                                      v-mynumval :disabled="isOnlySee" ></el-input>-->
<!--                        </div>-->
                        <div v-show="code=='relOperation'">
                            <el-select v-model="item.relOperation" placeholder="计费节点" @change="changePack" clearable
                                       filterable multiple :disabled="isOnlySee" >
                                <el-option v-for="item in relOperationData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                        <div v-show="code=='remark'">
                            <el-input v-model="item.remark" type="text" :disabled="isOnlySee"  placeholder="器具费用项目备注"></el-input>
                        </div>
<!--                        <div v-show="code=='exceedPrice'">-->
<!--                            <el-input v-model="item.exceedPrice" type="text" :disabled="isOnlySee" placeholder="补充仓储单价(元/天/个)"-->
<!--                                      v-mydoubleval></el-input>-->
<!--                        </div>-->
<!--                        <div v-show="code=='minTurnoverRate'">-->
<!--                            <el-input v-model="item.minTurnoverRate" type="text" :disabled="isOnlySee" placeholder="周转率"-->
<!--                                      v-mydoubleval></el-input>-->
<!--                        </div>-->
                        <div v-show="code=='operate' && !isOnlySee">
                            <a href="javascript:;" class="link red" style="margin-right:5px;" v-show="index!=0 || detailList.length > 1"
                               @click="removeItem(index)">删除</a>
                            <a href="javascript:;" class="link" @click="addItem(index)">新增</a>
                        </div>
                    </template>
                </scrollTable>
            </div>
            <div class="bot-btn">
                <el-button type="primary" plain size="mini" @click="openDialog(false)">关闭</el-button>
                <el-button type="primary" size="mini" v-show="!isOnlySee" @click="saveContract">{{type == 1 ? '保存' : '修改'}}</el-button>
            </div>
        </el-dialog>
        <!--        新增合同-->

    </div>
</template>

<script>
import deviceContractManage from './deviceContractManage.js'

export default deviceContractManage
</script>
<style lang="scss">

</style>
