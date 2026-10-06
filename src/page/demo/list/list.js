import {head} from '@/static/json.js'
import tableCommon from "@/components/table/tableCommon.vue"
import scrollTable from "@/components/scrollTable/scrollTable.vue"
import limitDeploy from "../limitDeploy/limitDeploy.vue"
import myFileModel from '@/components/myFileModel/myFileModel.vue'
import commonOpLog from '@/components/commonOpLog/commonOpLog.vue'

export default {
    name: 'list',
    data()
    {
        return {
            head: head,
            showLimitDeploy: false,
            showAddClient: false,
            showCheckInfo: false,
            showUpload: false,
            showTickerLog: false,
            showPayRegister: false,
            isshowLock: false,
            // 假数据配置
            time: "",
            datetime: "",
            selectValue: "",
            inputvalue: "",
            daterange: "",
            options: [{
                value: '1',
                label: '时效≥'
            }, {
                value: '2',
                label: '价格'
            }],
            tableData: [
                {
                    selectValue: "",
                    inputvalue: "",
                    month: "2020-11-11",
                },
                {
                    selectValue: "",
                    inputvalue: "",
                    month: "2020-11-11",
                }
            ],
            // 假数据配置 end
        }
    },
    async mounted()
    {

        //调试代码
        let param = {
            questionnaireName: 'questionnaireName',
            questionnaireDate: 'questionnaireDate2',
            feedbackChannel: 'feedbackChannel',
            startWords: 'startWords',
            titleList: [
                {
                    titleName: 'titleName',
                    titleType: 1,
                    questionList: [
                        {
                            questionName: 'questionName1',
                            questionType: 1,
                            status: 1,
                        },
                        {
                            questionName: 'questionName2',
                            questionType: 1,
                            status: 1,
                        },
                    ]
                },

            ]
        };

        // let data = await this.common.postUrl("questionnaireService", "loadQuestionnaire", param);

        // let allStoreHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", param);

        // let {items} = await this.$refs.table.load("questionnaireService", "queryQuestionnairePage", this.query);

    },
    components: {
        tableCommon,
        scrollTable,
        limitDeploy,
        myFileModel,
        commonOpLog,
    },
    methods: {
        addData()
        {
            let obj = {
                selectValue: "",
                inputvalue: "",
                month: "2020-11-11",
            }
            this.tableData.push(obj);
        },
        delData(index)
        {
            this.tableData.splice(index, 1);
        },
        invoice()
        {
            this.showLimitDeploy = true;
        },
        closeLimitDeploy()
        {
            this.showLimitDeploy = false;
        },
        addClient()
        {
            this.showAddClient = true;
        },
        checkInfo()
        {
            this.showCheckInfo = true;
        },
        closeCheckInfo()
        {
            this.showCheckInfo = false;
        },
        changeSel()
        {

        },
        options()
        {

        },
        showLock()
        {
            this.isshowLock = true;
        },
        upload()
        {
            this.showUpload = true;
        },
        operateLog()
        {
            this.$refs.operate.showDialog(0, 0);
        },
        addTickerLog()
        {
            this.showTickerLog = true;
        },
        toShowPayRegister()
        {
            this.showPayRegister = true;
        },
    },
}
