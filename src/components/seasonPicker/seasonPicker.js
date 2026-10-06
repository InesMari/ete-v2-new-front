export default {
    name: 'seasonPicker',
    props: {
        valueArr: {
            default: () => {
                return ['01-03', '04-06', '07-09', '10-12']
            },
            type: Array
        },
        getValue: {
            default: () => {},
            type: Function
        },
        defaultValue: {
            default: '',
            type: String
        }
    },
    data() {
        return {
            showSeason: false,
            season: '',
            year: new Date().getFullYear(),
            showValue: '',
            hanzi:['第一季度','第二季度','第三季度','第四季度'],
        }
    },
    created() {
        if (this.defaultValue) {
            let value = this.defaultValue
            let arr = value.split('-')
            this.year = arr[0].slice(0, 4)
            let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
            let arrAll = this.valueArr
            let hanzi = this.hanzi[arrAll.indexOf(str)];
            this.showValue = `${this.year}年${hanzi}`
        }else{
            let now = new Date();
            let i = now.getMonth()/3;
            this.selectSeason(i);
        }
    },
    watch: {
        defaultValue: function(value, oldValue) {
            let arr = value.split('-')
            this.year = arr[0].slice(0, 4)
            let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
            let arrAll = this.valueArr
            let hanzi = this.hanzi[arrAll.indexOf(str)];
            this.showValue = `${this.year}年${hanzi}`
        }
    },
    methods: {
        one() {
            this.showSeason = false
        },
        prev() {
            this.year = this.year * 1 - 1
        },
        next() {
            this.year = this.year * 1 + 1
        },
        selectSeason(i) {
            let that = this
            that.season = i + 1
            let arr = that.valueArr[i].split('-');
            let value = that.year + arr[0] + '-' + that.year + arr[1];
            that.getValue(value);
            that.showSeason = false
            let hanzi = this.hanzi[i];
            this.showValue = `${this.year}年${hanzi}`;
            // 查询
            this.$emit("click",value);
        }
    }
}