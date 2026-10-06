import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'vehicleWorkManage',
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "150", "type": "text"},
                {"name": "作业点名称", "code": "workName", "width": "150", "type": "text"},
                {"name": "地址", "code": "workAddress", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
            ],
            query: this.initQuery(this.$route.query),
            workData: [],
            vehicleData: [],
            showDialog: false,
            isOnlySee: false,
            title: "新增车辆监控维护",
            info: this.initInfo(),
        }
    },
    mounted()
    {
        this.doQuery();
        this.initStaticData();
    },
    components: {
        myImport,
        tableCommon,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                vehicleId: null,
                workId: null,
                remark: null,
            }
        },
        initQuery(query)
        {
            return this.query = {
                plateNumber: '',
                workName: '',
                workAddress: '',
            };
        },
        async initStaticData()
        {
            this.vehicleData = await this.common.postUrl("resVehicleInfoTF", "queryAllVehicleNoPage", {isLoadBind: 1});//绑定部标机的
            this.workData = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {isWmsWork : 1});
        },
        doQuery()
        {
            this.$refs.table.load("vehicleWorkService", "queryVehicleWorkPage", this.query);
        },
        /**
         * @param flag 开关
         * @param type 1新增 2修改 4双击查看详情
         * @param obj
         */
        openDialog(flag, type, obj)
        {
            this.initInfo();
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (type == 2 && selectData.length != 1)
                {
                    this.$message.error("请选择一条修改数据!");
                    return;
                }
                if (this.common.isNotBlank(obj))
                    this.info = obj;
                else
                {
                    if (type == 2)
                        this.info = this.common.copyObj(selectData[0]);
                }
                if (type == 1)
                {
                    this.title = "新增车辆监控维护";
                    this.isOnlySee = false;
                }
                if (type == 2)
                {
                    this.title = "修改车辆监控维护";
                    this.isOnlySee = false;
                }
                if (type == 4)
                {
                    this.title = "查看车辆监控维护";
                    this.isOnlySee = true;
                }
            }
            this.showDialog = flag;
        },
        dblclickItem(data)
        {
            this.openDialog(true, 4, data);
        },
        async savePersonCost()
        {
            if (this.common.isBlank(this.info.vehicleId))
            {
                this.$message.error("请选择车牌号码！");
                return;
            }
            if (this.common.isBlank(this.info.workId))
            {
                this.$message.error("请选择作业点！");
                return;
            }
            await this.common.postUrl("vehicleWorkService", "saveOrUpdateVehicleWork", this.info, null, null, '', true);
            this.doQuery();
            this.openDialog(false);
            this.$message.success(this.info.id > 0 ? "修改成功!" : "新增成功!");
        },
        deleteVehicleWork()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择至少一条需要删除的数据!");
                return;
            }
            let that = this;
            that.$confirm("确认需要删除？", "提示").then(() =>
            {
                that.common.postUrl("vehicleWorkService", "deleteVehicleWork", {id: selectData[0].id}, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                }, null, '', true);
            }).catch(() =>
            {
            });
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
                urlId: 'vehicleWork' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.VEHICLE_WORK,
                },
                urlName: "车辆作业点" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
