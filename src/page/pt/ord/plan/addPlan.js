import enumData from "@/page/pt/enum.js";
2
export default {
    name: 'addPlan',
    data() {
        return {
            orderPlan: {},//订单计划基本信息
            incomeFee: {},//订单计划收入费用信息
            costFee: {},//订单计划成本费用信息
            orderTypeData: [],//订单类型
            classData: [],//货物类别
            customerData: [],//大客户下拉
            routeData: [],//线路下拉
            receiptData: [],//是否回单下拉
            companyData: [],//计划单位下拉
            billingTypeData: [],//计费方式下拉
            payModeData: [],//结算方式下拉
            quoteVehicleTypeData:[],//报价车型下拉
            vehicleLengthData: [],//车长下拉
            workData: [{workType:enumData.workType.pretend+""},{workType:enumData.workType.discharge+""}],//作业点
            custWorkData: [],//客户作业点下拉
            tenantDriverVehicleData: [{}],//供应商/司机/车辆
            supplierData: [],//供应商下拉
            goodsData: [{}],//货物
            goodsGroupData:this.initGoodsGroupData(),//货物分组的组集合
            goodsMap: {},//货物id和名称
            custGoodsData: [],//客户货物下拉
            workTypeData: [],//作业点类型下拉
            carryWorkData: [],//提货作业点
            dischargeWorkData: [],//卸货作业点

            goodsCountSum: 0,//货物件数合计
            goodsWeightSum: 0,//货物重量合计
            goodsVolumeSum: 0,//货物体积合计
            showDialog: false,
            pickerOptions: {//禁用小于当前时间日期
                disabledDate(time) {
                    return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
                },
            },
            pickerOptions_: {//禁用小于开始时间日期
                disabledDate(time) {
                    return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
                },
            },
            workIdSet: new Set,//作业点ID集合
            tenantId: this.common.isBlank(this.$route.query.tenantId) ? '' : this.$route.query.tenantId.toString(),//客户详情新增订单包跳转

            settleBodyData:[],
        }
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
    components: {},
    methods: {
        async init() {
            //加载静态枚举
            let data = await this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType':'PAY_TITLE,ORDER_TYPE,WORK_TYPE,VEHICLE_TYPE_QUOTE,VEHICLE_LENGTH,WHETHER,PLAN_COMPANY,BILLING_TYPE_ORDER,PAY_MODE'});
            this.settleBodyData = data.PAY_TITLE;
            this.orderTypeData = data.ORDER_TYPE;
            this.workTypeData = data.WORK_TYPE;
            this.quoteVehicleTypeData = data.VEHICLE_TYPE_QUOTE;
            this.vehicleLengthData = data.VEHICLE_LENGTH;
            this.receiptData = data.WHETHER;
            this.companyData = data.PLAN_COMPANY;
            this.billingTypeData = data.BILLING_TYPE_ORDER;
            this.payModeData = data.PAY_MODE;
            for (let i = 0; i < this.payModeData.length; i++)
            {
                if (!(this.payModeData[i].codeValue == 1 || this.payModeData[i].codeValue == 4))
                {
                    this.payModeData.splice(i, 1);
                    i--;
                }
            }
            
            //大客户下拉
            this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
            //供应商下拉
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            
            this.goodsMap = new Map();
            //初始化客户信息
            if(this.common.isNotBlank(this.tenantId)){
                this.changeCustomerSelect(this.tenantId);
            }
            if (this.common.isNotBlank(this.$route.query.id))
                await this.loadPlanInfoByPlanId(this.$route.query.id)
            else
            {
                this.orderPlan.orderType = this.orderTypeData[0].codeValue;
                for (let i = 0; i < this.receiptData.length; i++) {
                    if(this.receiptData[i].codeValue == 0){
                        this.orderPlan.isReceipt = this.receiptData[i].codeValue;
                    }
                }
                for (let i = 0; i < this.companyData.length; i++) {
                    if(this.companyData[i].codeValue == 1){
                        this.orderPlan.planCompany = this.companyData[i].codeValue;
                    }
                }
                for (let i = 0; i < this.billingTypeData.length; i++)
                {
                    if(this.billingTypeData[i].codeValue == 1){
                        this.incomeFee.billingType = this.billingTypeData[i].codeValue;
                        this.costFee.billingType = this.billingTypeData[i].codeValue;
                    }
                }
                for (let i = 0; i < this.payModeData.length; i++)
                {
                    if(this.payModeData[i].codeValue == 1){
                        this.incomeFee.payMode = this.payModeData[i].codeValue;
                    }
                }
            }
            //时间写死今天
            // this.orderPlan.startDate = this.common.formatDate.getDate(new Date());
            // this.orderPlan.endDate = this.common.formatDate.getDate(new Date());
        },
        async loadPlanInfoByPlanId(id) {
            //加载订单包信息
            let data = await this.common.postUrl("ordPlanTF", "loadPlanInfoByPlanId", {planId:id});
            this.orderPlan = data.orderPlan;
            if (enumData.OPEN_PAGE_TYPE.COPY == this.$route.query.type){
                this.orderPlan.id = null;
                this.orderPlan.thrdPlanNum = '';
            }
            this.orderPlan.orderCustId = data.orderPlan.orderCustId + "";
            this.orderPlan.isReceipt = data.orderPlan.isReceipt + "";
            this.orderPlan.planCompany = data.orderPlan.planCompany + "";
            
            this.workData = data.workData;
            this.goodsData = data.goodsData;
            this.incomeFee = data.incomeFee;
            this.incomeFee.billingType = data.incomeFee.billingType + "";
            this.incomeFee.payMode = data.incomeFee.payMode + "";
            this.incomeFee.quoteVehicleType = data.incomeFee.quoteVehicleType + "";
            this.incomeFee.vehicleLength = data.incomeFee.vehicleLength + "";
            
            this.costFee = data.costFee;
            this.costFee.billingType = data.costFee.billingType + "";
            this.costFee.quoteVehicleType = data.costFee.quoteVehicleType + "";
            this.costFee.vehicleLength = data.costFee.vehicleLength + "";
            this.orderPlan.settleBody = data.orderPlan.settleBody + "";
            
            this.tenantDriverVehicleData = data.supplierData;
            //加载客户信息
            await this.loadCustomerData(this.orderPlan.orderCustId);
        },
        /** 初始化货物的分组数据 */
        initGoodsGroupData()
        {
            this.goodsGroupData = [{
                label: '线路常用货物',
                goodsData: []
            }, {
                label: '客户所有货物',
                goodsData: [],
            }];
            return this.goodsGroupData;
        },
        /** 选中起始日期、禁用结束日期 */
        changeStartDate() {
            if(this.common.isBlank(this.orderPlan.startDate)){
                return;
            }
            let that = this;
            this.pickerOptions_={
                disabledDate(time) {
                    return time.getTime() < new Date(that.orderPlan.startDate).getTime();
                }
            }
            this.orderPlan.endDate = this.orderPlan.startDate;
            this.$forceUpdate();
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        /** 查询大客户线路 */
        changeCustomerSelect(tenantId) {
            this.orderPlan.orderCustId = tenantId;
            //切换客户 清空原来订单计划 线路、作业点、货物
            this.orderPlan.routeId = '';
            this.workData = [{workType:enumData.workType.pretend+""},{workType:enumData.workType.discharge+""}];
            this.synchronizationWorkData();
            // this.goodsData = [{}];
            this.goodsGroupData[0].goodsData = [];
            if(!this.orderPlan.orderCustId){
                this.routeData = [];
                this.custWorkData = [];
                this.goodsGroupData[1].goodsData = [];
                return;
            }
            this.loadCustomerData(tenantId);
        },
        async loadCustomerData(tenantId)
        {
            this.routeData = await this.common.postUrl("routeTF", "loadRouteSelectByTenantId", {tenantId: tenantId});
            //查询大客户作业点
            this.custWorkData = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {tenantId: tenantId,isLoadStoreHouse: 1});
            //查询大客户货物
            let data = await this.common.postUrl("workGoodsTF", "queryGoodsDataByTenantId", {tenantId: tenantId,type: enumData.GOODS_TYPE.CONVENTIONAL_GOODS});
            data.forEach(item => {
                item.disabled = false;
                this.goodsMap.set(item.goodsId, item.goodsName);
            });//默认都是可选择
            this.goodsGroupData[1].goodsData = data;
            for (let i = 0; i < this.workData.length; i++) {
                if (this.workData[i].workType == enumData.workType.pretend || this.workData[i].workType == enumData.workType.loadingUnloading) {
                    this.carryWorkData.push(this.workData[i]);
                }
                if (this.workData[i].workType == enumData.workType.discharge || this.workData[i].workType == enumData.workType.loadingUnloading) {
                    this.dischargeWorkData.push(this.workData[i]);
                }
            }
        },
        /**
         * 提示选择客户
         */
        tipSelectCustomer()
        {
            if (this.common.isBlank(this.orderPlan.orderCustId))
            {
                this.$message.error("请先选择客户！");
                return false;
            }
        },
        /** 选中线路 */
        async changeRouteSelect() {
            if(!this.orderPlan.routeId){
                this.orderPlan.routeName='';
                this.workData = [{workType:enumData.workType.pretend+""},{workType:enumData.workType.discharge+""}];//作业点
                this.synchronizationWorkData();
                this.goodsGroupData[0].goodsData = [];
                return;
            }

            for (let i = 0; i < this.routeData.length; i++) {
                if (this.orderPlan.routeId == this.routeData[i].routeId) {
                    this.orderPlan.routeName = this.routeData[i].routeName;
                }
            }
            let that = this;
            //查询线路信息
            this.common.postUrl("routeTF", "loadRouteById", {routeId: this.orderPlan.routeId}, function (data) {
                //回显订单类型
                let orderType = enumData.orderType.vehicleOneWay;
                if(data.routeInfo.orderType==1 && data.routeInfo.isReturn==1){
                    orderType = enumData.orderType.vehicleTwoWay;
                }else if(data.routeInfo.orderType==2){
                    orderType = enumData.orderType.lessThanCarload;
                }
                that.orderPlan.orderType = orderType+"";
                that.workData = data.routeList;
                for (let i = 0; i < that.workData.length; i++) {
                    that.workData[i].workType = that.workData[i].workType + "";
                }
                that.synchronizationWorkData();
                //刷新货物Data 如果作业点只有提卸货点 默认货物选中提卸货点
                // that.goodsData = [{}];
                that.goodsData.forEach(item => {
                    if(that.workData.length==2){
                        item.beginWorkId = that.carryWorkData[0].workId;
                        item.endWorkId = that.dischargeWorkData[0].workId;
                    }else{
                        item.beginWorkId = '';
                        item.endWorkId = '';
                    }
                });

                that.syncOrderDistance(false);
            });
            //加载线路常用货物数据
            this.common.postUrl("routeTF", "loadGoodsByRouteId", {routeId: this.orderPlan.routeId}, function (data) {
                that.goodsGroupData[0].goodsData = data;
            });

        },
        /** 选中作业点 */
        changeWorkSelect(index) {
            for (let i = 0; i < this.custWorkData.length; i++) {
                if (this.workData[index].workId == this.custWorkData[i].workId) {
                    this.workData[index] = this.common.copyObj(this.custWorkData[i]);
                }
            }
            this.synchronizationWorkData();
            this.syncOrderDistance(false);
        },
        /** 选中货物件数 */
        changeGoodsCount(goods, index) {
            if (this.common.isNotBlank(goods.goodsCount) && this.common.isNotBlank(goods.singleGoodsVolume))
            {
                goods.goodsVolume = this.common.accMul(goods.goodsCount, goods.singleGoodsVolume);
            }
            this.synchronizationGoodsSum();
        },
        /** 选中货物 */
        changeGoods(goods, index) {
            this.goodsData[index].goodsName = this.goodsMap.get(goods.goodsId);
            if (this.common.isNotBlank(this.goodsGroupData[1].goodsData))
            {
                for (let i = 0; i < this.goodsGroupData[1].goodsData.length; i++)
                {
                    let item = this.goodsGroupData[1].goodsData[i];
                    if (item.goodsId == goods.goodsId)
                    {
                        this.goodsData[index].classId = item.classId;
                        this.goodsData[index].className = item.className;
                        this.goodsData[index].goodsModel = item.goodsModel;
                        this.goodsData[index].singleGoodsVolume = item.singleGoodsVolume;
                        if (this.common.isNotBlank(item.packingType))
                        {
                            this.goodsData[index].packingType = item.packingType;
                            this.goodsData[index].packingTypeName = item.packingTypeName;
                        }
                        break;
                    }
                }
            }
            if (this.common.isNotBlank(goods.goodsCount) && this.common.isNotBlank(goods.singleGoodsVolume))
            {
                goods.goodsVolume = this.common.accMul(goods.goodsCount, goods.singleGoodsVolume);
            }
            this.initGoodsDisabled();
            this.synchronizationGoodsSum();
        },
        /** 初始化货物可选择状态 */
        initGoodsDisabled()
        {
            this.goodsGroupData[0].goodsData.forEach(item => {
                item.disabled = false;
                this.goodsData.forEach(itemG => {
                    if (item.goodsId == itemG.goodsId){ item.disabled = true; }
                })
            });
            this.goodsGroupData[1].goodsData.forEach(item => {
                item.disabled = false;
                this.goodsData.forEach(itemG => {
                    if (item.goodsId == itemG.goodsId){ item.disabled = true; }
                })
            });
        },
        /** 添加作业点 */
        addWork() {
            if (this.common.isBlank(this.orderPlan.orderCustId))
            {
                this.$message.error("请先选择客户！");
                return false;
            }
            this.workData.splice(1, 0, {workType:enumData.workType.loadingUnloading+""});
            this.synchronizationWorkData();
        },
        /** 删除作业点 */
        delWork(index) {
            this.workData.splice(index,1);
            this.synchronizationWorkData();
            //删除作业点 清空对应货物已选该作业点
            for (let i = 0; i < this.goodsData.length; i++) {
                //提货点
                let flag = true;
                for (let j = 0; j < this.carryWorkData.length; j++) {
                    if(this.goodsData[i].beginWorkId==this.carryWorkData[j].workId){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    this.goodsData[i].beginWorkId = '';
                }
                //卸货点
                flag = true;
                for (let j = 0; j < this.dischargeWorkData.length; j++) {
                    if(this.goodsData[i].endWorkId==this.dischargeWorkData[j].workId){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    this.goodsData[i].endWorkId = '';
                }
            }
            this.syncOrderDistance(false);
        },
        /** 添加货物 */
        addGoods() {
            let obj = {};
            if(this.workData.length==2){
                obj.beginWorkId = this.carryWorkData[0].workId;
                obj.endWorkId = this.dischargeWorkData[0].workId;
            }
            this.goodsData.push(obj);
            this.synchronizationGoodsSum();
            this.initGoodsDisabled();
        },
        /** 删除货物 */
        delGoods(index) {
            this.goodsData.splice(index, 1);
            this.synchronizationGoodsSum();
            this.initGoodsDisabled();
        },
        showEditDialog(flag) {
            if (flag) {
                for (let i = 0; i < this.workData.length; i++) {
                    if (this.workData[i].workType == enumData.workType.pretend) {
                        this.workData[i].workTypeName = '提货';
                    } else if (this.workData[i].workType == enumData.workType.discharge) {
                        this.workData[i].workTypeName = '卸货';
                    } else if (this.workData[i].workType == enumData.workType.loadingUnloading) {
                        this.workData[i].workTypeName = '提+卸';
                    }
                }
                this.showDialog = true;
            } else{
                this.showDialog = false;
            }
        },
        /** 同步提卸货 作业点集合 */
        synchronizationWorkData() {
            this.carryWorkData = [];
            this.dischargeWorkData = [];
            for (let i = 0; i < this.workData.length; i++) {
                if (this.workData[i].workType == enumData.workType.pretend || this.workData[i].workType == enumData.workType.loadingUnloading) {
                    this.carryWorkData.push(this.workData[i]);
                }
                if (this.workData[i].workType == enumData.workType.discharge || this.workData[i].workType == enumData.workType.loadingUnloading) {
                    this.dischargeWorkData.push(this.workData[i]);
                }
            }
            this.changePointFee();
            this.calcTotalFee();
            this.calcCostTotalFee();
            this.$forceUpdate();
        },
        /** 同步货物合计 */
        synchronizationGoodsSum() {
            this.goodsCountSum = 0;
            this.goodsWeightSum = 0;
            this.goodsVolumeSum = 0;
            this.incomeFee.volume = 0;
            this.costFee.volume = 0;
            for (let i = 0; i < this.goodsData.length; i++) {
                if (this.common.isNotBlank(this.goodsData[i].goodsCount)) {
                    this.goodsCountSum = this.common.accAdd(this.goodsCountSum,this.goodsData[i].goodsCount);
                }
                if (this.common.isNotBlank(this.goodsData[i].goodsWeight)) {
                    this.goodsWeightSum = this.common.accAdd(this.goodsWeightSum,this.goodsData[i].goodsWeight);
                }
                if (this.common.isNotBlank(this.goodsData[i].goodsVolume)) {
                    this.goodsVolumeSum = this.common.accAdd(this.goodsVolumeSum,this.goodsData[i].goodsVolume);
                    this.incomeFee.volume = this.common.accAdd(this.incomeFee.volume,this.goodsData[i].goodsVolume);
                    this.costFee.volume = this.common.accAdd(this.costFee.volume,this.goodsData[i].goodsVolume);
                }
            }
            this.calcTotalFee();
            this.calcCostTotalFee();
            this.forceUpdate();
        },
        /** 修改作业点顺序 */
        sumitWorkIndex() {
            for (let i = 0; i < this.workData.length; i++) {
                if (this.common.isBlank(this.workData[i].subIndex)) {
                    this.$message.error("请输入作业点：" + this.workData[i].workName + "的调整顺序！");
                    return false;
                }
            }

            //排序
            function compare(subIndex) {
                return function (a, b) {
                    return a[subIndex] - b[subIndex];
                }
            }

            let sortData = this.common.copyObj(this.workData);
            sortData.sort(compare('subIndex'));
            //判断起点只能提 终点只能卸
            for (let i = 0; i < sortData.length; i++) {
                if (i == 0 && sortData[i].workType != enumData.workType.pretend) {
                    this.$message.error("起点作业类型只能为提货！");
                    return false;
                }
                if (i == sortData.length - 1 && sortData[i].workType != enumData.workType.discharge) {
                    this.$message.error("终点作业类型只能为卸货！");
                    return false;
                }
            }
            this.workData = sortData;
            this.showEditDialog();
        },
        /** 获取最长距离的两个作业点匹配收入运费相关 */
        matchOrderFee()
        {
            let count = 0;
            let compare = new Set;
            this.workIdSet.forEach((item) => {
                compare.add(item);
            })
            this.workIdSet = new Set;
            for (let i = 0; i < this.workData.length; i++)
            {
                if (this.common.isNotBlank(this.workData[i].workId))
                {
                    count++;
                    if (!this.workIdSet.has(this.workData[i].workId))
                        this.workIdSet.add(this.workData[i].workId);
                }
            }
            let isChange = this.workIdSet.size !== compare.size;//作业点是否发生变更
            this.workIdSet.forEach((item) => {
                let findSame = false;
                compare.forEach((itemOld) => {
                    if (!findSame && item === itemOld)
                        findSame = true;
                });
                if (!findSame)
                    isChange = true;
            });
            if (count >= 2)//至少选择两个有效点才去匹配
            {
                let param = this.common.copyObj(this.incomeFee);
                //整车订单没有选择车长不匹配
                param.tenantId = this.orderPlan.orderCustId;
                param.orderType = this.orderPlan.orderType;
                param.workList = this.workData;
                let that = this;
                that.common.postUrl("ZCQuoteNewTF", "matchOrderFee", param, function (data)
                {
                    that.incomeFee.freightPrice = that.common.isNotBlank(data.feePrice) ? data.feePrice : "";
                    that.incomeFee.freight = that.common.isNotBlank(data.freight) ? data.freight : "";
                    that.incomeFee.pointFee = that.common.isNotBlank(data.pointFee) ? data.pointFee : "";
                    that.incomeFee.pickupFee = that.common.isNotBlank(data.pickupFee) ? data.pickupFee : "";
                    that.incomeFee.deliveryFee = that.common.isNotBlank(data.deliveryFee) ? data.deliveryFee : "";

                    that.changePointFee();
                    that.forceUpdate();
                });
            }
            this.calcTotalFee();
            this.forceUpdate();
        },
        /** 改变收入点位费 */
        changePointFee: function ()
        {
            let pointFee = this.common.isNotBlank(this.incomeFee.pointFee)? this.incomeFee.pointFee : "0";
            pointFee = !isNaN(parseFloat(pointFee)) ? pointFee : "0";
            this.incomeFee.totalPointFee = this.common.accMul(pointFee, this.workData.length - 2);
            this.calcTotalFee();
        },
        /** 计算收入费用合计 */
        calcTotalFee()
        {
            this.incomeFee.totalFee = 0;
            this.incomeFee.freightDisabled = this.incomeFee.billingType !== '1';

            let feeData = this.common.isBlank(this.incomeFee.freight) ? '' : this.incomeFee.freight;//运费
            if (this.incomeFee.billingType === '1')
            {

            }
            else if (this.incomeFee.billingType === '2')
            {
                feeData = this.common.accMul(this.incomeFee.volume, this.incomeFee.freightPrice);
                if (!(this.common.isNotBlank(this.incomeFee.volume) && this.common.isNotBlank(this.incomeFee.freightPrice)))
                {
                    if (feeData == 0){ feeData = ''; }
                }
            }
            else if (this.incomeFee.billingType === '3' || this.incomeFee.billingType === '4')//计划没有净重或毛重，直接计算调度重量
            {
                feeData = this.common.accMul(this.goodsWeightSum, this.incomeFee.freightPrice);
                if (!(this.common.isNotBlank(this.goodsWeightSum) && this.common.isNotBlank(this.incomeFee.freightPrice)))
                {
                    if (feeData == 0){ feeData = ''; }
                }
            }
            if (isNaN(feeData)){ feeData = ''; }
            this.incomeFee.freight = this.getValid(feeData, true);//返回两位有效数值
            this.incomeFee.totalFee = this.common.accAdd(this.incomeFee.totalFee, this.dealValue(this.incomeFee.freight));
            this.incomeFee.totalFee = this.common.accAdd(this.incomeFee.totalFee, this.dealValue(this.incomeFee.premiumFee));
            this.incomeFee.totalFee = this.common.accAdd(this.incomeFee.totalFee, this.dealValue(this.incomeFee.totalPointFee));
            this.incomeFee.totalFee = this.common.accAdd(this.incomeFee.totalFee, this.dealValue(this.incomeFee.pickupFee));
            this.incomeFee.totalFee = this.common.accAdd(this.incomeFee.totalFee, this.dealValue(this.incomeFee.deliveryFee));
            this.incomeFee.totalFee = this.common.accAdd(this.incomeFee.totalFee, this.dealValue(this.incomeFee.loadingFee));
            this.incomeFee.totalFee = this.common.accAdd(this.incomeFee.totalFee, this.dealValue(this.incomeFee.dischargeFee));
            this.incomeFee.totalFee = this.common.accAdd(this.incomeFee.totalFee, this.dealValue(this.incomeFee.otherFee));
            this.forceUpdate();
        },
        /**
         * 处理异常数值输入
         * @param value
         * @returns {number}
         */
        dealValue(value)
        {
            let newValue = 0;
            if (this.common.isNotBlank(value) && !isNaN(parseFloat(value + "")))
            {
                newValue = value;
            }
            return newValue;
        },
        /**
         * 返回两位有效数值的数 如果是.0结尾直接返回整数
         * @param data
         * @param flag 是否和小数点一起返回
         * @returns {number|*}
         */
        getValid(data, flag)
        {
            data = data + "";
            if (this.common.isNotBlank(data))
            {
                if (data.includes("."))
                {
                    let array = data.split(".");
                    let decimal = array[1];//小数位
                    if(this.common.isNotBlank(decimal))
                    {
                        let value = (Math.round(Number.parseFloat(data) * 10000) / 10000);
                        if (decimal.length > 2)
                        {
                            if (decimal.length > 4)
                                return value.toFixed(4);
                            else
                                return data;
                        }
                        else
                            return data;
                    }
                    else
                    {
                        if (flag)
                            return data;
                        else
                            return array[0];
                    }
                }
                else
                    return data;
            }
            return '';
        },
        
        /** 改变成本点位费 */
        changeCostPointFee: function ()
        {
            let pointFee = this.common.isNotBlank(this.costFee.pointFee)? this.costFee.pointFee : "0";
            pointFee = !isNaN(parseFloat(pointFee)) ? pointFee : "0";
            this.costFee.totalPointFee = this.common.accMul(pointFee, this.workData.length - 2);
            this.calcTotalFee();
        },
        /** 计算成本费用合计 */
        calcCostTotalFee()
        {
            this.costFee.totalFee = 0;
            this.costFee.freightDisabled = this.costFee.billingType !== '1';

            let feeData = this.common.isBlank(this.costFee.freight) ? '' : this.costFee.freight;//运费
            if (this.costFee.billingType === '1')
            {

            }
            else if (this.costFee.billingType === '2')
            {
                feeData = this.common.accMul(this.costFee.volume, this.costFee.freightPrice);
                if (!(this.common.isNotBlank(this.costFee.volume) && this.common.isNotBlank(this.costFee.freightPrice)))
                {
                    if (feeData == 0){ feeData = ''; }
                }
            }
            else if (this.costFee.billingType === '3' || this.costFee.billingType === '4')//计划没有净重或毛重，直接计算调度重量
            {
                feeData = this.common.accMul(this.goodsWeightSum, this.costFee.freightPrice);
                if (!(this.common.isNotBlank(this.goodsWeightSum) && this.common.isNotBlank(this.costFee.freightPrice)))
                {
                    if (feeData == 0){ feeData = ''; }
                }
            }
            if (isNaN(feeData)){ feeData = ''; }
            this.costFee.freight = this.getValid(feeData, true);//返回两位有效数值
            this.costFee.totalFee = this.common.accAdd(this.costFee.totalFee, this.dealValue(this.costFee.freight));
            this.costFee.totalFee = this.common.accAdd(this.costFee.totalFee, this.dealValue(this.costFee.premiumFee));
            this.costFee.totalFee = this.common.accAdd(this.costFee.totalFee, this.dealValue(this.costFee.totalPointFee));
            this.costFee.totalFee = this.common.accAdd(this.costFee.totalFee, this.dealValue(this.costFee.pickupFee));
            this.costFee.totalFee = this.common.accAdd(this.costFee.totalFee, this.dealValue(this.costFee.deliveryFee));
            this.costFee.totalFee = this.common.accAdd(this.costFee.totalFee, this.dealValue(this.costFee.loadingFee));
            this.costFee.totalFee = this.common.accAdd(this.costFee.totalFee, this.dealValue(this.costFee.dischargeFee));
            this.costFee.totalFee = this.common.accAdd(this.costFee.totalFee, this.dealValue(this.costFee.otherFee));
            this.forceUpdate();
        },
        /** 选中供应商 */
        changeSupplier(value,index) {
            if (!value) {
                this.tenantDriverVehicleData[index].driverId = '';
                this.tenantDriverVehicleData[index].vehicleId = '';
                this.tenantDriverVehicleData[index].supplierDriverData = [];
                this.tenantDriverVehicleData[index].supplierVehicleData = [];
                return;
            }
            let that = this;
            this.common.postUrl("driverTF", "selDriverInfoListByCond", {tenantId:this.tenantDriverVehicleData[index].tenantId,isInvoice:this.tenantDriverVehicleData[index].isInvoice,rows:2500}, function (data) {
                that.tenantDriverVehicleData[index].supplierDriverData = data.items;
                that.$forceUpdate();
            });
            this.common.postUrl("resVehicleInfoTF", "selVehicleInfoListByCond", {tenantId:this.tenantDriverVehicleData[index].tenantId,isInvoice:this.tenantDriverVehicleData[index].isInvoice,rows:2500}, function (data) {
                that.tenantDriverVehicleData[index].supplierVehicleData = data.items;
                that.$forceUpdate();
            });
        },
        /** 新增供应商 */
        addSupplier() {
            let supplier = {};
            this.tenantDriverVehicleData.push(supplier);
        },
        /** 删除供应商 */
        delSupplier(index) {
            this.tenantDriverVehicleData.splice(index, 1);
        },
        
        /** 保存订单计划 数据校验 */
        saveOrdPlanSuccess(){
            //基本信息
            if(this.common.isBlank(this.orderPlan.orderCustId)){
                this.$message.error("请选择下单客户！");
                return false;
            }
            if(this.common.isBlank(this.orderPlan.routeName)){
                this.$message.error("请选择线路！");
                return false;
            }
            if(this.common.isBlank(this.orderPlan.orderType)){
                this.$message.error("请选择订单类型！");
                return false;
            }
            if(this.common.isBlank(this.orderPlan.isReceipt)){
                this.$message.error("请选择是否回单！");
                return false;
            }
            if(this.common.isBlank(this.orderPlan.startDate)){
                this.$message.error("请选择起始日期！");
                return false;
            }
            if(this.common.isBlank(this.orderPlan.endDate)){
                this.$message.error("请选择结束日期！");
                return false;
            }
            if(this.orderPlan.startDate>this.orderPlan.endDate){
                this.$message.error("起始日期不能大于结束日期！");
                return false;
            }
            if(this.common.isBlank(this.orderPlan.planCompany)){
                this.$message.error("请选择订单包单位！");
                return false;
            }
            if(this.common.isBlank(this.orderPlan.planCount)){
                this.$message.error("请输入订单包数！");
                return false;
            }
            //零担订单只能有提卸货点
            if(this.orderPlan.orderType==enumData.orderType.lessThanCarload && this.workData.length!=2){
                this.$message.error("零担订单包只能有提卸货点！");
                return false;
            }
            //作业点信息
            if(this.workData.length<2){
                this.$message.error("请至少保留一个起点和一个终点！");
                return false;
            }
            for (let i = 0; i < this.workData.length; i++) {
                if(this.common.isBlank(this.workData[i].workId)){
                    this.$message.error("请选择第"+(i+1)+"行作业点名称！");
                    return false;
                }
                if(this.common.isBlank(this.workData[i].workType)){
                    this.$message.error("请选择第"+(i+1)+"行作业内容！");
                    return false;
                }
                if(this.common.isBlank(this.workData[i].workAddressStr)){
                    this.$message.error("请输入第"+(i+1)+"行作业点详细地址！");
                    return false;
                }
                if (i == 0 && this.workData[i].workType != enumData.workType.pretend) {
                    this.$message.error("起点作业内容只能为提货！");
                    return false;
                }
                if (i == this.workData.length - 1 && this.workData[i].workType != enumData.workType.discharge) {
                    this.$message.error("终点作业内容只能为卸货！");
                    return false;
                }
            }
            //收入费用信息
            if(this.common.isBlank(this.incomeFee.billingType)){
                this.$message.error("请选择收入计费方式！");
                return false;
            }
            if(this.common.isBlank(this.incomeFee.payMode)){
                this.$message.error("请选择收入结算方式！");
                return false;
            }
            //成本费用信息
            if(this.common.isBlank(this.costFee.billingType)){
                this.$message.error("请选择成本计费方式！");
                return false;
            }
            //货物信息
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
                //判空校验
                if(this.common.isBlank(this.goodsData[i].goodsId)){
                    this.$message.error("请选择第"+(i+1)+"行货物名称！");
                    return false;
                }
                if(this.common.isBlank(this.goodsData[i].classId)){
                    this.$message.error("请选择第"+(i+1)+"行货物类别！");
                    return false;
                }
                if(this.common.isBlank(this.goodsData[i].packingType)){
                    this.$message.error("请选择第"+(i+1)+"行货物包装！");
                    return false;
                }
                if(this.common.isBlank(this.goodsData[i].beginWorkId)){
                    this.$message.error("请选择第"+(i+1)+"行货物提货点！");
                    return false;
                }
                if(this.common.isBlank(this.goodsData[i].endWorkId)){
                    this.$message.error("请选择第"+(i+1)+"行货物卸货点！");
                    return false;
                }
                //这里货物 件数、重量、体积 填一项即可
                if(this.common.isBlank(this.goodsData[i].goodsCount) && this.common.isBlank(this.goodsData[i].goodsWeight)
                    && this.common.isBlank(this.goodsData[i].goodsVolume)){
                    this.$message.error("第"+(i+1)+"行货物件数、重量、体积请至少填写一项！");
                    return false;
                }
            }
            if((this.orderPlan.planCompany==2 && this.goodsWeightSum==0) || (this.orderPlan.planCompany==3 && this.goodsVolumeSum==0)
                || (this.orderPlan.planCompany==4 && this.goodsCountSum==0)){
                this.$message.error("请输入与订单包单位相符的货物信息！");
                return false;
            }
            //供应商/司机/车辆信息
            if(this.tenantDriverVehicleData.length==0){
                this.$message.error("请选择供应商/司机/车辆信息信息！");
                return false;
            }
            for (let i = 0; i < this.tenantDriverVehicleData.length; i++)
            {
                if(this.common.isBlank(this.tenantDriverVehicleData[i].tenantId)){
                    this.$message.error("请选择第"+(i+1)+"行供应商！");
                    return false;
                }
                // if(this.common.isBlank(this.tenantDriverVehicleData[i].driverId)){
                //     this.$message.error("请选择第"+(i+1)+"行司机！");
                //     return false;
                // }
                // if(this.common.isBlank(this.tenantDriverVehicleData[i].vehicleId)){
                //     this.$message.error("请选择第"+(i+1)+"行车辆！");
                //     return false;
                // }
                // //司机跟车辆不能重复存在，否则无法确定订单计划需要派给哪个供应商
                // for (let j = 0; j < this.tenantDriverVehicleData.length; j++)
                // {
                //     if(i==j){
                //         continue;
                //     }
                //     if(this.common.isNotBlank(this.tenantDriverVehicleData[j].driverId) && this.tenantDriverVehicleData[i].driverId == this.tenantDriverVehicleData[j].driverId){
                //         this.$message.error("无法保存重复的司机下单，请核对第"+(i+1)+"行和第"+(j+1)+"行！");
                //         return false;
                //     }
                //     if(this.common.isNotBlank(this.tenantDriverVehicleData[j].vehicleId) && this.tenantDriverVehicleData[i].vehicleId == this.tenantDriverVehicleData[j].vehicleId){
                //         this.$message.error("无法保存重复的车辆下单，请核对第"+(i+1)+"行和第"+(j+1)+"行！");
                //         return false;
                //     }
                // }
            }
            return true;
        },
        async syncOrderDistance(flag)
        {
            if (flag)
                return;
            this.orderPlan.farthestDistanceInfo = null;
            this.orderPlan.predictTime = null;
            let count = 0;
            for (let i = 0; i < this.workData.length; i++)
            {
                let work = this.workData[i];
                if (this.common.isNotBlank(work.latitude) && this.common.isNotBlank(work.longitude))
                    count++;
            }
            if (count < 2)
                return;
            let data =  await this.common.postUrl("orderTF", "getOrderDistance", {"workList": this.workData});
            if (this.common.isNotBlank(data.farthestDistanceInfo))
            {
                this.orderPlan.farthestDistanceInfo = data.farthestDistanceInfo;
                this.orderPlan.predictTime = data.predictTime;
                this.$forceUpdate();
            }
        },
        /** 保存订单计划 */
        saveOrdPlan(){
            let flag = this.saveOrdPlanSuccess();
            if(flag){
                let param = {};
                this.orderPlan.goodsCountSum = this.goodsCountSum;
                this.orderPlan.goodsWeightSum = this.goodsWeightSum;
                this.orderPlan.goodsVolumeSum = this.goodsVolumeSum;
                param.orderPlan = this.orderPlan;
                param.workData = this.workData;
                param.incomeFee = this.incomeFee;
                param.costFee = this.costFee;
                param.goodsData = this.goodsData;
                param.tenantDriverVehicleData = this.tenantDriverVehicleData;
                //保存订单计划
                let that = this;
                this.common.postUrl("ordPlanTF", "saveOrdPlanInfo", param, function (data) {
                    if(that.common.isNotBlank(data)){
                        that.$message.success("保存成功！");
                        that.close();
                        that.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
                    }
                },null,'',true);
            }
        },
        
        /** 关闭页面 */
        close(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
}
