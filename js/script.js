// 기본 스크롤 함수 정의
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const offset = 80; // 헤더 높이 고려
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('스크립트 로딩 완료');
    
    // 해시가 있으면 해당 요소로 스크롤
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        setTimeout(function() {
            scrollToElement(targetId);
        }, 300);
    }
    
    // 모든 앵커 링크에 클릭 이벤트 추가
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToElement(targetId);
        });
    });
    
    // 모바일 메뉴 토글
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // 토글 애니메이션
            const spans = menuToggle.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // 스크롤 애니메이션
    const scrollElements = document.querySelectorAll('.scroll-animation');
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8;
    }
    
    function handleScrollAnimation() {
        scrollElements.forEach(function(el) {
            if (isElementInViewport(el)) {
                el.classList.add('scrolled');
            }
        });
    }
    
    // 초기 로드 및 스크롤 시 애니메이션 처리
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation);

    // 갤러리 초기화
    const gallery = document.querySelector('.project-gallery');
    if (gallery) {
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;

        function createIndicators() {
            const items = gallery.querySelectorAll('.project-item');
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'gallery-indicators';
            
            items.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                if (index === 0) indicator.classList.add('active');
                indicatorsContainer.appendChild(indicator);
            });
            
            gallery.parentElement.appendChild(indicatorsContainer);
        }

        function updateGalleryWidth() {
            const items = gallery.querySelectorAll('.project-item');
            const totalWidth = Array.from(items).reduce((width, item) => {
                return width + item.offsetWidth + parseInt(getComputedStyle(item).marginRight);
            }, 0);
            gallery.style.width = `${totalWidth}px`;
        }

        function updateIndicators() {
            const items = gallery.querySelectorAll('.project-item');
            const galleryWidth = gallery.parentElement.offsetWidth;
            const currentIndex = Math.abs(Math.round(currentTranslate / (galleryWidth + 20))); // 20은 gap 크기

            document.querySelectorAll('.indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }

        function setSliderPosition() {
            gallery.style.transform = `translateX(${currentTranslate}px)`;
        }

        function touchStart(event) {
            const touch = event.type === 'touchstart' ? event.touches[0] : event;
            startPos = touch.clientX;
            isDragging = true;
            animationID = requestAnimationFrame(animation);
            gallery.style.cursor = 'grabbing';
        }

        function touchMove(event) {
            if (!isDragging) return;
            
            const touch = event.type === 'touchmove' ? event.touches[0] : event;
            const currentPosition = touch.clientX;
            const moveDistance = currentPosition - startPos;
            currentTranslate = prevTranslate + moveDistance;

            // 드래그 제한 설정
            const maxTranslate = 0;
            const minTranslate = -(gallery.scrollWidth - gallery.parentElement.offsetWidth);
            currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
            
            updateIndicators();
        }

        function touchEnd() {
            isDragging = false;
            cancelAnimationFrame(animationID);
            prevTranslate = currentTranslate;
            gallery.style.cursor = 'grab';
        }

        // 이벤트 리스너 등록
        gallery.addEventListener('touchstart', touchStart);
        gallery.addEventListener('touchmove', touchMove);
        gallery.addEventListener('touchend', touchEnd);
        gallery.addEventListener('mousedown', touchStart);
        gallery.addEventListener('mousemove', touchMove);
        gallery.addEventListener('mouseup', touchEnd);
        gallery.addEventListener('mouseleave', touchEnd);

        // 이미지 드래그 방지
        gallery.addEventListener('dragstart', (e) => e.preventDefault());

        // 초기화
        updateGalleryWidth();
        createIndicators();

        // 창 크기 변경 시 갤러리 너비 업데이트
        window.addEventListener('resize', () => {
            updateGalleryWidth();
            // 위치 재조정
            currentTranslate = 0;
            prevTranslate = 0;
            setSliderPosition();
            updateIndicators();
        });
    }

    // 이미지 드래그 방지
    document.querySelectorAll('.project-item img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
        img.addEventListener('mousedown', (e) => e.preventDefault());
    });

    // Swiper 초기화
    const swiper = new Swiper('.swiper', {
        // 기본 설정
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: false,
        grabCursor: true,
        
        // 반응형 설정
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            480: {
                slidesPerView: 1.5,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 2.5,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 3.5,
                spaceBetween: 20
            }
        },
        
        // 네비게이션 버튼
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // 페이지네이션
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // 키보드 컨트롤
        keyboard: {
            enabled: true,
        },
        
        // 마우스휠 컨트롤
        mousewheel: {
            invert: false,
        },
        
        // 자동 재생
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
    });
});

// 스크롤 시 헤더 스타일 변경
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.padding = '0.7rem 0';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
}); 