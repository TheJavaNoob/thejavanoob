var timeMarkers;
var timeStamps;
var textHeight;
// Indicator is the thing that moves
var playbackIndicator;
var audio;
var mainBody;

document.addEventListener('DOMContentLoaded', function () {
	textHeight = document.querySelector('.main-body').offsetHeight;
	timeMarkers = Array.from(document.querySelectorAll('.time-marker'));
	timeStamps = timeMarkers.map(function (marker) {
		// Convert from "(mm:ss)" to seconds
		return marker.innerText.slice(1, -1).split(':').reduce(function (acc, time) {
			return acc * 60 + parseInt(time);
		}, 0);
	});
	playbackIndicator = document.querySelector('#playback-indicator');
	audio = document.querySelector('audio');
	mainBody = document.querySelector('.main-body');
	timeMarkers.forEach(function (marker, index) {
		marker.addEventListener('click', function () {
			audio.currentTime = timeStamps[index];
			playbackIndicator.style.top = timeMarkers[index].offsetTop + 'px';
			playbackIndicator.style.left = timeMarkers[index].offsetLeft + 'px';
		});
	});
	updateIndicatorPosition();
	audio.addEventListener('timeupdate', function () {
		updateIndicatorPosition();
	});
});

window.addEventListener('resize', function () {
	updateIndicatorPosition();
});

function updateIndicatorPosition(){
	var currentTime = audio.currentTime;
	var index = timeStamps.findIndex(function (time) {
		return time > currentTime;
	});
	if (index === 0) {
		playbackIndicator.style.top = mainBody.offsetTop + 'px';
		playbackIndicator.style.left = mainBody.offsetLeft + 'px';
		return
	}else if (index === -1) {
		index = timeMarkers.length - 1;
	}else{
		index--;
	}
	playbackIndicator.style.top = timeMarkers[index].offsetTop + 'px';
	playbackIndicator.style.left = timeMarkers[index].offsetLeft + 'px';
}