import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from "@/components/myFile/file-viewer.vue";
import domtoimage from 'dom-to-image';
import enumData from "@/page/pt/enum.js"

export default {
    name: 'ordPlanManage',
    data() {
        return {
            head: [
                {"name": "下单客户", "code": "orderCustName", "width": "180", "type": "text"},
                {"name": "查看小程序码", "code": "", "width": "120", "type": "diy"},
                {"name": "线路名称", "code": "routeName", "width": "300", "type": "text"},
                {"name": "订单包编号", "code": "planNum", "width": "140", "type": "text"},
                {"name": "平台订单包编号", "code": "thrdPlanNum", "width": "140", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "300", "type": "text"},
                {"name": "状态", "code": "stsName", "width": "50", "type": "text"},
                {"name": "订单包单位", "code": "planCompanyName", "width": "90", "type": "text"},
                {"name": "订单包数", "code": "planCount", "width": "50", "type": "text"},
                {"name": "剩余订单包数", "code": "planUnCount", "width": "100", "type": "text"},
                {"name": "起始日期", "code": "startDate", "width": "90", "type": "text"},
                {"name": "结束日期", "code": "endDate", "width": "90", "type": "text"},
                {"name": "订单类型", "code": "orderTypeName", "width": "90", "type": "text"},
                {"name": "订单数", "code": "ordSum", "width": "90", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "90", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            orderTypeData:[],
            stsData:[],
            srcList: [],
            showSync:false,
            showImgDialog:false,
            currentItem:{},
            qrcodeBase64: '', // 存储二维码的base64数据
            syncInfo:{},
            enumData: enumData,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        fileViewer,
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        initQuery() {
            return this.query = {
                orderCustName: this.$route.query.tenantName,//客户详情订单包管理跳转
                routeName: '',
                orderType: '',
            }
        },
        async init() {
            //加载静态枚举
            let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType:"ORDER_TYPE,VALID"});
            this.orderTypeData = data.ORDER_TYPE;
            this.stsData = data.VALID;
        },
        async doQuery(query = this.query) {
            this.query = query;
            let {items} = await this.$refs.table.load("ordPlanTF", "queryOrdPlanData", this.query);
            items.forEach((el) => {
                if (el.sts == 0||new Date(el.endDate+" 23:59:59")<new Date()) {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        openAddPlanPage()
        {
            this.openInfoPage(enumData.OPEN_PAGE_TYPE.ADD, "", "新增订单包");
        },
        openCopyPlanPage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条订单包！");
                return false;
            }
            let data = selectData[0];
            this.openInfoPage(enumData.OPEN_PAGE_TYPE.COPY, data.id, "复制订单包");
        },
        openInfoPage(type, id, urlName) {
            this.$emit('openTab', {
                urlName: urlName,
                urlId: this.common.getUrlId(type, id),
                urlPathName: "/plan",
                urlPath: "/pt/ord/plan/addPlan.vue",
                query:{
                    type: type,
                    id: id,
                },
            });
        },
        openPlanDetailPage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条订单包！");
                return false;
            }
            let data = selectData[0];
            this.openDetailPage(data);
        },
        dblclickItem(data){
            this.openDetailPage(data);
        },
        openDetailPage(data)
        {
            this.$emit('openTab', {
                urlName: "订单包详情",
                urlId: this.common.getUrlId(enumData.OPEN_PAGE_TYPE.DETAIL, data.id),
                urlPathName: "/plan",
                urlPath: "/pt/ord/plan/planDetail.vue",
                query:{
                    planId:data.id,
                    unShowCheck: 1,
                },
            });
        },
        cancelPlan() {
            let array = this.$refs.table.getSelectItem();
            if (array.length < 1)
            {
                this.$message.error("请选择需要取消的数据！");
                return false;
            }
            let ids = "";
            let names = "";
            let planNum = '';
            for (let i = 0; i < array.length; i++) {
                ids += array[i].id + ",";
                names += "【"+array[i].planNum + "】";
                planNum += array[i].planNum + ",";
            }
            ids = ids.substring(0, ids.length-1);
            planNum = planNum.substring(0, planNum.length-1);
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "取消订单包",
                message: h('p', null, [
                    h('span', null, "此操作将订单包编号："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " 取消，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("ordPlanTF", "cancelPlanInfo", {planIdStr:ids,planNum}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("取消成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
        deletePlan(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let data = selectData[0];
            let that = this;
            this.$confirm("确定删除订单包？", "提示",{center: true}).then(() =>{
                this.common.postUrl("ordPlanTF", "deletePlanById", {id:data.id}, function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        async planToOrder() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条数据！");
                return false;
            }
            let data = selectData[0];
            let result = await this.common.postUrl("ordPlanTF", "getOrderContByPlanId", {id:data.id});
            if (result == 0)
            {
                this.$message.error("该订单包司机还没有领过单！");
            }
            else
            {
                this.$emit('openTab', {
                    urlName: "订单管理",
                    urlId: 'orderManage'+data.id,
                    urlPathName: "/plan",
                    urlPath: "/pt/ord/order/orderManage.vue",
                    query:{
                        planId:data.id,
                        pId: 1001070
                    },
                });
            }
        },
        showImgUrl(url){
            if(!url){
                // this.$message.error("没有图片~");
                return;
            }
            this.srcList=[];
            this.srcList.push(url);
			this.$refs.viewer.show();
        },
        async visitCode(item){
            this.currentItem = item;
            this.showImgDialog = true;
            let data = await this.common.postUrl("ordPlanTF", "loadPlanInfoByPlanId", {planId:item.id},null,null,null,true);
            this.currentItem.orderTypeName = data.orderPlan.orderTypeName;
            this.currentItem.workData = data.workData;
            this.$forceUpdate();
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        openSync(flag){
            if(flag){
                this.syncInfo = {};
                let array = this.$refs.table.getSelectItem();
                if (array.length !== 1)
                {
                    this.$message.error("请选择一条订单包！");
                    return false;
                }
                this.syncInfo.planId = array[0].id;
            }else{
                this.doQuery();
            }
            this.showSync = flag;
            this.$forceUpdate();
        },
        syncOrderInfo(){
            let that = this;
            this.common.postUrl("ordPlanTF", "syncOrder", this.syncInfo, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.openSync(false);
                    that.$message.success("同步成功！");
                }
            },null,'',true);
        },
        // 下载图片
        downloadImg(){
            // 使用ref获取orderView DOM元素
            const orderViewElement = this.$refs.orderView;
            if (!orderViewElement) {
                this.$message.error('找不到要导出的内容');
                return;
            }

            // 显示加载状态
            const loading = this.$loading({
                lock: true,
                text: '正在生成图片...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            // 使用domtoimage生成图片
            domtoimage.toPng(orderViewElement, {
                quality: 1.0,
                width: orderViewElement.scrollWidth,
                height: orderViewElement.scrollHeight,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            })
            .then((dataUrl) => {
                // 创建下载链接
                const link = document.createElement('a');
                link.download = `订单包二维码_${this.currentItem.planNum || 'unknown'}_${new Date().getTime()}.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                loading.close();
                this.$message.success('图片下载成功！');
            })
            .catch((error) => {
                console.error('生成图片失败:', error);
                loading.close();
                this.$message.error('生成图片失败，请重试');
            });
        },
        
    },
    computed:{
        formData(){
            return [
                {"name":"下单客户","model":"orderCustName","type":"input","placeholder":"下单客户","isshow":true},
                {"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
                {"name":"订单类型","model":"orderType","type":"select","options":this.orderTypeData,"label":"codeName","value":"codeValue","placeholder":"订单类型","method":"doQuery","isshow":true},
                {"name":"状态","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"状态","method":"doQuery","isshow":true},
                {"name":"订单包日期","model":"planDate","type":"date","isshow":true},
            ]
        }
    },
}
