export default {
    name: "applicantDetail",
    components: {
        
    },
    data() {
        return {
            info: {},
        };
    },
    mounted() {
        if(this.$route.query.id>0){
            this.initapplicantDetail();
        }
    },
    methods: {
        // 初始化数据
        async initapplicantDetail() {
            this.info = await this.common.postUrl('hrRecruitInfoTF','queryHrApplicantInfoDetail',{id:this.$route.query.id});
            this.$forceUpdate();
        },
    },
};