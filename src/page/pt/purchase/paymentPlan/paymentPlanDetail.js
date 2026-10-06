export default {
    name: "paymentPlanDetail",
    components: {
        
    },
    data() {
        return {
            info:{},
            
        };
    },
    mounted() {
        this.doQuery();
    },
    methods: {
        // 初始化数据
        async doQuery() {
            this.info = await this.common.postUrl('purPayPlanTF','getPurPayPlanInfo',{id:this.$route.query.id});
        },
        /**
         * 关闭当期页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
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
        toApplyDetail(item){
            let data = {
                query:{id:item.applyId,viewType:1},
                urlId: 'feeApplyDetail'+item.applyId,
                urlName: '查看费用申请单',
                urlPathName: '/feeApplyDetail',
                urlPath: "/pt/purchase/feeApply/examFeeApply.vue",
            }
            this.open(data);
        },
        toPurOrderDetail(item){
            this.open({
                query:{id:item.purchaseOrderId,type:0},
                urlId: 'detailPurOrder' +item.purchaseOrderId + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
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
         * 跳转请款单/付款单详情
         * @param param
         * @param code
         * @param index
         * @returns {Promise<void>}
         */
        async toDetail(param, code, index)
        {
            if (code == 'reqNums')
            {
                let id = param.reqIdArray[index];
                await this.open({
                    urlId: "requestFeeDetail" + id,
                    urlName: '查看请款单',
                    urlPathName: '/requestFeeDetail',
                    query:{id: id,type:0},
                    urlPath: "/pt/fc/receipts/detail/requestFeeDetailMain.vue",
                });
            }
            else if (code == 'payNums')
            {
                let id = param.payIdArray[index];
                await this.open({
                    urlName: '查看付款单',
                    urlId: "payOrderDetail" + id,
                    urlPathName: "/payOrderDetail",
                    urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue",
                    query:{id: id,type:0}
                });
            }
        },

    },
};