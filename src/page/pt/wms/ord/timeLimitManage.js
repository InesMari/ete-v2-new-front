import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
    name: 'timeLimitManage',
    data() {
        return {
            head: [
                {"name": "客户订单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "150", "type": "text"},
                {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
                {"name": "批次号", "code": "batchNum", "width": "100", "type": "text"},
                {"name": "供应商批次号", "code": "supplierBatchNum", "width": "100", "type": "text"},
                {"name": "数量", "code": "nums", "width": "80", "type": "text"},
                {"name": "单位", "code": "unitName", "width": "80", "type": "text"},
                {"name": "箱数", "code": "boxNums", "width": "80", "type": "text"},
                {"name": "托数", "code": "palletNums", "width": "80", "type": "text"},
                {"name": "抛单时间", "code": "deliverOrderTime", "width": "130", "type": "text"},
                {"name": "仓配总时效", "code": "requireTimeLimit99", "width": "100", "type": "text"},
                {"name": "要求到达时间", "code": "requireDoneTime99", "width": "130", "type": "text"},
                {"name": "实际到达时间", "code": "actualDoneTime99", "width": "130", "type": "text"},
                {"name": "实际总时效", "code": "actualTimeLimit99", "width": "100", "type": "text"},
                {"name": "是否超时", "code": "isTimeout99Name", "width": "80", "type": "text"},
                {"name": "出单时间", "code": "actualDoneTime1", "width": "130", "type": "text"},
                {"name": "出单要求时效", "code": "requireTimeLimit1", "width": "100", "type": "text"},
                {"name": "出单实际时效", "code": "actualTimeLimit1", "width": "100", "type": "text"},
                {"name": "出单是否超时", "code": "isTimeout1Name", "width": "80", "type": "text"},
                {"name": "出单超时原因", "code": "timeoutReason1Name", "width": "150", "type": "text"},
                {"name": "出单人", "code": "createUserName1", "width": "100", "type": "text"},
                {"name": "下架时间", "code": "actualDoneTime2", "width": "130", "type": "text"},
                {"name": "下架要求时效", "code": "requireTimeLimit2", "width": "100", "type": "text"},
                {"name": "下架实际时效", "code": "actualTimeLimit2", "width": "100", "type": "text"},
                {"name": "下架是否超时", "code": "isTimeout2Name", "width": "80", "type": "text"},
                {"name": "下架超时原因", "code": "timeoutReason2Name", "width": "150", "type": "text"},
                {"name": "下架人", "code": "createUserName2", "width": "100", "type": "text"},
                {"name": "装车时间", "code": "actualDoneTime3", "width": "130", "type": "text"},
                {"name": "装车要求时效", "code": "requireTimeLimit3", "width": "100", "type": "text"},
                {"name": "装车实际时效", "code": "actualTimeLimit3", "width": "100", "type": "text"},
                {"name": "装车是否超时", "code": "isTimeout3Name", "width": "80", "type": "text"},
                {"name": "装车超时原因", "code": "timeoutReason3Name", "width": "150", "type": "text"},
                {"name": "装车人", "code": "createUserName3", "width": "100", "type": "text"},
                {"name": "出车时间", "code": "actualStartCarTime", "width": "130", "type": "text"},
                {"name": "卸货时间", "code": "actualDoneTime4", "width": "130", "type": "text"},
                {"name": "短驳要求时效", "code": "requireTimeLimit4", "width": "100", "type": "text"},
                {"name": "短驳实际时效", "code": "actualTimeLimit4", "width": "100", "type": "text"},
                {"name": "短驳是否超时", "code": "isTimeout4Name", "width": "80", "type": "text"},
                {"name": "短驳超时原因", "code": "timeoutReason4Name", "width": "150", "type": "text"},
                {"name": "短驳车牌", "code": "plateNumer", "width": "100", "type": "text"},
                {"name": "短驳司机", "code": "createUserName4", "width": "100", "type": "text"},
                {"name": "短驳供应商", "code": "tenantName", "width": "120", "type": "text"},
            ],
            loadParam: {
                deliverOrderTime:this.initReqDate(),
            },
            showSelWork:false,
            showTimeLimitConfigFlg:false,
            timeLimitConfigList:[],
            timeLimitInfo:{},
            whetherData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        selectWork,
        tableCommon,
        myElDatePicker,
        myImport,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        clearFn(){
            this.loadParam={
                deliverOrderTime:this.initReqDate(),
            };
        },
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            //选择仓库之后加载列表
            this.doQuery();
        },
        initReqDate(){
            const start = new Date();
            const end = new Date();
            start.setDate(start.getDate()-7);
            let time1 = this.common.formatTime(start, "yyyy-MM-dd HH:mm:ss");
            let time2 = this.common.formatTime(end, "yyyy-MM-dd 23:59:59");
            return [time1,time2];
        },
        async initData() {
            this.timeLimitConfigList = await this.common.postUrl("wmsTimeLimitTF", "getWmsTimeLimitConfigInfo");
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'WHETHER'});
            this.whetherData = data.WHETHER;
        },
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.deliverOrderTime) && this.loadParam.deliverOrderTime.length==2){
                this.loadParam.startDeliverOrderTime = this.loadParam.deliverOrderTime[0];
                this.loadParam.endDeliverOrderTime = this.loadParam.deliverOrderTime[1];
                // 校验日期范围不能大于30天
                const startDate = new Date(this.loadParam.startDeliverOrderTime);
                const endDate = new Date(this.loadParam.endDeliverOrderTime);
                const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
                if (diffDays > 30) {
                    this.$message.error("时间范围不能超过30天");
                    return;
                }
            }else{
                this.loadParam.startDeliverOrderTime = '';
                this.loadParam.endDeliverOrderTime = '';
            }
            this.$refs.table.load("wmsTimeLimitTF", "queryWmsTimeLimitPage", this.loadParam);
        },
        async openTimeLimitConfig(flag) {
            if (flag) {
                this.timeLimitInfo = await this.common.postUrl("wmsTimeLimitTF", "getWmsTimeLimitInfo");
                //查询基础配置
            }
            this.showTimeLimitConfigFlg = flag;
        },
        calTimeLimit(){
            let timeLimit = 0;
            if (this.timeLimitConfigList && this.timeLimitInfo) {
                for(let item of this.timeLimitConfigList){
                    if(item.value != 99 && this.timeLimitInfo[item.code]){
                        const value = Number(this.timeLimitInfo[item.code]);
                        // 确保是有效数字
                        if (!isNaN(value)) {
                            timeLimit += value;
                        }
                    }
                }
            }
            this.timeLimitInfo['limit99'] = timeLimit;
            this.$forceUpdate();
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        saveWmsTimeLimitInfo(){
            let that = this;
            this.common.postUrl("wmsTimeLimitTF", "saveWmsTimeLimitInfo", this.timeLimitInfo, function (data) {
                if (data) {
                    that.openTimeLimitConfig(false);
                    that.$message.success("操作成功！");
                }
            },null,'',true);
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },

    },
    computed:{
        formData(){
            return [
                {"name":"客户订单号","model":"custOrderNum","type":"input","placeholder":"客户订单号","isshow":true},
                {"name":"抛单时间","model":"deliverOrderTime","type":"datetimerange","isshow":true},
                {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"到货厂商","isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"批次号","model":"batchNum","type":"input","placeholder":"批次号","isshow":true},
                {"name":"供应商批次号","model":"supplierBatchNum","type":"input","placeholder":"供应商批次号","isshow":true},
                {"name":"是否超时","model":"isTimeout99","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否超时","method":"doQuery","isshow":true},
                {"name":"出单是否超时","model":"isTimeout1","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"出单是否超时","method":"doQuery","isshow":true},
                {"name":"下架是否超时","model":"isTimeout2","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"下架是否超时","method":"doQuery","isshow":true},
                {"name":"装车是否超时","model":"isTimeout3","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"装车是否超时","method":"doQuery","isshow":true},
                {"name":"短驳是否超时","model":"isTimeout4","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"短驳是否超时","method":"doQuery","isshow":true},
            ]
        }
    },
}