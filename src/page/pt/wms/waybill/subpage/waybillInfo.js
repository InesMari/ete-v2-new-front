import enumData from "@/page/pt/enum.js"
import myElDatePicker from "@/components/myElDatePicker/index.js";

export default {
    name: 'wmsWaybillInfo',
    props: {
        type: Number,//默认是1就是新增修改，2是新版的确认送达
    },
    data()
    {
        return {
            waybillInfo: {
                supplierTenantId:null,
                linkman:null,
                linkPhone:null,
                isUrgent: '0',
                haveReceipt: '0',
                vehicleId:null,
                vehicleType:null,
                quoteVehicleType:null,
                vehicleLength:null,
                driverUserId:null,
                driverLinkPhone:null,
                deliveryDate:null,
                isReturn: '0',
                remark:null,
            },
            whetherOptions: [],//是否
            supplierData: [],
            vehicleData: [],
            quoteVehicleTypeData:[],
            vehicleTypeOptions: [],
            vehicleLengthOptions: [],
            driverData: [],
            vehicleDisable: false,
        }
    },
    mounted()
    {
        this.initStaticData();
    },
    components: {myElDatePicker},
    methods: {
        initData(waybillInfo)
        {
            this.waybillInfo = waybillInfo;
            this.initVehicleList(waybillInfo.supplierTenantId, waybillInfo.invoiceFlg);
            this.initDriverList(waybillInfo.supplierTenantId, waybillInfo.invoiceFlg);
            this.vehicleDisable = this.common.isNotBlank(waybillInfo.vehicleId);
            this.$forceUpdate();
        },
        initTenantId(supplierTenantId){
            this.waybillInfo.supplierTenantId = supplierTenantId;
            this.supplierData.forEach(item => {
                if (item.tenantId == supplierTenantId)
                {
                    this.waybillInfo.linkman = item.linkman;
                    this.waybillInfo.linkPhone = item.linkPhone;
                    this.initVehicleListBase();
                    this.initDriverListBase();
                }
            });
            this.$forceUpdate();
        },
        initVehicleListBase(){
            let that = this;
            let invoiceFlg = this.supplierData.find(item => item.tenantId === that.waybillInfo.supplierTenantId).invoiceFlg;
            this.initVehicleList(that.waybillInfo.supplierTenantId, invoiceFlg);
        },
        initDriverListBase(){
            let that = this;
            let invoiceFlg = this.supplierData.find(item => item.tenantId === that.waybillInfo.supplierTenantId).invoiceFlg;
            this.initDriverList(that.waybillInfo.supplierTenantId, invoiceFlg);
        },

        //初始化页面的静态数据
        initStaticData()
        {
            let that = this;
            this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'WHETHER,VEHICLE_TYPE,VEHICLE_LENGTH,VEHICLE_TYPE_QUOTE'}, function (data)
            {
                that.whetherOptions = data.WHETHER;
                that.vehicleTypeOptions = data.VEHICLE_TYPE;
                that.vehicleLengthOptions = data.VEHICLE_LENGTH;
                that.quoteVehicleTypeData = data.VEHICLE_TYPE_QUOTE;
            });
            this.initSupplierData();
            this.waybillInfo.deliveryDate = this.common.formatDate.getDateTime()
        },
        async initSupplierData()
        {
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        changeSupplier(tenantId)
        {
            if (this.common.isBlank(tenantId))
            {
                this.waybillInfo.linkman = '';
                this.waybillInfo.linkPhone = '';
                this.clearSelVehicleInfo();
                this.clearSelDriverInfo();
                this.vehicleData = [];
                this.driverData = [];
                return;
            }
            for (let i = 0; i < this.supplierData.length; i++)
            {
                let item = this.supplierData[i];
                if (tenantId == item.tenantId)
                {
                    this.waybillInfo.linkman = item.linkman;
                    this.waybillInfo.linkPhone = item.linkPhone;
                    this.waybillInfo.supplierId = item.supplierId;
                    this.clearSelVehicleInfo();
                    this.clearSelDriverInfo();
                    this.initVehicleList(item.tenantId, item.invoiceFlg);
                    this.initDriverList(item.tenantId, item.invoiceFlg);
                    break;
                }
            }
            this.$parent.matchOrderFee();
        },
        //初始化车辆
        async initVehicleList(supplierTenantId, isInvoice)
        {
            let that = this;
            that.vehicleData = [];
            let data = await this.common.postUrl("resVehicleInfoTF", "selVehicleInfoListByCond", {
                tenantId: supplierTenantId,
                isInvoice,
                rows: 2500
            });

            that.vehicleData = data.items;
            that.$forceUpdate();
            if (data.items.length === 1)
            {
                that.$nextTick(()=>{
                    that.changeVehicle(that.vehicleData[0].vehicleId);
                })
            }
        },
        //清除选择车辆信息
        clearSelVehicleInfo()
        {
            this.waybillInfo.vehicleId = '';
            this.waybillInfo.plateNumber = '';
            this.waybillInfo.vehicleType = '';
            this.waybillInfo.quoteVehicleType = '';
            this.waybillInfo.vehicleLength = '';
            this.vehicleDisable = false;
            this.$forceUpdate();
        },
        //切换车辆
        changeVehicle(vehicleId)
        {
            this.waybillInfo.plateNumber = '';
            this.waybillInfo.vehicleType = '';
            this.waybillInfo.quoteVehicleType = '';
            this.waybillInfo.vehicleLength = '';
            for (let i = 0; i < this.vehicleData.length; i++)
            {
                let item =  this.vehicleData[i];
                if (vehicleId == item.vehicleId)
                {
                    this.waybillInfo.vehicleId = item.vehicleId;
                    this.waybillInfo.plateNumber = item.plateNumber;
                    this.waybillInfo.vehicleType = item.vehicleType + '';
                    this.waybillInfo.quoteVehicleType = item.quoteVehicleType + '';
                    this.waybillInfo.vehicleLength = item.vehicleLength + '';
                    this.vehicleDisable = true;
                    this.$forceUpdate();
                    break;
                }
            }
            this.$parent.matchOrderFee();
        },
        //初始化司机
        async initDriverList(supplierTenantId, isInvoice)
        {
            this.driverData = [];
            let data = await this.common.postUrl("driverTF", "selDriverInfoListByCond", {
                tenantId: supplierTenantId,
                isInvoice,
                rows: 2500
            });
            this.driverData = data.items;
            this.$forceUpdate();
            if (data.items.length === 1)
            {
                this.changeDriver(this.driverData[0].driverUserId);
            }
        },
        //清除选择司机信息
        clearSelDriverInfo()
        {
            this.waybillInfo.driverUserId = '';
            this.waybillInfo.driverName = '';
            this.waybillInfo.driverLinkPhone = '';
            this.$forceUpdate();
        },
        //切换司机
        changeDriver(driverUserId)
        {
            for (let i = 0; i < this.driverData.length; i++)
            {
                let item = this.driverData[i];
                if (driverUserId == item.driverUserId)
                {
                    this.waybillInfo.driverUserId = item.driverUserId;
                    this.waybillInfo.driverName = item.driverName;
                    this.waybillInfo.driverLinkPhone = item.driverPhone;
                    this.$forceUpdate();
                    break;
                }
            }
        },
        changeReturn(){
            this.waybillInfo.isReturn = this.waybillInfo.isReturn == 1 ? 0 : 1;
            if(this.waybillInfo.isReturn==0){
                this.waybillInfo.returnNums = '';
            }
            this.matchOrderFee();
        },
        matchOrderFee()
        {
            this.$parent.matchOrderFee();
        },
        changeReturnNums()
        {
            this.$parent.changeReturnNums();
        },
        getData()
        {
            return this.waybillInfo;
        },
        /**
         * 强制刷新视图绑定
         */
        forceUpdate(){ this.$forceUpdate(); },
    },
}
