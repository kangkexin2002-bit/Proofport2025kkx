document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const blueTextOverlay = document.getElementById('blueTextOverlay');
    const allImages = document.querySelectorAll('.bg-receipt-img, .bg-digital-img');
    const homeMain = document.querySelector('.home-main');
    const homeTitle = document.querySelector('.home-title');
    const hasHover = window.matchMedia('(hover: hover)').matches;
    allImages.forEach(img => {
        if (hasHover) {
            img.addEventListener('mouseenter', function() {
                if (!this.classList.contains('flying') && !this.classList.contains('bouncing')) {
                    flyImage(this);
                }
            });
        } else {
            img.addEventListener('click', function() {
                if (!this.classList.contains('flying') && !this.classList.contains('bouncing')) {
                    flyImage(this);
                }
            });
        }
    });
    function flyImage(img) {
        if (img.classList.contains('flying')) {
            return;
        }
        const rect = img.getBoundingClientRect();
        const containerRect = img.closest('.home-main').getBoundingClientRect();
        const currentStyle = img.style.transform || '';
        let currentRotation = '';
        let currentX = 0, currentY = 0;
        const rotateMatch = currentStyle.match(/rotate\([^)]+\)/);
        if (rotateMatch) {
            currentRotation = rotateMatch[0];
        }
        const translateXMatch = currentStyle.match(/translateX\(([^)]+)\)/);
        const translateYMatch = currentStyle.match(/translateY\(([^)]+)\)/);
        if (translateXMatch) currentX = parseFloat(translateXMatch[1]);
        if (translateYMatch) currentY = parseFloat(translateYMatch[1]);
        const distanceToLeft = rect.left - containerRect.left;
        const distanceToRight = containerRect.right - rect.right;
        const distanceToTop = rect.top - containerRect.top;
        const distanceToBottom = containerRect.bottom - rect.bottom;
        const edgeThreshold = 100;
        const moveDistance = 200;
        const maxLeft = Math.min(moveDistance, Math.max(0, distanceToLeft - 20));
        const maxRight = Math.min(moveDistance, Math.max(0, distanceToRight - 20));
        const maxUp = Math.min(moveDistance, Math.max(0, distanceToTop - 20));
        const maxDown = Math.min(moveDistance, Math.max(0, distanceToBottom - 20));
        let possibleDirections = [];
        if (maxRight > 0 && maxUp > 0) possibleDirections.push({ x: maxRight, y: -maxUp }); 
        if (maxUp > 0) possibleDirections.push({ x: 0, y: -maxUp }); 
        if (maxLeft > 0 && maxUp > 0) possibleDirections.push({ x: -maxLeft, y: -maxUp }); 
        if (maxRight > 0) possibleDirections.push({ x: maxRight, y: 0 }); 
        if (maxLeft > 0) possibleDirections.push({ x: -maxLeft, y: 0 }); 
        if (maxRight > 0 && maxDown > 0) possibleDirections.push({ x: maxRight, y: maxDown }); 
        if (maxDown > 0) possibleDirections.push({ x: 0, y: maxDown }); 
        if (maxLeft > 0 && maxDown > 0) possibleDirections.push({ x: -maxLeft, y: maxDown }); 
        if (possibleDirections.length === 0) {
            return;
        }
        const randomDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        const targetX = currentX + randomDirection.x;
        const targetY = currentY + randomDirection.y;
        const currentTransform = currentRotation + (currentX !== 0 || currentY !== 0 ? ` translateX(${currentX}px) translateY(${currentY}px)` : '');
        const targetTransform = currentRotation + ` translateX(${targetX}px) translateY(${targetY}px)`;
        img.style.setProperty('--current-transform', currentTransform);
        img.style.setProperty('--target-transform', targetTransform);
        img.classList.add('flying');
        setTimeout(() => {
            img.classList.remove('flying');
            img.style.transform = targetTransform;
        }, 800);
    }
    const pageUrls = [
        'proofs-in-time.html',    
        'proofs-reborn.html',     
        'ports-of-proof.html'     
    ];
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const targetUrl = pageUrls[index];
            const pageNames = ['Proofs in Time', 'Proofs Reborn', 'Ports of Proof'];
            if (index === 0 || index === 1 || index === 2) {
                window.location.href = targetUrl;
            } else {
                alert(`即将跳转�?${pageNames[index]} 页面\n目标文件: ${targetUrl}\n\n这里是占位符，后续会创建实际页面。`);
            }
        });
    });
    let scrollAccumulation = 0;
    const scrollThreshold = 100; 
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
        scrollAccumulation += e.deltaY;
        if (scrollAccumulation > scrollThreshold) {
            blueTextOverlay.classList.add('scroll-active');
            scrollAccumulation = 0;
        } else if (scrollAccumulation < -scrollThreshold) {
            blueTextOverlay.classList.remove('scroll-active');
            scrollAccumulation = 0;
        }
    }, { passive: false });
    blueTextOverlay.addEventListener('click', function() {
        this.classList.remove('scroll-active');
    });
    document.querySelector('.blue-text-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            blueTextOverlay.classList.remove('scroll-active');
        }
        if (e.code === 'Space') {
            e.preventDefault();
            blueTextOverlay.classList.toggle('scroll-active');
        }
    });

    function addSubtleMovement() {
        allImages.forEach((img, index) => {
            setTimeout(() => {
                if (!img.classList.contains('flying') && !img.classList.contains('bouncing')) {
                    const currentTransform = img.style.transform;
                    const randomX = (Math.random() - 0.5) * 10; 
                    const randomY = (Math.random() - 0.5) * 10; 
                    img.style.transform = currentTransform + ` translate(${randomX}px, ${randomY}px)`;
                    setTimeout(() => {
                        img.style.transform = currentTransform;
                    }, 1000);
                }
            }, index * 200);
        });
    }
    setInterval(addSubtleMovement, 5000);
    setTimeout(addSubtleMovement, 2000);
});