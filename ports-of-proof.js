const objectImages = [
    '物品-01.png', '物品-02.png', '物品-03.png', '物品-04.png',
    '物品-05.png', '物品-06.png', '物品-07.png', '物品-08.png',
    '物品-09.png', '物品-10.png', '物品-11.png', '物品-12.png',
    '物品-13.png', '物品-14.png', '物品-15.png', '物品-16.png'
];

const proofImages = [
    'Proofport-01.png', 'Proofport-02.png', 'Proofport-03.png', 'Proofport-04.png',
    'Proofport-05.png', 'Proofport-06.png', 'Proofport-07.png', 'Proofport-08.png',
    'Proofport-09.png', 'Proofport-10.png', 'Proofport-11.png', 'Proofport-12.png',
    'Proofport-13.png', 'Proofport-14.png', 'Proofport-15.png', 'Proofport-16.png'
];

const passportData = [
    { id: 1, name: "S ev en", proof: "Yo Shi tomo N ara" },
    { id: 2, name: "Ga o", proof: "Pea r pas  te" },
    { id: 3, name: "V iole  t", proof: "C am era" },
    { id: 4, name: "Frani", proof: "Perfume plus personal scent" },
    { id: 5, name: "Ro  my", proof: "Ar  mani My Wa y" },
    { id: 6, name: "j  ie", proof: "Hear tbe at" },
    { id: 7, name: "31", proof: "Dormito  ry k ey" },
    { id: 8, name: "404", proof: "I tash a" },
    { id: 9, name: "Se awe  ed", proof: "M y fun  ny soul" },
    { id: 10, name: "Mi gz", proof: "I dairy c  ow" },
    { id: 11, name: "Gag a", proof: "M y curly ha  ir" },
    { id: 12, name: "Li z i", proof: "Cat Di u" },
    { id: 13, name: "R e ika Shi  nizu", proof: "Goods" },
    { id: 14, name: "Be iShang S  haohu a", proof: "La panth e re" },
    { id: 15, name: "K ather  in e", proof: "E-c igar  ettes" },
    { id: 16, name: "Lu c y", proof: "Glas se s " }
];

const fixedImagePositions = [
    { index: 0, x: 40, y: 37, size: 397 },
    { index: 1, x: 389, y: 59, size: 397 },
    { index: 2, x: 452, y: 793, size: 397 },
    { index: 3, x: 964, y: 94, size: 397 },
    { index: 4, x: 106, y: 395, size: 397 },
    { index: 5, x: 444, y: 432, size: 397 },
    { index: 6, x: 1020, y: 452, size: 397 },
    { index: 7, x: 876, y: 788, size: 397 },
    { index: 8, x: 262, y: 1253, size: 397 },
    { index: 9, x: 106, y: 716, size: 397 },
    { index: 10, x: 732, y: 555, size: 397 },
    { index: 11, x: 78, y: 1028, size: 397 },
    { index: 12, x: 547, y: 1084, size: 397 },
    { index: 13, x: 665, y: 205, size: 397 },
    { index: 14, x: 938, y: 1055, size: 397 },
    { index: 15, x: 679, y: 1274, size: 397 }
];

let placedImages = []; 
let fixedRandomPositions = [];
let isDragging = false;
let draggingIndex = -1;
let dragOffset = { x: 0, y: 0 }; 

