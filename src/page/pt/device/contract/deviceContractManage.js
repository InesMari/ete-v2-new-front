import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'deviceContractManage',
    data()
    {
        return {
            head: [
                {"name": "合同编号", "code": "devContractNum", "width": "150", "type": "text"},
                {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "业务模式", "code": "businessModeName", "width": "120", "type": "text"},
                {"name": "税点", "code": "taxRate", "width": "90", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "仓库", "code": "workName", "width": "250", "type": "text"},
                {"name": "器具名称", "code": "deviceNames", "width": "150", "type": "text"},
                {"name": "数量", "code": "nums", "width": "100", "type": "text"},
                {"name": "累计产生收入", "code": "totalFee", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            detailListHead: [],
            detailListHead1: [
                {"name": "器具名称", "code": "deviceId", "width": "150", "type": "diy"},
                {"name": "器具规格", "code": "specification", "width": "150", "type": "diy"},
                {"name": "未税单价", "code": "price", "width": "100", "type": "diy"},
                {"name": "单价单位", "code": "unit", "width": "100", "type": "diy"},
                {"name": "数量", "code": "nums", "width": "100", "type": "diy"},
                {"name": "金额", "code": "totalFee", "width": "100", "type": "diy"},
                {"name": "操作", "code": "operate", "width": "100", "type": "diy"},
            ],
            detailListHead2: [
                {"name": "器具名称", "code": "deviceId", "width": "150", "type": "diy"},
                {"name": "器具规格", "code": "specification", "width": "150", "type": "diy"},
                {"name": "未税单价", "code": "price", "width": "100", "type": "diy"},
                {"name": "单价单位", "code": "unit", "width": "100", "type": "diy"},
                {"name": "数量", "code": "nums", "width": "100", "type": "diy"},
                {"name": "金额", "code": "totalFee", "width": "100", "type": "diy"},
                // {"name": "合同有效期", "code": "leaseDate", "width": "200", "type": "diy"},
                {"name": "操作", "code": "operate", "width": "100", "type": "diy"},
            ],
            detailListHead3: [
                {"name": "器具名称", "code": "deviceId", "width": "150", "type": "diy"},
                {"name": "器具规格", "code": "specification", "width": "150", "type": "diy"},
                {"name": "器具费用项目", "code": "feeItem", "width": "150", "type": "diy"},
                {"name": "未税单价", "code": "price", "width": "100", "type": "diy"},
                {"name": "单价单位", "code": "unit", "width": "100", "type": "diy"},
                {"name": "数量", "code": "nums", "width": "100", "type": "diy"},
                {"name": "金额", "code": "totalFee", "width": "100", "type": "diy"},
                // {"name": "合同有效期", "code": "leaseDate", "width": "200", "type": "diy"},
                // {"name": "计费节点", "code": "relOperation", "width": "150", "type": "diy"},
                {"name": "器具费用项目备注", "code": "remark", "width": "200", "type": "diy"},
                // {"name": "补充仓储单价(元/天/个)", "code": "exceedPrice", "width": "200", "type": "diy"},
                // {"name": "周转率(%)", "code": "minTurnoverRate", "width": "100", "type": "diy"},
                {"name": "操作", "code": "operate", "width": "100", "type": "diy"},
            ],
            query: this.initQuery(this.$route.query.tenantName),
            title: '新增器具合同',
            dialogShow: false,
            isOnlySee: false,
            storeHouseData: [],
            custTenantData: [],
            deviceData: [],
            settleBodyData: [],
            businessModeData: [],
            feeItemData: [],
            unitDataSrc: [],
            unitData: [],
            relOperationData: [],
            info: this.initInfo(),
            detailList: [this.initItem('')],
            type: 1,
        }
    },
    mounted()
    {
        this.doQuery();
    },
    components: {
        tableCommon,
        scrollTable
    },
    methods: {
        initQuery(tenantName)
        {
            return this.query = {
                tenantName: tenantName,
                deviceName: '',
                devContractNum: '',
            }
        },
        initInfo()
        {
            return this.info = {
                workId: '',
                settleBody: '',
                tenantId: '',
                businessMode: '1',//默认直买直卖
                taxRate: '',
                devContractNum: '',
                remark: '',
            }
        },
        initItem(unit)
        {
            return {
                deviceId: '',
                specification: '',
                feeItem: '',
                price: '',
                unit: unit,
                nums: '',
                totalFee: '',
                validityPeriod: '',
                relOperation: [],
                remark: '',
                exceedPrice: '',
                minTurnoverRate: '',
                operate: '',
            }
        },
        async initStaticData()
        {
            this.custTenantData = await this.common.postUrl("pkgContractTF", "getPackCust", {});
            this.deviceData = await this.common.postUrl("deviceBaseService", "queryDeviceInfoList", {});
            this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"})
            this.businessModeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BUSINESS_MODE"})
            this.feeItemData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "FEE_ITEM"})
            for (let i = 0; i < this.feeItemData.length; i++)
            {
                if (this.feeItemData[i].codeValue == '1')
                {
                    this.feeItemData.splice(i, 1);
                    i--;
                }
            }
            this.unitDataSrc = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PRICE_UNIT"})
            this.relOperationData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "FEE_OPERATION"})
            // for (let i = 0; i < this.relOperationData.length; i++)
            // {
            //     if (this.relOperationData[i].codeValue == '3' || this.relOperationData[i].codeValue == '4' || this.relOperationData[i].codeValue == '5')
            //     {
            //         this.relOperationData.splice(i, 1);
            //         i--;
            //     }
            // }
        },
        async doQuery()
        {
            this.$refs.table.load("deviceContractService", "queryDeviceContractPage", this.query);
        },
        dblclickItem(data)
        {
            this.showDialog(3, data);
        },
        openDialog(flag)
        {
            this.dialogShow = flag;
            this.$forceUpdate();
        },
        async showDialog(type, data)
        {
            await this.initStaticData();
            this.type = type;
            this.isOnlySee = type === 3;
            if (type === 1)
            {
                this.initInfo();
                this.title = '新增器具合同';
                this.detailList = [this.initItem("1")];
                this.detailListHead = this.detailListHead1;
                this.unitData = [];
                this.unitData.push(this.unitDataSrc[0]);
                this.openDialog(true);
                this.$nextTick(() =>
                {
                    this.$refs.scrollTable.setData(this.detailList);    //设置表格数据
                    this.$refs.scrollTable.calcFootSum();   //表格合计
                    this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
                });
            }
            else if(type === 2)
            {
                this.title = '修改器具合同';
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1)
                {
                    this.$message.error("请选择一条包装合同数据！");
                    return false;
                }
                this.openDialog(true);
                this.info = this.common.copyObj(selectData[0]);
                this.info.settleBody = "" + this.info.settleBody;
                this.info.businessMode = "" + this.info.businessMode;
                this.detailList = await this.common.postUrl("deviceContractService", "queryDevContractDeviceDtlListByContractId", {id: this.info.id});
                this.changeBusinessMode(this.info.businessMode, true);
            }
            else if(type === 3)
            {
                this.title = '查看器具合同';
                this.openDialog(true);
                this.info = this.common.copyObj(data);
                this.info.settleBody = "" + this.info.settleBody;
                this.info.businessMode = "" + this.info.businessMode;
                this.detailList = await this.common.postUrl("deviceContractService", "queryDevContractDeviceDtlListByContractId", {id: this.info.id});
                this.changeBusinessMode(this.info.businessMode, true, true);
            }
        },
        changeBusinessMode(businessMode, isNotInit, isRemoveOp)
        {
            this.unitData = [];
            if (businessMode == 1)
            {
                this.detailListHead = this.common.copyObj(this.detailListHead1);
                this.unitData.push(this.unitDataSrc[0]);
            }
            else if (businessMode == 2)
            {
                this.detailListHead = this.common.copyObj(this.detailListHead2);
                this.unitData.push(this.unitDataSrc[1]);
                this.unitData.push(this.unitDataSrc[2]);
            }
            else
            {
                this.detailListHead = this.common.copyObj(this.detailListHead3);
                this.unitData.push(this.unitDataSrc[3]);
            }
            if (isRemoveOp)
            {
                this.detailListHead.splice(this.detailListHead.length - 1, 1);
                this.$forceUpdate();
            }
            if (!isNotInit)
            {
                for (let i = 0; i < this.detailList.length; i++)
                {
                    let item = this.detailList[i];
                    item.unit = this.unitData[0].codeValue;
                }
            }
            this.$nextTick(() =>
            {
                this.$refs.scrollTable.setData(this.detailList);    //设置表格数据
                this.$refs.scrollTable.calcFootSum();   //表格合计
                this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
            });
            this.$forceUpdate();
        },
        async changeWork()
        {
            this.info.settleBody = await this.common.postUrl("userTF", "getRelSubsidiary");
        },
        changePack(data)
        {
            if (data)
            {
                for (let i = 0; i < this.deviceData.length; i++)
                {
                    let item = this.deviceData[i];
                    if (item.id == data.deviceId)
                    {
                        data.specification = item.spec;
                    }
                }
            }
            this.$forceUpdate();
        },
        addItem(index)
        {
            let unit = '1';
            if (this.info.businessMode == 2)
                unit = '2';
            if (this.info.businessMode == 3)
                unit = '4';
            let data = this.initItem(unit);
            this.detailList = this.$refs.scrollTable.getData();
            this.detailList.splice(index + 1, 0, data);
            this.$refs.scrollTable.setData(this.detailList);    //设置表格数据
            this.$refs.scrollTable.calcFootSum();   //表格合计
            this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
            this.changePack();
        },
        removeItem(index)
        {
            this.detailList = this.$refs.scrollTable.getData();
            this.detailList.splice(index, 1);
            this.$refs.scrollTable.setData(this.detailList);    //设置表格数据
            this.$refs.scrollTable.calcFootSum();   //表格合计
            this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
            this.changePack();
        },
        async saveContract()
        {
            if (this.common.isBlank(this.info.settleBody))
            {
                this.$message.error("请选择结算主体！");
                return false;
            }
            if (this.common.isBlank(this.info.tenantId))
            {
                this.$message.error("请选择客户名称！");
                return false;
            }
            if (this.common.isBlank(this.info.businessMode))
            {
                this.$message.error("请选择业务模式！");
                return false;
            }
            if (this.common.isBlank(this.info.taxRate))
            {
                this.$message.error("请输入税点！");
                return false;
            }
            let detailList = this.$refs.scrollTable.getData();
            if (this.common.isBlank(detailList) || detailList.length === 0)
            {
                this.$message.error("请新增合同明细！");
                return false;
            }
            for (let i = 0; i < detailList.length; i++)
            {
                let item = detailList[i];
                if (this.common.isBlank(item.deviceId))
                {
                    this.$message.error("请选择第" + (i + 1) +"行的器具！");
                    return false;
                }
                if (this.info.businessMode == 3)
                {
                    if (this.common.isBlank(item.feeItem))
                    {
                        this.$message.error("请选择第" + (i + 1) +"行的器具费用项目！");
                        return false;
                    }
                }
                if (this.common.isBlank(item.price))
                {
                    this.$message.error("请输入第" + (i + 1) +"行的未税单价！");
                    return false;
                }
                if (this.common.isBlank(item.unit))
                {
                    this.$message.error("请选择第" + (i + 1) +"行的单价单位！");
                    return false;
                }
                if (this.common.isBlank(item.nums))
                {
                    this.$message.error("请输入第" + (i + 1) +"行的数量！");
                    return false;
                }
                if (this.info.businessMode != 3)
                {
                    if (this.common.isBlank(item.totalFee))
                    {
                        this.$message.error("请输入第" + (i + 1) +"行的金额！");
                        return false;
                    }
                }
                if (this.info.businessMode == 2)
                {
                    if (this.common.isBlank(item.totalFee))
                    {
                        this.$message.error("请输入第" + (i + 1) +"行的合同有效期(月份)！");
                        return false;
                    }
                }
                if (this.info.businessMode == 3)
                {
                    if (this.common.isBlank(item.relOperation) || item.relOperation.length === 0)
                    {
                        // this.$message.error("请选择第" + (i + 1) +"行的计费节点！");
                        // return false;
                        item.relOperation=[3];
                    }
                    if (this.common.isBlank(item.minTurnoverRate))
                    {
                        // this.$message.error("请输入第" + (i + 1) +"行的周转率！");
                        // return false;
                    }
                }
                if (this.common.isBlank(item.relOperation) || item.relOperation.length === 0)
                {
                    item.relOperation = "";
                }
                else
                {
                    let relOperation = "";
                    for (let j = 0; j < item.relOperation.length; j++)
                    {
                        if (this.common.isNotBlank(item.relOperation[j]))
                            relOperation += "," + item.relOperation[j];
                    }
                    if (relOperation.length > 0)
                        relOperation = relOperation.substring(1);
                    item.relOperation = relOperation;
                }
            }
            let param = this.common.copyObj(this.info);
            param.detailList = detailList;
            await this.common.postUrl("deviceContractService", "saveOrUpdateDevContract", param, null, null, '', true);
            await this.doQuery();
            this.$message.success("保存完成！");
            this.openDialog(false);
        },
        async delContract()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条器具合同数据！");
                return false;
            }
            let that = this;
            that.$confirm("是否需要删除器具合同数据？", "提示").then(() =>
            {
                this.common.postUrl("deviceContractService", "deleteDevContract", {id: selectData[0].id}, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                }, null, '', true);
            }).catch(() => {
            });
        },
        calcFee(item)
        {
            if (this.common.isNotBlank(item.price) && this.common.isNotBlank(item.nums))
            {
                item.totalFee = this.common.accMul(item.price, item.nums);
            }
            else
            {
                item.totalFee = 0;
            }
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
                urlId: 'deviceContractDetail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.DEVICE_CONTRACT,
                },
                urlName: "器具合同操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
