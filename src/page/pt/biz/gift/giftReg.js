import tableCommon from "@/components/table/tableCommon.vue"
import myFileModel from '@/components/myFileModel/myFileModel.vue'
import fileViewer from "@/components/myFile/file-viewer.vue";

export default {
    name: 'giftReg',
    data()
    {
        return {
            head: [
                {"name": "方案类型", "code": "schemeSubName", "width": "300", "type": "text"},
                {"name": "公司名称", "code": "companyName", "width": "300", "type": "text"},
                {"name": "客户姓名", "code": "customerName", "width": "100", "type": "text"},
                {"name": "客户职位", "code": "customerPosition", "width": "100", "type": "text"},
                {"name": "分享时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "分享人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "登记时间", "code": "recordDate", "width": "150", "type": "text"},
                {"name": "登记礼品", "code": "giftNames", "width": "200", "type": "text"},
                {"name": "联系姓名", "code": "linkmanName", "width": "120", "type": "text"},
                {"name": "联系手机", "code": "phone", "width": "120", "type": "text"},
                {"name": "邮寄地址", "code": "address", "width": "250", "type": "text"},
                {"name": "发货状态", "code": "deliveryStateName", "width": "100", "type": "text"},
                {"name": "快递单号", "code": "expressNum", "width": "120", "type": "text"},
                {"name": "发货登记时间", "code": "deliveryRecordDate", "width": "150", "type": "text"},
                {"name": "发货登记人", "code": "deliveryRecordUserName", "width": "120", "type": "text"},
            ],
            info: {
                id:this.$route.query.id,
                schemeName:'',
                deadlineDate:'',
                imgId:'',
                imgPath:'',
                remark:'',
                subList:[],
            },
            query: {deliveryState: null, id: this.$route.query.id,state:['99'],searchStr:''},
            disabled:true,
            srcList: [],

            showDialog:false,
            param:{
                id:null,
                schemeSubName: null,
                companyName: null,
                customerName: null,
                address: null,
                expressNum: null,
            }
        }
    },
    mounted()
    {
        if (this.common.isNotBlank(this.$route.query.id))
        {
            this.loadGiftSchemeById();
            if (this.$route.query.type != 0)
            {
                this.disabled = true;
            }
            else
            {
                this.disabled = false;
            }
        }
    },
    components: {
        tableCommon,
        myFileModel,
        fileViewer,
    },
    methods: {
        async loadGiftSchemeById() {
            let {info} = await this.common.postUrl('schemeService','loadGiftSchemeById',{id:this.$route.query.id, isNotLoadDtlList: 1});
            if (this.common.isNotBlank(info.imgId))
            {
                this.$nextTick(() => {
                    this.$refs.img.initDate(info.imgId);
                })
            }
            if (this.common.isNotBlank(info.bgImgId))
            {
                this.$nextTick(() => {
                    this.$refs.bgImg.initDate(info.bgImgId);
                })
            }
            this.info = info;
            this.$forceUpdate();
            await this.doQuery();
        },
        async doQuery()
        {
            await this.$refs.table.load("schemeService", "loadGiftSchemeShareListBySchemeId", this.query);
        },
        recordDelivery()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要登记的数据！");
                return false;
            }
            this.param = this.common.copyObj(selectData[0]);
            this.record(true);
        },
        record(flag)
        {
            this.showDialog = flag;
            this.$forceUpdate();
        },
        async saveRecord()
        {
            let param = this.param;
            if (this.common.isBlank(param.id))
            {
                this.$message.error("方案分享ID不能为空！");
                return false;
            }
            if (this.common.isBlank(param.expressNum))
            {
                this.$message.error("快递单号不能为空！");
                return false;
            }
            await this.common.postUrl('schemeService', 'recordGiftSchemeDelivery', param, null, null, null, true);
            this.$message.success("提交成功");
            await this.doQuery();
            this.record(false);
        },
        exportExcel()
        {
            this.$refs.table.downloadExcelFile();
        },
        downloadQrCode()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要下载二维码的数据！");
                return false;
            }
            let data = selectData[0];
            if (this.common.isBlank(data.url))
            {
                this.$message.error("该分享没有二维码！");
                return false;
            }
            this.common.downloadFile(data.url);
        },
        showBigImg()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要查看二维码的数据！");
                return false;
            }
            let data = selectData[0];
            if (this.common.isBlank(data.imgUrl))
            {
                this.$message.error("图片为空！");
                return false;
            }
            this.srcList = [];
            this.srcList.push(data.imgUrl);
      		this.$refs.viewer.show();
        },
        changeState1(value){
            if(value){
                for (let i = 0; i < this.query.state.length; i++) {
                    if(this.query.state[i]!=99){
                        this.query.state.splice(i,1);
                        i--;
                    }
                }
            }
            if(this.query.state.length==0){
                this.query.state=['99'];
            }
            this.doQuery();
        },
        changeState2(value,ev){
            if(value){
                for (let i = 0; i < this.query.state.length; i++) {
                    if(this.query.state[i]==99){
                        this.query.state.splice(i,1);
                        i--;
                        continue;
                    }
                    if((this.query.state[i]==2||this.query.state[i]==3)&&this.query.state[i]!=ev.target.value){
                        this.query.state.splice(i,1);
                        i--;
                    }
                }
            }
            if(this.query.state.length==0){
                this.query.state=['99'];
            }
            this.doQuery();
        },
        changeState3(value,ev){
            if(value){
                for (let i = 0; i < this.query.state.length; i++) {
                    if(this.query.state[i]==99){
                        this.query.state.splice(i,1);
                        i--;
                        continue;
                    }
                    if((this.query.state[i]==0||this.query.state[i]==1)&&this.query.state[i]!=ev.target.value){
                        this.query.state.splice(i,1);
                        i--;
                    }
                }
            }
            if(this.query.state.length==0){
                this.query.state=['99'];
            }
            this.doQuery();
        }
    },
}
