import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker";
import enumData from "@/page/pt/enum.js"
import dbTable from "@/components/dbTable/dbTable.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'outDeviceRegister',
	data()
	{
		return {
			record: this.initRecord(),
			dealTypeData:[],//登记类型
			deviceData:[],//器具数据
			tenantData:[],//使用客户
			workData:[],//来源地交付地
			wmsCostItemTypeData: [],//费用项目名称
			supplierData: [],//供应商
			pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,
			detailList:[this.initDetailItem()],//器具登记明细
			isOnlySee: this.$route.query.type == 0,
		}
	},
	mounted()
	{
		this.initData();
	},
	components: {
		tableCommon,
		myElDatePicker,
		enumData,
		myFileModel
	},
	methods: {
		async initData()
		{
			this.dealTypeData = [];
			this.wmsCostItemTypeData = [];
			let dealTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEV_DEVICE_OP_TYPE"});
			this.workData = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {isWmsWork: 1, isLoadStoreHouse: 1, isLoadSrcTenantWork: 1});
			this.deviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {type: 2});//只加载客户器具
			this.tenantData = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {});
			this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
			let wmsCostItemTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_COST_ITEM_TYPE"});

			for (let i = 0; i < dealTypeData.length; i++)
			{
				let item = dealTypeData[i];
				if (item.codeValue == 4)
				{
					this.dealTypeData.push(item);
				}
			}
			for (let i = 0; i < wmsCostItemTypeData.length; i++)
			{
				let item = wmsCostItemTypeData[i];
				if (item.codeValue == 4)
				{
					this.wmsCostItemTypeData.push(item);
				}
			}
			//自动选择
			if (this.deviceData.length === 1)
			{
				this.detailList[0].deviceId = this.deviceData[0].id;
				this.changeDevice(this.detailList[0]);
			}
			if (this.common.isNotBlank(this.$route.query.id))
			{
				this.$nextTick(()=>{
					this.loadDeviceRecordById();
				})
			}
		},
		initRecord()
		{
			return this.record = {
				dealType: '4',
				actualDate: null,
				destWorkId: null,
				supplierTenantId: null,
				remark: '',
				dealNum: 0,
				totalIncomeFee: 0,
				totalFee: 0,
			};
		},
		initDetailItem()
		{
			return {
				deviceId: null,
				spec: null,
				useTenantId: null,
				dealNum: null,
				fee: null,
				incomeFee: null,
			}
		},
		async loadDeviceRecordById()
		{
			let data = await this.common.postUrl("deviceRecordService", "loadDeviceRecordById", this.$route.query);
			let info = data.info;
			if (this.common.isNotBlank(info.dealType))
			{
				info.dealType = String(info.dealType);
			}
			if (this.common.isNotBlank(info.destWorkId))
			{
				info.destWorkId = String(info.destWorkId);
			}
			info.supplierTenantId = info.tenantId;
			this.record = info;
			this.detailList = data.detailList;
			this.$nextTick(() => {
				this.$refs.img.initDate(this.record.fileId);
			});
			this.$forceUpdate();
		},
		addDetailItem()
		{
			this.detailList.push(this.initDetailItem());
		},
		removeDetailItem(item, index)
		{
			if (this.detailList.length <= 1)
			{
				this.$message.error("至少需要保留一条器具登记明细！");
				return false;
			}
			this.detailList.splice(index, 1);
			this.changeDealNum();
		},
		changeDealNum()
		{
			let totalDealNum = 0;
			for (let i = 0; i < this.detailList.length; i++)
			{
				let item = this.detailList[i];
				if (this.common.isNotBlank(item.dealNum) && !isNaN(item.dealNum))
				{
					totalDealNum = this.common.accAdd(item.dealNum, totalDealNum);
				}
			}
			this.record.dealNum = totalDealNum;
			this.calcTotalFee();
		},
		calcTotalFee()
		{
			let totalFee = 0;
			let totalIncomeFee = 0;
			for (let i = 0; i < this.detailList.length; i++)
			{
				let item = this.detailList[i];
				let incomeFee = 0;
				let fee = 0;
				if (this.common.isNotBlank(item.dealNum) && !isNaN(item.dealNum))
				{
					if (this.common.isNotBlank(item.incomePrice) && !isNaN(item.incomePrice))
					{
						incomeFee = this.common.accMul(item.dealNum, item.incomePrice);
						totalIncomeFee = this.common.accAdd(incomeFee, totalIncomeFee);
					}
					if (this.common.isNotBlank(item.transportPrice) && !isNaN(item.transportPrice))
					{
						fee = this.common.accMul(item.dealNum, item.transportPrice);
						totalFee = this.common.accAdd(fee, totalFee);
					}
				}
				item.incomeFee = incomeFee;
				item.fee = fee;
			}
			this.record.totalIncomeFee = totalIncomeFee;
			this.record.totalFee = totalFee;
			this.$forceUpdate();
		},
		changeDevice(data)
		{
			if (data)
			{
				for (let i = 0; i < this.deviceData.length; i++)
				{
					let item = this.deviceData[i];
					if (item.id == data.deviceId)
					{
						data.spec = item.spec;
						data.incomePrice = item.incomePrice;
						data.transportPrice = item.transportPrice;
					}
				}
			}
			this.changeDealNum();
			this.$forceUpdate();
		},
		/**
		 * 器具登记
		 */
		async sureOutDeviceRecord()
		{
			if (this.common.isBlank(this.record.dealType))
			{
				this.$message.error("请选择登记类型！");
				return false;
			}
			if (this.common.isBlank(this.record.actualDate))
			{
				this.$message.error("请选择实际日期！");
				return false;
			}
			if (this.common.isBlank(this.record.supplierTenantId))
			{
				this.$message.error("请选择供应商！");
				return false;
			}
			if (this.common.isBlank(this.record.destWorkId))
			{
				this.$message.error("请选择交付地！");
				return false;
			}
			if (this.common.isBlank(this.detailList) || this.detailList.length === 0)
			{
				this.$message.error("器具登记明细不能为空！");
				return false;
			}
			let totalFee = 0;
			for (let i = 0; i < this.detailList.length; i++)
			{
				let item = this.detailList[i];
				if (this.common.isBlank(item.deviceId))
				{
					this.$message.error("请选择第" + (i + 1) + "条器具名称！");
					return false;
				}
				if (this.common.isBlank(item.useTenantId))
				{
					this.$message.error("请选择第" + (i + 1) + "条使用客户！");
					return false;
				}
				if (this.common.isBlank(item.dealNum))
				{
					this.$message.error("请选择第" + (i + 1) + "条数量！");
					return false;
				}
			}
			let param = this.common.copyObj(this.record);
			param.detailList = this.common.copyObj(this.detailList);
			param.fileId = this.$refs.img.getImageData().flowId;
			param.filePath = this.$refs.img.getImageData().storePath;
			await this.common.postUrl("deviceRecordService", "saveOrUpdateOutDeviceRecord", param, null,null,'',true);
			this.$message.success("登记成功！");
			this.closePage();
		},
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
		},
	},
}
