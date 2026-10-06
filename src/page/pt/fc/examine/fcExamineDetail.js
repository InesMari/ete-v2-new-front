import dbTable from "@/components/dbTable/dbTable.vue";
import vuedraggable from "vuedraggable";

export default {
    name: 'fcExamineDetail',
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{
                    name:'',
                    year:'',
                    remark:'',
                },
                items:[]
            },
            head:[],
            headShow:[],
            headTr2:[],
            baseHead: [
                {"name": "指标名称", "code": "itemName", "width": "200", "type": "text"},
                {"name": "数据来源", "code": "srcOrgName", "width": "120", "type": "text"},
                {"name": "一级部门", "code": "firstOrgName", "width": "120", "type": "text"},
                {"name": "二级部门", "code": "secondOrgName", "width": "120", "type": "text"},
                {"name": "关键目标", "width": "200", "type": "text",
                    "children":[
                        {"name": "月度目标", "code": "monthTarget", "width": "100", "type": "inputText"},
                        {"name": "年度目标", "code": "yearTarget", "width": "100", "type": "inputText"},
                    ]
                },
            ],
            operateHead: [
                {"name": "指标名称", "code": "itemName", "width": "250"},
            ],
            isShowDialog:false,
            id:this.$route.query.id,
            type:this.$route.query.type //1 新增  2 修改 3 查看
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        vuedraggable
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            if(this.type==1){
                this.info.baseInfo.year = new Date();
                this.initName(this.common.formatDate.year());
                this.initItems();
            }else{
                let that = this;
                let method = 'queryFcExamineInfoForView';
                if(this.type==2){
                    method = 'queryFcExamineInfoForUpdate';
                }
                this.common.postUrl("fcExamineTF", method, {id:this.id}, function (data) {
                    that.info = data;
                    that.initHead(that.info.baseInfo.year);
                    that.tmpYear = that.info.baseInfo.year;
                    that.info.baseInfo.year = new Date(that.info.baseInfo.year+'/01'+'/01');
                });
            }
        },
        initName(year){
            this.info.baseInfo.name = '绩效考核-'+year;
            this.initHead(year);
            this.tmpYear = year;
        },
        initItems(){
            let that = this;
            this.common.postUrl("fcExamineTF", "queryFcExamineItemInfoList", {}, function (data) {
                that.info.items = data;
            });
        },
        initHead(year){
            this.head=this.common.copyObj(this.baseHead);
            let tmp = {'name':year+'年度','width':960,type:'text','children':[]};
            for (let i = 1; i <= 12; i++) {
                tmp.children.push({'name':i+'月','code':'value'+i,'width':80,'type':'inputText'});
            }
            this.head.push(tmp);
            this.headTr2 = [];
            this.headShow = [];
            this.head.forEach(item => {
                if(this.common.isNotBlank(item.children)){
                    item.children.forEach(el => {
                        this.headTr2.push(el);
                        this.headShow.push(el);
                    })
                }else{
                    this.headShow.push(item);
                }
            })
        },
        /**
         * 操作
         */
        async operation(){
            this.isShowDialog = true;
            this.$nextTick(async ()=>{
                this.$refs.table.setRightData(this.common.copyObj(this.info.items));
                let tableData = await this.common.postUrl("fcExamineTF", "queryFcExamineItemInfoList", {});
                this.$refs.table.setLeftData(tableData);
            })
        },
        // 保存费用项目的更改
        saveChange(){
            let data = this.$refs.table.getRightData();
            this.info.items = this.common.copyObj(data);
            this.isShowDialog = false;
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        //  提交
        async submit(){
            let info = this.common.copyObj(this.info);
            info.baseInfo.year = this.tmpYear;
            let method = 'addFcExamineInfo';
            if(this.type==2){
                method = 'updateFcExamineInfo';
            }
            await this.common.postUrl('fcExamineTF',method,info,null,null,null,true);
            this.$message.success("提交成功")
            this.closePage();
        },
    },
}
