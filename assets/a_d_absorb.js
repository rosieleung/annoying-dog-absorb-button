if (document.readyState !== 'loading') {
	init_annoying_dogs()
} else {
	document.addEventListener('DOMContentLoaded', init_annoying_dogs);
}


function init_annoying_dogs() {
	const $dogTrigger = document.getElementById("footer-logo");
	if (!$dogTrigger) return;

	let dogFlip,
		dogWrapperId = "dogs",
		$dogWrapper = initDogWrapper(dogWrapperId),
		classDogsAbsorbing = "absorbing",
		classDogEscaping = "escaping";

	// add dog on every trigger click
	$dogTrigger.addEventListener("click", deployDog);

	function initDogWrapper(yardId) {
		let yard = document.createElement("div");
		yard.id = yardId;
		return yard
	}

	function deployDog() {
		maybeAddWrapper();
		appendDog();
	}

	function maybeAddWrapper() {
		if (!document.getElementById(dogWrapperId)) {
			document.body.appendChild($dogWrapper);
			$dogWrapper.addEventListener("click", absorbWebsite);
		}
	}

	function appendDog() {
		// each dog starts at a random horizontal point at the the bottom of the screen, via negative animation-delay
		let dogDelay = -Math.random() * 10,
			now = new Date().getTime() / 1000,
			startTime = now + dogDelay,
			dogWrapper = document.createElement('template');
		dogWrapper.innerHTML = '<div class="dog" style="animation-delay: ' + dogDelay + 's" data-animation-start=' + startTime + '>' +
			'<img draggable="false" src="/wp-content/plugins/annoying-dog-absorb/assets/annoyingdog.gif" alt="">' +
			'</div>';
		$dogWrapper.appendChild(dogWrapper.content.firstChild);
	}

	function absorbWebsite() {
		// can't add more dogs or absorb again
		$dogTrigger.removeEventListener("click", deployDog);
		$dogWrapper.removeEventListener("click", absorbWebsite);

		// temporarily disable scrolling
		disableScroll();

		// summon dogs to center of viewport
		document.body.classList.add(classDogsAbsorbing);

		// flip dogs to match direction of travel
		flipDogs();

		// wait 2 seconds for dogs to converge
		setTimeout(function () {

			// first dog absorbs website and exits stage right
			beginAbsorption();

			// after absorption, remove yard and reset page
			setTimeout(endAbsorption, 4200);
		}, 2000);
	}

	function flipDogs() {
		let now = new Date().getTime() / 1000,
			isFirstDog = true;

		$dogWrapper.querySelectorAll(".dog").forEach(dog => {
			// based on the elapsed time, figure out which direction each dog is traveling and flip it so it faces the center
			let elapsed = now - Number(dog.getAttribute("data-animation-start"));
			elapsed = elapsed % 10;
			if (elapsed > 2.5 && elapsed < 5 || elapsed > 7.5) {
				dog.firstChild.style.transform = "scaleX(-1)";
			}

			// define special flip settings for the first dog, who will do the absorption (the other dogs will be removed)
			// I have no idea why these settings work ¯\_(ツ)_/¯
			if (isFirstDog) {
				dogFlip = (elapsed < 2.5 || elapsed > 7.5) ? -1 : 1;
				isFirstDog = false;
			}
		});
	}

	function beginAbsorption() {
		let pageHeight = document.getElementById("page").offsetHeight;

		// fix the document height
		document.body.classList.add(classDogEscaping)
		document.body.style.minHeight = pageHeight + "px";

		// set the center of the viewport as the transform origin for .site's scale effect
		let verticalCenter = window.scrollY + window.innerHeight / 2,
			percent = verticalCenter / pageHeight * 100;
		document.getElementById("page").style.transformOrigin = "50% " + percent + "%";

		let isFirstDog = true;
		$dogWrapper.querySelectorAll(".dog").forEach(dog => {
			if (isFirstDog) {
				// remove extra transforms from the img
				dog.firstChild.style.transform = "none";

				// potentially flip dog now
				dog.style.transform = "scaleX(" + dogFlip + ")";

				// potentially flip dog later
				if (dogFlip === 1) {
					setTimeout(function () {
						dog.style.transform = "scaleX(-1)";
					}, 1200);
				}

				isFirstDog = false;
			} else {
				// remove surplus dogs
				dog.remove();
			}
		});
	}

	function endAbsorption() {
		// reset everything
		$dogWrapper.firstChild.remove();
		$dogWrapper.remove();
		document.body.classList.remove(classDogsAbsorbing, classDogEscaping);
		document.body.style.minHeight = "";
		enableScroll();
		$dogTrigger.addEventListener("click", deployDog);
	}


	/*
	 * stop user from scrolling, props to https://stackoverflow.com/a/4770179
	 */

	// modern Chrome requires { passive: false } when adding event
	let supportsPassive = false;
	try {
		window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
			get: function () {
				supportsPassive = true;
			}
		}));
	} catch (e) {
	}

	let wheelOpt = supportsPassive ? {passive: false} : false;
	let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

	function preventDefault(e) {
		e.preventDefault();
	}

	function preventDefaultForScrollKeys(e) {
		let keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1};
		if (keys[e.keyCode]) {
			preventDefault(e);
			return false;
		}
	}

	function disableScroll() {
		window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
		window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
		window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
		window.addEventListener('keydown', preventDefaultForScrollKeys, false);
	}

	function enableScroll() {
		window.removeEventListener('DOMMouseScroll', preventDefault, false);
		window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
		window.removeEventListener('touchmove', preventDefault, wheelOpt);
		window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
	}
}
