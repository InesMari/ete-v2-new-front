import commonSectionQuote from "@/page/pt/res/sectionQuote/commonSectionQuote.js"
import enumData from "@/page/pt/enum.js"

export default {
    name: 'generateSectionQuote',
    mixins: [commonSectionQuote],
    data()
    {
        return {
            enumData: enumData,
            id: this.$route.query.id,
            rfqQuoteType: this.$route.query.rfqQuoteType,
            tenantList: [],
        }
    },
    mounted()
    {
        this.initData();
    },
    methods: {
        async initData()
        {
            await this.initStaticData(false);
            this.$nextTick(async () => {
                await this.loadSectionQuoteById(this.id);
            });
        },
        async loadSectionQuoteById(id)
        {
            let data = await this.common.postUrl("sectionQuoteService", "loadSectionQuoteDataById", {id, type: 4}, null, null, '', true);
            let order = data.info;
            let workList = data.workList;
            this.tenantList = order.tenantList;
            this.workList = data.workList;
            this.changeWorkListName();
            //有客户并且是按作业点的只能指定询价选择的客户
            if (order.tenantId && order.quoteLevel == enumData.quoteLevel.PRESS_WORK)
            {
                this.customerData = [];
                this.customerData.push({
                    tenantId: order.tenantId,
                    name: order.tenantName,
                });
            }
            this.showDistance = this.common.isNotBlank(order.predictDistance);
            for (let index in this.tenantList)
            {
                let tenant = this.tenantList[index];
                let tenantId = tenant.tenantId;
                let quoteList = [];
                for (let i = 0; i < data.quoteList.length; i++)
                {
                    let quote = data.quoteList[i];
                    quote.isDefault = 0;
                    if (quote.tenantId == tenantId)
                        quoteList.push(quote);
                }
                tenant.order = this.common.copyObj(order);
                tenant.workList = this.common.copyObj(workList);
                tenant.quoteList = this.common.copyObj(quoteList);
            }
            this.$forceUpdate();
        },
        async generateQuote()
        {
            let rfqQuoteNum = '';
            for (let i = 0; i < this.tenantList.length; i++)
            {
                let item = this.tenantList[i];
                if (this.common.isBlank(item.order.validDate) || item.order.validDate.length === 0)
                {
                    this.$message.error("请选择供应商：" + item.tenantName + "生效失效时间！");
                    return false;
                }
                item.order.effectDate = item.order.validDate[0];
                item.order.expireDate = item.order.validDate[1];
                if (this.rfqQuoteType == enumData.rfqQuoteType.LD)
                {
                    if (this.common.isBlank(item.order.transportTimeliness))
                    {
                        this.$message.error("请输入供应商：" + item.tenantName + "运输时效！");
                        return false;
                    }
                }
                else if (this.rfqQuoteType == enumData.rfqQuoteType.WMS)
                {
                    let count = 0;
                    for (let j = 0; j < item.quoteList.length; j++)
                    {
                        let quote = item.quoteList[j];
                        if (quote.isDefault == 1)
                            count++;
                    }
                    if(count > 1)
                    {
                        this.$message.error("供应商：" + item.tenantName + "默认报价只能有一条！");
                        return false;
                    }
                }
                rfqQuoteNum = item.order.rfqQuoteNum;//后端日志记录
            }
            let param = {tenantList: this.common.copyObj(this.tenantList)};
            param.id = this.id;
            let data = await this.common.postUrl("sectionQuoteService", "generateSupplierQuote", param, null, null, '', true);
            this.$message.success("报价:" + data + "生成成功,3秒后本页面自动关闭！");
            let that = this;
            setTimeout(() => {
                that.closePage();
            }, 3000);
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
