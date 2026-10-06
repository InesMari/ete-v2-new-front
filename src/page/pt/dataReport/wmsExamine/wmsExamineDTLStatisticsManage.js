import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';
import $echarts from "echarts";
import enumData from "@/page/pt/enum";

export default {
    name: 'wmsExamineDTLStatisticsManage',
    data()
    {
        return {
            head: [
                {"name": "核查名称", "code": "examineName", "width": "180", "type": "text"},
                {"name": "所属区域", "code": "workName", "width": "180", "type": "text"},
                {"name": "核查项目", "code": "itemName", "width": "120", "type": "text"},
                {"name": "数据来源", "code": "orderTypeName", "width": "120", "type": "text"},
                {"name": "单号", "code": "orderNum", "width": "150", "type": "diy"},
                {"name": "核查状态", "code": "stsName", "width": "120", "type": "text"},
                {"name": "备注", "code": "remark", "width": "220", "type": "text"},
                {"name": "图片", "code": "imgUrl", "width": "120", "type": "diy"},
                {"name": "操作人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            loadParam: {
                workId:'',
                itemId:this.$route.query.itemId?parseInt(this.$route.query.itemId):'',
                orderType:'',
                orderNum:'',
                sts:this.$route.query.sts,
                examineIds:this.initExamineIds(),
            },
            workData:[],
            examineItemData:[],
            orderTypeData:[],
            stsData:[],
            examineData:[],

            srcList: [],
            btnTitle:'切换图表模式',
            showChart:false,
            list: [],
            tips:'',
        }
    },
    async mounted()
    {
        this.initData();
        this.doQuery();
    },
    components: {
        tableCommon,
        searchList,
        fileViewer
    },
    methods: {
        clearFn(){
            this.loadParam={
                workId:'',
                itemId:'',
                orderType:'',
                orderNum:'',
                sts:'',
                examineIds:[],
            };
        },
        changeShowChart(){
            if(this.showChart){
                this.showChart=false;
                this.btnTitle='切换图表模式';
                this.tips = '';
            }else{
                this.showChart=true;
                this.btnTitle='切换列表模式';
                this.tips = '注：此处只针对异常数据展示';
            }
            this.doQuery();
        },
        async initEchart(){
            // echart图表
            this.list = await this.common.postUrl("wmsExamineTF", 'queryWmsExamineItemStatistics', this.loadParam);
            this.$nextTick(() => {
                for (let i = 0; i < this.list.length; i++) {
                    // if(this.list[i].sts2>0){
                        this.initEchartData(this.list[i].abnormalData, i);
                    // }
                }
            })
        },
        initEchartData(data, index)
        {
                const echart = $echarts.init(document.getElementById('chart' + index));
                echart.setOption({
                    series: [{
                        type: 'pie',
                        radius: '65%',
                        left: 0,
                        top: '20px',
                        right: 0,
                        bottom: 0,
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 1
                        },
                        label: {
                            minMargin: 5,
                            formatter: '{b}\n{c}',
                            lineHeight: 15
                        },
                        data: data,
                    }]
                });
        },
        initExamineIds(){
          let  examineIds = [];
          if(this.$route.query.examineId){
              examineIds.push(parseInt(this.$route.query.examineId))
          }
          return examineIds;
        },
        /**
         * 显示大图
         * @param data
         */
        showBigImg(data)
        {
            this.srcList=[];
            this.srcList.push(data.imgUrl);
            this.$refs.viewer.show();
        },
        /**
         * 初始化数据
         */
        async initData(){
            let that = this;
            //仓库数据
            this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {}, function (data) {
                that.workData = data;
            });
            this.common.postUrl("wmsExamineTF", "queryWmsExamineItemCfgList", {}, function (data) {
                that.examineItemData = data;
            });
            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"EXAMINE_OPERATION"}, function (data) {
                that.orderTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"ORDER_EXAMINE_ITEM_STS"}, function (data) {
                that.stsData = data;
            });
            this.common.postUrl("wmsExamineTF", "queryWmsExamineInfoList", {}, function (data) {
                that.examineData = data;
            });
        },
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            if(this.showChart){
                this.initEchart();
            }else{
                await this.$refs.table.load("wmsExamineTF", "queryWmsExamineItemDtlPage", this.loadParam);
            }
        },
        gotoOrder(item){
            if (item.orderType == 1)
            {
                this.$emit("openTab",{
                    urlId: "inOrderDetail"+item.orderId,
                    query: {inOrderId:item.orderId,
                        logId: item.orderId,
                        logType: enumData.LOG_TYPE.WMS_IN_ORDER,
                    },
                    urlName: '入库单详情',
                    urlPathName: "/inOrderDetail",
                    urlPath: '/pt/wms/ord/inOrderDetail.vue'});
            }
            else
            {
                this.$emit("openTab",{
                    urlId: "urlId"+item.orderId,
                    query: {outOrderId:item.orderId,
                        logId: item.orderId,
                        logType: enumData.LOG_TYPE.WMS_OUT_ORDER,
                    },
                    urlName: '出库单详情',
                    urlPathName: "/outOrderDetail",
                    urlPath: '/pt/wms/ord/outOrderDetail.vue'});
            }
        },
        dblclickItem(item){
            this.$emit("openTab",{
                urlId: "wmsOrderExamineDetail"+item.id,
                query:  {id:item.orderId,operation:item.orderType},
                urlName: '核查详情',
                urlPathName: "/wmsOrderExamineDetail",
                urlPath: '/pt/dataReport/wmsExamine/wmsOrderExamineDetail.vue'});
        }
    },
    computed:{
        formData(){
            return [
                {"name":"所属区域","model":"workId","type":"select","options":this.workData,"label":"workName","value":"workId","clearable":true,"method":"doQuery","isshow":true},
                {"name":"核查项目","model":"itemId","type":"select","options":this.examineItemData,"label":"itemName","value":"id","clearable":true,"method":"doQuery","isshow":true},
                {"name":"数据来源","model":"orderType","type":"select","options":this.orderTypeData,"label":"codeName","value":"codeValue","placeholder":"数据来源","method":"doQuery","isshow":true},
                {"name":"单号","placeholder":"单号","model":"orderNum","type":"input","isshow":true},
                {"name":"核查状态","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"核查状态","method":"doQuery","isshow":true},
                {"name":"核查名称","model":"examineIds","type":"select","options":this.examineData,"label":"examineName","value":"id","clearable":true,"method":"doQuery","isshow":true,'multiple':true},
            ]
        }
    },
}
