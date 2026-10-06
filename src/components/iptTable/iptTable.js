import {tableData} from './iptTableJson.js'
import vuedraggable from 'vuedraggable'

export default {
    name: 'iptTable',
    props:['headList','goodsData','tableName','disabledTable'],
    data() {
        return {
            tableData:[],
            rowLength:2,
            weightCalcBox:false,
            volumeCalcBox:false,
            amountData:{},  //合计对象
            packTypeList:[],
            goodsNameList:[],
            addSelectItem:"",
            //计算重量,体积字段
            calcWeight:{
                rough:"",
                materialt:"",
                count:"",
                weight:0.00,
            },
            weightData: [],
            weightSelectData:[],
            calcVolume:{
                long:"",
                wide:"",
                height:"",
                count:"",
                volume:0.00,
            },
            volumeData: [],
            volumeSelectData:[],
            //计算重量,体积字段 end
            //静态数据
            radioValue:1,
            head:[],
            headSetList:[],
            leftSelectAll:false,   //自定义字段右边全选按钮
            rightSelectAll:false,   //自定义字段右边全选按钮
            isShowSetting:false,    //是否显示自定义字段弹窗
            disabled:false,     //表格禁用字段
        }
    },
    components: {
        vuedraggable
    },
    mounted(){
        this.initHead();        //初始化表头
        this.initTableData();   //初始化表格对象
        this.initAmountData();  //初始化合计对象
        this.getStaticData();   //获取静态数据(货品名,器具)
        this.initTableSet();    //初始化表格设置
        if(this.disabledTable){ //是否禁用表格
            this.disabled = true;
        }
    },
    methods:{
        //初始化head
        initHead(){
            this.head = this.common.copyObj(this.headList);
            this.head.forEach(item => {
                this.$set(item,"isShow",true);
            })
        },
        //初始化tableData
        initTableData(data){
            if(this.common.isNotBlank(data)){
                this.tableData = this.common.copyObj(data);
            }else{
                this.tableData = this.common.copyObj(tableData);
            }
            let tableDataCopy = [];
            for(let i=0;i<this.rowLength;i++){
                let obj = this.common.copyObj(this.tableData);
                for(let o in obj){
                    let id = o + i;
                    obj[o].id = id;
                }
                tableDataCopy.push(obj);  
            }
            this.tableData = tableDataCopy;
            this.totalFn();
        },
        //初始化amountData
        initAmountData(){
            let amountData = {};
            this.head.forEach(el => {
                amountData[el.code] = 0;
            })
            this.$set(this,"amountData",amountData);
        },
        // 增加列
        addRow(){
            if(this.tableData.length==3){
                this.$message({
                    message: '最多3条订单',
                    type: 'warning'
                  });
            }else{
                let obj = this.common.copyObj(tableData);
                let index = this.tableData.length;
                for(let o in obj){
                    let id = o + index;
                    obj[o].id = id;
                }
                this.tableData.push(obj);
            }
        },
        // 删除列
        cutRow(){
            if(this.tableData.length==1){
                this.$message({
                    message: '至少保留一条货品信息',
                    type: 'warning'
                  });
            }else{
                let tbIndex = this.tableData.length-1;
                this.tableData.splice(tbIndex,1);
            }
            this.totalFn();
        },
        //费用合计
        totalFn(){
            for(let el in this.amountData){
                let sum = 0;
                this.tableData.forEach(data => {
                    sum += Number(data[el].value)
                })
                this.amountData[el] = sum;
            }
        },
        //选择货品,器具
        getStaticData(){
            let that = this;
            this.common.postUrl("api/sysStaticDataBO.ajax?cmd=query",{codeType:'ORDER_PACK_TYPE'},function(data){
                that.packTypeList = data.items;
            })
            this.common.postUrl("api/sysStaticDataBO.ajax?cmd=query",{codeType:'ORDER_GOODS_NAME'},function(data){
                that.goodsNameList = data.items;
            })
        },
        goodsNameFocus(data){
            const timer = setTimeout(() => {
                data.goodsNameShow = true;
                this.$forceUpdate();
                clearTimeout(timer);
            },0)
        },
        getGoodsName(item,code,name){
            item[code].value = name;
            item[code].goodsNameShow = false;
        },
        addGoodsItem(data){
            this.$set(data,"isAddItem",true);
        },
        async addGoodsName(data){
            let name = data.addSelectItem;
            if(this.common.isNotBlank(name)){
                await this.common.postUrl("api/sysStaticDataBO.ajax?cmd=saveOrUpdate",{codeType:'ORDER_GOODS_NAME',codeName:name});
                this.getStaticData()
                this.$message('添加成功!');
                this.cancelGoodsName(data);
            }
        },
        cancelGoodsName(data){
            data.addSelectItem = "";
            data.isAddItem = false;
        },
        async delGoodsName({flowId}){
            await this.$confirm('是否删除该货品信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            });
            await this.common.postUrl("api/sysStaticDataBO.ajax?cmd=delete",{flowId});
            this.getStaticData()
            this.$message('删除成功!');
        },
        packTypeFocus(data){
            const timer = setTimeout(() => {
                data.packTypeShow = true;
                this.$forceUpdate();
                clearTimeout(timer);
            },0)
        },
        getPackType(item,code,name){
            item[code].value = name;
            item[code].packTypeShow = false;
        },
        addPackTypeItem(data){
            this.$set(data,"isAddItem",true);
        },
        async addPackType(data){
            let name = data.addSelectItem;
            if(this.common.isNotBlank(name)){
                await this.common.postUrl("api/sysStaticDataBO.ajax?cmd=saveOrUpdate",{codeType:'ORDER_PACK_TYPE',codeName:name});
                this.getStaticData()
                this.$message('添加成功!');
                this.cancelPackType(data)
            }
        },
        cancelPackType(data){
            data.addSelectItem = "";
            data.isAddItem = false;
        },
        async delPackType({flowId}){
            await this.$confirm('是否删除该器具信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            });
            await this.common.postUrl("api/sysStaticDataBO.ajax?cmd=delete",{flowId});
            this.getStaticData()
            this.$message('删除成功!');
        },
        //选择货品,器具 end
        //重量、体积
        showWeightCalc(data){
            this.$set(data,"showCalc",true);
        },
        hideWeightCalc(data){
            const timer = setTimeout(() => {
                this.$set(data,"showCalc",false);
                clearTimeout(timer);
            },300)
        },
        showWeightCalcBox(data){
            this.currenItem = data;
            this.weightCalcBox = true;
        },
        weightSelectionChange(data){
            this.weightSelectData = data;
        },
        calcWeightFee(){    //重量费用计算
            let {rough,materialt,count} = this.calcWeight;
            this.calcWeight.weight = (Number(rough) - Number(materialt)) * Number(count);
        },
        getWeightSummaries(param){
            let sums = this.getSummaries(param);
            this.weightSumData = sums;
            return sums;
        },
        addWeight(){    //新增计算重量
            if(this.calcWeight.weight>0){
                this.calcWeight.index = this.weightData.length;
                this.weightData.push(this.calcWeight);
                this.cleanWeightCalc();
            }else{
                this.$message.error('重量不能为负');
            }
        },
        saveWeight(){
            this.currenItem.value = this.weightSumData[this.weightSumData.length - 1];
            this.cleanWeight();
            this.weightCalcBox = false;
            this.totalFn();
        },
        exitWeight(){
            this.cleanWeight();
            this.weightCalcBox = false;
        },
        cleanWeightCalc(){
            this.calcWeight = {
                rough:"",
                materialt:"",
                count:"",
                weight:0.00,
            }
        },
        cleanWeight(){
            this.cleanWeightCalc();
            this.weightData = [];
        },
        delWeight(){
            if(this.weightSelectData.length>0){
                for(let i in this.weightSelectData){
                    let index = this.weightSelectData[i].index - i;
                    this.weightData.splice(index,1);
                }
                this.weightData.forEach((el,index) => {
                    el.index = index;
                })
            }else{
                this.$message.error('请选择一条数据');
            }
        },    
        showVolumeCalc(data){
            this.$set(data,"showCalc",true);
        },
        hideVolumeCalc(data){
            const timer = setTimeout(() => {
                this.$set(data,"showCalc",false);
                clearTimeout(timer);
            },300)
        },
        showVolumeCalcBox(data){
            this.currenItem = data;
            this.volumeCalcBox = true;
        },
        volumeSelectionChange(data){
            this.volumeSelectData = data;
        },
        calcVolumeFee(){    //重量费用计算
            let {long,wide,height,count} = this.calcVolume;
            this.calcVolume.volume = (Number(long) * Number(wide) * Number(height)) * Number(count);
        },
        getVolumeSummaries(param){
            let sums = this.getSummaries(param);
            this.volumeSumData = sums;
            return sums;
        },
        addVolume(){    //新增计算重量
            if(this.calcVolume.volume>0){
                this.calcVolume.index = this.volumeData.length;
                this.volumeData.push(this.calcVolume);
                this.cleanVolumeCalc();
            }else{
                this.$message.error('重量不能为负');
            }
        },
        saveVolume(){
            this.currenItem.value = this.volumeSumData[this.volumeSumData.length - 1];
            this.cleanVolume();
            this.volumeCalcBox = false;
            this.totalFn();
        },
        exitVolume(){
            this.cleanVolume();
            this.volumeCalcBox = false;
        },
        cleanVolumeCalc(){
            this.calcVolume = {
                long:"",
                wide:"",
                height:"",
                count:"",
                volume:0.00,
            }
        },
        cleanVolume(){
            this.cleanVolumeCalc();
            this.volumeData = [];
        },
        delVolume(){
            if(this.volumeSelectData.length>0){
                for(let i in this.volumeSelectData){
                    let index = this.volumeSelectData[i].index - i;
                    this.volumeData.splice(index,1);
                }
                this.volumeData.forEach((el,index) => {
                    el.index = index;
                })
            }else{
                this.$message.error('请选择一条数据');
            }
        },
        getSummaries(param){    //重量,体积合计计算
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return prev + curr;
                } else {
                    return prev;
                }
                }, 0);
            } else {
                sums[index] = '';
            }
            });
            return sums;
        },
        //计算重量,体积结束
        //自定义表格逻辑
        showTableSetting(){
            this.isShowSetting = true;            
            this.headSetList = this.common.copyObj(this.head);
        },
        selToLeft(){
            this.rightSelectAll = false;    //取消全选
            //遍历取消选中状态及显示状态
            this.headSetList.forEach(el => {
                if(el.isChecked&&el.isShow){
                    el.isShow = false;
                    el.isChecked = false;
                }
            })
        },
        selToRight(){
            this.leftSelectAll = false;    //取消全选
            //遍历取消选中状态及隐藏状态
            this.headSetList.forEach(el => {
                if(el.isChecked&&!el.isShow){
                    el.isShow = true;
                    el.isChecked = false;
                }
            })
        },
        selectRightAll(){   //选择右边全部
            this.headSetList.forEach(el => {
                if(el.isShow&&!el.requiredFiled){
                    el.isChecked = true;
                }
            })
        },
        selectLeftAll(){   //选择左边全部
            this.headSetList.forEach(el => {
                if(!el.isShow){
                    el.isChecked = true;
                }
            })
        },
        diyItemChange(hd,type){ 
            if(!hd.isChecked){
                if(type==1){
                    this.leftSelectAll = false;
                }else if(type==2){
                    this.rightSelectAll = false;
                }
            }
        },
        async initTableSet(){
            let url = "api/sysTableHeadConfigBO.ajax?cmd=getSysTableHeadConfigs";
            let data = await this.common.postUrl(url,{tableName:this.tableName});
            let headCache = data[this.tableName];
            if(this.common.isBlank(headCache)) return;
            //展示隐藏，固定列处理
            let hideList = [];
            this.head.forEach((item) => {
                item.isShow = false;
                headCache.forEach(data => {
                    if(item.code == data.headCode){ //后台保存则展示
                        item.isShow = true;
                        if(data.fixedFlag==1){  //为1时侧固定
                            item.isFix = true;
                        }
                    }
                })
                //记录隐藏的列
                if(!item.isShow){
                    hideList.push(item);
                }
            })
            //表头重新排序
            let arr = []
            headCache.forEach(data => {  //后台有保存的先按照index放好位置
                this.head.forEach((item) => {
                    if(item.code == data.headCode){
                        arr[data.headIndex] = item;
                    }
                })
            })
            for(let a=0;a<arr.length;a++){  //插入隐藏的列
                if(this.common.isBlank(arr[a])){
                    arr[a] = hideList[0];
                    hideList.splice(0,1);
                }
            }
            //合并arr和未被插入的隐藏列
            this.head = arr.concat(hideList);
            this.$emit("changeHeadData",this.head);
        },
        async saveTableRow(){
            let sysTableHeadConfigList = [];
            //组装要保存的table，目前保存需要显示的
            for(let i in this.headSetList){
                let hd = this.headSetList[i];
                if(hd.isShow){
                    let tableHeadConfig = {};
                    tableHeadConfig.headName = hd.name;
                    tableHeadConfig.headCode = hd.code;
                    tableHeadConfig.headIndex = i;
                    tableHeadConfig.fixedFlag = hd.isFix?1:2;
                    sysTableHeadConfigList.push(tableHeadConfig);
                }
            }
            let param = {};
            param.tableName = this.tableName;
            param.paramStr = JSON.stringify(sysTableHeadConfigList);
            let url = "api/sysTableHeadConfigBO.ajax?cmd=saveSysTableHeadConfigs";
            await this.common.postUrl(url,param);
            this.setTabelShow = false;
            this.$message({
                message: '保存成功！',
                type: 'success'
            });
            this.initTableSet();
        },
        sureSetting(){
            this.cancelSetting();
            this.tableData.forEach(item => {
                this.headSetList.forEach(el => {
                    if(!el.isShow){
                        item[el.code].value = '';
                    }
                })
            });
            this.totalFn();
            this.changeValue();
            this.saveTableRow();
        },
        cancelSetting(){    //取消编辑
            this.isShowSetting = false;
            this.headSetList.forEach(el => {
                el.isChecked = false;
            })
        },
        //弹窗隐藏
        hideDialogs(){
            this.cancelSetting();
            this.tableData.forEach(el => {
                el.goodsName.goodsNameShow = false;
                el.packingType.packTypeShow = false;
            })
            this.$forceUpdate();
        },
        stopBub(){
            return false;
        },
        
        changeValue(code){
            this.$emit("changeValue",this.tableData,code);
        },
        getData(){
            return this.tableData;
        },
        setData(data){
            let tableDataCopy = [];
            data.forEach((el,index) => {
                tableDataCopy[index] = {};
                for(let key in el){
                    tableDataCopy[index][key] = {value:el[key]};
                }
            })
            this.tableData = this.common.copyObj(tableDataCopy);
        },
    },
}