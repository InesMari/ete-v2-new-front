import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'applicantManage',
    data()
    {
        return {
            head: [
                {"name": "职位名称", "code": "positionName", "width": "200", "type": "text"},
                {"name": "工作城市", "code": "workCity", "width": "200", "type": "text"},
                {"name": "姓名", "code": "userName", "width": "120", "type": "text"},
                {"name": "手机号码", "code": "billId", "width": "120", "type": "text"},
                {"name": "电子邮箱", "code": "email", "width": "150", "type": "text"},
                {"name": "期望工作城市", "code": "hopeWorkCity", "width": "150", "type": "text"},
                {"name": "处理意见", "code": "remark", "width": "200", "type": "text"},
                {"name": "状态", "code": "stsName", "width": "100", "type": "text"},
                {"name": "投递时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "更新人", "code": "updateUserName", "width": "120", "type": "text"},
                {"name": "更新时间", "code": "updateDate", "width": "150", "type": "text"},
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
            let {items} = await this.$refs.table.load("hrRecruitInfoTF", "queryHrApplicantInfoPage", this.query);
            items.forEach((el)=>{
                if(el.sts == 1){
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        initData()
        {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLICANT_STATE"}, function (data){
                that.stsData = data;
            });
        },
        initQuery()
        {
            return this.query = {
                positionName: this.$route.query.positionName,
                userName:'',
                sts: '',
            };
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
        updateHrApplicantInfoState(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要处理的数据！");
                return false;
            }
            if(selectData[0].sts==1){
                this.$message.error("该数据已经处理，无需重复处理！");
                return false;
            }
            let item  = this.common.copyObj(selectData[0]);
            let that = this;
            this.$prompt('请确认处理该条数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async ({ value }) => {
                item.remark = value;
                this.common.postUrl("hrRecruitInfoTF", "updateHrApplicantInfoState", item, function ()
                {
                    that.doQuery();
                    that.$message.success("操作成功!");
                });
            }).catch(() => {});


        },
        dblclickItem(item) {
            let data = {
                query: {id:item.id},
                urlId: 'applicantDetail'+item.id,
                urlName: '查看应聘信息',
                urlPathName: '/applicantDetail',
                urlPath: "/pt/hr/recruit/applicantDetail.vue",
            }
            this.open(data);
        }
    },
}
