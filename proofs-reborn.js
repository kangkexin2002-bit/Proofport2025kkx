const asciiImages = [
    'ascii图01.png', 'ascii图02.png', 'ascii图03.png', 'ascii图04.png', 'ascii图05.png',
    'ascii图06.png', 'ascii图07.png', 'ascii图08.png', 'ascii图09.png', 'ascii图10.png',
    'ascii图11.png', 'ascii图12.png', 'ascii图13.png', 'ascii图14.png', 'ascii图15.png',
    'ascii图16.png', 'ascii图17.png', 'ascii图18.png', 'ascii图19.png', 'ascii图20.png',
    'ascii图21.png', 'ascii图22.png', 'ascii图23.png', 'ascii图24.png', 'ascii图25.png',
    'ascii图26.png', 'ascii图27.png', 'ascii图28.png', 'ascii图29.png', 'ascii图30.png'
];

const YOUTUBE_URL = "https://youtu.be/pGp7doMYN9Q?si=V35qiG1kW6wU1T-8"; 

let asciiImageElements = [];
let isMouseOverVideo = false;
let customCursor = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeAsciiImages();
    initializeVideoArea();
    initializeCustomCursor();
    initializeNavigation();
    initializeYellowOverlay();

    window.addEventListener('resize', function() {
        asciiImageElements.forEach((img, index) => {
            positionAsciiImage(img, index);
        });

        setTimeout(() => {
            validateAndFixOverlaps();
        }, 100);
    });
});

function initializeAsciiImages() {
    const container = document.getElementById('asciiContainer');

    asciiImages.forEach((imageName, index) => {
        const img = document.createElement('img');
        img.src = `B页Proofs-Reborn页图片，文案，字体，指引/B页image/${imageName}`;
        img.className = 'ascii-image';
        img.alt = `ASCII图 ${index + 1}`;

        positionAsciiImage(img, index);
        img.style.opacity = '0'; 

        container.appendChild(img);
        asciiImageElements.push(img);
    });

    validateAndFixOverlaps();

    console.log(`Initialized ${asciiImageElements.length} ASCII images with overlap validation`);
}

function positionAsciiImage(img, index) {
    const imageSize = 400; 
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const maxX = screenWidth - imageSize;
    const maxY = screenHeight - imageSize;

    const overlapFactor = 0.7; 
    const cols = Math.ceil(screenWidth / (imageSize * overlapFactor));
    const rows = Math.ceil(screenHeight / (imageSize * overlapFactor));

    let x, y;
    let attempts = 0;
    const maxAttempts = 20; 

    do {
        if (index < 16) {

            const gridIndex = getOptimalGridIndex(index, cols, rows);
            const col = gridIndex % cols;
            const row = Math.floor(gridIndex / cols);

            const baseX = col * (imageSize * overlapFactor);
            const baseY = row * (imageSize * overlapFactor);

            const offsetX = (Math.random() - 0.5) * imageSize * 0.1;
            const offsetY = (Math.random() - 0.5) * imageSize * 0.1;

            x = baseX + offsetX;
            y = baseY + offsetY;
        } else {

            x = Math.random() * maxX;
            y = Math.random() * maxY;
        }

        x = Math.max(0, Math.min(maxX, x));
        y = Math.max(0, Math.min(maxY, y));

        attempts++;
    } while (hasSignificantOverlap(x, y, imageSize) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
        const { sectorX, sectorY } = getSectorPosition(index, imageSize, screenWidth, screenHeight);
        x = Math.max(0, Math.min(maxX, sectorX));
        y = Math.max(0, Math.min(maxY, sectorY));
    }

    img.style.left = x + 'px';
    img.style.top = y + 'px';
}

function getOptimalGridIndex(index, cols, rows) {

    const strategicPositions = [

        Math.floor(rows/2) * cols + Math.floor(cols/2),

        0, cols-1, (rows-1)*cols, (rows-1)*cols + cols-1,

        Math.floor(cols/2), 
        (rows-1)*cols + Math.floor(cols/2), 
        Math.floor(rows/2) * cols, 
        Math.floor(rows/2) * cols + cols-1, 

        Math.floor(rows/4) * cols + Math.floor(cols/4), 
        Math.floor(rows/4) * cols + Math.floor(3*cols/4), 
        Math.floor(3*rows/4) * cols + Math.floor(cols/4), 
        Math.floor(3*rows/4) * cols + Math.floor(3*cols/4), 
    ];

    if (index < strategicPositions.length) {
        return strategicPositions[index] % (cols * rows);
    }

    const step = Math.floor((cols * rows) / 30);
    return (index * step) % (cols * rows);
}

