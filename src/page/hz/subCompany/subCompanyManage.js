import tableCommon from "@/components/table/tableCommon.vue";
import authRoleTree from "@/components/auth/authRoleTree.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import dbTable from "@/components/dbTable/dbTable.vue"
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'subCompanyManage',
    data()
    {
        return {
            head: [
                {"name": "子公司名称", "code": "name", "width": "150", "type": "text"},
                {"name": "线路数", "code": "lineNum", "width": "120", "type": "text"},
                {"name": "管理员", "code": "adminUser", "width": "60", "type": "text"},
                {"name": "手机号", "code": "linkPhone", "width": "80", "type": "text"},
                {"name": "附件", "code": "", "width": "120", "type": "diy"}
            ],
            dbTablehead:[
                {"name": "线路名称", "code": "routeName", "width": "25%", "type": "text"},
                {"name": "起始点", "code": "beginWorkName", "width": "20%", "type": "text"},
                {"name": "终点", "code": "endWorkName", "width": "20%", "type": "text"},
                {"name": "备注", "code": "remarks", "width": "30%", "type": "text"},
            ],
            query:{
                custName: '',
            },
            dbTableQuery: this.dbTableClear(),
            stsData:[],
            showDistributionRoutePage: false,
            showEntityPage: false,
            showDialog: false,
            dialogTitle:'公司资料',
            customer:{
                custName:'',
                address:'',
                linkman:'',
                linkPhone:'',
                regionId:'',
                orgId:'',
                custManage:'',
                invoiceTypeName:'',
                invoiceType:'',
                taxNumber:'',
                regAddress:'',
                regPhone:'',
                regBank:'',
                accountName:'',
                regAccount:'',
                businessLicenseImg:'',
                businessLicenseImgPath:'',
                invoiceInfoImg:'',
                invoiceInfoImgPath:'',
            },
            srcList: []
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.query.parentId = this.common.userInfo().tenantId;
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        myFileModel,
        tableCommon,
        authRoleTree,
        fileViewer
    },
    /**
     * 绑定函数
     */
    methods: {

        /**
         * 子公司列表查询
         */
        doQuery()
        {
            this.$refs.table.load("customerTF", "queryCustomerList", this.query);
        },
        /**
         * 初始化数据
         */
        initData(){
            let that = this;
            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"STS"}, function (data) {
                that.stsData = data;
                that.stsData.unshift({codeValue:'',codeName:''});
            });
        },
        /**
         * 清空
         */
        clear(){
            this.query={
                custName: '',
            };
        },
        dbTableClear()
        {
            this.dbTableQuery = {tenantId: '', routeName: '', beginWorkNameOrEndWorkName: '', sts: ''};
            return this.dbTableQuery;
        },
        /**
         * 是否展示权限页
         * @param flag 开关展示
         */
        isShowEntityPage(flag)
        {
            this.showEntityPage = flag;
        },
        /**
         * 是否展示分配线路页
         * @param flag 开关展示
         */
        isShowDistributionRoutePage(flag)
        {
            this.showDistributionRoutePage = flag;
        },
        /**
         * 加载权限实体树
         */
        loadEntityTree()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条子公司信息~");
                return false;
            }
            this.$refs.authRoleTree.loadEntityTree({roleId: array[0].roleId,isPT: 1}, false, 2);
            this.isShowEntityPage(true);
        },
        /**
         * 打开分配线路
         * @returns {boolean}
         */
        toDistributionRoutePage()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条子公司信息~");
                return false;
            }
            let that = this;
            this.dbTableQuery.tenantId = this.common.userInfo().tenantId;
            this.common.postUrl("routeTF", "loadRouteTenantData", array[0],function (data)
            {
                that.$refs.dbTable.setRightData(data);
            });
            this.loadRouteDataByTenantId();
            this.isShowDistributionRoutePage(true);
        },
        /**
         * 显示子公司信息
         */
        displayDialog(){
            this.customer={
                custName:'',
                address:'',
                linkman:'',
                linkPhone:'',
                regionId:'',
                orgId:'',
                custManage:'',
                invoiceTypeName:'',
                invoiceType:'',
                taxNumber:'',
                regAddress:'',
                regPhone:'',
                regBank:'',
                accountName:'',
                regAccount:'',
                businessLicenseImg:'',
                businessLicenseImgPath:'',
                invoiceInfoImg:'',
                invoiceInfoImgPath:'',
            };
            this.dialogTitle = '公司资料';
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条子公司信息");
                return false;
            }
            let tenantId = array[0].tenantId;
            let that = this;
            this.common.postUrl("customerTF", 'getCustomerDetailInfo', {tenantId,parentId:this.query.parentId}, function (data) {
                if(data){
                    that.customer = data;
                    if(that.customer.businessLicenseImg){
                        that.$refs.businessLicense.initDate(that.customer.businessLicenseImg);
                    }
                    if(that.customer.invoiceInfoImg){
                        that.$refs.invoiceInfo.initDate(that.customer.invoiceInfoImg);
                    }
                }
            });
            this.showDialog = true;
        },
        /**
         * 关闭新增客户弹出框
         */
        closeDialog(){
            this.showDialog = false;
            this.$refs.businessLicense.clean();
            this.$refs.invoiceInfo.clean();
        },

        /**
         * 显示营业资料
         * @param data
         */
        showBusinessLicense(data){
            this.srcList=[];
            this.srcList.push(data.businessLicenseImgUrl);
            this.$refs.viewer.show();

        },
        /**
         * 显示开票资料
         * @param data
         */
        showInvoiceInfo(data){
            this.srcList=[];
            this.srcList.push(data.invoiceInfoImgUrl);
            this.$refs.viewer.show();
        },

        /**
         * 加载线路
         */
        loadRouteDataByTenantId()
        {
            this.$refs.dbTable.load("routeTF", "loadRouteDataByTenantId", this.dbTableQuery);
        },
        /**
         * 取消
         */
        dbTableCancel()
        {
            this.isShowDistributionRoutePage(false);
        },
        /**
         * 授权子公司线路
         */
        submit()
        {
            let selectData = this.$refs.dbTable.getRightData()
            if (selectData.length <= 0)
            {
                this.$message.error("请选择需要分配的线路再提交！");
                return false;
            }
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一个子公司再分配！");
                return false;
            }
            let form = array[0];
            form.routes = selectData;
            this.common.postUrl("routeTF", "saveOrUpdateRouteTenantRel", form, function (data) {
                if (data)
                {
                    that.isShowDistributionRoutePage(false);
                    that.doQuery();
                    that.$message.success("线路分配成功！");
                }
            });
        },
        toDownload(){
            this.$refs.table.downloadExcelFile();
        }
    },
}
