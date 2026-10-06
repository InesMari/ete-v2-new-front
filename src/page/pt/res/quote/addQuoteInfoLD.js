import mycity from '@/components/mycity/mycity.vue'
import enumData from "@/page/pt/enum";
import mapDialog from "@/components/mapDialog/mapDialog.vue";

export default {
    name: 'addQuoteInfoLD',
    data() {
        return {
            quoteInfo: {
                effectDate:this.common.formatDate.getDate(),//当天
                expireDate:this.common.formatDate.year()+'-12-31',//年底
                specifyTenantId: null
            },//报价信息
            showBeginWorkSelect: true,//起始地默认展开作业点
            showEndWorkSelect: true,//目的地默认展开作业点
            showBeginCity: false,//起始地省市区展示
            showEndCity: false,//目的地省市区展示
            supplierData:[],//供应商
            specifyTenantData:[],//指定客户数组
            quoteLevelData:[],//报价级别数组
            feeTypeData:[],//费用类型数组
            rangeUnitData:[],//区间单位数组
            billingTypeData:[],//计费方式数组
            workData: [],//客户货物作业点数组
            goodsData:[],//客户货物数组
            goodsGroupData: this.initGoodsGroupData(),//货物分组的组集合
            array: [],

            showWork: false,
            showWorkButton: false,
            workInfo: this.initWorkInfo(),
            provinceData: [],//所有省份
            cityData: [],//所有城市
            districtData: [],//所有区县
            isShowMap: false,//显示地图
            mapPoint:null,
            showMapBotton: false,//地图按钮显示
            isNotDistrict: true,//地图区域没有返回提供选择
            city: this.initCity(),
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
        mapDialog,
    },
    /**
     * 绑定函数
     */
    methods: {
            stringToDate(dateStr,separator){
                if(!separator){
                    separator="-";
                }
                var dateArr = dateStr.split(separator);
                var year = parseInt(dateArr[0]);
                var month;
                //处理月份为04这样的情况
                if(dateArr[1].indexOf("0") == 0){
                    month = parseInt(dateArr[1].substring(1));
                }else{
                    month = parseInt(dateArr[1]);
                }
                var day = parseInt(dateArr[2]);
                var date = new Date(year,month -1,day);
                return date;
            },
            async init() {
                let that = this;
                //加载静态枚举
                this.common.postUrl("selectStaticDataTF", "selectProvince", {}, function (data) {
                    that.provinceData = data;
                });
                //
                this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                    that.supplierData = data;
                    if (that.common.isNotBlank(that.$route.query.supplierId)) {
                        that.supplierData.forEach(item => {
                            if (that.$route.query.supplierId == item.tenantId) {
                                that.quoteInfo.tenantId = Number(that.$route.query.supplierId);
                                return;
                            }
                        });
                    }
                });
                //指定客户
                this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data) {
                    that.specifyTenantData = data;
                });
                this.queryWorkStorehouseDataNoPage();
                //报价级别
                this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUOTE_LEVEL"}, function (data) {
                    that.quoteLevelData = data;
                    that.quoteInfo.quoteLevel = that.quoteLevelData[0].codeValue;
                    that.showWorkButton = true;
                });
                //费用类型
                this.common.postUrl("commonTF", "getSysStaticData", {codeType: "FEE_TYPE"}, function (data) {
                    that.feeTypeData = data;
                });
                //区间单位
                this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RANGE_UNIT"}, function (data) {
                    that.rangeUnitData = data;
                });
                //计费方式
                this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUOTE_BILLING_TYPE"}, function (data) {
                    that.billingTypeData = data;
                });

                this.array.push({
                    feeType: '1',
                    rangeUnit: '1',
                    billingType: '1',
                    goodsGroupData: that.common.copyObj(that.goodsGroupData),
                    goodsId: ['0'],
                    isDisable: true,
                    disBillingType: true,
                    rangeDisableo: false
                });
                if(this.common.isNotBlank(this.$route.query.sectionId)) {
                    let data = await this.common.postUrl("quoteLDNewTF", "queryQuoteInfoById", {sectionId: this.$route.query.sectionId});
                    if (this.common.isNotBlank(data.quoteInfo.specifyTenantId)) {
                        that.quoteInfo = this.common.copyObj(data.quoteInfo);
                        await that.changeSpecifyTenant(data.quoteInfo.specifyTenantId);
                    }
                    that.quoteInfo = this.common.copyObj(data.quoteInfo);
                    that.quoteInfo.sectionId='';
                    that.quoteInfo.tenantId = Number(data.quoteInfo.tenantId);
                    let expireDate = this.stringToDate(that.quoteInfo.expireDate);
                    expireDate.setDate(expireDate.getDate()+1);
                    let year = expireDate.getFullYear();
                    let month = expireDate.getMonth() + 1;
                    let day = expireDate.getDate();
                    that.quoteInfo.effectDate=year +"-" + (month<10?'0'+month:month) +"-" + (day<10?'0'+day:day);//当天
                    that.quoteInfo.expireDate=year+'-12-31';//年底
                    if (that.quoteInfo.quoteLevel == enumData.quoteLevel.PRESS_REGION)
                    {
                        that.showBeginWorkSelect = false;
                        that.showEndWorkSelect = false;
                        that.showBeginCity = true;
                        that.showEndCity = true;
                        if(that.quoteInfo.beginProvinceId){
                            await that.$refs.beginCity.initData(that.quoteInfo.beginProvinceId,that.quoteInfo.beginCityId,that.quoteInfo.beginDistrictId,null);
                        }else{
                            await that.$refs.beginCity.cleanData();
                        }
                        if(that.quoteInfo.endProvinceId){
                            await that.$refs.endCity.initData(that.quoteInfo.endProvinceId,that.quoteInfo.endCityId,that.quoteInfo.endDistrictId,null);
                        }else{
                            await that.$refs.endCity.cleanData();
                        }
                    }
                    that.chengeWork();
                    that.array = data.detailData;
                    //客户货物
                    if (this.common.isNotBlank(this.quoteInfo.specifyTenantId)) {
                        that.goodsGroupData[1].goodsData = await that.loadGoodsData(enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
                        that.goodsGroupData[2].goodsData = await that.loadGoodsData(enumData.GOODS_TYPE.PACK_GOODS);
                    }
                    that.array.forEach(item => {
                        item.goodsData = that.goodsData;
                        if (item.feeType == "1" || item.feeType == "3") {
                            item.billingType = "1";
                            item.goodsId = ['0'];
                            item.disBillingType = true;
                            item.isDisable = true;
                        }
                        //计费方式按件数、指定客户为空，货物默认通用不可选
                        if (item.billingType != "5" || that.common.isBlank(that.quoteInfo.specifyTenantId)) {
                            item.goodsId = ['0'];
                            item.isDisable = true;
                        }
                        //计费方式按件数，区间和区间单位不可编辑
                        if (item.billingType == '5') {
                            item.rangeDisable = true;
                        } else {
                            item.rangeDisable = false;
                        }
                        item.goodsGroupData = that.common.copyObj(that.goodsGroupData);
                        that.changeGoodsId(item);//调用改变设置禁用相关
                    })
                    that.$forceUpdate();
                }

            },
            async queryWorkStorehouseDataNoPage()
            {
                //指定客户作业点&所有仓库，默认查询所有仓库
                let data = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {tenantId : 0,isLoadPTWork: 1,isLoadStoreHouse: 1});
                this.workData = data;
                this.workData.forEach(item => {
                    item.disabled = false;
                })
            },
            /**
             * 改变指定客户
             */
            async changeSpecifyTenant(data)
            {
                this.showWorkButton = this.quoteInfo.quoteLevel == 1 && this.common.isBlank(this.quoteInfo.specifyTenantId);

                //清空作业点信息
                this.quoteInfo.beginWorkId = '';
                this.quoteInfo.endWorkId = '';
                if(this.common.isBlank(data)){
                    this.workData = [];
                    this.initGoodsGroupData();
                    return;
                }
                let that = this;
                //指定客户作业点
                await this.common.postUrl("workGoodsTF","queryWorkDataSelect", {tenantId : data, isLoadPTWork: 1,isLoadStoreHouse: 1}, function (data)
                {
                    that.workData = data;
                    that.workData.forEach(item => {
                        item.disabled = false;
                    })
                });
                this.goodsGroupData[1].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
                this.goodsGroupData[2].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.PACK_GOODS);
                this.array.forEach(item => {
                    item.goodsGroupData = that.common.copyObj(that.goodsGroupData);//初始化货物
                    item.goodsId = ['0'];
                    //选择指定客户、计费方式按件数，货物可以选择
                    if(item.billingType=="5"){
                        item.isDisable = false;
                    }
                    this.$forceUpdate();
                })
                this.queryQuoteHisData();
            },
            /**
             * 加载客户货物数据
             * @param type 1 常规货物  2 包装货物
             * @returns {Promise<unknown>}
             */
            async loadGoodsData(type)
            {
                let goodsData = await this.common.postUrl("workGoodsTF","queryGoodsDataByTenantId", {tenantId : this.quoteInfo.specifyTenantId, type: type});
                goodsData.forEach(item => {item.disabled = false; item.goodsId = item.goodsId + ""; });
                return goodsData;
            },
            /**
             * 改变报价级别
             */
            changeQuoteLevel(data)
            {
                if(data==1){//显示作业点
                    this.showWorkButton = this.common.isBlank(this.quoteInfo.specifyTenantId);
                    this.showBeginWorkSelect = true;
                    this.showEndWorkSelect = true;
                    this.showBeginCity = false;
                    this.showEndCity = false;
                    this.$refs.beginCity.cleanData();
                    this.$refs.beginCity.close();
                    this.$refs.endCity.cleanData();
                    this.$refs.endCity.close();
                }else if(data==2){//显示省市区
                    this.showWorkButton = false;
                    this.showBeginWorkSelect = false;
                    this.showEndWorkSelect = false;
                    this.showBeginCity = true;
                    this.showEndCity = true;
                    this.quoteInfo.beginWorkId = '';
                    this.quoteInfo.beginProvinceId = '';
                    this.quoteInfo.beginCityId = '';
                    this.quoteInfo.beginDistrictId = '';
                    this.quoteInfo.beginAddressStr = '';
                    this.quoteInfo.endWorkId = '';
                    this.quoteInfo.endProvinceId = '';
                    this.quoteInfo.endCityId = '';
                    this.quoteInfo.endDistrictId = '';
                    this.quoteInfo.endAddressStr = '';
                }
                this.queryQuoteHisData();
            },
            forceUpdate(){
                this.$forceUpdate();
            },
            /**
             * 改变作业点
             */
            chengeWork()
            {
                this.workData.forEach(item => {
                    if (this.quoteInfo.beginWorkId == item.workId || this.quoteInfo.endWorkId == item.workId)
                    {
                        if (this.quoteInfo.beginWorkId == item.workId)
                        {
                            this.quoteInfo.beginProvinceId = item.provinceId;
                            this.quoteInfo.beginCityId = item.cityId;
                            this.quoteInfo.beginDistrictId = item.districtId;
                            this.quoteInfo.beginAddressStr = item.workAddressStr;
                        }
                        if (this.quoteInfo.endWorkId == item.workId)
                        {
                            this.quoteInfo.endProvinceId = item.provinceId;
                            this.quoteInfo.endCityId = item.cityId;
                            this.quoteInfo.endDistrictId = item.districtId;
                            this.quoteInfo.endAddressStr = item.workAddressStr;
                        }
                        item.disabled = true;
                    }
                    else { item.disabled = false; }
                })
                this.$forceUpdate();
                this.queryQuoteHisData();
            },
            /**
             * 改变供应商、报价级别、作业点区域、指定客户、运输时效，根据供应商、报价级别、起始地、目的地、指定客户、运输时效查询所有零担报价
             */
            queryQuoteHisData()
            {
                if(this.common.isBlank(this.quoteInfo.tenantId) || this.common.isBlank(this.quoteInfo.quoteLevel)
                     || this.common.isBlank(this.quoteInfo.transportTimeliness)){
                    return;
                }
                // let param = {};
                // param.tenantId = this.quoteInfo.tenantId;
                // param.quoteLevel = this.quoteInfo.quoteLevel;
                // param.specifyTenantId = this.quoteInfo.specifyTenantId;
                // param.transportTimeliness = this.quoteInfo.transportTimeliness;
                // if(this.quoteInfo.quoteLevel==1){
                //     if(this.common.isBlank(this.quoteInfo.beginWorkId) || this.common.isBlank(this.quoteInfo.endWorkId)){
                //         return ;
                //     }
                //     param.beginWorkId = this.quoteInfo.beginWorkId;
                //     param.endWorkId = this.quoteInfo.endWorkId;
                // }else if(this.quoteInfo.quoteLevel==2){
                //     if(this.common.isBlank(this.quoteInfo.beginProvinceId) || this.common.isBlank(this.quoteInfo.beginCityId)
                //     || this.common.isBlank(this.quoteInfo.endProvinceId) || this.common.isBlank(this.quoteInfo.endCityId)){
                //         return ;
                //     }
                //     param.beginProvinceId = this.quoteInfo.beginProvinceId;
                //     param.beginCityId = this.quoteInfo.beginCityId;
                //     param.beginDistrictId = this.quoteInfo.beginDistrictId;
                //     param.endProvinceId = this.quoteInfo.endProvinceId;
                //     param.endCityId = this.quoteInfo.endCityId;
                //     param.endDistrictId = this.quoteInfo.endDistrictId;
                // }
                // param.quoteType = 2;
                // let that = this;
                // this.common.postUrl("quoteLDNewTF","queryLDQuoteDataByTenantId", param, function (data)
                // {
                //     //如果匹配出来，该次保存操作当做修改
                //     if(data.length>0){
                //         that.array = data;
                //         //这里匹配出来后赋值报价主键做修改
                //         that.quoteInfo.sectionId = that.array[0].sectionQuoteId;
                //         that.array.forEach(item => {
                //             item.goodsData = that.goodsData;
                //             //提送货费时，计费方式只能是按票
                //             if(item.feeType=="1" || item.feeType=="3"){
                //                 item.billingType = "1";
                //                 item.goodsId = ['0'];
                //                 item.disBillingType = true;
                //                 item.isDisable = true;
                //             }
                //             //只有计费方式为按件数时，货物才可以选择，其他情况默认通用，不可选
                //             if(item.billingType!="5"){
                //                 item.goodsId = ['0'];
                //                 item.isDisable = true;
                //             }else{//按件数，区间和区间单位不可编辑
                //                 item.rangeStart = '';
                //                 item.rangeEnd = '';
                //                 item.rangeUnit = '1';
                //                 item.rangeDisable = true;
                //             }
                //             item.goodsGroupData = that.common.copyObj(that.goodsGroupData);
                //             that.changeGoodsId(item);//调用改变设置禁用相关
                //         })
                //     }else{
                //         if(that.common.isNotBlank(that.quoteInfo.sectionId)){
                //             //重新赋空，以免匹配后重新选择新增
                //             that.quoteInfo.sectionId = '';
                //             that.array = [{feeType: '1', rangeUnit: '1',billingType: '1',goodsGroupData:that.common.copyObj(that.goodsGroupData),goodsId: ['0'],isDisable: true,disBillingType: true,rangeDisable: false}];
                //         }
                //     }
                // });
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
             * 没有选择指定客户时，货物默认通用，不可选
             * 按件数，区间和区间单位不可编辑
             */
            changebillingType(index)
            {
                if(this.array[index].billingType==5 && this.common.isNotBlank(this.quoteInfo.specifyTenantId)){
                    this.array[index].isDisable = false;
                }else{
                    this.array[index].goodsId = ['0'];
                    this.array[index].isDisable = true;
                }
                if(this.array[index].billingType==5){
                    this.array[index].rangeStart = '';
                    this.array[index].rangeEnd = '';
                    this.array[index].rangeUnit = '1';
                    this.array[index].rangeDisable = true;
                }else{
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
             * 鼠标聚焦货物输入框
             */
            focusGoods()
            {
                if (this.common.isBlank(this.quoteInfo.tenantId))
                    this.$message.info("请先选择客户！");
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
             * 起始地省市区选择回调
             * @param data
             */
            selectBeginCallback(data)
            {
                this.quoteInfo.beginProvinceId = data.ProvinceId;
                this.quoteInfo.beginCityId = data.CityId;
                this.quoteInfo.beginDistrictId = data.DistrictId;
                this.quoteInfo.beginAddressStr = data.ProvinceName + data.CityName + data.DistrictName;
                this.queryQuoteHisData();
            },
            /**
             * 目的地省市区选择回调
             * @param data
             */
            selectEndCallback(data)
            {
                this.quoteInfo.endProvinceId = data.ProvinceId;
                this.quoteInfo.endCityId = data.CityId;
                this.quoteInfo.endDistrictId = data.DistrictId;
                this.quoteInfo.endAddressStr = data.ProvinceName + data.CityName + data.DistrictName;
                this.queryQuoteHisData();
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
                this.array.push({feeType: '1', rangeUnit: '1',billingType: '1',goodsGroupData:this.common.copyObj(this.goodsGroupData),goodsId: ['0'],isDisable: true,disBillingType: true,rangeDisable: false});
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
                    this.$message.error("请选择供应商！");
                    return false;
                }
                if (this.common.isBlank(this.quoteInfo.quoteLevel))
                {
                    this.$message.error("请选择报价级别！");
                    return false;
                }
                if (this.common.isBlank(this.quoteInfo.transportTimeliness))
                {
                    this.$message.error("请输入运输时效！");
                    return false;
                }
                if (this.common.isBlank(this.quoteInfo.effectDate))
                {
                    this.$message.error("请选择生效日期！");
                    return false;
                }
                if (this.common.isBlank(this.quoteInfo.expireDate))
                {
                    this.$message.error("请选择失效日期！");
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
                //计费方式、同一个区间、区间单位、相同费用类型、货物只能存在一条
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
                    if(this.array[i].goodsId.length==0){
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
                this.quoteInfo.quoteType = 2;//供应商报价
                let that = this;
                let methodName = "addQuoteInfo";
                if(this.common.isNotBlank(this.quoteInfo.sectionId)){
                    methodName = "upQuoteInfo";
                }
                this.common.postUrl("quoteLDNewTF",methodName, this.quoteInfo, function (data)
                {
                    that.$message.success("保存成功！");
                    that.$parent.loadTodoData();
                    that.close();
                },null,'',true);
            },


            /************* 后期追加便捷新增仓库 *************/
            /** 选中省份 */
            changeProvinceSelect() {
                let that = this;
                this.common.postUrl("selectStaticDataTF", "selectCity", {provinceId: this.workInfo.provinceId}, function (data) {
                    that.cityData = data;
                });
            },
            /** 选中城市 */
            changeCitySelect() {
                let that = this;
                this.common.postUrl("selectStaticDataTF", "selectDistrict", {cityId: this.workInfo.cityId}, function (data) {
                    that.districtData = data;
                });
                for (let i = 0; i < this.cityData.length; i++)
                {
                    let item = this.cityData[i];
                    if (this.workInfo.cityId == item.id)
                    {
                        this.city.city = item.name;
                        break;
                    }
                }
                this.changeWorkName();
            },
            changeDistrictSelect()
            {
                for (let i = 0; i < this.districtData.length; i++)
                {
                    let item = this.districtData[i];
                    if (this.workInfo.districtId == item.id)
                    {
                        this.city.district = item.name;
                        break;
                    }
                }
                this.changeWorkName();
            },
            initWorkInfo()
            {
                return this.workInfo = {
                    workinfoType: '2',
                    electricFence: 300,
                    index: null,
                    tenantId: 1,
                    isCheckExistSameAddress: 1,
                    checkWorkRange: 1,
                    workName: '',
                    provinceId: null,
                    cityId: null,
                    districtId: null,
                    address: null,
                    remark: null,
                }
            },
            initCity()
            {
                this.city = {
                    province: null,
                    city: null,
                    district: null,
                    address: null,
                }
            },
            addWork(flag, index)
            {
                this.initWorkInfo();
                if (flag)
                {
                    this.workInfo.index = index;//缓存下对象 保存完更新作业点选择保存的数据ID
                }
                else
                {
                    this.isNotDistrict = true;
                    this.workInfo.index = null;
                }
                this.showWork = flag;
                this.$forceUpdate();
            },
            async saveWorkInfo()
            {
                if(this.common.isBlank(this.workInfo.workName)){
                    this.$message.error("请输入作业点名称！");
                    return;
                }
                if(this.common.isBlank(this.workInfo.provinceId) || this.workInfo.provinceId<0
                        || this.common.isBlank(this.workInfo.cityId) || this.workInfo.cityId<0
                        || this.common.isBlank(this.workInfo.districtId) || this.workInfo.districtId<0){
                    this.$message.error("请选择作业点省市区！");
                    return;
                }
                if(this.common.isBlank(this.workInfo.address)){
                    this.$message.error("请输入作业点街道地址！");
                    return;
                }
                if(this.common.isBlank(this.workInfo.latitude) || this.common.isBlank(this.workInfo.longitude)){
                    this.$message.error("没有获取到作业点经纬度！");
                    return;
                }
                this.$message.success("正在搜索附近是否存在作业点,请稍候!")
                let result = await this.common.postUrl("workGoodsTF", "checkWorkDistance", this.workInfo, null, null,null, true);
                if (result == 'Y') {
                    this.$message.error("该作业点" + result.workDistanceStr + "米范围内存在作业点：" + result.workNameStr);
                    return;
                }
                let index = this.workInfo.index;
                let data = await this.common.postUrl("workGoodsTF", "addWorkInfo", this.workInfo);
                this.addWork(false);
                this.$message.success("保存成功！");
                await this.queryWorkStorehouseDataNoPage();
                this.workData.forEach(item =>
                {
                    let flag = false;
                    if (this.quoteInfo.beginWorkId == item.workId || this.quoteInfo.endWorkId == item.workId)
                        flag = true;
                    item.disabled = flag;
                });
                if (index == 1)
                    this.quoteInfo.beginWorkId = Number(data);
                else if (index == 2)
                    this.quoteInfo.endWorkId = Number(data);
                this.$forceUpdate();
            },
            /** 地图选择省市区 */
            showMap(){
                this.isShowMap = true;
                this.initCity();
            },
            hideMapBack(){
                this.isShowMap = false;
            },
            /** 地图选择省市区回调 */
            async sureWorkAddress(data){
                let addressComponents = data.addressComponents;
                let point = data.point;
                if(this.common.isNotBlank(point)){
                    this.workInfo.latitude = point.lat;
                    this.workInfo.longitude = point.lng;
                }
                if(this.common.isNotBlank(addressComponents)){
                    this.workInfo.address = addressComponents.street;
                    this.city.address = addressComponents.street;
                    if(this.common.isNotBlank(addressComponents.province)){
                        this.city.province = addressComponents.province;
                        let provinceId = await this.common.postUrl("selectStaticDataTF","getProvinceId",{"codeValueName" : addressComponents.province});
                        if(provinceId>0){
                            this.workInfo.provinceId = Number(provinceId);
                            await this.changeProvinceSelect();
                            if(this.common.isNotBlank(addressComponents.city)){
                                this.city.city = addressComponents.city;
                                let cityId = await this.common.postUrl("selectStaticDataTF","getCityId",{"codeValueName":addressComponents.city});
                                if(cityId>0){
                                    this.workInfo.cityId = Number(cityId);
                                    await this.changeCitySelect();
                                }
                                //有区县数据的后台获取对应的ID再回调
                                if(this.common.isNotBlank(addressComponents.district)){
                                    this.city.district = addressComponents.district;
                                    let districtId = await this.common.postUrl("selectStaticDataTF","getDistrictId",{"codeValueName":addressComponents.district,"cityId":cityId});
                                    if(districtId<0){
                                        this.$message.error("很抱歉，系统地址库没有区县:"+addressComponents.district+"，请联系管理人员。");
                                    }
                                    if(this.common.isNotBlank(districtId)){
                                        this.workInfo.districtId = Number(districtId);
                                        let address = '';
                                        address += addressComponents.city + addressComponents.district + addressComponents.street + addressComponents.streetNumber;
                                        this.mapPoint = {addressName:address, point:{"lng":this.workInfo.longitude,"lat":this.workInfo.latitude}};
                                        this.workInfo.workAddressStr = address;
                                    }
                                    this.isNotDistrict = true;
                                    this.changeWorkName();
                                }else{
                                    this.workInfo.districtId = null;
                                    this.isNotDistrict = false;
                                    this.changeWorkName();
                                }
                            }else {
                                this.$message.error("没有匹配到当前位置信息，请手动选择！");
                                this.isNotDistrict = false;
                            }
                        }
                    }
                }
                this.hideMapBack();
                this.$forceUpdate();
            },
            changeAddress()
            {
                this.city.address = this.workInfo.address;
                this.changeWorkName();
            },
            changeWorkName()
            {
                this.workInfo.workName = this.city.city + (this.common.isBlank(this.city.district) ? '' : this.city.district) + (this.common.isBlank(this.city.address) ? '' : this.city.address);
                this.$forceUpdate();
            }
    },

}
