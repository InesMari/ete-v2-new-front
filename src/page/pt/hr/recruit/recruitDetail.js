export default {
    name: "recruitDetail",
    components: {
        
    },
    data() {
        return {
            info: { },
        };
    },
    mounted() {
        this.initRecruitDetail();
    },
    methods: {
        // 初始化数据
        async initRecruitDetail() {
            this.info = await this.common.postUrl('hrRecruitInfoTF','queryHrRecruitInfoDetail',{id:this.$route.query.id});
            this.$forceUpdate();
        },
    },
};