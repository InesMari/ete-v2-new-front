import enumData from "@/page/pt/enum.js";

export default {
    name: 'claimOrder',
    data() {
        return {
            orderInfo: {},//订单基本信息
            fee: {},//订单费用信息
            workData: [],//作业点
            goodsData: [],//货物
            whetherData: [],//是否加急
            billingTypeData: [],//计费方式
            vehicleTypeData: [],//车型
            vehicleLengthData: [],//车长
            payModeData: [],//结算方式

            middleCount: 0,//中途点个数
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadDataByPlanId();
    },
    /**
     * 组件
     */
    components: {},
    /**
     * 绑定函数
     */
    methods: {
        init(that) {
            //加载静态枚举
            //是否加急
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data) {
                that.whetherData = data;
                that.orderInfo.isUrgent = that.whetherData[0].codeValue;
            });
            //计费方式
            that.common.postUrl("commonTF", "getSysStaticData", {codeType:"BILLING_TYPE_ORDER"}, function (data) {
                that.billingTypeData = data;
                that.fee.billingType = that.billingTypeData[0].codeValue;
            });
            //车型
            that.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_TYPE"}, function (data) {
                that.vehicleTypeData = data;
                that.vehicleTypeData.unshift({codeValue:'',codeName:''});
            });
            //车长
            that.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_LENGTH"}, function (data) {
                that.vehicleLengthData = data;
                that.vehicleLengthData.unshift({codeValue:'',codeName:''});
            });
            //结算方式
            that.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_MODE"}, function (data) {
                that.payModeData = data;
                that.fee.payMode = that.payModeData[0].codeValue;
            });
        },
        /** 加载订单计划信息 */
        loadDataByPlanId() {
            let that = this;
            this.common.postUrl("ordPlanTF", "loadPlanInfoByPlanId", {planId:this.$route.query.planId}, function (data) {
                if(that.common.isNotBlank(data)){
                    that.orderInfo = data.orderPlan;
                    that.init(that);
                    that.workData = data.workData;
                    that.goodsData = data.goodsData;
                    for (let i = 0; i < that.goodsData.length; i++) {
                        that.goodsData[i].goodsCount = '';
                        that.goodsData[i].goodsWeight = '';
                        that.goodsData[i].goodsVolume = '';
                    }
                    that.middleCount = that.workData.length-2;
                }
            });
        },
        /** 刷新页面元素 */
        forceUpdate() {
            this.$forceUpdate();
        },
        /** 校验输入货物是否大于可调度货物
         * param type:1 数量 2 重量 3 体积 */
        checkRemainGoods(type,index) {
            if(type==1){
                if(this.common.isNotBlank(this.goodsData[index].goodsCount) && this.goodsData[index].goodsCount>this.goodsData[index].remainGoodsCount){
                    this.$message.error("第"+(index+1)+"行货物数量无法大于可调度数量！");
                    this.goodsData[index].goodsCount = '';
                }
            }else if(type==2){
                if(this.common.isNotBlank(this.goodsData[index].goodsWeight) && this.goodsData[index].goodsWeight>this.goodsData[index].remainGoodsWeight){
                    this.$message.error("第"+(index+1)+"行货物重量无法大于可调度重量！");
                    this.goodsData[index].goodsWeight = '';
                }
            }else if(type==3){
                if(this.common.isNotBlank(this.goodsData[index].goodsVolume) && this.goodsData[index].goodsVolume>this.goodsData[index].remainGoodsVolume){
                    this.$message.error("第"+(index+1)+"行货物体积无法大于可调度体积！");
                    this.goodsData[index].goodsVolume = '';
                }
            }
        },
        /** 同步货物合计 */
        synchronizationGoodsSum() {
            this.fee.goodsCountSum = 0;
            this.fee.goodsWeightSum = 0;
            this.fee.goodsVolumeSum = 0;
            for (let i = 0; i < this.goodsData.length; i++) {
                if (this.common.isNotBlank(this.goodsData[i].goodsCount)) {
                    this.fee.goodsCountSum = this.common.accAdd(this.fee.goodsCountSum,this.goodsData[i].goodsCount);
                }
                if (this.common.isNotBlank(this.goodsData[i].goodsWeight)) {
                    this.fee.goodsWeightSum = this.common.accAdd(this.fee.goodsWeightSum,this.goodsData[i].goodsWeight);
                }
                if (this.common.isNotBlank(this.goodsData[i].goodsVolume)) {
                    this.fee.goodsVolumeSum = this.common.accAdd(this.fee.goodsVolumeSum,this.goodsData[i].goodsVolume);
                }
            }
            this.$forceUpdate();
        },
        /**
         * 改变点位费
         */
        changePointFee()
        {
            this.fee.totalPointFee = this.common.accMul(this.common.isNotBlank(this.fee.pointFee) ? this.fee.pointFee : 0, this.workData.length - 2);
            this.calcTotalFee();
        },
        /**
         * 1、非多笔付 费用合计等于对应的结算方式的金额  即：结算方式=提付  费用合计(fee.totalFee) == 提付(fee.pickupPay)
         * 2、多笔付 费用合计(fee.totalFee) == 提付(fee.pickupPay) + 现付(fee.spotPay) + 回单付(fee.receiptPay) + 月结(fee.monthPay)
         * 改变结算方式
         */
        changePayMode(type) {
            this.fee.payModeItemDisabled = this.fee.payMode !== '5';//多笔付输入框才可以输入
            if (this.fee.payMode !== enumData.payMode.multiPay)//非多笔付
            {
                this.fee.monthPay = '';
                this.fee.pickupPay = '';
                this.fee.spotPay = '';
                this.fee.receiptPay = '';
                if (this.fee.payMode === enumData.payMode.monthPay)//月结
                {
                    this.fee.monthPay = this.fee.totalFee;
                }
                else if (this.fee.payMode === enumData.payMode.pickupPay)//提付
                {
                    this.fee.pickupPay = this.fee.totalFee;
                }
                else if (this.fee.payMode === enumData.payMode.spotPay)//现付
                {
                    this.fee.spotPay = this.fee.totalFee;
                }
                else if (this.fee.payMode === enumData.payMode.receiptPay)//回单付
                {
                    this.fee.receiptPay = this.fee.totalFee;
                }
            }
            else
            {
                let sum = this.common.accAdd(this.fee.monthPay, this.fee.pickupPay);
                sum = this.common.accAdd(sum, this.fee.spotPay);
                sum = this.common.accAdd(sum, this.fee.receiptPay);
                if (sum != 0 && sum != this.fee.totalFee)
                {
                    this.$message.error("结算方式的多笔付的（提付 + 现付 + 回单付 + 月结）必须等于费用合计");
                }
            }
            this.$forceUpdate();
        },
        /** 计算费用合计 */
        calcTotalFee(type)
        {
            this.fee.totalFee = 0;
            this.fee.freightDisabled = this.fee.billingType !== enumData.billingTypeOrder.byVehicle;

            let feeData = this.common.isBlank(this.fee.freight) ? '' : this.fee.freight;//运费
            if (this.fee.billingType === enumData.billingTypeOrder.byVehicle)//按整车
            {
                if (type === 1)
                {
                    feeData = this.fee.freightPrice;
                }
                if (type === 2 || type === 0)
                {
                    this.fee.freightPrice = this.getValid(feeData, false);
                }
            }
            else if (this.fee.billingType === enumData.billingTypeOrder.byVolume)//按体积
            {
                feeData = this.common.accMul(this.fee.goodsVolumeSum, this.fee.freightPrice);
            }
            else if (this.fee.billingType === enumData.billingTypeOrder.byNetweight)//按净重
            {
                feeData = this.common.accMul(this.fee.netWeight, this.fee.freightPrice);
            }
            else if (this.fee.billingType === enumData.billingTypeOrder.byGrossweight)//按毛重
            {
                feeData = this.common.accMul(this.fee.grossWeight, this.fee.freightPrice);
            }
            this.fee.freight = this.getValid(feeData, false);
            this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.fee.freight);
            this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.fee.totalPointFee);
            this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.fee.pickupFee);
            this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.fee.deliveryFee);
            this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.fee.loadingFee);
            this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.fee.dischargeFee);
            this.fee.totalFee = this.common.accAdd(this.fee.totalFee, this.fee.otherFee);
            this.changePayMode(this.fee.payMode);
            this.$forceUpdate();
        },
        /**
         * 返回处理的有效数值
         * @param flag 是否和小数点一起返回
         */
        getValid(data, flag)
        {
            data = data.toString();
            if (this.common.isNotBlank(data))
            {
                if (data.includes("."))
                {
                    let array = data.split(".");
                    let decimal = array[1];
                    if(this.common.isNotBlank(decimal))
                    {
                        if (decimal.length > 2){ return Number.parseFloat(data).toFixed(2); }
                        else { return data; }
                    }
                    else
                    {
                        if (flag){ return data; }
                        else { return array[0]; }
                    }
                }
                else { return data; }
            }
            return '';
        },
        /**
         * 订单数据校验
         */
        checkOrderData()
        {
            /************** 订单基础数据校验 **************/
            if (this.common.isBlank(this.orderInfo.tenantId))
            {
                this.$message.error("请选择订单的客户！");
                return false;
            }
            if (this.common.isBlank(this.orderInfo.orderType))
            {
                this.$message.error("请选择订单类型！");
                return false;
            }
            if (this.common.isBlank(this.orderInfo.routeId))
            {
                this.$message.error("请选择订单的线路！");
                return false;
            }
            if (this.common.isBlank(this.orderInfo.routeName))
            {
                this.$message.error("线路名称不能为空，请重新选择线路！");
                return false;
            }

            /************** 订单作业点校验 **************/
            if (this.workData.length < 2)
            {
                this.$message.error("请选择至少两个订单作业点！");
                return false;
            }
            for (let i = 0; i < this.workData.length; i++)
            {
                let workId = this.workData[i].workId;
                if (this.common.isBlank(workId))
                {
                    this.$message.error("请选择第" + ( i + 1) + "个作业点！");
                    return false;
                }
            }

            /************** 订单货物校验 **************/
            if (this.common.isBlank(this.goodsData) || this.goodsData.length < 1)
            {
                this.$message.error("请填写至少一条订单货物!");
                return false;
            }
            let goodsBeginEndMap = new Map();
            for (let i = 0; i < this.goodsData.length; i++)
            {
                let goodsId = this.goodsData[i].goodsId;
                let beginWorkId = this.goodsData[i].beginWorkId;
                let endWorkId = this.goodsData[i].endWorkId;
                if (this.common.isBlank(goodsId)){ this.$message.error("请选择第" + ( i + 1) + "个货物信息！"); return false; }
                if (this.common.isBlank(beginWorkId)){ this.$message.error("请选择第" + ( i + 1) + "个货物的提货点！"); return false; }
                if (this.common.isBlank(endWorkId)){ this.$message.error("请选择第" + ( i + 1) + "个货物的卸货点！"); return false; }
                let goodsCount = this.goodsData[i].goodsCount;
                let goodsWeight = this.goodsData[i].goodsWeight;
                let goodsVolume = this.goodsData[i].goodsVolume;
                if (this.common.isBlank(goodsCount) && this.common.isBlank(goodsWeight) && this.common.isBlank(goodsVolume))
                {
                    this.$message.error("第" + ( i + 1) + "个货物的件数、重量、体积必须填写一个有效数值！"); return false;
                }
                let j = goodsBeginEndMap.get("" + goodsId + beginWorkId + endWorkId);
                if (this.common.isNotBlank(j))
                {
                    this.$message.error("第" + j + "个货物和第" + ( i + 1) + "个货物的货物、提货点和卸货点相同，请重新选择！");
                    return false;
                }
                goodsBeginEndMap.set("" + goodsId + beginWorkId + endWorkId, i + 1);
            }

            /************** 订单费用校验 **************/
            if (this.common.isBlank(this.fee.billingType))
            {
                this.$message.error("请选择计费方式！");
                return false;
            }
            if (this.common.isBlank(this.fee.payMode))
            {
                this.$message.error("请选择结算方式！");
                return false;
            }
            let totalFee = this.common.isNotBlank(this.fee.totalFee) ? this.fee.totalFee : 0;
            let sum = this.common.accAdd(this.fee.totalPointFee, this.fee.freight);
            sum = this.common.accAdd(sum, this.fee.loadingFee);
            sum = this.common.accAdd(sum, this.fee.dischargeFee);
            sum = this.common.accAdd(sum, this.fee.otherFee);
            if (totalFee != sum)
            {
                this.$message.error("(点位费合计 + 运费 + 装货费 + 卸货费 + 其他费)不等于费用合计，请确认！");
                return false;
            }
            sum = 0;
            sum = this.common.accAdd(this.fee.pickupPay, this.fee.spotPay);
            sum = this.common.accAdd(sum, this.fee.receiptPay);
            sum = this.common.accAdd(sum, this.fee.monthPay);
            if (totalFee != sum)
            {
                this.$message.error("(提付 + 现付 + 回单付 + 月结)不等于费用合计，请确认！");
                return false;
            }
            //保存订单
            this.saveOrUpdateOrder();
        },
        /*** 订单录入 */
        saveOrUpdateOrder()
        {
            for (let i = 0; i < this.workData.length; i++)
            {
                this.workData[i].workOrder = i + 1;
            }
            let param = {};
            param.workList = this.workData;
            param.goodsList = this.goodsData;
            param.fee = this.fee;
            let that = this;
            this.common.postUrl("orderTF", "saveOrUpdateOrder", param, function (data)
            {
                that.$message.error("领单成功！");
                that.closePage();
            });
        },
        /*** 关闭当前那页面 */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}