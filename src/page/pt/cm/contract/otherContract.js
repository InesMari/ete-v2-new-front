import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from "@/components/myFile/file-viewer";
import contract from "./contract.js"

export default {
    name: 'otherContract',
    mixins: [contract],
    data() {
        return {
            head: [
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "合同评审编号", "code": "reviewContractNum", "width": "150", "type": "text"},
                {"name": "合同名称", "code": "contractName", "width": "250", "type": "text"},
                {"name": "部门", "code": "orgNames", "width": "250", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "合同开始日期", "code": "beginDate", "width": "150", "type": "text"},
                {"name": "合同结束日期", "code": "endDate", "width": "150", "type": "text"},
                {"name": "是否顺延", "code": "isPostponeName", "width": "90", "type": "text"},
                {"name": "是否到期", "code": "isExpireName", "width": "90", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人部门", "code": "regionOrgName", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "合同附件", "code": "", "width": "150", "type": "diy"},
            ],
            contractType:6,
            contractReviewType:2,
            baseTitle:"供应商-其他",
            tenantName:"供应商",
        }
    },
    computed:{
    },
    mounted() {
		this.init();
        //this.doQuery();
    },
    components: {
        tableCommon,
        enumData,
        searchList,
        myFileModel,
        fileViewer,
    },
    methods: {
        download(){
            this.$refs.table.downloadExcelFile('供应商-其他合同列表');
        },
    },
}
