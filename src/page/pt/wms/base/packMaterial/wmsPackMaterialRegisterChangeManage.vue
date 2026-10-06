<template>
	<div id="wmsPackMaterialRegisterChangeManage">
		<select-work v-show="showSelWork"></select-work>
		
		<!-- 列表相关  开始 -->
		<div class="search-list clearfix" v-show="!showSelWork">
			<div class="search-form clearfix" @keyup.enter="doQuery()">
				<div class="item">
					<label class="label">包材名称：</label>
					<div class="input-text">
						<el-input v-model="query.name" placeholder="包材名称" type="text"></el-input>
					</div>
				</div>
				<div class="item">
					<label class="label">供应商：</label>
					<div class="input-text">
						<el-input v-model="query.tenantName" placeholder="供应商" type="text"></el-input>
					</div>
				</div>
				<div class="item">
					<label class="label">审核状态：</label>
					<div class="input-text">
						<el-select v-model="query.verifyState" @change="doQuery(query)" clearable filterable
								   placeholder="审核状态">
							<el-option v-for="item in verifyStateData" :key="item.codeValue" :label="item.codeName"
									   :value="item.codeValue"></el-option>
						</el-select>
					</div>
				</div>
			</div>
			<div class="search-btn clearfix">
				<div class="btn">
					<el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询
					</el-button>
				</div>
				<div class="btn">
					<el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空
					</el-button>
				</div>
			</div>
			<!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
			<div class="search-bot">
				<img src="@/static/image/search-bot.png" alt="">
				<i class="icon el-icon-arrow-down"></i>
				<i class="icon el-icon-arrow-up"></i>
			</div>
		</div>
		
		<div class="table-content" v-show="!showSelWork">
			<div class="table-title">
				<h3>
					<span>包材成本异动列表</span>
					<el-tooltip effect="light" content="包材成本异动列表" placement="right">
						<img class="tip" src="@/static/image/tip.png" alt="">
					</el-tooltip>
				</h3>
				<div class="table-title-btn" style="margin-right: 90px;">
					<el-button type="danger" plain @click="deleteChange" size="mini" v-entity="1005145">删除</el-button>
					<el-button type="primary" plain @click="verifyChange" size="mini" v-entity="1005146">审核</el-button>
					<el-button type="primary" plain @click="detailChange" size="mini" v-entity="1005147">查看</el-button>
				</div>
			</div>
			<tableCommon tableName="wmsPackMaterialRegisterChangeManageTable" ref="table" :head="head" :showNum="true"
						 :showSetTable="true" :singleSelect="true">
			</tableCommon>
		</div>
		<!-- 列表相关  结束 -->
	
	</div>
</template>

<script>
import wmsPackMaterialRegisterChangeManage from './wmsPackMaterialRegisterChangeManage.js'

export default wmsPackMaterialRegisterChangeManage
</script>
<style lang="scss">
#wmsPackMaterialRegisterChangeManage {

}
</style>
