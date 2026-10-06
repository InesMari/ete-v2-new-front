import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'applicationManage',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "应用名称", "code": "name", "width": "150", "type": "text"},
                {"name": "appId", "code": "appId", "width": "150", "type": "text"},
                {"name": "appSecretKey", "code": "appSecretKey", "width": "250", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            query: this.initQuery(),
            customerData: [],
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
            this.$refs.table.load("applicationService", "queryApplicationPage", this.query);
        },
        /**
         * 初始化数据
         */
        async initData()
        {
            this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {
                sts: enumData.STS.VALID, isHasAdminUser: 1});
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
                this.$message.error("请选择一个需要修改的应用！");
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
        async saveOrUpdateApplication()
        {

            let data = await this.common.postUrl("applicationService", "saveOrUpdateApplication", this.info);
            if (data)
            {
                this.$message.success("提交成功");
                this.openDialog(false);
                this.doQuery();
            }
        },
        deleteApplication()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一个需要删除的应用！");
                return false;
            }
            let that = this;
            that.$confirm("确认删除这个应用", "提示").then(() =>
            {
                that.common.postUrl("applicationService", "deleteApplication", {id: selectData[0].id}, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                }, null, '', true);
            }).catch(() => {});
        },


    },
}
