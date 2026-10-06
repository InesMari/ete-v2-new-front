import WangEditor from "@/components/wangEditor/wangEditor.vue";

export default {
    name: "addQuestion",
    components: {
        WangEditor,
    },
    data() {
        return {
            info: {
                id:'',
                name:'',
                type:'',
                sortId:'',
                isPopular:'1',
            },
            view:false,
            type:this.$route.query.type,
            typeData:[],
            whetherData:[],
        };
    },
    mounted() {
        if(this.type>1){
            this.initQuestionData();
            if(this.type==3){
                this.view = true;
            }
        }
        this.initData();
    },
    methods: {
        // 初始化数据
        async initQuestionData() {
            this.info = await this.common.postUrl('hcQuestionTF','getQuestionInfoDetail',{id:this.$route.query.id});
            this.info.type = this.info.type+'';
            this.info.isPopular = this.info.isPopular+'';
            this.$refs.wangEditor.setEditor(this.info.answer,this.type==3);
            this.$forceUpdate();
        },
        initData() {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUESTION_TYPE"}, function (data){
                that.typeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data){
                that.whetherData = data;
            });
        },
        // 保存
        async save() {
            const wangEditor = this.$refs.wangEditor;
            this.info.answer = wangEditor.html;

            await this.common.postUrl('hcQuestionTF', 'saveQuestionInfo', this.info, null, null, null, true);
            this.$message.success("提交成功")
            try{
                this.$parent.queryHelps();
            }catch(e){}
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