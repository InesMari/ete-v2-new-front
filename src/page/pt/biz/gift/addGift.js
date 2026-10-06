import myFileModel from '@/components/myFileModel/myFileModel.vue'
export default {
    name: "addGift",
    components: {
        myFileModel,
    },
    data() {
        return {
            info: {
                id:'',
                schemeName:'',
                deadlineDate:'',
                imgId:'',
                imgPath:'',
                bgImgId:'',
                bgImgPath:'',
                remark:'',
                subList:[this.initItem()],
            },
            disabled:false,
            type:this.$route.query.type,
            disabledEdit: false,
            disabledDel: false,

        };
    },
    mounted() {
        //加载明细数据
        if (this.common.isNotBlank(this.$route.query.id))
        {
            this.loadGiftSchemeById();
            if (this.$route.query.type == 0)
            {
                this.disabled = true;
                this.disabledEdit = true;
                this.disabledDel = true;
            }
            else
            {
                this.disabled = false;
                this.disabledEdit = false;
                this.disabledDel = false;
            }
        }
    },
    methods: {
        // 初始化数据
        async loadGiftSchemeById() {
            let {info} = await this.common.postUrl('schemeService','loadGiftSchemeById',{id:this.$route.query.id});

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
            let that = this;
            if (this.common.isNotBlank(info.subList))
            {
                this.$nextTick(() => {
                    for (let i = 0; i < info.subList.length; i++)
                    {
                        let item = info.subList[i];
                        if (this.common.isNotBlank(item.subDtlList))
                        {
                            for (let j = 0; j < item.subDtlList.length; j++)
                            {
                                let subItem = item.subDtlList[j];
                                if (this.common.isNotBlank(subItem.imgId))
                                {
                                    let ref = that.$refs['file' + i + '-' + j][0];
                                    ref.initDate(subItem.imgId);
                                }
                            }
                        }
                    }
                });
            }
        },
        addItem()
        {
            this.info.subList.push(this.initItem());
            this.$forceUpdate();
        },
        initItem()
        {
            let length = this.common.isBlank(this.info) || this.common.isBlank(this.info.subList) ? 1 :  this.info.subList.length + 1;
            return {
                schemeSubName: '方案' + length,
                subDtlList:[this.initSubItem()],
            }
        },
        initSubItem()
        {
            return {
                giftName:null,
                model:null,
                imgId:null,
                imgPath:null,
                remark:null,
            }
        },
        removeItem(index)
        {
            if (this.info.subList.length > 1)
            {
                this.info.subList.splice(index, 1);
            }
        },
        addSubItem(item)
        {
            item.subDtlList.push(this.initSubItem());
            this.$forceUpdate();
        },
        removeSubItem(item, index)
        {
            if (item.subDtlList.length > 1)
            {
                item.subDtlList.splice(index, 1);
            }
        },
        successCallback(imgData)
        {
            let componentId = imgData.componentId
            if (1 == componentId)
            {
                this.info.bgImgId = imgData.flowId;
                this.info.bgImgPath = imgData.storePath;
            }
            else
            {
                this.info.imgId = imgData.flowId;
                this.info.imgPath = imgData.storePath;
            }
        },
        delCallback(componentId)
        {
            if (1 == componentId)
            {
                this.info.bgImgId = "";
                this.info.bgImgPath = "";
            }
            else
            {
                this.info.imgId = "";
                this.info.imgPath = "";
            }
        },
        successCallback2(imgData)
        {
            let componentId = imgData.componentId
            for (let i = 0; i < this.info.subList.length; i++)
            {
                let item = this.info.subList[i];
                let flag = false;
                for (let j = 0; j < item.subDtlList.length; j++)
                {
                    let subItem = item.subDtlList[j];
                    if (i + '-' + j == componentId)
                    {
                        subItem.imgId = imgData.flowId;
                        subItem.imgPath = imgData.storePath;
                        flag = true;
                        break;
                    }
                }
                if (flag)
                {
                    break;
                }
            }
        },
        delCallback2(componentId)
        {
            for (let i = 0; i < this.info.subList.length; i++)
            {
                let item = this.info.subList[i];
                let flag = false;
                for (let j = 0; j < item.subDtlList.length; j++)
                {
                    let subItem = item.subDtlList[j];
                    if (i + '-' + j == componentId)
                    {
                        subItem.imgId = "";
                        subItem.imgPath = "";
                        flag = true;
                        break;
                    }
                }
                if (flag)
                {
                    break;
                }
            }
        },
        async save() {
            let info = this.info;
            if (this.common.isBlank(info.schemeName))
            {
                this.$message.error("礼品方案名称不能为空！");
                return false;
            }
            if (this.common.isBlank(info.deadlineDate))
            {
                this.$message.error("截止日期不能为空！");
                return false;
            }
            if (this.common.isBlank(info.imgId))
            {
                this.$message.error("方案图片不能为空！");
                return false;
            }
            if (this.common.isBlank(info.imgPath))
            {
                this.$message.error("方案图片不能为空！");
                return false;
            }
            if (this.common.isBlank(info.bgImgId))
            {
                this.$message.error("二维码底图不能为空！");
                return false;
            }
            if (this.common.isBlank(info.bgImgPath))
            {
                this.$message.error("二维码底图不能为空！");
                return false;
            }
            let giftList = info.subList;
            if (this.common.isBlank(giftList) || giftList.length === 0)
            {
                this.$message.error("礼品方案至少需要一条！");
                return false;
            }
            for (let i = 0; i < giftList.length; i++)
            {
                let gift = giftList[i];
                if (this.common.isBlank(gift.schemeSubName))
                {
                    this.$message.error("第" + (i + 1) + "条方案名称不能为空！");
                    return false;
                }
                let subDtlList = gift.subDtlList;
                if (this.common.isBlank(subDtlList) || subDtlList.length === 0)
                {
                    this.$message.error("礼品信息至少需要一条！");
                    return false;
                }
                for (let j = 0; j < subDtlList.length; j++)
                {
                    let dtl = subDtlList[j];
                    if (this.common.isBlank(dtl.giftName))
                    {
                        this.$message.error(gift.schemeSubName + "：第" + (i + 1) + "条礼品名称不能为空！");
                        return false;
                    }
                    if (this.common.isBlank(dtl.model))
                    {
                        this.$message.error(gift.schemeSubName + "：第" + (i + 1) + "条品牌/型号不能为空！");
                        return false;
                    }
                    if (this.common.isBlank(dtl.imgId))
                    {
                        this.$message.error(gift.schemeSubName + "：第" + (i + 1) + "条礼品图片不能为空！");
                        return false;
                    }
                    if (this.common.isBlank(dtl.imgPath))
                    {
                        this.$message.error(gift.schemeSubName + "：第" + (i + 1) + "条礼品图片不能为空！");
                        return false;
                    }
                }
            }
            if (this.$route.query.type == 3)//复制的
            {
                this.info.id = null;
            }
            await this.common.postUrl('schemeService', 'saveOrUpdateGiftScheme', this.info, null, null, null, true);
            this.$message.success("提交成功");
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
};