import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'vehicleFixedCostManage',
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "150", "type": "text"},
                {"name": "费用合计", "code": "totalFee", "width": "150", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "150", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核备注", "code": "verifyRemark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
            ],
            query: {},
            verifyStateData: [],
        }
    },
    mounted()
    {
        this.initStaticData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList,
        enumData,
    },
    methods: {
        async doQuery(query = this.query)
        {
            this.query = query;
            this.$refs.table.load("vehicleFixedCostService", "queryVehicleFixedCostPage", this.query);
        },
        async initStaticData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'VERIFY_STATE'});
            this.verifyStateData = data.VERIFY_STATE;
            let heads = await this.common.postUrl('commonTF', 'querySysStaticDataHeads', {'codeType': 'VEHICLE_FIXED_COST_VEHICLE_TYPE'});
            for (let i = 0; i < heads.length; i++) {
                this.head.splice(i+1, 0, {...heads[i],"width": "150", "type": "text"});
            }
            this.$forceUpdate();
        },
        /**
         * 0 查看 1 增加 2 修改 3审核
         * @param type
         * @returns {boolean}
         */
        openPage(type, data)
        {
            let param = {};
            let title = "";
            let urlPath = "/pt/res/ownVehicleCost/vehicleFixedCostInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增车辆月度固定成本";
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改的车辆月度固定成本！");
                    return false;
                }
                data = selectData[0];
                param.time = data.id;
                param.id = data.id;
                title = "修改车辆月度固定成本";
            }
            else if(type == 0)//双击
            {
                param.time = data.id + "detail";
                param.id = data.id;
                title = "查看车辆月度固定成本";
                urlPath = "/pt/res/ownVehicleCost/vehicleFixedCostInfoMain.vue";
            }
            else if(type == 3)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要审核的车辆月度固定成本！");
                    return false;
                }
                if (selectData[0].verifyState != 0)
                {
                    this.$message.error("只有未审核的车辆月度固定成本才能执行审核操作！");
                    return false;
                }
                data = selectData[0];
                param.time = data.id + "verify";
                param.id = data.id;
                title = "审核车辆月度固定成本";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'vehicleFixedCostInfo' + param.time,
                query: {id: param.id, type,
                    logId: param.id,
                    logType: enumData.LOG_TYPE.VEHICLE_FIXED_COST,
                },
                urlName: title,
                urlPathName: "/res",
                urlPath: urlPath});
        },
        dblclickItem(data)
        {
            this.openPage(0, data);
        },
        async deleteVehicleFixedCost()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的车辆月度固定成本！");
                return false;
            }
            if (enumData.applyVerifyState.approved == selectData[0].verifyState)
            {
                this.$message.error("审核通过的车辆月度固定成本不可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("vehicleFixedCostService", "deleteVehicleFixedCostById", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        download(){
            this.$refs.table.downloadExcelFile('车辆月度固定成本列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name": "车牌号码", "model": "plateNumber", "type": "input", "isshow": true},
                {"name": "审核状态", "model": "verifyState", "type": "select", "options": this.verifyStateData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
            ]
        }
    },
}
