import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: "inOrderDetail",
    components: {
        fileViewer,
    },
    data() {
        return {
            info: {},
            dtlList: [],
            bigImageUrl:null,
            total:{
                purchaseNum: 0,
                deliveryNums: 0,
                deposit:0,
                liquidatedDamages:0,
            }
        };
    },
    mounted() {
        this.doQuery();
    },
    methods: {
        // 初始化数据
        async doQuery() {
            let data = await this.common.postUrl('purPurchaseOrderDeliveryService','loadPurPurchaseOrderDeliveryById',{id:this.$route.query.id});
            this.info = data.info;
            this.dtlList = data.dtlList;
            this.total.purchaseNum = 0;
            this.total.deliveryNums = 0;
            data.dtlList.forEach(item => {
                this.total.purchaseNum = this.common.accAdd(this.total.purchaseNum, item.purchaseNum);
                this.total.deliveryNums = this.common.accAdd(this.total.deliveryNums, item.deliveryNums);
                this.total.deposit = this.common.accAdd(this.total.deposit, item.deposit);
                this.total.liquidatedDamages = this.common.accAdd(this.total.liquidatedDamages, item.liquidatedDamages);
            })
            this.$forceUpdate();
        },
        /**
         * 关闭当期页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
        seeBigImg(url){
            if(this.common.isBlank(url)){
                return;
            }
            this.bigImageUrl = url;
            this.$refs.viewer.show();
            this.$forceUpdate();
        },
        toContractDetail(item){
            let baseTitle = '';
            if(item.contractType==1){
                baseTitle = "客户";
            }else if(item.contractType==2){
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
        toPurOrder(item){
            this.$emit("openTab", {
                query:{id:item.purchaseId,type:0},
                urlId: 'detailPurOrder' + item.purchaseId + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
    },
};