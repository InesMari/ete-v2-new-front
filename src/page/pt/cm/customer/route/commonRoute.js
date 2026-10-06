export default {
	data()
	{
		return {
			routeList:[
				{workId: '',workName:'起点',workType: 1},
				{workId: '',workName:'终点',workType: 2}
			],
			routeWidth: '100%',
			workTypeData:[],
			bizTypeData:[],
			workData : [],//作业点数据
			goodsData:[],//货物数据
			packingTypeData: [],//所有货物包装
			tableData:[{goodsId: '',className: '',packingType: '',goodsModel: '',}],
		}
	},
	mounted()
	{
		this.initData();
		this.$nextTick(()=>{
			this.calcTableH();
		});
	},
	methods:{
		/**
		 * 初始化静态数据
		 */
		initData()
		{
			let that = this;
			//作业内容
			this.common.postUrl("commonTF", "getSysStaticData", {codeType:"WORK_TYPE"}, function (data) {
				that.workTypeData = data;
			});
			this.common.postUrl("commonTF", "getSysStaticData", {codeType:"BIZ_TYPE"}, function (data) {
				that.bizTypeData = data;
			});
			//包装
			this.common.postUrl("commonTF", "getSysStaticData", {codeType:"GOODS_PACKING_TYPE"}, function (data) {
				that.packingTypeData = data;
			});
			//作业点
			this.loadWorkData();
			//货物
			this.loadGoodsData();
		},
		/**
		 * 加载作业点数据
		 */
		loadWorkData()
		{
			let that = this;
			this.common.postUrl("workGoodsTF","queryWorkDataSelect", {tenantId : this.$route.query.tenantId,isLoadStoreHouse : 1}, function (data)
			{
				data.forEach(item => {item.disabled = false;});
				that.workData = data;
			});
		},
		/**
		 * 加载货物数据
		 */
		loadGoodsData()
		{
			let that = this;
			this.common.postUrl("workGoodsTF","queryGoodsDataByTenantId", {tenantId : this.$route.query.tenantId}, function (data)
			{
				data.forEach(item => {item.disabled = false;});
				that.goodsData = data;
			});
		},
		/**
		 * 计算表格高度
		 */
		calcTableH(){
			this.$refs.tableName.style.height = this.$refs.table.offsetHeight + 1 + "px";
		},
		/**
		 * 计算宽度
		 */
		calcWidth()
		{
			this.routeWidth = 100/(this.routeList.length - 1)+"%";    //重新赋值宽度
		},
		/**
		 * 初始化作业点
		 * @returns {{workName: string, workType: number, workId: string}}
		 */
		initWork()
		{
			return {workId: '',workName:'中途点',workType: 3,linkmanName:'',bill:'',phone:'',address:'',pcdName:''};
		},
		/**
		 * 初始化货物
		 * @returns {{goodsId: string, className: string, goodsModel: string, packingType: string}}
		 */
		initGoods()
		{
			return {goodsId: '',className: '',packingType: '',goodsModel: '',};
		},
		/**
		 * 追加线路作业点
		 * @param index
		 */
		addRouteWorkItem(index){
			this.routeList.splice(index+1, 0, this.initWork());//插入作业点
			this.calcWidth();
		},
		/**
		 * 删除线路作业点
		 * @param index
		 */
		removeRouteWorkItem(index){
			this.routeList.splice(index,1);
			this.calcWidth();
			this.initWorkDisabled();
		},
		/**
		 * 已经选择的作业点类型置顶
		 * @param item
		 */
		showWorkTypeTop(item){
			this.workTypeData.forEach((el,index)=>{
				if(item.workType == el.workType){
					this.workTypeData.unshift(this.workTypeData.splice(index , 1)[0]);
				}
			});
			item.shoToolsTip = true;
			this.$forceUpdate();
		},
		/**
		 * 确认选择线路作业点类型
		 * @param item
		 * @param type   作业点类型
		 */
		sureWorkType(item,type){
			item.shoToolsTip = false;
			item.workType = type;
			this.$forceUpdate();
		},
		/**
		 * 追加线路常用货物
		 * @param index
		 */
		addRouteGoodsItem(index){
			this.tableData.splice(index + 1 ,0 ,this.initGoods());
		},
		/**
		 * 移除线路常用货物
		 * @param index
		 * @param data
		 * @returns {boolean}
		 */
		removeRouteGoodsItem(index, data){
			this.initGoodsDisabled();
			if (this.tableData.length <= 1){ return false; }
			this.tableData.splice(index,1);    //删除作业点
		},
		/**
		 * 校验线路名称重名
		 */
		checkedExistSameRoute()
		{
			let that = this;
			this.common.postUrl("routeTF","checkedExistSameRoute", this.form, function (data)
			{
				if (data){ that.$message.error("当前线路名称已经存在！"); }
			})
		},
		/**
		 * 选择作业点回调
		 * @param data
		 */
		changeWork(data)
		{
			let work = {};
			this.workData.forEach(item => { if (item.workId == data.workId){ work = item;} });
			data.workName = work.workName;
			data.linkmanName = work.linkmanName;
			data.bill = work.bill;
			data.phone = work.phone;
			data.address = work.address;
			data.pcdName = work.pcdName;
			this.initWorkDisabled();
		},
		/**
		 * 初始化作业点可选状态
		 */
		initWorkDisabled()
		{
			this.workData.forEach(item => {
				item.disabled = false;
				this.routeList.forEach(itemW => {
					if (item.workId == itemW.workId){ item.disabled = true; }
				})
			});
		},
		/**
		 * 选择货物回调
		 * @param data
		 */
		changeGoods(data)
		{
			let goods = {};
			this.goodsData.forEach(item => {
				if (item.goodsId == data.goodsId){ goods = item; }
			});
			data.goodsName = goods.goodsName;
			data.className = goods.className;
			data.packingType = goods.packingType;
			data.goodsModel = goods.goodsModel;
			this.initGoodsDisabled();
		},
		/**
		 * 初始化货物可选状态
		 */
		initGoodsDisabled()
		{
			this.goodsData.forEach(item => {
				item.disabled = false;
				this.tableData.forEach(itemG => {
					if (item.goodsId == itemG.goodsId){ item.disabled = true; }
				})
			})
		},
		/**
		 * 关闭当前那页面
		 */
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
			this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
		},
		/**
		 * 刷新视图
		 */
		forceUpdate()
		{
			this.$forceUpdate();
		},
		/**
		 * 改变订单类型
		 */
		changeOrderType()
		{
			if (this.form.orderType == 2)
			{
				if (this.routeList.length > 2)
				{
					this.form.orderType = 1;//修改回来整车
					this.$message.error("零担的线路只有两个作业点，请移除多余的作业点！");
					return false;
				}

			}
			this.isShowReturn = this.form.orderType == 1;//零担需要隐藏是否返程
		}

	}
}
