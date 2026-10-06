import commonRoute from "@/page/pt/cm/customer/route/commonRoute.js";

export default {
    name: 'addRoute',
    mixins: [commonRoute],
    data() {
        return {
            isShowReturn: true,
            form:{
                routeName: '',
                orderType: "1",
                bizType: "",
                isReturn:"0",
                remark: '',
                transportTimeliness: '',
                tenantId :this.$route.query.tenantId
            },
        }
    },
    /**
     * 初始化
     */
    mounted(){
        this.loadWorkData();
        this.loadGoodsData();
        this.init();
    },
    methods:{
        /**
         * 初始化
         */
        init()
        {
            //跳转过来新增的条件赋值
            if (this.common.isNotBlank(this.$route.query.orderType))
            {
                if (this.$route.query.orderType == 1)
                {
                    //默认就是正常不返程
                }
                else if (this.$route.query.orderType == 2)
                {
                    this.form.orderType = 1;
                    this.form.isReturn = 1;//整车返程
                }
                else if (this.$route.query.orderType == 3)
                {
                    this.form.orderType = 2;
                }
            }
        },
        /**
         * 选择作业点提示
         */
        selectWorkTip()
        {
            if (this.workData.length === 0)
            {
                this.$confirm("当前客户还没有作业点,是否需要前往新增作业点？", "提示").then(() =>{
                    this.$emit("openTab",{
                        urlId: 'workInfoManage' + this.$route.query.tenantId,
                        query: this.$route.query,
                        urlName: "作业点配置",
                        urlPathName: "/customer",
                        urlPath: "/pt/cm/customer/workInfoManage.vue"});
                }).catch(() =>{});
            }
        },
        /**
         * 选择作业点提示
         */
        selectGoodsTip()
        {
            if (this.goodsData.length === 0)
            {
                this.$route.query.pId = 1001024;
                this.$confirm("当前客户还没有货物,是否需要前往新增货物？", "提示").then(() =>{
                    this.$emit("openTab",{
                        urlId: 'goodInfoManage' + this.$route.query.tenantId,
                        query: this.$route.query,
                        urlName: "货物配置",
                        urlPathName: "/customer",
                        urlPath: "/pt/cm/customer/goodsInfoManage.vue"});
                }).catch(() =>{});
            }
        },
        /**
         * 新增线路
         */
        addRoute()
        {
            if (this.common.isBlank(this.form.routeName))
            {
                this.$message.error("请输入线路名称再保存！");
                return false;
            }
            if (this.common.isBlank(this.form.bizType))
            {
                this.$message.error("请选择业务类型再保存！");
                return false;
            }
            if (this.common.isBlank(this.form.transportTimeliness))
            {
                this.$message.error("请填写运输时效再保存！");
                return false;
            }
            if (this.routeList.length < 2)
            {
                this.$message.error("请选择至少两个以上作业点数据！");
                return false;
            }
            let set = new Set();
            for (let i = 0; i < this.routeList.length; i++)
            {
                let aa = this.routeList[i];
                if (this.common.isBlank(aa.workId))
                {
                    this.$message.error("存在未选择作业点名称的作业点,请选择！");
                    return false;
                }
                else
                {
                    if (i > 0 && i < this.routeList.length - 1)
                    {
                        if (set.has(aa.workId))
                        {
                            this.$message.error("中途点不能相同,请重新选择！");
                            return false;
                        }
                        set.add(aa.workId);
                    }
                }
            }
            if (this.form.orderType == 2)
            {
                if (this.routeList.length != 2)
                {
                    this.$message.error("零担的线路只有两个作业点，请移除多余的作业点！");
                    return false;
                }
                this.form.isShowReturn = 0;//零担默认不是返程
            }
            this.form.works = this.routeList;//作业点数据
            this.form.goods = this.tableData;//货物数据
            let that = this;
            this.common.postUrl("routeTF","addRoute", this.form, function (data)
            {
                if (data)
                {
                    that.$message.success("线路保存成功！");
                    that.closePage();
                }
            },null,'',true);
        },
    }
}