function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateFixedRandomPositions() {

    fixedRandomPositions = [];

    const objectsContainer = document.getElementById('objectsContainer');
    const containerRect = objectsContainer ? objectsContainer.getBoundingClientRect() : 
                         { width: window.innerWidth - 40, height: window.innerHeight - 200 };

    const containerHeight = Math.max(containerRect.height, 400);
    const containerWidth = Math.max(containerRect.width, 300);

    const isMobile = window.innerWidth <= 768;
    const isExtraSmall = window.innerWidth <= 480;

    let imageSize, spacing, margin;
    if (isExtraSmall) {
        imageSize = 315;  
        spacing = 36;     
        margin = 45;      
    } else if (isMobile) {
        imageSize = 405;  
        spacing = 54;     
        margin = 68;      
    } else {

        const availableWidth = containerWidth - 180; 
        const availableHeight = containerHeight - 180;

        const idealSize = 450; 
        const maxImageSizeByWidth = Math.floor(availableWidth / 5) - 30; 
        const maxImageSizeByHeight = Math.floor(availableHeight / 4) - 30; 

        const maxPossibleSize = Math.min(maxImageSizeByWidth, maxImageSizeByHeight);

        if (maxPossibleSize < idealSize) {
            imageSize = Math.max(270, maxPossibleSize * 1.5); 
            spacing = Math.max(33, Math.floor(imageSize * 0.15)); 
        } else {
            imageSize = idealSize;  
            spacing = 68;           
        }
        margin = 90; 
    }

    imageSize = Math.floor(imageSize * 1.3);
    spacing = Math.floor(spacing * 1.3);

    console.log(`Free layout: Container ${containerWidth}x${containerHeight}, Image size: ${imageSize}px, Spacing: ${spacing}px`);

    try {
        const saved = JSON.parse(localStorage.getItem('pop_positions'));
        if (Array.isArray(saved) && saved.length === 16) {
            fixedRandomPositions = saved.map(p => ({ x: p.x, y: p.y, size: imageSize }));
            console.log('Loaded manual positions from localStorage.');
            return;
        }
    } catch (e) {
        console.warn('Failed to parse saved positions, will generate freely.');
    }

    const positions = [];
    const padding = Math.max(8, Math.floor(imageSize * 0.05));
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    for (let i = 0; i < 16; i++) {
        let attempts = 0;
        const maxAttempts = 200;
        let x = 0, y = 0;
        do {
            const rx = seededRandom(i * 97 + attempts * 13);
            const ry = seededRandom(i * 131 + attempts * 17);
            x = clamp(margin + rx * (containerWidth - imageSize - margin * 2), margin, containerWidth - imageSize - margin);
            y = clamp(margin + ry * (containerHeight - imageSize - margin * 2), margin, containerHeight - imageSize - margin);
            attempts++;
        } while (positions.some(p => {
            const xOverlap = !(x + imageSize + padding <= p.x || x >= p.x + p.size + padding);
            const yOverlap = !(y + imageSize + padding <= p.y || y >= p.y + p.size + padding);
            return xOverlap && yOverlap;
        }) && attempts < maxAttempts);

        positions.push({ x, y, size: imageSize });
        console.log(`Free position ${i + 1}: (${x.toFixed(1)}, ${y.toFixed(1)})`);
    }

    fixedRandomPositions = positions;
    console.log(`Generated ${fixedRandomPositions.length} free layout positions (draggable).`);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeFixedLayout(); 
    initializeNavigation();
    initializePurpleOverlay();
    initializeModal();

    window.addEventListener('resize', function() {
        setTimeout(() => {

            initializeFixedLayout();
        }, 300);
    });
});

function calculateRequiredHeight() {
    let maxBottomY = 0;

    fixedImagePositions.forEach((pos, index) => {
        const bottomY = pos.y + pos.size;
        if (bottomY > maxBottomY) {
            maxBottomY = bottomY;
            console.log(`最下方图片: ${index + 1}, 底部位置: ${bottomY}px`);
        }
    });

    const requiredHeight = maxBottomY + 20;
    console.log(`📏 计算所需容器高度: ${requiredHeight}px (最下图片底部: ${maxBottomY}px + 20px边距)`);

    return requiredHeight;
}

