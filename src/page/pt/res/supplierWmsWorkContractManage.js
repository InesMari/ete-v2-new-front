import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'supplierWmsWorkContractManage',
    data()
    {
        return {
            head: [
                {"name": "单号", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "物流中心", "code": "workName", "width": "200", "type": "text"},
                {"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "客户名称", "code": "custTenantName", "width": "250", "type": "text"},
                {"name": "供应商合同编号", "code": "cmContractNum", "width": "150", "type": "text"},
                {"name": "费用项目数量", "code": "count", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "150", "type": "text"},
                {"name": "审核日期", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核备注", "code": "verifyRemark", "width": "200", "type": "text"},
            ],
            workList: [],
            confirmStateData: [],
            verifyStateData: [],
            supplierData: [],
            query: {
                contractNum: '',
                workId: '',
                confirmStates: [],
                verifyStates: [],
                quoteDate: '',
                tenantId: null
            },
            dialogVisible: false,
        }
    },
    mounted()
    {
        this.initData();
        if (this.common.isNotBlank(this.$route.query.supplierId))
        {
            this.query.tenantId = parseInt(this.$route.query.supplierId);
        }
        if (this.common.isNotBlank(this.$route.query.contractNum))
        {
            this.query.contractNum = this.$route.query.contractNum;
        }
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    computed: {
        formData()
        {
            return [
                {"name":"单号","model":"contractNum","type":"input","placeholder":"单号","isshow":true},
                {"name":"物流中心","model":"workId","type":"select","options":this.workList,"label":"workName","value":"workId","placeholder":"物流中心","method":"doQuery","isshow":true},
                {"name":"供应商","model":"tenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
                {"name":"供应商合同编号","model":"cmContractNum","type":"input","placeholder":"供应商合同编号","isshow":true},
            ]
        }
    },
    methods: {
        async doQuery(query = this.query)
        {
            this.query = query;
            await this.$refs.table.load("workContractService", "queryWorkContractPage", this.query);
        },
        async initData()
        {
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType: "QUOTE_CONFIRM_STATE,VERIFY_STATE"});
            this.confirmStateData = data.QUOTE_CONFIRM_STATE;
            this.verifyStateData = data.VERIFY_STATE;

            this.workList = await this.common.postUrl('storeHouseBizTF', 'queryStoreHouseList', {});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        toAdd()
        {
            this.$emit('openTab', {
                urlName: '新增作业合同',
                urlId: "workContractInfo-add" + new Date().getTime(),
                urlPathName: "/res",
                urlPath: "/pt/res/workContract/workContractInfo.vue",
                query: {type: 1,tenantId:this.query.tenantId}//0详情 1新增  2修改 3复制
            });
        },
        toUpdate()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let data = selectData[0];
            if (data.verifyState == 1)
            {
                let msg = `
                    <p style="text-align:center;">注：此合同：${data.contractNum}已审核!</p>
                    <p style="text-align:center;">若继续进行此操作，原合同将自动存放于历史合同中，</p>
                    <p style="text-align:center;font-weight:bold;margin-top:10px;">是否继续？</p>
                    `;
                this.$confirm(msg, "修改提示", {
                    center: true,
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true
                }).then(() =>
                {
                    this.$emit('openTab', {
                        urlName: '修改作业合同',
                        urlId: "workContractInfo-update" + data.id,
                        urlPathName: "/res",
                        urlPath: "/pt/res/workContract/workContractInfo.vue",
                        query: {id: data.id, type: 2}//0详情 1新增  2修改 3复制
                    });
                }).catch(() => {})
            }
            else
            {
                this.$emit('openTab', {
                    urlName: '修改作业合同',
                    urlId: "workContractInfo-update" + data.id,
                    urlPathName: "/res",
                    urlPath: "/pt/res/workContract/workContractInfo.vue",
                    query: {id: data.id, type: 2}//0详情 1新增  2修改 3复制
                });
            }
        },
        toCopy()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的数据！");
                return false;
            }
            let id = selectData[0].id;
            this.$emit('openTab', {
                urlName: '复制作业合同',
                urlId: "workContractInfo-copy" + id + new Date().getTime(),
                urlPathName: "/res",
                urlPath: "/pt/res/workContract/workContractInfo.vue",
                query: {id, type: 3}
            });
        },
        dblclickItem(item)
        {
            let id = item.id;
            this.$emit('openTab', {
                urlName: '作业合同详情',
                urlId: 'workContractInfo-detail' + id,
                urlPathName: "/res",
                urlPath: "/pt/res/workContract/workContractInfoMain.vue",
                query: {
                    id: id,
                    type: 0,
                    logId: id,
                    logType: enumData.LOG_TYPE.WORK_CONTRACT,
                }//0详情 1新增  2修改 3复制
            });
        },
        toDel()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            if (selectData[0].verifyState != 0)
            {
                this.$message.error("只有未审核的数据才可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>
            {
                this.common.postUrl("workContractService", "deleteWorkContractById", selectData[0], function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("删除成功!");
                });
            }).catch(() => {})
        },
        async verify()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审核的数据！");
                return false;
            }
            if (selectData[0].verifyState != 0)
            {
                this.$message.error("只有未审核的数据才可以确认！");
                return false;
            }
            let that = this;
            let param = this.common.copyObj(selectData[0]);
            this.$prompt("您正在操作审核，是否继续?", "提示", {
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '审核备注',
                beforeClose: async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.type = 1;
                        await this.common.postUrl("workContractService", "verifyWorkContractById", param);
                        this.$message.success("审核成功！");
                        that.doQuery(that.query);
                    }
                    else if (action === 'cancel')
                    {
                        param.type = 2;
                        await this.common.postUrl("workContractService", "verifyWorkContractById", param);
                        this.$message.success("审核成功！");
                        that.doQuery(that.query);
                    }
                    done();
                }
            });
        },
        costCompare()
        {
            this.$emit('openTab', {
                urlName: '成本对比',
                urlId: 'supplierWmsWorkContractDetailManage',
                urlPathName: "/wms",
                urlPath: "/pt/res/workContract/supplierWmsWorkContractDetailManage.vue",
                query: {}
            });
        },
        downloadPdf(type)
        {
            let fileName = '供应商仓储作业合同.pdf';
            let param = {};
            let array = this.$refs.table.getSelectItem();
            if (array.length < 1)
            {
                this.$message.error("请选择一条数据");
                return false;
            }
            let ids = [];
            if (type == 2)
            {
                fileName = '供应商仓储作业合同.xlsx';
            }
            for (let i = 0; i < array.length; i++)
            {
                if (array[i].verifyState != 1)
                {
                    this.$message.error("未审核通过不能导出");
                    return false;
                }
                ids.push(array[i].id);
            }
            if (array.length > 1)
            {
                param.ids = ids;
                param.fileSubName = 'zip';
            }
            param.id = array[0].id;
            param.type = type;
            param.selfCreateUrl = 'workContractService|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'supplierWmsWorkContractManageTable');
        },
    },
}
