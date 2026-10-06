import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'insuranceManage',
    props: [],
    data() {
        return {
            head: [
                {"name": "保险费用编号", "code": "insuranceNum", "width": "180", "type": "text"},
                {"name": "保险合同", "code": "contractNum", "width": "180", "type": "diy"},
                {"name": "合同开始日期", "code": "beginDate", "width": "150", "type": "text"},
                {"name": "合同结束日期", "code": "endDate", "width": "150", "type": "text"},
                {"name": "计费开始月份", "code": "billingStartDate", "width": "120", "type": "text"},
                {"name": "计费结束月份", "code": "billingEndDate", "width": "120", "type": "text"},
                {"name": "计费月份数", "code": "billingMonths", "width": "100", "type": "text"},
                {"name": "保险费（未税）合计", "code": "totalFee", "width": "120", "type": "text"},
                {"name": "税额合计", "code": "totalTax", "width": "100", "type": "text"},
                {"name": "保险费（含税）合计", "code": "totalFeeWithTax", "width": "120", "type": "text"},
                {"name": "月保险费（未税）", "code": "monthFee", "width": "120", "type": "text"},
                {"name": "月保险费（含税）", "code": "monthFeeWithTax", "width": "120", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "100", "type": "text"},
                {"name": "审核意见", "code": "verifyRemark", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "100", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "保险基本条款", "code": "insuranceRemark", "width": "250", "type": "text"},
            ],
            query: {
                insuranceNum: '',
                // year:'',
                month:this.initMonth(),
                verifyState:'',
            },
            verifyStateData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
        this.doQuery();
    },

    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },

    /**
     * 绑定函数
     */
    methods: {
        /**
         *
         */
        doQuery(query = this.query) {
            this.query = query;
            if(this.common.isNotBlank(this.query.month) && this.query.month.length === 2){
                this.query.startMonth = this.query.month[0];
                this.query.endMonth = this.query.month[1];
            }else{
                this.query.startMonth = '';
                this.query.endMonth = '';
            }
            this.$refs.table.load("fcInsuranceTF", "queryInsuranceInfoPage", this.query);
        },
        initMonth(){
            const start = new Date();
            const end = new Date();
            start.setMonth(start.getMonth()-1);
            let time1 = this.common.formatTime(start, "yyyy-MM");
            let time2 = this.common.formatTime(end, "yyyy-MM");
            return [time1,time2];
        },
        /**
         * 初始化数据
         */
        async initData() {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"}, function (data) {
                that.verifyStateData = data;
            });
        },
        toContractDetail(item) {
            let title = "查看保险合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:5,id:item.contractId},
            });
        },
        /**
         * 清空
         */
        clear() {
            this.query =
                {
                    insuranceNum: '',
                    // year:'',
                    month:this.initMonth(),
                    verifyState:'',
                };
        },
        add() {
            this.open({
                query:{type: 1},
                urlId: 'saveInsuranceInfo' + new Date().getTime(),
                urlName: '新增保险费用',
                urlPathName: '/saveInsuranceInfo',
                urlPath: "/pt/fc/accrual/saveInsuranceInfo.vue",
            });
        },
        update(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据修改！");
                return;
            }
            let type = 2;//修改
            if(selectData[0].verifyState==1){
                this.$message.error("已审核数据不能修改！");
                return;
            }
            this.open({
                query:{id:selectData[0].id, type: type},
                urlId: 'saveInsuranceInfo' + selectData[0].id + 2,
                urlName: '修改保险费用',
                urlPathName: '/saveInsuranceInfo',
                urlPath: "/pt/fc/accrual/saveInsuranceInfo.vue",
            });
        },
        dblclickItem(item){
            this.open({
                query:{id:item.id,type:3},
                urlId: 'detailInsuranceInfo' + item.id + 3,
                urlName: '保险费用详情',
                urlPathName: '/detailInsuranceInfo',
                urlPath: "/pt/fc/accrual/saveInsuranceInfo.vue",
            });
        },
        del() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据删除！");
                return;
            }
            if(selectData[0].verifyState==1){
                this.$message.error("已审核数据不能删除！");
                return;
            }
            this.$confirm("你将删除保险费用编号："+selectData[0].insuranceNum+"的保险费用，是否继续？", "提示").then(async () =>{
                await this.common.postUrl("fcInsuranceTF", "deleteInsuranceInfo", selectData[0],
                    null, null, '', true);
                this.$message.success("删除保险费用成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        verify(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据审核！");
                return;
            }
            if(selectData[0].verifyState==1){
                this.$message.error("已审核数据不能审核！");
                return;
            }
            this.open({
                query:{id:selectData[0].id, type: 4},
                urlId: 'verifyInsuranceInfo' + selectData[0].id + 4,
                urlName: '审核费用详情',
                urlPathName: '/verifyInsuranceInfo',
                urlPath: "/pt/fc/accrual/saveInsuranceInfo.vue",
            });
        },
        /**
         * 导出EXCEL
         */
        download() {
            this.$refs.table.downloadExcelFile("保险费用列表");
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },


    },
    computed: {
        formData() {
            return [
                {"name":"费用编号","model":"insuranceNum","type":"input","placeholder":"费用编号","isshow":true},
                // {"name":"保险年份","model":"year","type":"year","isshow":true},
                {"name":"保险月份","model":"month","type":"monthrange","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
            ]
        }
    },
}
