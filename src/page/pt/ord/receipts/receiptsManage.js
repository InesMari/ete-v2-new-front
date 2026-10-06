import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import commonOpLog from '@/components/commonOpLog/commonOpLog.vue'
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";


export default {
	name: 'receiptsManage',
	data()
	{
		return {
			head: [
				{"name": "派车单号", "code": "waybillNum", "width": "150", "type": "diy"},
				{"name": "订单号", "code": "orderNum", "width": "180", "type": "diy"},
				{"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
				{"name": "司机", "code": "driverName", "width": "90", "type": "text"},
				{"name": "客户", "code": "tenantName", "width": "180", "type": "text"},
				{"name": "作业点", "code": "workName", "width": "120", "type": "text"},
				{"name": "详细地址", "code": "workAddressStr", "width": "200", "type": "text"},
				{"name": "单据状态", "code": "receiptStateName", "width": "110", "type": "text"},
				{"name": "单据类型", "code": "receiptsTypeName", "width": "80", "type": "text"},
				{"name": "客户下单时间", "code": "customerOrderDate", "width": "200", "type": "text"},
				{"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
			],
			query: this.initQuery(),
			receiptStateData: [],
			receiptTypeData: [],
			waybillData: [],
			orderData: [],
			waybillWorkData: [],
			title: '查看数据',
			showReceipts: false,
			isOnlySee: true,
			canDeleteImg: true,
			isEditWaybill: true,//派车单号是否可选 默认不可选
			isEditOrder: true,//订单号是否可选 默认不可选
			loading: false,//展示加载中
			receipts: this.initReceipts(),
			isShowSureButton: false,//确认按钮
			isShowSubmitButton: false,//提交按钮
			showSelect: true,
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,

			list:[{}],
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
	 * 组件
	 */
	components: {
		tableCommon,
		myFileModel,
		commonOpLog,
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
			if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
				this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
				this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
			}else{
				this.query.startCustomerOrderDate = '';
				this.query.endCustomerOrderDate = '';
			}
			await this.$refs.table.load("receiptsTF", "queryReceiptsInfoData", this.query);
		},
		/**
		 * 初始化静态数据
		 */
		initData()
		{
			let that = this;
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIPT_STATE"}, function (data)
			{
				that.receiptStateData = data;
			});
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIPT_TYPE"}, function (data)
			{
				that.receiptTypeData = data;
			});
		},
		/**
		 * 初始化查询条件
		 * @returns {{receiptState: string, waybillNum: string, orderNum: string, driverName: string, receiptType: string, plateNumber: string, workName: string}}
		 */
		initQuery()
		{
			this.query = {
				waybillNum: '',
				plateNumber: '',
				driverName: '',
				orderNum: '',
				workName: '',
				receiptState: '',
				receiptType: '',
				tenantName: this.$route.query.tenantName,//客户详情单据管理跳转
			};
			return this.query;
		},
		/**
		 * 清空
		 */
		clear()
		{
			this.query = {};
		},
		/**
		 *
		 * @returns {{receiptState: string, waybillNum: string, orderNum: string, driverName: string, receiptType: string, plateNumber: string, workName: string}|*}
		 */
		initReceipts(receiptsType)
		{
			this.receipts = {
				rId: '',//ord_waybill_receipts_info id
				waybillId: '',
				dispatchId: '',
				waybillNum: '',
				orderId: '',
				orderNum: '',
				tenantName: '',
				waybillWorkId: '',
				workAddressStr: '',
				receiptsType: this.common.isBlank(receiptsType) ? '1' : receiptsType,
			};
			return this.receipts;
		},
		/**
		 * 双击详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.seeReceipts(data);
		},
		/**
		 * 查看
		 */
		seeReceipts(data)
		{
			let selectData = this.$refs.table.getSelectItem();
			if (this.common.isNotBlank(data))
				selectData[0] = data;
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要查看的单据！");
				return false;
			}
			this.receipts = this.common.copyObj(selectData[0]);
			this.waybillData = [{waybillId: this.receipts.waybillId, waybillNum: this.receipts.waybillNum}];
			this.orderData = [{orderId: this.receipts.orderId, orderNum: this.receipts.orderNum}];
			this.waybillWorkData = [{waybillWorkId: this.receipts.waybillWorkId, workName: this.receipts.workName}];
			this.title = "查看单据";
			this.isOnlySee = true;
			this.isEditWaybill = true;
			this.canDeleteImg = true;
			this.isShowSureButton = false;
			this.isShowSubmitButton = false;
			this.showSelect = true;
			this.changeReceiptsShow(true);
		},
		/**
		 * 打开单据确认
		 */
		async receiptsSure()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要确认的单据！");
				return false;
			}
			if (selectData[0].authState == 1)
			{
				this.$message.error("该单据已经确认，请勿重复操作！");
				return false;
			}
			this.receipts = this.common.copyObj(selectData[0]);
			this.waybillData = [{waybillId: this.receipts.waybillId, waybillNum: this.receipts.waybillNum}];
			this.orderData = await this.common.postUrl("receiptsTF", "loadWaybillOrderInfoByWaybillId", {waybillId: this.receipts.waybillId});
			if (this.orderData.length === 1)//只有一个订单默认选上
			{
				this.receipts.orderId = this.orderData[0].orderId;
				this.receipts.tenantName = this.orderData[0].tenantName;
			}
			//不考虑作业点既是运单的作业点又是订单的作业点
			this.waybillWorkData = await this.common.postUrl("receiptsTF", "loadWaybillWorkInfoByWaybillId", {waybillId: this.receipts.waybillId});
			//后台只查询运单作业点 正常不会只有一个   后期改只查询该订单的时候可能有
			if (this.waybillWorkData.length === 1)
			{
				this.receipts.waybillWorkId = this.waybillWorkData[0].waybillWorkId;
				this.receipts.workAddressStr = this.waybillWorkData[0].workAddressStr;
			}
			this.title = "单据确认";
			this.isOnlySee = false;
			this.isEditWaybill = true;
			this.canDeleteImg = true;
			this.isShowSureButton = true;
			this.isShowSubmitButton = false;
			this.changeReceiptsShow(true);
			this.$forceUpdate();
		},
		/**
		 * 打开上传单据
		 */
		openAddReceipts()
		{
			this.initReceipts();
			this.title = "上传单据";
			this.isOnlySee = false;
			this.isEditWaybill = false;
			this.canDeleteImg = false;
			this.isShowSureButton = false;
			this.isShowSubmitButton = true;
			this.showSelect = true;
			this.isEditOrder = false;//订单是否可输入
			this.changeReceiptsShow(true);
		},
		/**
		 * 重置集合数据
		 */
		initCollections()
		{
			this.waybillData = [];
			this.orderData = [];
			this.waybillWorkData = [];
		},
		/**
		 * 远程搜索匹配运单号
		 * @param waybillNum
		 */
		async remoteSearchWaybill(waybillNum)
		{
			//重新输入运单重置数据
			this.initReceipts(this.receipts.receiptsType);
			this.initCollections();
			if (this.common.isNotBlank(waybillNum))
				this.waybillData = await this.common.postUrl("ordWaybillTF", "queryOrdWaybillList", {waybillNum: waybillNum});
			this.$forceUpdate();
		},
		/**
		 * 远程搜索匹配订单号
		 * @param orderNum
		 */
		async remoteSearchOrder(orderNum)
		{
			this.initReceipts(this.receipts.receiptsType);
			this.initCollections();
			if (this.common.isNotBlank(orderNum))
				this.orderData = await this.common.postUrl("orderTF", "queryOrderInfoData", {orderNum: orderNum,isLoadHasOp: 1});
		},
		/**
		 * 切换(只有上传的才有这个)
		 */
		async doSwitch()
		{
			if (this.common.isBlank(this.receipts.waybillId))
				this.waybillWorkData = [];
			if (this.showSelect)//派车单搜索	订单选择
			{
				if (this.common.isNotBlank(this.receipts.orderId))//已经选择了订单  派车单下拉重新查询
					await this.changeWaybillOrder(this.receipts.orderId);
			}
			else//订单搜索	派车单选择
			{
				if (this.common.isNotBlank(this.receipts.waybillId))//已经选择了派车单  订单下拉重新查询
				{
					this.orderData = await this.common.postUrl("receiptsTF", "loadWaybillOrderInfoByWaybillId", {waybillId: this.receipts.waybillId});
					if (this.orderData.length === 1)//一个订单默认选上
					{
						this.receipts.orderId = this.orderData[0].orderId;
						this.receipts.orderNum = this.orderData[0].orderNum;
						this.receipts.tenantName = this.orderData[0].tenantName;
					}
				}
			}
			this.showSelect = !this.showSelect;

			this.$forceUpdate();
		},
		/**
		 * 点击确认运单号
		 * @param waybillId
		 * @param flag 没有传 搜索派车单情况	flag =true 搜索订单情况 订单ID已经确认
		 * @returns {Promise<void>}
		 */
		async changeWaybill(waybillId, flag)
		{
			this.receipts.dispatchId = '';
			this.receipts.waybillWorkId = '';
			this.receipts.workAddressStr = '';
			this.waybillWorkData = [];//清空作业点
			if (!flag)
			{
				this.receipts.orderId = '';
				this.receipts.orderNum = '';
				this.receipts.tenantName = '';
			}
			if (this.common.isNotBlank(this.receipts.waybillId))
			{
				this.waybillData.forEach(item => {
					if (item.waybillId == waybillId)
					{
						this.receipts.dispatchId = item.dispatchId;
						this.receipts.waybillNum = item.waybillNum;
					}
				});
				if (!flag)//派车单搜索时才加载订单数据   flag=true是订单搜索时 不加载
				{
					this.orderData = await this.common.postUrl("receiptsTF", "loadWaybillOrderInfoByWaybillId", {waybillId: this.receipts.waybillId});
					if (this.orderData.length === 1)//一个订单默认选上
					{
						this.receipts.orderId = this.orderData[0].orderId;
						this.receipts.orderNum = this.orderData[0].orderNum;
						this.receipts.tenantName = this.orderData[0].tenantName;
					}
				}
				this.waybillWorkData = await this.common.postUrl("receiptsTF", "loadWaybillWorkInfoByWaybillId", {waybillId: this.receipts.waybillId});
			}
		},
		/**
		 * 点击选择确认订单
		 * @param orderId
		 * @param loadFlag 没有传 搜索派车单情况  赋值客户可		flag =true 搜索订单情况 订单ID已经确认 加载订单相关的运单数据
		 * @returns {Promise<void>}
		 */
		async changeWaybillOrder(orderId, loadFlag)
		{
			this.receipts.tenantName = "";
			if (this.common.isNotBlank(orderId))
			{
				this.orderData.forEach(item => {
					if (item.orderId == orderId)
					{
						this.receipts.tenantName = item.tenantName;
						this.receipts.orderNum = item.orderNum;
					}
				});
			}
			//订单搜索时确认订单	加载派车单数据
			if (loadFlag)
			{
				this.receipts.waybillId = '';
				this.receipts.dispatchId = '';
				this.receipts.waybillNum = '';
				this.waybillWorkData = [];
				this.receipts.waybillWorkId = '';
				this.receipts.workAddressStr = '';
				this.waybillData = await this.common.postUrl("ordWaybillTF", "getWaybillDataByOrderId", {orderId: this.receipts.orderId});
				if (this.waybillData.length === 1)//默认选上
				{
					this.receipts.waybillId = this.waybillData[0].waybillId;
					this.receipts.dispatchId = this.waybillData[0].dispatchId;
					this.receipts.waybillNum = this.waybillData[0].waybillNum;

					this.waybillWorkData = await this.loadWaybillWorkInfoByWaybillId(this.receipts.waybillId);
					//后台只查询运单作业点 正常不会只有一个   后期改只查询该订单的时候可能有
					if (this.waybillWorkData.length === 1)
					{
						this.receipts.waybillWorkId = this.waybillWorkData[0].waybillWorkId;
						this.receipts.workAddressStr = this.waybillWorkData[0].workAddressStr;
					}
				}
			}
		},
		/**
		 * 加载运单作业点
		 * @param waybillId
		 * @returns {Promise<void>}
		 */
		async loadWaybillWorkInfoByWaybillId(waybillId)
		{
			return await this.common.postUrl("receiptsTF", "loadWaybillWorkInfoByWaybillId", {waybillId: waybillId});
		},
		/**
		 * 选择运单作业点
		 * @param waybillWorkId
		 */
		changeWaybillWork(waybillWorkId)
		{
			if (this.common.isNotBlank(this.waybillWorkData))
			{
				this.waybillWorkData.forEach(item => {
					if (item.waybillWorkId == waybillWorkId){ this.receipts.workAddressStr = item.workAddressStr; }
				});
			}
		},
		/**
		 * 回调获取图片的信息
		 * @param imgData
		 */
		setImgData(imgData)
		{
			this.receipts.imgId = imgData.flowId;
			this.receipts.fileName = imgData.fileName;
			this.receipts.imgPath = imgData.storePath;
		},
		/**
		 * 提交
		 */
		sureReceipts()
		{
			if (this.common.isBlank(this.receipts.rId))
			{
				this.$message.error("请选择派车单号再确认！");
				return false;
			}
			if (this.common.isBlank(this.receipts.waybillId))
			{
				this.$message.error("请选择派车单号再确认！");
				return false;
			}
			if (this.common.isBlank(this.receipts.orderId))
			{
				this.$message.error("请选择订单号再确认！");
				return false;
			}
			if (this.common.isBlank(this.receipts.waybillWorkId))
			{
				this.$message.error("请选择作业点再确认！");
				return false;
			}
			if (this.common.isBlank(this.receipts.receiptsType))
			{
				this.$message.error("请选择单据类型再确认！");
				return false;
			}
			this.receipts.imgId = this.$refs.receiptsImg.getImageData().flowId;
			this.receipts.imgPath = this.$refs.receiptsImg.getImageData().storePath;
			if (this.common.isBlank(this.receipts.imgId))
			{
				this.$message.error("请上传图片信息再确认！");
				return false;
			}
			if (this.common.isBlank(this.receipts.imgPath))
			{
				this.$message.error("请上传图片信息再确认！");
				return false;
			}
			let that = this;
			this.common.postUrl("receiptsTF", "sureReceipts", this.receipts, function (data)
			{
				that.doQuery();
				that.changeReceiptsShow(false);
				that.$msgbox("单据确认成功");
			},null,'',true);
		},
		/**
		 * 新增单据
		 */
		addReceipts()
		{
			if (this.common.isBlank(this.receipts.waybillId))
			{
				this.$message.error("请选择派车单号再提交！");
				return false;
			}
			if (this.common.isBlank(this.receipts.orderId))
			{
				this.$message.error("请选择订单号再提交！");
				return false;
			}
			if (this.common.isBlank(this.receipts.waybillWorkId))
			{
				this.$message.error("请选择作业点再提交！");
				return false;
			}
			if (this.common.isBlank(this.receipts.receiptsType))
			{
				this.$message.error("请选择单据类型再提交！");
				return false;
			}
			// this.receipts.imgId = this.$refs.receiptsImg.getImageData().flowId;
			// this.receipts.imgPath = this.$refs.receiptsImg.getImageData().storePath;
			// if (this.common.isBlank(this.receipts.imgId))
			// {
			// 	this.$message.error("请上传图片信息再提交！");
			// 	return false;
			// }
			// if (this.common.isBlank(this.receipts.imgPath))
			// {
			// 	this.$message.error("请上传图片信息再提交！");
			// 	return false;
			// }
			let list = this.common.copyObj(this.list);
			this.receipts.receiptsList=[];
			for (let i = 0; i < list.length; i++) {
				if(list[i].imgId){
					this.receipts.receiptsList.push(list[i]);
				}
			}
			if (this.receipts.receiptsList.length==0)
			{
				this.$message.error("请上传图片信息再提交！");
				return false;
			}
			let that = this;
			this.common.postUrl("receiptsTF", "addReceipts", this.receipts, function (data)
			{
				that.doQuery();
				that.changeReceiptsShow(false);
				that.$message.success("单据上传成功");
			},null, null,true);
		},
		/**
		 * 取消确认
		 */
		cancelSureReceipts()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要取消确认的单据！");
				return false;
			}
			if (selectData[0].authState == 0)
			{
				this.$message.error("该单据还没有确认，请刷新页面试试！");
				return false;
			}
			let that = this;
			this.$confirm("确认取消确认单据？", "提示").then(() =>
			{
				this.common.postUrl("receiptsTF", "cancelSureReceipts", selectData[0], function (data)
				{
					that.doQuery();
					that.$msgbox("取消确认成功！");
				},null,'',true);
			}).catch(() => {});
		},
		/**
		 * 删除确认
		 */
		deleteReceipts()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的单据！");
				return false;
			}
			if (selectData[0].authState == 1)
			{
				this.$message.error("已经确认的单据，不允许删除！");
				return false;
			}
			let that = this;
			this.$confirm("确认删除单据？", "提示").then(() =>
			{
				this.common.postUrl("receiptsTF", "deleteReceipts", selectData[0], function (data)
				{
					that.doQuery();
					that.$msgbox("删除成功！");
				},null,'',true);
			}).catch(() => {});
		},

		/**
		 * 派车单详情/中转详情
		 */
		toDetail(item, code)
		{
			if (code == 'waybillNum')
			{
				if (item.isTransit == 1)
				{
					this.$emit('openTab', {
						urlName: '查看中转',
						urlId: 'transitManage',
						urlPathName: "/order",
						urlPath: "/pt/ord/transit/transitDetailMain",
						query:{t:3,waybillNum: item.waybillNum, tansitWaybillId: item.waybillId},
					});
				}
				else
				{
					this.$emit("openTab",{
						urlId: 'waybillDetail' + item.waybillId,
						query: {waybillId: item.waybillId},
						urlName: "派车单详情",
						urlPathName: "/detail",
						urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
				}
			}
			else if (code == 'orderNum')
			{
				this.$emit("openTab",{
					urlId: 'orderDetail' + item.orderId,
					query: {orderId: item.orderId, pId: 1001070},
					urlName: "订单详情",
					urlPathName: "/order",
					urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
			}
		},
		/**
		 * 操作记录
		 */
		showOpLog()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要查看操作记录的单据！");
				return false;
			}
			//查询操作记录
			this.relId = selectData[0].rId;
			this.$refs.operate.showDialog(this.relId, 1);
		},
		/**
		 * 改变
		 */
		changeReceiptsShow(flag)
		{
			this.showReceipts = flag;
			if (flag)
			{
				this.$nextTick(() =>
				{
					if (this.common.isNotBlank(this.receipts.imgId))
					{
						this.$refs.receiptsImg.initDate(this.receipts.imgId);
					}
				});
			}
			else
			{
				this.$refs.receiptsImg.clean();
			}
		},

		/**
		 * 上传图片回调
		 * @param flag
		 */
		fileCallback(imgData){
			imgData.imgId = imgData.flowId;
			imgData.imgPath = imgData.storePath;
			if (this.list.length <= 5)
				this.list[imgData.componentId] = imgData;
			let flag = true;
			for (let i = 0; i < this.list.length; i++)
				if (this.common.isBlank(this.list[i].imgId)) flag = false;//存在空的
			if(this.list.length  < 5 && flag){
				this.list.push({});
			}
			this.initListComponentId();
		},
		initListComponentId()
		{
			for (let i = 0; i < this.list.length; i++)
				this.list[i].componentId = i;
			this.$forceUpdate();
		},
		delCallback(index){
			this.list.splice(index,1);
			let flag = true;
			for (let i = 0; i < this.list.length; i++)
				if (this.common.isBlank(this.list[i].imgId)) flag = false;//存在空的
			if(this.list.length === 4 && flag){
				this.list.push({});
			}
			this.imgDisplay();
			this.initListComponentId();
		},
		imgDisplay(){
			this.$nextTick(() => {
				let that = this;
				for (let i = 0; i < this.list.length; i++) {
					if (that.list[i].imgId) {
						eval("that.$refs.file" + i + "[0].initDate(" + that.list[i].imgId + ")");
					} else {
						eval("that.$refs.file" + i + "[0].clean()");
					}
				}
			});
		},

	},
	computed:{
		formData(){
			return [
				{"name":"派车单号","model":"waybillNum","type":"input","placeholder":"派车单号","isshow":true},
				{"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
				{"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
				{"name":"司机","model":"driverName","type":"input","placeholder":"司机","isshow":true},
				{"name":"订单号","model":"orderNum","type":"input","placeholder":"订单号","isshow":true},
				{"name":"作业点","model":"workName","type":"input","placeholder":"作业点","isshow":true},
				{"name":"单据状态","model":"receiptState","type":"select","options":this.receiptStateData,"label":"codeName","value":"codeValue","placeholder":"单据状态","method":"doQuery","isshow":true},
				{"name":"单据类型","model":"receiptType","type":"select","options":this.receiptTypeData,"label":"codeName","value":"codeValue","placeholder":"单据类型","method":"doQuery","isshow":true},
				{"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
			]
		}
	},
}
