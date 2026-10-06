import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport";

export default {
    name: 'routeManage',
    data()
    {
        return {
            head: [
                {"name": "客户名称", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
                {"name": "线路里程", "code": "mileage", "width": "200", "type": "text"},
                {"name": "业务类型", "code": "bizTypeName", "width": "150", "type": "text"},
                {"name": "起始点", "code": "beginWorkName", "width": "200", "type": "text"},
                {"name": "终点", "code": "endWorkName", "width": "200", "type": "text"},
                {"name": "中途点数量", "code": "midwayPointCount", "width": "100", "type": "text"},
                {"name": "运输时效", "code": "transportTimeliness", "width": "100", "type": "text"},
                {"name": "订单类型", "code": "orderTypeName", "width": "80", "type": "text"},
                {"name": "是否返程", "code": "isReturnName", "width": "80", "type": "text"},
                {"name": "状态", "code": "stsName", "width": "80", "type": "diyColorTd"},
                {"name": "备注", "code": "remark", "width": "180", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "120", "type": "text"}
            ],
            query: {routeName: "",beginWorkNameOrEndWorkName: "",sts: "",tenantId: this.$route.query.tenantId},
            stsData:[],
            tenantData:[],
            uploadOpen : false,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        myImport,
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化数据
         */
        async initData() {
            let that = this;
            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STS"}, function (data) {
                that.stsData = data;
            });
            this.tenantData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
        },
        /**
         *
         */
        async doQuery(query=this.query)
        {
            this.uploadOpen = false;
            this.query = query;
            let {items} = await this.$refs.table.load("routeTF", "loadRouteDataByTenantId", this.query);
            items.forEach((el)=>{
                if(el.sts == 0){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
        },
        /**
         * 跳转新增线路界面
         */
        toAddRoutePage()
        {
            this.$emit("openTab",{
                urlId: 'addRoute' + this.$route.query.tenantId,
                query: this.$route.query,
                urlName: "新增线路",
                urlPathName: "/route",
                urlPath: "/pt/cm/customer/route/addRoute.vue"});
        },
        /**
         * 双击查看详情
         * @param data
         */
        dblclickItem(data)
        {
            this.toShowRoutePage(data);
        },
        /**
         * 跳转查看线路界面
         */
        toShowRoutePage(data)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (this.common.isNotBlank(data))
            {
                selectData[0] = data;
            }
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看的线路！");
                return false;
            }
            let item = selectData[0];
            this.$emit("openTab",{
                urlId: 'routeDetail' + item.routeId,
                query: {
                    orderType: item.orderType,
                    isReturn: item.isReturn,
                    tenantId: item.tenantId,
                    routeId: item.routeId,
                    logId: item.routeId,
                    logType: enumData.LOG_TYPE.ROUTE,
                },
                urlName: "线路详情",
                urlPathName: "/route",
                urlPath: "/pt/cm/customer/route/routeDetailMain.vue"});
        },
        /**
         * 更新线路
         */
        toUpdateRoute()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的线路！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'updateRoute' + this.$route.query.tenantId,
                query: selectData[0],
                urlName: "修改线路",
                urlPathName: "/route",
                urlPath: "/pt/cm/customer/route/updateRoute.vue"});
        },
        /**
         * 启用禁用
         */
        changeRouteSts(sts)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要"+ ((sts === 1) ? "启用" : "禁用") + "的线路！");
                return false;
            }
            this.form = this.common.copyObj(selectData[0]);
            if (this.form.sts === sts)
            {
                this.$message.error("该线路已经是"+ ((sts === 1) ? "启用" : "禁用") + "状态！");
                return false;
            }
            this.form.sts = sts;
            let that = this;
            this.common.postUrl("routeTF", "changeRouteSts", this.form, function (data)
            {
                if (data)
                {
                    that.doQuery();
                    that.$message.success("线路" + (sts === 1 ? "启用" : "禁用") + "成功！");
                }
            })
        },
        /**
         * 清空查询条件
         */
        init()
        {
            this.query = {routeName: "",beginWorkNameOrEndWorkName: "",sts: "",tenantId: ''};
            return this.query;
        },
        /**
         * 清空查询条件
         */
        clear()
        {
            this.query = {};
        },
        /** 订单管理 */
        toOrderManage(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看订单的线路！");
                return false;
            }
            let item = {
                urlName: "订单管理",
                urlId: 'orderManage' + new Date().getTime(),
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderManage.vue",
                query:{
                    routeName:selectData[0].routeName,
                },
            }
            this.$emit('openTab', item);
        },
        download(){
            this.$refs.table.downloadExcelFile('线路列表');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
                {"name":"起点/终点","model":"beginWorkNameOrEndWorkName","type":"input","placeholder":"起点/终点","isshow":true},
                {"name":"是否启用","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"是否启用","method":"doQuery","isshow":true},
                {"name":"客户名称","model":"tenantId","type":"select","options":this.tenantData,"label":"name","value":"tenantId","placeholder":"客户名称","method":"doQuery","isshow":true},
            ]
        }
    },
}
