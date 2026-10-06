import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'storehouseInfo',
    data() {
        return {
            info: {
                workId: null,
                storehouseArea: null,
                flatWarehouseArea: null,
                verticalWarehouseArea: null,
                monthRent: null,
                verticalStorage: null,
                palletArea: 1.75,
                storageWarehouseArea: null,
                areaUsePercent: null,
                costType: '1',
                shelfPrice: null,
                storageCost: null,
                equipmentCost: null,
                personCost: null,
                flatWarehouseCost: null,
                verticalWarehouseCost: null,
                waterCost: null,
                insuranceCost: null,
                plateUseRate: null,
                manageCost: null,
                
                flatWarehouseAmount: 0,
                verticalWarehouseAmount: 0,
            },
            workData: [],
            storehouseCostTypeData: [],
            type:this.$route.query.type,
            isVisible: this.$route.query.id > 0 && this.$route.query.type > 2,
        }
    },
    computed:{
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
        if (this.$route.query.id)
        {
            this.loadDataById(this.$route.query.id);
        }
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initData()
        {
            this.storehouseCostTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STOREHOUSE_COST_TYPE"});
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async loadDataById(id)
        {
            let data = await this.common.postUrl('standardCostWarehousingService', 'loadStandardCostWarehousingById', {id});
            this.info = data.info;
            this.info.costType = data.info.costType + "";
            
            this.$forceUpdate();
        },
        changeWork()
        {
            if (this.common.isNotBlank(this.info.workId))
            {
                this.workData.forEach(item => {
                    if (item.workId === this.info.workId)
                    {
                        this.info.storehouseArea = item.storehouseArea;
                    }
                })
            }
            this.changeStorehouseArea();
        },
        changeStorehouseArea()
        {
            if (this.common.isNotBlank(this.info.storehouseArea))
            {
                if (this.common.isNotBlank(this.info.verticalWarehouseArea))
                {
                    let verticalWarehouseArea = parseFloat(this.info.verticalWarehouseArea);
                    let storehouseArea = parseFloat(this.info.storehouseArea);
                    if (verticalWarehouseArea > storehouseArea)
                    {
                        this.$message.error("立库面积不能大于总面积!");
                        return;
                    }
                    this.info.flatWarehouseArea = this.common.accSub(this.info.storehouseArea, this.info.verticalWarehouseArea);
                }
                else
                {
                    this.info.flatWarehouseArea = this.info.storehouseArea;
                }
            }
            this.calcFlatWarehouseCost();
        },
        changeVerticalWarehouseArea()
        {
            if (this.common.isNotBlank(this.info.verticalWarehouseArea) && this.common.isNotBlank(this.info.storehouseArea))
            {
                if (this.info.verticalWarehouseArea > this.info.storehouseArea)
                {
                    let verticalWarehouseArea = parseFloat(this.info.verticalWarehouseArea);
                    let storehouseArea = parseFloat(this.info.storehouseArea);
                    if (verticalWarehouseArea > storehouseArea)
                    {
                        this.$message.error("立库面积不能大于总面积!");
                        return;
                    }
                }
                this.info.flatWarehouseArea = this.common.accSub(this.info.storehouseArea, this.info.verticalWarehouseArea);
            }
            this.calcAreaUsePercent();
            this.calcFlatWarehouseCost();
        },
        changeMonthRent()
        {
            this.info.flatWarehouseCost = 0;
            this.calcFlatWarehouseCost();
        },
        changeVerticalStorage()
        {
            this.info.storageWarehouseArea = 0;
            this.calcStorageWarehouseArea();
        },
        changePalletArea()
        {
            this.info.storageWarehouseArea = 0;
            this.calcStorageWarehouseArea();
        },
        changePlateUseRate()
        {
            this.info.storageWarehouseArea = 0;
            this.calcStorageWarehouseArea();
        },
        /**
         * 总库位面积
         */
        calcStorageWarehouseArea()
        {
            if (this.common.isNotBlank(this.info.verticalStorage)
                && this.common.isNotBlank(this.info.palletArea)
                && this.common.isNotBlank(this.info.plateUseRate))
            {
                let value = this.common.accMul(this.info.verticalStorage, this.info.palletArea);
                value = this.common.accMul(value, this.info.plateUseRate);
                value = this.common.accDiv(value, 100);
                value = this.toFixed(value);
                this.info.storageWarehouseArea = value;
            }
            this.calcAreaUsePercent();
            this.calcVerticalWarehouseCost();
        },
        /**
         * 面积利用率
         */
        calcAreaUsePercent()
        {
            if (this.common.isNotBlank(this.info.storageWarehouseArea) && this.common.isNotBlank(this.info.verticalWarehouseArea))
            {
                let value = this.common.accDiv(this.info.storageWarehouseArea, this.info.verticalWarehouseArea);
                value = this.common.accMul(value, 100);
                value = this.toFixed(value);
                this.info.areaUsePercent = value;
            }
        },
        changeCostType()
        {
            this.info.storageCost = 0;
            this.calcStorageCost();
        },
        changeShelfPrice()
        {
            this.info.storageCost = 0;
            this.calcStorageCost();
        },
        /**
         * 货架成本
         */
        calcStorageCost()
        {
            if (this.info.costType == 1)
            {
                if (this.common.isNotBlank(this.info.shelfPrice) && this.common.isNotBlank(this.info.verticalStorage))
                {
                    let value = this.common.accMul(this.info.shelfPrice, this.info.verticalStorage);
                    value = this.toFixed(value);
                    this.info.storageCost = value;
                }
            }
            else if (this.info.costType == 2)
            {
                if (this.common.isNotBlank(this.info.shelfPrice))
                {
                    let value = this.common.accDiv(this.info.shelfPrice, 60.00);
                    value = this.toFixed(value);
                    this.info.storageCost = value;
                }
            }
            this.calcVerticalWarehouseCost();
        },
        changeEquipmentCost()
        {
            this.info.verticalWarehouseCost = 0;
            this.calcVerticalWarehouseCost();
        },
        changePersonCost()
        {
            this.info.verticalWarehouseCost = 0;
            this.calcVerticalWarehouseCost();
        },
        changeWaterCost()
        {
            this.info.flatWarehouseAmount = 0;
            this.info.verticalWarehouseAmount = 0;
            this.calcFlatWarehouseAmount();
            this.calcVerticalWarehouseAmount();
        },
        changeInsuranceCost()
        {
            this.info.flatWarehouseAmount = 0;
            this.info.verticalWarehouseAmount = 0;
            this.calcVerticalWarehouseCost();
            this.calcVerticalWarehouseAmount();
        },
        changeManageCost()
        {
            this.info.flatWarehouseAmount = 0;
            this.info.verticalWarehouseAmount = 0;
            this.calcFlatWarehouseAmount();
            this.calcVerticalWarehouseAmount();
        },
        /**
         * 平库成本
         */
        calcFlatWarehouseCost()
        {
            if (this.common.isNotBlank(this.info.monthRent) && this.common.isNotBlank(this.info.storehouseArea))
            {
                let value = this.common.accDiv(this.info.monthRent, this.info.storehouseArea);
                value = this.toFixed(value);
                this.info.flatWarehouseCost = value;
            }
            this.calcVerticalWarehouseCost();
            this.calcFlatWarehouseAmount();
        },
        /**
         * 立库成本
         */
        calcVerticalWarehouseCost()
        {
            if (this.common.isNotBlank(this.info.flatWarehouseCost)
                && this.common.isNotBlank(this.info.verticalWarehouseArea)
                && this.common.isNotBlank(this.info.storageWarehouseArea))
            {
                let value = this.common.accMul(this.info.flatWarehouseCost, this.info.verticalWarehouseArea);
                if (this.common.isNotBlank(this.info.storageCost))
                    value = this.common.accAdd(value, this.info.storageCost);
                if (this.common.isNotBlank(this.info.equipmentCost))
                    value = this.common.accAdd(value, this.info.equipmentCost);
                if (this.common.isNotBlank(this.info.personCost))
                    value = this.common.accAdd(value, this.info.personCost);
                value = this.common.accDiv(value, this.info.storageWarehouseArea);
                value = this.toFixed(value);
                this.info.verticalWarehouseCost = value;
            }
            this.calcVerticalWarehouseAmount();
        },
        /**
         * 平库成本合计
         */
        calcFlatWarehouseAmount()
        {
            if (this.common.isNotBlank(this.info.flatWarehouseCost)
                && this.common.isNotBlank(this.info.manageCost))
            {
                let value = this.info.flatWarehouseCost;
                if (this.common.isNotBlank(this.info.waterCost))
                    value = this.common.accAdd(value, this.info.waterCost);
                if (this.common.isNotBlank(this.info.insuranceCost))
                    value = this.common.accAdd(value, this.info.insuranceCost);
                
                let value2 = this.common.accAdd(this.info.manageCost, 100);
                value = this.common.accMul(value, value2);
                value = this.common.accDiv(value, 100);
                value = this.toFixed(value);
                this.info.flatWarehouseAmount = value;
            }
        },
        /**
         * 立库成本合计
         */
        calcVerticalWarehouseAmount()
        {
            if (this.common.isNotBlank(this.info.verticalWarehouseCost)
                && this.common.isNotBlank(this.info.manageCost))
            {
                let value = this.info.verticalWarehouseCost;
                if (this.common.isNotBlank(this.info.waterCost))
                    value = this.common.accAdd(value, this.info.waterCost);
                if (this.common.isNotBlank(this.info.insuranceCost))
                    value = this.common.accAdd(value, this.info.insuranceCost);
                
                let value2 = this.common.accAdd(this.info.manageCost, 100);
                value = this.common.accMul(value, value2);
                value = this.common.accDiv(value, 100);
                value = this.toFixed(value);
                this.info.verticalWarehouseAmount = value;
            }
        },
        toFixed(value)
        {
            if (this.common.isNotBlank(value) && !isNaN(value))
            {
                value = value.toFixed(2);
                value = parseFloat(value);
            }
            return value;
        },
        async save()
        {
            if (this.common.isBlank(this.info.workId)) {
                this.$message.error("请选择物流基地！");
                return false;
            }
            if (this.common.isBlank(this.info.storehouseArea)) {
                this.$message.error("请输入总面积！");
                return false;
            }
            if (this.common.isBlank(this.info.verticalWarehouseArea)) {
                this.$message.error("请输入立库面积！");
                return false;
            }
            if (this.common.isBlank(this.info.monthRent)) {
                this.$message.error("请输入每月总租金！");
                return false;
            }
            if (this.common.isBlank(this.info.verticalStorage)) {
                this.$message.error("请输入立库库位数！");
                return false;
            }
            if (this.common.isBlank(this.info.palletArea)) {
                this.$message.error("请输入每托面积！");
                return false;
            }
            if (this.common.isBlank(this.info.plateUseRate)) {
                this.$message.error("请输入板位利用率！");
                return false;
            }
            if (this.common.isBlank(this.info.storageWarehouseArea)) {
                this.$message.error("请输入总库位面积！");
                return false;
            }
            if (this.common.isBlank(this.info.areaUsePercent)) {
                this.$message.error("请输入面积利用率！");
                return false;
            }
            if (this.common.isBlank(this.info.costType)) {
                this.$message.error("请选择成本类型！");
                return false;
            }
            if (this.common.isBlank(this.info.flatWarehouseCost)) {
                this.$message.error("请输入平库成本！");
                return false;
            }
            if (this.common.isBlank(this.info.verticalWarehouseCost)) {
                this.$message.error("请输入立库成本！");
                return false;
            }
            if (this.common.isBlank(this.info.manageCost)) {
                this.$message.error("请输入管理成本！");
                return false;
            }
            await this.common.postUrl("standardCostWarehousingService", "saveOrUpdateStandardCostWarehousing", this.info);
            this.$message.success("保存成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
