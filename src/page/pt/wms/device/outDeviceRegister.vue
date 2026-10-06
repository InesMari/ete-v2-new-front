<template>
	<div id="outDeviceRegister" class="addOrderPage orderPage">
		<div class="common-info" style="border:none;padding:0;">

            <!--			基本信息-begin-->
			<h3 class="common-title"><span class="title-name">基本信息</span></h3>
			<ul class="content clearfix mt_20">
                <li class="item item50" v-show="isOnlySee">
                    <label class="label-term">登记单号</label>
                    <div class="input-text">
                        <el-input v-model="record.recordNum" :disabled="isOnlySee" type="text"></el-input>
                    </div>
                </li>
				<li class="item item50">
					<label class="label-term"><em>*</em>登记类型</label>
					<div class="input-text">
						<el-select v-model="record.dealType" filterable clearable disabled placeholder="登记类型">
							<el-option v-for="item in dealTypeData" :key="item.codeValue" :label="item.codeName"
									   :value="item.codeValue"></el-option>
						</el-select>
					</div>
				</li>
				<li class="item item50">
					<label class="label-term"><em>*</em>实际日期</label>
					<div class="input-text">
						<el-date-picker v-model="record.actualDate" type="date" :disabled="isOnlySee"
										   placeholder="选择日期" align="right" :picker-options="pickerOptions"
										   format="yyyy-MM-dd" value-format="yyyy-MM-dd">
						</el-date-picker>
					</div>
				</li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>供应商</label>
                    <div class="input-text">
                        <el-select v-model="record.supplierTenantId" placeholder="供应商" filterable clearable :disabled="isOnlySee">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>交付地</label>
                    <div class="input-text">
                        <el-select v-model="record.destWorkId" filterable clearable :disabled="isOnlySee" placeholder="交付地">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </li>
				<li class="item item100">
					<label class="label-term">备注</label>
					<div class="input-text">
						<el-input v-model="record.remark" :disabled="isOnlySee" placeholder="写点什么..." type="text"></el-input>
					</div>
				</li>
			</ul>
            <!--			基本信息-end-->

			<!--			器具登记明细-begin-->
			<h3 class="common-title mt_20"><span class="title-name">器具登记明细</span></h3>
			<table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="costDetail">
				<thead>
				<tr>
					<th width="20%"><em>*</em>器具名称</th>
					<th width="8%">器具规格</th>
					<th width="19%"><em>*</em>使用客户</th>
					<th width="9%"><em>*</em>数量</th>
					<th width="9%">回收收入单价</th>
					<th width="9%"><em>*</em>回收收入金额</th>
					<th width="9%">运输成本单价</th>
					<th width="9%"><em>*</em>运输成本金额</th>
					<th width="6%" v-show="!isOnlySee">
						<el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
							<span @click="addDetailItem()" class="add"></span>
						</el-tooltip>
					</th>
				</tr>
				</thead>
				<tbody>
				<tr  v-for="(item, index) in detailList">
					<td>
						<el-select v-model="item.deviceId" filterable clearable :disabled="isOnlySee"
								   @change="changeDevice(item)" placeholder="器具名称">
							<el-option v-for="item in deviceData" :key="item.id" :label="item.name"
									   :value="item.id"></el-option>
						</el-select>
					</td>
					<td>
						<el-input v-model="item.spec" disabled placeholder="请选择器具"></el-input>
					</td>
					<td>
						<el-select v-model="item.useTenantId" filterable clearable :disabled="isOnlySee" placeholder="使用客户">
							<el-option v-for="item in tenantData" :key="item.wId" :label="item.name"
									   :value="item.wId"></el-option>
						</el-select>
					</td>
					<td>
						<el-input v-model="item.dealNum" maxlength="11" v-mynumval @input="changeDealNum" :disabled="isOnlySee" placeholder="数量"></el-input>
					</td>
                    <td>
                        <el-input v-model="item.incomePrice" v-mydoubleval disabled placeholder="收入单价"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.incomeFee" v-mydoubleval disabled placeholder="收入金额"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.transportPrice" v-mydoubleval disabled placeholder="运输单价"></el-input>
                    </td>
					<td>
						<el-input v-model="item.fee" v-mydoubleval disabled placeholder="成本金额"></el-input>
					</td>
					<td v-show="!isOnlySee">
						<el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
							<span @click="removeDetailItem(item, index)" class="del"></span>
						</el-tooltip>
					</td>
				</tr>
				</tbody>
                <tfoot>
                <tr>
                    <td>合计：</td>
                    <td></td>
                    <td></td>
                    <td class="red fw">{{ record.dealNum }}</td>
                    <td></td>
                    <td class="red fw">{{ record.totalIncomeFee }}</td>
                    <td></td>
                    <td class="red fw">{{ record.totalFee }}</td>
                    <td v-show="!isOnlySee"></td>
                </tr>
                </tfoot>
			</table>
			<!--			器具登记明细-end-->

            <h3 class="common-title mt_20"><span class="title-name">附件信息</span></h3>
            <ul class="content clearfix mt_20">
                <li class="item item50">
                    <label class="label-term">附件</label>
                    <div class="input-text">
                        <myFileModel ref="img" :disabledEdit="isOnlySee" :disabledDel="isOnlySee" ></myFileModel>
                    </div>
                </li>
            </ul>

			<div class="page-bot-btn">
				<el-button @click="closePage(false)">关闭</el-button>
				<el-button type="primary" @click="sureOutDeviceRecord()" v-show="!isOnlySee">确认登记</el-button>
			</div>
		</div>

	</div>
</template>

<script>
import outDeviceRegister from './outDeviceRegister.js'

export default outDeviceRegister
</script>

<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
<style lang="scss">
#outDeviceRegister {
	tr td .el-select {
		width: 100%;
	}
}
</style>
