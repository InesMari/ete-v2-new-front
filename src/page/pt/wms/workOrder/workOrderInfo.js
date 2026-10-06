import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from "@/components/myFileModel/myFileModel.vue";
import printJS from "print-js";

export default {
	name: 'workOrderInfo',
	data()
	{
		return {
			type: this.$route.query.type,
			order: {
				orderNum: null,
				registerStateName: null,
				workName: null,
				tenantName: null,
				num: null,
				itemTypeName: null,
				itemName: null,
				unit: null,
				tax: null,
				price: null,
				fee: null,
				priceWithTax: null,
				confirmUserName: null,
				confirmDate: null,
				confirmStateName: null,
				registerDate: null,
				requiredWorkDate: null,
			},
			operaterCertificateList: [],
			scenePictureList: [],
		srcList: [],
		}
	},
	mounted()
	{
		this.loadOrderInfo();
	},
	/**
	 * 组件
	 */
	components: {
        myFileModel,
		fileViewer,
	},
	methods: {
		/**
		 * 加载订单数据
		 */
		async loadOrderInfo()
		{
			let data = await this.common.postUrl("workOrderService", "loadWorkOrderById",
				{id: this.$route.query.id}, null, null, null, true);

			/** 订单信息 **/
			this.order = data.info;
			if (this.type != 5)
			{
				this.operaterCertificateList = data.operaterCertificateList;
				let that = this;
				this.$nextTick(()=>{
					if (this.common.isNotBlank(this.operaterCertificateList))
					{
						for (let i = 0; i < this.operaterCertificateList.length; i++) {
							eval("that.$refs.file" + i + "[0].initDate(" + this.operaterCertificateList[i].fileId + ")");
						}
					}
				})
				this.scenePictureList = data.scenePictureList;
				this.$nextTick(()=>{
					if (this.common.isNotBlank(this.scenePictureList))
					{
						for (let i = 0; i < this.scenePictureList.length; i++) {
							eval("that.$refs.file2" + i + "[0].initDate(" + this.scenePictureList[i].fileId + ")");
						}
					}
				})
			}
			this.$forceUpdate();
		},
		/**
		 * 显示大图
		 * @param data
		 */
		showBigImg(data)
		{
			this.srcList = [data.imgPathUrl];
			this.$refs.viewer.show();
		},
		print(){
			printJS({
				printable: 'printTable',
				type: 'html',
				css: './static/css/print.css',  //真实路径/public//static/css/print.css
				scanStyles: false
			})
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
		},
	},
}
