"use strict";

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

document.addEventListener("DOMContentLoaded", function () {
	initUi.setup();
});

// document.addEventListener("scroll", function () {});

// multi function
const initUi = (function () {
	let isLoaded, _inst;

	const setup = () => {
		if(isLoaded){
			return;
		}
		isLoaded = true;

		registUI("#header", headerPosi);
		registUI(".ui-tab", uiTab);
		registUI(".ui-accodion", uiAccodion);
		registUI(".ui-top", uiTop);
		// registUI(".ui-popup", uiPopup);

		uiPopup.init('.ui-popup');
	};

	const registUI = (el, fn) => {
		document.querySelectorAll(el).forEach((obj, idx) => {
			_inst = new fn();
			_inst.init(el, obj);
		});
	};

	return {
		setup: setup,
	};
})();

const getElIndex = (element, range) => {
	if (!!range) return [].indexOf.call(element, range);
	return [].indexOf.call(element.parentNode.children, element);
};

const fnMaxZIndex = () => {
	let els = [...document.querySelectorAll("body *")];
	let maxZindex = 1;

	els.forEach((el) => {
		let zIndex = document.defaultView.getComputedStyle(el, null).getPropertyValue("z-index");
		if (!isNaN(zIndex)) {
			maxZindex = maxZindex < zIndex ? zIndex : maxZindex;
		}
	});
	
	return Number(maxZindex);
};

const headerPosi = () => {
	let el, fixedEl;
	let _scrollTop, windowHeight;

	const init = (_el) => {
		el = document.querySelector(_el);
		fixedEl = el.querySelector('.head-cont');

		windowHeight = window.innerHeight;

		bindEvent();
	}

	const bindEvent = () => {
		setEvent();
		posiFn();
	}

	const setEvent = () => {
		document.addEventListener("DOMContentLoaded",posiFn)
		document.addEventListener("scroll",posiFn)
	}

	const posiFn = () => {
		_scrollTop = window.scrollY || document.documentElement.scrollTop;
		// console.log(_scrollTop);

		if(_scrollTop > 0){
			fixedEl.classList.add('fixed');
			if(_scrollTop >= windowHeight - 100){
				fixedEl.classList.add('active');
			} else {
				fixedEl.classList.remove('active');
			}
		} else if(_scrollTop == 0 && fixedEl.classList.contains('fixed')){
			fixedEl.classList.remove('fixed');
		}
	}

	return{init:init}
}

const uiTab = () => {
	let el, btnEl, layerEl, btnLength, lineEl;
	let i, idx;

	const init = (_el) => {
		el = document.querySelector(_el);
		btnEl = el.querySelectorAll(".btn");
		layerEl = el.querySelectorAll(".tab-layer");
		lineEl = el.querySelector('.line');
		
		btnLength = btnEl.length;
		
		setTimeout(function() {
			[].forEach.call(el.querySelectorAll('.item'), (obj, idx) => {
				if(obj.classList.contains('active')){
					lineEl.style.width = obj.offsetWidth + 'px';
					lineEl.style.left = obj.offsetLeft + 'px';
					lineEl.style.visibility = 'visible';
				}
			});
		}, 100);

		bindEvent();
	};
	const bindEvent = () => {
		clickEvent();
	};

	const clickEvent = () => {
		[].forEach.call(btnEl, (e) => {
			e.addEventListener("click", (event) => {
				event.preventDefault();
				idx = getElIndex(btnEl, e);
				lineEl.style.transition = 'all .3s ease-in-out';
				lineEl.style.width = e.offsetWidth + 'px';
				lineEl.style.left = e.offsetLeft + 'px';
				for (i = 0; i < btnLength; i++) {
					btnEl[i].closest('.item').classList.remove("active");
				}
				e.closest('.item').classList.add("active");
			});
		});
	};

	return {
		init: init,
	};
};

