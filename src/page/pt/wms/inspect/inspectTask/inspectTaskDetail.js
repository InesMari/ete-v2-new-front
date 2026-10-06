import fileViewer from '@/components/myFile/file-viewer.vue';
export default {
    name: 'inspectTaskDetail',
    data() {
        return {
            info:{
                id:null,
                taskNum: null,
                inspectionItem: null,
                taskStateName: null,
                equipment: null,
                equipmentNum: null,
                stipulateDate: null,
                actualDate: null,
                actualUserName: null,
                remark: null,
            },
            standardDtlList:[],
            imgList:[],
            isShowBigImg: false,
            bigImageUrl: '',
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
            let data = await this.common.postUrl('wmsInspectionTaskService', 'loadWmsInspectionTaskDataById', {id: this.$route.query.id});
            this.info = data.info;
            this.standardDtlList = data.standardDtlList;
            this.imgList = data.imgList;
            this.$forceUpdate();
        },
        seeBigImg(item){
            if (this.common.isBlank(item.fullPath))
            {
                // this.$message.error("没有图片信息！");
                return false;
            }
            this.bigImageUrl = item.fullPath;
            this.isShowBigImg = true;
        },
        closeViewer(){
            this.isShowBigImg = false;
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId)
        },
    }
}
