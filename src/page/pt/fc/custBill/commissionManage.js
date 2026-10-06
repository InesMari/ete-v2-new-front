import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'commissionManage',
    data()
    {
        return {
            head: [
                {"name": "提成年月", "code": "month", "width": "150", "type": "text"},
                {"name": "季度", "code": "quarterName", "width": "120", "type": "text"},
                {"name": "部门", "code": "orgName", "width": "280", "type": "text"},
                {"name": "人员", "code": "userName", "width": "150", "type": "text"},
                {"name": "发放状态", "code": "payStateName", "width": "120", "type": "text"},
                {"name": "利润达标", "code": "profitStateName", "width": "120", "type": "text"},
                {"name": "计提金额", "code": "commission", "width": "120", "type": "text"},
                {"name": "发放金额", "code": "payCommission", "width": "120", "type": "text"},
                {"name": "创建日期", "code": "createDate", "width": "150", "type": "text"},
                // {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
            ],
            query: this.initQuery(),
            quarterData: [],//
            payStateData:[],
        }
    },
    mounted()
    {
        this.doQuery();
        this.init();
    },
    components: {
        tableCommon,
        searchList,
    },
    methods:
    {
        async init()
        {
            let that = this;
            this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'QUARTER,PAY_STATE'}, function (data)
            {
                that.quarterData = data.QUARTER;
                that.payStateData = data.PAY_STATE;
            });
        },
        initQuery()
        {
            return this.query = {

            };
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query) {
            this.query=query;
            await this.$refs.table.load("commissionService", "queryCommissionPage", this.query);
        },
        /**
         * 利润达标
         */
        changeProfitState()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请至少选择一条提成信息！");
                return;
            }
            let array = [];
            for (let i = 0; i < selectData.length; i++)
            {
                let item = selectData[i];
                if (item.profitState != null)
                {
                    this.$message.error("第" + (i + 1) + "条提成已处理利润达标");
                    return;
                }
                if (item.payState != 0)
                {
                    this.$message.error("第" + (i + 1) + "条提成已发放登记");
                    return;
                }
                array.push(item.id);
            }
            let param = {
                ids: array.join(","),
            }
            let that = this;

            that.$confirm("您正在利润达标登记，是否继续?", "利润达标",{
                confirmButtonText: '达标',
                cancelButtonText: '未达标',
                type: 'warning',
                center: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true
            }).then(async ({value}) =>{
                param.type = 1;
                that.common.postUrl("commissionService", "changeProfitState", param, function (data)
                {
                    that.$message.success("利润达标登记成功！");
                    that.doQuery();
                },null,'',true);
            }).catch(async action =>{
                if ( action === 'cancel')
                {
                    param.type = 0;
                    that.common.postUrl("commissionService", "changeProfitState", param, function (data)
                    {
                        that.$message.success("利润达标登记成功！");
                        that.doQuery();
                    },null,'',true);
                }
            });
        },
        payRegistration()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请至少选择一条提成信息！");
                return;
            }
            let array = [];
            for (let i = 0; i < selectData.length; i++)
            {
                let item = selectData[i];
                if (!item.profitState)
                {
                    this.$message.error("第" + (i + 1) + "条提成未达标");
                    return;
                }
                if (item.payState != 0)
                {
                    this.$message.error("第" + (i + 1) + "条提成已发放登记");
                    return;
                }
                array.push(item.id);
            }
            let param = {
                ids: array.join(","),
            }
            let that = this;
            that.$confirm("确认进行发放登记？", "提示").then(() =>{
                that.common.postUrl("commissionService", "payRegistration", param, function (data)
                {
                    that.$message.success("发放登记成功！");
                    that.doQuery();
                },null,'',true);
            }).catch(() =>{});
        },
        download(){
            this.$refs.table.downloadExcelFile('提成列表');
        },
        toDtlManage(data){
            this.$emit('openTab', {
                urlName: '提成明细',
                urlId: 'commissionDtlManage_' + data.id,
                urlPathName: "/commissionDtlManage",
                urlPath: "/pt/fc/custBill/commissionDtlManage.vue",
                query: {mainId: data.id},
            });
        }
    },
    computed:{
        formData(){
            return [
                {"name":"提成年月","model":"month","type":"month","method":"doQuery","isshow":true},
                {"name":"季度","model":"quarter","type":"select","options":this.quarterData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"部门","model":"orgName","type":"input","placeholder":"部门","isshow":true},
                {"name":"人员","model":"userName","type":"input","placeholder":"人员","isshow":true},
                {"name":"发放状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
