/*
 * 안녕하세요 코드팩토리입니다. http://codefactory.kr, [프로그램 개발문의] master@codefactory.kr
 * 이 프로그램은 아무런 제약없이 복사/수정/재배포 하셔도 되며 주석을 지우셔도 됩니다.
 * 감사합니다.
 */

// 모바일기기에서 사용자의 touch swipe 모션에 callback을 사용할 수 있게 해주는 jQuery Plugin 입니다.

;(function($, window, document, undefined) {
	
	// plugin 이름, default option 설정
	var pluginName = 'cfTouchSwipe',
		defaults = {
			minSwipeLength: 50,		// 사용자가 swipe 했다고 판단하는 최소 거리
			minMoveLength: 15,		// 이 거리보다 작게 움직이고 triggerClick = true 이면 click 이벤트 trigger
			triggerClick: true,
			preventDefault: true,	// touchstart, touchmove 이벤트에 대해 preventDefault 할지 여부
			swipeLeft: null,		// swipe callback
			swipeRight: null,		// swipe callback
			swipeUp: null,			// swipe callback
			swipeDown: null			// swipe callback
		};
		
	// touch event 관련 변수
	var startX = 0,
		startY = 0,
		curX = 0,
		curY = 0,
		isMoving = false,
		startTime = null,
		endTime = null,
		touchedElement = null,		// touch가 발생한 element, triggerClick 할 때 사용됨
		swipeAngle = null,			// swipe 각도, 이 것을 바탕으로 left, right, down, up을 설정
		swipeDirection = null,		// swipe 방향
		touchEventEnabled = !! ('ontouchstart' in document.documentElement);	// touch event 지원 여부
		
	// plugin constructor
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		
		this._defaults = defaults;
		this._name = pluginName;
		
		this.init();
	}
	
	// initialization logic
	Plugin.prototype.init = function() {
		
		var $this = $(this.element);
		
		if (touchEventEnabled) {	// touch event를 지원하는 브라우저에서는 touch event에 리스너 등록
			$this.bind('touchstart', {element: this.element, options: this.options}, onTouchStart);
			$this.bind('touchmove', {element: this.element, options: this.options}, onTouchMove);
			$this.bind('touchend', {element: this.element, options: this.options}, onTouchEnd);
		} else {		// 그렇지 않은 브라우저에서는 mouse event에 리스너 등록
			$this.bind('mousedown', {element: this.element, options: this.options}, onTouchStart);
			$this.bind('mousemove', {element: this.element, options: this.options}, onTouchMove);
			$this.bind('mouseup', {element: this.element, options: this.options}, onTouchEnd);
		}
		
	};
	
	// 사용자가 터치를 시작했을 때 호출
	function onTouchStart(e) {
		
		var options = e.data.options;
		
		if (options.preventDefault) {
			e.preventDefault();
		}
		
		if (touchEventEnabled) {	// touch event 지원 브라우저
			
			// 한 손가락으 이벤트에 대해서만 처리, gesture는 처리 안함
			if (e.originalEvent.touches.length != 1) {
				return;
			}
			
			var touch = e.originalEvent.touches[0];
			
			startTime = new Date().getTime();
			startX = curX = touch.pageX;
			startY = curY = touch.pageY;
			isMoving = true;
			touchedElement = e.target;
			
		} else {	// touch event 미지원 브라우저
			
			startTime = new Date().getTime();
			startX = curX = e.pageX;
			startY = curY = e.pageY;
			isMoving = true;
			touchedElement = e.target;
			
		}
		
	};
	
	// 사용자가 터치를 움직이고 있을 때 호출
	function onTouchMove(e) {
		
		var options = e.data.options;
		
		if (options.preventDefault) {
			e.preventDefault();
		}
		
		if (touchEventEnabled) {	// touch event 지원 브라우저
			
			// 한 손가락으 이벤트에 대해서만 처리, gesture는 처리 안함
			if (e.originalEvent.touches.length != 1) {
				return;
			}
			
			var touch = e.originalEvent.touches[0];
				
			if (isMoving) {
				curX = touch.pageX;
				curY = touch.pageY;
			}
			
		} else {	// touch event 미지원 브라우저
			
			if (isMoving) {
				curX = e.pageX;
				curY = e.pageY;
			}
			
		}
	};
	
	// 사용자가 터치를 종료했을 때 호출
	function onTouchEnd(e) {
		runTouchSwipe(e);
		resetTouch();
	};
	
	// touch event 관련 정보를 초기화
	function resetTouch() {
		startX = 0;
		startY = 0;
		curX = 0;
		curY = 0;
		isMoving = false;
		startTime = null;
		endTime = null;
		touchedElement = null;
		swipeAngle = null;
		swipeDirection = null;
	}
	
	// 사용자의 touch 이동을 계산하여 swipe 판단 후 callback 실행
	function runTouchSwipe(e) {
		endTime = new Date().getTime();
		
		var options = e.data.options,
			elapsedTime = endTime - startTime,
			deltaX = curX - startX,
			deltaY = curY - startY,
			distX = Math.abs(deltaX),
			distY = Math.abs(deltaY),
			swipeLength = Math.round(Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)));
		
		// triggerClick = true이고 사용자가 touchmove한 거리가 options.minMoveLength 보다 작고,touch한 시간이 200millisecond 보다 작을 때 touchedElement에 click 이벤트 trigger
		if (options.triggerClick && distX < options.minMoveLength && distY < options.minMoveLength && elapsedTime < 200) {
			$(touchedElement).click();
			return;
		}
		
		// 사용자가 swipe한 거리가 options.minSwipeLength 보다 작을 때에는 처리 안함
		if (swipeLength < options.minSwipeLength) {
			return;
		}
		
		// 각도 계산
		var radian = Math.atan2(curY - startY, startX - curX);
		swipeAngle = Math.round(radian * 180 / Math.PI);
		if (swipeAngle < 0) {
			swipeAngle = 360 - Math.abs(swipeAngle);
		}
		
		// 각도를 바탕으로 swipe 방향 설정
		if (swipeAngle <=45 && swipeAngle >= 0) {
			swipeDirection = 'left';
		} else if (swipeAngle <= 360 && swipeAngle >=315) {
			swipeDirection = 'left';
		} else if (swipeAngle >= 135 && swipeAngle <= 225) {
			swipeDirection = 'right';
		} else if (swipeAngle > 45 && swipeAngle < 135) {
			swipeDirection = 'down';
		} else {
			swipeDirection = 'up';
		}
		
		// swipe 방향에 따른 callback이 있는지 검사하고 있으면 실행시킴
		switch (swipeDirection) {
			case 'left':
				if (options.swipeLeft && typeof options.swipeLeft === 'function') options.swipeLeft();
				break;
				
			case 'right':
				if (options.swipeRight && typeof options.swipeRight === 'function') options.swipeRight();
				break;
				
			case 'down':
				if (options.swipeDown && typeof options.swipeDown === 'function') options.swipeDown();
				break;
				
			case 'up':
				if (options.swipeUp && typeof options.swipeUp === 'function') options.swipeUp();
				break;
		}
	}
	
	// jQuery 객체와 element의 data에 plugin을 넣음
	$.fn[pluginName] = function(options) {
		
		return this.each(function() {
			
			if ( ! $.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
			
		});
		
	};
	
})(jQuery, window, document);
