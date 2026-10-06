import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'ordTimeLimitManage',
	data()
	{
		return {
			head: [
				{"name": "客户名称", "code": "tenantName", "width": "180", "type": "text"},
                {"name": "订单编号", "code": "orderNum", "width": "120", "type": "diy"},
                {"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
                {"name": "下单人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "下单部门", "code": "orgName", "width": "120", "type": "text"},
                {"name": "下单时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "下单时效", "code": "timeLimit1Name", "width": "120", "type": "diy"},
                {"name": "订单完成时间", "code": "finishDate", "width": "150", "type": "text"},
                {"name": "订单完成时效", "code": "timeLimit2Name", "width": "120", "type": "diy"},
                {"name": "派车单编号", "code": "waybillNum", "width": "120", "type": "diy"},
                {"name": "供应商名称", "code": "supplierTenantName", "width": "180", "type": "text"},
                {"name": "司机名称", "code": "driverName", "width": "120", "type": "text"},
                {"name": "车牌号", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "调度人", "code": "waybillCreateUserName", "width": "120", "type": "text"},
                {"name": "调度组织", "code": "waybillOrgName", "width": "120", "type": "text"},
                {"name": "调度时间", "code": "waybillCreateDate", "width": "150", "type": "text"},
                {"name": "调度时效", "code": "timeLimit3Name", "width": "120", "type": "diy"},
                {"name": "发车时间", "code": "waybillStartCarDate", "width": "150", "type": "text"},
                {"name": "发车时效", "code": "timeLimit4Name", "width": "120", "type": "diy"},
                {"name": "收车时间", "code": "waybillEndCarDate", "width": "150", "type": "text"},
                {"name": "运输时效", "code": "timeLimit5Name", "width": "120", "type": "diy"},
			],
            orgIdData:[],
			query: this.initQuery(),
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
        this.initData();
		this.$nextTick(() => {
			this.doQuery();//初始化查询条件再查询
		})
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		searchList,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery(query=this.query)
		{
			this.query = query;
            if (this.common.isNotBlank(this.query.orderDate) && this.query.orderDate.length === 2) {
                this.query.startDate = this.query.orderDate[0];
                this.query.endDate = this.query.orderDate[1];
            } else {
                this.query.startDate = '';
                this.query.endDate = '';
            }
			await this.$refs.table.load("orderService", "queryOrderTimeLimitPage", this.query);
		},
        initData(){
            let that = this;
            this.common.postUrl("regionOrgTF", "getOrgInfoList", {}, function (data) {
                that.orgIdData = data;
            });
        },
		initQuery()
		{
			this.query = {
                tenantName: '',
                orgId: '',
                wOrgId: '',
                createUserName:'',
                waybillCreateUserName:'',
                waybillOrgName:'',
                orderNum:'',
                orderDate:[],
			};
			return this.query;
		},
        download(){
            this.$refs.table.downloadExcelFile('订单时效列表');
        },
        /**
         * 派车单详情/中转详情
         */
        toDetail(item, code)
        {
            if (code == 'waybillNum')
            {
                if (item.isTransit == 1)
                {
                    this.$emit('openTab', {
                        urlName: '查看中转',
                        urlId: 'transitManage',
                        urlPathName: "/order",
                        urlPath: "/pt/ord/transit/transitDetailMain",
                        query:{t:3,waybillNum: item.waybillNum, tansitWaybillId: item.waybillId},
                    });
                }
                else
                {
                    this.$emit("openTab",{
                        urlId: 'waybillDetail' + item.waybillId,
                        query: {waybillId: item.waybillId},
                        urlName: "派车单详情",
                        urlPathName: "/detail",
                        urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
                }
            }
            else if (code == 'orderNum')
            {
                this.$emit("openTab",{
                    urlId: 'orderDetail' + item.orderId,
                    query: {orderId: item.orderId, pId: 1001070},
                    urlName: "订单详情",
                    urlPathName: "/order",
                    urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
            }
        },

	},
	computed:{
		formData(){
			return [
                {"name":"客户名称","model":"tenantName","type":"input","placeholder":"客户名称","isshow":true},
                {"name":"下单部门","model":"orgIds","type":"select","options":this.orgIdData,"label":"orgName","value":"id","placeholder":"下单部门","multiple":true,"method":"doQuery","isshow":true},
                {"name":"调度部门","model":"wOrgIds","type":"select","options":this.orgIdData,"label":"orgName","value":"id", "placeholder":"调度部门","multiple":true,"method":"doQuery","isshow":true},
                {"name":"下单人","model":"createUserName","type":"input","placeholder":"下单人","isshow":true},
                {"name":"调度人","model":"waybillCreateUserName","type":"input","placeholder":"调度人","isshow":true},
                {"name":"派车单号","model":"waybillNum","type":"input","placeholder":"派车单号","isshow":true},
                {"name":"订单编号","model":"orderNum","type":"input","placeholder":"订单编号","isshow":true},
                {"name":"下单时间","model":"orderDate","type":"daterange","isshow":true},
            ]
		}
	},
}