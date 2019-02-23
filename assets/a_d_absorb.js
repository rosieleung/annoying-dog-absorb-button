jQuery(function () {
	const $dogtrigger = jQuery("#footer-logo");
	if ( $dogtrigger.length ) {

		const body = jQuery('body');
		let yardInstalled = false;
		let dogs;
		let $yard;
		let dogFlipNow = 0;
		let dogFlipLater = 0;

		// add dog on every trigger click
		$dogtrigger.click(deployDog);

		// start absorption process on click of anything besides trigger
		body.on('click', '#yard', function () {
			if ( body.hasClass("absorbing") ) {
				return false;
			}

			body.addClass("absorbing");

			// define dog flip settings based on their current positions
			let d = new Date();
			setDogFlip(d.getTime());

			// give dogs 2 sec to converge to center and then start moving offscreen
			setTimeout(function () {

				// dog absorbs website and exits stage right
				beginAbsorption();

				// after absorption, remove yard and reset page
				setTimeout(endAbsorption, 4200);
			}, 2000);

		});

		function deployDog() {
			// on first click, install a yard for dogs to bounce in
			if ( yardInstalled === false ) {
				$yard = jQuery('<div id="yard"></div>');
				body.addClass("enhanced").append($yard);
				yardInstalled = true;
			}

			// each dog starts at the bottom of the screen but at a random horizontal point
			let dogDelay = -Math.random() * 10;
			let d = new Date();
			let startTime = d.getTime() + Number(dogDelay) * 1000;
			$yard.append(jQuery('<div class="dog" style="animation-delay: ' + dogDelay + 's" data-starttime=' + startTime + '><img draggable="false" src="/wp-content/plugins/annoying-dog-absorb/assets/annoyingdog.gif" alt=""></div>'));
		}

		function setDogFlip( now ) {
			dogs = $yard.children('.dog');
			dogs.each(function ( i ) {

				// flip each dog so it faces the center
				let elapsed = (now - Number(jQuery(this).data("starttime"))) / 1000;
				elapsed = elapsed % 10;
				if ( elapsed > 2.5 && elapsed < 5 || elapsed > 7.5 ) {
					jQuery(this).children("img").css("transform", "scaleX(-1)");
				}

				// define flip settings for the first dog; the other dogs will be removed
				// (I have no idea why these settings work but they do ¯\_(ツ)_/¯)
				if ( i === 0 ) {
					if ( elapsed < 2.5 || elapsed >= 7.5 ) {
						dogFlipNow = -1;
					} else {
						dogFlipNow = 1;
						dogFlipLater = -1;
					}
				}

			});
		}

		function beginAbsorption() {

			// fix the document height and prevent scrolling so user can't mess anything up
			body.addClass("moving-offscreen").css("min-height", jQuery(document).height());
			disableScrolling();

			// set the center of the viewport as the transform origin for .site's scale effect
			const $site = jQuery(".site");
			let verticalCenter = jQuery(window).scrollTop() + Math.floor(window.innerHeight / 2);
			let siteTop = $site.offset().top;
			let siteHeight = $site.height();
			let percent = (verticalCenter - siteTop) / siteHeight * 100;
			$site.css("transform-origin", "50% " + percent + "%");

			// remove surplus dogs and extra transforms
			dogs.not(":first-child").remove();
			dogs.children("img").css("transform", "none");

			// potentially flip dog now
			if ( dogFlipNow !== 0 ) {
				dogs.css("transform", "scaleX(" + dogFlipNow + ")");
			}

			// potentially flip dog later
			if ( dogFlipLater !== 0 ) {
				setTimeout(function () {
					dogs.css("transform", "scaleX(" + dogFlipLater + ")");
				}, 1200);
			}
		}

		function endAbsorption() {
			// reset everything
			$yard.remove();
			yardInstalled = false;
			body.removeClass("enhanced absorbing moving-offscreen").css("min-height", '');
			enableScrolling();
		}

		function disableScrolling() {
			let x = window.scrollX;
			let y = window.scrollY;
			window.onscroll = function () {
				window.scrollTo(x, y);
			};
		}

		function enableScrolling() {
			window.onscroll = function () {
			};
		}

	}
});