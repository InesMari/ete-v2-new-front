<template>
    <div id="storeEquipmentManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">仓库名称：</label>
                    <div class="input-text">
                        <el-select v-model="query.workId" filterable clearable @change="doQuery">
                            <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">使用起始日：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.beginUseDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">设备名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.equipmentName" placeholder="设备名称"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">设备序列号：</label>
                    <div class="input-text">
                        <el-input v-model="query.equipmentNum" placeholder="设备序列号"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">采购类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.equipmentPurchaseType" clearable @change="doQuery" placeholder="采购类型">
                            <el-option v-for="item in equipmentPurchaseTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">设备类别：</label>
                    <div class="input-text">
                        <el-select v-model="query.equipmentType" clearable @change="doQuery" placeholder="设备类别">
                            <el-option v-for="item in equipmentTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">设备类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.equipmentClassType" clearable @change="doQuery" placeholder="设备类型">
                            <el-option v-for="item in equipmentClassTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">供应商：</label>
                    <div class="input-text">
                        <el-select v-model="query.tenantId" placeholder="请选择供应商" filterable clearable>
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
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
                    <span>仓库设备资源列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="仓库设备资源列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="add" v-entity="1002159">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="update" v-entity="1002160">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteEquipmentPurchase" v-entity="1002161">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="storeEquipmentManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" @dblclickItem="dblclickItem" :singleSelect="true">
              <template v-slot:default="{item}">
                <a href="javascript:void(0);" class="link" @click.stop="open(item)">{{ item.contractNum }}</a>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import storeEquipmentManage from './storeEquipmentManage.js'

export default storeEquipmentManage
</script>
<style lang="scss">

</style>

