import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from "@/components/myFile/file-viewer";
import contract from "./contract.js"

export default {
    name: 'innerContract',
    mixins: [contract],
    data() {
        return {
            contractType:7,
            contractReviewType:2,//
            baseTitle:"供应商-内部结转",
            tenantName:"供应商",
            head: [
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "业务内容", "code": "businessContent", "width": "250", "type": "text"},
                {"name": "甲方开票抬头", "code": "partyATitleName", "width": "250", "type": "text"},
                {"name": "乙方开票抬头", "code": "partyBTitleName", "width": "250", "type": "text"},
                {"name": "甲方所属部门", "code": "partyAOrgName", "width": "150", "type": "text"},
                {"name": "乙方开票抬头", "code": "partyBOrgName", "width": "150", "type": "text"},
                {"name": "合同开始日期", "code": "beginDate", "width": "150", "type": "text"},
                {"name": "合同结束日期", "code": "endDate", "width": "150", "type": "text"},
                {"name": "是否顺延", "code": "isPostponeName", "width": "90", "type": "text"},
                {"name": "是否到期", "code": "isExpireName", "width": "90", "type": "text"},
                {"name": "创建人部门", "code": "regionOrgName", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "合同附件", "code": "", "width": "150", "type": "diy"},
            ],
        }
    },
    computed:{
        formData(){
            return [
                {"name":"合同编号","model":"contractNum","type":"input","isshow":true},
                {"name":"业务内容","model":"businessContent","type":"input","isshow":true},
                {"name":"到期自动延期","model":"isPostpone","type":"select","options":this.whetherData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"到期状态","model":"expirationStatus","type":"select","options":this.expirationStatusData,"label":"codeName","value":"codeValue","placeholder":"到期状态","method":"doQuery","multiple":true,"isshow":true,"tipText":"将到期：在30天内到期；未到期：不包括30天内将到期的记录"},
                {"name":"甲方开票抬头","model":"partyATitle","type":"select","options":this.payTitleOptions, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"乙方开票抬头","model":"partyBTitle","type":"select","options":this.payTitleOptions, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"合同开始日期","model":"daterange1","type":"daterange","isshow":true},
                {"name":"合同结束日期","model":"daterange2","type":"daterange","isshow":true},            ]
        }
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
            this.$refs.table.downloadExcelFile('供应商-内部结转合同列表');
        },
    },
}
