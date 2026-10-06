import { time } from 'highcharts';
import commonItemClaimApply from '../commonItemClaimApply.js'

export default {
    mixins: [commonItemClaimApply],
    name: 'addItemClaimApply',
    data()
    {
        return {
            isUpdate: this.common.isNotBlank(this.$route.query.id),
        }
    },
    async mounted()
    {
        await this.initData();
        //新增
        if (this.common.isBlank(this.$route.query.id))
        {
            let applyNum = localStorage.getItem("applyClaimNum" + this.common.formatDate.getDate());
            if (this.common.isBlank(applyNum))
            {
                applyNum = await this.common.postUrl("commonTF", "getGrowthNum", {pre: "ICA"});
                localStorage.setItem("applyClaimNum" + this.common.formatDate.getDate(), applyNum);
            }
            this.apply.applyNum = applyNum;
        }else if (this.common.isNotBlank(this.$route.query.id)){
            //修改加载回显数据
            const timer = setTimeout((async () =>{
                this.loadClaimApplyById();
                clearTimeout(timer)
            }),500);
        }
    },
    methods: {
    },
    components: {
    },
}
