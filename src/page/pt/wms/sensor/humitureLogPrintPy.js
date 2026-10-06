import printJS from 'print-js'

export default {
    name: 'humitureLogPrintPy',
    data() {
        return {
            head: [
                { code: "time", name: "时间" },
                { code: "temperature", name: "温度" },
                { code: "humidity", name: "湿度" },
            ],
            title: '温湿度记录表',
            info: {
                list: []
            },
            param: {
                id: this.$route.query.id,
                month: this.$route.query.month,
                deviceAddress:this.$route.query.deviceAddress,
                location:this.$route.query.location,
                reportType:2,
            },
            userName: this.common.userInfo().userName,
            printDate: this.common.formatDate.getDateTime(),
            timeRanges:[
                {timeRange: "08:00 ~ 10:00"},
                {timeRange: "10:00 ~ 12:00"},
                {timeRange: "12:00 ~ 14:00"},
                {timeRange: "14:00 ~ 16:00"},
                {timeRange: "16:00 ~ 18:00"},
                {timeRange: "18:00 ~ 20:00"},
                {timeRange: "20:00 ~ 22:00"},
                {timeRange: "22:00 ~ 24:00"},
                {timeRange: "24:00 ~ 02:00"},
                {timeRange: "02:00 ~ 04:00"},
                {timeRange: "04:00 ~ 06:00"},
                {timeRange: "06:00 ~ 08:00"},
            ],
        }
    },
    mounted() {
        this.doQuery();
    },
    methods: {
        async doQuery() {
            let param = this.param;
            const month = param.month.slice(0, 4) + '-' + param.month.slice(4);
            let date = new Date(month);
            this.title = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + param.location + "（编号：" + param.deviceAddress + "）" + "温湿度记录表";
            this.info = await this.common.postUrl("sensorTF", "getSensorDataReport", param);
            console.log(this.info)
        },
        /**
         * 生成一天中按指定小时数分割的时间区间
         * @param {number} intervalHours - 每个时间区间的小时数（必须是能被24整除的正整数）
         * @returns {Array} 包含时间区间的对象数组
         * @throws {Error} 当参数不合法时抛出错误
         */
        generateTimeRanges(intervalHours) {
            // 参数验证
            if (typeof intervalHours !== 'number' ||
                intervalHours <= 0 ||
                !Number.isInteger(intervalHours) ||
                24 % intervalHours !== 0) {
                throw new Error('参数必须是能被24整除的正整数（如1, 2, 3, 4, 6, 8, 12）');
            }

            const timeRanges = [];
            const totalHours = 24;
            const intervals = totalHours / intervalHours;

            for (let i = 0; i < intervals; i++) {
                // 计算起始小时
                const startHour = i * intervalHours;
                // 计算结束小时和分钟
                let endHour = startHour + intervalHours;
                const endMinute = 59;

                // 处理跨天情况（实际不会发生，因为24会被整除）
                if (endHour >= totalHours) {
                    endHour = 0;
                }

                // 格式化时间为两位数字
                const formatTime = (num) => num.toString().padStart(2, '0');

                const startHourStr = formatTime(startHour);
                const endHourStr = formatTime(endHour);
                const endMinuteStr = formatTime(endMinute);

                // 构建时间范围字符串
                const timeRange = endHour === 0
                    ? `${startHourStr}:00 ~ 23:59`  // 最后一个区间特殊处理
                    : `${startHourStr}:00 ~ ${endHourStr}:${endMinuteStr}`;

                timeRanges.push({ timeRange });
            }

            return timeRanges;
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id);
        },
        /**
         * 打印
         */
        print() {
            printJS({
                printable: 'printTable',
                type: 'html',
                css: '/static/css/humitureLogPrint.css',  //真实路径/public/static/css/humitureLogPrint.css
                scanStyles: false
            })
        },
    },
}
