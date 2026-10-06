export default {
    name: 'stockInventoryDetail',
    data() {
        return {
            info:{},
            totalInfo:{
                storeNums:0,
                expectNums:0,
                boxNums:0,
                palletNums:0,

                inventoryNums:0,
                inventoryBoxNums: 0,
                inventoryPalletNums:0,
                },
            list:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadOrderInfo();
        this.common.tableStretch(this.$refs.orderDetail);
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
            let data = await this.common.postUrl("wmsStockInventoryService", "loadWmsStockInventoryById",
                {inventoryId: this.$route.query.inventoryId},
                null, null, null, true);
            this.info = data;
            this.list = data.list;
            for (let i = 0; i < this.list.length; i++) {
                let item = this.list[i];
                this.totalInfo.storeNums = this.common.accAdd(this.totalInfo.storeNums,item.storeNums);
                this.totalInfo.expectNums = this.common.accAdd(this.totalInfo.expectNums,item.expectNums);
                this.totalInfo.boxNums = this.common.accAdd(this.totalInfo.boxNums,item.boxNums);
                this.totalInfo.palletNums = this.common.accAdd(this.totalInfo.palletNums,item.palletNums);

                this.totalInfo.inventoryNums = this.common.accAdd(this.totalInfo.inventoryNums,item.inventoryNums);
                this.totalInfo.inventoryBoxNums = this.common.accAdd(this.totalInfo.inventoryBoxNums,item.inventoryBoxNums);
                this.totalInfo.inventoryPalletNums = this.common.accAdd(this.totalInfo.inventoryPalletNums,item.inventoryPalletNums);
                item.show = true;
            }
            this.$forceUpdate();
        },
        changeShow(type)
        {
            for (let i = 0; i < this.list.length; i++) {
                let item = this.list[i];
                item.show = item.inventoryState == type;
                if (type == -1)
                    item.show = true;
            }
            this.$forceUpdate();
        },
        closePage(){
            this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        }
    },
}
