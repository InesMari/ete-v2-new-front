/**
 * 多文件上传 Mixin
 *
 * 接入方式：
 *   1. import multiFileUpload from '@/mixins/multiFileUpload.js'
 *   2. mixins: [multiFileUpload]
 *   3. （可选）覆盖 _multiFileConfig() 适配自定义字段
 *
 * 模板要求：
 *   <myFileModel v-for="(item,index) in 文件列表"
 *     :ref="refPrefix + index" :componentId="index"
 *     @successCallback="successCallback" @delCallback="delCallback" />
 */

export default {
    methods: {
        // ───────── 配置项（子页面可覆盖）─────────
        /**
         * 返回多文件上传配置，默认值适配 purFeeInfo 页面。
         * 其他页面覆盖此方法即可。
         */
        _multiFileConfig() {
            return {
                getFileList: () => this.fileList,  // 文件列表路径
                idField: 'imgId',                   // 文件ID字段名
                pathField: 'imgPath',               // 文件路径字段名
                maxCount: 3,                        // 最大文件数
                refPrefix: 'file',                  // ref 前缀
            };
        },

        // ───────── 通用方法 ─────────
        /**
         * 上传成功回调（多文件版）
         * - 已有文件时：保留原组件显示，新文件找空槽位
         * - 无文件时：直接写入当前槽位
         * - 自动追加空槽位
         */
        successCallback(imgData) {
            const cfg = this._multiFileConfig();
            const fileList = cfg.getFileList();
            const { idField, pathField, maxCount, refPrefix } = cfg;

            // 深拷贝防止引用污染，统一附加字段
            imgData = this.common.copyObj(imgData);
            imgData[idField] = imgData.flowId;
            imgData[pathField] = imgData.storePath;

            const originalId = Number(imgData.componentId);
            const hasFile = fileList[originalId] && fileList[originalId][idField];
            let targetIndex = -1;

            if (hasFile && !imgData.haveImg) {
                // 已有文件 → 找空槽位放新文件
                targetIndex = fileList.findIndex(item => !item[idField]);
                if (targetIndex < 0 && fileList.length < maxCount) targetIndex = fileList.length;
                if (targetIndex >= 0) fileList[targetIndex] = imgData;
            } else {
                fileList[originalId] = imgData;
            }

            // 保证始终有一个空槽位
            if (fileList.length < maxCount) fileList.push({});
            this.initListComponentId();

            // 已有文件替换场景：恢复原组件 + 设置新组件
            if (hasFile) {
                this.$nextTick(() => {
                    const refOrig = this.$refs[refPrefix + originalId];
                    const refNew = this.$refs[refPrefix + targetIndex];
                    if (refOrig && refOrig[0]) refOrig[0].setFile(fileList[originalId]);
                    if (targetIndex >= 0 && refNew && refNew[0]) refNew[0].setFile(imgData);
                });
            }
        },

        /**
         * 删除回调
         * - 删除指定下标
         * - 若所有槽位已满，自动补一个空位
         */
        delCallback(index) {
            const cfg = this._multiFileConfig();
            const fileList = cfg.getFileList();
            const { idField, maxCount } = cfg;

            fileList.splice(index, 1);
            const allFilled = fileList.every(item => this.common.isNotBlank(item[idField]));
            if (fileList.length < maxCount && allFilled) {
                fileList.push({});
            }
            this.imgDisplay();
            this.initListComponentId();
        },

        /**
         * 批量初始化/清理所有组件显示（callback=false 避免循环触发 successCallback）
         */
        imgDisplay() {
            const cfg = this._multiFileConfig();
            const fileList = cfg.getFileList();
            const { idField, maxCount, refPrefix } = cfg;

            // 初始化时若所有槽位都有文件且未达上限，补一个空槽位
            const hasEmptySlot = fileList.some(item => !item[idField]);     //检查是否本来有空槽
            if (!hasEmptySlot && fileList.length < maxCount) {
                fileList.push({});
            }

            this.$nextTick(() => {
                for (let i = 0; i < fileList.length; i++) {
                    const ref = this.$refs[refPrefix + i];
                    if (!ref || !ref[0]) continue;
                    if (fileList[i][idField]) {
                        ref[0].initDate(fileList[i][idField], false);
                    } else {
                        ref[0].clean();
                    }
                }
            });
        },

        /**
         * 同步 componentId 与 v-for 索引
         */
        initListComponentId() {
            const fileList = this._multiFileConfig().getFileList();
            for (let i = 0; i < fileList.length; i++) {
                fileList[i].componentId = i;
            }
            this.$forceUpdate();
        },
    },
};