function initializeFixedLayout() {
    const objectsContainer = document.getElementById('objectsContainer');
    if (!objectsContainer) {
        console.error('Objects container not found!');
        return;
    }

    objectsContainer.innerHTML = '';
    placedImages = [];

    console.log('🎯 使用固定位置初始化图片布局...');

    const requiredHeight = calculateRequiredHeight();
    const portsContainer = document.querySelector('.ports-container');

    if (portsContainer) {
        portsContainer.style.height = `${requiredHeight}px`;
        console.log(`📐 设置容器高度为: ${requiredHeight}px`);
    }

    if (objectsContainer) {
        objectsContainer.style.height = `${requiredHeight - 100}px`;
        objectsContainer.style.minHeight = `${requiredHeight - 100}px`;
        console.log(`📐 设置对象容器高度为: ${requiredHeight - 100}px`);
    }

    for (let i = 0; i < objectImages.length && i < fixedImagePositions.length; i++) {
        const img = document.createElement('img');
        img.src = `C页Ports-of-Proof页图片，文案，字体，指引/C页image/${objectImages[i]}`;
        img.className = 'object-img';
        img.alt = `物品图片 ${i + 1}`;
        img.dataset.index = i;

        const position = fixedImagePositions[i];

        img.style.width = `${position.size}px`;
        img.style.height = `${position.size}px`;
        img.style.left = `${position.x}px`;
        img.style.top = `${position.y}px`;

        img.addEventListener('mouseenter', handleImageHover);
        img.addEventListener('mouseleave', handleImageLeave);
        img.addEventListener('mousemove', handleImageMouseMove);
        img.addEventListener('click', handleImageClick);

        objectsContainer.appendChild(img);

        placedImages.push({ 
            x: position.x, 
            y: position.y, 
            width: position.size, 
            height: position.size 
        });

        console.log(`✅ 图片 ${i + 1} 固定在位置: (${position.x}, ${position.y}) 尺寸: ${position.size}x${position.size}px`);
    }

    console.log(`🎉 固定布局完成！成功放置 ${objectImages.length} 张图片`);
}

function initializeRandomLayout() {
    const objectsContainer = document.getElementById('objectsContainer');
    if (!objectsContainer) {
        console.error('Objects container not found!');
        return;
    }

    objectsContainer.innerHTML = '';
    placedImages = [];

    fixedRandomPositions = [];

    generateFixedRandomPositions();

    console.log(`Starting to position ${objectImages.length} images in fixed random layout...`);
    console.log(`Generated ${fixedRandomPositions.length} fixed positions for ${objectImages.length} images`);

    if (fixedRandomPositions.length < objectImages.length) {
        console.error(`❌ CRITICAL: Not enough positions generated! Need ${objectImages.length}, got ${fixedRandomPositions.length}`);
    }

    const imagesToCreate = Math.min(objectImages.length, fixedRandomPositions.length);
    console.log(`Creating ${imagesToCreate} images...`);

    for (let i = 0; i < imagesToCreate; i++) {
        console.log(`Creating image ${i + 1}/${objectImages.length}: ${objectImages[i]}`);

        const img = document.createElement('img');
        img.src = `C页Ports-of-Proof页图片，文案，字体，指引/C页image/${objectImages[i]}`;
        img.className = 'object-img';
        img.alt = `物品图片 ${i + 1}`;
        img.dataset.index = i;

        positionImageAtFixedPosition(img, i);

        img.addEventListener('mousedown', handleImageMouseDown);

        img.addEventListener('mouseenter', handleImageHover);
        img.addEventListener('mouseleave', handleImageLeave);
        img.addEventListener('mousemove', handleImageMouseMove);
        img.addEventListener('click', handleImageClick);

        objectsContainer.appendChild(img);
        console.log(`Image ${i + 1} positioned at fixed random position (${fixedRandomPositions[i].x}, ${fixedRandomPositions[i].y})`);
    }

    const addedImages = objectsContainer.querySelectorAll('.object-img');
    console.log(`✅ Successfully positioned ${addedImages.length} out of ${objectImages.length} images in fixed random layout`);
    console.log(`Container dimensions: ${window.innerWidth}x${window.innerHeight}`);

    if (addedImages.length !== objectImages.length) {
        console.error(`❌ Missing images! Expected ${objectImages.length}, got ${addedImages.length}`);
    }

    validateFinalLayout();

    validateScreenBounds();
}

