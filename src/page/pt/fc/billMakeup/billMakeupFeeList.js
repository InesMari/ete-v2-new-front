import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'billMakeupFeeList',
	data()
	{
		return {
			head: [
				{"name": "账单编号", "code": "billNum", "width": "130", "type": "diy"},
				{"name": "账单月份", "code": "billMonth", "width": "130", "type": "text"},
				{"name": "客户", "code": "tenantName", "width": "250", "type": "text"},
				{"name": "对账客户", "code": "fcTenantName", "width": "250", "type": "text"},
				{"name": "费用类型", "code": "feeTypeName", "width": "180", "type": "text"},
				{"name": "补录金额", "code": "makeupFee", "width": "100", "type": "text"},
				{"name": "税点", "code": "taxRate", "width": "80", "type": "text"},
				{"name": "是否已确认", "code": "confirmStateName", "width": "90", "type": "text"},
				{"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
				{"name": "所属部门", "code": "orgName", "width": "120", "type": "text"},
				{"name": "不通过原因", "code": "verifyRemark", "width": "120", "type": "text"},
				{"name": "部门审核", "code": "verifyStr1", "width": "120", "type": "text"},
				// {"name": "审计审核", "code": "verifyStr2", "width": "120", "type": "text"},
				{"name": "审核状态", "code": "stsName", "width": "120", "type": "text"},
				{"name": "补录人", "code": "createUserName", "width": "100", "type": "text"},
				{"name": "补录时间", "code": "createDate", "width": "130", "type": "text"},
			],
			query: this.initQuery(),
			showAddMakeup:false,
			makeupInfo:{},
			feeTypeData:[],
			verifyFlg:false,
			viewFlg:false,
			stsData:[],
		}
	},
	mounted()
	{
		this.init();
		this.doQuery();
	},
	components: {
		tableCommon,
		searchList
	},
	methods: {
		/**
		 *
		 */
		doQuery(query=this.query)
		{
			this.query = query;
			this.$refs.table.load("fcCustBillTF", "loadOrderBillSupplementFeeData", this.query);
		},

		/**
		 * 初始化数据
		 */
		init()
		{
			let that = this;
			that.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECONCILIATION_STATE"}, function (data)
			{
				that.reconciliationStateData = data;
			});
			that.common.postUrl("commonTF", "getSysStaticData",{codeType: "CUST_BILL_FEE_TYPE"}, function (data) {
				that.feeTypeData = data;
			});
			that.common.postUrl("commonTF", "getSysStaticData",{codeType: "REQUEST_FEE_STATE"}, function (data) {
				that.stsData = data;
				that.stsData.splice(3,1);
				that.stsData.splice(4,1);
			});
		},
		/**
		 * 清空初始化参数
		 * @returns {{tenantId: string | (string | null)[]}}
		 */
		initQuery()
		{
			this.query = {billNum: '',
				billMonth: '',
				tenantName: this.$route.query.tenantName,
				sts:this.common.isBlank(this.$route.query.sts) ? [] : this.$route.query.sts,};
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
		 * 打开详情
		 * @param data
		 */
		openDetail(data)
		{
			this.$emit('openTab', {
				urlName: '账单明细',
				urlId: 'billDetail_' + data.billId,
				urlPathName: "/fc",
				urlPath: "/pt/fc/custBill/detail/billDetail.vue",
				query: {billId: data.billId, flag: 1,unShowCheck: 1,},
			});
		},
		forceUpdate(){
			this.$forceUpdate();
		},
		addMakeup(flag){
			if(flag){
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1) {
					this.$message.error("请选择一条需要修改的数据！");
					return false;
				}
				if (selectData[0].confirmState == enumData.FC_CONFIRM_STATE.CONFIRMED)
				{
					this.$message.error("账单已确认，无法修改！");
					return false;
				}
				if(selectData[0].sts!=1&&selectData[0].sts!=9){
					this.$message.error("已经审核的数据不允许修改！");
					return false;
				}
				this.makeupInfo= this.common.copyObj(selectData[0]);
				this.makeupInfo.feeType = this.makeupInfo.feeType+'';
				this.showAddMakeup=true;
			}else{
				this.makeupInfo={};
				this.showAddMakeup=false;
				this.viewFlg = false;
			}
			this.verifyFlg = false;
		},
		viewMakeup(data) {
			this.makeupInfo= this.common.copyObj(data);
			this.makeupInfo.feeType = this.makeupInfo.feeType+'';
			this.showAddMakeup=true;
			this.viewFlg = true;
			this.verifyFlg = false;
			this.$forceUpdate();
		},
		async verifyMakeup(flag) {
			if (flag) {
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1) {
					this.$message.error("请选择一条需要修改账单补录的数据！");
					return false;
				}
				if (selectData[0].sts != 1 && selectData[0].sts != 2) {
					this.$message.error("未审核以及审核中的数据才能审核！");
					return false;
				}

				//校验审核人
				let data = await this.common.postUrl("fcCustBillTF", "checkVerifyMakeupInfo", {id: selectData[0].id});
				this.makeupInfo= this.common.copyObj(selectData[0]);
				this.makeupInfo.feeType = this.makeupInfo.feeType+'';
				this.showAddMakeup=true;
				this.verifyFlg = true;
			} else {
				this.makeupInfo = {};
				this.showAddMakeup = false;
				this.verifyFlg = false;
			}
			this.$forceUpdate();
		},
		async verifyMakeupInfo(type) {
			if (this.common.isBlank(this.makeupInfo.id)) {
				this.$message.error("网络异常,关闭当前页面重新选择费用补录审核!");
				return false;
			}
			if (!(enumData.FC_STS.WAIT == this.makeupInfo.sts || enumData.FC_STS.DOING == this.makeupInfo.sts)) {
				this.$message.error("只有未审核和审核中的数据才可以审核！");
				return false;
			}
			this.makeupInfo.type = type;
			if (type === 2) {
				this.$prompt('请输入不通过原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(async ({value}) => {
					if (this.common.isBlank(value)) {
						this.$message.error("请填写不通过原因！");
						return false;
					}
					this.makeupInfo.verifyRemark = value;
					await this.verifyMakeupInfoById();
				}).catch(() => {
				});
			} else
				await this.verifyMakeupInfoById();
		},
		async verifyMakeupInfoById(){
			await this.common.postUrl("fcCustBillTF", "verifyMakeupInfo", this.makeupInfo);
			this.$message.success("审核成功！");
			let that = this;
			setTimeout(() => {
				that.showAddMakeup = false;
				that.doQuery();
			}, 500);
		},
		async cancelVerifyMakeupInfo() {
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1) {
				this.$message.error("请选择一条需要取消审核账单补录的数据！");
				return false;
			}
			if (selectData[0].sts != 2 && selectData[0].sts != 3) {
				this.$message.error("审核中以及审核完毕的数据才能取消审核！");
				return false;
			}
			let that = this;
			that.$confirm("确认需要取消审核？", "提示").then(() =>{
				that.common.postUrl("fcCustBillTF", "cancelVerifyMakeupInfo", selectData[0], function (data)
				{
					that.doQuery();
					that.$message.success("取消审核成功！");
				},null,'',true);
			}).catch(() =>{});
		},
		saveMakeupInfo(){
			if(this.common.isBlank(this.makeupInfo.feeType)){
				this.$message.error("请选择费用类型！");
				return false;
			}
			if(this.common.isBlank(this.makeupInfo.makeupFee)){
				this.$message.error("请输入补录费用！");
				return false;
			}
			if(this.common.isBlank(this.makeupInfo.taxRate)){
				this.$message.error("请输入税点！");
				return false;
			}
			let that = this;
			that.common.postUrl("fcCustBillTF", "saveMakeupInfo", this.makeupInfo, function (data)
			{
				that.doQuery();
				that.$message.success("修改成功！");
				that.showAddMakeup=false;
			},null,'',true);

		},
		/**
		 * 删除未对账的补录
		 */
		deleteBillMakeupFee()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一个需要删除的费用补录数据！");
				return false;
			}
			let data = selectData[0];
			// if (data.confirmState == enumData.FC_CONFIRM_STATE.CONFIRMED)
			// {
			// 	this.$message.error("账单已确认，无法删除！");
			// 	return false;
			// }
			if (!(enumData.FC_STS.WAIT == data.sts || enumData.FC_STS.NOT == data.sts)) {
				this.$message.error("只有未审核和审核不通过的数据才可以删除！");
				return false;
			}
			let that = this;

			that.$confirm("是否删除补录费用？", "提示").then(() =>{
				that.common.postUrl("fcCustBillTF", "delMakeupInfo", data, function (data)
				{
					that.$message.success("删除成功！");
					that.doQuery();
				},null,'',true);
			}).catch(() =>{
				//取消新增确认
			});
		},

	},
	computed:{
		formData(){
			return [
				{"name":"账单编号","model":"billNum","type":"input","placeholder":"账单编号","isshow":true},
				{"name":"账单月份","model":"billMonth","type":"month","isshow":true},
				{"name":"客户","model":"tenantName","type":"input","placeholder":"客户","isshow":true},
				{"name":"审核状态","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","clearable":true,"multiple":true,"method":"doQuery","isshow":true},
			]
		}
	},
}
