import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js"
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
	name: 'wmsPackMaterialRegisterChangeManage',
	data()
	{
		return {
			head: [
				{"name": "包材名称", "code": "name", "width": "200", "type": "text"},
				{"name": "供应商", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "登记数量", "code": "nums", "width": "120", "type": "text"},
				{"name": "成本金额", "code": "totalFee", "width": "150", "type": "text"},
				{"name": "本次异动金额", "code": "totalFee2", "width": "150", "type": "text"},
				{"name": "异动后金额", "code": "sumTotalFee", "width": "150", "type": "text"},
				{"name": "审核状态", "code": "verifyStateName", "width": "150", "type": "text"},
				{"name": "审核人", "code": "verifyUserName", "width": "150", "type": "text"},
				{"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
				{"name": "审核备注", "code": "verifyRemark", "width": "200", "type": "text"},
				{"name": "申请人", "code": "createDate", "width": "150", "type": "text"},
				{"name": "申请时间", "code": "createUserName", "width": "150", "type": "text"},
			],
			query: this.initQuery(),
			verifyStateData: [],
			showSelWork:false,
		}
	},
	mounted()
	{
		this.initSelWork();
		this.doQuery();
		this.initData();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		enumData,
		selectWork
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
		
		/**
		 * 列表查询
		 */
		async doQuery()
		{
			await this.$refs.table.load("wmsPackMaterialTF", "queryPackMaterialChangePage", this.query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery()
		{
			return this.query = {
				name: '',
				tenantName: '',
				verifyState: '',
			};
		},
		deleteChange()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的异动数据！");
				return false;
			}
			if (selectData[0].verifyState != 0)
			{
				this.$message.error("审核状态不是未审核的不允许删除！");
				return false;
			}
			this.$confirm('是否确认删除此异动记录？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(async () => {
				await this.common.postUrl("wmsPackMaterialTF", "deletePackMaterialChange", {changeId: selectData[0].changeId});
				this.$message.success("删除成功!")
				await this.doQuery();
			});
		},
		verifyChange()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要审核的异动数据！");
				return false;
			}
			let data = selectData[0];
			if (data.verifyState != 0)
			{
				this.$message.error("审核状态不是未审核的不允许审核！");
				return false;
			}
			let param = {changeId: selectData[0].changeId};
			this.$confirm("确认审核通过后不可回退，该笔费用会被计入下个月报表，是否确认？", "异动审核",{
				confirmButtonText: '不通过',
				cancelButtonText: '通过',
				type: 'warning',
				showInput: true,
				center: true,
				closeOnClickModal: false,
				distinguishCancelAndClose: true,
				inputPlaceholder: '不通过原因'
			}).then(async ({value}) =>{
				param.verifyState = 2;
				param.verifyRemark = value;
				await this.common.postUrl("wmsPackMaterialTF", "verifyPackMaterialChange", param);
				await this.doQuery();
				this.$message.success("审核不通过成功！");
			}).catch(async action =>{
				if ( action === 'cancel')
				{
					param.verifyState = 1;
					await this.common.postUrl("wmsPackMaterialTF", "verifyPackMaterialChange", param);
					await this.doQuery();
					this.$message.success("审核通过成功！")
				}
			});
		},
		detailChange()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要查看的异动数据！");
				return false;
			}
			let data = selectData[0];
			this.$emit("openTab",{
				urlId: "wmsPackMaterialChangeDetail" + data.recordId,
				query: {type: 0, recordId: data.recordId},
				urlName: '包材登记成本异动详情',
				urlPathName: "/wmsPackMaterialChangeDetail",
				urlPath: '/pt/wms/base/packMaterial/wmsPackMaterialChange.vue'});
		},
	},
}
