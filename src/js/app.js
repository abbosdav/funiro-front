import * as abcFunctions from "./modules/functions.js"

abcFunctions.isWebp();
abcFunctions.ibg();

// ===================================================
const spollersArray = document.querySelectorAll("[data-spollers]");

if(spollersArray.length > 0){

    //  For simple spollers

    const spollersRegular = Array.from(spollersArray).filter(function filtred(item, index, self){
           return !item.dataset.spollers.split(",")[0];
        }
    )
    if (spollersRegular.length > 0){
        initSpollers(spollersRegular)
    };


    //  For media spollers

    const spollersMedia = Array.from(spollersArray).filter(function(item, index, self){
        return item.dataset.spollers.split(",")[0];
    });
    
    if(spollersMedia.length > 0){
        const breakpointsArray = [];
        spollersMedia.forEach(item =>{
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint)
        })
    
        // Unit breakpoint
    
        let mediaQueries = breakpointsArray.map(function(item){
            return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
        })
    
        mediaQueries = mediaQueries.filter(function(item, index, self){
            return self.indexOf(item) === index
        })
        
    
        // Works breakpoints
    
        mediaQueries.forEach(breakpoint =>{
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);


            const spollersArray = breakpointsArray.filter(function(item){
                if(item.value === mediaBreakpoint && item.type === mediaType){
                    return true;
                }
            })
            // cobitie
    
            matchMedia.addListener(function(){
                initSpollers(spollersArray, matchMedia);
            })
            initSpollers(spollersArray, matchMedia);
        });
    }

    // Initing

    function initSpollers(spollersArray, matchMedia = false){
        spollersArray.forEach(spollersBlock =>{
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if(matchMedia.matches || !matchMedia){
                spollersBlock.classList.add("init");
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);
            }
            else{
                spollersBlock.classList.remove("init");
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        })
    }

    // Work width contents

    function initSpollerBody(spollersBlock, hideSpollerBody = true){
        const spollerTitles = document.querySelectorAll("[data-spoller]");

        if(spollerTitles.length > 0){
            spollerTitles.forEach(spollerTitle =>{
                if(hideSpollerBody){
                    spollerTitle.removeAttribute('tabindex');
                    if(!spollerTitle.classList.contains("active")){
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                }
                else{
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            })
        }
    }
    // Spoller action

    function setSpollerAction (e){
        const el = e.target;
        if(el.hasAttribute('[data-spoller]') || el.closest('[data-spoller]')){
            const spollerTitle = el.hasAttribute('[data-spoller]') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spoller]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            
            if(!spollersBlock.querySelectorAll('.slide').length){
                if(oneSpoller && !spollerTitle.classList.contains('active')){
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('active');
                slideToggle(spollerTitle.nextElementSibling, 500)
            }
            e.preventDefault();
        }
    }

    function hideSpollersBody(spollersBlock){
        const spollersActiveTitle = spollersBlock.querySelector('[data-spoller].active');
        if(spollersActiveTitle){
            spollersActiveTitle.classList.remove('active');
            slideUp(spollerTitle.nextElementSibling, 500)
        }
    }
}

// Slide toggle
let slideUp = (target, duration=500) =>{
    if(!target.classList.contains('slide')){
        target.classList.add('slide');
        target.style.transitionProperty = 'all','height','margin','padding';
        target.style.transitionDuration = duration +'ms';
        target.style.height = target.offsetHeight + 'px';
        // target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginBottom = 0;
        target.style.marginTop = 0;
        window.setTimeout(() =>{
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('slide');
        }, duration);
    }
}

let slideDown = (target, duration) =>{
    if(!target.classList.contains('slide')){
        target.classList.add('slide');
        if(target.hidden){
            target.hidden = false
        };

        let height =target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight
        target.style.transitionProperty = 'height','margin','padding';
        target.style.transitionDuration = duration+'ms';
        target.style.height = height + 'px';
        
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() =>{
            target.style.removeProperty('padding-top');
        }, 30)
        
        window.setTimeout(() =>{
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('slide');
        }, duration)
    }
}

let slideToggle = (target, duration = 500) => {
    if(target.hidden){
        return slideDown(target, duration);
    }
    else{
        return slideUp(target, duration);
    }
}

//====================================================

window.onload = () =>{
    document.addEventListener('click', documentActions)

    function documentActions(e){
        let targetElement = e.target;
        if(window.innerWidth > 768 && abcFunctions.isMobile.any()){
            if(targetElement.classList.contains('menu__arrow')){
                targetElement.closest('.menu__item').classList.toggle('_hover')
            }
            if(!targetElement.classList.contains('menu__arrow') && document.querySelector('.menu__item._hover')){
                Array.from(document.querySelectorAll('.menu__item._hover')).forEach(item =>{
                    item.classList.remove('_hover')
                })
            }
        }
        if(targetElement.classList.contains('search-form__icon')){
            document.querySelector('.search-form').classList.toggle('_active')
        }
        // else if(!targetElement.classList.closest('.search-form') && document.querySelector('.search-form._active')){
        //     document.querySelector('.search-form').classList.remove('_active')
        // }
    }
}
