import enumData from "@/page/pt/enum";

export default {
    name: 'addSupplierWMSQuote',
    data() {
        return {
            enumData: enumData,
            quote: this.initQuote(this.$route.query.quoteId, this.$route.query.supplierId),
            supplierData: [],//供应商
            workData: [],//起始地下拉
            endWorkData: [],//起始地下拉
            billingTypeData: [],//计费方式
            vehicleLengthData: [],//车长
            quoteVehicleTypeData: [],//报价车型
            quoteList: [],//报价明细数据
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.initData();//初始化
        if (this.common.isNotBlank(this.$route.query.quoteId))
            await this.loadQuoteData();
    },
    components: {},
    /**
     * 绑定函数
     */
    methods:
    {
        /**
         * 初始化报价基础对象
         */
        initQuote(id, tenantId, quoteLevel, quoteNum)
        {
            return this.quote =
                {
                    id: id,
                    tenantId: this.common.isBlank(tenantId) ? '' : Number(tenantId),
                    quoteLevel: '1',
                    quoteNum: quoteNum,
                    beginWorkId: null,
                    endWorkId: null,
                    effectDate:this.common.formatDate.getDate(),//当天
                    expireDate:this.common.formatDate.year()+'-12-31',//年底
                    remark: ''
                }
        },
        /**
         * 初始化静态下拉等
         * @returns {Promise<void>}
         */
        async initData()
        {
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.workData = await this.common.postUrl("storeHouseBizTF","queryStoreHouseList", {});
            this.billingTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BILLING_TYPE_WMS"});
            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.vehicleLengthData.unshift({codeValue: "0", codeName: "通用"});
            this.vehicleLengthData.forEach(item => {item.disabled = false;});
            this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
            this.quoteVehicleTypeData.unshift({codeValue: "0", codeName: "通用"});
            this.quoteVehicleTypeData.forEach(item => {item.disabled = false;});
            this.quoteList.push(this.initQuoteItem());

        },
        /**
         * 初始化报价明细对象
         * @param id
         * @returns
         */
        initQuoteItem(id)
        {
            return {
                billingType: "1",
                quoteVehicleTypeData: this.common.copyObj(this.quoteVehicleTypeData),
                vehicleLengthData: this.common.copyObj(this.vehicleLengthData),
                feePrice: '',
                quoteVehicleType: null,
                vehicleLength: null,
                vehicleCount: '',
                isDefault: '0',
                disabledVehicleCount: true,
                disabledVehicleLength: false,
            };
        },
        /**
         * 改变起始地仓库
         * @param index
         * @param data
         * @returns {Promise<void>}
         */
        async changeBeginWork(beginWorkId)
        {
            this.quote.endWorkId = null;
            this.endWorkData = [];
            if (beginWorkId)
            {
                await this.loadWork(beginWorkId);
                if (this.endWorkData.length === 1)
                    this.quote.endWorkId = this.endWorkData[0].workId;
                this.$forceUpdate();
            }
        },
        async loadWork(beginWorkId)
        {
            this.endWorkData = await this.common.postUrl("workGoodsTF","queryWorkDataSelect", {isWmsWork: 1,storeId: beginWorkId});
        },
        /**
         * 变更计费方式
         * @param item
         * @param index
         */
        changeBillingType(item, index)
        {
            item.disabledVehicleLength = item.billingType == 2;
            item.disabledVehicleCount = item.billingType != 3;
            if (item.billingType != 3)//按月的才能填车辆数
                item.vehicleCount = null;
            if (item.billingType == 2)
                item.vehicleLength = null;
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
        /**
         * 增加报价明细
         * @returns {Promise<boolean>}
         */
        async addQuoteItem()
        {
            if (this.quoteList.length >= 20)
            {
                this.$message.error("不允许超过20条报价信息！");
                return false;
            }
            this.quoteList.push(this.initQuoteItem());
        },
        /**
         * 移除报价明细
         * @param index
         */
        removeQuoteItem(index)
        {
            if (this.quoteList.length > 1)
                this.quoteList.splice(index, 1);
        },
        stringToDate(dateStr,separator){
            if(!separator){
                separator="-";
            }
            let dateArr = dateStr.split(separator);
            let year = parseInt(dateArr[0]);
            let month;
            //处理月份为04这样的情况
            if(dateArr[1].indexOf("0") == 0){
                month = parseInt(dateArr[1].substring(1));
            }else{
                month = parseInt(dateArr[1]);
            }
            let day = parseInt(dateArr[2]);
            let date = new Date(year,month -1,day);
            return date;
        },
        async loadQuoteData()
        {
            this.quote = await this.common.postUrl("quoteService", "loadWmsQuoteDataByQuoteId", {quoteId:this.$route.query.quoteId});
            if (this.$route.query.isCopy == 1)
            {
                this.quote.id = "";
                let expireDate = this.stringToDate(this.quote.expireDate);
                expireDate.setDate(expireDate.getDate()+1);
                let year = expireDate.getFullYear();
                let month = expireDate.getMonth() + 1;
                let day = expireDate.getDate();
                this.quote.effectDate = year +"-" + (month<10?'0'+month:month) +"-" + (day<10?'0'+day:day);//当天
                this.quote.expireDate = year+'-12-31';//年底
            }
            await this.loadWork(this.quote.beginWorkId);
            this.quoteList = this.common.copyObj(this.quote.quoteList);
            for(let i in this.quoteList)
            {
                let item = this.quoteList[i];
                item.billingType = item.billingType + "";
                item.quoteVehicleTypeData = this.common.copyObj(this.quoteVehicleTypeData);
                item.vehicleLengthData = this.common.copyObj(this.vehicleLengthData);
                item.quoteVehicleType = this.splitStrToArray(item.quoteVehicleType + "");
                this.changeQuoteVehicleType(item);
                item.vehicleLength = this.splitStrToArray(item.vehicleLength + "");
                this.changeVehicleLength(item);
                this.changeBillingType(item, i);
            }
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
            if (this.common.isBlank(this.quote.beginWorkId))
            {
                this.$message.error("请选择起始地！");
                return false;
            }
            if (this.common.isBlank(this.quote.endWorkId))
            {
                this.$message.error("请选择目的地！");
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
                if (item.billingType != 2)
                {
                    if (this.common.isBlank(item.vehicleLength) || item.vehicleLength.length == 0)
                    {
                        this.$message.error("请选择第" + (i + 1) + "条报价的车长！");
                        return false;
                    }
                }
                if (this.common.isBlank(item.feePrice) || item.feePrice <= 0)
                {
                    this.$message.error("请输入有效的单价金额！");
                    return false;
                }
            }
            let param = this.common.copyObj(this.quote);
            param.quoteList = this.quoteList;
            param.sectionData = [{"workId": this.quote.beginWorkId}, {"workId": this.quote.endWorkId}];
            param.quoteType = enumData.quoteType.SUPLIER;
            param.quoteSubType = enumData.quoteSubType.WMS_QUOTE;
            let data = await this.common.postUrl("quoteService","saveCmSectionQuoteBase", param, null,null,'',true);
            let tip = this.common.isBlank(this.$route.query.quoteId) ? "新增成功！" : "修改成功！";
            if (this.$route.query.isCopy == 1)
            {
                tip = "复制成功";
            }
            this.$message.success("报价:" + data.quoteNum + tip);
            this.$parent.loadTodoData();//刷新待办
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
