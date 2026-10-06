import dbTable from "@/components/dbTable/dbTable.vue";
import vuedraggable from 'vuedraggable';
import enumData from "@/page/pt/enum";
import mycity from '@/components/mycity/mycity.vue'

export default {
    data() {
        return {
            enumData,
            info:{    //全部信息的对象容器
                baseInfo:{
                    custTenantId:'',
                    custName:'',
                    linkman:'',
                    billId:'',
                    ourLinkman:'',
                    ourBillId:'',
                    email:'',
                    ourEmail:'',
                    remark:'',
                    workStoreId:'',
                    quoteDate:'',
                },
                titles:[
                    {
                        itemType:1,
                        titleName:'整车运输费用',
                        display:1,
                        routes:[{
                            quoteLevel:'1',
                            sections:this.initSections(),
                            details:[],
                        }],

                    },
                    {
                        itemType:2,
                        titleName:'零担运输费用',
                        display:1,
                        routes:[{
                            quoteLevel:'1',
                            sections:this.initSections(),
                            details:[],
                        }],

                    },
                ]
            },
            head: [
                {"name": "计费方式", "code": "billingType", "width": "110","type":"select"},
                {"name": "报价车型", "code": "quoteVehicleType", "width": "110","type":"select"},
                {"name": "车长", "code": "vehicleLength", "width": "110","type":"select"},
                {"name": "单程/往返", "code": "unit", "width": "110","type":"select"},
                {"name": "未税单价（元）", "code": "fee", "width": "110","type":"input"},
                {"name": "增值税（%）", "code": "taxRate", "width": "110","type":"input"},
                {"name": "价税合计（元）", "code": "feeWithTax", "width": "110","type":"input"},
                {"name": "备注", "code": "remark", "width": "220","type":"inputText"}
            ],
            customerData:[],
            workList:[],
            priceTotal:0,   //合计未税价
            priceWithTaxTotal:0, //合计含税价
            payTitle:[],//结算主体
            workData:[],//作业点数据
            quoteLevelData: [],//报价级别
            billingTypeData:[],//计费方式
            quoteVehicleTypeData:[],//报价车型
            vehicleLengthData:[],//车长
            rangeUnitData:[],//区间单位
            feeTypeData:[],//费用类型
        }
    },
    /**
     * 初始化
     */
    async mounted() {
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        vuedraggable,
        mycity,
    },
    /**
     * 绑定函数
     */
    methods: {
        // 初始化数据
        async initData() {
            let that = this;
            // 仓库
            let p1 = this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {}, function (data) {
                that.workList = data;
            });
            // 客户
            let p2 = this.common.postUrl("customerTF", "loadCustomerList", {}, function (data) {
                that.customerData = data;
            });
            // 结算主体
            let p3 = this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"}, function (data){
                that.payTitle = data;
            });
            // 计费方式
            let p4 = this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUOTE_BILLING_TYPE"}, function (data){
                that.billingTypeData = data;
            });
            //费用类型
            let p5 = this.common.postUrl("commonTF", "getSysStaticData", {codeType: "FEE_TYPE"}, function (data) {
                that.feeTypeData = data;
            });
            // 报价车型
            let p6 = this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"}, function (data){
                that.quoteVehicleTypeData = data;
                that.quoteVehicleTypeData.unshift({codeValue: "0", codeName: "通用"});
                that.quoteVehicleTypeData.forEach(item => {item.disabled = false;});
            });
            // 车长
            let p7 = this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"}, function (data){
                that.vehicleLengthData = data;
                that.vehicleLengthData.unshift({codeValue: "0", codeName: "通用"});
                that.vehicleLengthData.forEach(item => {item.disabled = false;});
            });
            //区间单位
            let p8 = this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RANGE_UNIT"}, function (data) {
                that.rangeUnitData = data;
            });

            // 报价级别
            let p9 = this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUOTE_LEVEL"}, function (data){
                that.quoteLevelData = data;
            });

            Promise.all([p1,p2,p3,p4,p5,p6,p7,p8,p9]).then(res => {
                if(that.common.isNotBlank(that.$route.query.quoteId)){
                    that.queryDetail();
                }else{                    
                    that.refreshData();
                }
            });
        },
        // 查询数据
        async queryDetail(){
            this.info = await this.common.postUrl('quoteSheetTF','queryQuoteSheet',{quoteId:this.$route.query.quoteId});
            if(this.$route.query.isCopy==1)
                this.info.baseInfo.quoteId = undefined;     //复制
            // 回显类型转换
            this.info.baseInfo.settleBody = String(this.info.baseInfo.settleBody);
            this.info.titles.forEach((el,tableIndex) => {
                el.routes.forEach((route,routeIndex) => {
                    this.resetRegion(tableIndex,route,routeIndex);
                    route.quoteLevel = String(route.quoteLevel);
                    route.sections.forEach((item,i) => {
                        if(this.common.isNotBlank(item.workId))
                            item.workId = String(item.workId);
                    })
                    route.details.forEach(item => {
                        item.billingType = String(item.billingType);
                        item.feeType = String(item.feeType);
                        item.rangeUnit = String(item.rangeUnit);
                        item.quoteVehicleTypeData = this.common.copyObj(this.quoteVehicleTypeData);
                        item.vehicleLengthData = this.common.copyObj(this.vehicleLengthData);
                        if(this.common.isNotBlank(item.quoteVehicleType)){
                            item.quoteVehicleType = item.quoteVehicleType.split(",");
                            this.changeEvent(item.quoteVehicleTypeData, item.quoteVehicleType);
                        } 
                        if(this.common.isNotBlank(item.vehicleLength)){
                            item.vehicleLength = item.vehicleLength.split(",");
                            this.changeEvent(item.vehicleLengthData, item.vehicleLength);
                        } 
                    })
                })
            })
            // 加载作业点数据
            this.loadWorkData();
            this.$forceUpdate();
        },
        // 渲染数据
        refreshData(){
            this.info.titles.forEach(el => {
                el.routes.forEach(item =>{
                    if(el.itemType == 1){
                        item.details = [this.zcObj()];
                    }else {
                        item.details = [this.ldObj()];
                    }
                })
            })
        },
        /**
         * 改变报价级别
         */
        changeQuoteLevel(tableIndex,routeItem,routeIndex)
        {
            this.initSections(tableIndex,routeItem,routeIndex);
            if(this.common.isBlank(routeItem.workData)) return;
            routeItem.workData.forEach(item => item.disabled = false );
            this.$forceUpdate();
        },
        /**
         * 加载客户作业点数据
         * @returns {Promise<void>}
         */
        async loadWorkData()
        {
            //仓储报价新增需要加载作业点
            this.workData = await this.common.postUrl("workGoodsTF","queryWorkDataSelect",{tenantId:this.info.baseInfo.custTenantId,isLoadStoreHouse : 1});
            this.workData.forEach(item => {item.disabled = false;});
            this.info.titles.forEach(el => {
                el.routes.forEach(item => {
                    item.workData = this.common.copyObj(this.workData);
                })
            })
            this.$forceUpdate();
        },
        /**
         * 鼠标聚焦作业点输入框
         */
        focusWork()
        {
            if (this.common.isBlank(this.info.baseInfo.custTenantId))
                this.$message.info("请先选择客户！");
        },
        /**
         * 增加作业点
         * @routeItem {当前线路}
         * @returns {boolean}
         */
        addSectionItem(tableIndex,routeItem,routeIndex)
        {
            if (routeItem.sections.length < 4)
            {
                routeItem.sections.splice(routeItem.sections.length - 1, 0, this.initWork(routeItem.sections.length - 1, "中途点"));
                //区域的重置之前选择的目的地区域数据
                this.resetWorkName(routeItem);
                this.resetRegion(tableIndex,routeItem,routeIndex);
            }
            else
            {
                if (routeItem.quoteLevel == enumData.quoteLevel.PRESS_WORK)
                    this.$message.error("报价只能新增两个作业点！");
                else if (routeItem.quoteLevel == enumData.quoteLevel.PRESS_REGION)
                    this.$message.error("报价只能新增两个区域！");
                return false;
            }
        },
        /**
         * 移除作业点
         * @param index
         * @returns {Promise<boolean>}
         */
        removeSectionItem(routeItem)
        {
            if (routeItem.sections.length > 2)
            {
                let index = 1;
                if (routeItem.sections.length > 3)
                    index = 2;
                routeItem.sections.splice(index, 1);
                this.resetWorkName(routeItem);
            }
            else
            {
                if (this.quote.quoteLevel == enumData.quoteLevel.PRESS_WORK)
                    this.$message.error("报价作业点至少两个！");
                return false;
            }
        },
        
        /**
         * 重置区域数据
         */
         resetRegion(tableIndex,routeItem,routeIndex)
         {
             if (routeItem.quoteLevel == enumData.quoteLevel.PRESS_REGION)
             {
                routeItem.sections.forEach((item,i) => {
                    let ref = this.$refs['city'+tableIndex+routeIndex+i][0];
                    if (item.provinceId)
                        ref.initData(item.provinceId, item.cityId, item.districtId, null);
                    else
                        ref.cleanData();
                })
             }
         },
        /**
         * 重新设置中途点名称
         */
         resetWorkName(routeItem)
         {
             for (let i = 0; i < routeItem.sections.length; i++)
             {
                routeItem.sections[i].index = i;
                 if (i === 0)
                    routeItem.sections[i].name = "起始地";
                 if (i > 0 && i < routeItem.sections.length - 1)
                 {
                     if (routeItem.sections.length > 3)//4个作业点中途点名字中途点1、中途点2
                     routeItem.sections[i].name = "中途点" + i;
                     else
                     routeItem.sections[i].name = "中途点";
                 }
                 if (i === routeItem.sections.length - 1)
                 routeItem.sections[i].name = "目的地";
             }
         },
        //  初始化整车行数据
        zcObj(){
            return {
                billingType:'',
                quoteVehicleType:'',
                vehicleLength:'',
                unit:'',
                fee:'',
                taxRate:'',
                feeWithTax:'',
                remark:'',                
                quoteVehicleTypeData: this.common.copyObj(this.quoteVehicleTypeData),
                vehicleLengthData: this.common.copyObj(this.vehicleLengthData),
            }
        },
        //  初始化零担行数据
        ldObj(){
            return {
                feeType:'',
                billingType:'',
                rangeStart:'',
                rangeEnd:'',
                rangeUnit:'',
                taxRate:'',
                feeWithTax:'',
                remark:'',
            }
        },
        /**
         * 初始化作业点
         * @returns {*}
         */
        initSections(tableIndex,routeItem,routeIndex)
        {
            let sections = [];
            sections.push(this.initWork(0, "起始地"));
            sections.push(this.initWork(1, "目的地"));
            if(this.common.isNotBlank(routeItem)){
                routeItem.sections.forEach((item,index) => {
                    let ref = this.$refs['city'+tableIndex+routeIndex+index][0];
                    ref.cleanData();
                })
            }
            return sections;
        },
        /**
         * 初始化作业点明细
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
         * 改变作业点
         * @param index
         * @param data
         * @returns {Promise<void>}
         */
        changeWork(routeItem,index,sectionsItem)
        {
            //作业点禁用
            routeItem.workData.forEach(work => {
                let flag = false;
                routeItem.sections.forEach(item => {
                    if (work.workId == item.workId)
                        flag = true;
                })
                if (work.workId == sectionsItem.workId){
                    sectionsItem.indexSearchStr = work.workName;
                    sectionsItem.provinceId = work.provinceId;
                    sectionsItem.cityId = work.cityId;
                    sectionsItem.districtId = work.districtId;
                }
                work.disabled = flag;
            })
            //校验相同作业点
            routeItem.sections.forEach((item,itemIndex) => {
                if (index != itemIndex)
                {
                    if (sectionsItem.workId == item.workId && this.common.isNotBlank(item.workId))
                    {
                        this.$message.error("作业点:" + sectionsItem.indexSearchStr + ",与" + item.indexSearchStr + "的相同,请修改!");
                        return false;
                    }
                }
            })
        },
        /**
         * 选择地址回调
         * @param index
         * @param data
         */
        selectCallback(tableIndex,routeItem,routeIndex,data,index)
        {
            let ref = this.$refs['city'+tableIndex+routeIndex+index][0];
            let address = ref.getData();
            data.provinceId = address.ProvinceId;
            data.cityId = address.CityId;
            data.districtId = address.DistrictId;
            data.indexSearchStr = address.ProvinceName + address.CityName + address.DistrictName;
            routeItem.sections.forEach((item,idx) => {
                if (idx != index && item.cityId == data.cityId && this.common.isNotBlank(data.cityId))
                {
                    if (this.common.isNotBlank(item.districtId))
                    {
                        if (item.districtId == data.districtId)
                        {
                            this.$message.error("省市区:" + data.indexSearchStr + ",与" + item.name + "的相同,请修改!");
                            return false;
                        }
                    }
                    else
                    {
                        if (item.districtId == data.districtId)
                        {
                            this.$message.error("省市:" + data.indexSearchStr + ",与" + item.name + "的相同,请修改!");
                            return false;
                        }
                        //涛总说广东广州-广东广州荔湾区也可以,只是匹配不到。
                        // this.$message.error("已经存在省市:" + item.indexSearchStr + " 的报价,请修改第" + (item.index + 1) + " 条数据到区/县!");
                    }
                }
            });
            this.$forceUpdate();
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
        // 更新视图
        forceUpdate(){
            this.$forceUpdate();
        },
        // 选择客户
        async changeCustomer(id){
            this.customerData.forEach(item => {
                if(item.tenantId == id){
                    this.info.baseInfo.custName = item.name;
                }
            });
            let list = await this.common.postUrl("wmsQuoteSheetTF", "queryQuoteSheetCustomerHisByTenantId", {tenantId: id});
            list.forEach(item => {
                if(item.tenantId == id){
                    if (this.common.isBlank(this.info.baseInfo.linkman))
                        this.info.baseInfo.linkman = item.linkman;
                    if (this.common.isBlank(this.info.baseInfo.billId))
                        this.info.baseInfo.billId = item.linkPhone;
                    if (this.common.isBlank(this.info.baseInfo.email))
                        this.info.baseInfo.email = item.email;
                }
            })
            this.loadWorkData();
        },
        /**
         * 
         * @param {路线集合} routes 
         */
        addRouter(routes,itemType){
            routes.push({
                quoteLevel:'1',
                sections:this.initSections(),
                details:[itemType==1?this.zcObj():this.ldObj()],
            })
            routes.forEach(item => {
                item.workData = this.common.copyObj(this.workData);
            })
            this.$forceUpdate();
        },
        /**
         * 
         * @param {路线集合} routes 
         * @param {下标} index 
         */
        delRouter(routes,index,tableIndex){
            routes.splice(index,1);
            routes.forEach((item,routeIndex) => {
                item.workData = this.common.copyObj(this.workData);
                this.resetRegion(tableIndex,item,routeIndex);
            })
            this.$forceUpdate();
        },
        // 增加费用
        addFee(list,itemType){
            if(itemType == 1){
                var obj = this.zcObj();
                obj.quoteVehicleTypeData = this.common.copyObj(this.quoteVehicleTypeData);
                obj.vehicleLengthData = this.common.copyObj(this.vehicleLengthData);
            }else {
                var obj = this.ldObj();
            }
            list.push(obj);
            this.$forceUpdate();
        },
        /**
         * 删除费用列表
         * list 当前遍历列表
         * index 删除行的下标
         */
         delFee(list,index){
            list.splice(index,1);
            this.$forceUpdate();
         },
         /**
          * 计算费用
          * @param {当前行} item 
          * @param {当前字段} code 
          * @returns 
          */
         calcFee(item,code){
             if(code == "fee"){    //算价税合计
                item.feeWithTax = this.common.accMul(item.fee,(1 + this.common.accDiv(item.taxRate,100))).toFixed(2);
             }else if(code == "feeWithTax"){  //算未税单价
                item.fee = this.common.accDiv(item.feeWithTax,(1 + this.common.accDiv(item.taxRate,100))).toFixed(2);
             }else if(code == 'taxRate'){
                if(this.common.isNotBlank(item.fee)){
                    item.feeWithTax = this.common.accMul(item.fee,(1 + this.common.accDiv(item.taxRate,100))).toFixed(2);
                }
             }
             this.$forceUpdate();
         },
        //  提交
        async submit(){
            // 置空不选择项目
            this.info.details.forEach(item => {
                if(item.display == 0){
                    item.items = [];
                }
                if(item.codeId == 1){
                    item.items.forEach((el,index) => {
                        if(el.display == 0){
                            item.items.splice(index,1);
                        }
                    })
                }
            })
            await this.common.postUrl('wmsQuoteSheetTF','addQuoteSheet',this.info,null,null,null,true);
            this.$message.success("提交成功")
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
