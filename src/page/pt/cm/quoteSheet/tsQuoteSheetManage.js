import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'tsQuoteSheetManage',
    data()
    {
        return {
            head: [
                {"name": "报价单号", "code": "quoteNum", "width": "150", "type": "text"},
                {"name": "客户名称", "code": "custName", "width": "250", "type": "text"},
                {"name": "引入状态", "code": "introductStateName", "width": "250", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "联系人", "code": "linkman", "width": "150", "type": "text"},
                {"name": "联系电话", "code": "billId", "width": "150", "type": "text"},
                {"name": "邮箱", "code": "email", "width": "200", "type": "text"},
                {"name": "客户确认状态", "code": "confirmStateName", "width": "150", "type": "text"},
                {"name": "客户确认日期", "code": "confirmDate", "width": "200", "type": "text"},
                {"name": "客户确认备注", "code": "confirmRemark", "width": "200", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "150", "type": "text"},
                {"name": "审核日期", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核备注", "code": "verifyRemark", "width": "200", "type": "text"},
                {"name": "审核人", "code": "verifyUser", "width": "150", "type": "text"},
                {"name": "报价日期", "code": "quoteDate", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUser", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"},
            ],
            confirmStateData:[],
            verifyStateData:[],
            whetherData:[],
            loadParam: {
                quoteNum:'',
                custName:'',
                confirmStates:[],
                verifyStates:[],
                quoteDate:'',
            },
            info:{validDate:[]},
            generateShowFlag:false,
            dialogVisible:false,
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.quoteDate) && this.loadParam.quoteDate.length === 2){
                this.loadParam.startQuoteDate = this.loadParam.quoteDate[0];
                this.loadParam.endQuoteDate = this.loadParam.quoteDate[1];
            }else{
                this.loadParam.startQuoteDate = '';
                this.loadParam.endQuoteDate = '';
            }
            await this.$refs.table.load("quoteSheetTF", "queryQuoteSheetPage", this.loadParam);
        },
        initData()
        {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "QUOTE_CONFIRM_STATE"}, function (data) {
                that.confirmStateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"}, function (data) {
                that.verifyStateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"WHETHER"}, function (data) {
                that.whetherData = data;
            });
        },
        // 查看详情
        dblclickItem(item){
            let quoteId = item.quoteId;
            this.$emit('openTab', {
                urlName: '报价单详情',
                urlId: 'quoteSheetDetail'+quoteId,
                urlPathName: "/quoteSheetDetail",
                urlPath: "/pt/cm/quoteSheet/quoteSheetDetailMain.vue",
                query:{
                    quoteId,
                    logId: quoteId,
                    logType: enumData.LOG_TYPE.QUOTE_SHEET,
                }
            });

        },
        toAll(){
            this.$emit('openTab', {
                urlName: '批量查看报价单',
                urlId: 'tsQuoteSheetRptManage',
                urlPathName: "/tsQuoteSheetRptManage",
                urlPath: "/pt/cm/quoteSheet/tsQuoteSheetRptManage.vue",
                query:{}
            });
        },
        showGenerate(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要引入的数据！");
                return false;
            }
            if (selectData[0].confirmState!=1)
            {
                this.$message.error("只有已确认的数据才可以引入！");
                return false;
            }
            if (selectData[0].verifyState!=1)
            {
                this.$message.error("只有已审核的数据才可以引入！");
                return false;
            }
            const start = new Date();
            const end = new Date();
            end.setFullYear(end.getFullYear()+1);
            let time1 = this.common.formatTime(start, "yyyy-MM-dd");
            let time2 = this.common.formatTime(end, "yyyy-MM-dd");
            this.info = this.common.copyObj(selectData[0]);
            this.info.validDate = [time1,time2];
            this.generateShowFlag = true;
            this.$forceUpdate();
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        toGenerate(){
            let that = this;
            if(this.common.isNotBlank(this.info.validDate) && this.info.validDate.length==2){
                this.info.effectDate = this.info.validDate[0];
                this.info.expireDate = this.info.validDate[1];
            }else{
                this.$message.error("请选择有效期！");
                return false;
            }
            this.common.postUrl("quoteSheetTF", "generateQuoteSheet", this.info, function ()
            {
                that.doQuery(that.loadParam);
                that.$message.success("报价单引入成功!");
                that.generateShowFlag = false;
            });
        },
        // 新增
        toAdd(){
            this.$emit('openTab', {
                urlName: '新增报价单',
                urlId: new Date().getTime(),
                urlPathName: "/addQuoteSheet",
                urlPath: "/pt/cm/quoteSheet/addQuoteSheet.vue"
            });
        },
        // 修改
        toUpdate(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            if (selectData[0].confirmState==1)
            {
                this.$message.error("客户确认的数据不能修改！");
                return false;
            }
            let quoteId = selectData[0].quoteId;
            if (selectData[0].verifyState==1)
            {
                let msg = `
                    <p style="text-align:center;">注：此报价单：${selectData[0].quoteNum}已审核!</p>
                    <p style="text-align:center;">若继续进行此操作，原报价单将自动存放于历史报价中，</p>
                    <p style="text-align:center;font-weight:bold;margin-top:10px;">是否继续？</p>
                    `;
                if(selectData[0].cancelSpecialState==1){
                    msg = `
                    <p style="text-align:center;">注：此报价单：${selectData[0].quoteNum}已审核!</p>
                    <p style="text-align:center;">若继续进行此操作，原报价单将自动存放于历史报价中，</p>
<!--                    <p style="text-align:center;">此报价单已存在对应的仓储合同，修改提交并且确认后原仓储合同将自动作废，</p>-->
                    <p style="text-align:center;font-weight:bold;margin-top:10px;">是否继续？</p>
                    `;
                }
                this.$confirm(msg, "修改提示" ,{
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString:true
                }).then(() =>{
                    this.$emit('openTab', {
                        urlName: '修改报价单',
                        urlId: quoteId,
                        urlPathName: "/updateQuoteSheet",
                        urlPath: "/pt/cm/quoteSheet/addQuoteSheet.vue",
                        query:{quoteId, type:2}
                    });
                }).catch(() =>{})
            }else{
                this.$emit('openTab', {
                    urlName: '修改报价单',
                    urlId: quoteId,
                    urlPathName: "/updateQuoteSheet",
                    urlPath: "/pt/cm/quoteSheet/addQuoteSheet.vue",
                    query:{quoteId, type:2}
                });
            }

        },
        toCopy(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的数据！");
                return false;
            }
            let quoteId = selectData[0].quoteId;
            this.$emit('openTab', {
                urlName: '复制报价单',
                urlId: quoteId,
                urlPathName: "/copyQuoteSheet",
                urlPath: "/pt/cm/quoteSheet/addQuoteSheet.vue",
                query:{quoteId, isCopy: 1}
            });
        },

        delQuoteSheet(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            if (selectData[0].confirmState!=0)
            {
                this.$message.error("只有未确认的数据才可以删除！");
                return false;
            }
            if (selectData[0].verifyState!=0)
            {
                this.$message.error("只有未审核的数据才可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("quoteSheetTF", "delQuoteSheet", selectData[0], function ()
                {
                    that.doQuery(that.loadParam);
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        /**
         * 客户确认
         * @returns {Promise<boolean>}
         */
        async confirmQuoteSheet() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要确认的数据！");
                return false;
            }
            if (selectData[0].confirmState!=0)
            {
                this.$message.error("只有未确认的数据才可以确认！");
                return false;
            }
            let that = this;
            let param = this.common.copyObj(selectData[0]);
            this.$prompt("您正在操作客户确认，确认后不能修改，是否继续?", "提示",{
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                showInput: true,
                center: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '客户确认备注',
                beforeClose:async function (action, instance, done)
                {
                    param.confirmRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.confirmState = 1;
                        await this.common.postUrl("quoteSheetTF", "confirmQuoteSheet", param, null, null, '', true);
                        that.doQuery();
                        this.$message.success("操作成功！");
                    }
                    else if (action === 'cancel')
                    {
                        param.confirmState = 2;
                        await this.common.postUrl("quoteSheetTF", "confirmQuoteSheet", param, null, null, '', true);
                        that.doQuery();
                        this.$message.success("操作成功！");
                    }
                    done();
                }
            });
        },
        /**
         * 撤销客户确认
         * @returns {Promise<boolean>}
         */
        async cancelConfirmQuoteSheet() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要确认的数据！");
                return false;
            }
            if (selectData[0].confirmState!=1)
            {
                this.$message.error("只有已确认的数据才可以撤销确认！");
                return false;
            }
            let param = this.common.copyObj(selectData[0]);
            let that = this;
            this.$confirm("确定需要撤销确认？", "提示",{center: true}).then(() =>{
                that.common.postUrl("quoteSheetTF", 'cancelConfirmQuoteSheet', param, function (data) {
                    if (data) {
                        that.doQuery();
                        that.$message.success("操作成功！");
                    }
                },null,'',true);
            }).catch(() =>{})
        },
        /**
         * 审核
         * @returns {Promise<boolean>}
         */
        async verifyQuoteSheet() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审核的数据！");
                return false;
            }
            if (selectData[0].verifyState!=0)
            {
                this.$message.error("只有未审核的数据才可以确认！");
                return false;
            }
            let param = this.common.copyObj(selectData[0]);
            let that = this;
            this.$prompt("您正在操作审核，审核后不能修改，是否继续?", "提示",{
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '审核备注',
                beforeClose:async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.verifyState = 1;
                        await this.common.postUrl("quoteSheetTF", "verifyQuoteSheet", param);
                        await that.doQuery();
                        this.$message.success("操作成功！")
                    }
                    else if (action === 'cancel')
                    {
                        param.verifyState = 2;
                        await this.common.postUrl("quoteSheetTF", "verifyQuoteSheet", param);
                        await that.doQuery();
                        this.$message.success("操作成功！")
                    }
                    done();
                }
            });

        },
        downloadPdf(type){
            let fileName = '报价单.pdf';
            let param = {};
            let array = this.$refs.table.getSelectItem();
            if (array.length < 1) {
                this.$message.error("请选择一条数据");
                return false;
            }
            let quoteIds = [];
            if(type==2){
                fileName = '报价单.xlsx';
            }
            for (let i = 0; i < array.length; i++) {
                if(array[i].verifyState!=1){
                    this.$message.error("未审核通过不能导出");
                    return false;
                }
                quoteIds.push(array[i].quoteId);
            }
            if(array.length>1){
                param.quoteIds = quoteIds;
                param.fileSubName = 'zip';
            }
            param.quoteId = array[0].quoteId;
            param.type = type;

            param.selfCreateUrl = 'quoteSheetTF|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'tsQuoteSheetManageTable');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"报价单号","model":"quoteNum","type":"input","placeholder":"报价单号","isshow":true},
                {"name":"客户名称","model":"custName","type":"input","placeholder":"客户名称","isshow":true},
                {"name":"客户确认状态","model":"confirmStates","type":"select","options":this.confirmStateData,"label":"codeName","value":"codeValue","placeholder":"客户确认状态","method":"doQuery","multiple":true,"isshow":true},
                {"name":"审核状态","model":"verifyStates","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","multiple":true,"isshow":true},
                {"name":"报价日期","model":"quoteDate","type":"daterange","isshow":true},
                {"name":"引入状态","model":"introductState","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"引入状态","method":"doQuery","isshow":true},
                {"name":"起始地","model":"startAddress","type":"input","placeholder":"起始地","isshow":true},
                {"name":"目的地","model":"endAddress","type":"input","placeholder":"目的地","isshow":true},
            ]
        }
    },
}
