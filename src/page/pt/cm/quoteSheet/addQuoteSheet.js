import quoteSheetCommon from "./quoteSheetCommon.js";
export default {
    name: 'addQuote',
    mixins:[quoteSheetCommon],
    data() {
        return {
            type: this.$route.query.type,//0 查看 1 新增 2修改
        };
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
        this.initAddData();
    },
    /**
     * 绑定函数
     */
    methods: {
        // 初始化数据
        async initAddData() {
            let {billId,userName,email} = JSON.parse(localStorage.getItem("userInfo"));
            this.info.baseInfo.ourLinkman = userName;
            this.info.baseInfo.ourBillId = billId;
            this.info.baseInfo.ourEmail = email;
            this.info.baseInfo.quoteDate = this.common.formatDate.getDate();
            this.info.baseInfo.remark = `1）计费吨托（MT)：按每托重量、体积最大值计算，最小计费单位为一托；
2）有以上相关价格外的业务则双方重新议价；   
3）如因报价条件发生变更则重新调整相关报价；   
4）费用为30天结算，我司开具增值税发票，贵司在次月30 日前付款到敝司指定账户；
5）其他未尽事宜，双方互相沟通协商后再行确认。`;
            this.$forceUpdate();
        },
        //  提交
        async submit(){
            // 置空不选择项目
            this.info.titles.forEach(item => {
                if(item.display == 0){
                    item.routes = [];
                }else{
                    item.routes.forEach(el => {
                        el.routeName = '';
                        el.sections.forEach((section,index) => {
                            el.routeName = el.routeName + section.indexSearchStr + (el.sections.length-1==index?'':' - ');
                        })
                    })
                }
            })
            await this.common.postUrl('quoteSheetTF','saveQuoteSheet',this.info,null,null,null,true);
            this.$message.success("提交成功")
            this.closePage();
        },
        /** 切换是否退货 */
        changeInfoSwitch(item) {
            item.isRound = item.isRound == 1 ? 0 : 1;
            this.$forceUpdate();
        },
    },
}
