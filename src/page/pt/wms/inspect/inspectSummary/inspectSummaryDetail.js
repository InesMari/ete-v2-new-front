import fileViewer from "@/components/myFile/file-viewer.vue";

export default {
    name: 'inspectSummaryDetail',
    data() {
        return {
            info:{
                id:null,
                workName:null,
                inspectionDate:null,
            },
            taskList:[],
            srcList: [],
        }
    },
    mounted() {
        this.loadDataById();
    },
    components: {
        fileViewer
    },
    methods: {
        async loadDataById(){
            let data = await this.common.postUrl('wmsInspectionSummaryService', 'loadWmsInspectionSummaryDataById', {id: this.$route.query.id});
            this.info = data.info;
            this.taskList = data.taskList;
            this.$forceUpdate();
        },        
        seeBigImg(url){
            if (this.common.isBlank(url))
            {
                this.$message.error("没有图片信息！");
                return false;
            }
            this.srcList=[];
            this.srcList.push(url);
            this.$refs.viewer.show();
        },
    }
}
