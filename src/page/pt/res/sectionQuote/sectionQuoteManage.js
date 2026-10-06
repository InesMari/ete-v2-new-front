import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'sectionQuoteManage',
    data() {
        return {
            head: [
                {"name": "询价编号", "code": "rfqQuoteNum", "width": "150", "type": "text"},
                {"name": "报价类型", "code": "rfqQuoteTypeName", "width": "80", "type": "text"},
                {"name": "询价状态", "code": "rfqStsName", "width": "80", "type": "text"},
                {"name": "审计状态", "code": "verifyStateName", "width": "80", "type": "text"},
                {"name": "是否发起审计", "code": "selVerifyStateName", "width": "100", "type": "text"},
                {"name": "是否已生成报价", "code": "createQuoteStsName", "width": "100", "type": "text"},
                {"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "线路", "code": "routeName", "width": "200", "type": "text"},
                {"name": "起始地", "code": "beginIndexSearchStr", "width": "200", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "200", "type": "text"},
                {"name": "估算距离", "code": "predictDistance", "width": "80", "type": "text"},
                {"name": "估算时间", "code": "predictTime", "width": "80", "type": "text"},
                {"name": "中途点", "code": "midwayPointNum", "width": "80", "type": "text"},
                {"name": "询价有效开始时间", "code": "effectDate", "width": "150", "type": "text"},
                {"name": "询价有效结束时间", "code": "expireDate", "width": "150", "type": "text"},
                {"name": "生效状态", "code": "validStateName", "width": "80", "type": "diyColorTd"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            rfqStsData: [],
            createQuoteStsData: [],
            dic_whether:[],
            verifyStateData:[],
        }
    },
    mounted() {
        this.doQuery();
        this.initStaticData();
    },
    components: {
        tableCommon,
        searchList,
    },
    methods: {
        async initStaticData()
        {
            this.rfqStsData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RFQ_STS"});
            this.createQuoteStsData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "CREATE_QUOTE_STS"});
            //加载静态枚举
            this.dic_whether = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUOTE_VERIFY_STATE"});
        },
        initQuery()
        {
            return this.query = {
                rfqQuoteNum: null,
                beginIndexSearchStr: null,
                endIndexSearchStr: null,
                rfqSts: this.$route.query.rfqSts,
                createQuoteSts:null,
                selVerifyState:this.$route.query.selVerifyState,
                verifyState:this.$route.query.verifyState,
            };
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("sectionQuoteService", "querySectionQuotePage", this.query);
            items.forEach((el)=>{
                if(el.validState != 1){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
        },
        openAddPage()
        {
            this.$emit('openTab', {
                urlName: '新增询价',
                urlId: 'addSectionQuote' + new Date().getTime(),
                urlPathName: "/res",
                urlPath: "/pt/res/sectionQuote/addSectionQuote.vue",
                query: {},
            });
        },
        openUpdatePage()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的询价！");
                return false;
            }
            let data = selectData[0];
            if (data.rfqSts != 0)
            {
                this.$message.error("只有未竞价的询价，才能修改！");
                return false;
            }
            if (data.rfqQuoteType == 4)
            {
                this.$emit('openTab', {
                    urlName: '修改批量询价',
                    urlId: 'updateBatchSectionQuote' + data.id,
                    urlPathName: "/res",
                    urlPath: "/pt/res/sectionQuote/batchSectionQuote.vue",
                    query: {id: data.id},
                });
            }
            else
            {
                this.$emit('openTab', {
                    urlName: '修改询价',
                    urlId: 'updateSectionQuote' + data.id,
                    urlPathName: "/res",
                    urlPath: "/pt/res/sectionQuote/updateSectionQuote.vue",
                    query: {id: data.id},
                });
            }
        },
        deleteSectionQuote()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的询价！");
                return false;
            }
            if (selectData[0].rfqSts != 0)
            {
                this.$message.error("只有未竞价的询价，才能删除！");
                return false;
            }
            if (selectData[0].createQuoteSts != 0)
            {
                this.$message.error("只有未生成报价的询价，才能删除！");
                return false;
            }
            this.$confirm("是否确认删除询价？", "提示").then(async () =>{
                await this.common.postUrl("sectionQuoteService", "deleteSectionQuoteById", selectData[0], null, null,'',true);
                this.$message.success("删除成功！");
                await this.doQuery();
            }).catch(() =>{
            });
        },
        batchSectionQuote()
        {
            this.$emit('openTab', {
                urlName: '批量询价',
                urlId: 'batchSectionQuote' + new Date().getTime(),
                urlPathName: "/res",
                urlPath: "/pt/res/sectionQuote/batchSectionQuote.vue",
                query: {},
            });
        },
        async initiateAudit()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要发起审计的询价！");
                return false;
            }
            let data = selectData[0];
            if (data.rfqQuoteType == 4)
            {
                this.$message.error("批量询价不能发起审计！");
                return false;
            }
            if (data.selVerifyState == 1)
            {
                this.$message.error("已经发起审计的询价，请勿重复操作！");
                return false;
            }
            let count = await this.common.postUrl("sectionQuoteService", "queryBidCountBySectionQuoteId", selectData[0], null, null,'',true);
            if (count > 0)
            {
                this.$emit('openTab', {
                    urlName: '询价发起审计',
                    urlId: 'sectionQuoteDetail' + data.id + "-" + 1,
                    urlPathName: "/res",
                    urlPath: "/pt/res/sectionQuote/sectionQuoteDetail.vue",
                    query: {id: data.id, type: 1},
                });
            }
            else
                this.$message.error("未有供应商报价，无法发起审计！");
        },
        audit()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审计的询价！");
                return false;
            }
            let data = selectData[0];
            if (data.rfqQuoteType == 4)
            {
                this.$message.error("批量询价不能审计！");
                return false;
            }
            if (data.rfqSts != 3)
            {
                this.$message.error("只有询价完成的询价，才能审计！");
                return false;
            }
            if (data.selVerifyState == 0)
            {
                this.$message.error("只有已经发起审计的询价，才能审计！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '询价审计',
                urlId: 'sectionQuoteDetail' + data.id + "-" + 2,
                urlPathName: "/res",
                urlPath: "/pt/res/sectionQuote/sectionQuoteDetail.vue",
                query: {id: data.id, type: 2},
            });
        },
        generateQuote()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要生成报价的询价！");
                return false;
            }
            let data = selectData[0];
            if (data.rfqQuoteType == 4)
            {
                this.$message.error("批量询价不能生成报价！");
                return false;
            }
            if (data.rfqSts != 3)
            {
                this.$message.error("请先完成询价！");
                return false;
            }
            if (data.selVerifyState == 0)
            {
                this.$message.error("请先发起审计！");
                return false;
            }
            if (data.verifyState != 1)
            {
                this.$message.error("只有审计通过的询价，才能生成！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '询价生成报价',
                urlId: 'generateSectionQuote' + data.id,
                urlPathName: "/res",
                urlPath: "/pt/res/sectionQuote/generateSectionQuote.vue",
                query: {id: data.id, rfqQuoteType: data.rfqQuoteType},
            });
        },
        dblclickItem(data)
        {
            if (data.rfqQuoteType == 4)
            {
                this.$emit('openTab', {
                    urlName: '批量询价详情',
                    urlId: 'batchsectionQuoteDetail' + data.id,
                    urlPathName: "/res",
                    urlPath: "/pt/res/sectionQuote/batchSectionQuoteMain.vue",
                    query: {id: data.id, type: 0,
                        logId:  data.id,
                        logType: enumData.LOG_TYPE.SECTION_QUOTE,
                    },
                });
            }
            else
            {
                this.$emit('openTab', {
                    urlName: '询价详情',
                    urlId: 'sectionQuoteDetail' + data.id + "-" + 0,
                    urlPathName: "/res",
                    urlPath: "/pt/res/sectionQuote/sectionQuoteDetailMain.vue",
                    query: {id: data.id, type: 0,
                        logId:  data.id,
                        logType: enumData.LOG_TYPE.SECTION_QUOTE,
                    },
                });
            }
        },
    },
    computed: {
        formData() {
            return [
                {"name":"询价单号","model":"rfqQuoteNum","type":"input","placeholder":"询价单号","isshow":true},
                {"name":"起始地","model":"beginIndexSearchStr","type":"input","placeholder":"起始地","isshow":true},
                {"name":"目的地","model":"endIndexSearchStr","type":"input","placeholder":"目的地","isshow":true},
                {"name":"报价状态","model":"rfqSts","type":"select","options":this.rfqStsData,
                    "label":"codeName","value":"codeValue","placeholder":"报价状态","method":"doQuery","isshow":true},
                {"name":"是否生成报价","model":"createQuoteSts","type":"select","options":this.createQuoteStsData,
                    "label":"codeName","value":"codeValue","placeholder":"是否生成报价","method":"doQuery","isshow":true},
                {"name":"是否发起审计","model":"selVerifyState","type":"select","options":this.dic_whether,
                    "label":"codeName","value":"codeValue","placeholder":"是否发起审计","method":"doQuery","isshow":true},
                {"name":"审计状态","model":"verifyState","type":"select","options":this.verifyStateData,
                    "label":"codeName","value":"codeValue","placeholder":"审计状态","method":"doQuery","isshow":true},
            ]
        }
    },
}
