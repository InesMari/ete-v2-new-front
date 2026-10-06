import myFileModel from '@/components/myFileModel/myFileModel.vue';
import dbTable from "@/components/dbTable/dbTable.vue";

export default {
	name: 'addDevicePurchase',
	data()
	{
		return {
			isOnlySee:this.$route.query.type==3,
			modiPurchaseNums:true,//后续部分收货可以改数量？
			supplierData: [],
			customerData: [],
			settleBodyData:[],
			storeHouseData: [],
			transportModeData:[],
			deliveryWorkData:[],
			applyData:[],
			unitData:[],
			purchase: this.initPurchase(),
            contractHead: [
                {"name": "合同编号", "code": "devContractNum", "width": "150", "type": "text"},
				{"name": "器具名称", "code": "deviceName", "width": "200", "type": "text"},
				{"name": "器具规格", "code": "spec", "width": "120", "type": "text"},
				{"name": "业务模式", "code": "businessModeName", "width": "150", "type": "text"},
                {"name": "待采购数量", "code": "remainPurchaseNums", "width": "100", "type": "text"},
            ],
			isShowDialog:false,
			dtls:[],
			totalInfo:{},
			disablePurchaseNums:false,
		}
	},
	/**
	 * 初始化
	 */
	async mounted()
	{
		await this.initData();
	},
	/**
	 * 组件
	 */
	components: {
		myFileModel,
		dbTable,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			//所有可开票供应商
			this.supplierData = await this.common.postUrl("devPurchaseOrderService", "querySupplierTenants", {});
			this.customerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {});
			this.applyData = await this.common.postUrl("purFeeApplyTF", "getFeeApply", {});
			this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
			this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
			this.transportModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TRANSPORT_MODE"});
			this.unitData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_ORDER_UNIT"});

			if(this.common.isNotBlank(this.$route.query.applyIds)){
				let applyIds = this.$route.query.applyIds;
				this.purchase.applyIds=applyIds.map(Number);
				// this.disablePurchaseNums=true;
			}

			if((this.$route.query.type==2||this.$route.query.type==3)&&this.$route.query.id){
				let data = await this.common.postUrl("devPurchaseOrderService", "getDevPurchaseOrderInfo", {id:this.$route.query.id});
				if(data.baseInfo.state==2){
					this.modiPurchaseNums=false;
					this.isOnlySee = true;
				}else{
					this.modiPurchaseNums=true;
				}
				this.purchase = data.baseInfo;
				this.purchase.settleBody =  data.baseInfo.settleBody+'';
				this.purchase.transportMode =  data.baseInfo.transportMode+'';
				if(this.common.isNotBlank(this.purchase.applyIds)){
					if(this.purchase.feeApplySrc==1){
						this.applyData = await this.common.postUrl("purchaseApplyServiceImpl", "getPurchaseApply", {applyIds:this.purchase.applyIds});
					}else{
						this.applyData = await this.common.postUrl("purFeeApplyTF", "getFeeApply", {applyIds:this.purchase.applyIds});
						// this.disablePurchaseNums=true;
					}
					let applyIds = this.purchase.applyIds.split(',');
					this.purchase.applyIds=applyIds.map(Number);
				}
				this.changeSuppier();
				await this.initDeliveryWork(data.baseInfo.deliveryWorkId);
				this.dtls = data.dtlList;
				let that = this;
				that.$nextTick(() => {
					for (let i = 0; i < this.dtls.length; i++) {
						this.dtls[i].unit = this.dtls[i].unit + '';
						eval("that.$refs.file" + i + "[0].initDate(" + that.dtls[i].imgId + ")");
					}
				});
				this.calcTotal();
				this.$forceUpdate();
			}
		},
		changeSettleBody(){
			if(this.dtls.length>0){
				this.dtls=[];
				this.$refs.table.setRightData([]);
			}
		},
		changeCustTenant(){
			if(this.dtls.length>0){
				this.dtls=[];
				this.$refs.table.setRightData([]);
			}
			this.initDeliveryWork();
		},
		async initDeliveryWork(workId) {
			this.deliveryWorkData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:this.purchase.workId,tenantId:this.purchase.custTenantId});
			if(!workId){
				this.purchase.deliveryWorkId = '';
			}
			this.changeDeliveryWork();
		},
		changeSuppier(){
			if(!this.purchase.suppierTenantId){
				this.purchase.suppierAddress = '';
				this.purchase.suppierLinkPhone = '';
				this.purchase.suppierLinkman = '';
				this.purchase.suppierEmail = '';
				this.purchase.bankAccountName = '';
				this.purchase.bankSubName = '';
				this.purchase.bankCard = '';
			}else{
				let supplierInfo = this.supplierData.find(item => item.tenantId === this.purchase.suppierTenantId);
				this.purchase.suppierAddress = supplierInfo.address;
				this.purchase.suppierLinkPhone = supplierInfo.linkPhone;
				this.purchase.suppierLinkman = supplierInfo.linkman;
				this.purchase.suppierEmail = supplierInfo.email;
				this.purchase.bankAccountName = supplierInfo.bankAccountName;
				this.purchase.bankSubName = supplierInfo.bankSubName;
				this.purchase.bankCard = supplierInfo.bankCard;
			}
		},
		changeDeliveryWork(){
			if(!this.purchase.deliveryWorkId){
				this.purchase.deliveryAddress = '';
				this.purchase.workType = '';
			}else{
				let deliveryWork = this.deliveryWorkData.find(item => item.workId === this.purchase.deliveryWorkId);
				this.purchase.deliveryAddress = deliveryWork.address + ' ' + deliveryWork.linkmanName + ' ' + deliveryWork.bill;
				this.purchase.workType = deliveryWork.workType;
			}
			this.$forceUpdate();
		},
		calcFee1(index){
			if(this.dtls[index].purchaseNums&&this.dtls[index].priceWithTax){
				this.dtls[index].totalFeeWithTax = this.common.accMul(this.dtls[index].purchaseNums,this.dtls[index].priceWithTax);
			}
			this.calcTotal();
		},
		calcFee2(index){
			if(this.dtls[index].purchaseNums&&this.dtls[index].totalFeeWithTax){
				this.dtls[index].priceWithTax = this.common.accDiv(this.dtls[index].totalFeeWithTax,this.dtls[index].purchaseNums);
			}
			this.calcTotal();
		},
		calcTotal(){
			let purchaseNums=0;
			let totalFeeWithTax=0;
			for (let i = 0; i < this.dtls.length; i++) {
				purchaseNums = this.common.accAdd(this.dtls[i].purchaseNums,purchaseNums);
				totalFeeWithTax = this.common.accAdd(this.dtls[i].totalFeeWithTax,totalFeeWithTax);
			}
			this.totalInfo.purchaseNums=purchaseNums;
			this.totalInfo.totalFeeWithTax=totalFeeWithTax;
			this.$forceUpdate();
		},

		/**
		 * 初始化采购单
		 */
		initPurchase()
		{
			return this.purchase = {
				suppierTenantId: '',
				suppierAddress: '',
				suppierLinkPhone: '',
				suppierLinkman: '',
				suppierEmail: '',
				bankAccountName: '',
				bankSubName: '',
				bankCard: '',
				settleBody: '',
				purchaseNums: '',
				workId: '',
				linkBill: this.common.userInfo().billId,
				linkman: this.common.userInfo().userName,
				email: this.common.userInfo().email,
				transportMode: '',
				waitDay: '',
				estimatedPickDate: '',
				pickAddress: '',
				payRemark: '',
				custTenantId: '',
				deliveryWorkId: '',
				deliveryAddress: '',
				remark: '',
			};
		},
		// 选择合同
		chooseContract(){
			if(!this.purchase.workId){
				this.$message.error("请先选择仓库!");
				return false;
			}
			if(!this.purchase.custTenantId){
				this.$message.error("请先选择使用客户!");
				return false;
			}
			this.isShowDialog = true;

			this.$nextTick(async ()=>{
				if(this.dtls.length>0){
					let dtls = this.common.copyObj(this.dtls);
					this.$refs.table.setRightData(dtls);
					//查询
				}
				this.$refs.table.load("deviceContractService", "queryContractDeviceList", {workId:this.purchase.workId,custTenantId:this.purchase.custTenantId});
			})
		},
		forceUpdate(){
			this.$forceUpdate();
		},
		remove(index){
			this.dtls.splice(index,1);
		},
		async selContractDtl() {
			let selectData = this.$refs.table.getRightData();
			if (selectData.length == 0) {
				this.$message.error("请先选择合同器具!");
				return false;
			}
			this.dtls = this.common.copyObj(selectData);
			if (this.purchase.applyIds != null && this.purchase.applyIds.length > 0) {
				this.applyDataDtl = await this.common.postUrl("purFeeApplyTF", "getFeeApplyDtl", {applyIds: this.purchase.applyIds});
				for (let i = 0; i < this.dtls.length; i++) {
					this.dtls[i].purchaseNums = this.applyDataDtl[this.dtls[i].devDeviceId];
					this.calcFee1(i);
				}
			}
			this.isShowDialog = false;
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
		},
		async saveDevPurchaseOrder() {
			if (this.dtls.length == 0) {
				this.$message.error("请先选择合同器具!");
				return false;
			}
			let that = this;
			for (let i = 0; i < this.dtls.length; i++) {
				let file = eval("that.$refs.file" + i + "[0].getImageData()");
				this.dtls[i].imgId = file.flowId;
				this.dtls[i].imgPath = file.storePath;
			}
			let param = this.common.copyObj(this.purchase);
			param.dtls = this.dtls;
			let method = 'saveDevPurchaseOrder';
			if(!this.modiPurchaseNums){
				method = 'saveDevPurchaseNums';
			}else{
				param.applyIds = param.applyIds.join(",");
			}
			await this.common.postUrl("devPurchaseOrderService", method, param, null, null, '', true);
			this.$message.success("保存成功！");
			this.closePage();
		}
		
	},
}
