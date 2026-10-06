import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'driverAssessmentManage',
    data()
    {
        return {
            head: [
                {"name": "司机姓名", "code": "driverName", "width": "90", "type": "text"},
                {"name": "手机号码", "code": "driverPhone", "width": "180", "type": "text"},
                {"name": "所属公司", "code": "supplierName", "width": "200", "type": "text"},
                {"name": "考评月份", "code": "assessmentMonth", "width": "100", "type": "text"},
                {"name": "运作数据", "code": "operationalData", "width": "250", "type": "text"},
                {"name": "车辆点检", "code": "vehicleInspection", "width": "250", "type": "text"},
                {"name": "工作态度", "code": "workAttitude", "width": "250", "type": "text"},
                {"name": "异常点", "code": "outlier", "width": "250", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "60", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            uploadOpen:false,
        }
    },
    mounted()
    {
        this.doQuery();    
    },
    components: {
        myImport,
        tableCommon,
    },
    methods: {
        initQuery()
        {
            return this.query = {
                driverName: null,
                assessmentMonth: null,
                driverPhone: null,
                supplierName: null,
            }
        },
        async doQuery()
        {
            this.$refs.table.load("driverAssessmentService", "queryDriverAssessmentPage", this.query);
        },
        dblclickItem(data)
        {
            this.openPage(0, data);
        },
        /**
         * 0 查看 1 增加 2 修改
         * @param type
         * @returns {boolean}
         */
        openPage(type, data)
        {
            let param = {};
            let title = "";
            let  urlPath = "/pt/res/ownVehicle/driverAssessmentInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增司机考评";
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改的司机考评！");
                    return false;
                }
                data = selectData[0];
                param.time = data.id;
                param.id = data.id;
                title = "修改司机考评";
            }
            else if(type == 0)
            {
                param.time = data.id + "detail";
                param.id = data.id;
                title = "查看司机考评";
                urlPath = "/pt/res/ownVehicle/driverAssessmentInfoMain.vue";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'driverAssessmentInfo' + param.time,
                query: {id: param.id, type,
                    logId: param.id,
                    logType: enumData.LOG_TYPE.DRIVER_ASSESSMENT,
                },
                urlName: title,
                urlPathName: "/res",
                urlPath: urlPath});
        },
        async deleteDriverAssessment()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一个需要删除的司机考评!");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("driverAssessmentService", "deleteDriverAssessmentById", array[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("司机考评删除成功!");
                });
            }).catch(() =>{})
        },
        download(){
            this.$refs.table.downloadExcelFile('司机考评');
        },
    },
}
