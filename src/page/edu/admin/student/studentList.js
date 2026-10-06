import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'checkScore',
    data() {
        return {
            head: [
                {"name": "登录账号", "code": "billId", "width": "200", "type": "text"},
                {"name": "邮箱", "code": "email", "width": "120", "type": "text"},
                {"name": "使用人", "code": "userName", "width": "200", "type": "text"},
                {"name": "所属岗位", "code": "positionName", "width": "150", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "200", "type": "text"},
                {"name": "学分", "code": "credit", "width": "120", "type": "text"},
            ],
            query: this.initQuery(),
        }
    },

    mounted() {
		this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },
    methods: {
        initQuery(){
            return this.query = {
                
            }
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        /**
         * 查询列表
         */
        async doQuery(query = this.query) {
            this.query = query;//赋值
            let {items} = await this.$refs.table.load("eduUserService", "queryEduUserCreditInfoPage", this.query);
			this.$refs.table.resetData(items);
        },
    },
    computed:{
        formData(){
            return [
                {"name":"登录账号","model":"billId","type":"input","isshow":true},
                {"name":"使用人","model":"userName","type":"input","isshow":true},
                {"name":"所属岗位","model":"positionName","type":"input","isshow":true},
            ]
        }
    },
}
