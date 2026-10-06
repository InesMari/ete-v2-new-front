import Player from './videoPlay-js.js'

export default {
    name: 'videoPlayer',
    data() {
        return {
            info: {
                date:"",
                timeRange: [],
            },
            videoData: {},
            streamURL: "",
            isFullScreen: false,
            islive: true,
            isplay: false,
            showDialog: false,
            moveLeft:0,
            timeScale : [],
            cursorPoi:0,
            videoTimes:[]
        }
    },
    async mounted() {
        let _this = this;
        this.player = new Player(['player'], {
            playError: _this.playError,
            playFileOver: _this.playFileOver,
            talkStart: _this.talkStart,
            playProgressUpdate: _this.playProgressUpdate,
        })
        this.player.init();
        this.initTimeScale();
        this.initTimeMove();
        // this.play();
        console.log(this.player)
    },
    methods: {
        // 重置数据
        init(data) {
            this.videoData = data;
            this.islive = true;
            this.isplay = false;
            this.moveLeft = 0;
            this.cursorPoi = 0;
            this.info = {
                date:"",
                timeRange: [],
            };
            this.queryLive();
        },
        async queryLive() {
            let { deviceSerial, verifyCode, channelNo } = this.videoData;
            this.streamURL = await this.common.postUrl("resMonitorDeviceTF", "getDeviceStreamUrl", { deviceSerial, verifyCode, channelNo, businessType: "real" });
            console.log(this.videoData.name)
            this.$forceUpdate();
        },
        async toLive() {
            this.islive = true;
            await this.queryLive();
            this.play();
        },
        toReplay() {
            this.showDialog = true;
        },
        closeDialog() {
            this.showDialog = false;
        },
        async getReplay() {
            this.closeDialog();
            this.islive = false;
            this.isplay = true;
            let { deviceSerial, verifyCode, channelNo } = this.videoData;
            let _this = this;
            this.streamURL = await this.common.postUrl("resMonitorDeviceTF", "getDeviceStreamUrl", { 
                deviceSerial, 
                verifyCode, 
                channelNo, 
                businessType: "localRecord", 
                beginTime: `${_this.info.date} 00:00:00`,
                endTime: `${_this.info.date} 23:59:59`,
            });
            this.play();
            this.videoTimes = await this.common.postUrl("resMonitorDeviceTF", "queryLocalRecords", { 
                deviceSerial,
                channelNo,
                beginTime: `${_this.info.date} 00:00:00`,
                endTime: `${_this.info.date} 23:59:59`,
            });
            this.initVideoTimes();
        },
        initTimeScale(){
            // 初始化时间刻度
            let result = [];
            for (let hour = 0; hour <= 24; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    if(hour == 24 && minute == 30) break;
                    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                    const progress = ((hour * 2 + minute / 30) / 48 * 100) + "%";
                    result.push({ time, progress });
                }
            }
            this.timeScale = result;

        },
        // 初始化拖拽事件
        initTimeMove() {
            const timeMoveView = document.getElementById('timeMoveView');
            const timeMoveParentView = document.getElementById('timeMoveParentView');

            let isDragging = false;
            let offsetX;
            let _this = this;
            _this.isMove = false;
            let cursorPoi = 0;

            timeMoveParentView.addEventListener('click', (e) => {
                if(_this.isMove) return
                cursorPoi = offsetX + _this.moveLeft;
                let time = _this.progressToTime((cursorPoi - _this.moveLeft)/timeMoveView.clientWidth);
                console.log(time);
                _this.checkHaveVideo(time)
                _this.player.pause("player");   //暂停视频避免刷新指针位置
                const timer = setTimeout(()=>{  //暂停视频有延迟，所以设置定时器
                    _this.cursorPoi = cursorPoi; //挪动指针
                    queryTimeRecords(time);
                    clearTimeout(timer);
                },300)
            });

            timeMoveView.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.offsetX;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            function onMouseMove(e) {
                if (isDragging) {
                    let newX = e.offsetX - offsetX;
                    if(Math.abs(newX)<5) return;
                    _this.isMove = true;
                    if(e.target.id == timeMoveView.id){                        
                        _this.moveLeft += newX;
                        let endX = timeMoveParentView.clientWidth - timeMoveView.clientWidth;
                        if(_this.moveLeft>0){
                            _this.moveLeft = 0;
                        }else if(_this.moveLeft < endX){
                            _this.moveLeft = endX;
                        }
                    }
                }
            }

            function onMouseUp() {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if(_this.isMove){
                    let time = _this.progressToTime((_this.cursorPoi - _this.moveLeft)/timeMoveView.clientWidth);
                    console.log(time);
                    _this.checkHaveVideo(time)
                    queryTimeRecords(time)
                    _this.$forceUpdate();                    
                    const timer = setTimeout(() => {
                        _this.isMove = false;
                        clearTimeout(timer);
                    }, 500);
                }
            }
            async function queryTimeRecords(time) {
                let { deviceSerial, verifyCode, channelNo } = _this.videoData;
                _this.streamURL = await _this.common.postUrl("resMonitorDeviceTF", "getDeviceStreamUrl", { 
                    deviceSerial, 
                    verifyCode, 
                    channelNo, 
                    businessType: "localRecord", 
                    beginTime: `${_this.info.date} ${time}`,
                    endTime: `${_this.info.date} 23:59:59`,
                });
                _this.play();
            }
        },
        progressToTime(progress) {
        
            // 计算总秒数
            const totalSeconds = progress * 24 * 60 * 60;
        
            // 计算小时、分钟和秒
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);
        
            // 格式化时间为 HH:MM:SS 格式
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
        
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        },
        // 时间转进度，返回不带%，需要自己加
        timeToProgress(timeStr) {
            // 创建 Date 对象来解析输入的时间字符串
            let inputDate = new Date(timeStr);

            // 检查是否是有效的日期
            if (isNaN(inputDate.getTime())) {
                throw new Error('输入的时间格式不正确，请使用 YYYY-MM-DD HH:MM:SS 格式');
            }
            // 判断是否超出当天
            if(inputDate.getTime() - new Date(`${this.info.date} 00:00:00`).getTime() >= 24 * 60 * 60 * 1000){
                inputDate = new Date(`${this.info.date} 23:59:59`);
            }

            // 获取该时间的小时、分钟和秒
            const hours = inputDate.getHours();
            const minutes = inputDate.getMinutes();
            const seconds = inputDate.getSeconds();

            // 计算该时间对应的总秒数
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;

            // 计算一天的总秒数
            const totalSecondsInADay = 24 * 3600;

            // 计算该时间在当日中的百分比
            const progress = (totalSeconds / totalSecondsInADay) * 100;

            return progress;
        },
        // 初始化视频可播放区域
        initVideoTimes(){
            this.videoTimes.forEach(item => {
                let begin = this.timeToProgress(item.beginTime);
                let end = this.timeToProgress(item.endTime);
                item.width = (end - begin) + '%';
                item.left = begin + '%';
            })
            console.log(this.videoTimes)
            this.$forceUpdate();
        },
        // 检查该时间是否有视频录像
        checkHaveVideo(time){
            let dateTimeStr = `${this.info.date} ${time}`;
            let dateTime = new Date(dateTimeStr).getTime();
            let isHave = false;
            this.videoTimes.forEach(item => {
                let begin = new Date(item.beginTime).getTime();
                let end = new Date(item.endTime).getTime();
                if(dateTime >= begin && dateTime <= end) isHave = true;
            })
            if(isHave){
                return true
            }else{
                this.$message.error("此时间段没有录像，请重新选择。")
                return false
            }
        },
        // 播放
        async play() {
            let { deviceSerial, verifyCode, channelNo } = this.videoData;
            let _this = this;
            this.player && this.player.play('player', {
                streamURL: _this.streamURL,
                deviceId: deviceSerial,
                channelId: String(channelNo - 1),
                bitStream: 0,
                isLive: _this.islive,
            })
            this.isplay = true;
        },
        playProgressUpdate(id,msg) {
            if(this.isMove) return;
            const timeMoveView = document.getElementById('timeMoveView');
            let width = timeMoveView.clientWidth;
            this.cursorPoi = this.timeToProgress(msg.utcTime)/100 * width + this.moveLeft;
        },
        playError(id, msg) {
            // this.isplay = false;
            // this.$message.error('连接失败，请重试。');
            console.log(`-----------${id}Window playback failed-------:`, msg)
        },
        playFileOver(id) {
            // this.isplay = false;
            // this.$message.error('连接失败，请重试。');
            console.log(`-----------${id}End of window playback-------`)
        },
        talkStart(id) {
            console.log(`----------${id}Window open intercom-----------`)
        },
        close(){
            this.isplay = false;
            this.player.close("player");
        },
        download() {

        },
        fullScreen() {
            this.isFullScreen = !this.isFullScreen;
        },
        screenshot() {
            this.player && this.player.screenshot('player')
        },
        downloadInit() {
            let _this = this;
            if (!_this.isDownloading) {
                const params = {
                    deviceId: playConfigs.value.deviceId,
                    channelId: playConfigs.value.channelId,
                    businessType: playConfigs.value.businessType,
                    beginTime: playConfigs.value.beginTime,
                    endTime: playConfigs.value.endTime,
                    streamType: playConfigs.value.streamType,
                    protoType: playConfigs.value.protoType,
                    encryptMode: playConfigs.value.encryptMode,
                    assistStream: playConfigs.value.assistStream ? '1' : '0',
                    devCode: aesEncrypt(playConfigs.value.devCode, playConfigs.value.sk, '86E2DB6D77B5E9CD'),
                    accessKey: playConfigs.value.accessKey,
                }
                return new Promise((resolve) => {
                    isGetUrl.value = true
                    openApiFetch(
                        '/open-api/api-iot/device/createDeviceStreamUrl',
                        playConfigs.value.accessKey,
                        playConfigs.value.sk,
                        playConfigs.value.productId,
                        playConfigs.value.appAccessToken,
                        params,
                    )
                        .then((data) => {
                            const url = data.data && data.data.url
                            if (url) {
                                message.info('录像下载开始...')
                                _this.isDownloading = true
                                downloadURL.value = url
                                _this.player &&
                                    _this.player.download('player', {
                                        streamURL: downloadURL.value,
                                        deviceId: playConfigs.value.deviceId,
                                        channelId: playConfigs.value.channelId,
                                        bitStream: playConfigs.value.streamType,
                                        isLive: !!isLive.value,
                                    })
                                resolve()
                            } else {
                                const errMsg = data.code == 'DV1019' ? '设备能力级不支持！' : '获取流地址失败'
                                reject(errMsg)
                            }
                            isGetUrl.value = false
                        })
                        .catch(() => {
                            isGetUrl.value = false
                        })
                })
            } else {
                message.info('录像下载中...')
            }
        },
    },
}