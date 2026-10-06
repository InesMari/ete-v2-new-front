import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'interfaceManage',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "接口名称", "code": "name", "width": "150", "type": "text"},
                {"name": "QPS", "code": "qps", "width": "150", "type": "text"},
                {"name": "每日限制", "code": "dailyLimit", "width": "150", "type": "text"},
                {"name": "每月限制", "code": "monthlyLimit", "width": "150", "type": "text"},
                {"name": "总限制", "code": "totalLimit", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            query: this.initQuery(),
            customerData: [],
            interfaceData: [],
            title: '新增',
            showDialog: false,
            info: this.initInfo(),
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        this.doQuery();
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
        initInfo(){
            return this.info = {
                tenantId: this.$route.query.tenantId,
                name: null,
                qps: null,
                dailyLimit: null,
                monthlyLimit: null,
                totalLimit: null,
                remark: null,
            }
        },
        initQuery()
        {
            return this.query = {
                custName: this.$route.query.tenantName
            };
        },
        doQuery()
        {
            this.$refs.table.load("interfaceService", "queryInterfacePage", this.query);
        },
        /**
         * 初始化数据
         */
        async initData()
        {
            this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {
                sts: enumData.STS.VALID, isHasAdminUser: 1});

            this.interfaceData = await this.common.postUrl("interfaceService", "getApplicationExternalInterfaceList", {noShowGetApplicationToken:1});
        },
        openAddDialog()
        {
            this.initInfo();
            this.title = '新增';
            this.openDialog(true);
        },
        openUpdateDialog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一个需要修改的接口！");
                return false;
            }
            this.info = this.common.copyObj(selectData[0]);
            this.info.tenantId = selectData[0].tenantId + "";
            this.title = '修改';
            this.openDialog(true);
        },
        openDialog(flag)
        {
            this.showDialog = flag;
        },
        async saveOrUpdateInterface()
        {

            let data = await this.common.postUrl("interfaceService", "saveOrUpdateInterface", this.info);
            if (data)
            {
                this.$message.success("提交成功");
                this.openDialog(false);
                this.doQuery();
            }
        },
        deleteInterface()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一个需要删除的接口！");
                return false;
            }
            let that = this;
            that.$confirm("确认删除这个接口", "提示").then(() =>
            {
                that.common.postUrl("interfaceService", "deleteInterface", {id: selectData[0].id}, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                }, null, '', true);
            }).catch(() => {});
        },


    },
}