function getSectorPosition(index, imageSize, screenWidth, screenHeight) {
    const sector = index % 9; 
    const sectorWidth = (screenWidth - imageSize) / 3;
    const sectorHeight = (screenHeight - imageSize) / 3;

    const sectorCol = sector % 3;
    const sectorRow = Math.floor(sector / 3);

    const sectorX = sectorCol * sectorWidth + Math.random() * sectorWidth;
    const sectorY = sectorRow * sectorHeight + Math.random() * sectorHeight;

    return { sectorX, sectorY };
}

function hasSignificantOverlap(x, y, imageSize) {

    for (let i = 0; i < asciiImageElements.length; i++) {
        const existingImg = asciiImageElements[i];

        if (!existingImg.style.left || !existingImg.style.top) {
            continue;
        }

        const existingX = parseInt(existingImg.style.left);
        const existingY = parseInt(existingImg.style.top);

        const overlapLeft = Math.max(x, existingX);
        const overlapTop = Math.max(y, existingY);
        const overlapRight = Math.min(x + imageSize, existingX + imageSize);
        const overlapBottom = Math.min(y + imageSize, existingY + imageSize);

        if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
            const overlapWidth = overlapRight - overlapLeft;
            const overlapHeight = overlapBottom - overlapTop;
            const overlapArea = overlapWidth * overlapHeight;
            const imageArea = imageSize * imageSize;

            const overlapPercentage = overlapArea / imageArea;

            if (overlapPercentage > 0.15) {
                console.log(`Rejecting position (${x}, ${y}) due to ${(overlapPercentage * 100).toFixed(1)}% overlap with image ${i}`);
                return true;
            }
        }
    }

    return false;
}

function validateAndFixOverlaps() {
    const imageSize = 400;
    const maxX = window.innerWidth - imageSize;
    const maxY = window.innerHeight - imageSize;

    for (let i = 0; i < asciiImageElements.length; i++) {
        for (let j = i + 1; j < asciiImageElements.length; j++) {
            const img1 = asciiImageElements[i];
            const img2 = asciiImageElements[j];

            if (!img1.style.left || !img2.style.left) continue;

            const x1 = parseInt(img1.style.left);
            const y1 = parseInt(img1.style.top);
            const x2 = parseInt(img2.style.left);
            const y2 = parseInt(img2.style.top);

            const overlapLeft = Math.max(x1, x2);
            const overlapTop = Math.max(y1, y2);
            const overlapRight = Math.min(x1 + imageSize, x2 + imageSize);
            const overlapBottom = Math.min(y1 + imageSize, y2 + imageSize);

            if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
                const overlapWidth = overlapRight - overlapLeft;
                const overlapHeight = overlapBottom - overlapTop;
                const overlapArea = overlapWidth * overlapHeight;
                const imageArea = imageSize * imageSize;
                const overlapPercentage = overlapArea / imageArea;

                if (overlapPercentage > 0.15) {
                    console.log(`Fixing excessive overlap (${(overlapPercentage * 100).toFixed(1)}%) between image ${i} and ${j}`);

                    let attempts = 0;
                    let newX, newY;

                    do {

                        const sector = j % 9;
                        const sectorWidth = maxX / 3;
                        const sectorHeight = maxY / 3;
                        const sectorCol = sector % 3;
                        const sectorRow = Math.floor(sector / 3);

                        newX = sectorCol * sectorWidth + Math.random() * sectorWidth;
                        newY = sectorRow * sectorHeight + Math.random() * sectorHeight;

                        newX = Math.max(0, Math.min(maxX, newX));
                        newY = Math.max(0, Math.min(maxY, newY));

                        attempts++;
                    } while (wouldOverlapWithOthers(newX, newY, j, imageSize) && attempts < 15);

                    img2.style.left = newX + 'px';
                    img2.style.top = newY + 'px';
                }
            }
        }
    }
}

