import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'deviceOpLog',
    data()
    {
        return {
            head: [
                {"name": "器具名称", "code": "deviceName", "width": "150", "type": "text"},
                {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "数量", "code": "dealNum", "width": "100", "type": "text"},
                {"name": "在库余量", "code": "stockNum1", "width": "120", "type": "text"},
                {"name": "客户处余量", "code": "stockNum2", "width": "120", "type": "text"},
                {"name": "未回收余量", "code": "stockNum3", "width": "120", "type": "text"},
                {"name": "来源地", "code": "srcWorkName", "width": "150", "type": "text"},
                {"name": "交付地", "code": "destWorkName", "width": "150", "type": "text"},
                {"name": "操作类型", "code": "dealTypeName", "width": "100", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            dealTypeData: [],
            query: this.initQuery(),
        }
    },
    async mounted()
    {
        await this.init();
        await this.doQuery();
    },
    components: {
        tableCommon,
        enumData,
        searchList
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init()
        {
            this.dealTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEV_DEVICE_OP_TYPE"});
        },
        /**
         * 初始化查询条件
         * @returns {*}
         */
        initQuery()
        {
            return this.query = {
                tenantName: '',
                srcWorkName: '',
                destWorkName: '',
                deviceName: '',
                dealType: '',
                dealDate:'',
            };
        },
        /**
         * 列表查询
         */
        async doQuery(query=this.query)
        {
            this.query = query;
            if(this.common.isNotBlank(this.query.dealDate) && this.query.dealDate.length === 2){
                this.query.startCreateDate = this.query.dealDate[0];
                this.query.endCreateDate = this.query.dealDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            await this.$refs.table.load("deviceRecordService", "queryDeviceRecordPage", this.query);
        },
        download(){
            this.$refs.table.downloadExcelFile('操作记录列表');
        },

    },
    computed:{
        formData(){
            return [
                {"name":"客户名称","model":"tenantName","type":"input","placeholder":"搜索客户名称","isshow":true},
                {"name":"来源地","model":"srcWorkName","type":"input","placeholder":"搜索来源地","isshow":true},
                {"name":"交付地","model":"destWorkName","type":"input","placeholder":"搜索交付地","isshow":true},
                {"name":"器具名称","model":"deviceName","type":"input","placeholder":"搜索器具名称","isshow":true},
                {"name":"操作类型","model":"dealType","type":"select","options":this.dealTypeData,"label":"codeName","value":"codeValue","placeholder":"操作类型","method":"doQuery","isshow":true},
                {"name":"操作时间","model":"dealDate","type":"daterange","isshow":true},
            ]
        }
    },
}