function positionImageAtFixedPosition(img, index) {
    if (index >= fixedRandomPositions.length) {
        console.error(`No fixed position available for image ${index + 1}`);
        return;
    }

    const position = fixedRandomPositions[index];
    const imageSize = position.size;

    const containerWidth = window.innerWidth - 40;
    const containerHeight = window.innerHeight - 200;

    const safeX = Math.max(10, Math.min(containerWidth - imageSize - 10, position.x));
    const safeY = Math.max(10, Math.min(containerHeight - imageSize - 10, position.y));

    if (safeX !== position.x || safeY !== position.y) {
        console.warn(`Adjusted image ${index + 1} position from (${position.x}, ${position.y}) to (${safeX}, ${safeY}) to prevent overflow`);
    }

    img.style.width = `${imageSize}px`;
    img.style.height = `${imageSize}px`;

    img.style.left = `${safeX}px`;
    img.style.top = `${safeY}px`;

    const fineTune = {};
    let finalX = safeX;
    let finalY = safeY;
    if (fineTune[index]) {
        finalX = Math.max(10, Math.min(containerWidth - imageSize - 10, safeX + (fineTune[index].dx || 0)));
        finalY = Math.max(10, Math.min(containerHeight - imageSize - 10, safeY + (fineTune[index].dy || 0)));

        const pad = Math.max(6, Math.floor(imageSize * 0.04));
        let tries = 0;
        const maxTries = 40;
        const dirs = [[0,-1],[0,1],[1,0],[-1,0],[1,-1],[-1,-1],[1,1],[-1,1]];
        const intersectsAny = (x, y) => placedImages.some(p => {
            const xOverlap = !(x + imageSize + pad <= p.x || x >= p.x + p.width + pad);
            const yOverlap = !(y + imageSize + pad <= p.y || y >= p.y + p.height + pad);
            return xOverlap && yOverlap;
        });
        while (intersectsAny(finalX, finalY) && tries < maxTries) {
            const d = dirs[tries % dirs.length];
            finalX = Math.max(10, Math.min(containerWidth - imageSize - 10, finalX + d[0] * Math.max(8, Math.floor(imageSize * 0.06))));
            finalY = Math.max(10, Math.min(containerHeight - imageSize - 10, finalY + d[1] * Math.max(8, Math.floor(imageSize * 0.06))));
            tries++;
        }
        if (tries > 0) console.log(`🎯 Post-finetune de-overlap for image ${index + 1}: ${tries} nudges.`);
    }

    img.style.left = `${finalX}px`;
    img.style.top = `${finalY}px`;

    placedImages.push({ 
        x: finalX, 
        y: finalY, 
        width: imageSize, 
        height: imageSize 
    });

    console.log(`Image ${index + 1} positioned at fixed random position: (${finalX}, ${finalY}) size: ${imageSize}x${imageSize}px`);
}

function validateFinalLayout() {
    let overlapCount = 0;

    console.log('🔍 CRITICAL: Validating final layout for overlaps...');
    console.log(`Total images to check: ${placedImages.length}`);

    for (let i = 0; i < placedImages.length; i++) {
        for (let j = i + 1; j < placedImages.length; j++) {
            const img1 = placedImages[i];
            const img2 = placedImages[j];

            const img1Left = img1.x;
            const img1Right = img1.x + img1.width;
            const img1Top = img1.y;
            const img1Bottom = img1.y + img1.height;

            const img2Left = img2.x;
            const img2Right = img2.x + img2.width;
            const img2Top = img2.y;
            const img2Bottom = img2.y + img2.height;

            const horizontalOverlap = !(img1Right <= img2Left || img1Left >= img2Right);
            const verticalOverlap = !(img1Bottom <= img2Top || img1Top >= img2Bottom);

            if (horizontalOverlap && verticalOverlap) {
                overlapCount++;
                console.error(`🚨 CRITICAL OVERLAP DETECTED between image ${i + 1} and ${j + 1}:`);
                console.error(`   Image ${i + 1}: (${img1Left}, ${img1Top}) to (${img1Right}, ${img1Bottom}) size: ${img1.width}x${img1.height}`);
                console.error(`   Image ${j + 1}: (${img2Left}, ${img2Top}) to (${img2Right}, ${img2Bottom}) size: ${img2.width}x${img2.height}`);

                const overlapLeft = Math.max(img1Left, img2Left);
                const overlapRight = Math.min(img1Right, img2Right);
                const overlapTop = Math.max(img1Top, img2Top);
                const overlapBottom = Math.min(img1Bottom, img2Bottom);
                const overlapArea = (overlapRight - overlapLeft) * (overlapBottom - overlapTop);

                console.error(`   Overlap area: ${overlapArea} pixels`);
                console.error(`   Distance: horizontal=${Math.abs(img1.x - img2.x)}, vertical=${Math.abs(img1.y - img2.y)}`);
            } else {

                const hDistance = Math.min(Math.abs(img1Right - img2Left), Math.abs(img2Right - img1Left));
                const vDistance = Math.min(Math.abs(img1Bottom - img2Top), Math.abs(img2Bottom - img1Top));
                console.log(`✅ Images ${i + 1} and ${j + 1} properly separated: h=${hDistance.toFixed(1)}px, v=${vDistance.toFixed(1)}px`);
            }
        }
    }

    if (overlapCount === 0) {
        console.log('🎉 SUCCESS: No overlaps detected - all images positioned correctly!');
    } else {
        console.error(`🚨 CRITICAL FAILURE: Found ${overlapCount} overlaps in final layout!`);
    }

    return overlapCount === 0;
}