const uiAccodion = () => {
	let el, btnEl, layerEl, prevEl;
	let idx, layerLgt, duration, layerHeight, elCheck;

	const init = (_el) => {
		el = document.querySelector(_el);
		btnEl = el.querySelectorAll(".btn");
		layerEl = el.querySelectorAll(".layer");

		layerLgt = layerEl.length;
		duration = 300;

		bindEvent();
	};

	const bindEvent = () => {
		clickEvent();
	};

	const clickEvent = () => {
		[].forEach.call(btnEl, (e) => {
			e.addEventListener("click", (event) => {
				prevEl = layerEl[idx];
				event.preventDefault();
				idx = getElIndex(btnEl, e);
				elCheck = prevEl !== layerEl[idx] && prevEl !== undefined;

				if (!layerEl[idx].style.height) {
					if (elCheck) remove(prevEl);

					layerEl[idx].style.display = "block";
					layerHeight = layerEl[idx].clientHeight;
					layerEl[idx].style.height = "0";
					setTimeout(() => {
						layerEl[idx].style.height = layerHeight + "px";
					});
				} else {
					remove(layerEl[idx]);
				}
			});
		});

		const remove = (el) => {
			el.style.height = "0";
			setTimeout(() => {
				el.style = null;
			}, duration);
		};
	};

	return {
		init: init,
	};
};

const uiPopup = (() => {
	let btnEl, popWrap;
	let pageUrl;

	const init = (_btnEl) => {
		btnEl = document.querySelectorAll(_btnEl);
		
		bindEvent();
	}

	const bindEvent = () => {
		setUrl();
		// domLoad();
		clickEvent();
	}

	const setUrl = () => {
		// for(let i = 0; btnEl.length > i; i++){
		// 	console.log(i);
		// }
	}

	const domLoad = () => {


	}

	const clickEvent = () => {
		[].forEach.call(btnEl, (e) => {
			e.addEventListener("click", (event) => {
				event.preventDefault();
				
				const createEl = document.createElement('div');
				createEl.classList.add('ui-popup-wrap','is-active');
				document.querySelector('#wrap').append(createEl);
				popWrap = document.querySelector('.ui-popup-wrap');
				pageUrl = e.getAttribute('data-url');
				
				getPage();
			});
		});
	}

	const getPage = () => {
		fetch(pageUrl)
		.then(response => {
			if (response.ok) {
				return response.text();
			  }
			  throw new Error('Something went wrong');
		})
		.then(data =>{
			popWrap.innerHTML = data;

			document.addEventListener('click',function(e){
				if(e.target.closest('.popup-content') != e.currentTarget.querySelector('.popup-content')) {
					document.querySelector('.popup-container').style.display = "none";
					dimmEffect(false);
					setTimeout(function() {
						popWrap.remove();
					},300);
				}
			});

			dimmEffect(true, popWrap);
		})
		.catch((error) => {
			alert(error)
			console.log(error);
			// dimmEffect(false);
			popWrap.remove();
		});
	}

	return{init}
})()


// intersection observer
const changeNav = (entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
			entry.target.classList.add("is-inviewed");
		} 
		// else {
		// 	// entry.target.classList.remove("inview");
		// 	observer.unobserve(entry.target);
		// }
	});
};

const options = {
	threshold: 0.55,
};

const observer = new IntersectionObserver(changeNav, options);

document.addEventListener("DOMContentLoaded", function () {
	const sections = document.querySelectorAll(".js-inview");
	sections.forEach((obj) => {
		observer.observe(obj);
		//console.log(obj);
	});
});

const uiTop = () => {
	let el, wrapEl;
	let type1, _scrollTop, windowHeight, footerHeight, pageCheck;

	const init = (_el) => {
		el = document.querySelector(_el);
		wrapEl = document.querySelector('#wrap');

		pageCheck = wrapEl.classList.contains("main");
		windowHeight = window.innerHeight;
		footerHeight = document.querySelector('#footer').offsetHeight;

		bindEvents();
	}

	const bindEvents = () => {
		pageType();
	}

	const pageType = () => {
		if(pageCheck){
			scrollEvent(pageCheck);
		} else {
			scrollEvent(pageCheck);
		}
	}

	const scrollEvent = (pageCheck) => {
		window.addEventListener("scroll", e => {
			_scrollTop = window.scrollY || document.documentElement.scrollTop;
			type1 = window.pageYOffset + document.querySelector("#footer").getBoundingClientRect().top;
			
			if(pageCheck){
				if(type1 + footerHeight -100 <= _scrollTop + windowHeight){
					el.classList.add('active');
				} else {
					el.classList.remove('active');
				}
			} else {
				if(0 < _scrollTop){
					el.classList.add('active');
				} else {
					el.classList.remove('active');
				}
			}
		})
	}
	
	return{init:init}
}