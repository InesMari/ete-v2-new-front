import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";

export default {
    name: 'questionManage',
    data()
    {
        return {
            head: [
                {"name": "分类目录", "code": "typeName", "width": "100", "type": "text"},
                {"name": "标题", "code": "name", "width": "200", "type": "text"},
                {"name": "排序", "code": "sortId", "width": "100", "type": "text"},
                {"name": "是否热门", "code": "isPopular", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "120", "type": "text"},
            ],
            query: this.initQuery(),
            typeData:[],
            whetherData:[],
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
    },
    methods: {
        async doQuery()
        {
            await this.$refs.table.load("hcQuestionTF", "queryQuestionInfoPage", this.query);
        },
        initData()
        {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUESTION_TYPE"}, function (data){
                that.typeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data){
                that.whetherData = data;
            });
        },
        initQuery()
        {
            return this.query = {
                type: '',
                isPopular: '',
                content:'',
            };
        },
        async addQa() {
            let data = {
                query:{type:1},//type 1 新增 2 修改 3 查看
                urlId: 'addQuestion'+new Date().getTime(),
                urlName: '新增问题',
                urlPathName: '/addQuestion',
                urlPath: "/pt/base/hc/qa/addQuestion.vue",
            }
            await this.open(data);
        },
        async open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        async updateQa() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let data = {
                query: {type: 2,id:selectData[0].id},//type 1 新增 2 修改 3 查看
                urlId: 'updateQuestion'+selectData[0].id,
                urlName: '修改问题',
                urlPathName: '/updateQuestion',
                urlPath: "/pt/base/hc/qa/addQuestion.vue",
            }
            await this.open(data);
        },
        deleteQa(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("hcQuestionTF", "delQuestionInfo", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                    try{
                        that.$parent.queryHelps();
                    }catch(e){}
                });
            }).catch(() =>{})
        },
        async dblclickItem(item) {
            let data = {
                query: {id:item.id},
                urlId: 'questionDetail'+item.id,
                urlName: '查看问题',
                urlPathName: '/questionDetail',
                urlPath: "/pt/base/hc/qa/questionDetail.vue",
            }
            await this.open(data);
        }
    },
}
