import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
    name: 'timeLimitRemindManage',
    data() {
        return {
            head: [
                {"name": "客户订单号", "code": "custOrderNum", "width": "150", "type": "text"},
                {"name": "出库单号", "code": "outOrderNum", "width": "150", "type": "text"},
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
                {"name": "要求到达时间", "code": "requireDoneTime", "width": "130", "type": "text"},
                {"name": "当前操作", "code": "curOpTitle", "width": "130", "type": "text"},
                {"name": "前一步完成人", "code": "preCreateUserName", "width": "130", "type": "text"},
                {"name": "前一步完成时间", "code": "preActualDoneTime", "width": "130", "type": "text"},
                {"name": "当前要求时效", "code": "curRequireTimeLimit", "width": "100", "type": "text"},
                {"name": "当前要求完成时间", "code": "curRequireDoneTime", "width": "130", "type": "text"},
                {"name": "当前实时时效", "code": "curTimeout", "width": "130", "type": "diy"},
                {"name": "总实时时效", "code": "timeout", "width": "130", "type": "diy"},
            ],
            loadParam: {
            },

            showSelWork:false,
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
        async initData() {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'WHETHER'});
            this.whetherData = data.WHETHER;
        },
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            this.$refs.table.load("wmsTimeLimitTF", "queryWmsTimeLimitRemindPage", this.loadParam);
        },

    },
    computed:{
        formData(){
            return [
                {"name":"客户订单号","model":"custOrderNum","type":"input","placeholder":"客户订单号","isshow":true},
                {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"到货厂商","isshow":true},
                {"name":"物料编码","model":"materialNum","type":"input","placeholder":"物料编码","isshow":true},
                {"name":"批次号","model":"batchNum","type":"input","placeholder":"批次号","isshow":true},
                {"name":"供应商批次号","model":"supplierBatchNum","type":"input","placeholder":"供应商批次号","isshow":true},
                {"name":"是否超时","model":"isTimeout","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否超时","method":"doQuery","isshow":true},
            ]
        }
    },
}
