export default {
    name: 'receiptScan',
    data() {
        return {
            tableData: [],
            inputValue: "",
            waybillIds: [],
            focusTimer: null,
            head: [
                {"name": "派车单号", "code": "waybillNum", "width": "160", "type": "text"},
                {"name": "派车状态", "code": "waybillStateName", "width": "80", "type": "text"},
                {"name": "收单状态", "code": "receiveStateName", "width": "80", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "180", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "80", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "80", "type": "text"},
                {"name": "操作", "code": "operation", "width": "80", "type": "text"},
            ],
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.focusInput();
        });
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.startFocusTimer();
        });
    },
    beforeRouteLeave(to, from, next) {
        this.stopFocusTimer();
        next();
    },
    beforeDestroy() {
        this.stopFocusTimer();
    },
    components: {

    },
    methods: {
        focusInput() {
            if (this.$refs.inputRef) {
                this.$refs.inputRef.focus();
            }
        },
        startFocusTimer() {
            if (this.focusTimer) {
                return;
            }
            this.focusTimer = setInterval(() => {
                if (this.$refs.inputRef) {
                    const inputEl = this.$refs.inputRef.$el?.querySelector('input');
                    if (inputEl && document.activeElement !== inputEl) {
                        inputEl.focus();
                    }
                }
            }, 2000);
        },
        stopFocusTimer() {
            if (this.focusTimer) {
                clearInterval(this.focusTimer);
                this.focusTimer = null;
            }
        },
        async doQuery() {
            if (!this.inputValue.trim()) {
                return;
            }
            // 检查是否已存在相同的派车单ID
            const duplicateItem = this.tableData.find(item => item.waybillId == this.inputValue);
            if (duplicateItem) {
                this.$message.warning(`派车单号 ${duplicateItem.waybillNum} 已存在，请勿重复扫描`);
                this.inputValue = '';
                this.$nextTick(() => {
                    this.focusInput();
                });
                return;
            }
            try {
                let info = await this.common.postUrl('ordWaybillTF', 'queryWaybillInfo', { 'waybillId': this.inputValue });
                this.tableData.push(info.waybillInfo);
                this.$message.success('扫描成功');
                this.inputValue = '';
                this.$nextTick(() => {
                    this.focusInput();
                });
            } catch (error) {
                console.error('查询失败:', error);
                this.$message.error('扫描失败，请重试');
            }
        },
        handleEnterKey() {
            if (this.inputValue.trim()) {
                this.doQuery();
            }
        },
        toDetail(waybillId) {
            this.$emit("openTab",{
                urlId: 'waybillDetail' + waybillId,
                query: {waybillId: waybillId,unShowCheck: 1,},
                urlName: "派车单详情",
                urlPathName: "/detail",
                urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
        },
        deleteItem(index) {
            this.$confirm('确认删除该条记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = this.tableData.splice(index, 1);
                console.log(data,this.tableData,index)
                this.$message.success('删除成功');
            }).catch(() => {});
        },
        async confirmReceipt(){
            if (this.tableData.length === 0) {
                this.$message.warning("请先扫描派车单号");
                return;
            }
            const waybillIds = this.tableData.map(item => item.waybillId);
            await this.common.postUrl("ordWaybillTF", "receiveReceiptByIds", {waybillIds});
            this.$message.success("收单确认成功");
            this.close()
        },
        close(){
			this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        }
    },
}
