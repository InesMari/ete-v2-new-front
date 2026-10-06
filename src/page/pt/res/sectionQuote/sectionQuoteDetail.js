import commonSectionQuote from "@/page/pt/res/sectionQuote/commonSectionQuote.js"
import enumData from "@/page/pt/enum.js"

export default {
    name: 'sectionQuoteDetail',
    mixins: [commonSectionQuote],
    data()
    {
        return {
            enumData: enumData,
            id: this.$route.query.id,
            type: this.$route.query.type,// 0 查看详情 1发起审计 2审计
            order:{
                rfqQuoteNum: '',
                rfqStsName: '',
                rfqQuoteTypeName: '',
                quoteLevelName: '',
                tenantName: '',
                routeName: '',
                goodsName: '',
                accountPeriod: '',
                serviceAreasName: '',
                supplierTenantName: '',
                effectDate: '',
                expireDate: '',
                predictDistance: '',
                predictTime: '',
                bidSupplierCount: '',
            },
            verifyRemark: '',
            quoteDtlList: [],
        }
    },
    mounted()
    {
        this.loadSectionQuoteById(this.id);
    },
    methods: {
        async loadSectionQuoteById(id)
        {
            let data = await this.common.postUrl("sectionQuoteService", "loadSectionQuoteDataById", {id, type: this.type}, null, null, '', true);
            this.order = data.info;
            this.order.smsFlag = data.info.smsFlag==1?true:false;
            this.showDistance = this.common.isNotBlank(this.order.predictDistance);
            this.workList = data.workList;
            this.changeWorkListName();
            this.requirementList = data.requirementList;
            for (let i = 0; i < data.quoteList.length; i++)
            {
                let item = data.quoteList[i];
                item.disabled = this.type == 2;
                item.isSelect = item.selVerifyState==1;
            }
            this.quoteList = data.quoteList;
            this.quoteDtlList = data.quoteDtlList;
            this.$forceUpdate();
        },
        async initiateAudit()
        {
            let count = 0;
            let set = new Set();
            for (let i = 0; i < this.quoteList.length; i++)
            {
                let item = this.quoteList[i];
                if (item.isSelect)
                {
                    if (set.has(item.sectionQuoteDtlId))
                    {
                        this.$message.error("每种类型的报价只能选择一家供应商！");
                        return false;
                    }
                    set.add(item.sectionQuoteDtlId);
                    count++;
                }
            }
            if (count == 0)
            {
                this.$message.error("至少勾选一条供应商报价才能发起审计！");
                return false;
            }
            let param = {quoteList: this.quoteList, id: this.id, rfqQuoteNum: this.order.rfqQuoteNum};
            await this.common.postUrl("sectionQuoteService", "initiateAudit", param, null, null, '', true);
            this.$message.success("发起审计成功！");
            this.closePage();
        },
        async audit(type)
        {
            let param = {
                id: this.id,
                type: type,
                rfqQuoteNum: this.order.rfqQuoteNum,
                verifyRemark: this.verifyRemark,
                quoteList: this.quoteList,
            };
            this.$confirm("是否确认完成审计？", "提示").then(async () =>{
                await this.common.postUrl("sectionQuoteService", "audit", param, null, null, '', true);
                this.$message.success("审计完成！");
                this.closePage();
            }).catch(() =>{});
        },
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
