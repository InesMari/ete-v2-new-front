<template>
	<div id="wmsPackMaterialChange" class="addOrderPage orderPage">
		<div class="common-info" style="border:none;padding:0;">
			<h3 class="common-title"><span class="title-name">基本信息</span></h3>
			<table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
					<td class="label">包材登记类型</td>
					<td class="value">{{record.opTypeName}}</td>
					<td class="label">登记总数量</td>
					<td class="value">{{record.nums}}</td>
					<td class="label" >实际时间</td>
					<td class="value">
						<el-date-picker v-model="record.realDate" type="datetime" align="right"
										format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
						</el-date-picker>
					</td>
				</tr>
				<tr>

					<td class="label">登记人</td>
					<td class="value">{{record.createUserName}}</td>
					<td class="label">登记时间</td>
					<td class="value">
						<el-date-picker v-model="record.createDate" type="datetime" align="right"
										format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
						</el-date-picker>
					</td>
					<td class="label">备注</td>
					<td class="value">{{record.remark}}</td>
				</tr>
			</table>
			
			<h3 class="common-title mt_20"><span class="title-name">收入费用情况</span></h3>
			<table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
				<thead>
				<tr>
					<th>序号</th>
					<th>费用项目名称</th>
					<th>单位</th>
					<th>税率</th>
					<th>含税价</th>
					<th>数量</th>
					<th>含税金额</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item, index)  in feeList">
					<td>{{ index + 1 }}</td>
					<td>{{ item.itemName }}</td>
					<td>{{ item.unit }}</td>
					<td>{{ item.tax }}</td>
					<td>{{ item.priceWithTax }}</td>
					<td>{{ item.num }}</td>
					<td>{{ item.totalFeeWithTax }}</td>
				</tr>
				</tbody>
			</table>

			<h3 class="common-title mt_20"><span class="title-name">成本费用情况</span></h3>
			<table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="costDetail">
				<thead>
				<tr>
					<th width="10%">费用项目名称</th>
					<th width="20%"><em>*</em>包材名称</th>
					<th width="20%"><em>*</em>到货厂商</th>
					<th width="20%">供应商</th>
					<th width="15%"><em>*</em>数量</th>
					<th width="15%">金额</th>
				</tr>
				</thead>
				<tbody>
				<tr  v-for="(item, index) in costList">
					<td>
						{{item.opTypeName}}
					</td>
					<td>
						{{item.packName}}
					</td>
					<td>
						{{item.srcTenantName}}
					</td>
					<td>
						{{item.tenantName}}
					</td>
					<td>
						{{item.nums}}
					</td>
					<td>
						{{item.totalFee}}
					</td>
				</tr>
				</tbody>
			</table>
			
<!--			<h3 class="common-title mt_20"><span class="title-name">费用异动记录</span></h3>-->
<!--			<table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">-->
<!--				<thead>-->
<!--				<tr>-->
<!--					<th>序号</th>-->
<!--					<th>金额</th>-->
<!--					<th>审核状态</th>-->
<!--					<th>审核人</th>-->
<!--					<th>审核时间</th>-->
<!--					<th>备注</th>-->
<!--				</tr>-->
<!--				</thead>-->
<!--				<tbody>-->
<!--				<tr v-for="(item, index)  in changeList">-->
<!--					<td>{{ index + 1 }}</td>-->
<!--					<td>{{ item.totalFee }}</td>-->
<!--					<td>{{ item.verifyStateName }}</td>-->
<!--					<td>{{ item.verifyUserName }}</td>-->
<!--					<td>{{ item.verifyDate }}</td>-->
<!--					<td>{{ item.remark }}</td>-->
<!--				</tr>-->
<!--				</tbody>-->
<!--			</table>-->
<!--			-->
<!--			&lt;!&ndash;			异动&ndash;&gt;-->
<!--			<h3 class="common-title mt_20" v-show="show">-->
<!--				<span class="title-name">费用异动-->
<!--					<div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;">-->
<!--						注1：费用异动填写的是费用变动值! 注2：异动需要做审核！-->
<!--					</div>-->
<!--				</span>-->
<!--			</h3>-->
<!--			<ul class="content clearfix" v-show="show">-->
<!--				<li class="item item50">-->
<!--					<label class="label-term"><em>*</em>异动金额</label>-->
<!--					<div class="input-text">-->
<!--						<el-input v-model="cost.fee" maxlength="11" placeholder="异动金额" @input="calc"></el-input>-->
<!--					</div>-->
<!--				</li>-->
<!--				<li class="item item50">-->
<!--					<label class="label-term"><em>*</em>异动后金额</label>-->
<!--					<div class="input-text">-->
<!--						<el-input v-model="cost.afterFee" disabled placeholder="异动后金额"></el-input>-->
<!--					</div>-->
<!--				</li>-->
<!--				<li class="item item100">-->
<!--					<label class="label-term">异动备注</label>-->
<!--					<div class="input-text">-->
<!--						<el-input v-model="cost.remark" placeholder="异动备注" type="text"></el-input>-->
<!--					</div>-->
<!--				</li>-->
<!--			</ul>-->
			
			<div class="page-bot-btn">
				<el-button @click="closePage()">关闭</el-button>
				<el-button type="primary" @click="saveChange()" v-show="show">提交</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import wmsPackMaterialChange from './wmsPackMaterialChange.js'

export default wmsPackMaterialChange
</script>
<style lang="scss">
#wmsPackMaterialChange {
	tr td .el-select {
		width: 100%;
	}
}
</style>
