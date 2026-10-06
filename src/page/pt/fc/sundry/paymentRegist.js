import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'paymentRegist',
    props: ['costBillIds','showPaymentRegistDialog'],
    data()
    {
        return {
            showDialog: false,
            costBillList:[],
            totalCost: 0,
            paySts: 0,
            query: {
                billType: this.$route.query.t,
                costType: '1',
                ids: '',
            },
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
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

        /**
         * 付款登记查询列表
         */
        doQuery(){
            let that = this;
            that.totalCost = 0;
            that.query.ids = that.costBillIds;
            this.common.postUrl("fcPrjSundryFeeBillBizTF", "queryFcPrjSundryFeeBillList", that.query, function (data) {
                if(data){
                    that.costBillList = data;
                    for (let i = 0; i < that.costBillList.length; i++) {
                        that.totalCost = that.common.accAdd(that.totalCost, that.costBillList[i].feeAmount);
                        that.paySts = that.costBillList[i].paySts;
                    }
                }
            });
        },

        /**
         * 提交付款登记
         */
        async save(type) {
            let that = this;
            let method = 'savePaymentRegist';
            let param = {'costBillList': this.costBillList , 'opFlag': type};
            if (type == 'rev') {
                await this.$confirm('确定要撤销此条付款登记信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
            }
            this.common.postUrl("fcPrjSundryFeeBillBizTF", method, param, function (data) {
                if (data) {
                    let msg = type == 'rev' ? "撤销" : "登记";
                    that.$msgbox(msg + "成功！");
                    that.closePaymentRegistDialog();
                }
            }, null, '', true);
        },
        /**
         * 清空
         */
        clear(){

        },

        /**
         * 关闭
         */
        closePaymentRegistDialog() {
            this.showPaymentRegistDialog.value = false;
            this.$emit('refreshData');
        },


    },
}
