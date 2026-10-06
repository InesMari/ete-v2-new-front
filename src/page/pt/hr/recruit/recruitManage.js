import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'recruitManage',
    data()
    {
        return {
            head: [
                {"name": "职位名称", "code": "positionName", "width": "200", "type": "text"},
                {"name": "职位标签", "code": "tags", "width": "300", "type": "text"},
                {"name": "薪资范围", "code": "salary", "width": "200", "type": "text"},
                {"name": "工作城市", "code": "workCity", "width": "100", "type": "text"},
                {"name": "状态", "code": "stsName", "width": "100", "type": "diyColorTd"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "发布时间", "code": "publishDate", "width": "150", "type": "text"},
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
            let {items} = await this.$refs.table.load("hrRecruitInfoTF", "queryHrRecruitInfoPage", this.query);
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
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECRUIT_STATE"}, function (data){
                that.stsData = data;
            });
        },
        initQuery()
        {
            return this.query = {
                searchStr: '',
                sts: '',
            };
        },
        addRecruit() {
            let data = {
                query:{},
                urlId: 'addRecruit'+new Date().getTime(),
                urlName: '新增招聘信息',
                urlPathName: '/addRecruit',
                urlPath: "/pt/hr/recruit/addRecruit.vue",
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
        updateRecruit() {
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
                urlId: 'updateRecruit'+new Date().getTime(),
                urlName: '修改招聘信息',
                urlPathName: '/updateRecruit',
                urlPath: "/pt/hr/recruit/addRecruit.vue",
            }
            this.open(data);
        },
        delRecruit(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除该条数据？", "提示").then(() =>{
                this.common.postUrl("hrRecruitInfoTF", "delHrRecruitInfo", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("失效成功!");
                });
            }).catch(() =>{})
        },
        publishHrRecruitInfo(item){
            let that = this;
            this.common.postUrl("hrRecruitInfoTF", "publishHrRecruitInfo", item, function ()
            {
                that.doQuery();
                that.$message.success("操作成功!");
            });
        },
        toApplicantManage(item){
            let data = {
                query: {positionName:item.positionName},
                urlId: 'applicantManage'+new Date().getTime(),
                urlName: '应聘信息',
                urlPathName: '/applicantManage',
                urlPath: "/pt/hr/recruit/applicantManage.vue",
            }
            this.open(data);
        },
        dblclickItem(item) {
            let data = {
                query: {id:item.id},
                urlId: 'recruitDetail'+new Date().getTime(),
                urlName: '查看招聘信息',
                urlPathName: '/recruitDetail',
                urlPath: "/pt/hr/recruit/recruitDetail.vue",
            }
            this.open(data);
        }
    },
}
