import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import innerTab from "@/components/innerTab/innerTab.vue"

export default {
    name: 'checkScore',
    data() {
        return {
            head: [
                {"name": "学员名称", "code": "userName", "width": "200", "type": "text"},
                {"name": "所属岗位", "code": "positionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "200", "type": "text"},
                {"name": "选择判断分数", "code": "part1Score", "width": "150", "type": "text"},
                {"name": "简答题分数", "code": "part2Score", "width": "200", "type": "text"},
                {"name": "总分", "code": "totalScore", "width": "120", "type": "text"},
                {"name": "是否达标", "code": "stateName", "width": "120", "type": "text"},
                {"name": "考试时间", "code": "createDate", "width": "120", "type": "text"},
            ],
            positionsData: [],  //获取岗位
            whetherData: [],    //是否达标
            orgData: [],    //所属部门
            src:1,
            query: this.initQuery(),
            tabs:[
                {
                    name:"指定学员",
                    active:true,
                    src:1,
                },
                {
                    name:"其他学员",
                    src:0,
                },
            ]
        }
    },

    mounted() {
    	this.init();
		this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
        innerTab,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
            // 获取岗位
            this.positionsData = await this.common.postUrl("eduCourseService", "getAllPositions");
            // 是否达标
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData",{codeType: "WHETHER"});
            // 所属部门
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
        },
        initQuery(){
            return this.query = {
                src : this.src,
                courseId : this.$route.query.id,
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
            this.query.src = this.src;
            let {items} = await this.$refs.table.load("eduCourseService", "queryEduUserTestInfoPage", this.query);
			this.$refs.table.resetData(items);
        },
        selectCallback(data){
            this.src = data.src;
            this.doQuery(this.query);
        },
    },
    computed:{
        formData(){
            return [
                {"name":"学员名称","model":"userName","type":"input","isshow":true},
                {"name":"所属岗位","model":"positionName","type":"select","options":this.positionsData, "label":"positionName","value":"id","method":"doQuery","isshow":true},
                {"name":"所属部门","model":"orgId","type":"select","options":this.orgData, "label":"orgName","value":"id","method":"doQuery","isshow":true},
                {"name":"是否达标","model":"state","type":"select","options":this.whetherData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
