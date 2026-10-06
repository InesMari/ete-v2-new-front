import enumData from "@/page/pt/enum";

export default {
    name: 'supplierDetail',
    data()
    {
        return {
            weeks: [],
            currentDate: new Date().getDate(),//当前日期
            month: this.common.formatDate.getMonth(),//默认当前月份
            selectIndex: 0,//选择天数在本周的数组索引
            sumData:{
                todayWaybillCount: 0,//今日派车单
                totalServiceCustomerCount: 0,//累计服务客户
                monthWaybillCount: 0,//本月派车单
                monthWaybillCostSum: 0,//本月派车单成本合计
            },
            sumDayData:{
                waitStartVehicleCount: 0,//待出车包含待派车和待出车
                inWayCount: 0,//运作中的派车单
                finishedCount: 0,//完成包含已完成和异常终止
            },
            enumData: enumData,
            weekDataMap: enumData.weekDataMap,//周几的数据
            supplierInfo: {
                tenantId: this.$route.query.tenantId,
                supplierType: this.$route.query.supplierType,
                supplierName: this.$route.query.supplierName,
                invoiceFlg: this.$route.query.invoiceFlg,
            },//供应商信息
        }
    },
    mounted()
    {
        this.initWeek().then(() => {});
    },
    components: {},
    methods: {
        /**
         * 初始化日历
         * e Date格式，月份 不传是默认的
         */
        async initWeek(e)
        {
            this.weeks = [];
            let date = this.common.isBlank(e) ? new Date() : this.getMyDate(e);
            let week = date.getDay();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            this.selectIndex = week;
            this.currentDate = day;//当前天
            for (let i = 0; i < 7; i++)
            {
                let el = {};
                let monthMaxDay = new Date(date.getFullYear(), month, 0).getDate();//month月份最后一天天数
                let actualMonth = month;//日期实际月份
                el.date = day - week + i;//默认本月份的天数
                if (el.date < 1)//上个月日期处理
                {
                    el.date = new Date(date.getFullYear(), month - 1, 0).getDate() + el.date;//month - 1月最后一天天数减去obj.date
                    actualMonth = month - 1;
                }
                else if (el.date > monthMaxDay)//下个月日期处理
                {
                    el.date = el.date - monthMaxDay;//下个月的天数
                    actualMonth = month + 1;
                }
                el.time = new Date(date.getFullYear(), actualMonth - 1, el.date);//天时间对象
                el.week = this.weekDataMap.get(i);//显示周几数据
                
                let month_ = el.time.getFullYear() + "-" + (actualMonth < 10 ? '0' + actualMonth : actualMonth);//加载数据的年月条件
                let sumDayData = await this.loadSupplierSpecifyDayDataByTenantId(month_ + "-" + el.date);
                this.initSumDayData(el, sumDayData);
                //赋值当天展示派车单数据
                if (this.selectIndex === i) this.initSumDayData(this.sumDayData, sumDayData);
                this.weeks.push(el);
            }
            await this.loadSupplierDataByTenantId();
        },
        /**
         * 获取时间
         * @param date
         */
        getMyDate(date)
        {
            let maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();//date月份最后一天天数
            if (this.currentDate <= maxDay)
                return new Date(date.getFullYear(), date.getMonth(), this.currentDate);
            else
                return date;
        },
        /**
         * 上周
         */
        async preWeek()
        {
            for (let i = 0; i < this.weeks.length; i++)
            {
                let el = this.weeks[i];
                let day = el.date - 7;
                if (day > 0)//当前月份
                {
                    el.date = day;
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth(), el.date);
                }
                else
                {
                    let lastMonthMaxDate = new Date(el.time.getFullYear(), el.time.getMonth(), 0);//上个月最后一天
                    el.date = lastMonthMaxDate.getDate() + day;
                    el.time = new Date(lastMonthMaxDate.getFullYear(), lastMonthMaxDate.getMonth(), el.date);
                }
                let month_ = el.time.getFullYear() + "-" + ((el.time.getMonth() + 1) < 10 ? '0' + (el.time.getMonth() + 1) : el.time.getMonth() + 1);//加载数据的年月条件
                let sumDayData = await this.loadSupplierSpecifyDayDataByTenantId(month_ + "-" + el.date);
                this.initSumDayData(el, sumDayData);
                if (this.selectIndex === i)
                {
                    this.currentDate = el.date;//设置选择的本周天数
                    //设置月份数据
                    let month = el.time.getMonth() + 1;
                    this.month = el.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
                    this.initSumDayData(this.sumDayData, el);
                }
            }
        },
        /**
         * 下周
         */
        async nextWeek()
        {
            for (let i = 0; i < this.weeks.length; i++)
            {
                let el = this.weeks[i];
                let day = el.date + 7;
                let monthMaxDate = new Date(el.time.getFullYear(), el.time.getMonth() + 1, 0);
                if (day > monthMaxDate.getDate())//下个月
                {
                    el.date = day - monthMaxDate.getDate();
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth() + 1, el.date);
                }
                else
                {
                    el.date = day;
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth(), el.date);
                }
                let month_ = el.time.getFullYear() + "-" + ((el.time.getMonth() + 1) < 10 ? '0' + (el.time.getMonth() + 1) : el.time.getMonth() + 1);//加载数据的年月条件
                let sumDayData = await this.loadSupplierSpecifyDayDataByTenantId(month_ + "-" + el.date);
                this.initSumDayData(el, sumDayData);
                if (this.selectIndex === i)
                {
                    this.currentDate = el.date;//设置选择的本周天数
                    //设置月份数据
                    let month = el.time.getMonth() + 1;
                    this.month = el.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
                    this.initSumDayData(this.sumDayData, el);
                }
            }
        },
        /**
         * 改变天数
         * @param data
         * @param index
         */
        async changeDay(data, index)
        {
            this.selectIndex = index;
            this.currentDate = data.date;
            let month = data.time.getMonth() + 1;
            this.month = data.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
            this.initSumDayData(this.sumDayData, data);
        },
        /**
         * 初始化当日的 待出车、运作中、已完成数据
         * @param target
         * @param source
         */
        initSumDayData(target, source)
        {
            target.waitStartVehicleCount = source.waitStartVehicleCount;
            target.inWayCount = source.inWayCount;
            target.finishedCount = source.finishedCount;
            this.$forceUpdate();
        },
        /**
         * 加载统计数据
         * @returns {Promise<void>}
         */
        async loadSupplierDataByTenantId()
        {
            this.sumData = await this.common.postUrl("supplierTF", "loadSupplierDataByTenantId", this.supplierInfo,null, null, null, true);
            this.$forceUpdate();
        },
        /**
         * 加载每天的统计数据
         * @returns {Promise<void>}
         */
        async loadSupplierSpecifyDayDataByTenantId(day)
        {
            this.supplierInfo.day = day;
            return await this.common.postUrl("supplierTF", "loadSupplierSpecifyDayDataByTenantId", this.supplierInfo,null, null, null, true);
        },
        /**
         *
         * @param path
         * @param pId
         * @param urlName
         * @param urlId
         * @param urlPathName
         */
        go(path, pId, urlName, urlId, urlPathName,unShowCheck)
        {
            if (pId === 1002030 || pId === 1002031)
            {
                if (this.supplierInfo.invoiceFlg == 0)
                {
                    this.$message.error("该供应商不可开票,没有包装采购业务！");
                    return false;
                }
            }
            if (this.common.isBlank(urlId))
                urlId = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".vue"));
            if (pId == 1002033)
                urlId += this.supplierInfo.supplierType;//供应商类型不同界面
            
            let query = {supplierId: this.supplierInfo.tenantId, supplierName: this.supplierInfo.supplierName, pId: pId,unShowCheck: unShowCheck,};
            this.$emit("openTab",{
                urlId: urlId + this.supplierInfo.tenantId,
                query: query,
                urlName: urlName,
                urlPathName: urlPathName,
                urlPath: path});
        },
    }
}
