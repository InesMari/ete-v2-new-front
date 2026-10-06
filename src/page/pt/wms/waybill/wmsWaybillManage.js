import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import fileViewer from "@/components/myFile/file-viewer.vue";

export default {
	name: 'wmsWaybillManage',
	data()
	{
		return {
			head: [
				{"name": "配送单号", "code": "waybillNum", "width": "150", "type": "text"},
				{"name": "收入", "code": "income", "width": "150", "type": "text"},
				{"name": "成本", "code": "actualCost", "width": "150", "type": "text"},
				{"name": "利润率", "code": "profitRate", "width": "150", "type": "text"},
				{"name": "签收单状态", "code": "receiptsStateName", "width": "150", "type": "diy"},
				{"name": "入/出库单号", "code": "orderNum", "width": "250", "type": "diy"},
				{"name": "配送托数", "code": "palletNums", "width": "90", "type": "text"},
				{"name": "最大装载托数", "code": "vehicleLengthDataName", "width": "90", "type": "text"},
				{"name": "装载率", "code": "loadingRate", "width": "90", "type": "text"},
				{"name": "配送状态", "code": "waybillStateName", "width": "130", "type": "text"},
				{"name": "货主", "code": "srcTenantName", "width": "250", "type": "text"},
				{"name": "到货厂商", "code": "fromTenantNames", "width": "400", "type": "text"},
				{"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
				{"name": "要求送达时间", "code": "requireDate", "width": "150", "type": "text"},
				{"name": "起始点地址", "code": "workAddressStr", "width": "250", "type": "text"},
				{"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
				{"name": "配送司机", "code": "driverName", "width": "150", "type": "text"},
				{"name": "配送时间", "code": "deliveryDate", "width": "150", "type": "text"},
				{"name": "确认人", "code": "confirmUserName", "width": "110", "type": "text"},
				{"name": "确认时间", "code": "confirmDate", "width": "150", "type": "text"},
				{"name": "确认备注", "code": "confirmRemark", "width": "150", "type": "text"},
				{"name": "计费方式", "code": "billingTypeName", "width": "150", "type": "text"},
				{"name": "运费成本金额", "code": "cost", "width": "150", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
				{"name": "是否返程", "code": "isReturnName", "width": "150", "type": "text"},

				// {"name": "是否紧急", "code": "isUrgentName", "width": "180", "type": "text"},
				// {"name": "是否回单", "code": "haveReceiptName", "width": "180", "type": "text"},
				// {"name": "车型", "code": "vehicleTypeName", "width": "90", "type": "text"},
				// {"name": "车长", "code": "vehicleLengthName", "width": "90", "type": "text"},
				// {"name": "司机电话", "code": "driverLinkPhone", "width": "90", "type": "text"},
				// {"name": "联系人", "code": "linkman", "width": "120", "type": "text"},
				// {"name": "联系电话", "code": "linkPhone", "width": "120", "type": "text"},

			],
			query: this.initQuery(),
			waybillStateData: [],
			billingTypeData:[],
			show: false,
			showSelWork: false,
			waybill: this.initWaybill(),
			showReceipts: false,
			receipts: this.initReceipts(),
			fromTenantData: [],
			receiptsTypeData:[],
			whetherData:[],
			srcList: [],
			receiptUploadData: [
				{
					codeValue:1,
					codeName:'已上传',
				},
				{
					codeValue:0,
					codeName:'未上传',
				}
			],
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.query.wId = this.$route.query.ids;
		this.doQuery();
		this.initSelWork();
		this.initData();
	},
	/**
	 * 组件
	 */
	components: {
		selectWork,
		tableCommon,
		myFileModel,
		searchList,
		fileViewer,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		initSelWork(){
			this.userInfo = this.common.userInfo();
			if(!this.userInfo.workId){
				this.showSelWork = true;
			}else{
				this.firstIn = false;
				this.doQuery();
			}
		},
		selWork(){
			this.showSelWork = false;
			this.$forceUpdate();
			if(!this.firstIn){
				this.$emit('closeOthers', {});
			}
			this.userInfo = this.common.userInfo();
			this.firstIn = false;
			this.doQuery();
		},
		initReceipts(waybillId, waybillNum)
		{
			this.receipts = {
				waybillId: waybillId,
				fromTenantId: null,
				receiptsType:'1',
				waybillNum: waybillNum,
			};
			return this.receipts;
		},
		/**
		 * 列表查询
		 */
		async doQuery(query=this.query)
		{
			this.query = query;
			if(this.common.isNotBlank(this.query.deliveryDate) && this.query.deliveryDate.length === 2){
				this.query.startDeliveryDate = this.query.deliveryDate[0];
				this.query.endDeliveryDate = this.query.deliveryDate[1];
			}else{
				this.query.startDeliveryDate = '';
				this.query.endDeliveryDate = '';
			}
			await this.$refs.table.load("wmsWaybillService", "queryWmsWaybillPage", this.query);
		},
		async initData()
		{
			let that = this;
			this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'BILLING_TYPE_WMS,WMS_WAYBILL_STATE,RECEIPTS_TYPE,WHETHER'}, function (data)
			{
				that.billingTypeData = data.BILLING_TYPE_WMS;
				that.waybillStateData = data.WMS_WAYBILL_STATE;
				that.receiptsTypeData = data.RECEIPTS_TYPE;
				that.whetherData = data.WHETHER;
			});
		},
		initQuery()
		{
			return this.query = {
				waybillNum: this.common.isNotBlank(this.$route.query.waybillNum)?this.$route.query.waybillNum:'',
				outOrderNum: '',
				workId: this.common.isNotBlank(this.$route.query.workId)?this.$route.query.workId:'',
				tenantName: this.common.isNotBlank(this.$route.query.supplierName)?this.$route.query.supplierName:'',
				waybillState: this.common.isNotBlank(this.$route.query.waybillState)?this.$route.query.waybillState:'',
				deliveryDate:this.initDeliveryDate(),
				billingType:this.common.isNotBlank(this.$route.query.billingType)?this.$route.query.billingType:'',
				plateNumber:'',
				isReturn:'',
			};
		},
		initDeliveryDate(){
			if(this.common.isNotBlank(this.$route.query.billMonth)){
				let date1 = new Date(this.$route.query.billMonth+'-01');
				let date2 = new Date(date1.getFullYear(),date1.getMonth()+1,0);
				return [this.common.formatTime(date1,'yyyy-MM-dd'),this.common.formatTime(date2,'yyyy-MM-dd')]
			}
			return '';
		},
		initWaybill()
		{
			return this.waybill = {
				id: '',
				waybillNum: '',
				palletNums: '',
				confirmRemark: '',
			};
		},
		openAddTab()
		{
			this.$emit('openTab', {
				urlName: '新增短驳配送',
				urlId: 'wmsWaybill' + new Date().getTime(),
				urlPathName: "/wms/waybill",
				urlPath: "/pt/wms/waybill/wmsWaybill.vue",
				query: {}
			});
		},
		openUpdateTab()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要修改的配送！");
				return false;
			}
			//   * 1 未配送：创建以后是未配送；
			// 	 * 2 已配送：司机小程序点击收车操作；手工完成；
			// 	 * 3 异常终止
			// 	 * 5 已完成：客服确认之后
			if (selectData[0].waybillState != 1)
			{
				this.$message.error("只有未配送的配送单才能修改！");
				return false;
			}
			this.$emit('openTab', {
				urlName: '修改短驳配送',
				urlId: 'wmsWaybill' + selectData[0].id,
				urlPathName: "/wms/waybill",
				urlPath: "/pt/wms/waybill/wmsWaybill.vue",
				query: {id: selectData[0].id}
			});
		},
		async openDeleteTab()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的配送！");
				return false;
			}
			if (selectData[0].waybillState != 1)
			{
				this.$message.error("只有未配送的配送单才能删除！");
				return false;
			}
			let msg = `
                    <p style="text-align:center;">你要<span style="color:red;">删除</span>的配送单,单号为：${selectData[0].waybillNum}</p>
                    <p style="text-align:center;">是否继续？</p>`;
			let that = this;
			this.$confirm(msg, "删除提示" ,{
				confirmButtonText: '删除',
				cancelButtonText: '关闭',
				dangerouslyUseHTMLString:true,
				center: true
			}).then(async () => {
				await that.common.postUrl("wmsWaybillService", "deleteWmsWaybillInfoById", {id: selectData[0].id});
				await that.doQuery();
				that.$message.success("删除成功!");
			}).catch(() =>{})
		},
		openConfirmTab()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要确认的配送单！");
				return false;
			}
			if (selectData[0].waybillState != 1 && selectData[0].waybillState != 3)
			{
				this.$message.error("只有未配送/已配送的配送单才能确认送达！");
				return false;
			}

			//根据来源进入不同的页面
			if(selectData[0].srcChannel=='WEB'){
				this.$emit('openTab', {
					urlName: '确认送达',
					urlId: 'wmsWaybillInfo' + selectData[0].id,
					urlPathName: "/wms",
					urlPath: "/pt/wms/waybill/wmsWaybillInfo.vue",
					query: {id: selectData[0].id}
				});
			}else{
				this.$emit('openTab', {
					urlName: '确认送达',
					urlId: 'wmsWaybill' + selectData[0].id + 'type2',
					urlPathName: "/wms/waybill",
					urlPath: "/pt/wms/waybill/wmsWaybill.vue",
					query: {id: selectData[0].id,type:2}
				});
			}
			// this.initWaybill();
			// this.waybill = selectData[0];
			// this.waybill.isReturn = String(this.waybill.isReturn);
			// this.openDialog(true);
		},
		openDialog(flag)
		{
			this.show = flag;
		},
		async sureWaybill()
		{
			let param = this.waybill;
			let that = this;
			this.$confirm("您正在操作确认送达，如果是返程单则系统会根据返程数量会更新相关的成本收入金额，是否继续?", "提示").then(() =>{
				that.common.postUrl("wmsWaybillService", "sureWmsWaybillInfoById", param, function (data)
				{
					that.doQuery();
					that.$message.success("确认成功!");
					that.openDialog(false);
				});
			}).catch(() =>{})
		},
		dblclickItem(data)
		{
			this.openDetail(data);
		},
		openDetail(data)
		{
			let selectData = this.$refs.table.getSelectItem();
			if (this.common.isNotBlank(data))
				selectData[0] = data;
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要查看的配送单！");
				return false;
			}
			let param = selectData[0];
			this.$emit('openTab', {
				urlName: '查看配送',
				urlId: 'wmsWaybillDetail' + param.id,
				urlPathName: "/wms",
				urlPath: "/pt/wms/waybill/wmsWaybillDetailMain.vue",
				query: {id: param.id,
					logId: param.id,
					logType: enumData.LOG_TYPE.WMS_WAYBILL,
				}
			});
		},
		openPrint()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要查看的配送单！");
				return false;
			}
			this.$emit('openTab', {
				urlName: '打印短驳配送单号',
				urlId: 'wmsWaybill' + selectData[0].id,
				urlPathName: "/wms",
				urlPath: "/pt/wms/waybill/printWaybill.vue",
				query: {id: selectData[0].id}
			});
		},
		/**
		 * 打开回单上传弹窗
		 */
		async openReceiptsUploadTab()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要上传回单的配送单！");
				return false;
			}
			this.initReceipts(selectData[0].id, selectData[0].waybillNum);
			this.receipts.receiptsList = [];
			this.receipts.receiptsList.push({});
			this.fromTenantData = await this.common.postUrl("wmsWaybillService", "queryWaybillFromTenantByWaybillId", {waybillId: selectData[0].id});
			if (this.fromTenantData.length == 1)
			{
				this.receipts.fromTenantId = this.fromTenantData[0].fromTenantId;
			}
			this.changeReceiptsShow(true);
		},
		/**
		 * 改变展示弹窗
		 */
		changeReceiptsShow(flag)
		{
			this.showReceipts = flag;
			if (flag)
				this.imgDisplay();
		},
		/**
		 * 回调获取图片的信息
		 * @param imgData
		 */
		successCallback(imgData)
		{
			imgData.imgId = imgData.flowId;
			imgData.imgPath = imgData.storePath;
			if (this.receipts.receiptsList.length <= 5)
				this.receipts.receiptsList[imgData.componentId] = imgData;
			if (this.receipts.receiptsList.length < 5)
			{
				let flag = true;
				for (let i = 0; i < this.receipts.receiptsList.length; i++)
				{
					if (this.common.isBlank(this.receipts.receiptsList[i].imgId))
						flag = false;//存在空的
				}
				if (flag)
					this.receipts.receiptsList.push({});
			}
			this.initListComponentId();
		},
		delCallback(index)
		{
			this.receipts.receiptsList.splice(index, 1);
			let flag = true;
			for (let i = 0; i < this.receipts.receiptsList.length; i++)
				if (this.common.isBlank(this.receipts.receiptsList[i].flowId))
					flag = false;//存在空的
			if (this.receipts.receiptsList.length <= 4 && flag)
				this.receipts.receiptsList.push({});
			this.imgDisplay();
			this.initListComponentId();
		},
		imgDisplay()
		{
			this.$nextTick(() =>
			{
				let that = this;
				for (let i = 0; i < this.receipts.receiptsList.length; i++)
				{
					if (that.receipts.receiptsList[i].imgId)
					{
						eval("that.$refs.file" + i + "[0].initDate(" + that.receipts.receiptsList[i].imgId + ")");
					}
					else
					{
						eval("that.$refs.file" + i + "[0].clean()");
					}
				}
			});
		},
		initListComponentId()
		{
			for (let i = 0; i < this.receipts.receiptsList.length; i++)
				this.receipts.receiptsList[i].componentId = i;
			this.$forceUpdate();
		},

		/**
		 * 新增单据
		 */
		addReceipts()
		{
			if (this.common.isBlank(this.receipts.waybillId))
			{
				this.$message.error("请选择短驳配送单再提交！");
				return false;
			}
			if (this.common.isBlank(this.receipts.fromTenantId))
			{
				this.$message.error("请选择到货厂商再提交！");
				return false;
			}
			if (this.common.isBlank(this.receipts.nums))
			{
				this.$message.error("请输入单据数量再提交！");
				return false;
			}
			let count = 0;
			for (let i = 0; i < this.receipts.receiptsList.length; i++)
			{
				if (this.common.isNotBlank(this.receipts.receiptsList[i].imgId))
					count++;
			}
			if (count === 0)
			{
				this.$message.error("请上传图片信息再提交！");
				return false;
			}
			let that = this;
			that.common.postUrl("wmsWaybillService", "saveOrUpdateWmsReceipts", this.receipts, function (data){
				that.doQuery();
				that.changeReceiptsShow(false);
				that.$message.success("单据上传成功");
			},null, null,true);
		},
		toOrderDetail(item,index,num)
		{
			let orderId = item.orderIds[index];
			if (num.startsWith("IW"))
			{
				this.$emit("openTab",{
					urlId: "inOrderDetail"+orderId,
					query: {inOrderId:orderId,
						logId: orderId,
						logType: enumData.LOG_TYPE.WMS_IN_ORDER,
					},
					urlName: '入库单详情',
					urlPathName: "/inOrderDetail",
					urlPath: '/pt/wms/ord/inOrderDetail.vue'});
			}
			else
			{
				this.$emit("openTab",{
					urlId: "urlId"+orderId,
					query: {outOrderId:orderId,
						logId: orderId,
						logType: enumData.LOG_TYPE.WMS_OUT_ORDER,
					},
					urlName: '出库单详情',
					urlPathName: "/outOrderDetail",
					urlPath: '/pt/wms/ord/outOrderDetail.vue'});
			}
		},
		/**
		 * 导出
		 */
		downloadExcel() {
			this.$refs.table.downloadExcelFile();
		},
		async showBigImg(data)
		{
			if (this.common.isBlank(data.id))
			{
				this.$message.error("请刷新试试！");
				return false;
			}
			let fileData = await this.common.postUrl("wmsWaybillService", "loadWmsWaybillReceiptsListByWaybillId", {waybillId: data.id});
			if (this.common.isBlank(fileData) || fileData.length == 0)
			{
				this.$message.error("配载单没有上传附件！");
				return false;
			}
			this.srcList = [];
			for (let i = 0; i < fileData.length; i++)
			{
				let item = fileData[i];
				this.srcList.push(item.fullPath);
			}
			this.$refs.viewer.show();
		},
	},
	computed:{
		formData(){
			return [
				{"name":"配送单号","model":"waybillNum","type":"input","placeholder":"配送单号","isshow":true},
				{"name":"出库单号","model":"outOrderNum","type":"input","placeholder":"出库单号","isshow":true},
				{"name":"入库单号","model":"inOrderNum","type":"input","placeholder":"入库单号","isshow":true},
				{"name":"供应商","model":"tenantName","type":"input","placeholder":"供应商","isshow":true},
				{"name":"货主","model":"srcTenantName","type":"input","placeholder":"货主","isshow":true},
				{"name":"配送状态","model":"waybillState","type":"select","options":this.waybillStateData,"label":"codeName","value":"codeValue","placeholder":"配送状态","method":"doQuery","isshow":true},
				{"name":"签收单状态","model":"receiptUploadState","type":"select","options":this.receiptUploadData,"label":"codeName","value":"codeValue","placeholder":"签收单状态","method":"doQuery","isshow":true},
				{"name":"计费方式","model":"billingType","type":"select","options":this.billingTypeData,"label":"codeName","value":"codeValue","placeholder":"计费方式","method":"doQuery","isshow":true},
				{"name":"配送时间","model":"deliveryDate","type":"daterange","isshow":true},
				{"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
				{"name":"配送司机","model":"driverName","type":"input","placeholder":"配送司机","isshow":true},
				{"name":"是否返程","model":"isReturn","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"配送状态","method":"doQuery","isshow":true},
			]
		}
	},
}
