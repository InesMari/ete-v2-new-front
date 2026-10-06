import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport";


export default {
    name: 'staffCostManage',
    data()
    {
        return {
            head: [
                // {"name": "查看", "code": "", "width": "200", "type": "diy"},
                {"name": "人员类型", "code": "personnelTypeName", "width": "90", "type": "text"},
                {"name": "姓名", "code": "name", "width": "180", "type": "text"},
                {"name": "所属公司", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "结算月份", "code": "billMonth", "width": "100", "type": "text"},
                {"name": "基本工资", "code": "basicSalary", "width": "100", "type": "text"},
                {"name": "提成", "code": "percentage", "width": "100", "type": "text"},
                {"name": "社保", "code": "socialSecurityTax", "width": "100", "type": "text"},
                {"name": "福利", "code": "welfare", "width": "100", "type": "text"},
                {"name": "扣罚", "code": "fine", "width": "100", "type": "text"},
                {"name": "合计", "code": "totalFee", "width": "100", "type": "text"},
                // {"name": "审核状态", "code": "verifyStateName", "width": "150", "type": "text"},
                // {"name": "审核人", "code": "verifyUserName", "width": "150", "type": "text"},
                // {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                // {"name": "审核备注", "code": "verifyRemark", "width": "150", "type": "text"},
                // {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                // {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            personnelTypeData: [],
            personnelData: [],//司机和押运员
            supplierData: [],
            verifyStateData: [],
            title: '新增人员成本',
            dialogShow: false,
            isOnlySee: false,
            info: this.initInfo(),
            type: 1,
            verifyRemark: null,

            vehicleFeeDetailDialogShow: false,
            vehicleFeeDetailHead: [
                {"name": "车牌号码", "code": "plateNumber", "width": "150", "type": "text"},
                {"name": "行驶公里", "code": "mileage", "width": "150", "type": "text"},
                {"name": "费用分摊合计", "code": "shareFee", "width": "150", "type": "text"},
            ],
            show:{
                name: null,
                billMonth: null,
            },
            uploadOpen:false
        }
    },
    mounted()
    {
        this.initStaticData();
        this.doQuery();
    },
    components: {
        tableCommon,
        myImport
    },
    methods: {
        async initStaticData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'PERSONNEL_TYPE,VERIFY_STATE'});
            this.personnelTypeData = data.PERSONNEL_TYPE;
            this.verifyStateData = data.VERIFY_STATE;
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            await this.loadDriverOrSupercargoList(-1);
            this.$forceUpdate();
        },
        initInfo()
        {
            return this.info = {
                billMonth: null,
                personnelType: '',
                personnelId: null,
                tenantId: null,
                basicSalary: null,
                percentage: null,
                socialSecurityTax: null,
                welfare: null,
                fine: null,
            }
        },
        initQuery()
        {
            return this.query = {
                personnelType: null,
                tenantName: null,
                name: null,
                billMonth: null,
                verifyState: null,
            }
        },
        async doQuery()
        {
            this.uploadOpen=false;
            this.$refs.table.load("fcPersonnelCostTF", "queryFcPersonnelCostPage", this.query);
        },
        async queryFcPersonnelCostShare(id)
        {
            await this.$refs.table2.load("fcPersonnelCostTF", "queryFcPersonnelCostShare", {id});
        },
        dblclickItem(data)
        {
            this.openDialog(0, data);
        },
        /**
         * 0 查看 1 增加 2 修改 3审核
         * @param type
         * @returns {boolean}
         */
        openDialog(type, data)
        {
            if (this.common.isBlank(type))
            {
                this.dialogShow = false;
                return false;
            }
            this.initInfo();
            this.type = type;
            if (type == 1)
            {
                this.title = "新增人员成本";
                this.isOnlySee = false;
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改的人员成本！");
                    return false;
                }
                this.info = selectData[0];
                this.isOnlySee = false;
                this.title = "修改人员成本";
            }
            else if(type == 0)//双击
            {
                this.info = data;
                this.isOnlySee = true;
                this.title = "查看人员成本";
            }
            else if(type == 3)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要审核的人员成本！");
                    return false;
                }
                if (selectData[0].verifyState != 0)
                {
                    this.$message.error("只有未审核的人员成本才能执行审核操作！");
                    return false;
                }
                this.info = selectData[0];
                this.isOnlySee = true;
                this.title = "审核人员成本";
            }
            this.loadDriverOrSupercargoList(-1);
            this.dialogShow = this.common.isNotBlank(type);
        },
        async tip()
        {
            if (!this.info.personnelType)
            {
                this.info.personnelId = null;
                this.personnelData = [];
                this.$message.error("请先选择人员类型！");
                return false;
            }
            await this.loadDriverOrSupercargoList(this.info.personnelType);
        },
        async loadDriverOrSupercargoList(type)
        {
            this.personnelData = await this.common.postUrl("fcPersonnelCostTF", "queryDriverOrSupercargoList", {isOwn: 1, type: type});
        },
        async changePersonnel()
        {
            this.info.tenantId = null;
            if (this.info.personnelId)
            {
                let personnelId = this.info.personnelId;
                const info = this.personnelData.find(function (item) {
                    return personnelId === item.id;
                });
                if (info.key.endsWith("1"))//司机
                    this.info.personnelType = '1';
                else
                    this.info.personnelType = '2';
                await this.loadDriverOrSupercargoList(this.info.personnelType);
                if (info.tenantId)
                {
                    const tenant = this.supplierData.find(function (item) {
                        return info.tenantId === item.tenantId;
                    });
                    if (tenant)
                    {
                        this.info.tenantId = tenant.tenantId;
                    }
                }
            }
            else
                await this.loadDriverOrSupercargoList(-1);
        },
        showVehicleFeeDetailDialog(item)
        {
            this.vehicleFeeDetailDialogShow = true;
            this.show = this.common.copyObj(item);
            this.$nextTick(() => {
                this.queryFcPersonnelCostShare(this.show.id);
            });
            this.$forceUpdate();
        },
        async saveOrUpdateStaffCost()
        {
            if (this.common.isBlank(this.info.billMonth))
            {
                this.$message.error("请选择结算月份！");
                return false;
            }
            if (this.common.isBlank(this.info.personnelType))
            {
                this.$message.error("请选择人员类型！");
                return false;
            }
            if (this.common.isBlank(this.info.personnelId))
            {
                this.$message.error("请选择姓名！");
                return false;
            }
            if (this.common.isBlank(this.info.basicSalary))
            {
                this.$message.error("请填写基本工资！");
                return false;
            }
            if (this.common.isBlank(this.info.percentage))
            {
                this.$message.error("请填写提成！");
                return false;
            }
            if (this.common.isBlank(this.info.socialSecurityTax))
            {
                this.$message.error("请填写社保！");
                return false;
            }
            // if (this.common.isBlank(this.info.welfare))
            // {
            //     this.$message.error("请填写福利！");
            //     return false;
            // }
            let param = this.common.copyObj(this.info);
            await this.common.postUrl("fcPersonnelCostTF", 'saveFcPersonnelCostInfo', param, null, null, '', true);
            await this.doQuery();
            this.$message.success((this.type == 1 ? '新增' : '修改') + "成功！");
            this.openDialog(null, null);
        },
        async deletePersonnelCost()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的人员成本！");
                return false;
            }
            if (enumData.applyVerifyState.approved == selectData[0].verifyState)
            {
                this.$message.error("审核通过的人员成本不可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("fcPersonnelCostTF", "delFcPersonnelCostInfo", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        async verifyStaffCost(verifyState)
        {
            let param = {verifyState};
            param.id = this.info.id;
            param.verifyRemark = this.verifyRemark;
            await this.common.postUrl("fcPersonnelCostTF", 'verifyFcPersonnelCostInfo', param, null, null, '', true);
            await this.doQuery();
            this.$message.success("审核成功！");
            this.openDialog(null, null);
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
                urlId: 'staffCost' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.PERSONNEL_COST,
                },
                urlName: "人员成本" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
        download(){
            this.$refs.table.downloadExcelFile('人员成本列表');
        },
    },
}
