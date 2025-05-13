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