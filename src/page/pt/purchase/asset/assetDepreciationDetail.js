import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'assetDepreciationDetail',
    data() {
        return {
            info:{
                assetNum:''
            },
            feeDetail:{},
        }
    },
    computed:{
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
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
        async init() {
            let data = await this.common.postUrl("assetTF", "getAssetDepreciationDetailInfo", {id:this.$route.query.id,assetId:this.$route.query.assetId});
            this.info = data.baseInfo;
            this.feeDetail = data.feeDetail;
        },

        toPurOrderDetail(item){
            this.$emit('openTab', {
                query:{id:item.purchaseOrderId,type:0},
                urlId: 'detailPurOrder' +item.purchaseOrderId + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        toAssetInfo(item){
            this.$emit('openTab', {
                query:{id:item.id,type:3},
                urlId: 'detailAssetInfo' + item.id + 3,
                urlName: '资产信息详情',
                urlPathName: '/detailAssetInfo',
                urlPath: "/pt/purchase/asset/assetInfoDetailMain.vue",
            });
        },
        toContractDetail(item){
            let baseTitle = '';
            if(item.contractType==2){
                baseTitle = "供应商-运输";
            }else if(item.contractType==3){
                baseTitle = "供应商-仓储运作";
            }else if(item.contractType==4){
                baseTitle = "供应商-器具容器";
            }else if(item.contractType==5){
                baseTitle = "供应商-保险";
            }
            let title = "查看"+baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
            });
        },
        /**
         * 关闭新增客户
         */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        },
    },
}