function wouldOverlapWithOthers(x, y, excludeIndex, imageSize) {
    for (let i = 0; i < asciiImageElements.length; i++) {
        if (i === excludeIndex) continue;

        const existingImg = asciiImageElements[i];
        if (!existingImg.style.left) continue;

        const existingX = parseInt(existingImg.style.left);
        const existingY = parseInt(existingImg.style.top);

        const overlapLeft = Math.max(x, existingX);
        const overlapTop = Math.max(y, existingY);
        const overlapRight = Math.min(x + imageSize, existingX + imageSize);
        const overlapBottom = Math.min(y + imageSize, existingY + imageSize);

        if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
            const overlapWidth = overlapRight - overlapLeft;
            const overlapHeight = overlapBottom - overlapTop;
            const overlapArea = overlapWidth * overlapHeight;
            const imageArea = imageSize * imageSize;
            const overlapPercentage = overlapArea / imageArea;

            if (overlapPercentage > 0.15) {
                return true;
            }
        }
    }

    return false;
}

function initializeVideoArea() {
    const videoFrame = document.getElementById('videoFrame');

    videoFrame.addEventListener('mouseenter', function() {
        isMouseOverVideo = true;
        customCursor.classList.add('show');
        showAllAsciiImages();
    });

    videoFrame.addEventListener('mouseleave', function() {
        isMouseOverVideo = false;
        customCursor.classList.remove('show');
        hideAllAsciiImages();
    });

    videoFrame.addEventListener('click', function() {
        window.open(YOUTUBE_URL, '_blank');
    });
}

function showAllAsciiImages() {

    asciiImageElements.forEach((img, index) => {
        setTimeout(() => {
            if (isMouseOverVideo) {
                img.style.opacity = '1';
            }
        }, index * 200); 
    });
}

function hideAllAsciiImages() {
    asciiImageElements.forEach((img, index) => {
        setTimeout(() => {
            img.style.opacity = '0';
        }, index * 200); 
    });
}

function initializeCustomCursor() {
    customCursor = document.getElementById('customCursor');

    document.addEventListener('mousemove', function(e) {
        if (customCursor) {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        }
    });
}

function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navDropdown = document.getElementById('navDropdown');
    const navOptions = document.querySelectorAll('.nav-option');

    navToggle.addEventListener('click', function() {
        navDropdown.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('active');
        }
    });

    navOptions.forEach(option => {
        option.addEventListener('click', function() {
            const state = this.dataset.state;

            navOptions.forEach(opt => opt.classList.remove('active'));

            this.classList.add('active');

            switch(state) {
                case 'home':
                    window.location.href = 'home.html';
                    break;
                case 'proofs-in-time':
                    window.location.href = 'proofs-in-time.html';
                    break;
                case 'proofs-reborn':

                    break;
                case 'ports-of-proof':
                    window.location.href = 'ports-of-proof.html';
                    break;
            }

            navDropdown.classList.remove('active');
        });
    });
}

function initializeYellowOverlay() {
    const yellowTextOverlay = document.getElementById('yellowTextOverlay');
    const yellowTextContent = document.querySelector('.yellow-text-content');
    let scrollAccumulation = 0;
    const scrollThreshold = 100;

    document.addEventListener('wheel', function(e) {

        e.preventDefault();
        scrollAccumulation += e.deltaY;

        if (scrollAccumulation > scrollThreshold) {
            yellowTextOverlay.classList.add('scroll-active');
            scrollAccumulation = 0;
        } else if (scrollAccumulation < -scrollThreshold) {
            yellowTextOverlay.classList.remove('scroll-active');
            scrollAccumulation = 0;
        }
    }, { passive: false });

    yellowTextOverlay.addEventListener('click', function() {
        this.classList.remove('scroll-active');
    });

    yellowTextContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            yellowTextOverlay.classList.remove('scroll-active');
        }
        if (e.code === 'Space') {
            e.preventDefault();
            yellowTextOverlay.classList.toggle('scroll-active');
        }
    });

}