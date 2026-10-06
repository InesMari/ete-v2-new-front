export default {
    name: 'courseDetail',
    data() {
        return {
            course:{
                baseInfo:{
                    files:[{}],
                },
                chapters:[
                    {
                        files:[]
                    }
                ]
            },
            showType:1,
            currentChapter:-1,
            currentFileIndex: 0,
            previousTime: 0,
            interval: null,
            isStudyCompleted: false, // 是否学习完成
            isSeekingBack: false, // 是否正在跳转回之前位置
            hasAutoSeeked: false, // 是否已自动定位过
            // PDF相关
            pdfCountdown: 0, // PDF倒计时（秒）
            pdfLastSaveCountdown: 0, // 上次保存时的倒计时位置
            pdfTimer: null, // PDF倒计时定时器
            pdfStudyTimer: null, // PDF学习计时器
            pdfStudyTime: 0, // PDF累计学习时间（秒）
            pdfLastSaveTime: 0, // PDF上次保存时间
            pdfPopupTimer: null, // PDF防挂机弹窗定时器
            pdfTimeoutTimer: null, // PDF超时定时器
            isPdfDialogShowing: false, // PDF弹窗是否显示
            isPdf: false, // 是否是PDF文件
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
        async doQuery() {
            this.course = await this.common.postUrl("eduCourseService", "getEduCourseInfo", {id: this.$route.query.courseId});
            this.course.baseInfo.durationStr = this.formatDuration(this.course.baseInfo.duration);
            if(this.common.isNotBlank(this.$route.query.lastStudyExtId) && this.$route.query.state!='1'){
                this.againVideoPlay();
            }
        },
        // 格式化时长（秒转为xx分xx秒，少于一分钟显示xx秒）
		formatDuration(seconds) {
			if (!seconds || seconds <= 0) return '0秒';
			seconds = Math.floor(seconds);
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			if (minutes === 0) {
				return secs + '秒';
			}
			return minutes + '分' + secs + '秒';
		},
        // 继续学习
        learn(){
            if(this.common.isNotBlank(this.$route.query.lastStudyExtId)){
                this.againVideoPlay();
            }else{
                this.showType = 2;
            }
        },
        // 切换Tab
        changeTab(type){
            this.showType = type;
            if (type === 2) {
                // 切换到章节详情时启动防挂机功能
                this.startAntiIdle();
            } else {
                // 离开章节详情时停止防挂机
                this.stopAntiIdle();
            }
        },
        // 继续学习
        againVideoPlay(){
            let {lastStudyExtId, chapterId, studyDuration} = this.$route.query;
            this.course.chapters.forEach((el, index) => {
                if(el.id == chapterId){
                    this.currentChapter = index;
                    el.files.forEach((file, fileIndex) => {
                        if(file.id == lastStudyExtId){
                            this.currentFileIndex = fileIndex;
                            this.course.chapters[index].files[fileIndex].active = true;
                        }
                    })
                }
            })
            this.showType = 2;
            this.$nextTick(() => {         
                const video = this.$refs.myVideo;
                if(this.common.isNotBlank(video)){
                    video.currentTime = studyDuration;
                    this.previousTime = studyDuration;       
                    this.startAntiIdle();
                }
            })
        },
        // 选择课程章节
        chooseChapter(index, fileIndex){
            // 离开前保存当前学习进度
            this.saveCurrentProgress();
            
            this.currentChapter = index;
            this.currentFileIndex = fileIndex;
            this.course.chapters.forEach(item => {
                if (item.files && item.files.length > 0)
                {
                    item.files.forEach(el => {
                        el.active = false;
                    })
                }
            })
            let chapter = this.course.chapters[index];
            if (chapter.files && chapter.files.length > 0)
            {
                chapter.files[fileIndex].active = true;
            }
            
            // 重置学习状态
            this.resetStudyState();
            
            this.$forceUpdate();
            this.$nextTick(() => {
                if (chapter.files && chapter.files.length > 0)
                {
                    let file = chapter.files[fileIndex];
                    if(file.isVideo == 1){  //视频
                        this.previousTime = 0;
                        this.hasAutoSeeked = false;
                        this.startAntiIdle();
                    }else{  //PDF
                        this.initPdfStudy();
                    }
                }
            })
        },
        // 初始化PDF学习状态
        initPdfStudy() {
            let file = this.course.chapters[this.currentChapter].files[this.currentFileIndex];
            
            // 判断是否学习完成
            const studyDuration = parseFloat(file.studyDuration) || 0;
            const duration = parseFloat(file.duration) || 0;
            this.isStudyCompleted = studyDuration >= duration;
            
            // 初始化PDF倒计时（减去已学习的时间）
            if (this.isPdf && duration > 0) {
                this.pdfCountdown = Math.max(0, duration - studyDuration);
                this.pdfLastSaveCountdown = this.pdfCountdown;
            }
            
            // 启动防挂机和倒计时
            if (!this.isStudyCompleted) {
                this.startPdfAntiIdle();
                this.startPdfCountdown();
            }
            // 初始化时不保存，等学习满30秒后才开始保存
        },
        // 重置学习状态
        resetStudyState() {
            this.stopPdfCountdown();
            this.stopPdfAntiIdle();
            this.pdfStudyTime = 0;
            this.pdfLastSaveTime = 0;
            this.isStudyCompleted = false;
            this.previousTime = 0;
            this.isSeekingBack = false;
            this.hasAutoSeeked = false;
        },
        // 启动防挂机功能
        startAntiIdle() {
            // 停止之前的定时器
            this.stopAntiIdle();
            
            let file = this.course.chapters[this.currentChapter]?.files[this.currentFileIndex];
            if (!file) return;
            
            this.isPdf = file.isVideo != 1;
            
            // 判断是否学习完成
            const studyDuration = parseFloat(file.studyDuration) || 0;
            const duration = parseFloat(file.duration) || 0;
            this.isStudyCompleted = studyDuration >= duration;
            
            if (this.isStudyCompleted) return;
            
            if (this.isPdf) {
                // PDF：启动倒计时和防挂机
                this.initPdfStudy();
            } else {
                // 视频：启动进度监听
                this.startVideoStudy();
            }
        },
        // 停止防挂机功能
        stopAntiIdle() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            this.stopPdfCountdown();
            this.stopPdfAntiIdle();
        },
        // 视频学习
        startVideoStudy() {
            if (this.interval) {
                clearInterval(this.interval);
            }
            
            this.interval = setInterval(() => {
                let video = this.$refs.myVideo;
                if (!video || video.paused || this.isStudyCompleted) return;
                
                let time = parseInt(video.currentTime);
                if(time % 10 == 0) {
                    this.study(time);
                }
            }, 1000);
        },
        // 视频播放进度更新（禁止快进）
        videoTimeUpdate(e) {
            const video = this.$refs.myVideo;
            if (!video) return;
            
            const currentTime = e.target.currentTime;

            // 学习完成时不限制进度
            if (this.isStudyCompleted) {
                this.previousTime = currentTime;
                return;
            }

            // 禁止快进：如果当前播放时间比记录的时间超过2秒，强制跳回
            if (currentTime > this.previousTime + 2) {
                this.isSeekingBack = true;
                video.currentTime = this.previousTime;
                setTimeout(() => {
                    this.isSeekingBack = false;
                }, 500);
            } else {
                // 正常播放时，只有不在跳转状态时才保存进度
                if (!this.isSeekingBack) {
                    this.previousTime = currentTime;
                }
            }
        },
        
        // 视频播放结束
        async videoEnded(e) {
            if (this.isStudyCompleted) return;
            let video = this.$refs.myVideo;
            let time = parseInt(video.currentTime);
            await this.study(time);
            this.$message.success('学习完成');
            // 重新查询更新学习状态
            await this.doQuery();
        },
        
        // 视频播放出错
        videoError(e) {
            console.error('视频播放错误:', e);
            this.$message.error('视频播放失败，请检查网络');
        },
        
        // 视频开始播放
        videoPlay(e) {
            // 如果有学习进度且尚未自动定位，则跳转到学习进度位置
            let video = this.$refs.myVideo;
            if (this.previousTime > 0 && !this.hasAutoSeeked && video) {
                this.hasAutoSeeked = true;
                video.currentTime = this.previousTime;
            }
        },
        
        // 视频暂停
        videoPause(e) {
            // 暂停时可选择保存进度
        },
        
        // 兼容旧方法
        listenVideo() {
            // 已改用 @timeupdate 事件，无需此方法
        },
        
        // 兼容旧方法
        listenPlay() {
            this.startVideoStudy();
        },
        // 保存当前进度
        saveCurrentProgress() {
            let video = this.$refs.myVideo;
            if (video && !video.paused) {
                let time = parseInt(video.currentTime);
                this.study(time);
            }
            
            // 保存PDF学习时间
            if (this.isPdf && this.pdfStudyTime > 0) {
                this.study(this.pdfStudyTime);
            }
        },
        // 去考试
        toExam(testId){
            if (this.common.isBlank(testId))
            {
                this.$message.error("课程还没有发布试卷，无法考试！");
                return false;
            }
            this.$emit("openTab",{
                urlName: "考试",
                urlId: "examination"+testId,
                urlPath: "/edu/student/exam/examination.vue",
                urlPathName: "/examination",
                query:{testId}
            })
        },
        /**
         * 定时
         * 学习接口
         * @returns {Promise<void>}
         */
        async study(duration){
            let file = this.course.chapters[this.currentChapter]?.files[this.currentFileIndex];
            if (!file) return;
            let fileExtId = file.id;
            await this.common.postUrl("eduCourseService", "studyCourse", {fileExtId, duration});
        },
        
        // ========== PDF相关方法 ==========
        
        // 格式化时间显示（秒转为 mm:ss 或 hh:mm:ss）
        formatTime(seconds) {
            if (seconds <= 0) return '00:00';
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            if (hours > 0) {
                return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        },

        // 启动PDF倒计时
        startPdfCountdown() {
            this.stopPdfCountdown();
            
            // 倒计时定时器
            this.pdfTimer = setInterval(() => {
                if (this.isPdfDialogShowing) return;
                if (this.pdfCountdown > 0) {
                    this.pdfCountdown--;
                }
            }, 1000);

            // 学习计时器（每30秒保存一次）
            this.pdfStudyTimer = setInterval(() => {
                if (this.isPdfDialogShowing) return;
                this.pdfStudyTime++;
                
                // 学习满30秒才保存
                if (this.pdfStudyTime >= 30 && this.pdfStudyTime - this.pdfLastSaveTime >= 30) {
                    this.pdfLastSaveTime = this.pdfStudyTime;
                    this.pdfLastSaveCountdown = this.pdfCountdown;
                    this.study(30);
                    console.log('PDF学习时间已保存，当前倒计时:', this.pdfCountdown);
                }
                
                // PDF倒计时结束
                if (this.pdfCountdown <= 0) {
                    this.handlePdfComplete();
                }
            }, 1000);
        },

        // 停止PDF倒计时
        stopPdfCountdown() {
            if (this.pdfTimer) {
                clearInterval(this.pdfTimer);
                this.pdfTimer = null;
            }
            if (this.pdfStudyTimer) {
                clearInterval(this.pdfStudyTimer);
                this.pdfStudyTimer = null;
            }
        },

        // 启动PDF防挂机功能
        startPdfAntiIdle() {
            this.stopPdfAntiIdle();
            // 随机10-30秒弹出确认弹窗
            this.resetPdfPopupTimer();
            // 30秒超时检测
            this.resetPdfTimeoutTimer();
        },

        // 停止PDF防挂机
        stopPdfAntiIdle() {
            if (this.pdfPopupTimer) {
                clearTimeout(this.pdfPopupTimer);
                this.pdfPopupTimer = null;
            }
            if (this.pdfTimeoutTimer) {
                clearTimeout(this.pdfTimeoutTimer);
                this.pdfTimeoutTimer = null;
            }
        },

        // 重置PDF弹窗定时器
        resetPdfPopupTimer() {
            if (this.pdfPopupTimer) {
                clearTimeout(this.pdfPopupTimer);
            }
            const delay = Math.floor(Math.random() * 21) + 10; // 10-30秒
            this.pdfPopupTimer = setTimeout(() => {
                this.showPdfConfirmDialog();
            }, delay * 1000);
        },

        // 重置PDF超时定时器
        resetPdfTimeoutTimer() {
            if (this.pdfTimeoutTimer) {
                clearTimeout(this.pdfTimeoutTimer);
            }
            this.pdfTimeoutTimer = setTimeout(() => {
                // 超时处理：回滚倒计时到上次保存位置，重置学习计时
                this.pdfCountdown = this.pdfLastSaveCountdown;
                this.pdfStudyTime = 0;
                this.pdfLastSaveTime = 0;
                this.$message.warning('检测到您已离开页面，已回滚到上次保存位置');
                // 重新启动超时定时器
                this.resetPdfTimeoutTimer();
            }, 30000);
        },

        // 显示PDF防挂机确认弹窗
        showPdfConfirmDialog() {
            if (this.isPdfDialogShowing) return;

            this.isPdfDialogShowing = true;

            this.$confirm('请确认您正在阅读学习。', '学习确认', {
                confirmButtonText: '继续学习',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isPdfDialogShowing = false;
                this.resetPdfPopupTimer();
                this.resetPdfTimeoutTimer();
            }).catch(() => {
                this.isPdfDialogShowing = false;
            });
        },

        // PDF学习完成
        handlePdfComplete() {
            this.stopPdfAntiIdle();
            this.stopPdfCountdown();
            // 保存剩余学习时间
            if (this.pdfStudyTime > 0) {
                this.study(this.pdfStudyTime);
            }
            this.$message.success('学习完成');
            // 重新查询更新学习状态
            this.doQuery();
        },
    },
    
    beforeDestroy() {
        // 保存当前进度
        this.saveCurrentProgress();
        // 清理定时器
        this.stopAntiIdle();
    }
}
