import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";

export default {
    name: 'palletRecordInfo',
    computed: {
        enumData()
        {
            return enumData
        }
    },
    data()
    {
        return {
            isDisable: this.$route.query.type == enumData.OPEN_PAGE_TYPE.DETAIL,
            type: this.$route.query.type,
            workData: [],
            info: this.initInfo(),
        }
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        enumData,
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        if (this.common.isNotBlank(this.$route.query.id))
            this.loadPalletRecordInfoById(this.$route.query.id);
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo()
        {
            return this.info = {
                id: null,
                workId: null,
                month: null,
                allocatWorkIds: null,
                purchaseNums: null,
                scrapNums: null,
                allocatNums: null,
                recoverNums: null,
                outNums: null,
                recoverRate: null,
                actualInventoryNums: null,
                lastMonthNums: null,
                monthNums: null,
                diffNums: null,
            }
        },
        /**
         * 初始化数据
         */
        async initData()
        {
            //加载静态枚举
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async loadPalletRecordInfoById(id)
        {
            this.info = await this.common.postUrl("palletRecordService", 'loadPalletRecordInfoById', {id});
            this.$forceUpdate();
        },
        async changeWork()
        {
            this.info.lastMonthNums = null;
            await this.loadLastMonthNums();
        },
        async changeMonth()
        {
            this.info.lastMonthNums = null;
            await this.loadLastMonthNums();
        },
        async loadLastMonthNums()
        {
            this.info.lastMonthNums = null;
            if (this.common.isNotBlank(this.info.workId) && this.common.isNotBlank(this.info.month))
            {
                let year = this.info.month.substring(0, 4);
                let month = this.info.month.substring(5, 7);
                if(parseInt(month) == 1)
                {
                    year = parseInt(year) - 1;
                    month = 12;
                }
                else
                {
                    month = parseInt(month) - 1;
                }
                let lastMonth = this.common.formatDate.getMonth(new Date(year, month - 1, 1));
                let data = await this.common.postUrl("palletRecordService", "getPalletRecordList", {
                    workId: this.info.workId,
                    month: lastMonth,
                });
                if (data)
                {
                    this.info.lastMonthNums = data.monthNums;
                }
            }
            await this.calcMonthNums();
        },
        async calcMonthNums()
        {
            let value = 0;
            value = await this.calc(value, this.info.lastMonthNums);
            value = await this.calc(value, this.info.purchaseNums);
            value = await this.calc(value, this.info.scrapNums, "-");
            value = await this.calc(value, this.info.allocatNums, "-");
            
            this.info.monthNums = value;
            await this.calcDiffNums();
            this.$forceUpdate();
        },
        async calcDiffNums()
        {
            let value = 0;
            value = await this.calc(value, this.info.monthNums);
            value = await this.calc(value, this.info.actualInventoryNums, "-");
            
            this.info.diffNums = value;
            this.$forceUpdate();
        },
        async calcRecoverRate()
        {
            this.info.recoverRate = 0;
            let recoverNums = await this.calc(0, this.info.recoverNums);
            let outNums = await this.calc(0, this.info.outNums);
            if (recoverNums > 0 && outNums > 0)
            {
                let recoverRate = this.common.accDiv(recoverNums, outNums);
                recoverRate = Number(recoverRate).myToFixed(4);
                recoverRate = this.common.accMul(recoverRate, 100);
                this.info.recoverRate = recoverRate;
                this.$forceUpdate();
            }
        },
        async calc(src, value, type)
        {
            if (this.common.isNotBlank(value) && !isNaN(value))
            {
                if (type == "-")
                    src = this.common.accSub(src, value);
                else
                    src = this.common.accAdd(src, value);
            }
            return src;
        },
        async saveInfo()
        {
            let info = this.info
            if (this.common.isBlank(info.workId))
            {
                this.$message.error("请选择基地!");
                return;
            }
            if (this.common.isBlank(info.month))
            {
                this.$message.error("请选择月份!");
                return;
            }
            await this.common.postUrl("palletRecordService", "savePalletRecord", info);
            this.$message.success((this.type == enumData.OPEN_PAGE_TYPE.ADD ? "新增" : "修改") + "成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
