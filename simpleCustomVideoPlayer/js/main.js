document.addEventListener("DOMContentLoaded", function () {
    initialiseMediaPlayer();
}, false);

var mediaPlayer,
    muteBtn,
    progressBar;

function initialiseMediaPlayer() {
    mediaPlayer = document.getElementById('media-video');
    mediaPlayer.controls = false;

    muteBtn = document.getElementById('mute-button');
    videoOverlay = document.getElementById('video-overlay');
    likeBtn = document.getElementById("like-button");
    unlikeBtn = document.getElementById("unlike-button");
    videoTitle = document.getElementById("video-title");
    activeVideo = document.querySelector('.activeVideo');
    playListItem = document.getElementsByClassName("play-item");

    progressBar = document.getElementById('progress-bar');

    mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
    mediaPlayer.addEventListener('ended', function () {
        this.pause();
    }, false);
    for (var i = 0; i < playListItem.length; i++) {
        playListItem[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("activeVideo");
            current[0].className = current[0].className.replace(" activeVideo", "");
            this.className += " activeVideo";
            activeVideo = document.querySelector('.activeVideo');
            videoTitle.innerText = this.innerText;
            setCounts();
        });

    }
    var videoList = [];
    for (var i = 0; i < document.querySelectorAll('.play-item').length; i++) {
        var videoid = document.querySelectorAll('.play-item')[i].dataset.videoid;
        if (localStorage.getItem(videoid) == null) {
            videoList[i] = new likeUnlikeVideoObj(0, 0);
            localStorage.setItem(videoid, JSON.stringify(videoList[i]));
        } else {
            setCounts();
        }
    }

}

function disableBtnToggle(btn, val) {
    document.getElementById(btn).disabled = val;
}


function togglePlayPause() {
    if (mediaPlayer.paused || mediaPlayer.ended) {
        playVideo();
        videoOverlay.classList.remove('overlay');
    } else {
        pauseVideo();
        videoOverlay.className += ' overlay';
    }
}

function playVideo() {
    if (mediaPlayer.paused || mediaPlayer.ended) {
        disableBtnToggle('play-button', true);
        disableBtnToggle('pause-button', false);
        mediaPlayer.play();
    }
}

function pauseVideo() {
    disableBtnToggle('play-button', false);
    disableBtnToggle('pause-button', true);
    mediaPlayer.pause();
}

function changeVolume(direction) {
    if (direction === '+') mediaPlayer.volume += mediaPlayer.volume == 1 ? 0 : 0.1;
    else mediaPlayer.volume -= (mediaPlayer.volume == 0 ? 0 : 0.1);
    mediaPlayer.volume = parseFloat(mediaPlayer.volume).toFixed(1);
}

function toggleMute() {
    if (mediaPlayer.muted) {
        mediaPlayer.muted = false;
        muteBtn.className = 'unmute';
        muteBtn.title = 'Mute';
    } else {
        mediaPlayer.muted = true;
        muteBtn.className = 'mute';
        muteBtn.title = 'UnMute';
    }
}

function replayMedia() {
    resetPlayer();
    mediaPlayer.play();
}

function updateProgressBar() {
    try {
        var percentage = Math.floor((100 / mediaPlayer.duration) * mediaPlayer.currentTime);
        progressBar.value = percentage;
        progressBar.innerHTML = percentage + '% played';
    } catch (e) {

    }
}

function changeButtonType(btn, value) {
    btn.title = value;
    btn.innerHTML = value;
    btn.className = value;
}

function loadVideo() {
    for (var i = 0; i < arguments.length; i++) {
        var file = arguments[i].split('.');
        var ext = file[file.length - 1];
        if (canPlayVideo(ext)) {
            resetPlayer();
            mediaPlayer.src = arguments[i];
            mediaPlayer.load();
            togglePlayPause();
            break;
        }
    }
}

function canPlayVideo(ext) {
    var ableToPlay = mediaPlayer.canPlayType('video/' + ext);
    if (ableToPlay == '') return false;
    else return true;
}

function resetPlayer() {
    progressBar.value = 0;
    mediaPlayer.currentTime = 0;
    disableBtnToggle('play-button', true);
    disableBtnToggle('pause-button', false);
}

function likeUnlikeVideoObj(likeCount, dislikeCount, videoID) {
    this.likes = likeCount;
    this.dislikes = dislikeCount;
    // this.videoid = videoID;
}

function getActiveVideo() {
    return activeVideo.dataset.videoid;
}

function likeUnlikeVideo(localStore, actionType) {
    var likeElem = document.querySelectorAll('.like span')[0];
    var dislikeElem = document.querySelectorAll('.dislike span')[0];
    if (actionType === 'like') {
        if (localStore === 'set') {
            var likeCount = parseInt(likeElem.innerText) + 1;
            likeElem.innerText = likeCount;
        }
    } else if (actionType === 'dislike') {
        if (localStore === 'set') {
            var unlikeCount = parseInt(dislikeElem.innerText) + 1;
            dislikeElem.innerText = unlikeCount;
        }
    }

    var video = new likeUnlikeVideoObj(likeElem.innerText, dislikeElem.innerText);
    localStorage.setItem(getActiveVideo(), JSON.stringify(video));
}

function setCounts() {
    var likeElem = document.querySelectorAll('.like span')[0];
    var dislikeElem = document.querySelectorAll('.dislike span')[0];
    likeElem.innerText = JSON.parse(localStorage.getItem(getActiveVideo())).likes;
    dislikeElem.innerText = JSON.parse(localStorage.getItem(getActiveVideo())).dislikes;
}