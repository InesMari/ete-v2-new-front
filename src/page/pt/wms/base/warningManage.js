import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'warningManage',
    data() {
        return {
            head: [
                {"name": "物料编码", "code": "materialNum", "width": "120", "type": "text"},
                {"name": "物料描述", "code": "materialDesc", "width": "120", "type": "text"},
                {"name": "所属货主", "code": "srcTenantName", "width": "160", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "160", "type": "text"},
                {"name": "最高库存", "code": "maxStock", "width": "80", "type": "text"},
                {"name": "最低库存", "code": "minStock", "width": "80", "type": "text"},
                {"name": "告警库存", "code": "currentNums", "width": "80", "type": "text"},
                {"name": "库龄超期", "code": "warningDay", "width": "80", "type": "text"},
                {"name": "库龄天数", "code": "currentAge", "width": "80", "type": "text"},
                {"name": "批次号", "code": "batchNum", "width": "100", "type": "text"},
                {"name": "规格", "code": "specsName", "width": "100", "type": "text"},
                {"name": "生产日期", "code": "produceDate", "width": "120", "type": "text"},
                // {"name": "入库日期", "code": "inDate", "width": "120", "type": "text"},
                {"name": "是否冻结", "code": "freezeStateName", "width": "80", "type": "text"},
                {"name": "预警类型", "code": "warningTypeName", "width": "100", "type": "text"},
                {"name": "状态", "code": "stateName", "width": "100", "type": "text"},
                {"name": "预警时间", "code": "createDate", "width": "120", "type": "text"}
            ],
            loadParam: {},
            warningTypeData:[]
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            this.$refs.table.load("wmsWarningTF", "queryWarningPage", this.loadParam);
        },
        init() {
            let that = this;
            //预警类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WARNING_TYPE"}, function (data) {
                that.warningTypeData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },

        toUpdateWarningState() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一条预警信息！");
                return;
            }
            let warningIds = [];
            for (let i = 0; i < selectData.length; i++) {
                warningIds.push(selectData[i].warningId);
            }
            this.$confirm("是否确认标识已读？", "提示").then(async () =>{
                await this.common.postUrl("wmsWarningTF", "updateWarningState", {warningIds},
                    null, null, '', true);
                this.$message.success("标识已读成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },

        toDelWarning() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请至少选择一条预警信息！");
                return;
            }
            let warningIds = [];
            for (let i = 0; i < selectData.length; i++) {
                warningIds.push(selectData[i].warningId);
            }
            this.$confirm("是否确认删除预警？", "提示").then(async () =>{
                await this.common.postUrl("wmsWarningTF", "delWarning", {warningIds},
                    null, null, '', true);
                this.$message.success("删除预警成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
    },
}
