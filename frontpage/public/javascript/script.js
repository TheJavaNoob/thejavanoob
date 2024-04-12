var headerHeight;
var screenHeight;
var listStart;
var lineHeight;
var scrollStart;
var auto = true;
$(document).ready(function () {
	headerHeight = document.querySelector(".picker-container").offsetTop;
	screenHeight = document.querySelector("#content-about").offsetTop;
	listStart = document.querySelector('#li-development').offsetTop;
	lineHeight = document.querySelector('#li-research').offsetTop - listStart;
	scrollStart = document.querySelector(".picker ul").scrollTop;
	$(".picker ul").on("scroll", function () {
		var offset = $(this).scrollTop();
		document.querySelectorAll(".picker ul li").forEach(entry => {
			if (!auto && entry.offsetTop - listStart == offset - scrollStart) {
				document.querySelector("#content-" + entry.id.substring(3)).scrollIntoView({
					behavior: "smooth"
				});
			}
		});
	});
	headerDisplayEntries = document.querySelectorAll(".header-display-entry");
	currentHeaderDisplayEntry = Math.floor(Math.random() * headerDisplayEntries.length);
	document.querySelectorAll(".header-display-entry").forEach((entry, i) => {
		var newPosition = i - currentHeaderDisplayEntry + "00%"
		// Change position over 1 second
		entry.style.transform = "translateX(" + newPosition + ")";
	});
	setInterval(moveRight, 15000);
});

$(window).resize(function () {
	screenHeight = document.querySelector("#content-about").offsetTop;
	listStart = document.querySelector('#li-development').offsetTop;
	lineHeight = document.querySelector('#li-research').offsetTop - listStart;
	scrollStart = document.querySelector(".picker ul").scrollTop % lineHeight;
});
var cont_prev;
$(window).scroll(function () {
	var scrollTop = document.body.scrollTop;
	var delta = (scrollTop - screenHeight);

	var delta_cap = (delta - screenHeight * 0.5) / (screenHeight * 0.2);
	if (delta_cap > 1) delta_cap = 1;
	if (delta_cap < 0) delta_cap = 0;
	$(".picker").css({
		width: (delta_cap * 8) + "em",
		
	});
	$(".picker img").css({
		transform: "scaleX(" + delta_cap + ")"
	});
	if (scrollTop < headerHeight) {
		$(".picker-container").css({
			position: "absolute",
			bottom: "0px",
			top: "initial"
		})
	} else {
		$(".picker-container").css({
			position: "fixed",
			top: "0px",
			bottom: "initial"
		});

		document.querySelectorAll('.content').forEach(content => {
			if (content.offsetTop > scrollTop && content.offsetTop < scrollTop + screenHeight * 0.5) {
				if (cont_prev != content.id) {
					auto = true;
					cont_prev = content.id;
					if (content.id.substring(8) == "about") return;
					document.querySelector(".picker ul").scrollTo({
						top: document.querySelector("#li-" + content.id.substring(8)).offsetTop - listStart + scrollStart,
						behavior: 'smooth'
					});
					setTimeout(() => {
						auto = false;
					}, 500);
				}
			}
		});
	}
});

var currentHeaderDisplayEntry = 0;

function moveLeft(){
	if(currentHeaderDisplayEntry == 0){
		currentHeaderDisplayEntry = headerDisplayEntries.length - 1;
	}else{
		currentHeaderDisplayEntry--;
	}
	updateHeaderDisplay();
}

function moveRight(){
	if(currentHeaderDisplayEntry == headerDisplayEntries.length - 1){
		currentHeaderDisplayEntry = 0;
	}else{
		currentHeaderDisplayEntry++;
	}
	updateHeaderDisplay();
}

function updateHeaderDisplay(){
	document.querySelectorAll(".header-display-entry").forEach((entry, i) => {
		var newPosition = i - currentHeaderDisplayEntry + "00%"
		// Change position over 1 second
		entry.style.transform = "translateX(" + newPosition + ")";
		entry.style.transition = "transform 1s";
	});
}