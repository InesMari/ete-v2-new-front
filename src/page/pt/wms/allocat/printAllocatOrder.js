import lodopUtil from "@/utils/lodop/lodop-business.js"

export default {
    name: 'printAllocatOrder',
    data()
    {
        return {
            userName: this.common.userInfo().userName,
            printDate: this.common.formatDate.getDateTime(),
            info: {
                tenantCode: '',
                tenantName: '',
                fromTenantCode: '',
                fromTenantName: '',
            },
            totalInfo: {nums: 0},
            materialList: [],
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.loadAllocatInfo();
    },
    /**
     * 组件
     */
    components: {},
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 加载订单数据
         */
        async loadAllocatInfo()
        {
            let data = await this.common.postUrl("wmsAllocatTF", "loadAllocatInfo",
                    {ids: this.$route.query.ids},
                    null, null, null, true);
            
            this.info = data;
            this.materialList = data.materialList;
            for (let i = 0; i < this.materialList.length; i++)
            {
                this.totalInfo.nums = this.common.accAdd(this.totalInfo.nums, this.materialList[i].nums);
            }
        },
        print()
        {
            lodopUtil.printTableInfo("printTable", "打印调拨单");
            //打印次数加一
            // this.common.postUrl("wmsInOrderTF", "addPrintTimes",
            //         {inOrderId: this.$route.query.inOrderId},
            //         null);
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab", this.$route.meta.id)
        },
    },
}
