import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
	name: 'incomeChange',
	mixins: [commonOrder],
	data()
	{
		return {
			change:{
                premiumFee: '',
				loadingFee: '',
				dischargeFee: '',
                emptyDrivingFee: '',
				standbyFee: '',
				otherFee: '',
				totalFee : '',
				isCrossCost : false,
			},
			changeList: [],
			changeSum: {
				premiumFeeSum: 0,
				loadingFeeSum: 0,
				dischargeFeeSum: 0,
                emptyDrivingFeeSum: 0,
				standbyFeeSum: 0,
				otherFeeSum: 0,
				totalFeeSum: 0,
			},
			isOnlySee: this.$route.query.isOnlySee,
			isEdit: this.common.isBlank(this.$route.query.iId),
			srcList: [],
			isMatch: false,//异动默认匹配报价
            isCrossCostShow: true,
		}
	},
	async mounted()
	{
		await this.loadOrderInfo();
	},
	/**
	 * 组件
	 */
	components: {
		fileViewer,
	},
	methods: {
		/**
		 * 加载订单数据
		 */
		async loadOrderInfo()
		{
			let data = await this.common.postUrl("orderTF", "queryOrderInfo",
				{orderId: this.$route.query.orderId, isLoadchangeList: true},
				null, null, null, true);
			/** 订单信息 **/
			this.order = data.order;
			// this.isCrossCostShow = this.common.isNotBlank(data.waybill) && this.common.isNotBlank(data.waybill.waybillIds);
			this.order.isReturnTrip = this.order.isReturnTrip == 1;
			await this.loadCustomerData();
			this.farthestDistanceShow = this.common.isNotBlank(this.order.farthestDistanceInfo);
			await this.loadCustomerDataByTenantId(this.order.tenantId);
			/** 订单作业点信息 **/
			this.workList = data.workList;
			/** 订单货物信息 **/
			this.goodsList = data.goodsList;
			this.goodsList.forEach(item => {
				item.goodsVolumeCopy = item.goodsVolume;//vue监听到变更调用changeGoodsCount变成计算的数值，应该是系统带出来的
			})
			/** 订单收入费用信息 **/
			this.fee = data.fee;
			//2020-12-30 19点 产品柱子提出将费用带出来赋值
			this.change.freightPrice = this.fee.freightPrice;

			/** 订单费用异动记录 **/
			this.changeList = data.changeList;
			this.changeList.forEach(item => {
				this.changeSum.premiumFeeSum = this.common.accAdd(item.premiumFee, this.changeSum.premiumFeeSum);
				this.changeSum.loadingFeeSum = this.common.accAdd(item.loadingFee, this.changeSum.loadingFeeSum);
				this.changeSum.dischargeFeeSum = this.common.accAdd(item.dischargeFee, this.changeSum.dischargeFeeSum);
				this.changeSum.otherFeeSum = this.common.accAdd(item.otherFee, this.changeSum.otherFeeSum);
				this.changeSum.totalFeeSum = this.common.accAdd(item.totalFee, this.changeSum.totalFeeSum);
			});
			/** 作业点变更更新级联数据 **/
			for (let i = 0; i < this.workList.length; i++)
			{
				this.changeWork(this.workList[i], i, true);
			}
			/** 作业点变更更新级联数据 **/
			for (let i = 0; i < this.goodsList.length; i++)
			{
				this.changeGoods(this.goodsList[i], i);
			}
			this.$nextTick(() =>
			{
				this.resetGoodsVolume();
			})
		},
		/**
		 * 显示大图
		 * @param data
		 */
		showBigImg(data)
		{
			this.srcList=[];
			this.srcList.push(data.imgPathUrl);
			this.$refs.viewer.show();
		},
		/**
		 * 计算异动费用合计
		 */
		calcChangeTotalFee()
		{
			this.change.totalFee = 0;
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.premiumFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.loadingFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.dischargeFee));
            this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.emptyDrivingFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.standbyFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.otherFee));
			this.forceUpdate();
		},
		/**
		 * 确认保存异动收入
		 */
		sureChange()
		{
			this.change.orderId = this.$route.query.orderId;
			this.change.orderNum = this.order.orderNum;
			this.change.feeStatementType = 2;//2 异动收入
			this.change.billingType = this.fee.billingType;
			if (this.common.isNotBlank(this.change.premiumFee) && isNaN(this.change.premiumFee))
			{
				this.$message.error("请输入有效的保险费！");
				return false;
			}
			if (this.common.isNotBlank(this.change.loadingFee) && isNaN(this.change.loadingFee))
			{
				this.$message.error("请输入有效的装货费！");
				return false;
			}
			if (this.common.isNotBlank(this.change.dischargeFee) && isNaN(this.change.dischargeFee))
			{
				this.$message.error("请输入有效的卸货费！");
				return false;
			}
			if (this.common.isNotBlank(this.change.otherFee) && isNaN(this.change.otherFee))
			{
				this.$message.error("请输入有效的其他费！");
				return false;
			}

			let sum = 0;
			sum = this.common.accAdd(sum, this.dealValue(this.change.premiumFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.loadingFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.dischargeFee));
            sum = this.common.accAdd(sum, this.dealValue(this.change.emptyDrivingFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.standbyFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.otherFee));
			if (sum != this.change.totalFee)
			{
				this.$message.error("(保险费 + 装货费 + 卸货费 + 放空费 + 压夜费 + 其他费)不等于费用合计，请确认！");
				return false;
			}
			if (sum == 0)
			{
				this.$message.error("异动总费用合计不能为0！");
				return false;
			}
			this.change.statementFee = this.change.totalFee;
			this.change.midwayPointCount = this.workList.length - 2;
			
			let that = this;
			that.$confirm("是否确认新增异动费用？", "提示").then(() =>{
				that.common.postUrl("orderTF", "saveOrdOrderFeeIncomeStatement", that.change, function (data)
				{
					that.$message.success(data == "1" ? "该订单已进报表，此次异动需审核通过才能生效。" : "新增成功！");
					that.closePage();
				},null,'',true);
			}).catch(() =>{
				//取消新增确认
			});
		},

		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
		},
	},
}
