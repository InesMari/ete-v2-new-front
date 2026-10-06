import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
	name: 'storeHouseBillManage',
	data()
	{
		return {
			head:
				[
					{"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
					{"name": "仓库名称", "code": "workName", "width": "200", "type": "text"},
					{"name": "仓库地址", "code": "workAddressStr", "width": "250", "type": "text"},
					{"name": "费用产生月份", "code": "billMonth", "width": "100", "type": "text"},
					{"name": "费用类型", "code": "itemTypeName", "width": "100", "type": "text"},
					{"name": "账单编号", "code": "billNum", "width": "150", "type": "diy"},
					// {"name": "租赁费", "code": "leaseFee", "width": "100", "type": "text"},
					// {"name": "硬件费", "code": "hardwareFee", "width": "100", "type": "text"},
					// {"name": "水费", "code": "waterFee", "width": "100", "type": "text"},
					// {"name": "电费", "code": "energyFee", "width": "100", "type": "text"},
					// {"name": "物业费", "code": "propertyFee", "width": "100", "type": "text"},
					// {"name": "保险费", "code": "insureFee", "width": "100", "type": "text"},
					// {"name": "管理费", "code": "manageFee", "width": "100", "type": "text"},
					// {"name": "其他费", "code": "otherFee", "width": "100", "type": "text"},
					// {"name": "配送费", "code": "waybillFee", "width": "100", "type": "text"},
					// {"name": "本月趟数", "code": "times", "width": "100", "type": "text"},
					// {"name": "回收运输费", "code": "recoveryTransportFee", "width": "100", "type": "text"},
					// {"name": "数量", "code": "sums", "width": "100", "type": "text"},
					// {"name": "单价", "code": "price", "width": "100", "type": "text"},
					// {"name": "金额", "code": "fee", "width": "100", "type": "text"},
					// {"name": "税点", "code": "tax", "width": "100", "type": "text"},
					// {"name": "其他费用增减", "code": "changeFee", "width": "100", "type": "text"},
					// {"name": "增减原因", "code": "changeRemark", "width": "250", "type": "text"},
					{"name": "未税总金额", "code": "totalFee", "width": "100", "type": "text"},
					{"name": "含税总金额", "code": "totalFeeWithTax", "width": "100", "type": "text"},
					{"name": "备注", "code": "remark", "width": "250", "type": "text"},
					{"name": "是否入账", "code": "isEntry", "width": "100", "type": "text"},
					{"name": "是否生成报表", "code": "isEntryRpt", "width": "100", "type": "text"},
					{"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
					{"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
				],
			query: {
				id: '',
				supplierTenantId: this.$route.query.supplierId,
				workId: this.common.isBlank(this.$route.query.workId) ? null: parseInt(this.$route.query.workId),
				workAddressStr: '',
				billMonth: this.common.isBlank(this.$route.query.startDate) ? this.$route.query.billMonth :[this.$route.query.startDate,this.$route.query.endDate],
				isEntry: '',
				isEntryRpt: '',
			},
			supplierData: [],
			workData: [],
			whetherData: [],
			wmsFeeCostItemTypeData: [],
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.initData();
		this.doQuery();
	},
	/**
	 * 绑定函数
	 */
	methods: {
		doQuery(query = this.query)
		{
			this.query = query;
			this.$refs.table.load("wmsCostService", "queryWmsFeeCostPage", this.query);
		},
		async initData()
		{
			let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'WHETHER,WMS_FEE_COST_ITEM_TYPE'});
			this.whetherData = data.WHETHER;
			this.wmsFeeCostItemTypeData = data.WMS_FEE_COST_ITEM_TYPE;
			if(this.type==1||this.type==2){
				this.wmsFeeCostItemTypeData = this.wmsFeeCostItemTypeData.filter((el) => (el.codeValue != '3' && el.codeValue != '4'
					&& el.codeValue != '5' && el.codeValue != '6' && el.codeValue != '8' && el.codeValue != '9' && el.codeValue != '13'));
			}
			//仓库数据
			this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {regionFlag: 1});
			//供应商数据
			this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
		},
		initQuery()
		{
			this.query =
				{
					id: '',
					workId: '',
					supplierTenantId: '',
					tenantName: '',
					billMonth: '',
					workAddressStr: '',
					isEntry: '',
					isEntryRpt: '',
				};
		},
		dblclickItem(item)
		{
			this.openPage(3, item);
		},
		/**
		 * 显示新增弹出框
		 * type 1 新增  2 修改  3 查看
		 */
		openPage(type, item)
		{
			let param = {type: type};
			let urlName = '';
			if (type == 1)
			{
				urlName = '新增月成本';
			}
			else if (type == 2)
			{
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1)
				{
					this.$message.error("请选择一条数据!");
					return false;
				}
				param.id = selectData[0].id;
				if (this.common.isNotBlank(selectData[0].billNum))
				{
					this.$message.error("已入账数据不允许修改！");
					return false;
				}
				urlName = '修改月成本';
			}
			else if (type == 3)
			{
				param.id = item.id;
				urlName = '查看月成本';
			}
			this.$emit('openTab', {
				urlName: urlName,
				urlId: 'storeHouseBillDetail' + new Date().getTime(),
				urlPathName: "/storeHouseBillDetail",
				urlPath: "/pt/fc/storehouse/storeHouseBillDetail.vue",
				query: param,
			});
		},
		async deleteWmsFeeCost()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length != 1)
			{
				this.$message.error("请选择一条需要删除的数据");
				return false;
			}
			let that = this;
			that.$confirm("确认删除月成本？", "提示").then(() =>{
				that.common.postUrl("wmsCostService", "deleteWmsFeeCostById", {id: selectData[0].id}, function (data)
				{
					that.doQuery();
					that.$message.success("删除成功！");
				},null,'',true);
			}).catch(() =>{});
		},
		toFcSupplierBillDetail(data)
		{
			this.$emit('openTab', {
				urlName: '账单明细',
				urlId: 'confirmSupplierBillDetail_' + data.billId,
				urlPathName: "/fc",
				urlPath: "/pt/fc/supplierBill/detail/confirmBillDetail.vue",
				query: {fcSupplierBillId: data.billId},
			});
		},
		downExcel()
		{
			this.$refs.table.downloadExcelFile();
		},
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		searchList
	},
	computed:{
		formData(){
			return [
				// {"name":"供应商名称","model":"tenantName","type":"input","placeholder":"供应商名称","isshow":true},
				{"name":"仓库名称","model":"workId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
				{"name":"费用类型","model":"itemType","type":"select","options":this.wmsFeeCostItemTypeData,"label":"codeName","value":"codeValue","codeName":"doQuery","isshow":true},
				{"name":"供应商","model":"supplierTenantId","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","placeholder":"供应商","method":"doQuery","isshow":true,if:this.$route.query.t == 1},
				{"name":"仓库地址","model":"workAddressStr","type":"input","placeholder":"仓库地址","isshow":true},
				{"name":"费用产生月份","model":"billMonth","type":"month","isshow":true},
				{"name":"是否入账","model":"isEntry","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
				{"name":"是否生成报表","model":"isEntryRpt","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否生成报表","method":"doQuery","isshow":true},
			]
		}
	},
}