function validateScreenBounds() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    let outOfBoundsCount = 0;

    console.log('🔍 Validating screen bounds...');
    console.log(`Screen dimensions: ${containerWidth}x${containerHeight}`);

    placedImages.forEach((img, index) => {
        const imgRight = img.x + img.width;
        const imgBottom = img.y + img.height;

        let issues = [];

        if (img.x < 0) issues.push(`left edge at ${img.x}`);
        if (img.y < 0) issues.push(`top edge at ${img.y}`);
        if (imgRight > containerWidth) issues.push(`right edge at ${imgRight} (screen width: ${containerWidth})`);
        if (imgBottom > containerHeight) issues.push(`bottom edge at ${imgBottom} (screen height: ${containerHeight})`);

        if (issues.length > 0) {
            outOfBoundsCount++;
            console.error(`🚨 Image ${index + 1} is out of bounds: ${issues.join(', ')}`);
            console.error(`   Position: (${img.x}, ${img.y}) to (${imgRight}, ${imgBottom}), Size: ${img.width}x${img.height}`);
        } else {
            console.log(`✅ Image ${index + 1} within bounds: (${img.x}, ${img.y}) to (${imgRight}, ${imgBottom})`);
        }
    });

    if (outOfBoundsCount === 0) {
        console.log('🎉 SUCCESS: All images are within screen bounds!');
    } else {
        console.error(`🚨 BOUNDARY FAILURE: ${outOfBoundsCount} images are out of bounds!`);
    }

    return outOfBoundsCount === 0;
}

function handleImageHover(e) {
    const index = parseInt(e.target.dataset.index);
    const data = passportData[index];

    if (data) {
        const descriptionCard = document.getElementById('descriptionCard');
        const cardName = document.getElementById('cardName');
        const cardProof = document.getElementById('cardProof');

        cardName.textContent = `Name: ${data.name}`;
        cardProof.textContent = `Proof: ${data.proof}`;

        descriptionCard.classList.add('visible');

        updateCardPosition(e);
    }
}

function handleImageMouseMove(e) {
    updateCardPosition(e);
}

function handleImageLeave(e) {
    const descriptionCard = document.getElementById('descriptionCard');
    descriptionCard.classList.remove('visible');
}

function handleImageClick(e) {
    const index = parseInt(e.target.dataset.index);
    const passportModal = document.getElementById('passportModal');
    const modalPassportImg = document.getElementById('modalPassportImg');

    modalPassportImg.src = `C页Ports-of-Proof页图片，文案，字体，指引/C页image/${proofImages[index]}`;
    modalPassportImg.alt = `Passport ${index + 1}`;

    passportModal.classList.add('active');

    document.body.style.overflow = 'hidden';
}

function updateCardPosition(e) {
    const descriptionCard = document.getElementById('descriptionCard');

    const offsetX = 20;
    const offsetY = -20;

    let x = e.clientX + offsetX;
    let y = e.clientY + offsetY;

    const cardRect = descriptionCard.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (x + cardRect.width > windowWidth) {
        x = e.clientX - cardRect.width - offsetX;
    }

    if (y < 0) {
        y = e.clientY + offsetY + 40;
    }

    descriptionCard.style.left = x + 'px';
    descriptionCard.style.top = y + 'px';
}

function initializeModal() {
    const passportModal = document.getElementById('passportModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeBtn');

    closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && passportModal.classList.contains('active')) {
            closeModal();
        }
    });
}

function closeModal() {
    const passportModal = document.getElementById('passportModal');
    passportModal.classList.remove('active');

    document.body.style.overflow = 'auto';
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
                    window.location.href = 'proofs-reborn.html';
                    break;
                case 'ports-of-proof':

                    break;
            }

            navDropdown.classList.remove('active');
        });
    });
}

