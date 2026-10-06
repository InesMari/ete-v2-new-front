import commonRoute from "@/page/pt/cm/customer/route/commonRoute.js";

export default {
    name: 'updateRoute',
    mixins: [commonRoute],
    data() {
        return {
            isShowReturn: false,
            form:{
                routeName: '',
                bizType: "",
                orderType: this.$route.query.orderType,
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
        this.init();
    },
    methods:{
        /**
         * 初始化
         */
        init()
        {
            let that = this;
            this.common.postUrl("routeTF","loadRouteById", that.$route.query, function (data)
            {
                that.form = data.routeInfo;
                if (that.common.isNotBlank(data.routeInfo.bizType))
                    that.form.bizType = data.routeInfo.bizType + "";
                that.isShowReturn = that.form.orderType == 1;//零担需要隐藏是否返程
                that.routeList = data.routeList;
                if (!data.goodsData || data.goodsData.length === 0){ data.goodsData = [{goodsId: '',className: '',packingType: '',goodsModel: '',}] }
                that.tableData = data.goodsData;
                that.goodsData.forEach(itemG => {
                    that.tableData.forEach(item => {
                        if (itemG.goodsId == item.goodsId){ itemG.disabled = true; }
                    });
                });
                that.calcWidth();
            });
        },
        /**
         * 追加线路作业点
         * @param index
         */
        addRouteWorkItem2(index){
            return false;//不支持修改作业点
            //this.addRouteWorkItem(index);
        },
        /**
         * 移除线路作业点
         * @param index
         */
        removeRouteWorkItem2(index){
            return false;//不支持修改作业点
            // this.removeRouteWorkItem(index);
        },

        /**
         * 已经选择的作业点类型置顶
         * @param item
         */
        showWorkTypeTop2(item){
            return false;//不支持修改作业点
            // this.showWorkTypeTop();
        },
        /**
         * 新增线路
         */
        updateRoute()
        {
            if (this.common.isBlank(this.form.routeName))
            {
                this.$message.error("请输入线路名称再保存！");
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
            this.common.postUrl("routeTF","updateRoute", this.form, function (data)
            {
                if (data)
                {
                    that.$message.success("线路修改成功！");
                    that.closePage();
                }
            },null,'',true);
        },

    }
}
