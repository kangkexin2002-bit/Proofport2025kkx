document.addEventListener('DOMContentLoaded', function() {

    const textSteps = [
        { text: "Not every proof", bgColor: "#005AFF", textColor: "#00FF00" },     
        { text: "lives in papers", bgColor: "#FEFE00", textColor: "#FF8E00" },     
        { text: "sometimes", bgColor: "#8F00D5", textColor: "#FF00FF" },          
        { text: "it's in the quiet traces", bgColor: "#FF8E00", textColor: "#FEFE00" },  
        { text: "only you can see", bgColor: "#FF00FF", textColor: "#8F00D5" },    
        { text: "PROOFPORT", bgColor: "#00FF00", textColor: "#005AFF" }            
    ];

    let currentStep = 0;
    const interactiveBtn = document.getElementById('interactiveBtn');
    const customCursor = document.getElementById('customCursor');

    let allImagesFlown = false;

    function updateButtonState() {
        const step = textSteps[currentStep];
        interactiveBtn.textContent = step.text;
        interactiveBtn.style.backgroundColor = step.bgColor;
        interactiveBtn.style.color = step.textColor;

        if (currentStep < textSteps.length - 1) {
            interactiveBtn.className = 'interactive-text-btn cursor-click';
        } else {

            interactiveBtn.className = 'interactive-text-btn cursor-go';
        }
    }

    updateButtonState();

    function updateCursorPosition(e) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    }

    document.addEventListener('mousemove', updateCursorPosition);

    interactiveBtn.addEventListener('mouseenter', function() {
        const clickIcon = customCursor.querySelector('.click-icon');
        const goIcon = customCursor.querySelector('.go-icon');

        if (currentStep < textSteps.length - 1) {
            customCursor.className = 'custom-cursor show';
            clickIcon.style.display = 'block';
            goIcon.style.display = 'none';
        } else {
            customCursor.className = 'custom-cursor show';
            clickIcon.style.display = 'none';
            goIcon.style.display = 'block';
        }
        this.style.cursor = 'none';
    });

    interactiveBtn.addEventListener('mouseleave', function() {
        customCursor.classList.remove('show');
        this.style.cursor = 'pointer';
    });

    const allImages = document.querySelectorAll('.receipt-img, .digital-img');
    let flyingCount = 0;

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
        const containerRect = img.closest('.container').getBoundingClientRect();

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
        flyingCount++;

        setTimeout(() => {
            img.classList.remove('flying');
            img.style.transform = targetTransform;
        }, 800);

        if (flyingCount >= allImages.length) {
            allImagesFlown = true;
        }
    }

    interactiveBtn.addEventListener('click', function() {
        if (currentStep < textSteps.length - 1) {
            currentStep++;
            updateButtonState();

            if (interactiveBtn.matches(':hover')) {
                const clickIcon = customCursor.querySelector('.click-icon');
                const goIcon = customCursor.querySelector('.go-icon');

                if (currentStep < textSteps.length - 1) {
                    customCursor.className = 'custom-cursor show';
                    clickIcon.style.display = 'block';
                    goIcon.style.display = 'none';
                } else {
                    customCursor.className = 'custom-cursor show';
                    clickIcon.style.display = 'none';
                    goIcon.style.display = 'block';
                }
            }
        } else {

            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '0';

            setTimeout(() => {
                window.location.href = 'home.html';
            }, 500);
        }
    });

    setTimeout(() => {
        allImages.forEach((img, index) => {
            setTimeout(() => {
                img.style.transform += ' scale(1.05)';
                setTimeout(() => {
                    img.style.transform = img.style.transform.replace(' scale(1.05)', '');
                }, 200);
            }, index * 100);
        });
    }, 2000);
});