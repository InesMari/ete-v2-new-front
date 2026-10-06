export default {
    name: 'shareGift',
    data()
    {
        return {
            info:{
                id: null,
                schemeNum: null,
                schemeName: null,
                deadlineDate: null,
                companyName: null,
                customerName: null,
                customerPosition: null,
                schemeSubId: null,
                bgImgUrl: '@/static/image/login_box_bg.png',
                bgImgUrlBack: null,
                url: null,
            },

            disabled: false,
            schemeSubData:[],
            disabledEdit: false,
            disabledDel: false,
            showQeCode: false,
        }
    },
    mounted()
    {
        this.initData();
    },
    components: {
    },
    methods: {
        async initData() {
            this.schemeSubData = await this.common.postUrl("schemeService", "loadGiftSchemeSubInfoListBySchemeId", {id: this.$route.query.id});
            await this.loadGiftSchemeById();
        },
        async loadGiftSchemeById() {
            let {info} = await this.common.postUrl('schemeService','loadGiftSchemeById',{id:this.$route.query.id, isNotLoadDtlList: 1});
            this.info = info;
            this.info.bgImgUrlBack = info.bgImgUrl;//保存原始背景图
            if (this.schemeSubData.length === 1)
            {
                this.info.schemeSubId = this.schemeSubData[0].id;
            }
            this.$forceUpdate();
        },
        async generateShareQrCode() {
            let info = this.info;
            if (this.common.isBlank(info.companyName))
            {
                this.$message.error("公司名称不能为空！");
                return false;
            }
            if (this.common.isBlank(info.customerName))
            {
                this.$message.error("客户姓名不能为空！");
                return false;
            }
            if (this.common.isBlank(info.schemeSubId))
            {
                this.$message.error("分享方案不能为空！");
                return false;
            }
            this.$confirm("方案分享过后不能修改，是否确认分享？", "温馨提示").then(async () =>{
                let shareInfo = await this.common.postUrl('schemeService', 'generateShareQrCode', this.info, null, null, null, true);
                this.$message.success("二维码生成成功！");
                this.info.bgImgUrl = shareInfo.imgUrl;
                this.info.url = shareInfo.imgUrl;
                this.showQeCode = true;
                this.$forceUpdate();
            }).catch(() =>{});
        },
        reflush()
        {
            this.info.companyName = null;
            this.info.customerName = null;
            this.info.customerPosition = null;
            this.info.schemeSubId = null;
            this.info.bgImgUrl = this.info.bgImgUrlBack;
            this.info.url = null;
            this.showQeCode = false;
            this.$forceUpdate();
        },
        downloadQrCode()
        {
            if (this.common.isBlank(this.info.url))
            {
                this.$message.error("请先生成二维码！");
                return false;
            }
            this.common.downloadFile(this.info.url)
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
