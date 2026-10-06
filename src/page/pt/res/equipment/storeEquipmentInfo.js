import enumData from "@/page/pt/enum";
import myFileModel from "@/components/myFileModel/myFileModel.vue";

export default {
    name: 'storeEquipmentInfo',
    components: {
        myFileModel
    },
    data()
    {
        return{
            type: this.$route.query.type,
            info: this.initInfo(),
            isOnlySee: false,
            supplierData: [],
            storeHouseData: [],
            equipmentPurchaseTypeData: [],
            limitPickerOptions:this.common.copyObj(enumData.DATE_SHORTCUT_OPTIONS),
            disabledEdit: false,//
            disabledDel: false,//
            showViewer: false,//是否展示大图
            srcList: [],
            contractData: [],
            equipmentTypeData: [],
            equipmentClassTypeData: [],
            list: [{}],//附件
            hasEntryMonthCost: false,//是否存在月费用进入月成本
        }
    },
    async mounted() {
        this.initStaticData();
        let id = this.$route.query.id;
        //0 查看 1新增 2修改
        let type = this.$route.query.type;
        if (this.common.isNotBlank(id))
        {
            await this.loadWmsEquipmentPurchaseInfo(id);
        }
        if (type == 0)
        {
            this.isOnlySee = true;
            this.disabledEdit = true;
            this.disabledDel = true;
        }
        else
        {
            this.disabledEdit = false;
            this.disabledDel = false;
        }
    },
    methods: {
        initInfo()
        {
            this.info = {
                id:null,
                workId: null,
                tenantId: null,
                equipmentName: null,
                model: null,
                equipmentPurchaseType: '1',
                beginUseDate: null,
                endUseDate: null,
                month: null,
                tax: null,
                remark: null,
                count: 1,
                price: null,
                totalFee: null,
                monthFee: null,
                deposit: null,
                liquidatedDamages: null,
                imgId: null,
                imgPath: null,
                contractId: null,
                equipmentType: null,
                equipmentNum: null,
                equipmentClassType: null,
            };
            return this.info;
        },
        /**
         * 查询静态数据
         * @returns {Promise<void>}
         */
        async initStaticData()
        {
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.equipmentPurchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EQUIPMENT_PURCHASE_TYPE"});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.equipmentTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_EQUIPMENT_TYPE"});
            this.equipmentClassTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "EQUIPMENT_CLASS_TYPE"});
            await this.loadContract();
        },
        async loadContract(tenantId)
        {
            this.contractData = await this.common.postUrl("contractService", "queryStorageEquipmentContractList", {tenantId});
        },
        async changeTenant()
        {
            this.info.contractId = null;
            await this.loadContract(this.info.tenantId);
        },
        async changeContract()
        {
            if (this.common.isBlank(this.info.tenantId))
            {
                this.contractData.forEach(item => {
                    if (this.info.contractId == item.id)
                    {
                        this.info.tenantId = item.tenantId;
                    }
                });
            }
        },
        changeMonth()
        {
            this.changeBeginUseDate();
            this.calc();
        },
        changeBeginUseDate()
        {
            if (this.common.isNotBlank(this.info.beginUseDate)
             && this.common.isNotBlank(this.info.month))
            {
                let beginUseDate = new Date(this.info.beginUseDate);
                let month = beginUseDate.getMonth() + parseInt(this.info.month);
                this.info.endUseDate = new Date(beginUseDate.getFullYear(), month, beginUseDate.getDate());
            }
        },
        calc()
        {
            let count = 0;
            let price = 0;
            let info = this.info;
            if (this.common.isNotBlank(info.count) && !isNaN(info.count))
            {
                count = info.count;
            }
            if (this.common.isNotBlank(info.price) && !isNaN(info.price))
            {
                price = info.price;
            }
            let totalFee = this.getValue(this.common.accMul(count, price));
            if (info.equipmentPurchaseType == 1)
            {
                if (totalFee != 0)
                {
                    let month = info.month;
                    let monthFee = 0;
                    if (this.common.isNotBlank(month))
                    {
                        monthFee = this.getValue(this.common.accDiv(totalFee, month));
                    }
                    info.monthFee = monthFee;
                }
                else
                {
                    info.monthFee = 0;
                }
                info.totalFee = totalFee;
            }
            else
            {
                let month = info.month;
                let monthFee = 0;
                if (this.common.isNotBlank(info.month) && !isNaN(info.month))
                {
                    monthFee = this.getValue(this.common.accMul(totalFee, month));
                }
                let sum = monthFee;
                info.monthFee = totalFee;
                info.totalFee = sum;
            }
            this.$forceUpdate();
        },
        getValue(data)
        {
            if (this.common.isNotBlank(data))
            {
                data = data + "";
                let pointIndex = data.indexOf(".");
                let index = data.length;
                for (let i = data.length - 1; pointIndex > 0 && i >= 0; i--)
                {
                    let item = data.at(i);
                    if (item == ".")
                    {
                        index--;
                        break;
                    }
                    else
                    {
                        if (parseInt(item) == 0)
                        {
                            index--;
                        }
                        else
                        {
                            break;
                        }
                    }
                }
                //有小数点  有效小数超过4位
                if (pointIndex > 0 && index - pointIndex > 4)
                {
                    index = pointIndex + 4 + 1;
                }
                return data.substring(0, index);
            }
            return null;
        },
        async saveOrUpdateWmsEquipmentPurchase()
        {
            let param = this.common.copyObj(this.info);
            if (this.common.isBlank(param.workId))
            {
                this.$message.error("请选择仓库！");
                return false;
            }
            if (this.common.isBlank(param.tenantId))
            {
                this.$message.error("请选择供应商名称！");
                return false;
            }
            if (this.common.isBlank(param.beginUseDate))
            {
                this.$message.error("请选择使用起始日！");
                return false;
            }
            if (this.common.isBlank(param.equipmentPurchaseType))
            {
                this.$message.error("请选择采购类型！");
                return false;
            }
            if (this.common.isBlank(param.equipmentName))
            {
                this.$message.error("请输入设备名称！");
                return false;
            }
            if (this.common.isBlank(param.month))
            {
                this.$message.error(param.equipmentPurchaseType == 1 ? "请输入折旧月份数！" : "请输入租赁月份数！");
                return false;
            }
            if (this.common.isBlank(param.tax))
            {
                this.$message.error("请输入税率！");
                return false;
            }
            if (this.common.isBlank(param.count))
            {
                this.$message.error(param.equipmentPurchaseType == 1 ? "请输入购买数量！" : "请输入租赁数量！");
                return false;
            }
            if (this.common.isBlank(param.price))
            {
                this.$message.error(param.equipmentPurchaseType == 1 ? "请输入含税购买单价(元/台)！" : "请输入含税租赁单价(元/月/台)！");
                return false;
            }
            param.list = this.list;
            await this.common.postUrl("wmsEquipmentPurchaseService", "saveOrUpdateWmsEquipmentPurchase", param,null,null,null,true);
            this.closePage();
        },
        async loadWmsEquipmentPurchaseInfo(id)
        {
            let data = await this.common.postUrl("wmsEquipmentPurchaseService", "loadWmsEquipmentPurchaseInfo", {id},null,null,null,true);
            let info = data.info;
            info.workId = info.workStoreId;
            info.tenantId = info.supplierTenantId;
            info.equipmentPurchaseType = info.equipmentPurchaseType + "";
            if (this.common.isNotBlank(info.equipmentType))
            {
                info.equipmentType = info.equipmentType + "";
            }
            if (this.common.isNotBlank(info.equipmentType))
            {
                info.equipmentClassType = info.equipmentClassType + "";
            }
            this.info = this.common.copyObj(info);
            if (this.common.isNotBlank(this.info.list))
            {
                let that = this;
                that.list = this.info.list;
                this.imgDisplay();

                if (that.list.length < 5)
                    that.list.push({});
            }
            this.$forceUpdate();
        },
        successCallback(imgData)
        {
            if (this.list.length <= 5)
            {
                imgData.imgId = imgData.flowId;
                imgData.imgPath = imgData.storePath;
                this.list[imgData.componentId] = imgData;
            }
            let flag = true;
            for (let i = 0; i < this.list.length; i++)
                if (this.common.isBlank(this.list[i].imgId))
                    flag = false;//存在空的
            if(this.list.length  < 5 && flag){
                this.list.push({});
            }
            this.initListComponentId();
        },
        delCallback()
        {
            this.list.splice(index,1);
            let flag = true;
            for (let i = 0; i < this.list.length; i++)
                if (this.common.isBlank(this.list[i].imgId))
                    flag = false;//存在空的
            if(this.list.length === 4 && flag){
                this.list.push({});
            }
            this.imgDisplay();
            this.initListComponentId();
        },
        initListComponentId()
        {
            for (let i = 0; i < this.list.length; i++)
                this.list[i].componentId = i;
            this.$forceUpdate();
        },
        imgDisplay(){
            this.$nextTick(() => {
                let that = this;
                for (let i = 0; i < this.list.length; i++) {
                    if (that.list[i].imgId) {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.list[i].imgId + ")");
                    } else {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
