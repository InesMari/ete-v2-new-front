import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'fixPersonCostManage',
    data()
    {
        return {
            head: [
                {"name": "核算月份", "code": "billMonth", "width": "150", "type": "text"},
                {"name": "部门名称", "code": "orgName", "width": "250", "type": "text"},
                {"name": "人数", "code": "personCount", "width": "100", "type": "text"},
                {"name": "工资应付", "code": "personCost", "width": "150", "type": "text"},
                {"name": "社保公积金人数", "code": "socialPersonCount", "width": "150", "type": "text"},
                {"name": "社保公积金", "code": "socialPersonCost", "width": "150", "type": "text"},
                {"name": "合计人员成本", "code": "totalCost", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(this.$route.query),
            supplierData: [],
            orgData: [],
            showDialog: false,
            isOnlySee: false,
            title: "新增固定人员成本",
            info: this.initInfo(),
            uploadOpen:false,
            param: {type: 1},
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
                tenantId: null,
                billMonth: null,
                orgId: null,
                personCount: null,
                personCost: null,
                socialPersonCount: null,
                socialPersonCost: null,
                totalCost: 0,
                remark: null,
            }
        },
        initQuery(query)
        {
            return this.query = {
                ids: query.ids,
                billMonth: query ? query.billMonth : null,
                tenantName: '',
                orgName: '',
                workId: query ? (query.workId ? parseInt(query.workId) : null) : null,
            };
        },
        async initStaticData()
        {
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        doQuery()
        {
            this.query.type = 1;//固定成本
            this.$refs.table.load("wmsPersonCostService", "queryFixWmsPersonCostPage", this.query);
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
                    this.title = "新增固定人员成本";
                    this.isOnlySee = false;
                }
                if (type == 2)
                {
                    this.title = "修改固定人员成本";
                    this.isOnlySee = false;
                }
                if (type == 4)
                {
                    this.title = "查看固定人员成本";
                    this.isOnlySee = true;
                }
            }
            this.showDialog = flag;
        },
        dblclickItem(data)
        {
            this.openDialog(true, 4, data);
        },
        calc()
        {
            let personCost = this.info.personCost;
            let socialPersonCost = this.info.socialPersonCost;
            if (this.common.isBlank(personCost) || isNaN(personCost))
            {
                personCost = 0;
            }
            if (this.common.isBlank(socialPersonCost) || isNaN(socialPersonCost))
            {
                socialPersonCost = 0;
            }
            this.info.totalCost = this.common.accAdd(personCost, socialPersonCost);
        },
        async savePersonCost()
        {
            if (this.common.isBlank(this.info.billMonth))
            {
                this.$message.error("请选择核算月份！");
                return;
            }
            if (this.common.isBlank(this.info.orgId))
            {
                this.$message.error("请选择部门名称！");
                return;
            }
            if (this.common.isBlank(this.info.personCount))
            {
                this.$message.error("请输入人数！");
                return;
            }
            if (this.common.isBlank(this.info.personCost))
            {
                this.$message.error("请输入固定人员成本！");
                return;
            }
            if (this.common.isBlank(this.info.socialPersonCount))
            {
                this.$message.error("请输入社保公积金人数！");
                return;
            }
            if (this.common.isBlank(this.info.socialPersonCost))
            {
                this.$message.error("请输入社保公积金！");
                return;
            }
            await this.common.postUrl("wmsPersonCostService", "saveOrUpdateWmsFixPersonCost", this.info, null, null, '', true);
            this.doQuery();
            this.openDialog(false);
            this.$message.success(this.info.id > 0 ? "修改成功!" : "新增成功!");
        },
        deleteWmsPersonCost()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1)
            {
                this.$message.error("请选择至少一条需要删除的数据!");
                return;
            }
            let ids = "";
            for (let i = 0; i < selectData.length; i++)
            {
                ids += "," + selectData[i].id;
            }

            let that = this;
            that.$confirm("确认需要删除？", "提示").then(() =>
            {
                that.common.postUrl("wmsPersonCostService", "deleteWmsPersonCost", {ids: ids}, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                }, null, '', true);
            }).catch(() =>
            {
            });
        },
        handlesuccess()
        {
            this.doQuery();
            this.uploadOpen = false;
        },
        importWmsPersonCost()
        {
            this.uploadOpen = true;
        },
        exportWmsPersonCost()
        {
            this.$refs.table.downloadExcelFile();
        },
    },
}
