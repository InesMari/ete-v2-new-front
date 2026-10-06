import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import enumData from "@/page/pt/enum.js"
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
	name: 'wmsAllocatMaterialManage',
	data()
	{
		return {
			head: [
				{"name": "批次号", "code": "batchNum", "width": "200", "type": "text"},
				{"name": "供应商批次号", "code": "supplierBatchNum", "width": "200", "type": "text"},
				{"name": "ASN", "code": "asn", "width": "120", "type": "text"},
				{"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
				{"name": "物料描述", "code": "materialDesc", "width": "150", "type": "text"},
				{"name": "生产日期", "code": "produceDate", "width": "130", "type": "text"},
				{"name": "库存数量", "code": "nums", "width": "90", "type": "text"},
				{"name": "货主", "code": "srcTenantName", "width": "200", "type": "text"},
				{"name": "到货厂商", "code": "fromTenantName", "width": "200", "type": "text"},
				{"name": "移库数量", "code": "aNums", "width": "90", "type": "text"},
				{"name": "管理单位", "code": "unitName", "width": "90", "type": "text"},
				{"name": "原库区", "code": "reservoirName", "width": "150", "type": "text"},
				{"name": "原库位", "code": "storageCode", "width": "150", "type": "text"},
				{"name": "新库区", "code": "newReservoirName", "width": "150", "type": "text"},
				{"name": "新库位", "code": "newStorageCode", "width": "150", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
				{"name": "操作人", "code": "createUserName", "width": "150", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
			],
			query: this.initQuery(),//查询调价对象
			allocatShow: false,//控制库存调拨展示
			isOnlySee: false,//是否只查看
			allocat: this.initAllocat(),//调拨对象
			allocatList: this.initAllocatList(),//调拨列表数据
			materialList: [],//物料下拉数据
			newReservoirList: [],//库区下拉数据
			showSelWork:false,
		}
	},
	/**
	 * 初始化
	 */
	async mounted()
	{
		this.initSelWork();
		this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		myElDatePicker,
		enumData,
		selectWork
	},
	/**
	 * 绑定函数
	 */
	methods: {
		initSelWork(){
			this.userInfo = this.common.userInfo();
			if(!this.userInfo.workId){
				this.showSelWork = true;
			}else{
				this.firstIn = false;
				this.doQuery();
			}
		},
		selWork(){
			this.showSelWork = false;
			this.$forceUpdate();
			if(!this.firstIn){
				this.$emit('closeOthers', {});
			}
			this.userInfo = this.common.userInfo();
			this.firstIn = false;
			this.doQuery();
		},
		/**
		 * 列表查询
		 */
		async doQuery(query = this.query)
		{
			await this.$refs.table.load("wmsAllocatTF", "queryAllocatMaterialPage", query);
		},
		/**
		 * 初始化按物料分组数据和新库存下拉列表数据
		 */
		async initData()
		{
			this.materialList = await this.common.postUrl("wmsAllocatTF", "queryAllocatUsableMaterialList", {});//查询可调拨物料
			this.newReservoirList = await this.common.postUrl("wmsReservoirTF", "getReservoirDataSel", {});
		},
		/**
		 * 通过库区加载库位集合
		 * @returns {Promise<*[]>}
		 */
		async loadStorageListByReservoirId(item, index)
		{
			let data = [];
			if (this.common.isNotBlank(item.toReservoirId))
				data = await this.common.postUrl("wmsReservoirTF", "queryStorageListByReservoirId", {reservoirId: item.toReservoirId});
			item.toStorageId = '';
			item.newStorageList = data;
			this.$forceUpdate();
		},
		/**
		 * 改变新库位
		 * @param item
		 */
		changeNewStorage(item)
		{
			this.$forceUpdate();
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery()
		{
			return this.query = {
				materialNum: '',
				tenantName: '',
				batchNum: '',
			};
		},
		/**
		 * 初始化调拨对象
		 */
		initAllocat()
		{
			return this.allocat = {
				sum: 0,
			};
		},
		/**
		 * 初始化调拨列表集合
		 */
		async initAllocatList()
		{
			return this.allocatList = [this.initAllocatData()];
		},
		/**
		 * 初始化数组单个调拨数据
		 * @returns
		 */
		initAllocatData()
		{
			return {
				materialId: '',
				batchNum: '',
				batchNumList: [],
				supplierBatchNum: '',
				supplierBatchNumList: [],
				asn: '',
				asnList: [],
				materialDesc: '',
				materialSpecsId: '',
				materialSpecsList: [],
				produceDate: '',
				produceDateList: [],
				inDate: '',
				inDateList: [],
				nums: '',
				unitName: '',
				reservoirId: '',
				reservoirList: [],
				storageId: '',
				storageList: [],
				toReservoirId: '',
				toStorageId: '',
				aNums: '',
				remark: '',
				freezeState: 0,
				newReservoirList: this.newReservoirList,
				newStorageList: [],
			};
		},

		/**
		 * 初始化调拨对象的属性
		 */
		initAllocatDataProperty(item, materialId, materialDesc, batchNum, batchNumList,
						supplierBatchNum, supplierBatchNumList, asn, asnList, materialSpecsId, materialSpecsList,
						produceDate, produceDateList, inDate, inDateList, nums, unitName, reservoirId, reservoirList,
						storageId, storageList, toReservoirId, toStorageId, aNums, remark)
		{
				item.materialId = this.common.isBlank(materialId) ? '' : materialId;
				item.materialDesc = this.common.isBlank(materialDesc) ? '' : materialDesc;
				item.batchNum = this.common.isBlank(batchNum) ? '' : batchNum;
				item.batchNumList = this.common.isBlank(batchNumList) ? [] : batchNumList;
				item.supplierBatchNum = this.common.isBlank(supplierBatchNum) ? '' : supplierBatchNum;
				item.supplierBatchNumList = this.common.isBlank(supplierBatchNumList) ? [] : supplierBatchNumList;
				item.asn = this.common.isBlank(asn) ? '' : asn;
				item.asnList = this.common.isBlank(asnList) ? [] : asnList;
				item.materialSpecsId = this.common.isBlank(materialSpecsId) ? '' : materialSpecsId;
				item.materialSpecsList = this.common.isBlank(materialSpecsList) ? [] : materialSpecsList;
				item.produceDate = this.common.isBlank(produceDate) ? '' : produceDate;
				item.produceDateList = this.common.isBlank(produceDateList) ? [] : produceDateList;
				item.inDate = this.common.isBlank(inDate) ? '' : inDate;
				item.inDateList = this.common.isBlank(inDateList) ? [] : inDateList;
				item.nums = this.common.isBlank(nums) ? '' : nums;
				item.unitName = this.common.isBlank(unitName) ? '' : unitName;
				item.reservoirId = this.common.isBlank(reservoirId) ? '' : reservoirId;
				item.reservoirList = this.common.isBlank(reservoirList) ? [] : reservoirList;
				item.storageId = this.common.isBlank(storageId) ? '' : storageId;
				item.storageList = this.common.isBlank(storageList) ? [] : storageList;
				item.toReservoirId = this.common.isBlank(toReservoirId) ? '' : toReservoirId;
				item.toStorageId = this.common.isBlank(toStorageId) ? '' : toStorageId;
				item.aNums = this.common.isBlank(aNums) ? '' : aNums;
				item.remark = this.common.isBlank(remark) ? '' : remark;
				item.freezeState = 0;
				item.newReservoirList = this.newReservoirList;
				item.newStorageList = [];

			return item;
		},

		/**
		 * 控制弹窗
		 * @param flag
		 */
		async showAllocat(flag)
		{
			this.allocatShow = flag;//打开或者关闭弹窗
			this.allocat.sum = 0;
			if (flag)
			{
				await this.initAllocatList();//初始化一条选择空数据
				await this.initData();//初始化按物料分组数据和新库存列表数据
			}
			//只有一个物料自动选择
			if (this.materialList.length === 1)
			{
				this.allocatList[0].materialId = this.materialList[0].materialId;//复制唯一一个物料
				this.changeMaterial(this.allocatList[0], 0, true);
			}
			this.$forceUpdate();
		},
		/**
		 * 改变物料编码
		 * @param item
		 * @param index
		 */
		changeMaterial(item, index, isAuto)
		{
			//初始化一下物料之外的属性
			this.initAllocatDataProperty(item, item.materialId);

			this.materialList.forEach(el => {
				if (el.materialId == item.materialId)
				{
					item.materialDesc = el.materialDesc;
					if (item.batchNumList.length === 0)
						item.batchNumList = el["batchNum" + item.materialId];
					//一条数据自动选择
					if (this.common.isNotBlank(item.batchNumList) && item.batchNumList.length === 1)
					{
						item.batchNum = item.batchNumList[0].batchNum;
						this.changeBatchNum(item, index, true);
					}
				}
			});
		},

		/**
		 * 改变批次号
		 * @param item
		 * @param index
		 * @param isAuto 是否自动调用
		 */
		changeBatchNum(item, index, isAuto)
		{
			//初始化一下批次号之外的属性属性
			this.initAllocatDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList);

			this.materialList.forEach(el => {
				if (el.materialId == item.materialId)
				{
					if (item.supplierBatchNumList.length === 0)
						item.supplierBatchNumList = el["supplierBatchNum" + item.materialId + item.batchNum];
					//一条数据自动选择
					if (this.common.isNotBlank(item.supplierBatchNumList) && item.supplierBatchNumList.length === 1)
					{
						item.supplierBatchNum = item.supplierBatchNumList[0].supplierBatchNum;
						this.changeSupplierBatchNum(item, index, true);
					}
				}
			});
		},
		/**
		 * 改变供应商批次号
		 * @param item
		 * @param index
		 * @param isAuto 是否自动调用
		 */
		changeSupplierBatchNum(item, index, isAuto)
		{
			//初始化一下批次号之外的属性属性
			this.initAllocatDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList);

			this.materialList.forEach(el => {
				if (el.materialId == item.materialId)
				{
					if (item.asnList.length === 0)
						item.asnList = el["asn" + item.materialId + item.batchNum + item.supplierBatchNum];
					//一条数据自动选择
					if (this.common.isNotBlank(item.asnList) && item.asnList.length === 1)
					{
						item.asn = item.asnList[0].asn;
						this.changeAsn(item, index, true);
					}
				}
			});
		},

		/**
		 * 改变ASN
		 * @param item
		 * @param index
		 * @param isAuto 是否自动调用
		 */
		changeAsn(item, index, isAuto)
		{
			//初始化一下批次号之外的属性属性
			this.initAllocatDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
				item.asn, item.asnList);

			this.materialList.forEach(el => {
				if (el.materialId == item.materialId)
				{
					if (item.materialSpecsList.length === 0)
						item.materialSpecsList = el["materialSpecsId" + item.materialId + item.batchNum + item.supplierBatchNum + item.asn];
					//一条数据自动选择
					if (this.common.isNotBlank(item.materialSpecsList) && item.materialSpecsList.length === 1)
					{
						item.materialSpecsId = item.materialSpecsList[0].materialSpecsId;
						this.changeMaterialSpecs(item, index, true);
					}
				}
			});
		},

		/**
		 * 改变规格
		 * @param item
		 * @param index
		 */
		changeMaterialSpecs(item, index, isAuto)
		{
			this.initAllocatDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
				item.asn, item.asnList, item.materialSpecsId, item.materialSpecsList);
			this.materialList.forEach(el => {
				if (el.materialId == item.materialId)
				{
					if (item.produceDateList.length === 0)
						item.produceDateList = el["produceDate" + item.materialId + item.batchNum + item.supplierBatchNum + item.asn + item.materialSpecsId];
					//一条数据自动选择
					if (this.common.isNotBlank(item.produceDateList) && item.produceDateList.length === 1)
					{
						item.produceDate = item.produceDateList[0].produceDate;
						this.changeProduceDate(item, index, true);
					}
				}
			});
		},
		/**
		 * 生产日期
		 * @param item
		 * @param index
		 */
		changeProduceDate(item, index, isAuto)
		{
			this.initAllocatDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
				item.asn, item.asnList, item.materialSpecsId, item.materialSpecsList, item.produceDate, item.produceDateList);
			this.materialList.forEach(el => {
				if (el.materialId == item.materialId)
				{
					if (item.inDateList.length === 0)
						item.inDateList = el["inDate" + item.materialId + item.batchNum + item.supplierBatchNum + item.asn + item.materialSpecsId + item.produceDate];
					//一条数据自动选择
					if (this.common.isNotBlank(item.inDateList) && item.inDateList.length === 1)
					{
						item.inDate = item.inDateList[0].inDate;
						this.changeInDate(item, index, true);
					}
				}
			});
		},
		/**
		 * 入库时间
		 * @param item
		 * @param index
		 */
		changeInDate(item, index, isAuto)
		{
			this.initAllocatDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
				item.asn, item.asnList, item.materialSpecsId, item.materialSpecsList, item.produceDate, item.produceDateList, item.inDate, item.inDateList);
			this.materialList.forEach(el => {
				if (el.materialId == item.materialId)
				{
					if (item.reservoirList.length === 0)
						item.reservoirList = el["reservoirId" + item.materialId + item.batchNum + item.supplierBatchNum + item.asn + item.materialSpecsId + item.produceDate + item.inDate];
					//一条数据自动选择
					if (this.common.isNotBlank(item.reservoirList) && item.reservoirList.length === 1)
					{
						item.reservoirId = item.reservoirList[0].reservoirId;
						this.changeReservoir(item, index, true);
					}
				}
			});
		},
		/**
		 * 原库区
		 * @param item
		 * @param index
		 */
		changeReservoir(item, index, isAuto)
		{
			this.initAllocatDataProperty(item, item.materialId, item.materialDesc, item.batchNum, item.batchNumList, item.supplierBatchNum, item.supplierBatchNumList,
				item.asn, item.asnList, item.materialSpecsId, item.materialSpecsList, item.produceDate, item.produceDateList, item.inDate, item.inDateList,
				item.nums, item.unitName, item.reservoirId, item.reservoirList);
			this.materialList.forEach(el => {
				if (el.materialId == item.materialId)
				{
					if (item.storageList.length === 0)
						item.storageList = el["storageId" + item.materialId + item.batchNum + item.supplierBatchNum + item.asn + item.materialSpecsId + item.produceDate + item.inDate + item.reservoirId];
					//一条数据自动选择
					if (this.common.isNotBlank(item.storageList) && item.storageList.length === 1)
					{
						item.storageId = item.storageList[0].storageId;
						this.changeStorage(item, index, true);
					}
				}
			});
		},
		/**
		 * 原库位
		 * @param item
		 * @param index
		 */
		changeStorage(item, index, isAuto)
		{
			this.sureStore(item, index);
		},
		/**
		 * 根据选择的数据确认唯一的库存
		 * @param item
		 * @param index
		 */
		sureStore(item, index)
		{
			let value = null;
			this.materialList.forEach(el => {
				if (this.common.isBlank(value))
					value = el["STORE_PRE" + item.materialId + item.batchNum + item.supplierBatchNum + item.asn + item.materialSpecsId + item.produceDate + item.inDate + item.reservoirId + item.storageId];
			});

			//确定唯一的库存
			//找到赋值相关数据 没有找到就清空库存ID 保存根据dId是否确认唯一库存
			if (this.common.isNotBlank(value))
			{
				item.boxNums = value.boxNums;
				item.dId = value.dId;
				item.freezeState = value.freezeState;
				item.fromTenantId = value.fromTenantId;
				item.materialDesc = value.materialDesc;
				item.nums = value.nums;
				item.palletNums = value.palletNums;
				item.srcTenantId = value.srcTenantId;
				item.unit = value.unit;
				item.unitName = value.unitName;
			}
			else
			{
				item.dId = '';
				item.materialDesc = this.common.isBlank(item.materialId) ? '' : item.materialDesc;
				item.nums = '';
				item.unitName = '';
			}
			this.$forceUpdate();
		},
		/**
		 * 添加
		 */
		add()
		{
			this.allocatList.push(this.initAllocatData());
		},
		/**
		 * 移除
		 * @param index
		 */
		remove(index)
		{
			if (this.allocatList.length > 1)
				this.allocatList.splice(index, 1);
		},
		/**
		 * 改变是否冻结
		 * @param item
		 */
		changeSwitch(item)
		{
			item.freezeState = item.freezeState == 1 ? 0 : 1;
			this.$forceUpdate();
		},
		/**
		 * 计算合计
		 */
		changeSum(item)
		{
			if (item.aNums > item.nums)
			{
				this.$message.error("调拨数量超出库存");
				item.aNums = '';
			}
			let sum = 0;
			for (let i = 0; i < this.allocatList.length; i++)
			{
				if (this.common.isNotBlank(this.allocatList[i].aNums) && !isNaN(this.allocatList[i].aNums))
					sum = this.common.accAdd(sum, this.allocatList[i].aNums);
			}
			this.allocat.sum = sum;
			this.$forceUpdate();
		},
		/**
		 *
		 */
		async sureRecord()
		{
			if (this.allocat.sum <= 0)
			{
				this.$message.error("请填写移库数量！");
				return false;
			}
			let map = new Map();
			for (let i = 0; i < this.allocatList.length; i++)
			{
				let item = this.allocatList[i];
				if (this.common.isBlank(item.dId))
				{
					this.$message.error("第" + (i + 1) + "行数据有误！");
					return false;
				}
				if (this.common.isBlank(item.materialId))
				{
					this.$message.error("请选择第" + (i + 1) + "行的物料编码！");
					return false;
				}
				if (this.common.isBlank(item.batchNum))
				{
					this.$message.error("请选择第" + (i + 1) + "行的批次号！");
					return false;
				}
				if (this.common.isBlank(item.materialSpecsId))
				{
					this.$message.error("请选择第" + (i + 1) + "行的规格！");
					return false;
				}
				// if (this.common.isBlank(item.inDate))
				// {
				// 	this.$message.error("请选择第" + (i + 1) + "行的入库日期！");
				// 	return false;
				// }
				if (this.common.isBlank(item.reservoirId))
				{
					this.$message.error("请选择第" + (i + 1) + "行的原库区！");
					return false;
				}
				if (this.common.isBlank(item.storageId))
				{
					this.$message.error("请选择第" + (i + 1) + "行的原库位！");
					return false;
				}
				if (this.common.isBlank(item.toReservoirId))
				{
					this.$message.error("请选择第" + (i + 1) + "行的新库区！");
					return false;
				}
				if (this.common.isBlank(item.toStorageId))
				{
					this.$message.error("请选择第" + (i + 1) + "行的新库位！");
					return false;
				}
				if (this.common.isBlank(item.aNums))
				{
					this.$message.error("请输入第" + (i + 1) + "行的移库数量！");
					return false;
				}
				let aNumsSum = map.get(item.dId);
				if (this.common.isBlank(aNumsSum)) aNumsSum = 0;
				if (Number(item.aNums) + aNumsSum > item.nums)
				{
					this.$message.error("批次号：" + item.batchNum + "移库的总数量超过批次的库存！");
					return false;
				}
				map.set(item.dId, aNumsSum + Number(item.aNums));
			}
			let param = this.common.copyObj(this.allocat);
			param.allocatList = this.common.copyObj(this.allocatList);

			await this.common.postUrl("wmsAllocatTF", "saveAllocat", param, null,null,'',true);
			this.$message.success("移库成功！");
			await this.doQuery();
			await this.showAllocat(false);
		},

		/**
		 * 跳转
		 * @returns {boolean}
		 */
		go()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length <= 0)
			{
				this.$message.error("请至少选择一条需要打印的移库单！");
				return false;
			}
			let key = "";
			for (let i = 0; i < selectData.length; i++)
			{
				let item = selectData[i];
				if (i == 0)
					key = item.srcTenantId + "" + item.fromTenantId;
				else
				{
					if (key != item.srcTenantId + "" + item.fromTenantId)
					{
						this.$message.error("您选择的移库单包含不同的货主或到货厂商,请重新选择！");
						return false;
					}
				}
			}
			let ids = "";
			selectData.forEach(item => {
				ids += item.aId + ",";
			});
			ids = ids.substring(0, ids.length - 1);
			this.$emit("openTab",{
				urlId: "printAllocatOrder" + ids,
				query: {ids: ids},
				urlName: '打印移库单',
				urlPathName: "/printAllocatOrder",
				urlPath: '/pt/wms/allocat/printAllocatOrder.vue'});
		},
		gotoLog()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length != 1) {
				this.$message.error("请选择一条数据！");
				return;
			}
			let data = selectData[0];
			this.$emit("openTab",{
				urlId: 'allocat' + 'Detail' + data.aId,
				query: {
					logId: data.aId,
					logType: enumData.LOG_TYPE.STOCK_ALLOCAT,
				},
				urlName: "移库" + "操作日志",
				urlPathName: "/operateLog",
				urlPath: "/pt/operateLog/operateLog.vue"});
		},
	},
}
