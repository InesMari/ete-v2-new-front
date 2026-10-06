import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'wmsExamineItemCfgManage',
    data()
    {
        return {
            head: [
                {"name": "核查项目", "code": "itemName", "width": "100", "type": "text"},
                {"name": "使用场景", "code": "relOperationName", "width": "180", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建日期", "code": "createDate", "width": "150", "type": "text"},
            ],
            loadParam: {
                itemName:'',
                relOperation:'',
            },
            info:{
                itemName:'',
                relOperation:[],
                remark:'',
            },
            title:'新增',
            dialogShow:false,
            relOperationData:[],
        }
    },
    async mounted()
    {
        await this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        clearFn(){
            this.loadParam={
                itemName:'',
                relOperation:'',
            };
        },
        addCfg(){
            this.title='新增';
            this.info={
                itemName:'',
                relOperation:[],
                remark:'',
            };
            this.dialogShow = true;
        },
        modifyCfg(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            var n=selectData[0].relOperation.split(",");
            let relOperation = [];
            n.forEach(i=>relOperation.push(i+''));
            this.title='修改';
            this.info={
                id:selectData[0].id,
                itemName:selectData[0].itemName,
                relOperation:relOperation,
                remark:selectData[0].remark,
            };
            this.dialogShow = true;
        },
        delCfg(){
            //选择一个项目
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            this.info={
                id:selectData[0].id,
                itemName:selectData[0].itemName,
            };
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除核查项目",
                message: h('p', null, [
                    h('span', null, "此操作将核查项目："),
                    h('i', { style: 'color: red' }, selectData[0].itemName),
                    h('span', null, " 删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("wmsExamineTF", "delWmsExamineItemCfg", that.info, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });

        },
        saveCfg(){
            if(this.common.isBlank(this.info.itemName)){
                this.$message.error("请输入核查项目！");
                return;
            }
            if(this.info.relOperation.length==0){
                this.$message.error("请选择使用场景！");
                return;
            }
            let mes = this.common.isBlank(this.info.id) ? "新增核查项目成功！" : "修改核查项目成功！";
            let that = this;
            that.common.postUrl("wmsExamineTF", "saveWmsExamineItemCfg", that.info, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.showDialog(false);
                    that.$message.success(mes);
                }
            },null,'',true);
        },
        showDialog(flg){
            this.dialogShow = flg;
        },
        /**
         * 初始化数据
         */
        async initData(){
            let that = this;

            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"EXAMINE_OPERATION"}, function (data) {
                that.relOperationData = data;
            });
        },
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            await this.$refs.table.load("wmsExamineTF", "queryWmsExamineItemCfgPage", this.loadParam);
        },

    },
    computed:{
        formData(){
            return [
                {"name":"核查项目","placeholder":"核查项目","model":"itemName","type":"input","isshow":true},
                {"name":"使用场景","model":"relOperation","type":"select","options":this.relOperationData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
