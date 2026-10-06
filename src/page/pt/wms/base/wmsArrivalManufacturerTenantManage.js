import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport.vue";
import enumData from "@/page/pt/enum.js"
import selectWork from "@/page/pt/wms/selectWork.vue";
import mapDialog from "@/components/mapDialog/mapDialog.vue";

export default {
	name: 'wmsArrivalManufacturerTenantManage',
	data()
	{
		return {
			head: [
				{"name": "到货厂商名称", "code": "name", "width": "200", "type": "text"},
				{"name": "归属货主", "code": "parentName", "width": "200", "type": "text"},
				{"name": "到货厂商编码", "code": "code", "width": "120", "type": "text"},
				{"name": "类型", "code": "tenantTypeName", "width": "150", "type": "text"},
				{"name": "联系人", "code": "linkman", "width": "120", "type": "text"},
				{"name": "联系方式", "code": "linkPhone", "width": "120", "type": "text"},
				{"name": "地址", "code": "workAddressStr", "width": "300", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
			],
			tenantTypeData: [],
			wmsTenantData: [],//归属货主数据
			uploadParam: this.initUploadParam(),
			showUploadPage: false,
			query: this.initQuery(this.$route.query.name),

			arrivalManufacturerShow: false,
			isOnlySee: false,//是否仅仅查看
			showAddButton: false,
			showUpdateButton: false,
			title: '新增到货厂商',
			arrivalManufacturer: this.initArrivalManufacturer(),
			showSelWork:false,

			isShowMap: false,//是否显示地图
			showMapBotton: false,//地图里面的按钮控制
			mapPoint:null,
			districtData:[],
			isNotDistrict: false,

		}
	},
	mounted()
	{
		this.initSelWork();
		this.initData();
		this.doQuery();
	},
	components: {
		mapDialog,
		tableCommon,
		myImport,
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
		async doQuery(query = this.query)
		{
			await this.$refs.table.load("wmsTenantTF", "queryArrivalManufacturerTenantPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.tenantTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_TENANT_TYPE"});
			this.wmsTenantData = await this.common.postUrl("wmsTenantTF", "queryConsignorTenantList");
		},
		async chnageSrcTenant(id)
		{
			for (let i = 0; i < this.wmsTenantData.length; i++)
			{
				let item = this.wmsTenantData[i];
				if (item.wId == id)
				{
					let info = this.arrivalManufacturer;
					if (this.common.isNotBlank(item.linkman))
					{
						this.arrivalManufacturer.linkman = item.linkman;
					}
					if (this.common.isNotBlank(item.linkPhone))
					{
						this.arrivalManufacturer.linkPhone = item.linkPhone;
					}
					if (this.common.isNotBlank(item.workName))
					{
						this.arrivalManufacturer.workName = item.workName;
					}
					if (this.common.isNotBlank(item.workId))
					{
						this.arrivalManufacturer.provinceId = item.provinceId;
						this.arrivalManufacturer.cityId = item.cityId;
						this.arrivalManufacturer.districtId = item.districtId;
						this.arrivalManufacturer.latitude = item.latitude;
						this.arrivalManufacturer.longitude = item.longitude;
						this.arrivalManufacturer.address = item.address;
						this.arrivalManufacturer.workAddressStr = item.workAddressStr;
					}
					this.arrivalManufacturer.workId = item.workId;
					break;
				}
			}
		},
		initUploadParam()
		{
			return {
				changeDate: '',
				purchaseOrderNum: '',
				purchaseNums: '',
			}
		},
		/**
		 * 初始化
		 */
		initArrivalManufacturer()
		{
			return this.arrivalManufacturer = {
				parentId: '',
				code: '',
				name: '',
				linkman: '',
				linkPhone: '',
				address: '',//街道地址
				tenantType: '1',

				workId:'',
				workName:'',
				latitude:'',
				longitude:'',
				provinceId:'',
				cityId:'',
				districtId:'',
				workAddressStr: '',//作业点全地址
				workAddressUnFinish: '',//作业点全地址未拼接完的
			};
		},
		initQuery(name)
		{
			this.query = {
				name: name,
				code: '',
				tenantType: '',
				srcTenantName: this.$route.query.srcTenantName
			};
			return this.query;
		},
		dblclickItem(data)
		{
			this.showArrivalManufacturer(true, 3, data);
		},
		/**
		 * 控制弹窗
		 * @param flag
		 * @param type 1新增 2修改 3查看
		 * @param data
		 */
		showArrivalManufacturer(flag, type, data)
		{
			this.initArrivalManufacturer();
			if (type === 1)
			{
				this.title = '新增到货厂商';
			}
			else if (type === 2)
			{
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1)
				{
					this.$message.error("请选择一条需要修改的到货厂商！");
					return false;
				}
				this.title = '修改到货厂商';
				this.arrivalManufacturer = this.common.copyObj(selectData[0]);
				this.mapPoint = {
					addressName:selectData[0].workAddressStr,
					point:{
						"lng":selectData[0].longitude,
						"lat":selectData[0].latitude,
					}
				};
			}
			else if (type === 3)
			{
				this.title = '查看到货厂商';
				this.arrivalManufacturer = this.common.copyObj(data);
				this.mapPoint = {
					addressName:data.workAddressStr,
					point:{
						"lng":data.longitude,
						"lat":data.latitude,
					}
				};
			}
			this.showAddButton = type === 1;
			this.showUpdateButton = type === 2;
			this.isOnlySee = type === 3;//不是查看都是可输入
			this.arrivalManufacturerShow = flag;
			this.$forceUpdate();
		},
		showUpload(flag)
		{
			this.initUploadParam();
			if (!flag)
				this.$refs.myImport.$refs.upload.clearFiles();
			this.showUploadPage = flag;
		},
		sureImport()
		{
			this.$refs.myImport.submitFileForm();
		},
		async sureImportSuccess()
		{
			await this.doQuery();
			this.showUpload(false);
			this.$message.success("导入成功！");
		},
		/**
		 * 新增厂商
		 * @param flag 1新增   2 修改
		 * @returns {Promise<boolean>}
		 */
		async saveOrUpdateArrivalManufacturer(flag)
		{
			if (this.common.isBlank(this.arrivalManufacturer.name))
			{
				this.$message.error("请输入到货厂商名称！");
				return false;
			}
			if (this.common.isBlank(this.arrivalManufacturer.parentId))
			{
				this.$message.error("请选择归属货主！");
				return false;
			}
			if (this.common.isBlank(this.arrivalManufacturer.workAddressStr))
			{
				// this.$message.error("到货厂商地址不能为空！");
				// return false;
			}
			if (this.common.isBlank(this.arrivalManufacturer.latitude)
					|| this.common.isBlank(this.arrivalManufacturer.longitude))
			{
				// this.$message.error("到货厂商选择的地址有误，请从地图重新选择！");
				// return false;
			}
			if (this.common.isBlank(this.arrivalManufacturer.districtId))
			{
				// this.$message.error("到货厂商地址区县不能为空！");
				// return false;
			}

			if (this.common.isBlank(this.arrivalManufacturer.tenantType))
			{
				this.$message.error("请选择类型！");
				return false;
			}
			await this.common.postUrl("wmsTenantTF", "saveOrUpdateArrivalManufacturer", this.arrivalManufacturer, null,null,'',true);
			this.$message.success(flag === 1 ? "新增成功！" : "修改成功！");
			this.showArrivalManufacturer(false);
			await this.doQuery();
		},
		async deleteArrivalManufacturer()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的到货厂商！");
				return false;
			}
			this.$confirm("确认需要删除该到货厂商？", "提示").then(async () =>
			{
				await this.common.postUrl("wmsTenantTF", "deleteArrivalManufacturer", selectData[0], null, null, '', true);
				this.$message.success("删除成功！");
				this.showArrivalManufacturer(false);
				await this.doQuery();
			}).catch(() =>{});
		},
		showMap(){
			this.isShowMap = true;
			this.$forceUpdate();
		},
		hideMapBack(){
			this.isShowMap = false;
		},
		changeCitySelect() {
			let that = this;
			this.common.postUrl("selectStaticDataTF", "selectDistrict", {cityId: this.arrivalManufacturer.cityId}, function (data) {
				that.districtData = data;
			});
		},
		changeDistrict()
		{
			for (let i = 0; i < this.districtData.length; i++)
			{
				let district = this.districtData[i];
				if (this.arrivalManufacturer.districtId == district.id)
				{
					this.arrivalManufacturer.workAddressStr = this.arrivalManufacturer.workAddressUnFinish + district.name + this.arrivalManufacturer.address;
					break;
				}
			}
		},
		async sureAddress(data)
		{
			let addressComponents = data.addressComponents;
			let point = data.point;
			if(this.common.isNotBlank(addressComponents))
			{
				this.arrivalManufacturer.address = addressComponents.street + addressComponents.streetNumber;
				if(this.common.isNotBlank(addressComponents.province))
				{
					let provinceId = await this.common.postUrl("selectStaticDataTF","getProvinceId",{"codeValueName" : addressComponents.province});
					if(provinceId > 0)
					{
						if(this.common.isNotBlank(addressComponents.city))
						{
							let cityId = await this.common.postUrl("selectStaticDataTF","getCityId",{"codeValueName":addressComponents.city});
							if(cityId > 0){
								this.arrivalManufacturer.cityId = Number(cityId);
							}
							this.arrivalManufacturer.address = addressComponents.street;
							this.arrivalManufacturer.latitude = point.lat;
							this.arrivalManufacturer.longitude = point.lng;
							this.arrivalManufacturer.provinceId = Number(provinceId);
							this.arrivalManufacturer.cityId = Number(cityId);
							let address = addressComponents.province;
							if (addressComponents.city == addressComponents.province)
							{
								address = "";//省市一样的  像北京市那样的直辖市
							}
							address += addressComponents.city;
							await this.changeCitySelect();
							if(this.common.isNotBlank(addressComponents.district))
							{
								let districtId = await this.common.postUrl("selectStaticDataTF","getDistrictId",{"codeValueName":addressComponents.district,"cityId":cityId});
								if(districtId<0){
									this.$message.error("很抱歉，系统地址库没有区县:"+addressComponents.district+"，请联系管理人员。");
								}
								this.arrivalManufacturer.districtId = Number(districtId);
								address += addressComponents.district;
								this.mapPoint = {addressName:address, point:{"lng":this.arrivalManufacturer.longitude,"lat":this.arrivalManufacturer.latitude}};
								this.arrivalManufacturer.workAddressStr = address + this.arrivalManufacturer.address;
								this.isNotDistrict = false;
								this.arrivalManufacturer.workAddressUnFinish = address;
							}
							else
							{
								this.arrivalManufacturer.workAddressStr = address + this.arrivalManufacturer.address;
								this.arrivalManufacturer.workAddressUnFinish = address;
								this.$message.warning("您选择的地址没有区县信息，请继续选择地址对应区县再保存！");
								this.isNotDistrict = true;
								return false;
							}
						}
						else
						{
							this.$message.error("您选择的地址没有城市，请选择点击有城市的位置！");
							return false;
						}
					}
					else
					{
						this.$message.error("您选择的地址没有省份，请选择点击有省份的位置！");
						return false;
					}
				}
			}
			else
			{
				this.$message.error("请先在地图点击选择对应位置！");
				return false;
			}
			this.$forceUpdate();
			this.hideMapBack();
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
				urlId: 'arrivalManufacturer' + 'Detail' + data.wId,
				query: {
					logId: data.wId,
					logType: enumData.LOG_TYPE.CONSIGNOR,
				},
				urlName: "到货厂商" + "操作日志",
				urlPathName: "/operateLog",
				urlPath: "/pt/operateLog/operateLog.vue"});
		},
	},
}
