import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";


export default {
    name: 'supplierManage',
    data()
    {
        return {
            head: [
                {"name": "供应商名称", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "供应商简称", "code": "abbreviationName", "width": "250", "type": "text"},
                {"name": "供应商类型", "code": "supplierTypeName", "width": "90", "type": "text"},
                {"name": "可服务区域", "code": "serviceAreasName", "width": "250", "type": "text"},
                {"name": "专线地址数", "code": "lineNum", "width": "90", "type": "text"},
                {"name": "是否启用", "code": "stsName", "width": "90", "type": "diyColorTd"},
                {"name": "供应商联系人", "code": "adminUser", "width": "250", "type": "text"},
                {"name": "登录手机号", "code": "linkPhone", "width": "100", "type": "text"},
                {"name": "Email", "code": "email", "width": "150", "type": "text"},
                {"name": "是否开票", "code": "invoiceFlgName", "width": "90", "type": "text"},
                {"name": "是否仓储供应商", "code": "isStorehouseSupplierName", "width": "90", "type": "text"},
                {"name": "主营业务", "code": "mainBusinessName", "width": "100", "type": "text"},
                {"name": "纳税人识别号/身份证号", "code": "credentialNumber", "width": "200", "type": "text"},
                {"name": "地址", "code": "address", "width": "300", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建部门", "code": "orgName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "120", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核意见", "code": "verifyRemark", "width": "200", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            stsData:[],
            whetherData:[],
            supplierTypeData:[],
            invoiceFlgData:[],
            mainBusinessData:[],
            verifyStateData:[],
            supplier:{},
            uploadOpen : false,
        }
    },
    computed:{
        formData(){
            return [
                {"name":"供应商名称","model":"supplierName","type":"input","isshow":true},
                {"name":"登录手机号","model":"billId","type":"input","isshow":true},
                {"name":"供应商类型","model":"supplierType","type":"select","options":this.supplierTypeData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"是否启用","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"是否仓储供应商","model":"isStorehouseSupplier","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        this.initData();
        this.doQuery(this.query);
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myImport,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        initQuery()
        {
            this.query = {
                supplierName: '',
                billId: '',
                supplierType: '',
                sts: '',
            }
            return this.query;
        },
        /**
         * 列表查询
         */
        async doQuery(query) {
            let {items} = await this.$refs.table.load("supplierTF", "querySupplierList", query);
            items.forEach((el) => {
                if (el.sts == 0) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        uploadSuccess()
        {
            this.doQuery();
            this.uploadOpen=false;
            this.$message.success("导入成功！");
        },
        /**
         * 初始化数据
         */
        async initData(){
            this.stsData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STS"});
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.supplierTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SUPPLIER_TYPE"});
            this.invoiceFlgData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICE_FLG"});
            this.mainBusinessData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "MAIN_BUSINESS"});
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
        },
        /**
         *
         * @param data
         */
        dblclickItem(data)
        {
            let hasAuth = false;
            localStorage.getItem("entityIds").split(",").forEach(item =>
            {
                if (item==1002009)
                    hasAuth = true;
            });
            if (!hasAuth)
            {
                this.$message.error("您没有查看供应商详情权限,请联系上级授权！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'supplierDetail' + data.tenantId,
                query: {
                    tenantId: data.tenantId,
                    supplierType: data.supplierType,
                    supplierName: data.supplierName,
                    pId: 1002006,
                    invoiceFlg: data.invoiceFlg,
                    unShowCheck: 1,
                    logId: data.id,
                    logType: enumData.LOG_TYPE.SUPPLIER,
                },
                urlName: this.common.isBlank(data.abbreviationName) ? "供应商详情" : data.abbreviationName + "-供应商详情",
                urlPathName: "/sp",
                urlPath: "/pt/sp/supplierDetailMain.vue"});
        },
        /**
         * 修改
         * @returns {boolean}
         */
        toUpdatePage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要修改的供应商！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'updateSupplier' + selectData[0].tenantId,
                query: {supplierId: selectData[0].tenantId,unShowCheck: 1,type:1},
                urlName: "修改供应商",
                urlPathName: "/sp",
                urlPath: "/pt/sp/updateSupplier.vue"});
        },
        /**
         * 更新
         * @param state
         * @returns {boolean}
         */
        updateSupplierState(){
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length == 0) {
                this.$message.error("请至少选择一条供应商信息");
                return false;
            }
            let tenantIds = '';
            let supplierName = '';
            for (let i = 0; i < array.length; i++) {
                tenantIds+=','+array[i].tenantId;
                supplierName+=','+array[i].supplierName;
            }
            tenantIds = tenantIds.substr(1);
            supplierName = supplierName.substr(1);
            let info = '';
            let state = 1;
            if(array[0].sts ==1){
                info = '禁用';
                state = 0;
            }else if(array[0].sts ==0){
                info = '启用';
                state = 1;
            }
            this.common.postUrl("supplierTF", 'updateSupplierState', {tenantIds,state,supplierName}, function (data) {
                if(data){
                    that.doQuery();
                    that.$message.success(info+"成功！");
                }
            },null,'',true);
        },
        verifySupplier(){
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条供应商信息");
                return false;
            }
            if(array[0].verifyState!=0){
                this.$message.error("该供应商不是待审核的状态，不能审核！");
                return false;
            }
            // if(array[0].orgId!=this.common.userInfo().orgId){
            //     this.$message.error("您没有权限审核该供应商！");
            //     return false;
            // }
            this.$emit("openTab",{
                urlId: 'verifySupplier' + array[0].tenantId,
                query: {supplierId: array[0].tenantId,unShowCheck: 1,type:2},
                urlName: "审核供应商",
                urlPathName: "/verify",
                urlPath: "/pt/sp/updateSupplier.vue"});
        },
        /**
         * 导出
         */
        download(){
            this.$refs.table.downloadExcelFile('供应商列表');
        },
    },
}
