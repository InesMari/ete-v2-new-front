export default {
    name: 'inspectAssignDetail',
    data() {
        return {
            info: {
                id: null,
                workName: null,
                inspectionItem: null,
                dtlCount: null,
                executorStr: null,
                createDate: null,
                createUserName: null,
                inspectionTimesStr: null,
            },
            standardDtlList: [],
            list: [],
            imgNameList:[],
        }
    },
    mounted() {
        this.loadDataById();
    },
    components: {
        
    },
    methods: {
        async loadDataById(){
            let data = await this.common.postUrl('wmsInspectionAppointService', 'loadWmsInspectionAppointDataById', {id: this.$route.query.id});
            this.info = data.info;
            this.inspectionTimesList = data.inspectionTimesList;
            this.standardDtlList = data.standardDtlList;
            this.list = data.list;
            this.imgNameList = data.imgNameList;
            this.$forceUpdate();
        },
    }
}
