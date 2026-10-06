import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from "@/components/myFileModel/myFileModel.vue";
import autoSelectDirective from './autoSelectDirective';
export default {
    name: 'doneInspectTask',
    directives: {
        autoSelect: autoSelectDirective
    },
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
            inspectItemStsData:[],
            imgList:[],
            isShowBigImg: false,
            bigImageUrl: '',
            type:1,
            equipmentNum:'',
        }
    },
    mounted() {
        let {id} = this.$route.query;
        if(id>0){
            this.type=2;
            this.loadDataById();
        }
        this.initData();
        // 添加额外的事件监听，确保在点击时也能全选文本
        this.$nextTick(() => {
            if (this.$refs.equipmentInput && this.$refs.equipmentInput.$el) {
                const inputElement = this.$refs.equipmentInput.$el.querySelector('input');
                if (inputElement) {
                    inputElement.addEventListener('click', function() {
                        this.select();
                    });
                }
            }
        });
    },
    components: {
        myFileModel,
        fileViewer
    },
    methods: {
        async scanCode() {
            let data = await this.common.postUrl('wmsInspectionTaskService', 'loadWmsInspectionTaskDataById', {equipmentNum: this.equipmentNum});
            this.info = data.info;
            this.standardDtlList = data.standardDtlList;
            this.standardDtlList.forEach((item)=>{
                item.contentAnswer = '1';
            });
            this.imgList = data.imgList;
            this.type=2;
            this.$forceUpdate();
        },
        async loadDataById(){
            let data = await this.common.postUrl('wmsInspectionTaskService', 'loadWmsInspectionTaskDataById', {id: this.$route.query.id});
            this.info = data.info;
            this.standardDtlList = data.standardDtlList;
            this.imgList = data.imgList;
            this.$forceUpdate();
        },
        async initData()
        {
            this.inspectItemStsData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INSPECT_ITEM_STS"});
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
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
        successCallback(imgData)
        {
            let componentId = imgData.componentId
            for (let i = 0; i < this.standardDtlList.length; i++)
            {
                let item = this.standardDtlList[i];
                if ('file' + i == componentId)
                {
                    item.imgId = imgData.flowId;
                    item.imgPath = imgData.storePath;
                    break;
                }
            }
        },
        delCallback(componentId)
        {
            for (let i = 0; i < this.standardDtlList.length; i++)
            {
                let item = this.standardDtlList[i];
                if ('file' + i == componentId)
                {
                    item.imgId = '';
                    item.imgPath = '';
                    break;
                }
            }
        },
        successCallback2(imgData)
        {
            let componentId = imgData.componentId
            for (let i = 0; i < this.imgList.length; i++)
            {
                let item = this.imgList[i];
                if ('file' + i == componentId)
                {
                    item.imgId = imgData.flowId;
                    item.imgPath = imgData.storePath;
                    break;
                }
            }
        },
        delCallback2(componentId)
        {
            for (let i = 0; i < this.imgList.length; i++)
            {
                let item = this.imgList[i];
                if ('file' + i == componentId)
                {
                    item.imgId = '';
                    item.imgPath = '';
                    break;
                }
            }
        },
        async save() {
            let param = this.common.copyObj(this.info);
            param.standardDtlList = this.common.copyObj(this.standardDtlList);
            param.imgList = this.common.copyObj(this.imgList);
            await this.common.postUrl('wmsInspectionTaskService', 'saveOrUpdateWmsInspectionTask', param, null, null, null, true);
            this.$message.success("提交成功")
            if(this.$route.query.id>0){
                this.closePage();
            }else{
                this.type=1;
                this.equipmentNum='';
                for (let i = 0; i < this.standardDtlList.length; i++) {
                    this.$refs['file'+i][0].clean();
                    let item = this.standardDtlList[i];
                    item.imgId = '';
                    item.imgPath = '';
                }
                for (let i = 0; i < this.imgList.length; i++) {
                    this.$refs['file'+i][0].clean();
                    let item = this.imgList[i];
                    item.imgId = '';
                    item.imgPath = '';
                }
                this.$forceUpdate();
            }
        },
        cleanFile(index){
            this.$refs['file'+index][0].clean();
            let item = this.standardDtlList[index];
            item.imgId = '';
            item.imgPath = '';
        }
    }
}