function initializePurpleOverlay() {
    const purpleTextOverlay = document.getElementById('purpleTextOverlay');
    const purpleTextContent = document.querySelector('.purple-text-content');
    let scrollAccumulation = 0;
    const scrollThreshold = 100;

    function isAtBottom() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const tolerance = 5;
        const atBottom = scrollTop + windowHeight >= documentHeight - tolerance;

        console.log(`滚动检查: 当前位置=${Math.round(scrollTop)}, 窗口高度=${windowHeight}, 文档高度=${documentHeight}, 是否到底=${atBottom}`);

        return atBottom;
    }

    document.addEventListener('wheel', function(e) {
        const atBottom = isAtBottom();
        const overlayVisible = purpleTextOverlay.classList.contains('scroll-active');

        if (overlayVisible) {

            if (e.deltaY < 0) {
                e.preventDefault();
                scrollAccumulation += e.deltaY;
                if (scrollAccumulation < -scrollThreshold) {
                    purpleTextOverlay.classList.remove('scroll-active');
                    scrollAccumulation = 0;
                    console.log('🟣 图层显示时向上滚动 - 隐藏紫色图层');
                }
            }
            return;
        }

        if (!atBottom) {

            return;
        }

        if (e.deltaY > 0) {
            e.preventDefault();
            scrollAccumulation += e.deltaY;

            if (scrollAccumulation > scrollThreshold) {
                purpleTextOverlay.classList.add('scroll-active');
                scrollAccumulation = 0;
                console.log('🟣 在底部向下滚动 - 显示紫色图层');
            }
        } else {

            scrollAccumulation = 0;
        }
    }, { passive: false });

    document.addEventListener('scroll', function() {
        if (!isAtBottom() && purpleTextOverlay.classList.contains('scroll-active')) {
            purpleTextOverlay.classList.remove('scroll-active');
            console.log('🟣 离开底部 - 自动隐藏紫色图层');
        }
    });

    purpleTextOverlay.addEventListener('click', function() {
        this.classList.remove('scroll-active');
        console.log('🟣 点击图层 - 隐藏紫色图层');
    });

    purpleTextContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !document.getElementById('passportModal').classList.contains('active')) {
            purpleTextOverlay.classList.remove('scroll-active');
            console.log('🟣 ESC键 - 隐藏紫色图层');
        }
        if (e.code === 'Space') {
            e.preventDefault();
            if (isAtBottom()) {
                purpleTextOverlay.classList.toggle('scroll-active');
                console.log('🟣 空格键 - 切换紫色图层 (仅在底部)');
            }
        }
    });

}

function handleImageMouseDown(e) {
    if (e.button !== 0) return; 
    e.preventDefault();

    const index = parseInt(e.target.dataset.index);
    isDragging = true;
    draggingIndex = index;

    const rect = e.target.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    e.target.style.cursor = 'grabbing';
    e.target.style.zIndex = '1000';

    console.log(`Started dragging image ${index + 1}`);
}

function initializeDragDrop() {
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || draggingIndex === -1) return;

        e.preventDefault();
        const objectsContainer = document.getElementById('objectsContainer');
        const containerRect = objectsContainer.getBoundingClientRect();

        const newX = e.clientX - containerRect.left - dragOffset.x;
        const newY = e.clientY - containerRect.top - dragOffset.y;

        const img = objectsContainer.children[draggingIndex];
        if (img) {
            img.style.left = `${newX}px`;
            img.style.top = `${newY}px`;

            if (placedImages[draggingIndex]) {
                placedImages[draggingIndex].x = newX;
                placedImages[draggingIndex].y = newY;
            }
            if (fixedRandomPositions[draggingIndex]) {
                fixedRandomPositions[draggingIndex].x = newX;
                fixedRandomPositions[draggingIndex].y = newY;
            }
        }
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;

        const objectsContainer = document.getElementById('objectsContainer');
        const img = objectsContainer.children[draggingIndex];
        if (img) {
            img.style.cursor = 'pointer';
            img.style.zIndex = '1';
        }

        console.log(`Finished dragging image ${draggingIndex + 1}`);

        isDragging = false;
        draggingIndex = -1;

        savePositions();
    });
}

