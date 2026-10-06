export default {
    name: 'actualDetail',
    data() {
        return {
            // 假数据
            value: 5,
            monthData: [
                { "name": "1月", "income1": "1", "income2": "12", "income3": "13", "income4": "14", "incomeTotal": "11111", "cost1": "2", "cost2": "22", "cost3": "23", "costTotal": "2222", "lirunlv": "3", "lirune": "4", "width": "80", },
                { "name": "2月", "income1": "1", "income2": "12", "income3": "13", "income4": "14", "incomeTotal": "11111", "cost1": "2", "cost2": "22", "cost3": "23", "costTotal": "2222", "lirunlv": "3", "lirune": "4", "width": "80", },
                { "name": "3月", "income1": "1", "income2": "12", "income3": "13", "income4": "14", "incomeTotal": "11111", "cost1": "2", "cost2": "22", "cost3": "23", "costTotal": "2222", "lirunlv": "3", "lirune": "4", "width": "80", },
                { "name": "5月", "income1": "1", "income2": "12", "income3": "13", "income4": "14", "incomeTotal": "11111", "cost1": "2", "cost2": "22", "cost3": "23", "costTotal": "2222", "lirunlv": "3", "lirune": "4", "width": "80", },
                { "name": "6月", "income1": "1", "income2": "12", "income3": "13", "income4": "14", "incomeTotal": "11111", "cost1": "2", "cost2": "22", "cost3": "23", "costTotal": "2222", "lirunlv": "3", "lirune": "4", "width": "80", },
                { "name": "8月", "income1": "1", "income2": "12", "income3": "13", "income4": "14", "incomeTotal": "11111", "cost1": "2", "cost2": "22", "cost3": "23", "costTotal": "2222", "lirunlv": "3", "lirune": "4", "width": "80", },
                { "name": "10月", "income1": "1", "income2": "12", "income3": "13", "income4": "14", "incomeTotal": "11111", "cost1": "2", "cost2": "22", "cost3": "23", "costTotal": "2222", "lirunlv": "3", "lirune": "4", "width": "80", },
                { "name": "12月", "income1": "1", "income2": "12", "income3": "13", "income4": "14", "incomeTotal": "11111", "cost1": "2", "cost2": "22", "cost3": "23", "costTotal": "2222", "lirunlv": "3", "lirune": "4", "width": "80", },
            ],
            projectNames: [
                { "name": "粉料板数", "code": "income1", "width": "80", },
                { "name": "板数-粉料板数", "code": "income2", "width": "80", },
                { "name": "板数-结构件板数", "code": "income3", "width": "80", },
                { "name": "收入-仓储配送", "code": "income4", "width": "80", },
                { "name": "总收入", "code": "incomeTotal", "width": "80", },
                { "name": "成本-仓储配送-外租车成本", "code": "cost1", "width": "80", },
                { "name": "成本-仓储配送-自有车成本", "code": "cost2", "width": "80", },
                { "name": "成本-仓储配送-粉料板数", "code": "cost3", "width": "80", },
                { "name": "总成本", "code": "costTotal", "width": "80", },
                { "name": "利润率", "code": "lirunlv", "width": "80", },
                { "name": "利润额", "code": "lirune", "width": "80", },
            ],
            // 假数据 end
        }
    },

    mounted() {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {

    },
    methods: {
        doQuery() {
            this.calculateTotals(this.monthData, this.projectNames);
            this.$forceUpdate();
            console.log(this.projectNames)
        },
        calculateTotals(rowsData, colsData) {
            // 初始化每个项目的 total 为 0
            colsData.forEach(item => {
                item.total = 0;
            });

            // 遍历每个月的数据
            rowsData.forEach(row => {
                // 遍历每个项目，累加对应字段的值
                colsData.forEach(col => {
                    // 获取当前项目对应 rowsData 中的字段值
                    const value = parseFloat(row[col.code]) || 0;
                    // 累加到 total 中
                    col.total += value;
                });
            });
        }
    },
}
