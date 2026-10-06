export default {
    name: 'inspectNormDetail',
    data() {
        return {
            info:{
                inspectionNum: null,
                inspectionItem: null,
                createUserName: null,
                createDate: null,
            },
            list:[],
        }
    },
    mounted() {
        this.loadDataById();
    },
    components: {
        
    },
    methods: {
        async loadDataById(){
            let data = await this.common.postUrl('wmsInspectionStandardService', 'loadWmsInspectionStandardDataById', {id: this.$route.query.id});
            this.info = data.info;
            this.list = data.list;
            this.$forceUpdate();
        },
    }
}
