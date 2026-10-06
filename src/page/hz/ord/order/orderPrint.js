import lodopUtil from "@/utils/lodop/lodop-business.js"
export default {
    name: 'orderPrint',
    data() {
        return {
            userName:this.common.userInfo().userName,
            printDate:this.common.formatDate.getDateTime(),
            order:{},
            goodsList:[],
            workList:[]
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadOrderInfo();
    },
    /**
     * 组件
     */
    components: {
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 加载订单数据
         */
        async loadOrderInfo()
        {
            let data = await this.common.postUrl("orderTF", "queryOrderInfo",
                {orderId: this.$route.query.orderId, isLoadDispatchList : true, isLoadCost : false, isLoadchangeList: false, isLoadMakeupList: false},
                null, null, null, true);
            /** 订单信息 **/
            this.order = data.order;
            /** 订单作业点信息 **/
            this.workList = data.workList;
            for (let i = 0; i < this.workList.length; i++) {
                if(this.workList[i].workType=='1'){
                    this.workList.splice(i,1);
                    i--;
                }
            }
            /** 订单货物信息 **/
            this.goodsList = data.goodsList;
            /** 订单派车明细信息 **/
            this.dispatchList = data.dispatchList;
        },
        print(){
            lodopUtil.printTableInfo("printTable", "打印托运单");
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id)
        },
    },
}
