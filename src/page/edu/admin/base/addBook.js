import myFileModel from '@/components/myFileModel/myFileModel.vue';
import WangEditor from "@/components/wangEditor/wangEditor.vue";

export default {
    name: 'addBook',
    data()
    {
        return {
            showType:1, //1展示课程管理，2展示章节课程
            info:{
                id:this.$route.query.id,
                bookName:'',
                bookAuthor:'',
                recommendIndex:0,
                borrowOrgId:this.common.userInfo().orgId,
                imgId:'',
                imgPath:'',
                recommendation:'',
                contentOverview:'',
                authorOverview:'',
                bookContents:'',
                trialContent:'',
            },
            orgData:[],  //组织
            disable:this.$route.query.type==2,
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.initData();
        if(this.common.isNotBlank(this.$route.query.id)){
            this.doQuery();
        }
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        WangEditor,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initData(){
            // 所属部门
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
        },
        async doQuery(){
            this.info = await this.common.postUrl("eduBookService", "getEduBookInfo", {id: this.$route.query.id});
            // 类型转换
            this.$nextTick(()=>{
                this.$refs.recommendation.setEditor(this.info.recommendation);
                this.$refs.bookContents.setEditor(this.info.bookContents);
                this.$refs.imgCover.initDate(this.info.imgId);
            })
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        // 切换tab
        changeTab(type){
            this.showType = type;
        },
        /**
         * 封面上传回调
         * @param imgData
         */
         imgCoverCallback(data)
        {
            this.info.imgId = data.flowId;
            this.info.imgPath = data.storePath;
        },
        async save(){
            // 编辑框赋值
            this.info.recommendation = this.$refs.recommendation.html;
            this.info.bookContents = this.$refs.bookContents.html;
            if(this.common.isBlank(this.info.bookName)){
                this.$message.error("书籍名称不能为空");
                return false;
            }
            if(this.common.isBlank(this.info.bookAuthor)){
                this.$message.error("书籍作者不能为空");
                return false;
            }
            if(this.info.recommendIndex<=0){
                this.$message.error("推荐指数不能为空");
                return false;
            }
            if(this.info.borrowOrgId<=0){
                this.$message.error("书籍借阅不能为空");
                return false;
            }
            if(this.common.isBlank(this.info.imgId)){
                this.$message.error("请上传封面");
                return false;
            }
            if(this.common.isBlank(this.info.recommendation)){
                this.$message.error("推荐语不能为空");
                return false;
            }
            await this.common.postUrl("eduBookService", "saveEduBookInfo", this.info);
            this.$message.success("保存成功");
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
        }
    },
}
