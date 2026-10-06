import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum.js";
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
	name: 'wmsReceiptsManage',
	data()
	{
		return {
			head: [
				{"name": "查看回单", "code": "receiptsFileName", "width": "100", "type": "diy"},
				{"name": "短驳配送单号", "code": "waybillNum", "width": "150", "type": "diy"},
				{"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
				{"name": "配送司机", "code": "driverName", "width": "120", "type": "text"},
				{"name": "货主", "code": "tenantName", "width": "300", "type": "text"},
				{"name": "到货厂商", "code": "fromTenantName", "width": "300", "type": "text"},
				{"name": "供应商", "code": "supplierName", "width": "200", "type": "text"},
				{"name": "单据数量", "code": "nums", "width": "90", "type": "text"},
				{"name": "单据状态", "code": "authStateName", "width": "110", "type": "text"},
				{"name": "确认人", "code": "authUserName", "width": "150", "type": "text"},
				{"name": "确认时间", "code": "authDate", "width": "150", "type": "text"},
			],
			query: this.initQuery(),
			receipts: this.initReceipts(),
			receiptStateData: [],
			waybillData: [],
			fromTenantData: [],
			title: '查看数据',
			showReceipts: false,
			isOnlySee: true,
			canEditImg: false,
			loading: false,//展示加载中
			isShowSureButton: false,//确认按钮
			isShowSubmitButton: false,//提交按钮
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
			srcList: [],

			receiptsTypeData:[],
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
		searchList,
		fileViewer,
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
			if(this.common.isNotBlank(this.query.authDate) && this.query.authDate.length === 2){
				this.query.startAuthDate = this.query.authDate[0];
				this.query.endAuthDate = this.query.authDate[1];
			}else{
				this.query.startAuthDate = '';
				this.query.endAuthDate = '';
			}
			await this.$refs.table.load("wmsReceiptsService", "queryWmsReceiptsPage", this.query);
		},
		initData()
		{
			let that = this;
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIPT_STATE"}, function (data)
			{
				that.receiptStateData = data;
			});
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIPTS_TYPE"}, function (data)
			{
				that.receiptsTypeData = data;
			});

		},
		initQuery()
		{
			this.query = {
				waybillNum: '',
				plateNumber: '',
				driverName: '',
				receiptState: '',
				tenantName: '',
				supplierName: '',
				authDate: null,
			};
			return this.query;
		},
		initReceipts()
		{
			this.receipts = {
				rId: '',
				waybillId: '',
				waybillNum: '',
				receiptsType:'1',
				nums:'1',
				// imgId: '',
				// imgPath: '',
			};
			return this.receipts;
		},
		dblclickItem(data)
		{
			this.seeWmseceipts(data);
		},
		seeWmseceipts(data)
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
			this.receipts.receiptsType = this.receipts.receiptsType+'';
			this.changeWmsWaybill(this.receipts.waybillId);
			this.list = this.receipts.imgUrls;
			this.waybillData = [{waybillId: this.receipts.waybillId, waybillNum: this.receipts.waybillNum}];
			this.title = "查看单据";
			this.isOnlySee = true;
			this.canEditImg = true;
			this.isShowSureButton = false;
			this.isShowSubmitButton = false;
			this.changeWmsReceiptsShow(true);
		},
		async openSureWmsReceipts()
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
			this.list = this.receipts.imgUrls;
			this.waybillData = await this.common.postUrl("wmsWaybillService", "queryWmsWaybillList", {});

			this.title = "单据确认";
			this.isOnlySee = true;
			this.canEditImg = true;
			this.isShowSureButton = true;
			this.isShowSubmitButton = false;
			this.changeWmsReceiptsShow(true);
		},
		/**
		 * 打开上传单据
		 */
		async openAddWmsReceipts()
		{
			this.initReceipts();
			this.title = "上传单据";
			this.isOnlySee = false;
			this.canEditImg = false;
			this.isShowSureButton = false;
			this.isShowSubmitButton = true;
			this.list=[{}];
			this.changeWmsReceiptsShow(true);
			this.fromTenantData = [];
			this.waybillData = await this.common.postUrl("wmsWaybillService", "queryWmsWaybillList", {});
		},
		async changeWmsWaybill(waybillId)
		{
			this.fromTenantData = [];
			if (this.common.isNotBlank(waybillId))
			{
				this.fromTenantData = await this.common.postUrl("wmsWaybillService", "queryWaybillFromTenantByWaybillId", {waybillId});
				this.$forceUpdate();
			}
		},
		// setImgData(imgData)
		// {
		// 	this.receipts.imgId = imgData.flowId;
		// 	this.receipts.fileName = imgData.fileName;
		// 	this.receipts.imgPath = imgData.storePath;
		// },
		sureWmsReceipts()
		{
			if (this.common.isBlank(this.receipts.rId))
			{
				this.$message.error("请选择短驳配送单号再确认！");
				return false;
			}
			// this.receipts.imgId = this.$refs.receiptsImg.getImageData().flowId;
			// this.receipts.imgPath = this.$refs.receiptsImg.getImageData().storePath;
			// if (this.common.isBlank(this.receipts.imgId))
			// {
			// 	this.$message.error("请上传图片信息再确认！");
			// 	return false;
			// }
			// if (this.common.isBlank(this.receipts.imgPath))
			// {
			// 	this.$message.error("请上传图片信息再确认！");
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
				this.$message.error("请上传图片信息再确认！");
				return false;
			}
			let that = this;
			this.common.postUrl("wmsReceiptsService", "sureWmsReceipts", this.receipts, function (data)
			{
				that.doQuery();
				that.changeWmsReceiptsShow(false);
				that.$msgbox("单据确认成功");
			},null,'',true);
		},
		saveOrUpdateWmsReceipts()
		{
			if (this.common.isBlank(this.receipts.waybillId))
			{
				this.$message.error("请选择短驳配送单号再提交！");
				return false;
			}
			if (this.common.isBlank(this.receipts.fromTenantId))
			{
				this.$message.error("请选择到货厂商再提交！");
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
			if (this.common.isBlank(this.receipts.nums))
			{
				this.$message.error("请输入单据数量再提交！");
				return false;
			}
			let list = this.common.copyObj(this.list);
			this.receipts.receiptsList=[];
			for (let i = 0; i < list.length; i++) {
				if(list[i].imgId){
					this.receipts.receiptsList.push(list[i]);
				}
			}
			if (this.receipts.receiptsList.length==0)
			{
				// this.$message.error("请上传图片信息再提交！");
				// return false;
			}
			let that = this;
			this.common.postUrl("wmsReceiptsService", "saveOrUpdateWmsReceipts", this.receipts, function (data)
			{
				that.doQuery();
				that.changeWmsReceiptsShow(false);
				that.$message.success("单据上传成功");
			},null, null,true);
		},
		cancelSureWmsReceipts()
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
				this.common.postUrl("wmsReceiptsService", "cancelSureWmsReceipts", selectData[0], function (data)
				{
					that.doQuery();
					that.$message.success("取消确认成功！");
				},null,'',true);
			}).catch(() => {});
		},
		deleteWmsReceipts()
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
				this.common.postUrl("wmsReceiptsService", "deleteWmsReceipts", selectData[0], function (data)
				{
					that.doQuery();
					that.$msgbox("删除成功！");
				},null,'',true);
			}).catch(() => {});
		},
		toDetail(item, code)
		{
			if (code == 'receiptsFileName')
			{
				if(item.imgUrls.length==0){
					this.$message.error("没有图片~");
					return;
				}
				this.srcList=[];
				let cout = 0;
				for (let i = 0; i < item.imgUrls.length; i++) {
					if (this.common.isNotBlank(item.imgUrls[i].imgUrl))
						cout++;
					this.srcList.push(item.imgUrls[i].imgUrl);
				}
				if(cout==0){
					this.$message.error("没有图片~");
					return;
				}
				this.$refs.viewer.show();
			}
			else if (code == 'waybillNum')
			{
				this.$emit("openTab",{
					urlId: 'wmsWaybillManage',
					query: {waybillNum: item.waybillNum},
					urlName: "短驳配送管理",
					urlPathName: "/wmsWaybillManage",
					urlPath: "/pt/wms/waybill/wmsWaybillManage.vue"});
			}
		},
		changeWmsReceiptsShow(flag)
		{
			this.showReceipts = flag;
			if (flag)
			{
				this.imgDisplay();
				// this.$nextTick(() =>
				// {
				// 	if (this.common.isNotBlank(this.receipts.imgId))
				// 	{
				// 		this.$refs.receiptsImg.initDate(this.receipts.imgId);
				// 	}
				// });
			}
			this.$forceUpdate();
		},
		// successCallback(imgData)
		// {
		// 	this.receipts.imgId = imgData.flowId;
		// 	this.receipts.imgPath = imgData.storePath;
		// },

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
		if(this.list.length  < 5 && flag && !this.isOnlySee){
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
		gotoLog()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length != 1) {
				this.$message.error("请选择一条数据！");
				return;
			}
			let data = selectData[0];
			this.$emit("openTab",{
				urlId: 'wmsWaybillReceipts' + 'Detail' + data.rId,
				query: {
					logId: data.rId,
					logType: enumData.LOG_TYPE.WMS_WAYBILL_RECEIPTS,
				},
				urlName: "短驳配送单据" + "操作日志",
				urlPathName: "/operateLog",
				urlPath: "/pt/operateLog/operateLog.vue"});
		},

	},
	computed:{
		formData(){
			return [
				{"name":"短驳配送单号","model":"waybillNum","type":"input","placeholder":"短驳配送单号","isshow":true},
				{"name":"货主","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
				{"name":"供应商","model":"supplierName","type":"input","placeholder":"供应商","isshow":true},
				{"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
				{"name":"配送司机","model":"driverName","type":"input","placeholder":"配送司机","isshow":true},
				{"name":"单据状态","model":"receiptState","type":"select","options":this.receiptStateData,"label":"codeName","value":"codeValue","placeholder":"单据状态","method":"doQuery","isshow":true},
				{"name":"确认时间","model":"authDate","type":"daterange","isshow":true},
			]
		}
	},
}
