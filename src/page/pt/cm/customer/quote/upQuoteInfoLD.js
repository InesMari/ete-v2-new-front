import mycity from '@/components/mycity/mycity.vue'
import enumData from "@/page/pt/enum";

export default {
    name: 'upQuoteInfoLD',
    data() {
        return {
            quoteInfo: {},//报价信息
            tenantData:[],//客户数组
            quoteLevelData:[],//报价级别数组
            feeTypeData:[],//费用类型数组
            rangeUnitData:[],//区间单位数组
            billingTypeData:[],//计费方式数组
            workData: [],//客户货物作业点数组
            goodsData:[],//客户货物数组
            goodsGroupData: this.initGoodsGroupData(),//货物分组的组集合
            array: [],
            modifyType:this.$route.query.modifyType,
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
    components: {
        mycity,
    },
    /**
     * 绑定函数
     */
    methods:
        {
            async init()
            {
                let that = this;
                //客户
                await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data)
                {
                    that.tenantData = data;
                });
                //报价级别
                await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"QUOTE_LEVEL"}, function (data) {
                    that.quoteLevelData = data;
                });
                //费用类型
                await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"FEE_TYPE"}, function (data) {
                    that.feeTypeData = data;
                });
                //区间单位
                await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"RANGE_UNIT"}, function (data) {
                    that.rangeUnitData = data;
                });
                //计费方式
                await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"QUOTE_BILLING_TYPE"}, function (data) {
                    that.billingTypeData = data;
                });
                //根据报价ID查询报价信息
                if(this.common.isBlank(this.$route.query.sectionId)){
                    this.$message.error("请传入需要修改的报价编号！");
                    return false;
                }
                let data = await this.common.postUrl("quoteLDNewTF", "queryQuoteInfoById", {sectionId:this.$route.query.sectionId});
                that.quoteInfo = data.quoteInfo;
                that.array = data.detailData;
                //客户货物
                that.goodsGroupData[1].goodsData = await that.loadGoodsData(enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
                that.goodsGroupData[2].goodsData = await that.loadGoodsData(enumData.GOODS_TYPE.PACK_GOODS);
                that.array.forEach(item => {
                    item.goodsData = that.goodsData;
                    if(item.feeType=="1" || item.feeType=="3"){
                        item.billingType = "1";
                        item.goodsId = ['0'];
                        item.disBillingType = true;
                        item.isDisable = true;
                    }
                    //计费方式按件数，货物默认通用不可选
                    if(item.billingType!="5"){
                        item.goodsId = ['0'];
                        item.isDisable = true;
                    }
                    //计费方式按件数，区间和区间单位不可编辑
                    if(item.billingType=='5'){
                        item.rangeDisable = true;
                    }else{
                        item.rangeDisable = false;
                    }
                    item.goodsGroupData = that.common.copyObj(that.goodsGroupData);
                    that.changeGoodsId(item);//调用改变设置禁用相关
                })
                that.$forceUpdate();
                },
            /**
             * 加载客户货物数据
             * @param type 1 常规货物  2 包装货物
             * @returns {Promise<unknown>}
             */
            async loadGoodsData(type)
            {
                let goodsData = await this.common.postUrl("workGoodsTF","queryGoodsDataByTenantId", {tenantId : this.quoteInfo.tenantId, type: type});
                goodsData.forEach(item => {item.disabled = false; item.goodsId = item.goodsId + ""; });
                return goodsData;
            },
            forceUpdate(){
                this.$forceUpdate();
            },
            /**
             * 改变费用类型 提送货费时，计费方式只能是按票
             */
            changeFeeType(index)
            {
                if(this.array[index].feeType=="1" || this.array[index].feeType=="3"){
                    this.array[index].billingType = '1';
                    this.array[index].goodsId = ['0'];
                    this.array[index].disBillingType = true;
                    this.array[index].isDisable = true;
                }else{
                    this.array[index].disBillingType = false;
                }
            },
            /**
             * 改变计费方式 只有计费方式为按件数时，货物才可以选择，其他情况默认通用，不可选
             * 按件数，区间和区间单位不可编辑
             */
            changebillingType(index)
            {
                if(this.array[index].billingType==5){
                    this.array[index].isDisable = false;
                    this.array[index].rangeStart = '';
                    this.array[index].rangeEnd = '';
                    this.array[index].rangeUnit = '1';
                    this.array[index].rangeDisable = true;
                }else{
                    this.array[index].goodsId = ['0'];
                    this.array[index].isDisable = true;
                    this.array[index].rangeDisable = false;
                }
            },
            /**
             * 初始化货物的分组数据
             */
            initGoodsGroupData()
            {
                this.goodsGroupData = [{
                    label: '全部货物',
                    goodsData: [{goodsId: "0", goodsName: "通用"}]
                }, {
                    label: '客户所有货物',
                    goodsData: [],
                }, {
                    label: '客户包装货物',
                    goodsData: [],
                }];
                return this.goodsGroupData;
            },
            /**
             *  初始化货物可选择状态
             */
            initGoodsDisabled(obj)
            {
                obj.goodsGroupData[0].goodsData.forEach(item => {
                    item.disabled = false;
                });
                obj.goodsGroupData[1].goodsData.forEach(item => {
                    item.disabled = false;
                });
                obj.goodsGroupData[2].goodsData.forEach(item => {
                    item.disabled = false;
                });
                return obj.goodsGroupData;
            },
            /**
             * 改变货物
             * @param data
             */
            changeGoodsId(data)
            {
                if (this.common.isBlank(data.goodsId) || data.goodsId.length === 0)
                    this.initGoodsDisabled(data);//没有选择货物了 全部可以选择
                else
                {
                    let selectCount = this.dealGoods(data, data.goodsGroupData[0].goodsData);
                    if (selectCount == data.goodsGroupData[0].goodsData.length) //选择了通用其他默认选上
                        this.disabledGoods(data);
                    else
                    {
                        let selectCount1 = this.dealGoods(data, data.goodsGroupData[1].goodsData);
                        let selectCount2 = this.dealGoods(data, data.goodsGroupData[2].goodsData);
                        if (selectCount1 + selectCount2 == data.goodsGroupData[1].goodsData.length + data.goodsGroupData[2].goodsData.length)
                        {
                            // 勾选除通用之外所有等于通用
                            data.goodsId = [];
                            data.goodsId.push("0");
                            this.disabledGoods(data);
                        }
                    }
                }
            },
            /**
             * 禁用货物下拉选择项
             */
            disabledGoods(data)
            {
                data.goodsGroupData[1].goodsData.forEach(item => {
                    item.disabled = true;
                });
                data.goodsGroupData[2].goodsData.forEach(item => {
                    item.disabled = true;
                });
            },
            /**
             * 处理货物的可选禁用相关
             */
            dealGoods(data, array)
            {
                let selectCount = 0;
                array.forEach(el => {
                    let find = false;
                    let selectAll = false;
                    data.goodsId.forEach(item => {
                        if (item == el.goodsId)
                            find = true;
                        if (item == "0")
                            selectAll = true;
                    })
                    if (data.goodsId.length > 0 && selectAll)//选中多个再选通用 等于只有通用
                    {
                        data.goodsId = [];
                        data.goodsId.push("0");
                    }
                    el.disabled = find || selectAll;
                    if (el.disabled) ++selectCount;
                });
                return selectCount;
            },
            /**
             * 添加报价
             * @returns {boolean}
             */
            addItem()
            {
                if (this.array.length >= 20)
                {
                    this.$message.error("不允许超过20条报价信息！");
                    return false;
                }
                this.array.push({id:null,feeType: '1', rangeUnit: '1',billingType: '1',goodsGroupData:this.common.copyObj(this.goodsGroupData),goodsId: ['0'],isDisable: true,disBillingType: true,rangeDisable: false});
            },
            /**
             * 移除
             * @param index
             */
            removeItem(index)
            {
                if (this.array.length > 1){ this.array.splice(index, 1); }
            },
            /**
             * 关闭界面
             */
            close()
            {
                this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
            },
            /**
             * 保存提交
             */
            submit()
            {
                if (this.common.isBlank(this.quoteInfo.tenantId))
                {
                    this.$message.error("请选择客户！");
                    return false;
                }
                if (this.common.isBlank(this.quoteInfo.quoteLevel))
                {
                    this.$message.error("请选择报价级别！");
                    return false;
                }
                if (this.quoteInfo.quoteLevel==1)
                {//按作业点
                    if ((this.common.isBlank(this.quoteInfo.beginWorkId)))
                    {
                        this.$message.error("请选择起始地作业点信息！");
                        return false;
                    }
                    if (this.common.isBlank(this.quoteInfo.endWorkId))
                    {
                        this.$message.error("请选择目的地的作业点信息！");
                        return false;
                    }
                    this.workData.forEach(item => {
                        if (this.quoteInfo.beginWorkId == item.workId) this.quoteInfo.beginWorkName = item.workName;
                        if (this.quoteInfo.endWorkId == item.workId) this.quoteInfo.endWorkName = item.workName;
                    });
                    if (this.quoteInfo.beginWorkId === this.quoteInfo.endWorkId)
                    {
                        this.$message.error("报价的起始地作业点和目的地作业点不能相同！");
                        return false;
                    }
                }else if (this.quoteInfo.quoteLevel==2)
                {//按区域
                    if(this.common.isBlank(this.quoteInfo.beginCityId)){
                        this.$message.error("请选择起始地的省市信息！");
                        return false;
                    }
                    if(this.common.isBlank(this.quoteInfo.endCityId)){
                        this.$message.error("请选择目的地的省市信息！");
                        return false;
                    }
                    if(this.quoteInfo.beginCityId==this.quoteInfo.endCityId){
                        if((this.common.isBlank(this.quoteInfo.beginDistrictId) && this.common.isBlank(this.quoteInfo.endDistrictId))
                            || this.quoteInfo.beginDistrictId==this.quoteInfo.endDistrictId){
                            this.$message.error("相同的起始地/目的地地区无法保存报价！");
                            return false;
                        }
                    }
                }
                if (this.array.length === 0)
                {
                    this.$message.error("请至少输入一条报价费用！");
                    return false;
                }
                //计费方式、同一个区间、区间单位、相同费用类型只能存在一条
                //按件数，区间和区间单位可以空
                for(let i = 0; i < this.array.length; i++)
                {
                    if(this.common.isBlank(this.array[i].feeType)){
                        this.$message.error("请选择第"+(i+1)+"行费用类型！");
                        return false;
                    }
                    // if(this.common.isBlank(this.array[i].rangeStart) && this.array[i].billingType!='5'){
                    //     this.$message.error("请输入第"+(i+1)+"行起始区间值！");
                    //     return false;
                    // }
                    if(this.common.isNotBlank(this.array[i].rangeEnd) && this.common.isBlank(this.array[i].rangeStart)){
                        this.$message.error("请输入第"+(i+1)+"行起始区间值！");
                        return false;
                    }
                    if(this.common.isNotBlank(this.array[i].rangeStart) && this.common.isNotBlank(this.array[i].rangeEnd) &&
                        ((Number(this.array[i].rangeStart)>Number(this.array[i].rangeEnd) || this.array[i].rangeStart==this.array[i].rangeEnd))){
                        this.$message.error("请输入第"+(i+1)+"行正确的区间值！");
                        return false;
                    }
                    if(this.common.isBlank(this.array[i].rangeUnit) && this.array[i].billingType!='5'){
                        this.$message.error("请选择第"+(i+1)+"行区间单位！");
                        return false;
                    }
                    if(this.common.isBlank(this.array[i].billingType)){
                        this.$message.error("请选择第"+(i+1)+"行计费方式！");
                        return false;
                    }
                    if(this.common.isBlank(this.array[i].goodsId.length==0)){
                        this.$message.error("请选择第"+(i+1)+"行货物！");
                        return false;
                    }
                    if(this.common.isBlank(this.array[i].fee)){
                        this.$message.error("请输入第"+(i+1)+"行费用！");
                        return false;
                    }
                }
                //按件数，区间和区间单位不可编辑
                let array_ = [];
                let keyMap = new Map();//货物MAP
                let rangeMap = new Map();//区间MAP
                for(let i = 0; i < this.array.length; i++)
                {
                    let key = this.array[i].feeType+"-"+this.array[i].billingType;
                    if(this.array[i].billingType!=5){
                        key += "-"+(this.common.isBlank(this.array[i].rangeStart) ? "0" : this.array[i].rangeStart)
                            +"-"+(this.common.isBlank(this.array[i].rangeEnd) ? "0" : this.array[i].rangeEnd)
                            +"-"+this.array[i].rangeUnit;
                    }
                    /** 货物校验 */
                    //把货物ID 存入Set，放入Map的value
                    let keySet = keyMap.get(key);
                    if(this.common.isBlank(keySet)){
                        keySet = new Set();
                    }
                    //如果有通用，直接算重复
                    if(keySet.has("0")){
                        this.$message.error("第"+(i+1)+"行存在重复报价信息！");
                        return false;
                    }
                    for (let j = 0; j < this.array[i].goodsId.length; j++) {
                        if(keySet.has(this.array[i].goodsId[j])){
                            this.$message.error("第"+(i+1)+"行存在重复报价信息！");
                            return false;
                        }
                    }
                    for (let j = 0; j < this.array[i].goodsId.length; j++) {
                        if(i==this.array.length-1 && this.array[i].goodsId[j]=="0" && keySet.size>0){
                            this.$message.error("第"+(i+1)+"行存在重复报价信息！");
                            return false;
                        }
                        keySet.add(this.array[i].goodsId[j]);
                    }
                    keyMap.set(key,keySet);

                    /** 区间校验 区间可以保存空无穷大，也算一种类型、按件数区间和区间单位不可编辑不用校验*/
                    let rangeKey = this.array[i].feeType+"-"+this.array[i].billingType+"-"+this.array[i].rangeUnit;
                    if(this.array[i].billingType!=5){
                        let rangeList = rangeMap.get(rangeKey);
                        if(this.common.isBlank(rangeList)){
                            rangeList = [];
                        }
                        let rangeStr_ = (this.common.isBlank(this.array[i].rangeStart) ? "0" : this.array[i].rangeStart)
                            + "," +
                            (this.common.isBlank(this.array[i].rangeEnd) ? "0" : this.array[i].rangeEnd);
                        for (let j = 0; j < rangeList.length; j++) {
                            let rangeStr = rangeList[j];
                            let rangeStrData = rangeStr.split(",");
                            let rangeStart = rangeStrData[0];
                            let rangeEnd = rangeStrData[1];

                            if(rangeStr_ == rangeStr){//value相等 不能重复
                                this.$message.error("第"+(i+1)+"行存在重复报价信息！");
                                return false;
                            }
                            if(rangeEnd == "0"){
                                if(this.common.isBlank(this.array[i].rangeEnd)){//当前这条为空 重复
                                    this.$message.error("第"+(i+1)+"行存在重复报价信息！");
                                    return false;
                                }else{
                                    if(Number(this.array[i].rangeEnd)>=Number(rangeStart)){
                                        this.$message.error("第"+(i+1)+"行存在重复报价信息！");
                                        return false;
                                    }
                                }
                            }else{
                                if(this.common.isBlank(this.array[i].rangeEnd)){//当前这条为无穷大
                                    if(this.common.isBlank(this.array[i].rangeStart)){//起始也为空rangeList>0 报异常
                                        if(rangeList.size>0){
                                            this.$message.error("第"+(i+1)+"行存在重复报价信息！");
                                            return false;
                                        }
                                    }else{
                                        if(Number(rangeEnd)>=Number(this.array[i].rangeStart)){
                                            this.$message.error("第"+(i+1)+"行存在重复报价信息！");
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                        rangeList.push(rangeStr_);
                        rangeMap.set(rangeKey,rangeList);
                    }

                    //校验通过，将货物ID转换成字符串
                    let goodsIsStr = "";
                    for(let k = 0; k < this.array[i].goodsId.length; k++)
                    {
                        goodsIsStr += this.array[i].goodsId[k]+",";
                    }
                    array_.push({
                        feeType:this.array[i].feeType,
                        rangeStart:this.array[i].rangeStart,
                        rangeEnd:this.array[i].rangeEnd,
                        rangeUnit:this.array[i].rangeUnit,
                        billingType:this.array[i].billingType,
                        goodsId:goodsIsStr.substring(0,goodsIsStr.length-1),
                        fee:this.array[i].fee,
                        id:this.array[i].id,//从后台匹配出来的报价信息ID，有ID该条报价信息做修改
                    });
                }

                this.quoteInfo.array = JSON.stringify(array_);
                this.quoteInfo.quoteType = 1;//客户报价
                let that = this;
                this.common.postUrl("quoteLDNewTF","upQuoteInfo", this.quoteInfo, function (data)
                {
                    that.$message.success("保存成功！");
                    that.$parent.loadTodoData();
                    that.close();
                },null,'',true);
            },
        },
}
