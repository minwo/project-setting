'use strict'

document.addEventListener('DOMContentLoaded', function(){
    swipeTest.init();
});

var swipeTest = (function(){
    var el, movingEl, itemEl, btnPrev, btnNext;
    var swipeWidth, swipeContWidth, duration, current, trick, lgt, prevClone, nextClone, clickDelay;

    function init(){
        el = document.querySelector('.swiper-comn');
        movingEl = el.querySelector('.swiper-wrap');
        itemEl = el.querySelectorAll('.item');
        btnPrev = el.querySelector('.btn-prev');
        btnNext = el.querySelector('.btn-next');

        lgt = itemEl.length;
        prevClone = itemEl[0].cloneNode(true);
        nextClone = itemEl[lgt-1].cloneNode(true);
        swipeWidth = itemEl[0].offsetWidth;
        swipeContWidth = swipeWidth * lgt;
        duration = 300;
        current = 1;
        clickDelay = true;
        
        bindEvent();
    }

    function bindEvent(){
        setEvent();
        clickEent();
    }

    function setEvent(){
        movingEl.style.width = swipeContWidth + 'px';
        movingEl.append(prevClone);
        movingEl.prepend(nextClone);
        moving(current,true)
    }

    function clickEent(){
        btnPrev.addEventListener('click', function(e){
            e.preventDefault();

            if(clickDelay){
                clickDelay = false;
                if(current === 0){
                    current = lgt;
                    moving(current,true);
                }
                current--;
                setTimeout(function(){
                    moving(current);
                });
                
                setTimeout(function(){
                    clickDelay = true;
                },duration);
            }
        });
        btnNext.addEventListener('click', function(e){
            e.preventDefault();

            if(clickDelay){
                clickDelay = false;
                if(current === lgt+1){
                    current = 0;
                    moving(current,true);
                }
                current++;
                setTimeout(function(){
                    moving(current);
                });

                setTimeout(function(){
                    clickDelay = true;
                },duration);
            }
        });
    }

    function moving(current,trick){
        if(trick){
            movingEl.style.transitionDuration  = 0+"ms";
            movingEl.style.transform = "translateX("+ -swipeWidth*current +"px)";
        } else {
            movingEl.style.transitionDuration  = duration+"ms";
            movingEl.style.transform = "translateX("+ -swipeWidth*current +"px)";
        }
    }

    return{init:init}
})();


