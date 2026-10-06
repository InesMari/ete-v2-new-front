import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'fcActualSalesManage',
    data()
    {
        return {
            head: [
                {"name": "实际营收名称", "code": "name", "width": "180", "type": "text"},
                {"name": "营收年度", "code": "year", "width": "100", "type": "text"},
                {"name": "营收合计金额", "code": "totalFee", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUser", "width": "150", "type": "text"},
                {"name": "创建日期", "code": "createDate", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
            ],
            loadParam: {
                name:'',
                year:'',
            },
            baseInfo:{},
            impFlag:false,

            isNew:false,
            fcActualSalesData:[],
            monthData:[]

        }
    },
    async mounted()
    {
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
            };
        },
        toAdd(){
            this.$emit('openTab', {
                urlName: '新增实际营收',
                urlId: 'addFcActualSales'+new Date().getTime(),
                urlPathName: "/fcActualSalesDetail",
                urlPath: "/pt/dataReport/sales/actual/fcActualSalesDetail.vue",
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

            this.$emit('openTab', {
                urlName: '修改实际营收',
                urlId: 'updateFcActualSales'+new Date().getTime(),
                urlPathName: "/fcActualSalesDetail",
                urlPath: "/pt/dataReport/sales/actual/fcActualSalesDetail.vue",
                query:{type:2,id:selectData[0].id}
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
            let that = this;
            this.common.postUrl("fcActualSalesTF", "delFcActualSalesInfo", {id:selectData[0].id,name:selectData[0].name},function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.$message.success("删除成功");
                }
            },null,'',true);
        },
        toView(item){
            this.$emit('openTab', {
                urlName: '查看实际营收',
                urlId: 'viewFcActualSales'+new Date().getTime(),
                urlPathName: "/fcActualSalesDetail",
                urlPath: "/pt/dataReport/sales/actual/fcActualSalesDetail.vue",
                query:{type:3,id:item.id}
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
            param.selfCreateUrl = 'fcActualSalesTF|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'fcActualSalesManageTable');
            this.closeDownload();
        },
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            await this.$refs.table.load("fcActualSalesTF", "queryFcActualSalesPage", this.loadParam);
        },
        showImp(flag) {
            if (flag) {
                //
                let that = this;
                //加载静态枚举
                this.common.postUrl("fcActualSalesTF", "queryFcActualSalesList", {}, function (data) {
                    that.fcActualSalesData = data;
                });
                this.monthData=[];
                for (let i = 1; i <=12; i++) {
                    this.monthData.push({value:i,name:i+'月'});
                }
                this.baseInfo={};
                this.isNew =false;
            }
            this.$forceUpdate();
            this.impFlag=flag;
        },
        baseInfoChange(){
            this.monthData=[];
            if(this.baseInfo.id){
                let id = this.baseInfo.id;
                this.baseInfo = this.fcActualSalesData.find(item=>item.id===id);
                // let nowYear = this.common.formatDate.year();
                // let nowMonth = this.common.formatDate.month();
                //
                // if(parseInt(this.baseInfo.year)<nowYear){
                //     if(nowMonth==1){
                //         this.monthData.push({value:12,name:'12月'});
                //     }
                // }else if(parseInt(this.baseInfo.year)==nowYear){
                //     let i = 1;
                //     if(nowMonth-1>0){
                //         i = nowMonth-1;
                //     }
                //     for (; i <=12; i++) {
                //         this.monthData.push({value:i,name:i+'月'});
                //     }
                // }
                for (let i = 1; i <=12; i++) {
                    this.monthData.push({value:i,name:i+'月'});
                }

            }else{
                for (let i = 1; i <=12; i++) {
                    this.monthData.push({value:i,name:i+'月'});
                }
            }
            this.$forceUpdate();
        },
        changeNew(){
          if(this.isNew){
              this.baseInfo = {};
              this.baseInfo.year = this.common.formatTime(new Date(),'yyyy');
              this.initName(this.baseInfo.year);
          }
        },
        initName(year){
            this.baseInfo.name = '年度实际营收表-'+year;
            this.$forceUpdate();
        },
        myImportSuccessCallback(){
            this.doQuery();
            this.showImp(false);
            this.$message.success("导入成功！");
        },
        impAdd(){
            if(this.common.isBlank(this.baseInfo.name)){
                this.$message.error("实际营收名称不能为空！");
                return;
            }
            if(this.common.isBlank(this.baseInfo.year)){
                this.$message.error("营收年度不能为空！");
                return;
            }
            if(this.common.isBlank(this.baseInfo.month)){
                this.$message.error("导入月份不能为空！");
                return;
            }
            this.$refs.myImport.submitFileForm();
        }
    },
    computed:{
        formData(){
            return [
                {"name":"实际营收名称","placeholder":"实际营收名称","model":"name","type":"input","isshow":true},
                {"name":"营收年度","placeholder":"营收年度","model":"year","type":"year","isshow":true},
            ]
        }
    },
}
