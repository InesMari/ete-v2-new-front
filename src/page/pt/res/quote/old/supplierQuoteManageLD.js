import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'supplierQuoteManageLD',
    data() {
        return {
            head: [
                {"name": "供应商名称", "code": "supplierName", "width": "110", "type": "text"},
                {"name": "起始点", "code": "beginIndexSearchStr", "width": "110", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "110", "type": "text"},
                {"name": "时效/小时", "code": "transportTimeliness", "width": "110", "type": "text"},
                {"name": "指定客户", "code": "specifyTenantName", "width": "110", "type": "text"}
            ],
            loadParam: {quoteType:2},
            quoteFeeData: [],//报价费用明细数据
            supplierData:[],//供应商
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
        async doQuery() {
            await this.$refs.table.load("quoteTF", "queryLDQuoteData", this.loadParam);
        },
        init() {
            //供应商
            let that = this;
            this.common.postUrl("supplierTF", "queryAllSupplierList", {supplierType:2}, function (data) {
                that.supplierData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 1启用 2禁用 */
        cancle(type) {
            let mes = "启用";
            if(type==2){
                mes = "禁用";
            }
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要"+mes+"的数据！");
                return;
            }
            let ids = "";
            for (let i = 0; i < selectData.length; i++) {
                if (type == 1 && selectData[i].sts == 1) {
                    this.$message.error("" + selectData[i].beginIndexSearchStr + "-" + selectData[i].endIndexSearchStr + " 线路已是" + mes + "状态！");
                    return;
                } else if (type == 2 && selectData[i].sts == 0) {
                    this.$message.error("" + selectData[i].beginIndexSearchStr + "-" + selectData[i].endIndexSearchStr + " 线路已是" + mes + "状态！");
                    return;
                }
                ids += selectData[i].id + ",";
            }
            ids = ids.substring(0, ids.length - 1);
            let that = this;
            this.common.postUrl("quoteTF", "cancleQuoteInfo", {sectionIds:ids,type:type}, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$message.success(mes + "成功！");
                }
            },null,'',true);
        },
        /** 删除报价信息 */
        del() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要删除的数据！");
                return;
            }
            let ids = "";
            let names = "";
            for (let i = 0; i < selectData.length; i++) {
                ids += selectData[i].id + ",";
                names += selectData[i].beginIndexSearchStr + "-" + selectData[i].endIndexSearchStr + ",";
            }
            ids = ids.substring(0, ids.length - 1);
            names = names.substring(0, names.length - 1);
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除供应商报价",
                message: h('p', null, [
                    h('span', null, "此操作将供应商报价："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " 删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("quoteTF", "cancleQuoteInfo", {sectionIds:ids,type:3}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        /** 跳转新增报价页面 */
        add() {
            let item = {
                urlName: "供应商新增零担报价",
                urlId: new Date().getTime(),
                urlPath: "/pt/res/quoteLD/addSupplierQuoteLD.vue",
                query:{},
            }
            this.$emit('openTab', item);
        },
        /** 跳转修改报价页面 */
        modify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            if(selectData[0].sts==0){
                this.$message.error("无法修改已禁用的线路报价！");
                return;
            }
            let item = {
                urlName: "零担修改报价",
                urlId: new Date().getTime(),
                urlPath: "/pt/res/quoteLD/upSupplierQuoteLD.vue",
                query:{quoteId:selectData[0].id},
            }
            this.$emit('openTab', item);
        },
        /** 列表单击行事件 */
        clickItem(data) {
            if(this.common.isNotBlank(data.detailList)){
                this.quoteFeeData = data.detailList;
            }
        },
    },
}
