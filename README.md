안녕하세요 코드팩토리입니다. http://codefactory.kr, [프로그램 개발문의] master@codefactory.kr

이 프로그램은 아무런 제약없이 복사/수정/재배포 하셔도 되며 주석을 지우셔도 됩니다.
감사합니다.

## 소개
모바일기기에서 사용자의 touch swipe 모션에 callback을 사용할 수 있게 해주는 jQuery Plugin 입니다.
touch event를 지원하지 않는 브라우저(PC 등)에서는 touch event대신 mouse 이벤트를 사용합니다.

[데모보기] http://codefactory.kr/demos/cftouchswipe


## 사용방법
swipe 모션을 사용하고자 하는 엘리먼트의 id가 box이고 왼쪽 방향으로 swipe 할 때 callback을 주고 싶다면 아래와 같이 하면 됩니다.

```js
$('#box').cfTouchSwipe({
	swipeLeft: function() {
		alert('왼쪽으로 swipe');
	}
});
```

##### 참고
어떤 엘리먼트에 cfTouchSwipe를 적용하면 그 엘리먼트 안에서 일어나는 touch 이벤트에 대해 디폴트로 preventDefault 처리를 합니다. 그래서 엘리먼트 안에 있는 링크가 클릭이 안될 수도 있지만 triggerClick 옵션을 true로 설정하면 이와 같은 문제를 해결할 수 있습니다.


## 옵션들
cfTouchSwipe의 적용가능 옵션은 아래와 같습니다.

```js
$('#box').cfTouchSwipe({
	minSwipeLength: 50,		// 사용자가 swipe 했다고 판단하는 최소 거리
	minMoveLength: 15,		// 이 거리보다 작게 움직이고 triggerClick = true 이면 click 이벤트 trigger
	triggerClick: true,		// triggerClick false 일 경우 click 이벤트가 발생하지 않음
	preventDefault: true,		// touchstart, touchmove 이벤트에 대해 preventDefault 할지 여부
	swipeLeft: null,		// swipe callback
	swipeRight: null,		// swipe callback
	swipeUp: null,			// swipe callback
	swipeDown: null			// swipe callback
});
```
