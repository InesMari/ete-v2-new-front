import tree from '@/components/tree/tree.vue'

export default {
    name: 'classSet',
    data()
    {
        return {
            selInfo:{},
            info:this.initInfo(),
            treeData: [],//树形数据
            flag:true,
            btnflag:false,
            courseOneClass:[],
            isUpdate:false,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.queryAllEquipmentClassTree();
    },
    /**
     * 组件
     */
    components: {
        tree,
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            this.info={
                id:'',
                parentId:'',
                name:'',
                isTwoClass:'',
                sortId:'',
            };
            return this.info;
        },
        async queryAllEquipmentClassTree(){
            this.treeData = await this.common.postUrl("eduHomeService", "getClassTree", {});
            this.courseOneClass = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "COURSE_ONE_CLASS"});

        },
        async selectItem(item){
            this.selInfo = item;
            this.info = this.common.copyObj(item);
            console.log(this.info)
        },
        add(){
            this.flag=false;
            this.isUpdate = false;
            if(this.selInfo.isTwoClass.isTwoClass){
                this.$message.error("请选择一级课程分类！");
                return false;
            }
            this.initInfo();
            this.info.parentId = this.selInfo.id;
            this.info.id = '';
            this.$forceUpdate();
        },
        update(){
            this.flag=false;
            this.btnflag = true;
            this.isUpdate = true;
            this.$forceUpdate();
        },
        cancel(){
            this.btnflag = false;
            this.flag=true;
            this.isUpdate = false;
            this.info = this.common.copyObj(this.selInfo);
            this.$forceUpdate();
        },
        del(){
            if (!this.info.id) {
                this.$message.error("请选择需要删除的课程分类！");
                return false;
            }
            this.$confirm("确认需要删除课程分类？", "提示").then(async () => {
                await this.common.postUrl("eduHomeService", "delCourseClass", this.info);
                this.$message.success("删除成功！");
                this.flag=true;
                this.initInfo();
                this.btnflag = false;
                await this.queryAllEquipmentClassTree();
            }).catch(() => {});
        },
        async saveOrUpdate() {
            await this.common.postUrl("eduHomeService", "saveCourseClass", this.info);
            this.$message.success("保存成功！");
            this.flag=true;
            this.initInfo();
            this.btnflag = false;
            this.isUpdate = false;
            await this.queryAllEquipmentClassTree();
        }
    },
}
