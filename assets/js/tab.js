'use strict'

document.addEventListener('DOMContentLoaded', function(){
    tab.init();
});

// tab ui
let tab = (function(){
    let el, btnEl, layer;
    let idx;

    function init(){
        el = document.querySelector('.tab-module');
        btnEl = el.querySelectorAll('.btn');
        layer = el.querySelectorAll('.tab-layer');

        bindEvent();
    }

    function bindEvent(){
        clickEvent();
    }

    function setStyle(){
        // layer
    }

    function clickEvent(){
        
        [].forEach.call(btnEl, function(e){ 
            e.addEventListener("click", function(){
                idx = getElementIndex(btnEl, e);
                console.log(btnEl)
                for(let i = 0 ; layer.length > i; i++){
                    layer[i].classList.remove('on');
                }
                layer[idx].classList.add('on');
            }); 
        });
        function getElementIndex(e, range) {
            if (!!range) return [].indexOf.call(e, range);
            return [].indexOf.call(e.parentNode.children, e);
        }
    }

    return{init:init}
})();

