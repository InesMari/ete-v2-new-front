import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker";
import enumData from "@/page/pt/enum.js"
import dbTable from "@/components/dbTable/dbTable.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'outDeviceClearUp',
	data()
	{
		return {
			record: this.initRecord(),
			dealTypeData:[],//登记类型
			deviceData:[],//器具数据
			tenantData:[],//使用客户
			srcWorkData:[],//来源地
			workData:[],//交付地
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
			this.srcWorkData = await this.common.postUrl("deviceContractService", "queryCustWorkInfo", {isWmsWork: 1, isLoadStoreHouse: 1, isLoadSrcTenantWork: 1});
			this.deviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {type: 2});//只加载客户器具
			this.tenantData = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {});
			this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
			for (let i = 0; i < dealTypeData.length; i++)
			{
				let item = dealTypeData[i];
				if (item.codeValue == 13)
				{
					this.dealTypeData.push(item);
				}
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
				dealType: '13',
				actualDate: null,
				destWorkId: null,
				supplierTenantId: null,
				remark: '',
				dealNum: 0,
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
					if (this.common.isNotBlank(item.clearUpPrice) && !isNaN(item.clearUpPrice))
					{
						fee = this.common.accMul(item.dealNum, item.clearUpPrice);
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
						data.reoveryPrice = item.reoveryPrice;
						data.clearUpPrice = item.clearUpPrice;
					}
				}
			}
			this.changeDealNum();
			this.$forceUpdate();
		},
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
		},
	},
}
