import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import $echarts from "echarts";
import contract from "./contract.js"

export default {
    name: 'customerContract',
    mixins: [contract],
    data() {
        return {
            head: [
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "合同评审编号", "code": "reviewContractNum", "width": "150", "type": "text"},
                {"name": "合同名称", "code": "contractName", "width": "250", "type": "text"},
                {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "合同开始日期", "code": "beginDate", "width": "150", "type": "text"},
                {"name": "合同结束日期", "code": "endDate", "width": "150", "type": "text"},
                {"name": "是否顺延", "code": "isPostponeName", "width": "90", "type": "text"},
                {"name": "是否到期", "code": "isExpireName", "width": "90", "type": "text"},
                {"name": "账期(天)", "code": "accountPeriod", "width": "90", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人部门", "code": "regionOrgName", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "合同附件", "code": "", "width": "150", "type": "diy"},
            ],
            customerData: [],
            contractType:1,
            contractReviewType:1,
            baseTitle:"客户",
            tenantName:"客户",

            title:'',
            isShowSetUserDialog:false,
            emailUserList:[],
            staffData:[],
        }
    },
    computed:{
        formData(){
            return [
                {"name":"合同编号","model":"contractNum","type":"input","isshow":true},
                {"name":"合同评审编号","model":"reviewContractNum","type":"input","isshow":true},
                {"name":"合同名称","model":"contractName","type":"input","isshow":true},
                {"name":"客户名称","model":"tenantName","type":"input","isshow":true},
                {"name":"到期自动延期","model":"isPostpone","type":"select","options":this.whetherData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.payTitleOptions, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                // {"name":"是否到期","model":"isExpire","type":"select","options":this.whetherData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"到期状态","model":"expirationStatus","type":"select","options":this.expirationStatusData,"label":"codeName","value":"codeValue","placeholder":"到期状态","method":"doQuery","multiple":true,"isshow":true,"tipText":"将到期：在30天内到期；未到期：不包括30天内将到期的记录"},
                {"name":"合同开始日期","model":"daterange1","type":"daterange","isshow":true},
                {"name":"合同结束日期","model":"daterange2","type":"daterange","isshow":true},            ]
        }
    },
    mounted() {
    	this.initSelf();
		//this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        enumData,
        searchList,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async initSelf() {
            let that = this;
            this.init();
            that.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data)
            {
                that.customerData = data;
            });
        },
        async initEchart(){
            let total = await this.common.postUrl("contractService", "queryCustomerStatisticsData");
            this.list = total.nameList;
            //饼图
            $echarts.init(document.getElementById("chart1")).setOption({
                title: {
                    text: '客户总数：' + total.totalSize,
                    left: 'center',
                    bottom: '2%',
                    textStyle:{
                        fontSize:14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        formatter: '{b} {c}',
                        show: true,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold'
                        }
                    },
                    data: total.customerData
                }]
            });
            //柱形
            $echarts.init(document.getElementById("chart2")).setOption({
                title: {
                    text: '合同份数：' + total.totalContract,
                    left: 'center',
                    bottom: '2%',
                    textStyle:{
                        fontSize:14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                xAxis: {
                    type: 'category',
                    data: total.provinceNameList
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '',
                        type: 'bar',
                        data: total.provinceValueList
                    }
                ]
            });
            //饼图
            $echarts.init(document.getElementById("chart3")).setOption({
                title: {
                    text: '本月新增：' + total.createInCurrentMonthCount,
                    left: 'center',
                    bottom: '-2%',
                    textStyle:{
                        fontSize:14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                legend: {
                    left: 'center',
                    bottom: 10,
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '50%',
                    label: {
                        formatter: '{b} {c}',
                        show: true,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: total.createInCurrentMonthCount, name: '本月新增' },
                        { value: total.createNotInCurrentMonthCount, name: '历史合同' },
                    ]
                }]
            });
            //饼图
            $echarts.init(document.getElementById("chart4")).setOption({
                title: {
                    text: '已合作未提报客户数：' + total.notContractCount,
                    left: 'center',
                    bottom: '-2%',
                    textStyle:{
                        fontSize:14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                legend: {
                    left: 'center',
                    bottom: '5%',
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '5%',
                    top: '0',
                    containLabel: true
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: ['30%', '55%'],
                    avoidLabelOverlap: false,
                    label: {
                        formatter: '{b} {c}',
                        show: true,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: total.hasContractCount, name: '已签合同' },
                        { value: total.notContractCount, name: '已合作未提报客户数' },
                    ]
                }]
            });
        },
        changeChartView(){
            this.showChart = !this.showChart;
            this.$forceUpdate();
        },
        download(){
            this.$refs.table.downloadExcelFile('客户合同列表');
        },

        /**
         * 展示接收邮件人员Dialog
         * @param isShow
         */
        showSetUserDialog(isShow) {
            this.title = "接收邮件人员";
            if (isShow) {
                this.isShowSetUserDialog = true;
                let that = this;
                this.common.postUrl("commonTF", "getRemindEmails", {cfgName:"CONTRACT_EXPIRATION_REMIND_EMAIL_USER"}, function (data) {
                    if (data) {
                        that.emailUserList = data;
                        if (that.emailUserList.length == 0) {
                            that.addRow();
                        }
                        that.queryStaffData();
                    }
                });
            }else {
                this.isShowSetUserDialog = false;
            }
        },


        /** 新增仓库用户行 */
        addRow() {
            let newRow = {
                id: '',
                userName:'',
                billId: '-',
                email: '-',
            };
            this.emailUserList.push(newRow);
            this.$forceUpdate();
        },


        /** 删除仓库用户行 */
        delRow(index) {
            this.emailUserList.splice(index,1);
            if(this.emailUserList.length === 0){
                this.addRow();
            }
            this.$forceUpdate();
        },

        /** 查询人员列表 */
        queryStaffData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryStaffData", {haveEmail:1}, function (data) {
                that.staffData = data;
            });
        },

        /**
         * 选择用户
         * @param userData
         */
        selectUser(userData) {
            for (let i = 0; i < this.staffData.length; i++) {
                if (this.staffData[i].userId == userData.userId) {
                    userData.billId = this.staffData[i].billId;
                    userData.userName = this.staffData[i].staffName;
                    userData.email = this.staffData[i].email;
                    break;
                }
            }
        },

        /**
         * 保存仓库人员信息
         */
        saveEmailUser() {
            let method = 'saveEmailUser';
            let that = this;
            let param = {emailUserList : that.emailUserList,cfgName:"CONTRACT_EXPIRATION_REMIND_EMAIL_USER"};
            this.common.postUrl("commonTF", method, param, function (data) {
                if (data) {
                    that.showSetUserDialog(false);
                    that.$message.success("操作成功！");
                }
            },null,'',true);
        },

    },
}
