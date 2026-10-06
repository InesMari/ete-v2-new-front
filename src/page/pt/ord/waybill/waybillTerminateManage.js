import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'waybillTerminateManage',
    data() {
        return {
            head: [
                {"name": "供应商", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "180", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "160", "type": "diy"},
                {"name": "出车时间", "code": "startCarDate", "width": "150", "type": "text"},
                {"name": "异常终止成本", "code": "applyFee", "width": "100", "type": "text"},
                {"name": "备注", "code": "terminateRemark", "width": "150", "type": "text"},
                {"name": "申请人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "申请时间", "code": "createDate", "width": "140", "type": "text"},
                {"name": "审核状态", "code": "terminateStateName", "width": "80", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "80", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "140", "type": "text"},
            ],
            loadParam: {
                verifyState:this.$route.query.verifyState,tenantName: this.$route.query.supplierName
            },
            verifyStateOptions:[],
        }
    },

    computed:{
        formData(){
            return [
                {"name":"供应商名称","model":"tenantName","type":"input","isshow":true},
                {"name":"线路名称","model":"routeName","type":"input","isshow":true},
                {"name":"派车单号","model":"waybillNum","type":"input","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateOptions, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
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
        doQuery(query = this.loadParam) {
            this.loadParam = query;
            this.$refs.table.load("ordWaybillTF", "queryOrdWaybillTerminatePage", this.loadParam);
        },

        verifyOrdWaybillFeeCostApply(verifyState){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要审核的异常终止申请！");
                return false;
            }
            if (selectData[0].terminateState == 1||selectData[0].terminateState == 2)
            {
                this.$message.error("申请单已经审核，不能再次操作！");
                return false;
            }
            let that = this;
            let param = this.common.copyObj(selectData[0]);
            param.verifyState = verifyState;
            this.$confirm('你将审核异常终止申请，数据操作不可逆，是否继续？', "提示").then(() =>{
                this.common.postUrl("ordWaybillTF", "verifyOrdWaybillTerminate", param, function (data)
                {
                    that.doQuery();
                    that.$message.success("审核成功！");
                },null,'',true);
            });
        },
        /**
         * 初始化
         */
        init() {
            this.initStaticData();
        },
        //初始化页面的静态数据
        initStaticData(){
            let that = this;
            this.common.postUrl('commonTF','getSysStaticData',{'codeType':'VERIFY_STATE'},function (data) {
                that.verifyStateOptions = data;
            });

        },
        clear() {
            this.loadParam = {};
        },
        /**
         * 打开详情
         * @param data
         * @param isCallParent 是否调用父组件调用
         */
        toWaybillDetail(data)
        {
            if (data.isTransit == 1)
            {
                this.$emit('openTab', {
                    urlName: '查看中转',
                    urlId: 'transitManage' + data.waybillId,
                    urlPathName: "/order",
                    urlPath: "/pt/ord/transit/transitDetailMain",
                    query:{t:3,waybillNum: data.waybillNum, tansitWaybillId: data.waybillId},
                });
            }
            else
            {
                this.$emit("openTab",{
                    urlId: 'waybillDetail' + data.waybillId,
                    query: {waybillId: data.waybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
            }
        },
    },
}
