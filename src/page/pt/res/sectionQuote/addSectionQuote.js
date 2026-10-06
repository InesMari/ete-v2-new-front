import commonSectionQuote from "@/page/pt/res/sectionQuote/commonSectionQuote.js"
import enumData from "@/page/pt/enum";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import mycity from "@/components/mycity/mycity.vue";

export default {
    components: {
        myElDatePicker,
    },
    name: 'addSectionQuote',
    mixins: [commonSectionQuote],
    data()
    {
        return {}
    },
    mounted()
    {
        this.initStaticData(true);
    },
    methods: {
        async saveSectionQuote()
        {
            if (this.checkOrderData())//校验通过
            {
                this.order.effectDate = this.order.validDate[0];
                this.order.expireDate = this.order.validDate[1];
                let workList = this.workList;
                if (this.order.rfqQuoteType == enumData.rfqQuoteType.WMS)
                {
                    workList = [];
                    workList.push(this.begin);
                    workList.push(this.end);
                }
                this.order.workList = workList;
                this.order.requirementList = this.requirementList;
                this.order.quoteList = this.quoteList;
                await this.common.postUrl("sectionQuoteService", "saveOrUpdateSectionQuote", this.order, null, null, '', true);
                this.$message.success("保存成功！");
                this.closePage();
            }
        },
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
