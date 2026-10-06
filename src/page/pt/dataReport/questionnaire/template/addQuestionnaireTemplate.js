export default {
    name: 'addQuestionnaire',
    data() {
        return {
            param: {
                questionnaireName: '',
                feedbackChannel: '',
                startWords: '',
                titleList: [],
            },
            pageDisable:false,
        }
    },
    mounted() {
        let that = this;

        //判断新增/修改/复制，有id则是修改，且copy:true时复制
        let {id,copy,temp} = that.$route.query;
        that.initParam();
        if(that.common.isNotBlank(id)){
            that.$nextTick(() =>{
                that.initData(id,copy);
            })
        }
        if(temp) that.pageDisable = true;
    },
    methods: {
        // 初始化参数
        async initParam(id) {
            if(this.common.isNotBlank(id)){
                this.param.titleList = [this.titleListData()];
            }
            else
            {
                this.param.titleList.push(this.titleListData());
                this.forceUpdate();
                // this.param.titleList = [{
                //     titleName: '我司服务人员素质及服务态度',
                //     isCustomerType: 1,//是客服类标题
                //     questionList: [
                //         {
                //             questionName: '文明有礼貌',
                //             questionType: 1,
                //             status: 0,//是否参加评分合计 1参加 0不参加  客服类默认不参加
                //             isCustomerType: 1,//是客服类问题
                //             questionNameId: 1,//这些ID后面统计需要用到
                //         },
                //         {
                //             questionName: '服务态度好',
                //             questionType: 1,
                //             status: 0,//是否参加评分合计 1参加 0不参加  客服类默认不参加
                //             isCustomerType: 1,//是客服类问题
                //             questionNameId: 2,
                //         },
                //         {
                //             questionName: '解决问题及时',
                //             questionType: 1,
                //             status: 0,//是否参加评分合计 1参加 0不参加  客服类默认不参加
                //             isCustomerType: 1,//是客服类问题
                //             questionNameId: 3,
                //         },
                //         {
                //             questionName: '专业敬业',
                //             questionType: 1,
                //             status: 0,//是否参加评分合计 1参加 0不参加  客服类默认不参加
                //             isCustomerType: 1,//是客服类问题
                //             questionNameId: 4,
                //         },
                //         {
                //             questionName: '语言流畅',
                //             questionType: 1,
                //             status: 0,//是否参加评分合计 1参加 0不参加  客服类默认不参加
                //             isCustomerType: 1,//是客服类问题
                //             questionNameId: 5,
                //         },
                //         {
                //             questionName: '您对此客服的评价',
                //             questionType: 2,
                //             status: 0,//是否参加评分合计 1参加 0不参加  客服类默认不参加
                //             isCustomerType: 1,//是客服类问题
                //             questionNameId: 6,
                //         },
                //     ]
                // }];
            }
        },
        /**
         * 大问题对象
         * @returns 返回大问题对象
         */
        titleListData() {
            let obj =
            {
                titleName: '',
                isCustomerType: 0,//不是客服类标题
                questionList: [this.questionListData()]
            }
            return this.common.copyObj(obj);
        },
        /**
         * 小问题对象
         * @returns 返回小问题对象
         */
        questionListData() {
            let obj =
            {
                questionName: '',
                questionType: 1,
                status: 1,//是否参加评分合计 1参加 0不参加
                isCustomerType: 0,//不是客服类问题
            }
            return this.common.copyObj(obj);
        },

        // 初始化页面数据 - 修改或复制时调用
        async initData(id,copy){
            let data = await this.common.postUrl("questionnaireTemplateService", "loadQuestionnaireTemplateById", {id}, null,null,null,true);
            if(copy){   //复制时清空id、日期、名称
                data.id = undefined;
                data.questionnaireName = '';
                data.titleList.forEach(item => {
                    item.score = undefined;
                    item.questionList.forEach(el => {
                        el.score = undefined;
                    })
                })
            }
            this.param = data;
            this.forceUpdate();
        },
        // 刷新视图
        forceUpdate() {
            this.$forceUpdate();
        },
        // 添加问题
        addQues() {
            this.param.titleList.push(this.titleListData());
            this.forceUpdate();
        },
        /**
         * 删除问题
         * @param {下标} i 
         */
        delQues(i, item) {
            if (item.isCustomerType == 1)
            {
                this.$message.error("客服类标题不允许删除！");
                return;
            }
            this.param.titleList.splice(i, 1);
            this.forceUpdate();
        },
        /**
         * 添加小问题
         * @param {大问题对象} item 
         */
        addInnerQues(item) {
            if (item.isCustomerType == 1)
            {
                this.$message.error("客服类标题不允许新增问题！");
                return;
            }
            item.questionList.push(this.questionListData());
            this.forceUpdate();
        },
        /**
         * 删除小问题
         * @param {小问题对象} item 
         * @param {下标} i 
         */
        delInnerQues(item,i){
            if (item.isCustomerType == 1)
            {
                this.$message.error("客服类问题不允许删除！");
                return;
            }
            item.splice(i,1);
        },
        // 问题打分/建议切换逻辑
        questionTypeChange(innerItem){
            if(innerItem.questionType==1){
                innerItem.status = 1;
            }
            this.forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        // 保存页面
        async save(){
            if (this.common.isBlank(this.param.questionnaireName))
            {
                this.$message.error("请填写问卷模板名称！");
                return false;
            }
            if (this.common.isBlank(this.param.feedbackChannel))
            {
                this.$message.error("请填写异常反馈、投诉渠道！");
                return false;
            }
            if (this.common.isBlank(this.param.startWords))
            {
                this.$message.error("请填写开始语！");
                return false;
            }
            if (this.common.isBlank(this.param.titleList) || this.param.titleList.length === 0)
            {
                this.$message.error("至少需要包含一条标题！");
                return false;
            }

            await this.common.postUrl("questionnaireTemplateService", "saveOrUpdateQuestionnaireTemplate", this.param, null,null,null,true);
            this.$message.success("保存成功！")
            this.closePage();
        }
    },
}
