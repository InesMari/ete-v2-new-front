import addCustomerZCQuote from "@/page/pt/cm/customer/quote/addCustomerZCQuote";

import mycity from '@/components/mycity/mycity.vue'
import enumData from "@/page/pt/enum";
import mapDialog from "@/components/mapDialog/mapDialog.vue";

export default {
    name: 'addSupplierZCQuote',
    data() {
        return {
            enumData: enumData,
            quote: this.initQuote(this.$route.query.quoteId, this.$route.query.supplierId),
            customerData: [],//客户
            quoteLevelData: [],//报价级别
            billingTypeData: [],//计费方式
            vehicleLengthData: [],//车长
            quoteVehicleTypeData: [],//报价车型
            sectionData: this.initSectionData(),//选择作业点/区域数据
            goodsGroupData: this.initGoodsGroupData(),//货物分组的组集合
            supplierData: [],//供应商
            workData: [],//作业点下拉
            goodsData: [],//货物下拉
            quoteList: [],//报价数据
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
            contractData:[],
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        this.init();
        if (this.common.isBlank(this.$route.query.quoteId))
            await this.initData(this.common.isNotBlank(this.$route.query.srcQuoteId));
        if(this.common.isNotBlank(this.$route.query.srcQuoteId)){
            await this.loadQuoteData();
        }
    },
    /**
     * 组件
     */
    components:
    {
        mycity,
        mapDialog,
    },
    /**
     * 绑定函数
     */
    methods:
    {
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
        async loadQuoteData()
        {
            this.quote = await this.common.postUrl("ZCQuoteNewTF", "loadQuoteDataByQuoteId", {quoteId:this.$route.query.srcQuoteId});
            this.quote.quoteLevel = this.quote.quoteLevel + "";
            this.changeQuoteLevel();
            this.quote.id = '';
            let expireDate = this.stringToDate(this.quote.expireDate);
            expireDate.setDate(expireDate.getDate()+1);
            let year = expireDate.getFullYear();
            let month = expireDate.getMonth() + 1;
            let day = expireDate.getDate();
            this.quote.effectDate=year +"-" + (month<10?'0'+month:month) +"-" + (day<10?'0'+day:day);//当天
            this.quote.expireDate=year+'-12-31';//年底
            if (this.common.isNotBlank(this.quote.specifyTenantId))
            {
                await this.loadWorkData();
                this.goodsGroupData[1].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
                this.goodsGroupData[2].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.PACK_GOODS);
            }

            this.sectionData = this.common.copyObj(this.quote.sectionData);
            this.sectionData.forEach(item => {
                item.id = '';
                if (this.common.isNotBlank(this.quote.specifyTenantId))
                    item.workId = item.workId + "";
                //作业点禁用
                this.workData.forEach(work => {
                    let flag = false;
                    this.sectionData.forEach(ii => {
                        if (work.workId == ii.workId)
                            flag = true;
                    })
                    if (work.workId == item.workId)
                        item.addressStr = work.workName;
                    work.disabled = flag;
                })
            })
            await this.resetWorkName();
            await this.resetRegion();

            this.quoteList = this.common.copyObj(this.quote.quoteList);
            this.quoteList.forEach(item => {
                item.id = '';
                item.vehicleLengthData = this.common.copyObj(this.vehicleLengthData);
                item.quoteVehicleTypeData = this.common.copyObj(this.quoteVehicleTypeData);
                item.goodsGroupData = this.common.copyObj(this.goodsGroupData);
                item.billingType = item.billingType + "";
                item.quoteVehicleType = this.splitStrToArray(item.quoteVehicleType + "");
                this.changeQuoteVehicleType(item);
                item.vehicleLength = this.splitStrToArray(item.vehicleLength + "");
                this.changeVehicleLength(item);
                item.goodsId = this.splitStrToArray(item.goodsId + "");
                this.changeGoodsId(item);
            });
            this.quote.sectionData = null;
            this.quote.quoteList = null;
            this.$forceUpdate();
        },
        /**
         * 数据切割处理
         * @param str
         * @returns {*[]}
         */
        splitStrToArray(str)
        {
            let array = [];
            if (this.common.isNotBlank(str))
            {
                let strArr = str.split(",");
                strArr.forEach(item => {
                    array.push(item);
                });
            }
            return array;
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
         * 初始化报价基础对象
         * @param id
         * @param tenantId
         * @param quoteLevel
         * @param quoteNum
         * @param specifyTenantId
         * @param transportTimeliness
         * @returns {{quoteNum, quoteLevel: (string|*), tenantId: (string|*), specifyTenantId, id, transportTimeliness}}
         */
        initQuote(id, tenantId, quoteLevel, quoteNum, specifyTenantId, transportTimeliness)
        {
            return this.quote =
            {
                id: id,
                tenantId: this.common.isBlank(tenantId) ? '' : Number(tenantId),
                quoteLevel: this.common.isBlank(quoteLevel) ? '2' : quoteLevel,
                quoteNum: quoteNum,
                specifyTenantId: specifyTenantId,
                transportTimeliness: transportTimeliness,
                effectDate:this.common.formatDate.getDate(),//当天
                expireDate:this.common.formatDate.year()+'-12-31',//年底
                contractId: null,
            }
        },
        /**
         * 初始化报价明细对象
         * @param id
         * @returns
         */
        initQuoteItem(id)
        {
            return {
                id: id,
                billingType: "1",
                quoteVehicleTypeData: this.common.copyObj(this.quoteVehicleTypeData),
                vehicleLengthData: this.common.copyObj(this.vehicleLengthData),
                goodsGroupData:this.common.copyObj(this.goodsGroupData),//初始化货物
                feePrice: '',
                returnPrice:'',
                pointFee: '',
            };
        },
        /**
         * 初始化作业点/区域对象
         * @param index
         * @param name
         * @returns {{ciityId: string, name, index, provinceId: string, workId: string, districtId: string}}
         */
        initWork(index, name)
        {
            return {
                workId: '',
                provinceId: '',
                ciityId: '',
                districtId: '',
                index: index,
                name: name,
            };
        },
        /**
         * 初始化作业点/区域集合
         * @returns {*}
         */
        initSectionData()
        {
            this.sectionData = [];
            this.sectionData.push(this.initWork(0, "起始地"));
            this.sectionData.push(this.initWork(1, "目的地"));
            this.$nextTick(() => {
                this.sectionData.forEach(item => {
                    let ref = this.getRef(item.index)[0];
                    ref.cleanData();
                })
            })
            return this.sectionData;
        },
        /**
         * 初始化静态下拉等
         * @returns {Promise<void>}
         */
        async initData(initQuoteList)
        {
            this.customerData = await this.common.postUrl("customerTF", "loadCustomerList", {});
            this.quoteLevelData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUOTE_LEVEL"});
            this.billingTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BILLING_TYPE_ORDER"});
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});

            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.vehicleLengthData.unshift({codeValue: "0", codeName: "通用"});
            this.vehicleLengthData.forEach(item => {item.disabled = false;});

            this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
            this.quoteVehicleTypeData.unshift({codeValue: "0", codeName: "通用"});
            this.quoteVehicleTypeData.forEach(item => {item.disabled = false;});
            if (this.common.isBlank(this.$route.query.quoteId))
                await this.loadStoreHouse();

            this.loadContractData(this.common.isNotBlank(this.$route.query.srcQuoteId) ? '' : this.$route.query.supplierId);

            if (!initQuoteList)//默认初始化
                this.quoteList.push(this.initQuoteItem());
        },
        /**
         * 改变客户
         * @returns {Promise<void>}
         */
        async changeTenant()
        {
            this.showWorkButton = this.quote.quoteLevel == 1 && this.common.isBlank(this.quote.specifyTenantId);

            if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_WORK)
                this.initSectionData();

            if (this.common.isNotBlank(this.quote.specifyTenantId))
            {
                await this.loadWorkData();
                this.goodsGroupData[1].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
                this.goodsGroupData[2].goodsData = await this.loadGoodsData(enumData.GOODS_TYPE.PACK_GOODS);
            }
            else
            {
                await this.loadStoreHouse();//初始化仓库数据
                this.initGoodsGroupData();
            }

            this.quoteList.forEach(item => {
                item.goodsId = [];
                item.goodsGroupData = this.common.copyObj(this.goodsGroupData);//初始化货物
                this.$forceUpdate();
            });
            await this.searchExistQuote();
        },
        changeSupplier(initContractId)
        {
            if (initContractId)
                this.quote.contractId = null;

            this.loadContractData(this.quote.tenantId);
        },
        changeContract(contractId)
        {
            if (this.common.isNotBlank(contractId) && this.common.isBlank(this.quote.tenantId))
            {
                for (let i = 0; i < this.contractData.length; i++)
                {
                    let item = this.contractData[i];
                    if (item.id == contractId)
                    {
                        this.quote.tenantId = item.tenantId;
                        this.changeSupplier(false);
                        break;
                    }
                }
            }
        },
        async loadContractData(tenantId)
        {
            this.contractData = await this.common.postUrl("contractService", "queryStorageEquipmentContractList", {tenantId});
            if (this.contractData.length == 1)
            {
                this.quote.contractId = this.contractData[0].id;
            }
            this.$forceUpdate();
        },


        /**
         * 改变报价级别
         */
        async changeQuoteLevel()
        {
            this.showWorkButton = this.quote.quoteLevel == 1 && this.common.isBlank(this.quote.specifyTenantId);
            this.initSectionData();
            this.workData.forEach(item => {item.disabled = false;});
            await this.searchExistQuote();
            this.$forceUpdate();
        },
        /**
         * 改变作业点
         * @param index
         * @param data
         * @returns {Promise<void>}
         */
        async changeWork(index, data)
        {
            //作业点禁用
            this.workData.forEach(work => {
                let flag = false;
                this.sectionData.forEach(item => {
                    if (work.workId == item.workId)
                        flag = true;
                })
                if (work.workId == data.workId)
                    data.addressStr = work.workName;
                work.disabled = flag;
            })
            //校验相同作业点
            this.sectionData.forEach(item => {
                if (index != item.index)
                {
                    if (data.workId == item.workId && this.common.isNotBlank(item.workId))
                    {
                        this.$message.error("作业点:" + data.addressStr + ",与" + item.name + "的相同,请修改!");
                        return false;
                    }
                }
            })
            //搜索后台是否有相同报价
            await this.searchExistQuote();
        },
        /**
         * 选择地址回调
         * @param index
         * @param data
         */
        async selectCallback(index, data)
        {
            let ref = this.getRef(index)[0];
            let address = ref.getData();
            data.provinceId = address.ProvinceId;
            data.cityId = address.CityId;
            data.districtId = address.DistrictId;
            data.addressStr = address.ProvinceName + address.CityName + address.DistrictName;
            this.sectionData.forEach(item => {
                if (item.index != index && item.cityId == data.cityId && this.common.isNotBlank(data.cityId))
                {
                    if (this.common.isNotBlank(item.districtId))
                    {
                        if (item.districtId == data.districtId)
                        {
                            this.$message.error("省市区:" + data.addressStr + ",与" + item.name + "的相同,请修改!");
                            return false;
                        }
                    }
                    else
                    {
                        if (item.districtId == data.districtId)
                        {
                            this.$message.error("省市:" + data.addressStr + ",与" + item.name + "的相同,请修改!");
                            return false;
                        }
                        //涛总说广东广州-广东广州荔湾区也可以,只是匹配不到。
                        // this.$message.error("已经存在省市:" + item.addressStr + " 的报价,请修改第" + (item.index + 1) + " 条数据到区/县!");
                    }
                }
            });
            await this.searchExistQuote();
        },
        /**
         * 查询仓库
         */
        async loadStoreHouse()
        {
            this.workData = await this.common.postUrl("storeHouseBizTF","queryStoreHouseList", {isLoadPTWork: 1});
            this.workData.forEach(item => {item.disabled = false;});
        },
        /**
         * 加载客户作业点数据
         * @returns {Promise<void>}
         */
        async loadWorkData()
        {
            this.workData = await this.common.postUrl("workGoodsTF","queryWorkDataSelect", {tenantId : this.quote.specifyTenantId,isLoadStoreHouse : 1, isLoadPTWork: 1});
            this.workData.forEach(item => {item.disabled = false;});
        },
        /**
         * 加载客户货物数据
         * @returns {Promise<[]>}
         */
        async loadGoodsData(type)
        {
            let goodsData = await this.common.postUrl("workGoodsTF","queryGoodsDataByTenantId", {tenantId : this.quote.specifyTenantId, type: type});
            goodsData.forEach(item => {item.disabled = false; item.goodsId = item.goodsId + ""; });
            return goodsData;
        },

        /**
         * 增加作业点/区域元素
         * @returns {boolean}
         */
        async addSectionItem()
        {
            if (this.sectionData.length < 4)
            {
                this.sectionData.splice(this.sectionData.length - 1, 0, this.initWork(this.sectionData.length - 1, "中途点"));
                //区域的重置之前选择的目的地区域数据
                await this.resetWorkName();
                await this.resetRegion();
            }
            else
            {
                if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_WORK)
                    this.$message.error("报价只能新增两个作业点！");
                else if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_REGION)
                    this.$message.error("报价只能新增两个区域！");
                return false;
            }
        },
        /**
         * 重置区域数据
         */
        async resetRegion()
        {
            if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_REGION)
            {
                for (let i = 0; i < this.sectionData.length; i++)
                {
                    let item = this.sectionData[i];
                    let ref = this.getRef(item.index)[0];
                    if (item.provinceId)
                        ref.initData(item.provinceId, item.cityId, item.districtId, null);
                    else
                        ref.cleanData();
                }
            }
        },
        /**
         * 重新设置中途点名称
         */
        async resetWorkName()
        {
            for (let i = 0; i < this.sectionData.length; i++)
            {
                this.sectionData[i].index = i;
                if (i === 0)
                    this.sectionData[i].name = "起始地";
                if (i > 0 && i < this.sectionData.length - 1)
                {
                    if (this.sectionData.length > 3)//4个作业点中途点名字中途点1、中途点2
                        this.sectionData[i].name = "中途点" + i;
                    else
                        this.sectionData[i].name = "中途点";
                }
                if (i === this.sectionData.length - 1)
                    this.sectionData[i].name = "目的地";
            }
        },
        /**
         * 移除作业点/区域元素
         * @param index
         * @returns {Promise<boolean>}
         */
        async removeSectionItem(index)
        {
            if (this.sectionData.length > 2)
            {
                let index = 1;
                if (this.sectionData.length > 3)
                    index = 2;
                this.sectionData.splice(index, 1);
                await this.resetWorkName();
                //搜索后台是否有相同报价
                await this.searchExistQuote();
            }
            else
            {
                if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_WORK)
                    this.$message.error("报价作业点至少两个！");
                else if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_REGION)
                    this.$message.error("报价区域至少两个！");
                return false;
            }
        },
        /**
         * 增加报价明细元素
         * @returns {Promise<boolean>}
         */
        async addQuoteItem()
        {
            if (this.quoteList.length >= 20)
            {
                this.$message.error("不允许超过20条报价信息！");
                return false;
            }
            let item = this.initQuoteItem();
            item.goodsGroupData = this.common.copyObj(this.goodsGroupData);//初始化货物
            this.quoteList.push(item);
        },
        /**
         * 移除报价明细元素
         * @param index
         */
        removeQuoteItem(index)
        {
            if (this.quoteList.length > 1)
                this.quoteList.splice(index, 1);
        },
        /**
         * 通过指定标示符获取指定引用
         * @param index
         * @returns {any}
         */
        getRef(index)
        {
            let that = this;
            return eval('that.$refs.city' + index);
        },
        /**
         * 下拉数据禁用处理
         * @param selectList
         * @param selectData
         * @returns {boolean}
         */
        changeEvent(selectList, selectData)
        {
            let initAll = false;
            selectList.forEach(el => {
                let find = false;
                let selectAll = false;
                selectData.forEach(item => {
                    if (item == el.codeValue)
                        find = true;
                    if (item == 0)
                        selectAll = true;
                })
                initAll = selectData.length > 0 && selectAll;
                el.disabled = find || selectAll;
            })
            return initAll;
        },
        /**
         * 变更计费方式ad
         * @param item
         * @param index
         */
        changeBillingType(item, index)
        {
            if (item.billingType != enumData.billingTypeOrder.count)
            {
                item.goodsId = [];//置空货物数据
                item.pointFee = null;
            }
        },
        /**
         * 改变报价车型
         * @param data
         */
        changeQuoteVehicleType(data)
        {
            if (this.changeEvent(data.quoteVehicleTypeData, data.quoteVehicleType))
            {
                data.quoteVehicleType = [];
                data.quoteVehicleType.push("0");
            }
        },
        /**
         * 改变车长
         * @param data
         */
        changeVehicleLength(data)
        {
            if (this.changeEvent(data.vehicleLengthData, data.vehicleLength))
            {
                data.vehicleLength = [];
                data.vehicleLength.push("0");
            }
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
         * 鼠标聚焦货物输入框
         */
        focusGoods()
        {
            // if (this.common.isBlank(this.quote.specifyTenantId))
            //     this.$message.info("请先选择指定客户！");
        },
        /**
         * 搜索是否存在相同作业点/区域的报价
         */
        async searchExistQuote()
        {
            if (this.common.isNotBlank(this.$route.query.quoteId))
                return false;//修改不匹配
            if(!this.quote.id){
                return false;//修改不匹配
            }
            // let param = this.common.copyObj(this.quote);
            // param.id = null;//新增的匹配出来的报价ID不带到后台匹配
            // param.sectionData = this.sectionData;
            // param.quoteType = enumData.quoteType.SUPLIER;
            // param.quoteSubType = enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE;
            //
            // let quoteInfo = await this.common.postUrl("ZCQuoteNewTF", "searchExistQuote", param);
            // if (this.common.isNotBlank(quoteInfo.id))
            // {
            //     this.initQuote(quoteInfo.id, quoteInfo.tenantId, quoteInfo.quoteLevel + "", quoteInfo.quoteNum, quoteInfo.specifyTenantId, quoteInfo.transportTimeliness);
            //     let list = quoteInfo.list;
            //     for (let i = list.length - 1; i >= 0; i--)
            //     {
            //         let data = list[i];
            //         data.billingType = data.billingType + "";
            //
            //         let quoteVehicleTypeArr = data.quoteVehicleType.split(",");
            //         data.quoteVehicleType = [];
            //         data.quoteVehicleTypeData = this.quoteVehicleTypeData;
            //         quoteVehicleTypeArr.forEach(item => {
            //             if (this.common.isNotBlank(item))
            //                 data.quoteVehicleType.push(item);
            //         })
            //
            //         let vehicleLengthArr = data.vehicleLength.split(",");
            //         data.vehicleLength = [];
            //         data.vehicleLengthData = this.vehicleLengthData;
            //         vehicleLengthArr.forEach(item => {
            //             if (this.common.isNotBlank(item))
            //                 data.vehicleLength.push(item);
            //         });
            //
            //         let goodsIdArr = data.goodsId.split(",");
            //         data.goodsId = [];
            //         data.goodsGroupData = this.common.copyObj(this.goodsGroupData);
            //         goodsIdArr.forEach(item => {
            //             if (this.common.isNotBlank(item))
            //                 data.goodsId.push(item);
            //         })
            //         this.quoteList.unshift(data);
            //         this.changeGoodsId(data);
            //     }
            // }
            // else
            //     this.removeSearchData();//移除上一次搜索的结果
        },
        /**
         * 移除搜索出来的数据
         */
        removeSearchData()
        {
            for (let i = 0; i < this.quoteList.length; i++)
            {
                let item = this.quoteList[i];
                if (this.common.isNotBlank(item.id))
                {
                    this.quoteList.splice(i, 1);
                    i--;
                }
            }
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
         * @returns {boolean}
         */
        async submit()
        {
            if (this.common.isBlank(this.quote.tenantId))
            {
                this.$message.error("请选择供应商！");
                return false;
            }
            if (this.common.isBlank(this.quote.quoteLevel))
            {
                this.$message.error("请选择报价级别！");
                return false;
            }
            if (this.common.isBlank(this.quote.effectDate))
            {
                this.$message.error("请选择生效日期！");
                return false;
            }
            if (this.common.isBlank(this.quote.expireDate))
            {
                this.$message.error("请选择失效日期！");
                return false;
            }
            let set = new Set();
            for (let i = 0; i < this.sectionData.length; i++)
            {
                let key = "";
                let tip = "区域数据"
                let item = this.sectionData[i];
                if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_WORK)
                {
                    if (this.common.isBlank(item.workId))
                    {
                        this.$message.error("请选择" + item.name + "作业点！");
                        return false;
                    }
                    tip = "作业点";
                    key = item.workId;
                }
                if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_REGION)
                {
                    if (this.common.isBlank(item.cityId))
                    {
                        this.$message.error("请选择" + item.name + "区域！");
                        return false;
                    }
                    tip = "省市区";
                    key = item.provinceId + "" + item.cityId + ""  + item.districtId;
                }
                if (set.has(key))
                {
                    this.$message.error("相同的" + tip + "无法保存报价,请修改" + tip);
                    return false;
                }
                set.add(key);
            }

            for (let i = 0; i < this.quoteList.length; i++)
            {
                let item = this.quoteList[i];
                if (this.common.isBlank(item.billingType))
                {
                    this.$message.error("请选择第" + (i + 1) + "条报价的计费方式！");
                    return false;
                }
                if (this.common.isBlank(item.quoteVehicleType) || item.quoteVehicleType.length == 0)
                {
                    this.$message.error("请选择第" + (i + 1) + "条报价的报价车型！");
                    return false;
                }
                if (this.common.isBlank(item.vehicleLength) || item.vehicleLength.length == 0)
                {
                    this.$message.error("请选择第" + (i + 1) + "条报价的车长！");
                    return false;
                }
                //按件数校验
                if (item.billingType == enumData.billingTypeOrder.count)
                {
                    if (this.sectionData.length != 2)
                    {
                        this.$message.error("第" + (i + 1) + "条报价的计费方式:按件数,只能有两个作业点/区域！请移除中途点！");
                        return false;
                    }
                    if (this.common.isBlank(item.goodsId) || item.goodsId.length == 0)
                    {
                        this.$message.error("请选择第" + (i + 1) + "条报价的货物！");
                        return false;
                    }
                }
                else
                {
                    if (this.common.isNotBlank(item.goodsId) && item.goodsId.length > 0)
                    {
                        this.$message.error("第" + (i + 1) + "条报价计费方式不是按件数,不能选择货物！");
                        return false;
                    }
                }
                if ((this.common.isBlank(item.feePrice) || item.feePrice <= 0)&&(this.common.isBlank(item.returnPrice) || item.returnPrice <= 0))
                {
                    this.$message.error("请输入有效的单程运费单价或者往返运费单价！");
                    return false;
                }
                //去重校验 相同的起始点、中途点、目的地、计费方式、报价车型、车长、货物、只能存在一条
                //移到后台校验  前端代码不想写，
            }
            let param = this.common.copyObj(this.quote);
            param.sectionData = this.sectionData;
            param.quoteList = this.quoteList;
            param.quoteType = enumData.quoteType.SUPLIER;
            param.quoteSubType = enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE;

            let data = await this.common.postUrl("ZCQuoteNewTF","saveCmSectionQuoteData", param, null,null,'',true);

            let tip = this.common.isBlank(this.$route.query.quoteId) ? "新增成功！" : "修改成功！";
            this.$message.success("报价:" + data.quoteNum + tip);
            this.$parent.loadTodoData();
            this.close();
        },

        /************* 后期追加便捷新增仓库 *************/
        async init() {
            let that = this;
            //加载静态枚举
            this.common.postUrl("selectStaticDataTF", "selectProvince", {}, function (data) {
                that.provinceData = data;
            });

        },
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
            let data = await this.common.postUrl("workGoodsTF", "addWorkInfo", this.workInfo, null, null,null, true);
            this.addWork(false);
            this.$message.success("保存成功！");
            await this.loadStoreHouse();
            this.workData.forEach(item =>
            {
                let flag = false;
                this.sectionData.forEach(work => {
                    if (work.workId == item.workId)
                        flag = true;
                })
                item.disabled = flag;
            });
            for (let i = 0; i < this.sectionData.length; i++)
            {
                if (i == index)
                    this.sectionData[i].workId = Number(data);
            }
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
