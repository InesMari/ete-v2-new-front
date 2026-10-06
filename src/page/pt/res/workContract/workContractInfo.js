import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: 'workContractInfo',
    data()
    {
        return {
            info: {
                workStoreId: null,
                tenantId: null,
                custTenantId: null,
                cmContractId: null,
                daterange: null,
                remark: '',
            },
            details: [],//费用信息明细
            supplierData:[],
            workList:[],
            customerData:[],
            contractData: [],
            isShowDialog: false,
            head: [
                {"name": "费用类型", "code": "itemTypeName", "width": "110"},
                {"name": "费用项目", "code": "name", "width": "200"},
                {"name": "计费单位", "code": "unit", "width": "110"},
                {"name": "增值税率(%)", "code": "tax", "width": "110"},
                {"name": "备注", "code": "remark", "width": "250", "type": "input"}
            ],
            query: this.initQuery(),
            type: this.$route.query.type,//0详情 1新增 2修改 3复制
            hisList: [],
            currentHisId: -1,//后台默认返回 -1
            isOnlySee: this.$route.query.type == 0,
            title:'',
            showDetailDialog: false,
            detailList: [],//费用信息明细的明细
            index: -1,//选择了哪条索引的数据维护明细的明细
            endWorkData: [],//起始地下拉
            unitData: [],
            itemTypeData:[],//费用类型
            vehicleLengthData:[],//报价车长
            quoteVehicleTypeData:[],//报价车型
        }
    },
    /**
     * 组件
     */
    components: {
        dbTable,
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
    },
    /**
     * 绑定函数
     */
    methods: {
        async initData()
        {
            this.workList = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.customerData = await this.common.postUrl("customerTF", "loadCustomerList", {});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.unitData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_ITEM_PRICE_UNIT_TYPE"});
            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.vehicleLengthData.unshift({codeValue: "0", codeName: "通用"});
            this.vehicleLengthData.forEach(item => {item.disabled = false;});
            this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
            this.quoteVehicleTypeData.unshift({codeValue: "0", codeName: "通用"});
            this.quoteVehicleTypeData.forEach(item => {item.disabled = false;});
            await this.loadContract(null);
            if (this.common.isNotBlank(this.$route.query.id))
            {
                await this.loadWorkContractDataById(this.$route.query.id, null);
            }
            if(this.$route.query.type == 1){
                this.info.workId = this.common.userInfo().workId;
                this.changeBeginWork();
                let tenantId = this.$route.query.tenantId;
                if(this.common.isNotBlank(tenantId)) this.info.tenantId = Number(tenantId);
            }
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_FEE_ITEM_TYPE"}, function (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].codeValue > 100)
                        that.itemTypeData.push(data[i]);
                }
                that.$forceUpdate();
            });
        },
        async loadContract(tenantId)
        {
            this.contractData = await this.common.postUrl("contractService", "queryStorageEquipmentContractList", {tenantId});
            this.$forceUpdate();
        },
        async open(flag)
        {
            this.isShowDialog = flag;
            if (flag)
            {
                // await this.doQuery();
                this.query.name = null;
                this.$nextTick(async () =>
                {
                    if (this.details)
                    {
                        for (let i = 0; i < this.details.length; i++)
                        {
                            if (this.details[i].itemType == 104)
                            {
                                this.details[i].price = null;
                                this.details[i].priceWithTax = null;
                            }
                        }
                    }
                    this.$refs.table.setRightData(this.details);
                    this.doQuery();
                    this.$forceUpdate();
                })
            }
            this.$forceUpdate();
        },
        initQuery()
        {
            return this.query = {
                custTenantId: null,
                name: null,
                itemIds: [],
            }
        },
        //双表格查询选择数据
        async doQuery()
        {
            this.$nextTick(async () =>
            {
                let param = this.common.copyObj(this.query);
                let data = this.$refs.table.getRightData();
                param.itemIds =  [];
                data.forEach(item => {
                    param.itemIds.push(item.itemId);
                });
                param.isNoLoadPrice = 1;
                if (this.common.isNotBlank(param.custTenantId)) {
                    this.leftData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseSaleDetailPage",param);
                } else {
                    this.leftData = await this.common.postUrl("wmsFeeItemService", "queryFeeItemList",param);
                }
                this.filterTableData();
                this.$forceUpdate();
            })
        },
        // 筛选费用项目
        filterTableData(){
            let leftData = [];
            if(this.common.isNotBlank(this.query.feeTypeName)){
                this.leftData.forEach(item=>{
                    if(item.itemTypeName == this.query.feeTypeName){
                        leftData.push(item);
                    }
                })
            }else{
                leftData = this.leftData;
            }
            this.$refs.table.setLeftData(leftData); 
        },
        // 清空筛选条件
        clearFilter(){
            this.query = {
                name:"",
                feeType:"",
                custTenantId:"",
            };
        },
        async loadWorkContractDataById(id, hisId)
        {
            let data = await this.common.postUrl("workContractService", "loadWorkContractById", {id, hisId});
            this.info = data.info;
            if (this.$route.query.type == 3)
            {
                this.info.id = null;
            }
            await this.loadWork(this.info.workId);
            this.info.daterange = [data.info.effectDate, data.info.expireDate];
            for (let i = 0; i < data.details.length; i++)
            {
                let item = data.details[i];
                if (this.common.isNotBlank(item.detailList) && item.detailList.length > 0)
                {
                    for (let index in item.detailList)
                    {
                        let detail = item.detailList[index];
                        detail.endWorkId = String(detail.endWorkId);
                        detail.quoteVehicleType = detail.quoteVehicleType.split(",");
                        detail.vehicleLength = detail.vehicleLength.split(",");
                        this.changeUnit(detail);
                    }
                }
            }
            this.details = data.details;
            this.hisList = data.hisList;
            this.$forceUpdate();
        },
        /**
         * 确认选择的费用
         * @returns {Promise<void>}
         */
        async sure()
        {
            let data = this.$refs.table.getRightData();
            this.details = [];
            for (let i = 0; i < data.length; i++)
            {
                this.details.push(data[i]);
            }
            await this.open(false);
            this.$forceUpdate();
        },
        del(item, index)
        {
            //this.$refs.table.toLeftTable(item, index);
            this.details.splice(index, 1);
        },
        addDetailItem()
        {
            this.detailList.push(this.initDetailItem());
        },
        delDetailItem(item, index)
        {
            this.detailList.splice(index, 1);
        },
        /**
         * 初始化报价明细对象
         * @returns
         */
        initDetailItem()
        {
            return {
                beginWorkId: null,
                endWorkId: null,
                unit: null,
                quoteVehicleType: null,
                vehicleLength: null,
                beginRange: null,
                endRange: null,
                beginRangeDisabled: false,
                endRangeDisabled: false,
                quoteVehicleTypeData: this.common.copyObj(this.quoteVehicleTypeData),
                vehicleLengthData: this.common.copyObj(this.vehicleLengthData),
                price: null,
                tax: null,
                priceWithTax: null,
            };
        },
        openItemDetail(item, index)
        {
            if (this.common.isBlank(this.info.workId))
            {
                this.$message.error("请先选择物流中心");
                return;
            }
            if (this.common.isBlank(item.detailList) || item.detailList.length == 0)
            {
                item.detailList = [this.initDetailItem()];
            }
            for (let i = 0; i < item.detailList.length; i++)
            {
                item.detailList[i].quoteVehicleTypeData = this.common.copyObj(this.quoteVehicleTypeData);
                item.detailList[i].vehicleLengthData = this.common.copyObj(this.vehicleLengthData);
            }
            this.title=item.name;
            this.detailList = item.detailList;
            this.index = index;//选择的数据
            this.showDetailDialog = true;
            this.$forceUpdate();
        },
        /**
         * 确认短驳配送报价
         * 这里先校验一遍
         */
        sureItemDetail()
        {
            if (this.detailList && this.detailList.length > 0)
            {
                let tip = "请输入第"
                let tip2 = "请选择第"
                for (let i = 0; i < this.detailList.length; i++)
                {
                    let item = this.detailList[i];
                    if (this.common.isBlank(item.endWorkId))
                    {
                        this.$message.error(tip2 + (i + 1) + "行的作业点");
                        return;
                    }
                    if (this.common.isBlank(item.unit))
                    {
                        this.$message.error(tip + (i + 1) + "行的价格单位");
                        return;
                    }
                    if (this.common.isBlank(item.quoteVehicleType) || item.quoteVehicleType.length == 0)
                    {
                        this.$message.error(tip2 + (i + 1) + "行的报价类型");
                        return;
                    }
                    if (this.common.isBlank(item.vehicleLength) || item.vehicleLength.length == 0)
                    {
                        this.$message.error(tip2 + (i + 1) + "行的车长");
                        return;
                    }
                    let isByVehicle = false;
                    for (let i = 0; i < this.unitData.length; i++)
                    {
                        if (this.unitData[i].codeName == item.unit)
                        {
                            if (this.unitData[i].codeName.indexOf("元/车次") >= 0)
                            {
                                isByVehicle = true;
                            }
                            break;
                        }
                    }
                    if (!isByVehicle)
                    {
                        if (this.common.isBlank(item.beginRange))
                        {
                            this.$message.error(tip + (i + 1) + "行的起始区间");
                            return;
                        }
                        if (this.common.isBlank(item.endRange))
                        {
                            this.$message.error(tip + (i + 1) + "行的结束区间");
                            return;
                        }
                    }
                    if (this.common.isBlank(item.price))
                    {
                        this.$message.error(tip + (i + 1) + "行的未税单价");
                        return;
                    }
                    if (this.common.isBlank(item.priceWithTax))
                    {
                        this.$message.error(tip + (i + 1) + "行的含税单价");
                        return;
                    }
                }
            }
            this.details[this.index].detailList = this.common.copyObj(this.detailList);
            this.showDetailDialog = false;
            this.$forceUpdate();
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        async changeBeginWork()
        {
            await this.loadWork(this.info.workId);
            for (let i = 0; i < this.details.length; i++)
            {
                let item = this.details[i];
                if (item.itemType == 104)
                {
                    if (item.detailList && item.detailList.length > 0)
                    {
                        for (let i = 0; i < item.detailList.length; i++)
                        {
                            let detailItem = item.detailList[i];
                            detailItem.endWorkId = null;
                            if (this.endWorkData.length === 1)
                            {
                                detailItem.endWorkId = this.endWorkData[0].workId;
                            }
                        }
                    }
                }
            }
            this.$forceUpdate();
        },
        changeEndWork(item)
        {
            this.$forceUpdate();
        },
        async loadWork(beginWorkId)
        {
            this.endWorkData = await this.common.postUrl("workGoodsTF","queryWorkDataSelect", {isWmsWork: 1,storeId: beginWorkId});
            this.$forceUpdate();
        },
        changeUnit(item)
        {
            let isByVehicle = false;
            if (item.unit)
            {
                for (let i = 0; i < this.unitData.length; i++)
                {
                    if (this.unitData[i].codeName == item.unit)
                    {
                        if (this.unitData[i].codeName.indexOf("元/车次") >= 0)
                        {
                            isByVehicle = true;
                        }
                        break;
                    }
                }
            }
            item.beginRangeDisabled = isByVehicle;
            item.endRangeDisabled = isByVehicle;
            if (isByVehicle)
            {
                item.beginRange = null;
                item.endRange = null;
            }
            this.$forceUpdate();
        },

        /**
         * 改变报价车型
         * @param data
         */
        changeQuoteVehicleType(data)
        {
            if (this.changeEvent(data.quoteVehicleTypeData, data.quoteVehicleType))
            {
                data.quoteVehicleType = [];
                data.quoteVehicleType.push("0");
            }
        },
        /**
         * 改变车长
         * @param data
         */
        changeVehicleLength(data)
        {
            if (this.changeEvent(data.vehicleLengthData, data.vehicleLength))
            {
                data.vehicleLength = [];
                data.vehicleLength.push("0");
            }
        },
        /**
         * 下拉数据禁用处理
         * @param selectList
         * @param selectData
         * @returns {boolean}
         */
        changeEvent(selectList, selectData)
        {
            let initAll = false;
            selectList.forEach(el => {
                let find = false;
                let selectAll = false;
                selectData.forEach(item => {
                    if (item == el.codeValue)
                        find = true;
                    if (item == 0)
                        selectAll = true;
                })
                initAll = selectData.length > 0 && selectAll;
                el.disabled = find || selectAll;
            })
            return initAll;
        },
        /**
         * 提交数据保存合同
         * @returns {Promise<void>}
         */
        async submit()
        {
            if (this.common.isBlank(this.info.workId))
            {
                this.$message.error("请选择物流中心");
                return;
            }
            if (this.common.isBlank(this.info.tenantId))
            {
                this.$message.error("请选择供应商");
                return;
            }
            if (this.common.isBlank(this.info.daterange))
            {
                this.$message.error("请选择有效期");
                return;
            }
            let param = this.common.copyObj(this.info);
            param.details = this.common.copyObj(this.details);
            if(this.common.isNotBlank(param.daterange) && param.daterange.length === 2){
                param.effectDate = param.daterange[0];
                param.expireDate = param.daterange[1];
            }
            await this.common.postUrl('workContractService', 'saveOrUpdateWorkContract', param, null, null, null, true);
            this.$message.success("提交成功")
            this.closePage();
        },
        async changeTenant()
        {
            this.info.cmContractId = null;
            await this.loadContract(this.info.tenantId);
        },
        async changeContract()
        {
            this.info.tenantId = null;
            this.info.daterange = null;
            this.contractData.forEach(item => {
                if (this.info.cmContractId == item.id)
                {
                    this.info.tenantId = item.tenantId;
                    this.info.daterange = [item.beginDate, item.endDate];
                }
            });
            this.$forceUpdate();
        },
        async changeHisVer(hisId)
        {
            this.currentHisId = hisId;
            await this.loadWorkContractDataById(this.$route.query.id, hisId);
        },
        changeDetailPrice(item, flag)
        {
            item.tax = this.details[this.index].tax;
            this.changePrice(item, flag);
        },
        changePrice(item, flag)
        {
            if(this.common.isBlank(item.tax))
            {
                item.tax = 0;
            }
            if(flag == 1)
            {
                if(this.common.isBlank(item.price))
                {
                    return;
                }
                else
                {
                    if (isNaN(item.price))
                    {
                        return;
                    }
                }
                item.priceWithTax = this.common.accMul(item.price,(1 + this.common.accDiv(item.tax,100))).toFixed(2);
            }
            else if(flag == 2)
            {
                if(this.common.isBlank(item.priceWithTax))
                {
                    return;
                }
                else
                {
                    if (isNaN(item.priceWithTax))
                    {
                        return;
                    }
                }
                item.price = this.common.accDiv(item.priceWithTax,(1 + this.common.accDiv(item.tax,100))).toFixed(2);
            }
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
}
