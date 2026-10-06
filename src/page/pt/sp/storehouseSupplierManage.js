import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'storehouseSupplierManage',
    data()
    {
        return {
            head: [
                {"name": "供应商名称", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "供应商简称", "code": "abbreviationName", "width": "250", "type": "text"},
                {"name": "供应商类型", "code": "supplierTypeName", "width": "90", "type": "text"},
                {"name": "可服务区域", "code": "serviceAreasName", "width": "300", "type": "text"},
                {"name": "服务物流中心", "code": "workNames", "width": "300", "type": "text"},
                // {"name": "专线地址数", "code": "lineNum", "width": "90", "type": "text"},
                {"name": "供应商联系人", "code": "adminUser", "width": "250", "type": "text"},
                {"name": "登录手机号", "code": "linkPhone", "width": "100", "type": "text"},
                {"name": "Email", "code": "email", "width": "150", "type": "text"},
                {"name": "是否开票", "code": "invoiceFlgName", "width": "90", "type": "text"},
                {"name": "主营业务", "code": "mainBusinessName", "width": "100", "type": "text"},
                {"name": "纳税人识别号/身份证号", "code": "credentialNumber", "width": "200", "type": "text"},
                {"name": "地址", "code": "address", "width": "300", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
            ],
            query: this.initQuery(),
            stsData:[],
            whetherData:[],
            supplierTypeData:[],
            invoiceFlgData:[],
            mainBusinessData:[],
            supplier: this.initSupplier(),
            showUpdate: false,
            title: '修改',
            serviceAreasData: [],//
            workList:[],
        }
    },
    computed:{
        formData(){
            return [
                {"name":"供应商名称","model":"supplierName","type":"input","isshow":true},
                {"name":"登录手机号","model":"billId","type":"input","isshow":true},
                {"name":"供应商类型","model":"supplierType","type":"select","options":this.supplierTypeData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"服务物流中心","model":"workId","type":"select","options":this.workList,"label":"workName","value":"workId","method":"doQuery","isshow":true},
                // {"name":"是否启用","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                // {"name":"是否仓储供应商","model":"isStorehouseSupplier","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        if (this.$route.query.workId){
            this.query.workId = parseInt(this.$route.query.workId);
        }
        this.doQuery(this.query);
        this.initData();
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
            return this.query = {
                supplierName: '',
                billId: '',
                supplierType: '',
                sts: '',
                isStorehouseSupplier: '1',
                workId: null,
            }
        },
        initSupplier()
        {
            return this.supplier = {
                id: null,
                supplierName: '',
                billId: '',
                supplierType: '',
                sts: '',
                isStorehouseSupplier: '1',
                abbreviationName: null,
                supplierTypeName: null,
                adminUser: null,
                serviceAreas: [],
            }
        },
        /**
         * 列表查询
         */
        async doQuery(query = {}) {
            query.isStorehouseSupplier = 1;
            let {items} = await this.$refs.table.load("supplierTF", "querySupplierList", query);
            items.forEach((el) => {
                if (el.sts == 0) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
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
            this.serviceAreasData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SERVICE_AREAS"});
            // 仓库
            this.workList = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        dblclickItem(data)
        {
            let hasAuth = false;
            localStorage.getItem("entityIds").split(",").forEach(item =>
            {
                if (item == 1002006)
                    hasAuth = true;
            });
            if (!hasAuth)
            {
                this.$message.error("您没有查看供应商详情权限,请联系上级授权！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'storehouseSupplierDetail' + data.tenantId,
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
                urlPath: "/pt/sp/storehouseSupplierDetailMain.vue"});
        },
        /**
         * 修改
         * @returns {boolean}
         */
        openDialog(flag)
        {
            this.initSupplier();
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if(selectData.length !== 1)
                {
                    this.$message.error("请选择一个需要修改的供应商！");
                    return false;
                }
                this.supplier = this.common.copyObj(selectData[0]);
                if (this.common.isNotBlank(this.supplier.serviceAreas))
                {
                    this.supplier.serviceAreas = this.supplier.serviceAreas.split(",");
                }
                if (this.common.isNotBlank(this.supplier.workIds))
                {
                    let workIds = this.supplier.workIds.split(",");
                    this.supplier.workIds = workIds.map(Number);
                }
            }
            this.showUpdate = flag;
            this.$forceUpdate();
        },
        updateSupplierData()
        {
            if (this.common.isBlank(this.supplier.id))
            {
                this.$message.error("请重新选择供应商数据");
                return false;
            }
            if (this.common.isBlank(this.supplier.serviceAreas) || this.supplier.serviceAreas.length == 0)
            {
                this.$message.error("可服务区域不能为空！");
                return false;
            }
            let that = this;
            this.common.postUrl("supplierTF", "updateSupplierDataById", this.supplier, function (data)
            {
                that.$message.success("修改成功！");
                that.openDialog(false);
                that.doQuery();
            }, null, '', true);
        },
        download(){
            this.$refs.table.downloadExcelFile('仓储供应商列表');
        },
    },
}
