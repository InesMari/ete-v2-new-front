import waybillInfo from "@/page/pt/ord/waybill/detail/subpage/waybillInfo.vue";
import feeInfo from "@/page/pt/ord/waybill/feeChange/subpage/feeInfo.vue";
import transitFeeInfo from "@/page/pt/ord/waybill/feeChange/subpage/transitFeeInfo.vue";
import enumData from "@/page/pt/enum.js"

export default {
	name: 'feeChange',
	data()
	{
		return {
			data:{
				waybillInfo: {
					waybillId: '',
					supplierName: '',
					routeName: '',
					bizType: '',
					isTransit: 0,//默认展示派车单数据
					plateNumber: '',
					waybillStateName: ''
				},
				orderStockList:[],
				statementFee:0,
				periodicalPay:0,
				amount:0,
			},
			waybillData: [],
			query: {
				supplierName: this.$route.query.supplierName,
				supplierId: this.$route.query.supplierId,//相同的名称后台可能匹配出来
				tenantName: '',
				routeName: '',
				plateNumber: '',
                cancelWaybills:this.$route.query.cancelWaybills,
			},
			enumData: enumData,
			isTransitShow: false,
		}
	},
	async mounted()
	{
		//派车单管理跳转的查询单个派车单数据
		if (this.$route.query.pId != 1002088)
			await this.queryWaybillInfo(this.$route.query);
		else
			this.waybillData = await this.loadWaybillDataByTenantId(this.$route.query);//供应商强求跳转赋值供应商查询条件加载派车单数据
	},
	components: {
		waybillInfo,
		feeInfo,
		transitFeeInfo,
	},
	methods:{
		async queryWaybillInfo(param){
			let data = await this.common.postUrl("ordWaybillTF", "queryWaybillInfo", param);
			//基础数据
			this.data = data;//数据赋值
			this.statementFee = this.data.waybillInfo.statementFee;
			this.periodicalPay = this.data.waybillInfo.periodicalPay;
			this.amount = this.data.waybillInfo.amount;
			this.$nextTick(() => {
				this.$refs.feeInfo.init();
				this.$refs.waybillInfo.init();
			});
			this.$forceUpdate();
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId)
		},
		doFeeChange(){
			let param = this.$refs.feeInfo.getData();
            param.cancelWaybills = this.$route.query.cancelWaybills;
			let that = this;
			this.common.postUrl("ordWaybillTF", "feeChange", param,function (data){
				if(data) {
                    if (param.cancelWaybills == 1) {
                        that.$message.success("申请异常终止成功，请去找相关人员审核");
                    } else {
                        that.$message.success("新增费用异动成功,请去找相关人员审核");
                    }
					that.$emit("closeTab",that.$route.meta.id, that.$route.meta.parentId,true);
				}
			},null,'',true);
		},
		addChangeFee(totalFee){
			this.data.waybillInfo.periodicalPay = this.common.accAdd(this.periodicalPay,totalFee);
			this.data.waybillInfo.statementFee = this.common.accAdd(this.statementFee,totalFee);
			this.data.waybillInfo.amount = this.common.accAdd(this.amount,totalFee);
			this.$forceUpdate();
		},
		/**
		 * 改变派车单
		 * @returns {Promise<void>}
		 */
		async changeWaybill(waybillId)
		{
			if (this.common.isBlank(this.data.waybillInfo.waybillId))
			{
				this.initWaybillInfo();//清空派车单数据清空展示数据
				this.data.statementList = [];
				this.data.orderStockList = [];
				this.$refs.feeInfo.initTotalFee();
				this.isTransitShow = false;
				this.$forceUpdate();
				return;
			}
			else
			{
				this.isTransitShow = false;
				//派车单和中转单UI切换
				this.waybillData.forEach(item => {
					if (waybillId == item.waybillId && item.isTransit == 1)
						this.isTransitShow = true;//中转UI切换
				});
			}
			if (!this.isTransitShow)
			{
				let param = {waybillId: this.data.waybillInfo.waybillId};
				await this.queryWaybillInfo(param);
			}
			else
			{
				this.$refs.transitFeeInfo.loadWaybillStatementList(this.data.waybillInfo.waybillId);
			}
		},
		/**
		 * 运单详情
		 * @returns {boolean}
		 */
		toWaybillDetail()
		{
			if (this.common.isBlank(this.data.waybillInfo.waybillId))
			{
				this.$message.error("请先选择派车单！");
				return false;
			}
			this.$emit("openTab",{
				urlId: 'waybillDetail' + this.data.waybillInfo.waybillId,
				query: {waybillId: this.data.waybillInfo.waybillId},
				urlName: "派车单详情",
				urlPathName: "/detail",
				urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
		},
		/**
		 * 改变供应商初始化查询
		 */
		changeSupplierName()
		{
			this.query.supplierId = "";
		},
		/**
		 * 初始化查询条件
		 */
		initQuery()
		{
			this.query = {
				supplierName: '',
				supplierId: '',
				tenantName: '',
				routeName: '',
				plateNumber: '',
			};
		},
		/**
		 * 初始化派车单数据
		 * @returns {*}
		 */
		initWaybillInfo()
		{
			this.data.waybillInfo = {
				waybillId: '',
				waybillNum: '',
				supplierName: '',
				routeName: '',
				isTransit: 0,//默认展示派车单数据
				plateNumber: '',
				waybillStateName: ''
			}
			return this.data.waybillInfo;
		},
		/**
		 * 加载供应商派车单
		 * @returns {Promise<unknown>}
		 */
		async loadWaybillDataByTenantId(param)
		{
			return await this.common.postUrl("ordWaybillTF", "queryOrdWaybillData", param);
		},
		/**
		 * 保存费用异动变更
		 */
		saveFeeMoveInfo()
		{
			this.$refs.transitFeeInfo.feeInfo.waybillId = this.data.waybillInfo.waybillId;
			let param = {
				feeInfo: this.$refs.transitFeeInfo.feeInfo,
				orderStockStatementList: [this.$refs.transitFeeInfo.feeInfo],
			};
			if(this.$refs.transitFeeInfo.transitOtherFee <= 0){
				this.$message.error("请输入中转其他费用！");
				return false;
			}
			let that = this;
			this.common.postUrl("ordWaybillTF", "feeChange", param, function (data) {
				if (data) {
					// if (data == '1') {
					// 	that.$message.success("新增费用异动成功");
					// } else {
						that.$message.success("新增费用异动成功,请去找相关人员审核");
						// that.$message.warning("该中转单已进报表，此次异动需审核通过才能生效");
					// }
					that.$refs.transitFeeInfo.feeInfo.transitOtherFee = '';
					that.$refs.transitFeeInfo.feeInfo.totalTransitFee = '';
					that.$refs.transitFeeInfo.feeInfo.remark = '';
					that.$refs.transitFeeInfo.loadWaybillStatementList(that.data.waybillInfo.waybillId);
				}
			}, null, '', true);
		},
	},

}
