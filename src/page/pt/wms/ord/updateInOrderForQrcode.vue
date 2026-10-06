<template>
    <div id="updateInOrderForQrcode">
        <div class="common-info">
            <!--            上一步-->
            <div class="disabledView" v-show="showInfo">
                <div style="background: rgba(255, 255, 255, 0.3);position: absolute;z-index: 99999;top: 0;left: 0;height: 100%;width: 100%;pointer-events: none;"></div>
                <!--            基本信息-->
                <h3 class="common-title"><span class="title-name">基本信息</span></h3>
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="label"><em>*</em>货主</td>
                        <td class="value">
                            <el-select v-model="info.srcTenantId" placeholder="请选择货主" clearable filterable
                                        @change="changeSrcTenantOrFromTenant(1)">
                                <el-option v-for="item in srcTenantData" :key="item.wId" :label="item.name"
                                            :value="item.wId"></el-option>
                            </el-select>
                        </td>
                        <td class="label">预计入库时间</td>
                        <td class="value">
                            <el-date-picker @input="$forceUpdate()" v-model="info.requireInDate" type="date"
                                            placeholder="选择日期" align="right" :picker-options="pickerOptions"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </td>
                        <td class="label"><em v-show="showRed">*</em>来货地址</td>
                        <td class="value">
                            <el-select v-model="info.srcWorkId" placeholder="请选择来货地址" filterable
                                        @change="$forceUpdate()">
                                <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                            :value="item.workId"></el-option>
                            </el-select>
                        </td>
                        <td class="label">入库类型</td>
                        <td class="value">
                            <el-select v-model="info.rejectedState" @change="changeInfoSwitch" placeholder="请选择入库类型"
                                        filterable>
                                <el-option v-for="item in rejectedStateData" :key="item.codeValue" :label="item.codeName"
                                            :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">返程短驳单</td>
                        <td class="value">
                            <el-select v-model="info.waybillId" filterable clearable
                                        placeholder="请选择短驳单号">
                                <el-option v-for="item in waybillData" :key="item.waybillId"
                                            :label="item.waybillNum" :value="item.waybillId"></el-option>
                            </el-select>
                        </td>
                        <td class="label">预约编号</td>
                        <td class="value">
                            <el-select v-model="info.appointId" @change="changeAppoint" filterable clearable placeholder="请选择预约编号">
                                <el-option v-for="item in appointData" :key="item.appointId" :label="item.appointNum"
                                            :value="item.appointId">
                                    <span style="float: left">{{ item.appointNum }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.plateNumber }}</span>
                                </el-option>
                            </el-select>
                        </td>
                        <td class="label">车牌号码</td>
                        <td class="value">
                            <el-input v-model="info.plateNumber" type="text" placeholder=""></el-input>
                        </td>
                        <td class="label">司机姓名</td>
                        <td class="value">
                            <el-input v-model="info.linkman" type="text" placeholder=""></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">手机号码</td>
                        <td class="value">
                            <el-input v-model="info.linkPhone" type="text" placeholder=""></el-input>
                        </td>
                        <td class="label" v-if="info.rejectedState==2"><em>*</em>退货类型</td>
                        <td class="value" v-if="info.rejectedState==2">
                            <el-select v-model="info.rejectedType" placeholder="请选择退货类型" filterable>
                                <el-option v-for="item in rejectedTypeData" :key="item.codeValue" :label="item.codeName"
                                            :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td class="label" v-if="info.rejectedState==2">退货责任方</td>
                        <td class="value" v-if="info.rejectedState==2">
                            <el-input v-model="info.rejectedDuty" type="text" maxlength="50" placeholder=""></el-input>
                        </td>
                        <td class="label edit">备注</td>
                        <td class="value edit" :colspan="info.rejectedState==2?1:5">
                            <el-input v-model="info.remark" placeholder="请输入备注"></el-input>
                        </td>
                    </tr>
                </table>
                <!--            基本信息-->

                <!--            物料信息-->
                <h3 class="common-title mt_20">
                    <span class="title-name">物料信息</span>
                    <el-button class="fr" size="mini" v-show="info.srcTenantId" @click="showImportMaterial = true">导入物料</el-button>
                </h3>
                <div style="overflow-x: auto;">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="150"><em>*</em>批次号</th>
                            <th width="150">供应商批次号</th>
                            <th width="120">ASN</th>
                            <th width="180"><em>*</em>到货厂商</th>
                            <th width="180"><em>*</em>物料编码</th>
                            <th width="150">物料描述</th>
                            <th width="120"><em>*</em>规格</th>
                            <th width="90"><em>*</em>入库数量</th>
                            <th width="80">管理单位</th>
                            <th width="90">箱数</th>
                            <th width="90">托数</th>
                            <th width="150"><em>*</em>生产日期</th>
                            <th width="150">时代条码编号</th>
                            <th width="50">
                                <el-tooltip effect="dark" content="添加物料" placement="top-start" :hide-after='1000'>
                                    <span @click="addMaterial()" class="add"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in materialData">
                            <td>{{index+1}}</td>
                            <td>
                                <el-input v-model="item.batchNum" type="text" maxlength="50" placeholder=""></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.supplierBatchNum" type="text" maxlength="50"
                                            placeholder=""></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.asn" maxlength="20" placeholder=""></el-input>
                            </td>
                            <td>
                                <el-select v-model="item.fromTenantId" placeholder="请选择到货厂商" filterable
                                            @change="changeFromTenant(index)">
                                    <el-option v-for="item in fromTenantData" :key="item.wId" :label="item.name"
                                                :value="item.wId"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="item.materialId" filterable clearable
                                            @click.native="initItemMateriaOptions(index)"
                                            @change="changeMaterial(index)">
                                    <el-option v-for="i in item.materiaOptions" :key="i.id" :label="i.materialNum"
                                                :value="i.id"></el-option>
                                </el-select>
                            </td>
                            <td>
                                {{ item.materialDesc }}
                            </td>
                            <td>
                                <el-select v-model="item.materialSpecsId" filterable @change="changeMaterialSpecs(index)">
                                    <el-option v-for="i in item.specsList" :key="i.id" :label="i.name"
                                                :value="i.id"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="item.nums" type="text" maxlength="50" v-mydouble4val placeholder=""
                                            @input="calNums(index)"></el-input>
                            </td>
                            <td>
                                {{ item.unitName }}
                            </td>
                            <td>
                                <el-input v-model="item.boxNums" type="text" maxlength="10" v-mynumval placeholder=""
                                            @input="calcNums(index, 1)"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.palletNums" type="text" maxlength="10" v-mynumval placeholder=""
                                            @input="calcNums(index, 2)"></el-input>
                            </td>
                            <td>
                                <el-date-picker @input="$forceUpdate()" v-model="item.produceDate" type="date"
                                                placeholder="选择日期" align="right" :picker-options="pickerOptions" @blur="forceUpdate"
                                                format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </td>
                            <td>
                                <el-input v-model="item.codeNum" type="text" maxlength="50" placeholder=""></el-input>
                            </td>
                            <td>
                                <el-tooltip effect="dark" content="删除物料" placement="top-start" :hide-after='1000'>
                                    <span @click="removeMaterial(index)" class="del"></span>
                                </el-tooltip>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!--            物料信息-->

                <!--            器具信息-->
                <h3 class="common-title mt_20"><span class="title-name">器具信息</span></h3>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="200"><em>*</em>可回收器具</th>
                        <th width="280"><em>*</em>所属人</th>
                        <th width="280"><em>*</em>到货厂商</th>
                        <th width="120"><em>*</em>入库数量</th>
                        <th width="50">
                            <el-tooltip effect="dark" content="添加器具" placement="top-start" :hide-after='1000'>
                                <span @click="addPackMaterial()" class="add"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in packMaterialData">
                        <td>
                            <el-select v-model="item.devDeviceId" filterable clearable style="width: 100%"
                                        placeholder="器具名称">
                                <el-option v-for="item in deviceData" :key="item.id" :label="item.name"
                                            :value="item.id"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.srcTenantId" filterable style="width: 100%">
                                <el-option v-for="i in srcTenantOptions" :key="i.wId" :label="i.name"
                                            :value="i.wId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="item.useTenantId" filterable placeholder="使用客户" style="width: 100%">
                                <el-option v-for="item in fromTenantData2" :key="item.wId" :label="item.name"
                                            :value="item.wId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="item.nums" type="text" v-mynumval placeholder="入库器具数量"
                                        style="width: 100%"></el-input>
                        </td>
                        <td>
                            <el-tooltip effect="dark" content="删除器具" placement="top-start" :hide-after='1000'>
                                <span @click="removePackMaterial(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <!--            器具信息-->
            </div>
            <!--            上一步-->

            <!--            下一步-->
            <div v-show="!showInfo">
                <!--            标签数量信息-->
                <h3 class="common-title">
                    <span class="title-name">标签数量信息</span>
                    <!-- <el-button class="fr" size="mini" v-show="info.srcTenantId"
                               @click="showImportTag = true">导入</el-button> -->
                </h3>
                <div class="tagTable">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="150">批次号</th>
                            <th width="150">标签号</th>
                            <th width="180">物料编码</th>
                            <th width="150">物料描述</th>
                            <th width="150">供应商批次号</th>
                            <th width="100">托装容数</th>
                            <th width="80">箱数</th>
                            <th width="120">数量确认</th>
                            <th width="120">是否尾数</th>
                            <th width="80">上架人</th>
                            <th width="150">上架时间</th>
                            <th width="80">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in materialCodeListFromServer">
                            <td>{{index+1}}</td>
                            <td>
                                {{ item.batchNum }}
                            </td>
                            <td>
                                {{ item.codeNum }}
                            </td>
                            <td>
                                {{ item.materialNum }}
                            </td>
                            <td>
                                {{ item.materialDesc }}
                            </td>
                            <td>
                                {{ item.supplierBatchNum }}
                            </td>
                            <td>
                                {{ item.perPalletNums }}
                            </td>
                            <td>
                                <el-input v-model="item.boxNums" maxlength="50" v-if="!item.onShelvesDate" v-mynumval placeholder="" @input="forceUpdate"></el-input>
                                <span v-if="item.onShelvesDate">{{ item.boxNums }}</span>
                            </td>
                            <td>
                                <el-input v-model="item.nums" maxlength="50" v-if="!item.onShelvesDate"
                                          v-mydouble4val placeholder=""></el-input>
                                <span v-if="item.onShelvesDate">{{ item.nums }}</span>
                            </td>
                            <td>
                                <el-switch v-model="item.isRemainder" v-if="!item.onShelvesDate"
                                           active-color="#ff4949" :active-value="0" active-text="否"
                                           inactive-color="#13ce66" :inactive-value="1" inactive-text="是">
                                </el-switch>
                                <span v-if="item.onShelvesDate">{{ item.isRemainder==0?'否':'是' }}</span>
                            </td>
                            <td>
                                {{ item.onShelvesUserName }}
                            </td>
                            <td>
                                {{ item.onShelvesDate }}
                            </td>
                            <td>
                                <span class="add" style="margin-right: 5px;" @click="addTag(index)"></span>
                                <span class="del" @click="delTag(index)" v-if="!item.onShelvesDate && item.canDelete"></span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!--            标签数量信息-->
            </div>
            <!--            下一步-->
            <div class="bot-btn">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="pre()" v-show="!showInfo">上一步</el-button>
                <el-button type="primary" @click="next()" v-show="showNext">下一步</el-button>
                <el-button type="primary" v-show="showSave" @click="saveInOrder()">保存</el-button>
            </div>
        </div>
        <!-- 导入物料 -->
        <el-dialog title="导入物料" :visible.sync="showImportMaterial" width="400px">
            <el-upload
                    drag
                    class="upload-demo"
                    :on-change="handleChange"
                    action="/"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept=".xls,.xlsx">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，<a href="/download/inOrderMaterial.xlsx" type="primary" style="font-size:12px;color:red;">下载模板</a></div>
            </el-upload>
        </el-dialog>
        <!-- 导入标签数量 -->
        <el-dialog title="导入物料" :visible.sync="showImportTag" width="400px">
            <el-upload
                    drag
                    class="upload-demo"
                    :on-change="tagExcelUplaod"
                    action="/"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept=".xls,.xlsx">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，<a href="/download/inOrderTag.xlsx" type="primary" style="font-size:12px;color:red;">下载模板</a></div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
import updateInOrderForQrcode from './updateInOrderForQrcode.js'

export default updateInOrderForQrcode
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

#updateInOrderForQrcode {
    .disabledView{
        cursor: not-allowed;
        position: relative;
        .fillTbale td,
        .tableCommon,
        .el-input__icon,
        .el-input__suffix-inner,
        .common-title{
            pointer-events: none;
        }
        .fillTbale td.edit{
            pointer-events:initial;
            position: relative;
            z-index: 99999;
        }
    }
    .add {
        vertical-align: middle;
        @include add;
    }

    .del {
        vertical-align: middle;
        @include del;
    }

    .switchDiv {
        padding: 2px 8px;
        border: 1px solid $main-color;
        border-radius: 3px;
        color: $main-color;
        display: inline-block;
        margin-left: 10px;
        vertical-align: top;
        cursor: pointer;

        .name {
            vertical-align: middle;
            margin-left: 8px;
        }
    }
    .tagTable{
        overflow-x: auto;
        .tableCommon{
            border:$border;
            .el-input__inner{
                text-align: center;
            }
        }
    }
}
</style>

