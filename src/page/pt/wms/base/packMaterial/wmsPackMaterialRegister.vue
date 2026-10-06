<template>
    <div id="wmsPackMaterialRegister" class="addOrderPage orderPage">
        <div class="common-info" style="border:none;padding:0;">

            <!--			基本信息 -->
			<h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" style="table-layout: fixed" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>登记类型</td>
                    <td class="value">
                        <el-select v-model="record.dealType" filterable placeholder="登记类型"
                                   @change="changeDealType">
                            <el-option v-for="item in dealTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>{{tipName}}</td>
                    <td class="value">
                        <el-select v-model="record.workId" filterable :placeholder="tipName"
                                    @change="getDeviceRecoveryFeeList">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>实际日期</td>
                    <td class="value">
                        <el-date-picker v-model="record.actualDate" type="date"
                                        placeholder="选择日期" align="right" :picker-options="pickerOptions"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </td>
                    <td rowspan="2" class="label">
                        <p>附件</p>
                    </td>
                    <td rowspan="2" style="width: 110px;">
                        <div class="input-text" style="margin-top: 5px;">
                            <myFileModel ref="devImg"></myFileModel>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" colspan="5">
                        <div class="input-text">
                            <el-input v-model="record.remark" type="textarea" placeholder="写点什么..."
                            rows="3"></el-input>
                        </div>
                    </td>
                </tr>
            </table>
            <!--			基本信息-->

			<!--			器具登记明细 -->
			<h3 class="common-title mt_20"><span class="title-name">器具登记明细</span></h3>
			<table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="costDetail">
				<thead>
				<tr>
					<th width="20%"><em>*</em>器具名称</th>
					<th width="8%">器具规格</th>
					<th width="20%"><em>*</em>所属人</th>
					<th width="20%"><em>*</em>使用客户</th>
					<th width="12%"><em>*</em>数量</th>
<!--					<th width="12%"><em>*</em>金额</th>-->
					<th width="6%">
						<el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
							<span @click="addDetailItem()" class="add"></span>
						</el-tooltip>
					</th>
				</tr>
				</thead>
				<tbody>
				<tr  v-for="(item, index) in detailList">
					<td>
						<el-select v-model="item.deviceId" filterable placeholder="器具名称"
								   @change="changeDevice(item)">
							<el-option v-for="item in deviceData" :key="item.id" :label="item.name"
									   :value="item.id"></el-option>
						</el-select>
					</td>
					<td>
						<el-input v-model="item.spec" disabled placeholder="请选择器具"></el-input>
					</td>
					<td>
						<el-select v-model="item.srcTenantId" filterable clearable placeholder="所属人"
                                   @change="changeSrcTenant(item)">
							<el-option v-for="item in tenantData" :key="item.wId" :label="item.name"
									   :value="item.wId"></el-option>
						</el-select>
					</td>
					<td>
						<el-select v-model="item.useTenantId" filterable clearable placeholder="使用客户"
                                   :disabled="item.useTenantDisable" @change="changeUseTenant(item)">
							<el-option v-for="item in tenantData2" :key="item.wId" :label="item.name"
									   :value="item.wId"></el-option>
						</el-select>
					</td>
					<td>
						<el-input v-model="item.dealNum" maxlength="11" v-mynumval
                                  @input="changeDealNum" placeholder="数量"></el-input>
					</td>
<!--					<td>-->
<!--						<el-input v-model="item.fee" v-mydoubleval @input="calcTotalFee" placeholder="金额"></el-input>-->
<!--					</td>-->
					<td>
						<el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
							<span @click="removeDetailItem(item, index)" class="del"></span>
						</el-tooltip>
					</td>
				</tr>
				</tbody>
			</table>
			<!--			器具登记明细-->

            <!--			收入信息-->
			<h3 class="common-title mt_20" >
                <span class="title-name">收入信息</span>
                <el-button class="fr" size="mini" type="primary" style="margin-top:6px;"
                           @click="openSelectDialog(true)">选择收入</el-button>
            </h3>
            <div style="overflow-x: auto;">
			<table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="feeDetail">
				<thead>
				<tr>
					<th width="50">序号</th>
					<th width="150">费用类型</th>
					<th width="150">作业名称</th>
<!--					<th width="150">器具名称</th>-->
<!--					<th width="150">器具规格</th>-->
					<th width="250">使用客户</th>
					<th width="100">计费单位</th>
					<th width="100">未税单价</th>
					<th width="100">税率(%)</th>
                    <th width="100">含税单价</th>
					<th width="100">数量</th>
					<th width="100">不含税金额</th>
					<th width="100">含税金额</th>
                    <th width="50">操作</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item, index)  in feeList">
					<td>{{ index + 1 }}</td>
					<td>{{ item.itemTypeName }}</td>
					<td>{{ item.itemName }}</td>
