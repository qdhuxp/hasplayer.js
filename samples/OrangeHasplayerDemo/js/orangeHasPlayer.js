    var config,
        configMetrics = {
            "name": "csQoE (local)",
            "activationUrl": "http://localhost:8080/config",
            "serverUrl": "http://localhost:8080/metrics",
            "dbServerUrl": "http://localhost:8080/metricsDB",
            "collector": "HasPlayerCollector",
            "formatter": "CSQoE",
            "sendingTime": 10000
        };
    /********************************************************************************************************************
    *
    *
    *                  Init functions
    *
    *
    **********************************************************************************************************************/

    function createHasPlayer() {
        orangeHasPlayer = new OrangeHasPlayer();
        orangeHasPlayer.init(video);
        loadHasPlayerConfig('hasplayer_config.json');
        orangeHasPlayer.loadMetricsAgent(configMetrics);

        orangeHasPlayer.setDefaultAudioLang('deu');
        orangeHasPlayer.setDefaultSubtitleLang('fre');

        registerHasPlayerEvents();
    };

    function registerHasPlayerEvents() {
        orangeHasPlayer.addEventListener("error", onError);
        orangeHasPlayer.addEventListener("subtitlesStyleChanged", onSubtitlesStyleChanged);
        orangeHasPlayer.addEventListener("loadeddata", onload);
        orangeHasPlayer.addEventListener("play_bitrate", onPlayBitrateChanged);
        orangeHasPlayer.addEventListener("download_bitrate", onDownloadBitrateChanged);
        orangeHasPlayer.addEventListener("volumechange", onVolumeChange);
        orangeHasPlayer.addEventListener("play", onPlay);
        orangeHasPlayer.addEventListener("pause", onPause);
        orangeHasPlayer.addEventListener("timeupdate", onTimeUpdate);
    };

    function loadHasPlayerConfig(fileUrl) {
        var reqConfig = new XMLHttpRequest();

        reqConfig.onload = function() {
            if (reqConfig.status === 200) {
                config = JSON.parse(reqConfig.responseText);
                if (orangeHasPlayer && config) {
                    orangeHasPlayer.setParams(config);
                }
            }
        };

        reqConfig.open("GET", fileUrl, true);
        reqConfig.setRequestHeader("Content-type", "application/json");
        reqConfig.send();
    };

    /********************************************************************************************************************
    *
    *
    *                   OrangeHasPlayer Events
    *
    *
    **********************************************************************************************************************/
    function onload() {
        //handle onload events to get audio, subtitles tracks
        //init audio tracks
        handleAudioDatas(orangeHasPlayer.getAudioTracks(), orangeHasPlayer.getSelectedAudioTrack());
        //init subtitle tracks
        handleSubtitleDatas(orangeHasPlayer.getSubtitleTracks(), orangeHasPlayer.getSelectedSubtitleTrack());
        //init duration value for VOD content
        handleDuration(orangeHasPlayer.getDuration());
        //init bitrates graph
        handleBitrates(orangeHasPlayer.getVideoBitrates());
    };

    function onSubtitlesStyleChanged(style) {
        handleSubtitleStyleChange(style);
    };

    function onError(e) {
        handleError(e);
    };

    function onPlayBitrateChanged(e) {
        //$scope.playVideoBitrate = e.detail.bitrate/1000;
        handlePlayBitrate(e.detail.bitrate, e.detail.time);
    };

    function onDownloadBitrateChanged(e){
        handleDownloadedBitrate(e.detail.bitrate, e.detail.time);
    };

    function onVolumeChange() {

    };

    function onPlay() {
        handlePlayState(true);
    };

    function onPause() {
        handlePlayState(false);
    };

    function onTimeUpdate(){
        //update progress bar in GUI.
        if (!orangeHasPlayer.isLive()) {
            handleTimeUpdate(video.currentTime);
        }

        handleGraphUpdate(video.currentTime);
    };
    
    /********************************************************************************************************************
    *
    *
    *                   OrangeHasPlayer function calls
    *
    *
    **********************************************************************************************************************/
    function loadStream(streamInfos) {
        orangeHasPlayer.load(streamInfos.url, streamInfos.protData);
    };

    function changeAudio(index) {
        orangeHasPlayer.setAudioTrack(audioTracks[index]);
    };

    function changeSubtitle() {
        orangeHasPlayer.setSubtitleTrack(subtitleTracks[subtitleList.selectedIndex]);
    };

    function setPlayerMute() {
        orangeHasPlayer.setMute(!orangeHasPlayer.getMute());
    };

    function changePlayerState() {
        if (video.paused) {
            orangeHasPlayer.play();
        }
        else{
            orangeHasPlayer.pause();
        }
    };

    function setSeekValue(seekTime) {
        orangeHasPlayer.seek(seekTime);
    };
    /**********************************************************************************************************************/