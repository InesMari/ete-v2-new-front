import dbTable from "@/components/dbTable/dbTable.vue"

export default {
    name: 'upSupplierQuoteLD',
    data() {
        return {
            quoteInfo: {sectionId:this.$route.query.quoteId},//线路信息
            quoteFeeData: [],//线路所有报价信息
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            //初始化报价信息
            let that = this;
            this.common.postUrl("quoteTF", "queryLDQuoteById", {quoteId:this.$route.query.quoteId}, function (data) {
                that.quoteInfo.beginAddress = data.beginAddressName;
                that.quoteInfo.endAddress = data.endAddressName;
                that.quoteFeeData = data.priceList;
            });
        },
        /** 保存线路报价信息 */
        addQuote() {
            //报价信息 只能修改报价信息
            if(this.quoteFeeData.length==0){
                this.$message.error("请输入报价信息！");
                return;
            }
            //零担运输报价-价格都为空值时不能直接提交保存
            if(this.common.isBlank(this.quoteFeeData[0].pickupNetWeightFee) && this.common.isBlank(this.quoteFeeData[0].pickupGrossWeightFee) && this.common.isBlank(this.quoteFeeData[0].pickupVolumeFee)
                && this.common.isBlank(this.quoteFeeData[0].deliveryNetWeightFee) && this.common.isBlank(this.quoteFeeData[0].deliveryGrossWeightFee) && this.common.isBlank(this.quoteFeeData[0].deliveryVolumeFee)
                && this.common.isBlank(this.quoteFeeData[0].freightNetWeightFee) && this.common.isBlank(this.quoteFeeData[0].freightGrossWeightFee) && this.common.isBlank(this.quoteFeeData[0].freightVolumeFee)){
                this.$message.error("请输入报价信息！");
                return;
            }
            //最终价格可以不填
            for (let i = 0; i < this.quoteFeeData.length; i++) {
                if(this.common.isNotBlank(this.quoteFeeData[i].beginPickupWeight) && this.common.isNotBlank(this.quoteFeeData[i].endPickupWeight)
                && this.common.isBlank(this.quoteFeeData[i].pickupNetWeightFee) && this.common.isBlank(this.quoteFeeData[i].pickupGrossWeightFee)){
                    this.$message.error("请输入第"+(i+1)+"行提货费/按重量 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginPickupWeight) && this.common.isBlank(this.quoteFeeData[i].pickupNetWeightFee)){
                //     this.$message.error("请输入第"+(i+1)+"行提货费/按重量 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginPickupVolume) && this.common.isNotBlank(this.quoteFeeData[i].endPickupVolume)
                    && this.common.isBlank(this.quoteFeeData[i].pickupVolumeFee)){
                    this.$message.error("请输入第"+(i+1)+"行提货费/按体积 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginPickupVolume) && this.common.isBlank(this.quoteFeeData[i].pickupVolumeFee)){
                //     this.$message.error("请输入第"+(i+1)+"行提货费/按体积 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginDeliveryWeight) && this.common.isNotBlank(this.quoteFeeData[i].endDeliveryWeight)
                    && this.common.isBlank(this.quoteFeeData[i].deliveryNetWeightFee) && this.common.isBlank(this.quoteFeeData[i].deliveryGrossWeightFee)){
                    this.$message.error("请输入第"+(i+1)+"行送货费/按重量 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginDeliveryWeight) && this.common.isBlank(this.quoteFeeData[i].deliveryNetWeightFee)){
                //     this.$message.error("请输入第"+(i+1)+"行送货费/按重量 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginDeliveryVolume) && this.common.isNotBlank(this.quoteFeeData[i].endDeliveryVolume)
                    && this.common.isBlank(this.quoteFeeData[i].deliveryVolumeFee)){
                    this.$message.error("请输入第"+(i+1)+"行送货费/按体积 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginDeliveryVolume) && this.common.isBlank(this.quoteFeeData[i].deliveryVolumeFee)){
                //     this.$message.error("请输入第"+(i+1)+"行送货费/按体积 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginFreightWeight) && this.common.isNotBlank(this.quoteFeeData[i].endFreightWeight)
                    && this.common.isBlank(this.quoteFeeData[i].freightNetWeightFee) && this.common.isBlank(this.quoteFeeData[i].freightGrossWeightFee)){
                    this.$message.error("请输入第"+(i+1)+"行运费/按重量 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginFreightWeight) && this.common.isBlank(this.quoteFeeData[i].freightNetWeightFee)){
                //     this.$message.error("请输入第"+(i+1)+"行运费/按重量 最终价格！");
                //     return;
                // }
                if(this.common.isNotBlank(this.quoteFeeData[i].beginFreightVolume) && this.common.isNotBlank(this.quoteFeeData[i].endFreightVolume)
                    && this.common.isBlank(this.quoteFeeData[i].freightVolumeFee)){
                    this.$message.error("请输入第"+(i+1)+"行运费/按体积 价格！");
                    return;
                }
                // if(this.common.isNotBlank(this.quoteFeeData[i].beginFreightVolume) && this.common.isBlank(this.quoteFeeData[i].freightVolumeFee)){
                //     this.$message.error("请输入第"+(i+1)+"行运费/按体积 最终价格！");
                //     return;
                // }
            }
            this.quoteInfo.priceData = JSON.stringify(this.quoteFeeData);
            let that = this;
            this.common.postUrl("quoteTF", "upQuoteInfo", this.quoteInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.$message.success("保存成功！");
                    that.close();
                }
            },null,'',true);
        },
        /** 关闭页面 回父页面刷新 */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
        /** 修改终止距离 */
        changeFeeInput(type,endPickup,index) {
            let quoteFee = this.quoteFeeData[index];
            let quoteFee_ = this.quoteFeeData[index+1];
            let mes = "beginPickupWeight";
            switch(type){
                case 2 : mes = "beginPickupVolume"
                    break;
                case 3 : mes = "beginDeliveryWeight"
                    break;
                case 4 : mes = "beginDeliveryVolume"
                    break;
                case 5 : mes = "beginFreightWeight"
                    break;
                case 6 : mes = "beginFreightVolume"
                    break;
                default : mes = "beginPickupWeight"
            }
            let beginPickup = eval("quoteFee."+mes);
            let beginPickup_;//下一行的起始范围
            let endPickup_;//下一行的终止范围
            let mes_ = mes.substring(5);
            if(this.common.isNotBlank(quoteFee_)){
                beginPickup_ = eval("quoteFee_."+mes);
                endPickup_ = eval("quoteFee_.end"+mes_);
            }
            if((this.common.isBlank(beginPickup) ||
                (this.common.isNotBlank(beginPickup) && this.common.isNotBlank(endPickup) && Number(beginPickup)>=Number(endPickup)))){
                if(this.common.isNotBlank(beginPickup_)){//如果当前行的终止范围小于下一行(下一行起始范围不为空)的起始范围，当前行的终止范围补全下一行的起始范围
                    eval("quoteFee.end"+mes_+"=beginPickup_");
                    return;
                }
                eval("quoteFee.end"+mes_+"=''");//如果当前行起始范围空，或者当前行起始范围大于终止范围，撤回操作补全空
                return;
            }
            if(this.common.isNotBlank(quoteFee_) && this.common.isNotBlank(beginPickup_)
                && this.common.isNotBlank(endPickup_) && this.common.isBlank(endPickup)){//删除报价必须从当前费用 最后一行开始删除，否则补全原来数值
                eval("quoteFee.end"+mes_+"=quoteFee_."+mes);
                return;
            }
            eval("if(this.quoteFeeData.length==index+1 && this.common.isNotBlank(quoteFee."+mes+") " +
                "&& this.common.isNotBlank(endPickup)){this.quoteFeeData.push({"+mes+":endPickup});}" +
                "else if(this.quoteFeeData.length>index+1){quoteFee_."+mes+" = endPickup;}");
            //如果下一行全部空 删除此行
            if(this.common.isNotBlank(quoteFee_) && this.common.isBlank(quoteFee_.beginPickupWeight) && this.common.isBlank(quoteFee_.endPickupWeight)
                && this.common.isBlank(quoteFee_.beginPickupVolume) && this.common.isBlank(quoteFee_.endPickupVolume)
                && this.common.isBlank(quoteFee_.beginDeliveryWeight) && this.common.isBlank(quoteFee_.endDeliveryWeight)
                && this.common.isBlank(quoteFee_.beginDeliveryVolume) && this.common.isBlank(quoteFee_.endDeliveryVolume)
                && this.common.isBlank(quoteFee_.beginFreightWeight) && this.common.isBlank(quoteFee_.endFreightWeight)
                && this.common.isBlank(quoteFee_.beginFreightVolume) && this.common.isBlank(quoteFee_.endFreightVolume)){
                this.quoteFeeData.pop();
            }
            this.$forceUpdate();
        },
    },
}
