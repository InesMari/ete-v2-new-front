import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js"
import selectWork from "@/page/pt/wms/selectWork.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'wmsConsignorTenantManage',
	data()
	{
		return {
			head: [
				{"name": "货主名称", "code": "name", "width": "200", "type": "text"},
				{"name": "关联客户", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "结算类型", "code": "settleTypeName", "width": "160", "type": "text"},
				{"name": "货主编码", "code": "code", "width": "120", "type": "text"},
				{"name": "联系人", "code": "linkman", "width": "120", "type": "text"},
				{"name": "联系方式", "code": "linkPhone", "width": "120", "type": "text"},
				{"name": "对账日", "code": "reconciliationDate", "width": "90", "type": "text"},
				{"name": "地址", "code": "workAddressStr", "width": "200", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "180", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "180", "type": "text"},
			],
			query: this.initQuery(this.$route.query.name),
			customerData: [],//客户
			settleTypeData:[],
			consignorShow: false,
			isOnlySee: false,//是否仅仅查看
			showAddButton: false,
			showUpdateButton: false,
			title: '新增货主',
			consignor: this.initConsignor(),
			showSelWork:false,
		}
	},
	/**
	 * 初始化
	 */
	async mounted()
	{
		this.initSelWork();
		this.doQuery();
		this.initData();
	},
	/**
	 * 组件
	 */
	components: {
		searchList,
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
		async doQuery(query = this.query)
		{
			let {items} = await this.$refs.table.load("wmsTenantTF", "queryConsignorTenantPage", query);
			items.forEach(item => {
				item.tenantId = item.tenantId + "";
			});
			this.$refs.table.resetData(items);
			this.$forceUpdate();
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
			//加载静态枚举
			let that = this;
			let codeTypes = 'SETTLE_TYPE';
			this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType': codeTypes},function (data) {
				that.settleTypeData = data.SETTLE_TYPE;
			});
		},
		/**
		 * 初始化货主
		 */
		initConsignor()
		{
			return this.consignor = {
				code: '',
				tenantId: '',
				name: '',
				linkman: '',
				linkPhone: '',
				reconciliationDate: '',
				address: '',
				noChangeTenant: true,//不能改变客户
			};
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery(name)
		{
			this.query = {
				name: name,
				tenantName: '',
				code: '',
				settleType:''
			};
			return this.query;
		},
		/**
		 * 双击详情
		 * @param data
		 */
		dblclickItem(data)
		{
			// this.showConsignor(true, 3, data);

			//改用新版货主详情
			let item = {
				urlName: "货主详情",
				urlId: 'wmsConsignorTenantCenter' + data.wId,
				urlPathName: "/base",
				urlPath: "/pt/wms/base/wmsConsignorTenantCenterMain.vue",
				query:{
					id: data.wId,
					logId: data.wId,
					logType: enumData.LOG_TYPE.CONSIGNOR,
				}//货主id
			}
			this.$emit('openTab', item);
		},
		/**
		 * 控制弹窗
		 * @param flag
		 * @param type 1新增 2修改 3查看
		 * @param data
		 */
		showConsignor(flag, type, data)
		{
			this.initConsignor();
			if (type === 1)
				this.title = '新增货主';
			else if (type === 2)
			{
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1)
				{
					this.$message.error("请选择一条需要修改的货主！");
					return false;
				}
				this.title = '修改货主';
				this.consignor = this.common.copyObj(selectData[0]);
			}
			else if (type === 3)
			{
				this.title = '查看货主';
				this.consignor = this.common.copyObj(data);
			}
			this.consignor.address = this.consignor.workAddressStr;
			this.showAddButton = type === 1;
			this.showUpdateButton = type === 2;
			this.isOnlySee = type === 3;//不是查看都是可输入
			this.consignorShow = flag;
			this.$forceUpdate();
		},
		/**
		 * 新增/修改货主
		 * @param flag 1新增   2 修改
		 * @returns {Promise<boolean>}
		 */
		async saveOrUpdateConsignor(flag)
		{
			if (this.common.isBlank(this.consignor.name))
			{
				this.$message.error("请输入货主名称！");
				return false;
			}
			if (this.common.isBlank(this.consignor.tenantId))
			{
				// this.$message.error("请选择关联客户！");
				// return false;
			}
			if(this.common.isNotBlank(this.consignor.reconciliationDate)){
				if(!(this.consignor.reconciliationDate>=1&&this.consignor.reconciliationDate<=31)){
					this.$message.error("对账日只能输入1-31！");
					return false;
				}
			}
			await this.common.postUrl("wmsTenantTF", "saveOrUpdateConsignor", this.consignor, null,null,'',true);
			this.$message.success(flag === 1 ? "新增成功！": "修改成功！");
			this.showConsignor(false);
			await this.doQuery();
		},
		/**
		 * 删除货主
		 * @returns {boolean}
		 */
		async deleteConsignor()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的货主！");
				return false;
			}
			this.$confirm("确认需要删除该货主？", "提示").then(async () =>
			{
				await this.common.postUrl("wmsTenantTF", "deleteConsignor", selectData[0], null, null, '', true);
				this.$message.success("删除成功！");
				this.showConsignor(false);
				await this.doQuery();
			}).catch(() =>{});
		},
	},
	computed:{
		formData(){
			return [
				{"name":"货主名称","model":"name","type":"input","placeholder":"货主名称","isshow":true},
				{"name":"关联客户","model":"tenantName","type":"input","placeholder":"关联客户","isshow":true},
				{"name":"货主编码","model":"code","type":"input","placeholder":"货主编码","isshow":true},
				{"name":"结算类型","model":"settleType","type":"select","options":this.settleTypeData,"label":"codeName","value":"codeValue","placeholder":"结算类型","method":"doQuery","isshow":true},
			]
		}
	}
}
