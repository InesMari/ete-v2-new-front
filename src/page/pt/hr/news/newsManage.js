import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'newsManage',
    data()
    {
        return {
            head: [
                {"name": "标题", "code": "title", "width": "200", "type": "text"},
                {"name": "内容", "code": "contentText", "width": "400", "type": "text"},
                {"name": "是否置顶", "code": "topFlagName", "width": "100", "type": "text"},
                {"name": "状态", "code": "stsName", "width": "100", "type": "diyColorTd"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "操作", "code": "", "width": "150", "type": "diy"},
            ],
            query: this.initQuery(),
            stsData:[],
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
            let {items} = await this.$refs.table.load("hrNewsTF", "queryNewsPage", this.query);
            items.forEach((el)=>{
                if(el.sts == 0){
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        initData()
        {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STS"}, function (data){
                that.stsData = data;
            });
        },
        initQuery()
        {
            return this.query = {
                title: '',
                sts: '',
            };
        },
        addNews() {
            let data = {
                query:{},
                urlId: 'addNews'+new Date().getTime(),
                urlName: '新增新闻动态',
                urlPathName: '/addNews',
                urlPath: "/pt/hr/news/addNews.vue",
            }
            this.open(data);
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        updateNews() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            if(selectData[0].sts==0){
                return false;
            }
            let data = {
                query: {id:selectData[0].id},
                urlId: 'updateNews'+new Date().getTime(),
                urlName: '修改新闻动态',
                urlPathName: '/updateNews',
                urlPath: "/pt/hr/news/addNews.vue",
            }
            this.open(data);
        },
        delNews(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要失效的新闻！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要失效该条新闻？", "提示").then(() =>{
                this.common.postUrl("hrNewsTF", "delNews", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("失效成功!");
                });
            }).catch(() =>{})
        },
        setTopFlag(item){
            let that = this;
            this.common.postUrl("hrNewsTF", "setTopFlag", item, function ()
            {
                that.doQuery();
                that.$message.success("操作成功!");
            });
        },
        dblclickItem(item) {
            let data = {
                query: {id:item.id},
                urlId: 'newsDetail'+item.id,
                urlName: '查看新闻动态',
                urlPathName: '/newsDetail',
                urlPath: "/pt/hr/news/newsDetail.vue",
            }
            this.open(data);
        }
    },
}
