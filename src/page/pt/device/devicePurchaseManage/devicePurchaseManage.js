import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';
import date from "@/components/myElDatePicker/src/panel/date.vue";
import myImport from "@/components/myImport/myImport";

export default {
	name: 'devicePurchaseManage',
	data()
	{
		return {
			head: [
				{"name": "采购单号", "code": "purchaseOrderNum", "width": "150", "type": "text"},
				{"name": "采购合同编号", "code": "custOrderNum", "width": "150", "type": "text"},
				{"name": "采购费用申请", "code": "applyNums", "width": "200", "type": "diy"},
				{"name": "收货明细", "code": "deliveryDetail", "width": "110", "type": "diy"},
				{"name": "最终合同", "code": "file", "width": "110", "type": "diy"},
				{"name": "供应商名称", "code": "suppierTenantName", "width": "250", "type": "text"},
				{"name": "采购方", "code": "settleBodyName", "width": "250", "type": "text"},
				{"name": "仓库", "code": "workName", "width": "150", "type": "text"},
				{"name": "采购单状态", "code": "stateName", "width": "180", "type": "text"},
				{"name": "器具名称", "code": "deviceNames", "width": "250", "type": "text"},
				{"name": "使用客户", "code": "custTenantName", "width": "250", "type": "text"},
				{"name": "交付地", "code": "deliveryWorkName", "width": "150", "type": "text"},
				{"name": "采购数量", "code": "purchaseNums", "width": "100", "type": "text"},
				{"name": "已经收货数量", "code": "deliveryNums", "width": "100", "type": "text"},
				// {"name": "客户确认状态", "code": "confirmStateName", "width": "100", "type": "text"},
				// {"name": "客户确认日期", "code": "confirmDate", "width": "150", "type": "text"},
				{"name": "采购人", "code": "createUserName", "width": "150", "type": "text"},
				{"name": "采购时间", "code": "createDate", "width": "150", "type": "text"},
			],
			supplierData: [],
			customerData: [],
			stateData: [],
			businessModeData:[],
			query: this.initQuery(
				this.common.isBlank(this.$route.query.tenantId) ? '' : this.$route.query.tenantId.toString(),
				this.common.isBlank(this.$route.query.supplierId) ? '' : Number(this.$route.query.supplierId)),

			details:[],
			showUploadPage:false,
			purchaseOrderDtls:[],
			purchase:{
				devDeviceId:'',
				costChargeDate:'',
				incomeChargeDate:'',
				deliveryNums:'',
			},

			showDetail:false,	//查看明细弹窗
			srcList: [],	//图片列表
			showFile:false,
			info:{},
			uploadOpen:false,
			custOrderNum:'',
			fileList: [{}],
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
		searchList,
		fileViewer,
		myImport
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
			this.uploadOpen = false;
			await this.$refs.table.load("devPurchaseOrderService", "queryDevPurchaseOrderPage", this.query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			//所有可开票供应商
			this.supplierData = await this.common.postUrl("supplierTF", "queryInvoiceFlgSupplier", {});
			//客户（物流运输模式）
			this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
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
			this.businessModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BUSINESS_MODE"});
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
				custTenantId: tenantId,//客户详情采购管理跳转
				businessMode:'',
				state: '',
				deviceName: '',
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
		async viewDetail(item) {
			this.details = await this.common.postUrl("devPurchaseOrderService", "queryDevPurchaseOrderDeliveryDtl", {id:item.id});
			this.details.forEach(item => {
				item.show = this.common.isNotBlank(item.urlList.length > 0);
			});
			this.showDetail = true;
			this.$forceUpdate();
		},

		/**
		 * 展示采购单信息
		 * @param type 1新增 2修改 3查看
		 */
		async addPurchase( type,item) {
            if (type === 1) {
                this.$emit('openTab',{
                    urlId: 'addDevicePurchase',
                    urlName: '新增器具采购单',
                    urlPathName: '',
					query:{type:1},
                    urlPath: '/pt/device/devicePurchaseManage/addDevicePurchase.vue'})
            } else if (type === 2) {
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1)
				{
					this.$message.error("请选择一条需要修改的采购单!");
					return false;
				}
				if(selectData[0].state == enumData.PURCHASE_ORDER_STATE.SURE_RECEIVED)
				{
					this.$message.error("确认收货的采购单不能修改！");
					return false;
				}
				if(selectData[0].state == enumData.PURCHASE_ORDER_STATE.CANCELLED)
				{
					this.$message.error("已取消的采购单不能修改！");
					return false;
				}
                this.$emit('openTab',{
                    urlId: 'updateDevicePurchase'+selectData[0].id+new Date().getTime(),
                    urlName: '修改器具采购单',
                    urlPathName: '',
					query:{type:2,id:selectData[0].id},
                    urlPath: '/pt/device/devicePurchaseManage/addDevicePurchase.vue'})
            } else{
				this.$emit('openTab',{
					urlId: 'viewDevicePurchase'+item.id,
					urlName: '查看器具采购单',
					urlPathName: '',
					query:{type:3,id:item.id},
					urlPath: '/pt/device/devicePurchaseManage/addDevicePurchase.vue'})
			}
		},


		/**
		 * 双击详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.addPurchase(3,data);
		},


		/**
		 * 更新数据
		 */
		forceUpdate()
		{
			this.$forceUpdate();
		},
		/**
		 * 展示上传
		 */
		async showUpload(flag)
		{
			if (flag)
			{
				this.purchase={};
				let that = this;
				if (this.common.isNotBlank(this.fileList) && this.fileList.length > 0)
				{
					for (let i = 0; i < this.fileList.length; i++)
					{
						if (this.common.isNotBlank(this.fileList[i].flowId))
						{
							eval("that.$refs.file" + i + "[0].clean()");
						}
					}
				}
				this.fileList = [{}];
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1)
				{
					this.$message.error("请选择一条需要确认收货的采购单!");
					return false;
				}
				if(selectData[0].state == enumData.PURCHASE_ORDER_STATE.CANCELLED)
				{
					this.$message.error("已取消的采购单无法继续确认收货！");
					return false;
				}
				if(selectData[0].state == enumData.PURCHASE_ORDER_STATE.SURE_RECEIVED)
				{
					this.$message.error("确认收货的采购单无法继续确认收货！");
					return false;
				}
				this.purchaseOrderDtls = await this.common.postUrl("devPurchaseOrderService", "getPurchaseOrderDtl", {id: selectData[0].id});
				this.purchase.purchaseOrderNum = selectData[0].purchaseOrderNum;
				this.$forceUpdate();
			}
			this.showUploadPage = flag;
		},
		changeDevice(){
			if(!this.purchase.devDeviceId){
				this.purchase.spec = '';
				this.purchase.custTenantName = '';
			}else{
				let orderDtl = this.purchaseOrderDtls.find(item => item.devDeviceId === this.purchase.devDeviceId);
				this.purchase.spec = orderDtl.spec;
				this.purchase.custTenantName = orderDtl.custTenantName;

				this.purchase.devPurchaseOrderId = orderDtl.devPurchaseOrderId;
				this.purchase.devPurchaseOrderDtlId = orderDtl.devPurchaseOrderDtlId;
				this.purchase.devContractId = orderDtl.devContractId;
				this.purchase.devContractDeviceId = orderDtl.devContractDeviceId;
				this.purchase.custTenantId = orderDtl.custTenantId;
				this.purchase.deliveryWorkId = orderDtl.deliveryWorkId;
				this.purchase.remainPurchaseNums = orderDtl.remainPurchaseNums;
			}
		},
		checkDeliveryNums(){
			if(this.purchase.deliveryNums>this.purchase.remainPurchaseNums){
				this.$message.error("配送数量大于剩余未收货数量!");
				return false;
			}
		},

		/**
		 * 删除采购单
		 */
		deletePurchase()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要取消的采购单!");
				return false;
			}
			if(selectData[0].state != enumData.PURCHASE_ORDER_STATE.UNRECEIVED)
			{
				this.$message.error("只有未收货的采购单才能取消！");
				return false;
			}
			this.$confirm("确定需要取消当前采购单吗？", "提示").then(async() =>{
				await this.common.postUrl("devPurchaseOrderService", "delDevPurchaseOrderInfo", selectData[0], null, null, '', true);
				await this.doQuery();
				this.$message.success("取消成功！");
			}).catch(() =>{});
		},
		async sureReceived() {
			if(this.common.isBlank(this.purchase.devDeviceId))
			{
				this.$message.error("请选择器具名称！");
				return false;
			}
			if(this.common.isBlank(this.purchase.costChargeDate))
			{
				this.$message.error("请选择成本计费时间！");
				return false;
			}
			if(this.common.isBlank(this.purchase.incomeChargeDate))
			{
				this.$message.error("请选择收入计费时间！");
				return false;
			}
			if(this.common.isBlank(this.purchase.deliveryNums))
			{
				this.$message.error("请输入配送数量！");
				return false;
			}
			//获取图片
			this.purchase.fileList = this.fileList;
			await this.common.postUrl("devPurchaseOrderService", "selfConfirmPurchaseOrderInfo", this.purchase, null, null, '', true);
			await this.doQuery();
			this.$message.success("收货确认成功！");
			await this.showUpload(false);
			if (this.common.isNotBlank(this.fileList) && this.fileList.length > 0)
			{
				for (let i = 0; i < this.fileList.length; i++)
				{
					if (this.common.isNotBlank(this.fileList[i].flowId))
					{
						eval("that.$refs.file" + i + "[0].clean()");
					}
				}
			}
		},
        /**
         * 导出
         */
        download(){
			let fileName = '采购单.xlsx';
			let param = {};
			let array = this.$refs.table.getSelectItem();
			if (array.length != 1) {
				this.$message.error("请选择一条数据");
				return false;
			}
			param.id = array[0].id;
			param.selfCreateUrl = 'devPurchaseOrderService|downloadExcel';
			this.common.downloadExcelFile('', param, '', '', fileName, 'devicePurchaseManageTable');
        },
		successCallback(imgData)
		{
			if (this.fileList.length <= 4)
			{
				this.fileList[imgData.componentId] = imgData;
			}
			if (this.fileList.length < 4)
			{
				this.fileList.push({});
			}
			this.initListComponentId();
		},
		delCallback(index)
		{
			this.fileList.splice(index, 1);
			let flag = true;
			for (let i = 0; i < this.fileList.length; i++)
			{
				if (this.common.isBlank(this.fileList[i].flowId))
				{
					flag = false;//存在空的
				}
			}
			if (this.fileList.length === 3 && flag)
			{
				this.fileList.push({});
			}
			this.initListComponentId();
		},
		async imgDisplay()
		{
			this.$nextTick(() =>
			{
				let that = this;
				for (let i = 0; i < this.fileList.length; i++)
				{
					if (that.fileList[i].flowId)
					{
						eval("that.$refs.file" + i + "[0].initDate(" + that.fileList[i].flowId + ")");
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
			for (let i = 0; i < this.fileList.length; i++)
			{
				this.fileList[i].componentId = i;
			}
			this.$forceUpdate();
		},
		viewImg(item){
			if(this.common.isBlank(item)
					|| this.common.isBlank(item.urlList)
					|| item.urlList.length == 0)
			{
				this.$message.error("这条明细确认收货上传交货清单~");
				return;
			}
			this.srcList=[];
			for (let i = 0; i < item.urlList.length; i++)
			{
				this.srcList.push(item.urlList[i]);
			}
            this.$refs.viewer.show();
		},
		showImg(data){
			if(!data.fileUrl){
				return;
			}
			let typeList = {
				img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
				table:".xls,.xlsx,.XLS,.XLSX",
				file:"file"
			};
			let fileTypeName = data.fileUrl.substring(data.fileUrl.lastIndexOf('.'), data.fileUrl.length);
			if(typeList['img'].indexOf(fileTypeName)>-1){
				this.srcList=[];
				this.srcList.push(data.fileUrl);
            	this.$refs.viewer.show();
			}else{
				data.fileUrl = data.fileUrl.replace("_big", "");
                let url = data.fileUrl;
                let fileType = this.common.getFileType('',url);
                if(fileType=='pdf'){   //查看pdf
                    let idx = url.indexOf("?");
                    if(idx>=0){
                        url = url.substring(idx,0);
                    }
                    this.srcList=[];
                    this.srcList.push(url);
            		this.$refs.viewer.show();
                }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
                    this.srcList=[];
                    this.srcList.push(url);
            		this.$refs.viewer.show();
                }else{  //下载文件
                    this.common.downloadFile(url)
                }
			}
		},

		/**
		 * 上传单据
		 */
		async showFileUpload()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要上传最终合同的采购单！");
				return false;
			}
			let data = selectData[0];

			this.showFile = true;
			this.info = this.common.copyObj(data);
			let that = this;
			this.$nextTick(() => {
				if(that.info.fileId){
					that.$refs.file.initDate(that.info.fileId);
				}else{
					that.$refs.file.clean();
				}
			})
		},
		async uploadPoOrderFile() {
			//获取图片
			this.info.fileId = this.$refs.file.getImageData().flowId;
			this.info.filePath = this.$refs.file.getImageData().storePath;
			this.info.custOrderNum = this.custOrderNum;
			await this.common.postUrl("devPurchaseOrderService", "uploadPoOrderFile", this.info, null, null, '', true);
			this.showFile = false;
			await this.doQuery();
			this.$message.success("上传成功！");
			this.showUpload(false);
		},
		/**
		 * 跳转采购申请明细
		 * @param param
		 * @param index
		 * @returns {Promise<void>}
		 */
		async toDetail(param,code,index)
		{
			let id = param.applyIdArray[index];
			if(param.feeApplySrc==1){
				this.$emit("openTab",{
					urlName: '查看采购费用申请',
					urlId: "purchaseDetail" + id,
					urlPathName: "/purchaseDetail",
					urlPath: "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue",
					query: {id: id},
				});
			}else{
				this.$emit("openTab",{
					query:{id:id,viewType:1},
					urlId: 'feeApplyDetail'+id,
					urlName: '查看费用申请单',
					urlPathName: '/feeApplyDetail',
					urlPath: "/pt/purchase/feeApply/examFeeApply.vue",
				});
			}
		},
		// 打印
		print(){
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要修改的采购单!");
				return false;
			}
			let id = selectData[0].id;
			this.$emit("openTab",{
				urlName: '打印器具采购单',
				urlId: "printDevicePurOrder" + id,
				urlPathName: "/printDevicePurOrder",
				urlPath: "/pt/device/devicePurchaseManage/printDevicePurOrder.vue",
				query: {id},
			});
		}
	},
	computed:{
		formData(){
			return [
				{"name":"采购单号","model":"purchaseOrderNum","type":"input","placeholder":"搜索采购单号","isshow":true},
				{"name":"供应商名称","model":"suppierTenantId","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","placeholder":"供应商名称","method":"doQuery","isshow":true},
				{"name":"使用客户","model":"custTenantId","type":"select","options":this.customerData,"label":"name","value":"tenantId","placeholder":"使用客户","method":"doQuery","isshow":true},
				{"name":"业务类型","model":"businessMode","type":"select","options":this.businessModeData,"label":"codeName","value":"codeValue","placeholder":"业务类型","method":"doQuery","isshow":true},
				{"name":"采购单状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"采购单状态","method":"doQuery","isshow":true},
				{"name":"器具名称","model":"deviceName","type":"input","placeholder":"器具名称","isshow":true},
			]
		}
	},
}
