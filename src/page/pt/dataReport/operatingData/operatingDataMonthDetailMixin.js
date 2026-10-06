/**
 * 月度详情通用 mixin
 */
export default {
    data() {
        return {
            info: {},
            type: this.$route.query.type,
            disabled: true,
            resolveValueRequestId: 0, // 请求序号
            resolveValueTimer: null, // 防抖定时器
            months:[],
        }
    },

    mounted() {
        this.init();
    },

    methods: {
        async init(){
            this.id = this.$route.query.id;
            await this.doQuery();
            this.queryMonthIds();
        },
        async doQuery() {
            let {  analysisId } = this.$route.query;
            this.info = await this.common.postUrl("fcAnalysisTF", "getFcAnalysisDtlInfo", { analysisId, id:this.id });
            this.disabled = !((this.info.verifySts == 0 || this.info.verifySts == 2) && this.type == 1);
        },
        async queryMonthIds() {
            let { analysisId } = this.$route.query;
            this.months = await this.common.postUrl("fcAnalysisTF", "getFcAnalysisDtlList", { analysisId });
            let month = this.months.filter(item => item.id == this.id);
            if(month.length == 0){
                this.months.push({
                    id:this.info.id,
                    month:this.info.yearMonth
                });
            }
        },
        changeMonth(){
            this.id = this.info.id;
            this.doQuery();
        },

        // 计算 - 使用防抖 + 请求序号
        resolveValue() {
            // 1. 清除之前的定时器
            if (this.resolveValueTimer) {
                clearTimeout(this.resolveValueTimer);
            }

            // 2. 防抖：500ms 后执行
            this.resolveValueTimer = setTimeout(async () => {
                // 4. 创建新的 请求序号
                const currentRequestId = ++this.resolveValueRequestId;

                try {
                    this.info.analysisId = this.$route.query.analysisId;
                    this.info.analysisType = this.analysisType;
                    const result = await this.common.postUrl("fcAnalysisTF", "resolveValue", this.info);

                    // 6. 只处理最后一个请求的返回值
                    if (currentRequestId === this.resolveValueRequestId) {
                        this.info = result;
                    }
                } catch (error) {
                    // 如果是用户取消的错误，忽略
                    if (error.name !== 'AbortError') {
                        console.error('计算失败:', error);
                        this.$message.error('计算失败，请重试');
                    }
                }
            }, 500); // 500ms 防抖
        },

        // 修改
        async changeData(finance) {
            this.info.analysisId = this.$route.query.analysisId;
            this.info.analysisType = this.analysisType;
            this.info.finance = finance;
            await this.common.postUrl("fcAnalysisTF", "saveFcAnalysisActualInfo", this.info);
            this.$message.success("修改成功");
            this.close();
        },

        // 审核
        async verify(type) {
            await this.common.postUrl("fcAnalysisTF", "verifyFcAnalysisDtl", {
                id: this.info.id,
                type,
                verifyRemark: this.info.verifyRemark
            });
            this.$message.success("审核成功");
            this.close();
        },
        
        // 取消审核
        async cancelVerify() {
            await this.common.postUrl("fcAnalysisTF", "cancelVerifyFcAnalysisDtl", {
                id: this.info.id,
            });
            this.$message.success("取消审核成功");
            this.close();
        },

        // 删除
        async del() {
            this.$confirm(`是否确认删除该数据？`, "提示").then(async () => {
                let analysisId = this.$route.query.analysisId;
                let id = this.info.id;
                await this.common.postUrl("fcAnalysisTF", "deleteFcAnalysisDtlInfo", { analysisId, id });
                this.$message.success("删除成功");
                this.close();
            }).catch(() => { })
        },

        close() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true,"queryDetail");
        },

        // 清理资源（组件销毁时）
        beforeDestroy() {
            if (this.resolveValueTimer) {
                clearTimeout(this.resolveValueTimer);
            }
        }
    },
}