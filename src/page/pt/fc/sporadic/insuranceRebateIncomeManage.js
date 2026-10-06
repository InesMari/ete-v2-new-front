import tableCommon from "@/components/table/tableCommon.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'insuranceRebateIncomeManage',
    data()
    {
        return {
            head: [
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "150", "type": "text"},
                {"name": "险种", "code": "insuranceProduct", "width": "150", "type": "text"},
                {"name": "保额", "code": "sumInsured", "width": "120", "type": "text"},
                {"name": "返点金额", "code": "rebateAmount", "width": "120", "type": "text"},
                {"name": "入账金额", "code": "postedAmount", "width": "120", "type": "text"},
                {"name": "保险公司", "code": "insuranceCompany", "width": "120", "type": "text"},
                {"name": "保险开始日期", "code": "startDate", "width": "120", "type": "text"},
                {"name": "保险结束日期", "code": "endDate", "width": "120", "type": "text"},
                {"name": "入账日期", "code": "postedDate", "width": "120", "type": "text"},
                {"name": "附件", "code": "fileId", "width": "150", "type": "diy"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "确认状态", "code": "confirmStateName", "width": "150", "type": "text"},
                {"name": "确认人", "code": "confirmUserName", "width": "150", "type": "text"},
                {"name": "确认时间", "code": "confirmDate", "width": "150", "type": "text"},
                {"name": "收款时间", "code": "receiveFeeDate", "width": "120", "type": "text"},
                {"name": "确认备注", "code": "confirmRemark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: {},
            settleBodyData: [],
            confirmStateData: [],
            srcList: [],

            confirmShow:false,
            info:{
                receiveFeeDate:'',
                confirmRemark:'',
            },
        }
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        fileViewer,
        searchList,
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化数据
         */
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'PAY_TITLE,CONFIRM_STATE'});
            this.settleBodyData = data.PAY_TITLE;
            this.confirmStateData = data.CONFIRM_STATE;
            for (let i = 0; i < this.confirmStateData.length; i++) {
                if(this.confirmStateData[i].codeValue=='2'){
                    this.confirmStateData.splice(i,1);
                    i--;
                }
            }
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.postedDate) && this.query.postedDate.length === 2){
                this.query.postedBeginDate = this.query.postedDate[0];
                this.query.postedEndDate = this.query.postedDate[1];
            }else{
                this.query.postedBeginDate = '';
                this.query.postedEndDate = '';
            }
            if(this.common.isNotBlank(this.query.receiveFeeDate) && this.query.receiveFeeDate.length === 2){
                this.query.startReceiveFeeDate = this.query.receiveFeeDate[0];
                this.query.endReceiveFeeDate = this.query.receiveFeeDate[1];
            }else{
                this.query.startReceiveFeeDate = '';
                this.query.endReceiveFeeDate = '';
            }
            let {items} = await this.$refs.table.load("insuranceRebateIncomeService", "queryInsuranceRebateIncomePage", this.query);
            items.forEach((el) =>
            {
                if (el.sts == 0)
                {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        addIncome()
        {
            this.$emit('openTab', {
                urlName: "新增保险返点收入",
                urlId: 'insuranceRebate' + new Date().getDate(),
                urlPathName: "/sporadic",
                urlPath: "/pt/fc/sporadic/insuranceRebate.vue",
                query: {},
            });
        },
        /**
         * 修改
         */
        updateIncome()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据~");
                return false;
            }
            let item = selectData[0];
            if (item.confirmState == enumData.FC_CONFIRM_STATE.CONFIRMED)
            {
                this.$message.error("该数据已确认，无法修改！");
                return false;
            }
            this.$emit('openTab', {
                urlName: "修改保险返点收入",
                urlId: 'insuranceRebate' + item.id,
                urlPathName: "/sporadic",
                urlPath: "/pt/fc/sporadic/insuranceRebate.vue",
                query: {
                    id: item.id,
                    type: 2,
                },
            });
        },
        async deleteIncome()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据~");
                return false;
            }
            let item = selectData[0];
            if (item.confirmState == enumData.FC_CONFIRM_STATE.CONFIRMED)
            {
                this.$message.error("该数据已确认，无法删除！");
                return false;
            }
            let that = this;
            this.$confirm("你将删除当前数据，是否确认删除", "删除提示" ,{
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                center: true
            }).then(async () => {
                await that.common.postUrl("insuranceRebateIncomeService", "deleteInsuranceRebateIncome", {id: item.id});
                await that.doQuery();
                that.$message.success("删除成功!");
            }).catch(() =>{})
        },
        confirmIncome()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length === 0){
                this.$message.error("请至少选择一条需要确认数据~");
                return false;
            }
            if(selectData.length>1){
                for (let i = 0; i < selectData.length; i++)
                {
                    if (selectData[i].confirmState == enumData.FC_CONFIRM_STATE.CONFIRMED)
                    {
                        this.$message.error("第"+(i+1)+"行数据已确认，请勿重复操作！");
                        return false;
                    }
                }
                let ids = [];
                selectData.forEach(item => {
                    if (this.common.isNotBlank(item.id)){
                        ids.push(item.id);
                    }
                });
                this.info = {};
                this.info.ids = ids;
                this.info.receiveFeeDate = this.common.formatDate.getDate();
                this.showConfirm(true);
            }else{
                let item = selectData[0];
                if (item.confirmState == enumData.FC_CONFIRM_STATE.CONFIRMED)
                {
                    this.$message.error("该数据已确认，请勿重复操作！");
                    return false;
                }
                this.$emit('openTab', {
                    urlName: "保险返点收入确认",
                    urlId: 'insuranceRebate' + item.id,
                    urlPathName: "/sporadic",
                    urlPath: "/pt/fc/sporadic/insuranceRebate.vue",
                    query: {
                        id: item.id,
                        type: 6,
                    },
                });
            }
        },
        showConfirm(flag){
            this.confirmShow = flag;
            this.$forceUpdate();
        },
        /**
         * 收款确认
         */
        confirm()
        {
            let that = this;
            this.common.postUrl("insuranceRebateIncomeService", "confirmInsuranceRebateIncomes", this.info, function (data)
            {
                that.doQuery();
                that.$message.success("财务确认成功！");
                that.showConfirm(false);
            },null,'',true);
        },
        detailIncome()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看详情的数据~");
                return false;
            }
            this.dblclickItem(selectData[0]);
        },
        dblclickItem(data)
        {
            this.$emit('openTab', {
                urlName: "保险返点收入详情",
                urlId: 'insuranceRebate' + data.id,
                urlPathName: "/sporadic",
                urlPath: "/pt/fc/sporadic/insuranceRebate.vue",
                query: {
                    id: data.id,
                    type: 5,
                },
            });
        },
        showFile(data)
        {
            let urlList = data.urlList;
            if (!(urlList && urlList.length > 0))
            {
                this.$message.error("没有文件~");
                return;
            }
            this.srcList=[];
            for (let item of urlList)
            {
                let url = item;
                let typeList = {
                    img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                    table:".xls,.xlsx,.XLS,.XLSX",
                    file:"file"
                };
                let fileTypeName = url.substring(url.lastIndexOf('.'), url.length);
                if(typeList['img'].indexOf(fileTypeName)>-1){
                    this.srcList.push(url);
      			    this.$refs.viewer.show();
                }else{
                    url = url.replace("_big", "");
                    let fileType = this.common.getFileType('',url);
                    if(fileType=='pdf'){   //查看pdf
                        let idx = url.indexOf("?");
                        if(idx>=0){
                            url = url.substring(idx,0);
                        }
                        this.srcList.push(url);
      			        this.$refs.viewer.show();
                    }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){   //查看pdf
                        this.srcList.push(url);
      			        this.$refs.viewer.show();
                    }else{  //下载文件
                        this.common.downloadFile(url)
                    }
                }
            }
        },
        download(){
          this.$refs.table.downloadExcelFile('保险返点收入列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"财务确认状态","model":"confirmState","type":"select","options":this.confirmStateData,"label":"codeName","value":"codeValue","placeholder":"确认状态","method":"doQuery","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"险种","model":"insuranceProduct","type":"input","placeholder":"险种","isshow":true},
                {"name":"保险公司","model":"insuranceCompany","type":"input","placeholder":"保险公司","isshow":true},
                {"name":"入账日期","model":"postedDate","type":"daterange","isshow":true},
                {"name":"收款时间","model":"receiveFeeDate","type":"daterange","isshow":true},
                {"name":"确认备注","model":"confirmRemark","type":"input","placeholder":"确认备注","isshow":true},
            ]
        }
    },
}