<!--                    <td>-->
<!--                        <el-select v-model="item.deviceId" filterable-->
<!--                                   @change="changeDevice(item)" placeholder="器具名称">-->
<!--                            <el-option v-for="item in deviceData" :key="item.id" :label="item.name"-->
<!--                                       :value="item.id"></el-option>-->
<!--                        </el-select>-->
<!--                    </td>-->
<!--                    <td>{{ item.spec }}</td>-->
                    <td>{{item.srcTenantName}}</td>
					<td>{{ item.unit }}</td>
                    <td>{{ item.price }}</td>
					<td>{{ item.tax }}</td>
					<td>{{ item.priceWithTax }}</td>
					<td>
						<el-input v-model="item.num" maxlength="11" v-mydouble4val placeholder="数量"
								  @input="calItemFee()"></el-input>
					</td>
					<td>{{ item.totalFee }}</td>
					<td>{{ item.totalFeeWithTax }}</td>
                    <td>
                        <el-tooltip effect="dark" placement="top-start" :hide-after='1000'>
                            <span @click="removeFeeItem(item, index)" class="del"></span>
                        </el-tooltip>
                    </td>
				</tr>
				</tbody>
				<tfoot>
				<tr>
					<td>合计：</td>
                    <td></td>
                    <td></td>
<!--                    <td></td>-->
<!--                    <td></td>-->
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="red fw">{{ totalInfo.num }}</td>
                    <td class="red fw">{{ totalInfo.totalFee }}</td>
                    <td class="red fw">{{ totalInfo.totalFeeWithTax }}</td>
                    <td></td>
				</tr>
				</tfoot>
			</table>
            </div>
            <!--			收入信息-->

            <!--            成本信息-->
            <h3 class="common-title mt_20"><span class="title-name">成本信息</span></h3>
            <div style="overflow-x: auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="costDetail">
                <thead>
                <tr>
                    <th width="50">序号</th>
                    <th width="150">费用类型</th>
                    <th width="150">作业名称</th>
<!--                    <th width="150">器具名称</th>-->
<!--                    <th width="150">器具规格</th>-->
                    <th width="250">使用客户</th>
                    <th width="100">计费单位</th>
                    <th width="100">外包作业</th>
                    <th width="250">外包供应商</th>
                    <th width="100">未税价</th>
                    <th width="100">税率(%)</th>
                    <th width="100">含税价</th>
                    <th width="100">数量</th>
                    <th width="100">未税金额</th>
                    <th width="100">含税金额</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index)  in costList">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.itemTypeName }}</td>
                    <td>{{ item.itemName }}</td>
<!--                    <td>-->
<!--                        <el-select v-model="item.deviceId" filterable-->
<!--                                   @change="changeDevice(item)" placeholder="器具名称">-->
<!--                            <el-option v-for="item in deviceData" :key="item.id" :label="item.name"-->
<!--                                       :value="item.id"></el-option>-->
<!--                        </el-select>-->
<!--                    </td>-->
<!--                    <td>{{ item.spec }}</td>-->
                  <td>{{item.srcTenantName}}</td>
                  <td>{{ item.unit }}</td>
                    <td>
                        <el-switch v-model="item.isWorkOrder == 1"
                                   @change="changeCostSwitch(item)"
                                   :disabled="item.disabled && item.optionalFlag"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   active-text="是"
                                   inactive-text="否">
                        </el-switch>
                    </td>
                    <td>
                        <el-select v-model="item.tenantId" placeholder="请选择供应商" filterable
                                   :disabled="item.disabled"
                                   @change="changeSupplier(item, index)">
                            <el-option v-for="supplier in item.supplierData" :key="supplier.tenantId"
                                       :label="supplier.tenantName"
                                       :value="supplier.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.price" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.tax" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.priceWithTax" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.num" type="text" v-mydouble4val
                                  :placeholder="item.disabled ? '' : '请输入数量'"
                                  @input="calcCostTotal" :disabled="item.disabled"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.totalFee" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.totalFeeWithTax" type="text" disabled></el-input>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>合计：</td>
                    <td></td>
                    <td></td>
<!--                    <td></td>-->
<!--                    <td></td>-->
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="red fw">{{ totalInfo.costNum }}</td>
                    <td class="red fw">{{ totalInfo.costTotalFee }}</td>
                    <td class="red fw">{{ totalInfo.costTotalFeeWithTax }}</td>
                </tr>
                </tfoot>
            </table>
            </div>
            <!--            成本信息-->

            <div class="page-bot-btn">
                <el-button @click="closePage(false)">关闭</el-button>
                <el-button type="primary" @click="sureRecord()">确认登记</el-button>
            </div>
        </div>

        <!--        选择收入-->
        <el-dialog class="operateDialog" title="计费项目操作" :visible.sync="isShowDialog" width="1200px" >
            <dbTable ref="dbTable" :head="feeHead" onlyId="onlyId"></dbTable>
            <div class="bot-btn">
                <el-button @click="openSelectDialog(false)">关闭</el-button>
                <el-button type="primary" @click="saveChangeFeeItem">保存</el-button>
            </div>
        </el-dialog>
        <!--        选择收入-->

	</div>
</template>

<script>
import wmsPackMaterialRegister from './wmsPackMaterialRegister.js'

export default wmsPackMaterialRegister
</script>

<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
<style lang="scss">
#wmsPackMaterialRegister {
	tr td .el-select {
		width: 100%;
	}
}
</style>
