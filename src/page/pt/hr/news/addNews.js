import WangEditor from "@/components/wangEditor/wangEditor.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: "addNews",
    components: {
        WangEditor,
        myFileModel
    },
    data() {
        return {
            info: {
                id:this.$route.query.id,
                title:''
            },
        };
    },
    mounted() {
        if(this.$route.query.id>0){
            this.initNewsDetail();
        }
    },
    methods: {
        // 初始化数据
        async initNewsDetail() {
            this.info = await this.common.postUrl('hrNewsTF','getNewsDetail',{id:this.$route.query.id});
            this.$refs.pic.initDate(this.info.fileId);
            this.$refs.wangEditor.setEditor(this.info.content);
            this.$forceUpdate();
        },
        // 保存
        async save() {
            if(!this.info.title){
                this.$message.error("标题不能为空");
                return;
            }
            const wangEditor = this.$refs.wangEditor;
            this.info.content = wangEditor.html;
            this.info.contentText = wangEditor.getText();
            if(!this.info.content){
                this.$message.error("新闻内容不能为空");
                return;
            }
            this.info.fileId = this.$refs.pic.getImageData().flowId;
            this.info.filePath = this.$refs.pic.getImageData().storePath;
            await this.common.postUrl('hrNewsTF', 'saveNews', this.info, null, null, null, true);
            this.$message.success("保存成功")
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
};