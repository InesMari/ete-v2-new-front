<template>
    <div id="mySelect" class="mySelect">
        <!-- 单选下拉框，如果`multiple`属性为false则显示 -->
        <el-select v-if="!multiple" v-model="selectId" @change="selectChange" @visible-change="visibleChange" :disabled="disabled" filterable :filter-method="filterStorage" clearable :placeholder="placeholder" :loading="loading">
            <el-option v-for="item in data" :key="item[value]" :label="item[label]" :value="item[value]" :disabled="item[optionDisabled]"/>
        </el-select>
        <!-- 多选下拉框，如果`multiple`属性为true则显示 -->
        <el-select v-if="multiple" multiple v-model="selectId" @change="selectChange" @visible-change="visibleChange" :disabled="disabled" filterable :filter-method="filterStorage" clearable :placeholder="placeholder" :loading="loading">
            <el-option v-for="item in data" :key="item[value]" :label="item[label]" :value="item[value]" :disabled="item[optionDisabled]" />
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'mySelect',
    props:{
                // 模型属性，用于存储选中的数据项
        model:{
            type:Array,
            default:()=>[]
        },
        // 是否允许多选
        multiple:{
            type:Boolean,
            default:false
        },
        // 提供选择的选项数据
        data:{
            type:Array,
            default:()=>[]
        },
        // 输入框的占位文本
        placeholder:{
            type:String,
            default:"请选择"
        },
        // 加载状态，用于显示加载中的动画
        loading:{
            type:Boolean,
            default:false
        },
        // 选项在列表中显示的字段
        label:{
            type:String,
            default:"name"
        },
        // 选项被选中后，存储在model中的值对应的字段
        value:{
            type:String,
            default:"id"
        },
        // 是否禁用选择器
        disabled:{
            type:Boolean,
            default:false
        },
        // 定义一个属性`optionDisabled`，用于控制某些选项的禁用状态
        optionDisabled:{
            type:String, // 属性类型为字符串
            default:'disable' // 默认值为'disable'
        },
        // 定义属性 `index`，用于指示初始索引值
        // 类型可以是 Number 或 String，允许字符串类型是为了兼容某些特定的索引格式
        // 默认值设为 0，确保在未指定索引时有一个默认的起始点
        index: {
            type: [Number, String],
            default: 0
        },
    },
    data(){
        return{
            selectId:""
        }
    },
    mounted(){
        this.getSelectId(this.model);
    },
    methods:{
        /**
         * 根据传入的值获取选择器的ID。这个方法主要用于更新组件的selectId状态。
         * @param {Array} value - 选中的值，当组件为非多选(multiple为false)时，可能是一个单一值或空值。
         */
        getSelectId(value){
            // 首先判断是否为单选模式
            if(!this.multiple){
                // 如果是空值，则将selectId设为空字符串
                if(this.common.isBlank(value) || value.length==0){
                    this.selectId = "";
                }else{
                    // 将单一值转为字符串并赋给selectId
                    this.selectId = Number(value.join());
                }
            }else{
                // 多选模式下，将value数组中的每个元素转为字符串后赋给selectId
                this.selectId = value.map(Number);
            }
        },
        /**
         * 处理选择变化的事件，重置数据并发出变更事件。
         * 该函数没有参数。
         * @returns {Object} 通过$emit发出的事件对象，包含重置后的数据值。
         */
        selectChange(){
            // 重置数据并获取重置后的值
            let value = this.dataReset();
            // 发出“change”事件，携带重置后的值
            this.$emit("change",{value});
        },
        /**
         * 当组件的可见性发生变化时触发的事件处理函数。
         * @param {Object} $event - 触发事件的对象，包含了事件的相关信息。
         * 此函数会重置数据，并向父组件发出“visibleChange”事件，携带当前事件对象和重置后的数据。
         */
        visibleChange($event){
            // 重置数据
            let value = this.dataReset();
            // 发出自定义事件通知父组件
            this.$emit("visibleChange",{$event,value});
        },
        /**
         * 重置数据方法
         * 该方法根据 `selectId` 的不同情况，来重置并返回一个 `selectId` 数组。
         * 如果 `selectId` 为空、未定义或null，则返回一个空数组；
         * 如果 `selectId` 不是数组，则将其转换为字符串，然后按逗号分隔转换为数组；
         * 如果 `selectId` 已是数组，则直接返回。
         * @returns {Array} 返回处理后的 `selectId` 数组。
         */
        dataReset(){
            // 检查 selectId 是否为空，是则初始化为空数组，否则进行下一步处理
            if(this.common.isBlank(this.selectId)){
                var selectId = [];
            }else if(!Array.isArray(this.selectId)){
                // 如果 selectId 不是数组类型，则将其转换为数组
                var selectId = String(this.selectId).split(",");
            }else{
                // 如果 selectId 是数组，则直接使用
                var selectId = this.selectId;
            }
            return selectId
        },
        filterStorage(query){
            clearTimeout(this.filterTimer);
            this.filterTimer = setTimeout(() => {                
                this.$emit('filterMethod',{query,index:this.index});
            }, 300);
        },
    },
    watch:{
        model:{
            handler(newVal,oldVal){
                this.getSelectId(newVal);
            },
            deep:true
        }
    }
}

</script>

<style lang="scss" scoped>

</style>