function initializeDevTools() {

    window.savePositions = savePositions;
    window.loadPositions = loadPositions;
    window.clearPositions = clearPositions;
    window.exportPositions = exportPositions;
    window.importPositions = importPositions;
    window.downloadPositions = downloadPositions;

    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey && !e.altKey) {

            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                downloadPositions();
            }
        }
    });

    console.log('🔧 DevTools ready: savePositions(), loadPositions(), clearPositions(), exportPositions(), importPositions(data)');
    console.log('⌨️ Press "S" key to download positions as TXT file');
}

function savePositions() {
    const positions = fixedRandomPositions.map((pos, i) => ({
        index: i,
        x: pos.x,
        y: pos.y,
        size: pos.size
    }));

    localStorage.setItem('pop_positions', JSON.stringify(positions));
    console.log('💾 Saved positions to localStorage:', positions);
}

function loadPositions() {
    try {
        const saved = JSON.parse(localStorage.getItem('pop_positions'));
        if (Array.isArray(saved) && saved.length === 16) {
            const objectsContainer = document.getElementById('objectsContainer');
            saved.forEach((pos, i) => {
                if (i < objectsContainer.children.length) {
                    const img = objectsContainer.children[i];
                    img.style.left = `${pos.x}px`;
                    img.style.top = `${pos.y}px`;

                    if (placedImages[i]) {
                        placedImages[i].x = pos.x;
                        placedImages[i].y = pos.y;
                    }
                    if (fixedRandomPositions[i]) {
                        fixedRandomPositions[i].x = pos.x;
                        fixedRandomPositions[i].y = pos.y;
                    }
                }
            });
            console.log('📥 Loaded positions from localStorage');
            return true;
        }
    } catch (e) {
        console.error('❌ Failed to load positions:', e);
    }
    return false;
}

function clearPositions() {
    localStorage.removeItem('pop_positions');
    console.log('🗑️ Cleared saved positions');

    fixedRandomPositions = [];
    initializeRandomLayout();
}

function exportPositions() {
    const positions = fixedRandomPositions.map((pos, i) => ({
        index: i,
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        size: pos.size
    }));

    const data = JSON.stringify(positions, null, 2);
    console.log('📋 Copy this data for importPositions():\n', data);
    return positions;
}

function importPositions(data) {
    try {
        let positions;
        if (typeof data === 'string') {
            positions = JSON.parse(data);
        } else {
            positions = data;
        }

        if (Array.isArray(positions) && positions.length === 16) {
            localStorage.setItem('pop_positions', JSON.stringify(positions));
            loadPositions();
            console.log('📥 Imported and applied positions');
            return true;
        } else {
            console.error('❌ Invalid data format. Expected array of 16 position objects.');
        }
    } catch (e) {
        console.error('❌ Failed to import positions:', e);
    }
    return false;
}

function downloadPositions() {
    const positions = fixedRandomPositions.map((pos, i) => ({
        index: i + 1, 
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        size: pos.size,
        imageName: objectImages[i]
    }));

    let content = 'Ports of Proof - 图片位置信息\n';
    content += '=' .repeat(50) + '\n';
    content += `生成时间: ${new Date().toLocaleString()}\n`;
    content += `容器尺寸: ${window.innerWidth}x${window.innerHeight}\n`;
    content += `图片总数: ${positions.length}\n\n`;

    content += '图片位置详情:\n';
    content += '-'.repeat(50) + '\n';

    positions.forEach(pos => {
        content += `图片 ${pos.index}: ${pos.imageName}\n`;
        content += `  位置: (${pos.x}, ${pos.y})\n`;
        content += `  尺寸: ${pos.size}x${pos.size}px\n\n`;
    });

    content += '\n' + '='.repeat(50) + '\n';
    content += 'JSON格式数据 (用于importPositions函数):\n';
    content += JSON.stringify(positions.map(p => ({
        index: p.index - 1,
        x: p.x,
        y: p.y,
        size: p.size
    })), null, 2);

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    a.href = url;
    a.download = `ports-of-proof-positions-${timestamp}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('💾 Downloaded positions file:', a.download);
    console.log('📋 Positions saved:', positions);
}

window.addEventListener('resize', function() {

    const descriptionCard = document.getElementById('descriptionCard');
    descriptionCard.classList.remove('visible');
});