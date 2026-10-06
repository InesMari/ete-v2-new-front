import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";


export default {
	name: 'packPurchaseManage',
	data()
	{
		return {
			head: [
				{"name": "采购单号", "code": "purchaseOrderNum", "width": "150", "type": "text"},
				{"name": "采购供应商", "code": "supplierName", "width": "250", "type": "text"},
				{"name": "客户", "code": "tenantName", "width": "250", "type": "text"},
				{"name": "采购单状态", "code": "stateName", "width": "90", "type": "text"},
				{"name": "包装名称", "code": "packName", "width": "180", "type": "text"},
				{"name": "包装类型", "code": "packTypeName", "width": "120", "type": "text"},
				{"name": "长宽高", "code": "goodsModel", "width": "200", "type": "text"},
				{"name": "实际采购数量", "code": "purchaseNums", "width": "110", "type": "text"},
				{"name": "已经收货数量", "code": "hasPurchaseNums", "width": "110", "type": "text"},
				{"name": "含税单价", "code": "price", "width": "80", "type": "text"},
				{"name": "税点", "code": "taxRate", "width": "200", "type": "text"},
				{"name": "含税价", "code": "totalFeeWithTax", "width": "200", "type": "text"},
				{"name": "不含税价", "code": "totalFee", "width": "200", "type": "text"},
				{"name": "采购时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "采购人", "code": "createUserName", "width": "200", "type": "text"},
			],
			supplierData: [],
			customerData: [],
			stateData: [],
			packNameData: [],
			tenantPackNameData: [],
			packTypeData: [],
			purchaseShow: false,
			isOnlySee: true,
			title: '新增包装采购单',
			query: this.initQuery(
				this.common.isBlank(this.$route.query.tenantId) ? '' : this.$route.query.tenantId.toString(),
				this.common.isBlank(this.$route.query.supplierId) ? '' : Number(this.$route.query.supplierId)),
			purchase: this.initPurchase(),
			workData: [],
			pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,
			tableData: [],
			logisticsModeData: [],
			showAddButton: false,//确认新增按钮
			showUpdateButton: false,//修改按钮
			showUploadPage: false,//展示上传
			uploadParam: this.initUploadParam(),
			showBeginCalculateFee: false,
			calculateFeeParam: {changeDate: null, oId: ''},
			
			sureReceivedWay: true, //默认是上传Excel模式
			sureReceivedTableData: [],
			sureReceivedWorkData: [],
		}
	},
	/**
	 * 初始化
	 */
	async mounted()
	{
		await this.initData();
		await this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		myFileModel,
		myElDatePicker,
		myImport,
		searchList
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery(query=this.query)
		{
			this.query = query;
			await this.$refs.table.load("purchaseTF", "queryPurchasePage", this.query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			let aaa = this;
			//所有可开票供应商
			this.supplierData = await this.common.postUrl("supplierTF", "queryInvoiceFlgSupplier", {});
			//客户（物流运输模式）
			this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID, logisticsMode: [3,5,7]});
			if(this.common.isNotBlank(this.$route.query.tenantId)){
				let boo = true;
				for (let i = 0; i < this.customerData.length; i++)
				{
					if (this.customerData[i].tenantId == this.$route.query.tenantId){
						boo = false;
						break;
					}
				}
				if(boo){
					this.query.tenantId = '';
				}
			}
			//采购单状态
			this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_ORDER_STATE"});
			//包装名称
			this.packNameData = await this.common.postUrl("purchaseTF", "loadPackNameData", {});
			//包装类型
			this.packTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "GOODS_PACKING_TYPE"});
			//客户物流模式
			this.logisticsModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "LOGISTICS_MODE"});
			for (let i = 0; i < this.logisticsModeData.length; i++)
			{
				if (this.logisticsModeData[i].codeValue != 3 || this.logisticsModeData[i].codeValue != 5 || this.logisticsModeData[i].codeValue != 7)
					this.logisticsModeData.splice(i, 1);
			}
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery(tenantId,suppierTenantId)
		{
			this.query = {
				purchaseOrderNum: '',
				suppierTenantId: suppierTenantId,
				tenantId: tenantId,//客户详情采购管理跳转
				state: '',
				packId: '',
				packType: '',
			};
			return this.query;
		},
		/**
		 * 清空
		 * @returns
		 */
		clear()
		{
			this.query = {};
		},
		/**
		 * 初始化采购单
		 */
		initPurchase()
		{
			return this.purchase = {
				suppierTenantId: '',
				tenantId: '',
				packId: '',
				purchaseNums: '',
				price: '',
				taxRate: '',
				totalFeeWithTax: '',
				totalFee: '',
			};
		},
		/**
		 * 初始化对象
		 * @returns {{requireDeliverDate: string, deliverNums: string, workId: string}}
		 */
		initSingleData()
		{
			return {
				workId: '',
				deliverNums: '',
				requireDeliverDate: '',
			};
		},
		/**
		 * 初始化上传对象
		 */
		initUploadParam()
		{
			return {
				purchaseOrderNum: '',
				purchaseNums: '',
				hasPurchaseNums: '',
			}
		},
		/**
		 * 初始化确认收货方式二表格的对象
		 */
		initSureReceivedTable(workId)
		{
			return {
				workId: workId,
				begin: '',
				end: '',
			}
		},
		/**
		 * 展示采购单信息
		 * @param flag
		 * @param type 1新增 2修改 3查看
		 * @param data 展示数据
		 */
		async showPurchase(flag, type, data)
		{
			if (flag)
			{
				let selectData = this.$refs.table.getSelectItem();
				if (type === 1)
				{
					this.initPurchase();
					this.tableData = [];
					this.addData();
					this.title = '新增包装采购单';
					this.isOnlySee = false;
					this.showAddButton = true;
					this.showUpdateButton = false;
				}
				else if (type === 2)
				{
					if (selectData.length !== 1)
					{
						this.$message.error("请选择一条需要修改的采购单!");
						return false;
					}
					if (selectData[0].state == enumData.PURCHASE_ORDER_STATE.SURE_RECEIVED)
					{
						this.$message.error("确认收货的采购单无法修改!");
						return false;
					}
					this.purchase = this.common.copyObj(selectData[0]);
					await this.loadWorkData();//加载作业点数据
					await this.loadPackNameData();//加载包装数据
					this.tableData = await this.loadTableData(this.purchase.oId);
					this.initWorkDisabled();//作业点禁用处理
					this.title = '修改包装采购单';
					this.isOnlySee = false;
					this.showAddButton = false;
					this.showUpdateButton = true;
				}
				else
				{
					if (this.common.isNotBlank(data))
						selectData[0] = data;
					if (selectData.length !== 1)
					{
						this.$message.error("请选择一条需要查看的采购单!");
						return false;
					}
					this.purchase = this.common.copyObj(selectData[0]);
					await this.loadWorkData();//加载作业点数据
					await this.loadPackNameData();//加载包装数据
					this.tableData = await this.loadTableData(this.purchase.oId);
					this.title = '查看包装采购单';
					this.isOnlySee = true;
					this.showAddButton = false;
					this.showUpdateButton = false;
				}
			}
			this.purchaseShow = flag;
		},
		/**
		 * 选择客户提示
		 */
		selectCustomerTip()
		{
			if (!this.isOnlySee)
			{
				let tip = "";
				for (let i = 0; i < this.logisticsModeData.length; i++)
				{
					tip += this.logisticsModeData[i].codeName;
					if (i < this.logisticsModeData.length - 1)
						tip += ",";
				}
				if (this.customerData.length === 0)
				{
					this.$message.error("系统当前组织没有物流模式为：" + tip + "  的客户,请先前往销售开发菜单下面的客户管理菜单新增客户！");
					return false;
				}
			}
		},
		/**
		 * 选择包装提示
		 */
		selectPackTip()
		{
			if (!this.isOnlySee)
			{
				if (this.common.isBlank(this.purchase.tenantId))
				{
					this.$message.error("请先选择客户！");
					return false;
				}
			}
		},
		/**
		 * 双击详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.showPurchase(true, 3, data);
		},
		/**
		 * 改变客户
		 */
		async changeCustomer()
		{
			await this.loadWorkData();
			await this.loadPackNameData();
		},
		/**
		 * 加载作业点数据
		 */
		async loadWorkData()
		{
			this.workData = [];
			this.tableData.forEach(item => item.workId = '');
			if (this.common.isNotBlank(this.purchase.tenantId))
			{
				this.workData = await this.common.postUrl("workGoodsTF","queryWorkDataSelect", {tenantId : this.purchase.tenantId});
				this.workData.forEach(item => item.disabled = false);
			}
		},
		/**
		 * 加载包装名称数据
		 */
		async loadPackNameData()
		{
			if (this.common.isNotBlank(this.purchase.tenantId))
			{
				this.tenantPackNameData = await this.common.postUrl("purchaseTF","loadPackNameData", {tenantId : this.purchase.tenantId});
			}
			else
			{
				this.purchase.packId = '';
				this.tenantPackNameData = [];
			}
		},
		/**
		 * 加载配送数量
		 */
		async loadTableData(oId)
		{
			let purchaseDeliverData = await this.common.postUrl("purchaseTF","loadPurchaseDeliverData", {oId : oId});
			purchaseDeliverData.forEach(item => {
				item.workId = item.workId + "";//展示类型匹配
			})
			return purchaseDeliverData;
		},
		/**
		 * 初始化作业点可选状态
		 */
		initWorkDisabled()
		{
			this.workData.forEach(item => {
				item.disabled = false;
				this.tableData.forEach(itemW => {
					if (item.workId == itemW.workId){ item.disabled = true; }
				})
			});
		},
		initSureReceivedWorkDisabled()
		{
			this.sureReceivedWorkData.forEach(item => {
				item.disabled = false;
				this.sureReceivedTableData.forEach(itemW => {
					if (item.workId == itemW.workId){ item.disabled = true; }
				})
			});
		},
		/**
		 * 更新数据
		 */
		forceUpdate()
		{
			this.$forceUpdate();
		},
		/**
		 * 增加配送数据
		 */
		addData()
		{
			if (this.tableData.length > 19)
			{
				this.$message.error("不允许新增超过20个！");
				return false;
			}
			this.tableData.push(this.initSingleData());
		},
		/**
		 * 移除配送数据
		 */
		removeData(index)
		{
			if (this.tableData.length > 1)
				this.tableData.splice(index, 1);
		},
		
		/**
		 * 增加确认收货数据
		 */
		addSureReceivedData()
		{
			if (this.tableData.length > 19)
			{
				this.$message.error("不允许新增超过20个！");
				return false;
			}
			this.sureReceivedTableData.push(this.initSureReceivedTable(''));
		},
		/**
		 * 移除确认收货数据
		 */
		removeSureReceivedData(index)
		{
			if (this.sureReceivedTableData.length > 1)
				this.sureReceivedTableData.splice(index, 1);
		},
		/**
		 * 计算费用
		 * @param flag 1采购数量 2含税单价 3税点
		 */
		calcFee(flag)
		{
			this.purchase.totalFee = 0;
			this.purchase.totalFeeWithTax = 0;
			if (this.common.isNotBlank(this.purchase.purchaseNums) && this.common.isNotBlank(this.purchase.price))
			{
				this.purchase.totalFeeWithTax = this.common.accMul(this.purchase.purchaseNums, this.purchase.price);
				if (this.common.isNotBlank(this.purchase.taxRate))
				{
					let tax = this.common.accAdd(100, this.purchase.taxRate);
					let totalFee = this.common.accDiv(this.purchase.totalFeeWithTax, this.common.accDiv(tax, 100));
					this.purchase.totalFee = this.common.accDiv(Math.round(this.common.accMul(totalFee, 100)), 100);
				}
			}
		},
		/**
		 * 校验参数
		 */
		checkParam()
		{
			if (this.common.isBlank(this.purchase.suppierTenantId))
			{
				this.$message.error("请选择供应商！");
				return false;
			}
			if (this.common.isBlank(this.purchase.packId))
			{
				this.$message.error("请选择包装名称！");
				return false;
			}
			if (this.common.isBlank(this.purchase.tenantId))
			{
				this.$message.error("请选择客户！");
				return false;
			}
			if (this.common.isBlank(this.purchase.purchaseNums))
			{
				this.$message.error("请输入采购数量！");
				return false;
			}
			if (this.common.isBlank(this.purchase.price))
			{
				this.$message.error("请输入含税单价！");
				return false;
			}
			if (this.common.isBlank(this.purchase.taxRate))
			{
				this.$message.error("请输入税点！");
				return false;
			}
			if (this.common.isBlank(this.tableData) || this.tableData.length === 0)
			{
				this.$message.error("请刷新页面试试！");
				return false;
			}
			let totalDeliverNums = 0;
			for (let i = 0; i < this.tableData.length; i++)
			{
				let data = this.tableData[i];
				if (this.common.isBlank(data.workId))
				{
					this.$message.error("请选择第" + (i + 1) + "条配送的交付地！");
					return false;
				}
				if (this.common.isBlank(data.deliverNums))
				{
					this.$message.error("请输入第" + (i + 1) + "条配送的配送数量！");
					return false;
				}
				totalDeliverNums = this.common.accAdd(totalDeliverNums, data.deliverNums);
				if (this.common.isBlank(data.requireDeliverDate))
				{
					this.$message.error("请选择第" + (i + 1) + "条配送的要求交货日期！");
					return false;
				}
			}
			if (totalDeliverNums != this.purchase.purchaseNums)
			{
				this.$message.error("配送数量的总和不等于采购数量,请核实！");
				return false;
			}
			return true;
		},
		/**
		 * 确认新增
		 */
		sureAddPurchase()
		{
			if (this.checkParam())
			{
				let that = this;
				let param = this.common.copyObj(that.purchase);
				param.tableData = this.tableData;
				that.common.postUrl("purchaseTF", "saveOrUpdatePurchase", param, function (data)
				{
					that.doQuery();
					that.showPurchase(false);
					that.$message.success("采购单新增成功！");
				},null,'',true);
			}
		},
		/**
		 * 确认修改
		 */
		sureUpdatePurchase()
		{
			if (this.checkParam())
			{
				let that = this;
				let param = this.common.copyObj(that.purchase);
				param.tableData = this.tableData;
				that.common.postUrl("purchaseTF", "saveOrUpdatePurchase", param, function (data)
				{
					that.doQuery();
					that.showPurchase(false);
					that.$message.success("采购单修改成功！");
				},null,'',true);
			}
		},
		/**
		 * 展示上传
		 */
		async showUpload(flag)
		{
			this.initUploadParam();
			this.sureReceivedTableData = [];
			if (flag)
			{
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1)
				{
					this.$message.error("请选择一条需要确认收货的采购单!");
					return false;
				}
				if(selectData[0].state == enumData.PURCHASE_ORDER_STATE.SURE_RECEIVED)
				{
					this.$message.error("确认收货的采购单无法继续确认收货！");
					return false;
				}
				this.uploadParam.purchaseOrderNum = selectData[0].purchaseOrderNum;
				this.uploadParam.purchaseNums = selectData[0].purchaseNums;
				this.uploadParam.hasPurchaseNums = selectData[0].hasPurchaseNums;
				this.uploadParam.oId = selectData[0].oId;
				this.uploadParam.changeDate = '';
				this.sureReceivedWorkData = await this.loadPurchaseDeliverWorkData(selectData[0].oId);
				
				let workId = '';
				if (this.sureReceivedWorkData.length === 1)
					workId = this.sureReceivedWorkData[0].workId;
				this.sureReceivedTableData.push(this.initSureReceivedTable(workId));
			}
			else
				this.sureReceivedWay = flag;
			this.showUploadPage = flag;
		},
		/**
		 * 加载采购单的交付地数据
		 * @returns {Promise<*[]>}
		 */
		async loadPurchaseDeliverWorkData(oId)
		{
			let sureReceivedWorkData = [];
			if (oId)
			{
				sureReceivedWorkData = await this.common.postUrl("purchaseTF","loadPurchaseDeliverWorkData", {oId : oId});
				sureReceivedWorkData.forEach(item => item.disabled = false);
			}
			return sureReceivedWorkData;
		},
		/**
		 * 控制展示开始计费Dialog
		 * @param flag
		 * @returns {boolean}
		 */
		showBeginCalculateFeeDialog(flag)
		{
			this.calculateFeeParam.changeDate = null;
			this.calculateFeeParam.oId = '';
			if (flag)
			{
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1)
				{
					this.$message.error("请选择一条需要开始计费的采购单!");
					return false;
				}
				if(selectData[0].state != enumData.PURCHASE_ORDER_STATE.SURE_RECEIVED)
				{
					this.$message.error("不是确认收货的采购单无法开始计费！");
					return false;
				}
				if(this.common.isNotBlank(selectData[0].chargeDate))
				{
					this.$message.error("采购单已经开始计费！");
					return false;
				}
				this.calculateFeeParam.oId = selectData[0].oId;
			}
			this.showBeginCalculateFee = flag;
		},
		
		/**
		 * 确认收货
		 */
		async sureReceived()
		{
			if (this.sureReceivedWay)
			{
				if (this.common.isBlank(this.uploadParam.oId))
				{
					this.$message.error("请选择收货的采购单号！");
					return false;
				}
				if (this.common.isBlank(this.uploadParam.purchaseNums))
				{
					this.$message.error("没有采购单数量,请重新选择收货的采购单！");
					return false;
				}
				this.$refs.myImport.submitFileForm();
			}
			else
			{
				for (let i = 0; i < this.sureReceivedTableData.length; i++)
				{
					let temp = this.sureReceivedTableData[i];
					if (this.common.isBlank(temp.workId))
					{
						this.$message.error("请选择第" + (i + 1) + "行的交付地!");
						return false;
					}
					if (this.common.isBlank(temp.begin))
					{
						this.$message.error("请输入第" + (i + 1) + "行的起始编码!");
						return false;
					}
					else
					{
						if (!temp.begin.startsWith("E"))
						{
							this.$message.error("第" + (i + 1) + "行的起始编码不是E开头!");
							return false;
						}
						if (temp.begin.length !== 12)
						{
							this.$message.error("第" + (i + 1) + "行的起始编码不是12位!");
							return false;
						}
					}
					if (this.common.isBlank(temp.end))
					{
						this.$message.error("请输入第" + (i + 1) + "行的结束编码!");
						return false;
					}
					else
					{
						if (!temp.end.startsWith("E"))
						{
							this.$message.error("第" + (i + 1) + "行的结束编码不是E开头!");
							return false;
						}
						if (temp.end.length !== 12)
						{
							this.$message.error("第" + (i + 1) + "行的结束编码不是12位!");
							return false;
						}
					}
				}
				this.uploadParam.sureReceivedTableData = this.sureReceivedTableData;
				await this.common.postUrl("purchaseTF", "sureReceivedByTableData", this.uploadParam, null,null,'',true);
				await this.doQuery();
				await this.showUpload(false);
				this.$message.success("确认收货成功！");
			}
		},
		/**
		 *
		 */
		sureReceivedSuccess()
		{
			this.doQuery();
			this.showUpload(false);
			this.$message.success("确认收货成功！");
		},
		
		/**
		 * 确认收货
		 */
		async beginCalculateFee()
		{
			if (this.common.isBlank(this.calculateFeeParam.changeDate))
			{
				this.$message.error("请填写开始计费日期！");
				return false;
			}
			await this.common.postUrl("purchaseTF", "beginCalculateFee", this.calculateFeeParam, null,null,'',true);
			await this.doQuery();
			this.showBeginCalculateFeeDialog(false);
			this.$message.success("确认计费成功！");
		},
		/**
		 * 切换确认收货方式
		 * @returns {Promise<void>}
		 */
		async doSwitch()
		{
			this.sureReceivedWay = !this.sureReceivedWay;
			this.$forceUpdate();
		},
		/**
		 * 删除采购单
		 */
		deletePurchase()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的采购单!");
				return false;
			}
			if(selectData[0].state != enumData.PURCHASE_ORDER_STATE.UNRECEIVED)
			{
				this.$message.error("只有未收货的采购单才能删除！");
				return false;
			}
			this.$confirm("确定需要删除当前采购单吗？", "提示").then(async() =>{
				await this.common.postUrl("purchaseTF", "deletePurchase", {oId: selectData[0].oId}, null, null, '', true);
				await this.doQuery();
				this.$message.success("删除成功！");
			}).catch(() =>{});
		}
		
	},
	computed:{
		formData(){
			return [
				{"name":"采购单号","model":"purchaseOrderNum","type":"input","placeholder":"采购单号","isshow":true},
				{"name":"采购供应商","model":"suppierTenantId","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","placeholder":"采购供应商","method":"doQuery","isshow":true},
				{"name":"客户","model":"tenantId","type":"select","options":this.customerData,"label":"name","value":"tenantId","placeholder":"客户","method":"doQuery","isshow":true},
				{"name":"采购单状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"采购单状态","method":"doQuery","isshow":true},
				{"name":"包装名称","model":"packId","type":"select","options":this.packNameData,"label":"packName","value":"packId","placeholder":"包装名称","method":"doQuery","isshow":true},
				{"name":"包装类型","model":"packType","type":"select","options":this.packTypeData,"label":"codeName","value":"codeValue","placeholder":"包装类型","method":"doQuery","isshow":true},
			]
		}
	},
}
