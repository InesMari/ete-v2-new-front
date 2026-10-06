import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'fcBudgetSalesManage',
    data()
    {
        return {
            head: [
                {"name": "预算营收名称", "code": "name", "width": "180", "type": "text"},
                {"name": "预算年度", "code": "year", "width": "100", "type": "text"},
                {"name": "预算合计金额", "code": "totalFee", "width": "100", "type": "text"},
                {"name": "生效状态", "code": "stsName", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUser", "width": "150", "type": "text"},
                {"name": "创建日期", "code": "createDate", "width": "150", "type": "text"},
                {"name": "审核状态", "code": "verifyStsName", "width": "100", "type": "text"},
                {"name": "审核不通过原因", "code": "verifyRemark", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUser", "width": "150", "type": "text"},
                {"name": "审核日期", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
            ],
            loadParam: {
                name:'',
                year:'',
                sts:['0','1'],
            },
            stsData:[],
            baseInfo:{},
            impFlag:false,
        }
    },
    async mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList,
        myImport
    },
    methods: {
        clearFn(){
            this.loadParam={
                name:'',
                year:'',
                sts:['0','1'],
            };
        },
        /**
         * 初始化数据
         */
        async initData(){
            let that = this;

            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"BUDGET_STS"}, function (data) {
                that.stsData = data;
            });
        },
        toAdd(){
            this.$emit('openTab', {
                urlName: '新增预算营收',
                urlId: 'addFcBudgetSales'+new Date().getTime(),
                urlPathName: "/fcBudgetSalesDetail",
                urlPath: "/pt/dataReport/sales/budget/fcBudgetSalesDetail.vue",
                query:{type:1}
            });
        },
        toUpdate(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            if(selectData[0].verifySts==1){
                this.$msgbox({
                    title: "修改数据",
                    message: '该数据已经审核通过，确定要修改？',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning",
                }).then(() => {
                    this.$emit('openTab', {
                        urlName: '修改预算营收',
                        urlId: 'updateFcBudgetSales'+new Date().getTime(),
                        urlPathName: "/fcBudgetSalesDetail",
                        urlPath: "/pt/dataReport/sales/budget/fcBudgetSalesDetail.vue",
                        query:{type:2,id:selectData[0].id}
                    });
                }).catch(() => {
                });
            }else{
                this.$emit('openTab', {
                    urlName: '修改预算营收',
                    urlId: 'updateFcBudgetSales'+new Date().getTime(),
                    urlPathName: "/fcBudgetSalesDetail",
                    urlPath: "/pt/dataReport/sales/budget/fcBudgetSalesDetail.vue",
                    query:{type:2,id:selectData[0].id}
                });
            }
        },
        toCopy(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的数据！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '复制预算营收',
                urlId: 'copyFcBudgetSales'+new Date().getTime(),
                urlPathName: "/fcBudgetSalesDetail",
                urlPath: "/pt/dataReport/sales/budget/fcBudgetSalesDetail.vue",
                query:{type:4,id:selectData[0].id}
            });
        },
        toDel(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            if(selectData[0].verifySts==1){
                this.$message.error("已经审核通过的数据不允许删除！");
                return false;
            }
            if(selectData[0].sts==1){
                this.$message.error("已经生效的数据不允许删除！");
                return false;
            }
            let that = this;
            this.common.postUrl("fcBudgetSalesTF", "delFcBudgetSalesInfo", {id:selectData[0].id,name:selectData[0].name},function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.$message.success("删除成功");
                }
            },null,'',true);
        },
        toView(item){
            this.$emit('openTab', {
                urlName: '查看预算营收',
                urlId: 'viewFcBudgetSales'+new Date().getTime(),
                urlPathName: "/fcBudgetSalesDetail",
                urlPath: "/pt/dataReport/sales/budget/fcBudgetSalesDetail.vue",
                query:{type:3,id:item.id}
            });
        },
        toVerify(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审核的数据！");
                return false;
            }
            if(selectData[0].verifySts==1){
                this.$message.error("已经审核通过的数据不允许审核！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '审核预算营收',
                urlId: 'verifyFcBudgetSales'+new Date().getTime(),
                urlPathName: "/fcBudgetSalesDetail",
                urlPath: "/pt/dataReport/sales/budget/fcBudgetSalesDetail.vue",
                query:{type:5,id:selectData[0].id}
            });

        },
        downloadExcel(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要导出的数据！");
                return false;
            }
            let fileName = selectData[0].name;
            let param = {};
            param.id = selectData[0].id;
            param.selfCreateUrl = 'fcBudgetSalesTF|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'fcBudgetSalesManageTable');
            this.closeDownload();
        },
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            await this.$refs.table.load("fcBudgetSalesTF", "queryFcBudgetSalesPage", this.loadParam);
        },
        showImp(flag) {
            if (flag) {
                this.baseInfo={};
                this.baseInfo.year = this.common.formatTime(new Date(),'yyyy');
                this.initName(this.baseInfo.year);
            }
            this.$forceUpdate();
            this.impFlag=flag;
        },
        initName(year){
            this.baseInfo.name = '年度营收预算表-'+year;
            this.$forceUpdate();
        },
        myImportSuccessCallback(){
            this.doQuery();
            this.showImp(false);
            this.$message.success("导入成功！");
        },
        impAdd(){
            if(this.common.isBlank(this.baseInfo.name)){
                this.$message.error("预算营收名称不能为空！");
                return;
            }
            if(this.common.isBlank(this.baseInfo.year)){
                this.$message.error("预算年度不能为空！");
                return;
            }
            this.$refs.myImport.submitFileForm();
        }
    },
    computed:{
        formData(){
            return [
                {"name":"预算营收名称","placeholder":"预算营收名称","model":"name","type":"input","isshow":true},
                {"name":"预算年度","placeholder":"预算年度","model":"year","type":"year","isshow":true},
                {"name":"生效状态","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","clearable":true,"multiple":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
