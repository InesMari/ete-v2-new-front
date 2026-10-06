import commonAssetsAllocat from '../commonAssetsAllocat.js'

export default {
    mixins: [commonAssetsAllocat],
    name: 'addAssetsAllocat',
    data()
    {
        return {
            isUpdate: this.common.isNotBlank(this.$route.query.id),
        }
    },
    async mounted()
    {
        await this.initData();
        // 新增时获取流水号
        if (this.common.isBlank(this.$route.query.id)) {
            let allocatNum = localStorage.getItem("assetsAllocatNum" + this.common.formatDate.getDate());
            if (this.common.isBlank(allocatNum)) {
                allocatNum = await this.common.postUrl("commonTF", "getGrowthNum", {pre: "PAA"});
                localStorage.setItem("assetsAllocatNum" + this.common.formatDate.getDate(), allocatNum);
            }
            this.allocat.allocatNum = allocatNum;
        }else if (this.common.isNotBlank(this.$route.query.id))
        {
            //修改加载回显数据
            const timer = setTimeout((async () => {
                this.loadAssetsAllocatById();
                clearTimeout(timer)

            }),500);
        }
    },
    methods: {
    },
    components: {
    },
}
