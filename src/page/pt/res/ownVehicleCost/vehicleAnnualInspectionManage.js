import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'vehicleAnnualInspectionManage',
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "年检日期", "code": "inspectionDate", "width": "150", "type": "text"},
                {"name": "年检费用", "code": "inspectionFee", "width": "100", "type": "text"},
                {"name": "车管所", "code": "vehicleDepartment", "width": "150", "type": "text"},
                {"name": "年检到期日期", "code": "nextInspectionDate", "width": "150", "type": "text"},
                {"name": "到期状态", "code": "expirationStatusName", "width": "150", "type": "text"},
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
            expirationStatusData:[],
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
            if(this.common.isNotBlank(this.query.inspectionDate) && this.query.inspectionDate.length==2){
                this.query.startInspectionDate = this.query.inspectionDate[0];
                this.query.endInspectionDate = this.query.inspectionDate[1];
            }else{
                this.query.startInspectionDate = '';
                this.query.endInspectionDate = '';
            }
            if(this.common.isNotBlank(this.query.nextInspectionDate) && this.query.nextInspectionDate.length==2){
                this.query.startNextInspectionDate = this.query.nextInspectionDate[0];
                this.query.endNextInspectionDate = this.query.nextInspectionDate[1];
            }else{
                this.query.startNextInspectionDate = '';
                this.query.endNextInspectionDate = '';
            }
            this.$refs.table.load("vehicleAnnualInspectionTF", "queryVehicleAnnualInspectionPage", this.query);
        },
        async initStaticData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'EXPIRATION_STATUS,VERIFY_STATE'});
            this.verifyStateData = data.VERIFY_STATE;
            this.expirationStatusData = data.EXPIRATION_STATUS;
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
            let urlPath = "/pt/res/ownVehicleCost/vehicleAnnualInspectionInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增车辆年检记录";
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改的车辆年检记录！");
                    return false;
                }
                data = selectData[0];
                param.time = data.id;
                param.id = data.id;
                title = "修改车辆年检记录";
            }
            else if(type == 0)//双击
            {
                param.time = data.id + "detail";
                param.id = data.id;
                title = "查看车辆年检记录";
                urlPath = "/pt/res/ownVehicleCost/vehicleAnnualInspectionInfoMain.vue";
            }
            else if(type == 3)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要审核的车辆年检记录！");
                    return false;
                }
                if (selectData[0].verifyState != 0)
                {
                    this.$message.error("只有未审核的车辆年检记录才能执行审核操作！");
                    return false;
                }
                data = selectData[0];
                param.time = data.id + "verify";
                param.id = data.id;
                title = "审核车辆年检记录";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'vehicleAnnualInspectionInfo' + param.time,
                query: {id: param.id, type,
                    logId: param.id,
                    logType: enumData.LOG_TYPE.ANNUAL_INSPECTION,
                },
                urlName: title,
                urlPathName: "/res",
                urlPath: urlPath});
        },
        dblclickItem(data)
        {
            this.openPage(0, data);
        },
        async deleteInfo()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的车辆年检记录！");
                return false;
            }
            if (enumData.applyVerifyState.approved == selectData[0].verifyState)
            {
                this.$message.error("审核通过的车辆年检记录不可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("vehicleAnnualInspectionTF", "deleteVehicleAnnualInspectionInfo", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        download(){
            this.$refs.table.downloadExcelFile('车辆年检记录列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name": "车牌号码", "model": "plateNumber", "type": "input", "isshow": true},
                {"name": "审核状态", "model": "verifyState", "type": "select", "options": this.verifyStateData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "车管所", "model": "vehicleDepartment", "type": "input", "isshow": true},
                {"name":"年检日期","model":"inspectionDate","type":"daterange","isshow":true},
                {"name":"年检到期日期","model":"nextInspectionDate","type":"daterange","isshow":true},
                {"name":"到期状态","model":"expirationStatus","type":"select","options":this.expirationStatusData,"label":"codeName","value":"codeValue","placeholder":"到期状态","method":"doQuery","isshow":true,"multiple": true,"tipText":"将到期：在30天内到期；未到期：不包括30天内将到期的记录"},
            ]
        }
    },
}
