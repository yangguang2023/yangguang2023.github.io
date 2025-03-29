document.addEventListener('DOMContentLoaded', function() {
    // 中国传统罗盘上的文字（简化版）
    const circleTexts = [
        // 内圈到外圈的文字
        ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],
        ["肾", "三焦", "肝", "胆", "心包", "小肠", "心", "脾", "胃", "肺", "大肠", "膀胱"],
        ["胆经", "肝经", "肺经", "大肠经", "胃经", "脾经", "心经", "小肠经", "膀胱经", "肾经", "心包经", "三焦经"],
        ["十一", "腊月", "正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月"],
        ["冬至 小寒", "大寒 立春", "启蛰 雨水", "春分 谷雨", "清明 立夏", "小满 芒种", "夏至 小暑", "大暑 立秋", "处暑 白露", "秋分 寒露", "霜降 立冬", "小雪 大雪"],
        ["危 虚 女", "牛 斗", "箕 尾", "心 房 氐", "亢 角", "轸 翼", "张 星 柳", "鬼 井", "参 觜", "毕 昴 胃", "娄 奎", "壁 室"],
        ["腰5—4椎", "腰3—2椎", "腰1—T12", "胸11—10", "胸9—8椎", "胸7—6椎", "胸5—4椎", "胸3—2椎", "胸1—C7", "颈6—5椎", "颈4—3椎", "颈2—1椎"],
        ["复卦䷗", "临卦䷒", "泰卦䷊", "大壮䷡", "夬卦䷪", "乾卦䷀", "姤卦䷫", "遯卦䷠", "否卦䷋", "观卦䷓", "剥卦䷖", "坤卦䷁"]
    ];

    // 定义12等分区域的链接和描述
    const segmentLinks = [
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" },
        { url: "/categories/二十四节气/" }
    ];

    // 节气数据，包含所有2025年的24个节气
    const solarTerms2025 = [
        { name: "立春", date: "2025-02-03" },
        { name: "启蛰", date: "2025-02-18" },
        { name: "古雨水", date: "2025-03-05" },
        { name: "春分", date: "2025-03-20" },
        { name: "古谷雨", date: "2025-04-04" },
        { name: "古清明", date: "2025-04-20" },
        { name: "立夏", date: "2025-05-05" },
        { name: "小满", date: "2025-05-21" },
        { name: "芒种", date: "2025-06-05" },
        { name: "夏至", date: "2025-06-21" },
        { name: "小暑", date: "2025-07-07" },
        { name: "大暑", date: "2025-07-22" },
        { name: "立秋", date: "2025-08-07" },
        { name: "处暑", date: "2025-08-23" },
        { name: "白露", date: "2025-09-07" },
        { name: "秋分", date: "2025-09-23" },
        { name: "寒露", date: "2025-10-08" },
        { name: "霜降", date: "2025-10-23" },
        { name: "立冬", date: "2025-11-07" },
        { name: "小雪", date: "2025-11-22" },
        { name: "大雪", date: "2025-12-07" },
        { name: "冬至", date: "2025-12-21" },
        { name: "小寒", date: "2026-01-05" },
        { name: "大寒", date: "2026-01-20" }
    ];

    // 节气与罗盘上文字圈对应关系，索引值基于circleTexts[4]
    const solarTermToCompassMapping = {
        "冬至": 0, "小寒": 0,
        "大寒": 1, "立春": 1,
        "启蛰": 2, "古雨水": 2,
        "春分": 3, "古谷雨": 3,
        "古清明": 4, "立夏": 4,
        "小满": 5, "芒种": 5,
        "夏至": 6, "小暑": 6,
        "大暑": 7, "立秋": 7,
        "处暑": 8, "白露": 8,
        "秋分": 9, "寒露": 9,
        "霜降": 10, "立冬": 10,
        "小雪": 11, "大雪": 11
    };

    // 获取当前客户端时间，并转换为北京时间（UTC+8）
    function getBeijingTime() {
        const now = new Date();
        // 方法：客户端时间 + 时区偏移 => 转换为UTC+8
        return new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
    }

    // 获取当前或下一个节气
    function getCurrentSolarTerm() {
        const beijingTime = getBeijingTime();
        const todayStr = beijingTime.toISOString().split('T')[0]; // 格式如 "2025-03-20"
        
        // 找到当前日期所处的节气区间
        let currentTerm = null;
        let nextTerm = null;
        
        // 对比日期格式的字符串比较
        for (let i = 0; i < solarTerms2025.length; i++) {
            if (todayStr >= solarTerms2025[i].date) {
                currentTerm = solarTerms2025[i];
                nextTerm = solarTerms2025[i + 1] || null;
            } else {
                if (!currentTerm) {
                    // 如果当前日期小于第一个节气日期，则当前节气为数组的最后一个节气（上一年的大寒）
                    // 下一个节气为第一个节气
                    currentTerm = solarTerms2025[solarTerms2025.length - 1];
                    nextTerm = solarTerms2025[0];
                }
                break;
            }
        }
        
        return { currentTerm, nextTerm };
    }

    // 辅助函数：计算剩余天数
    function getDaysLeft(targetDate) {
        const target = new Date(targetDate);
        const beijingTime = getBeijingTime();
        const diff = target - beijingTime;
        return Math.ceil(diff / (1000 * 3600 * 24));
    }

    // 辅助函数：格式化日期（将 "2025-02-03" 转为 "2月3日"）
    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${parseInt(month)}月${parseInt(day)}日`;
    }

    // 根据当前节气旋转罗盘
    function rotateCompassToCurrentSolarTerm() {
        const { currentTerm } = getCurrentSolarTerm();
        if (!currentTerm) return;
        
        // 查找当前节气在罗盘上的位置
        const solarTermIndex = solarTermToCompassMapping[currentTerm.name];
        if (typeof solarTermIndex !== 'undefined') {
            // 计算旋转角度：索引×30度的位置要旋转到顶部（270度或-90度）
            // 罗盘文字环旋转角度 = 目标位置角度(270) - 初始位置角度(索引*30)
            const rotationAngle = 270 - (solarTermIndex * 30);
            
            // 设置旋转角度
            currentRotation = rotationAngle;
            const compassInner = document.querySelector('.compass-inner');
            if (compassInner) {
                compassInner.style.transform = `rotate(${rotationAngle}deg)`;
            }
            
            console.log(`已旋转罗盘到当前节气:${currentTerm.name}，索引:${solarTermIndex}，角度:${rotationAngle}度`);
        }
    }

    // 定义每个圆环的半径比例（相对于compass尺寸）
    const circleRadiusRatios = [
        0.11, // 最内圈
        0.15,
        0.19,
        0.23,
        0.27,
        0.31,
        0.35,
        0.39,
        0.43,
        0.47  // 最外圈
    ];

    // 检测设备类型的函数，这样可以随时调用
    function checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    }
    
    // 根据设备性能调整动画参数
    const performanceSettings = {
        frameInterval: 1000 / 60 // 60fps
    };
    
    const settings = performanceSettings;
    
    // 获取当前设备类型
    let isMobile = checkIfMobile();
    
    // 根据设备类型定义字体大小
    const fontSizes = {
        desktop: {
            normal: 20,
            hexagram: 22 // 卦符更大
        },
        mobile: {
            normal: 12,  // 减小移动端字体
            hexagram: 14 // 减小移动端卦符字体
        }
    };
    
    // 更新圆环半径比例函数 - 优化：直接赋值而不是循环计算
    function updateCircleRadios() {
        // 预计算好的值，避免在循环中重复计算
        const mobileRatios = [0.14, 0.19, 0.24, 0.29, 0.34, 0.39, 0.44, 0.49, 0.54, 0.59];
        const desktopRatios = [0.1, 0.142, 0.184, 0.228, 0.270, 0.312, 0.354, 0.398, 0.442, 0.486];
        
        // 直接复制整个数组
        if (isMobile) {
            for (let i = 0; i < circleRadiusRatios.length; i++) {
                circleRadiusRatios[i] = mobileRatios[i];
            }
        } else {
            for (let i = 0; i < circleRadiusRatios.length; i++) {
                circleRadiusRatios[i] = desktopRatios[i];
            }
        }
    }
    
    // 初始化圆环半径
    updateCircleRadios();

    // 即时初始化罗盘（删除延迟）
    // 立即隐藏所有不需要的元素
    document.querySelectorAll('.circle, .center-circle').forEach(el => {
        if(el) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
        }
    });

    // 获取DOM元素
    const compass = document.querySelector('.compass');
    
    // 删除可能存在的文字容器和文字层
    document.querySelectorAll('.text-container, .text-layer, .compass-rotate-area, .segment-sector, .control-panel, .circle, .center-circle').forEach(el => el.remove());
    
    // 创建表盘外部旋转区域 - 放在container中的compass前面，确保它位于compass下方
    const rotateArea = document.createElement('div');
    rotateArea.className = 'compass-rotate-area';
    const container = document.querySelector('.container');
    container.insertBefore(rotateArea, compass);

    // 创建扇形区域
    function createSectors() {
        const compassInner = document.querySelector('.compass-inner');
        let segmentSector = document.querySelector('.segment-sector');
        
        // 如果不存在扇形容器，创建一个
        if (!segmentSector) {
            segmentSector = document.createElement('div');
            segmentSector.className = 'segment-sector';
            compassInner.appendChild(segmentSector);
        }
        
        // 清空现有的扇形
        segmentSector.innerHTML = '';
        
        // 检测是否为移动设备
        const isMobileDevice = checkIfMobile();
        
        // 创建12个扇形
        for (let i = 0; i < 12; i++) {
            const sector = document.createElement('div');
            sector.className = 'sector';
            
            // 计算扇形的角度
            const startAngle = i * 30 - 15; // 从-15度开始，确保扇形居中
            const endAngle = startAngle + 30; // 每个扇形30度
            
            // 生成扇形的SVG路径
            const path = generateSectorPath(startAngle, endAngle);
            sector.style.clipPath = path;
            
            // 设置扇形的样式
            sector.style.position = 'absolute';
            sector.style.width = '100%';
            sector.style.height = '100%';
            sector.style.transformOrigin = 'center';
            sector.style.cursor = 'pointer';
            
            // 根据设备类型设置不同的z-index
            if (isMobileDevice) {
                sector.style.zIndex = '8'; // 移动端使用较低层级
            } else {
                sector.style.zIndex = '25'; // 桌面端可以使用较高层级
            }
            
            // 添加点击事件
            sector.addEventListener('click', (e) => {
                if (!isDragging) {  // 只在非拖动状态下响应点击
                    e.stopPropagation();
                    console.log(`点击了第 ${i + 1} 个扇区`);
                    if (segmentLinks[i] && segmentLinks[i].url) {
                        window.open(segmentLinks[i].url, '_blank');
                    }
                }
            });
            
            // 添加简单的悬浮效果
            sector.addEventListener('mouseenter', () => {
                if (!isDragging) {  // 只在非拖动状态下响应hover
                    sector.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                    
                    // 在移动设备上确保悬停效果不会遮挡中心图标
                    if (isMobileDevice) {
                        sector.style.zIndex = '8'; // 保持在较低层级
                    }
                }
            });
            
            // 添加鼠标离开事件
            sector.addEventListener('mouseleave', () => {
                sector.style.backgroundColor = 'transparent';
            });
            
            segmentSector.appendChild(sector);
        }
    }

    // 生成扇形路径的函数 - 优化：减少三角函数计算
    function generateSectorPath(startAngle, endAngle) {
        const steps = 10; // 减少步数，10步对于30度扇形已足够平滑
        const radius = 50; // 百分比值
        const center = 50; // 中心点百分比
        
        // 预计算常量
        const PI_DIV_180 = Math.PI / 180;
        
        let path = `polygon(${center}% ${center}%`; // 从中心点开始

        // 生成弧线上的点
        for (let i = 0; i <= steps; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / steps);
            const radian = angle * PI_DIV_180;
            // 使用sin和cos的一次性计算
            const sinVal = Math.sin(radian);
            const cosVal = Math.cos(radian);
            const x = center + radius * sinVal;
            const y = center - radius * cosVal;
            path += `, ${x.toFixed(2)}% ${y.toFixed(2)}%`; // 保留两位小数，减少字符串长度
        }

        path += ')';
        return path;
    }

    // 定义一个防抖函数，避免resize事件频繁触发
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 统一处理窗口大小变化和设备方向变化
    function handleViewportChange() {
        // 检测设备类型是否变化
        const newIsMobile = checkIfMobile();
        
        // 保存当前旋转角度
        const currentRotationValue = currentRotation;
        
        // 无论设备类型是否变化，都重新初始化罗盘
        isMobile = newIsMobile;
        updateCircleRadios();
        
        // 重新初始化整个罗盘，确保所有元素重新创建并定位
        initCompass();
        
        // 恢复旋转角度
        if (currentRotationValue !== 0) {
            const compassInner = document.querySelector('.compass-inner');
            if (compassInner) {
                compassInner.style.transform = `rotate(${currentRotationValue}deg)`;
            }
        }
        
        console.log('视口尺寸变化，罗盘已更新');
    }

    // 窗口大小变化事件
    window.addEventListener('resize', debounce(handleViewportChange, 100));

    // 设备方向变化事件
    window.addEventListener('orientationchange', debounce(handleViewportChange, 300));

    // 初始化罗盘
    initCompass();

    // 增加旋转互动
    let isDragging = false;
    let startAngle = null;
    let startRotation = 0;
    let currentRotation = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let rotationSpeed = 0;
    let lastTime = 0;

    // 鼠标事件 - 在旋转区域上生效
    rotateArea.addEventListener('mousedown', function(e) {
        isDragging = true;
        startAngle = null;
        rotateArea.style.cursor = 'grabbing';
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastTime = Date.now();
        
        // 添加拖动标记类
        compass.classList.add('dragging');
        
        e.preventDefault();
        e.stopPropagation();
    });

    // 统一处理鼠标和触摸事件移动
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        if (deltaTime === 0) return;

        handleRotation(e.clientX, e.clientY, currentTime);
        
        // 更新鼠标位置用于计算惯性
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        e.preventDefault();
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            endDragWithInertia();
        }
    });

    // 触摸设备支持
    let lastTouchX = 0;
    let lastTouchY = 0;

    rotateArea.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            // 停止自动旋转，确保不与手动旋转冲突
            stopAutoRotation();
            
            isDragging = true;
            startAngle = null;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
            lastTime = Date.now();
            
            // 阻止默认行为
            e.preventDefault();
            e.stopPropagation();
            
            // 添加拖动标记类
            compass.classList.add('dragging');
        }
    }, { passive: false }); // 确保可以阻止默认行为
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        if (deltaTime === 0) return;
        
        handleRotation(touch.clientX, touch.clientY, currentTime);
        
        // 更新触摸位置用于计算惯性
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
        
        // 阻止默认行为，防止页面滚动
        e.preventDefault();
    }, { passive: false }); // 确保可以阻止默认行为
    
    document.addEventListener('touchend', function(e) {
        if (isDragging) {
            // 确保触摸结束时不立即启动其他动作
            e.preventDefault();
            endDragWithInertia();
        }
    }, { passive: false });

    // 处理touch cancel事件，确保触摸被取消时能正确结束拖动
    document.addEventListener('touchcancel', function(e) {
        if (isDragging) {
            // 直接结束拖动，不添加惯性效果
            isDragging = false;
            startAngle = null;
            compass.classList.remove('dragging');
            e.preventDefault();
        }
    }, { passive: false });
    
    // 统一处理拖动结束和惯性效果 - 优化移动端体验
    function endDragWithInertia() {
        if (!isDragging) return;
        
        isDragging = false;
        startAngle = null;
        
        // 恢复鼠标样式
        rotateArea.style.cursor = 'grab';
            
        // 移除拖动标记类
        compass.classList.remove('dragging');
        
        // 清除可能正在进行的惯性动画
        if (window.inertiaAnimationId) {
            cancelAnimationFrame(window.inertiaAnimationId);
            window.inertiaAnimationId = null;
        }
        
        // 获取对应DOM元素
        const compassInner = document.querySelector('.compass-inner');
        
        // 只有明显的快速移动才产生惯性
        if (rotationSpeed > 0.3) {
            // 避免无限惯性的安全措施
            const maxInertiaTime = 3000; // 最多3秒惯性
            const startTime = Date.now();
            const startInertiaRotation = currentRotation;
            
            // 计算初始惯性速度 - 根据拖动速度确定
            // 在合理范围内加大拖动的影响
            const initialVelocity = Math.min(10, rotationSpeed * 5);
            
            // 定义应用惯性效果的函数 - 优化，直接在一个函数中封装
            function applyInertia() {
                const now = Date.now();
                const elapsedTime = now - startTime;
                
                // 如果超过最大惯性时间，或速度已经很小，则停止惯性
                if (elapsedTime >= maxInertiaTime) {
                    // 移除重新创建文字层的逻辑
                    return;
                }
                
                // 计算当前时刻的减速惯性速度
                // 使用指数衰减函数，提供更自然的减速感
                const velocity = initialVelocity * Math.exp(-elapsedTime / 500);
                
                // 如果速度已经很小，停止惯性
                if (Math.abs(velocity) < 0.1) {
                    // 移除重新创建文字层的逻辑
                    return;
                }
                
                // 更新旋转角度
                currentRotation += velocity;
                compassInner.style.transform = `rotate(${currentRotation}deg)`;
                
                // 继续应用惯性
                window.inertiaAnimationId = requestAnimationFrame(applyInertia);
            }
            
            // 启动惯性效果
            window.inertiaAnimationId = requestAnimationFrame(applyInertia);
        } else {
            // 移除重新创建文字层的逻辑
        }
    }

    // 修改文字应用变换的方式，移除特效
    // 在createTextLayer函数中优化变换
    function createTextLayer() {
        document.querySelectorAll('.text-layer').forEach(layer => layer.remove());
        
        const textLayer = document.createElement('div');
        textLayer.className = 'text-layer';
        
        const compassInner = document.querySelector('.compass-inner');
        compassInner.appendChild(textLayer);
        
        // 获取罗盘尺寸
        const compassSize = Math.min(compass.offsetWidth, compass.offsetHeight);
        const centerX = compassSize / 2;
        const centerY = compassSize / 2;
        
        // 预计算常量
        const PI_DIV_180 = Math.PI / 180;
        
        // 预先确定字体大小，避免重复条件判断
        const normalFontSize = isMobile ? fontSizes.mobile.normal : fontSizes.desktop.normal;
        const hexagramFontSize = isMobile ? fontSizes.mobile.hexagram : fontSizes.desktop.hexagram;
        
        // 创建文档片段以减少DOM操作
        const fragment = document.createDocumentFragment();
        
        // 为每个圆环创建文字
        circleTexts.forEach((texts, circleIndex) => {
            const numSegments = texts.length;
            const angleStep = 360 / numSegments;
            
            // 使用预定义的半径比例
            const radius = compassSize * circleRadiusRatios[circleIndex];
            
            // 当前圆环使用的字体大小
            const fontSize = (circleIndex === 7) ? hexagramFontSize : normalFontSize;
            
            // 添加文字
            texts.forEach((text, i) => {
                // 计算角度，从正上方开始，顺时针旋转
                const angle = (i * angleStep + 90) % 360;
                // 转换为弧度并预计算余弦和正弦值（只计算一次）
                const radians = (angle - 90) * PI_DIV_180;
                const cosVal = Math.cos(radians);
                const sinVal = Math.sin(radians);
                
                const textElement = document.createElement('div');
                textElement.className = 'text-item';
                textElement.innerText = text;
                
                // 设置字体大小
                textElement.style.fontSize = `${fontSize}px`;
                
                // 计算文字位置
                const x = centerX + cosVal * radius;
                const y = centerY + sinVal * radius;
                
                // 应用变换 - 使用简单的transform，不添加过渡效果
                textElement.style.left = `${x}px`;
                textElement.style.top = `${y}px`;
                textElement.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
                textElement.style.transition = 'none'; // 确保没有过渡效果
                
                // 添加清晰渲染的属性
                textElement.style.backfaceVisibility = 'hidden';
                textElement.style.webkitBackfaceVisibility = 'hidden';
                
                fragment.appendChild(textElement);
            });
        });
        
        // 一次性添加所有元素到DOM
        textLayer.appendChild(fragment);
    }

    // 优化旋转处理函数，增加时间参数用于计算速度
    function handleRotation(clientX, clientY, currentTime) {
        if (!isDragging) return;

        // 在开始拖动时，重置所有扇形区域的状态
        const sectors = document.querySelectorAll('.sector');
        sectors.forEach(sector => {
            sector.style.backgroundColor = 'transparent';
        });
        
        // 获取中心点坐标（只计算一次）
        const rect = compass.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 计算鼠标位置相对于中心点的偏移
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        
        // 计算当前角度 - 使用Math.atan2一次计算
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // 如果是第一次拖动，记录初始角度
        if (startAngle === null) {
            startAngle = angle;
            startRotation = currentRotation;
        }
        
        // 计算旋转角度
        const rotation = startRotation + (angle - startAngle);
        
        // 计算旋转速度
        let dx = 0, dy = 0;

        // 根据事件类型使用对应的上一次位置
        if (isMobile) {
            // 移动端使用touch坐标
            dx = clientX - lastTouchX;
            dy = clientY - lastTouchY;
        } else {
            // 桌面端使用鼠标坐标
            dx = clientX - lastMouseX;
            dy = clientY - lastMouseY;
        }

        // 防止除以零
        const safeDeltatime = Math.max(1, currentTime - lastTime);
        rotationSpeed = Math.sqrt(dx * dx + dy * dy) / safeDeltatime;
        
        // 更新上一次的时间
        lastTime = currentTime;
        
        // 应用旋转到内部元素，不使用过渡效果，保持文字渲染一致性
        currentRotation = rotation;
        const compassInner = document.querySelector('.compass-inner');
        if (compassInner) {
            compassInner.style.transition = 'none'; // 确保没有过渡效果
            compassInner.style.transform = `rotate(${rotation}deg)`;
        }
    }

    // 修改createCompassElements函数，确保移动端正确定位并添加中心图标
    function createCompassElements() {
        // 创建罗盘内部容器（用于旋转）
        let compassInner = document.querySelector('.compass-inner');
        if (!compassInner) {
            compassInner = document.createElement('div');
            compassInner.className = 'compass-inner';
            compassInner.style.width = '100%';
            compassInner.style.height = '100%';
            compassInner.style.position = 'absolute';
            compassInner.style.top = '0';
            compassInner.style.left = '0';
            compassInner.style.transformOrigin = 'center center';
            compassInner.style.transition = 'none'; // 确保没有过渡效果
            compassInner.style.backfaceVisibility = 'hidden'; // 保持清晰渲染
            compassInner.style.webkitBackfaceVisibility = 'hidden';
            compassInner.style.transformStyle = 'flat';
            compassInner.style.webkitTransformStyle = 'flat';
            compass.appendChild(compassInner);
        }
        
        // 清空内部容器
        compassInner.innerHTML = '';
        
        // 添加中心图标
        const centerIcon = document.createElement('img');
        centerIcon.className = 'center-icon';
        centerIcon.src = '/images/center-icon.png';
        centerIcon.alt = '中心图标';
        
        // 设置中心图标样式
        centerIcon.style.position = 'absolute';
        centerIcon.style.top = '50%';
        centerIcon.style.left = '50%';
        centerIcon.style.transform = 'translate(-50%, -50%)';
        centerIcon.style.width = '16%'; // 设置为罗盘宽度的20%
        centerIcon.style.height = 'auto';
        centerIcon.style.zIndex = '60'; // 确保与CSS中的设置一致
        centerIcon.style.transformOrigin = 'center';
        
        // 将中心图标添加到compassInner内部，使其能够随罗盘一起旋转
        compassInner.appendChild(centerIcon);
    }

    // 修改初始化罗盘的函数，移除独立的节气提示框
    function initCompass() {
        // 清空罗盘内容
        compass.innerHTML = '';
        
        // 设置罗盘容器样式
        compass.style.position = 'relative';
        
        // 获取容器尺寸
        const container = document.querySelector('.container');
        const containerRect = container.getBoundingClientRect();
        
        // 根据设备类型设置不同的尺寸
        if (isMobile) {
            // 获取视口宽度和高度
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // 计算合适的罗盘尺寸（取视口宽度和高度的较小值的94%）
            const compassSize = Math.min(viewportWidth, viewportHeight) * 0.92;
            
            // 设置罗盘容器尺寸
            compass.style.width = `${compassSize}px`;
            compass.style.height = `${compassSize}px`;
            
            // 确保罗盘在视口中居中
            compass.style.margin = 'auto';
        } else {
            // 桌面端使用固定像素值
            const containerSize = Math.min(containerRect.width, containerRect.height);
            const compassSize = containerSize * 0.94; // 使用与移动端相同的比例
            
            compass.style.width = `${compassSize}px`;
            compass.style.height = `${compassSize}px`;
            compass.style.margin = 'auto';
        }
        
        compass.style.overflow = 'visible';
        compass.style.borderRadius = '50%';
        
        // 始终添加边框
        compass.classList.add('border-enabled');
        
        // 创建罗盘基础
        createCompassElements();
        
        // 创建文字层
        createTextLayer();
        
        // 创建扇形交互区域
        createSectors();
        
        // 显示罗盘
        compass.style.visibility = 'visible';
        
        // 添加节气信息分页窗口
        addSolarTermInfoPanel();
        
        // 添加参考信息
        addReferenceInfo();
        
        // 添加自动旋转控件（所有设备）
        addAutoRotateControlsToHeader();
    }
    
    // 添加引用信息到罗盘底部
    function addReferenceInfo() {
        // 移除已存在的参考信息
        const existingRef = document.querySelector('.reference-info');
        if (existingRef) {
            existingRef.remove();
        }

        // 创建参考信息元素
        const referenceInfo = document.createElement('div');
        referenceInfo.className = 'reference-info';
        
        // 设置文本内容
        referenceInfo.textContent = '节气次序图参照熊春锦先生著《中华传统节气修身文化·四时之春》，略有简化';
        
        // 设置基础样式
        referenceInfo.style.position = 'fixed';
        referenceInfo.style.color = '#d4af37';
        referenceInfo.style.fontSize = '12px';
        referenceInfo.style.textAlign = 'center';
        referenceInfo.style.width = '100%';
        referenceInfo.style.padding = '0 20px';
        referenceInfo.style.zIndex = '1000';
        referenceInfo.style.pointerEvents = 'none';
        referenceInfo.style.textShadow = '0 0 2px rgba(0, 0, 0, 0.8)';
        
        // 根据设备类型设置不同的位置
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            referenceInfo.style.top = '70px'; // 在移动端显示在顶部，位于导航栏下方
            referenceInfo.style.left = '0';
            referenceInfo.style.transform = 'none';
            referenceInfo.style.fontSize = '10px'; // 移动端字体稍小
        } else {
            referenceInfo.style.bottom = '20px';
            referenceInfo.style.left = '50%';
            referenceInfo.style.transform = 'translateX(-50%)';
            referenceInfo.style.fontSize = '14px';
        }
        
        // 添加到页面
        document.body.appendChild(referenceInfo);
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            const isMobileNow = window.innerWidth <= 768;
            if (isMobileNow) {
                referenceInfo.style.top = '70px';
                referenceInfo.style.bottom = 'auto';
                referenceInfo.style.left = '0';
                referenceInfo.style.transform = 'none';
                referenceInfo.style.fontSize = '10px';
            } else {
                referenceInfo.style.top = 'auto';
                referenceInfo.style.bottom = '20px';
                referenceInfo.style.left = '50%';
                referenceInfo.style.transform = 'translateX(-50%)';
                referenceInfo.style.fontSize = '12px';
            }
        });
    }

    // 修改window.compassFunctions
    window.compassFunctions = {
        getCurrentRotation: function() {
            return currentRotation;
        },
        setRotation: function(angle) {
            currentRotation = angle;
            const compassInner = document.querySelector('.compass-inner');
            if (compassInner) {
                compassInner.style.transform = `rotate(${angle}deg)`;
            }
        }
    };

    // 监听自定义的旋转事件
    document.addEventListener('compassRotated', function(e) {
        if (e && e.detail && typeof e.detail.rotation === 'number') {
            currentRotation = e.detail.rotation;
            const compassInner = document.querySelector('.compass-inner');
            if (compassInner) {
                compassInner.style.transform = `rotate(${e.detail.rotation}deg)`;
            }
        }
    });

    // 添加对自动旋转的优化处理
    let autoRotationId = null;
    let autoRotationSpeed = -0.2; // 自动旋转的速度，使用负值实现逆时针旋转

    // 处理自动旋转的开始，确保中心图标随罗盘旋转
    function startAutoRotation() {
        if (autoRotationId) {
            stopAutoRotation();
        }
        
        compass.classList.add('auto-rotating');
        
        // 缓存DOM元素引用
        const compassInner = document.querySelector('.compass-inner');
        if (!compassInner) return;
        
        let lastTimestamp = 0;
        
        function autoRotateStep(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            
            const elapsed = timestamp - lastTimestamp;
            
            if (elapsed >= settings.frameInterval) {
                currentRotation += autoRotationSpeed;
                        compassInner.style.transform = `rotate(${currentRotation}deg)`;
                lastTimestamp = timestamp;
            }
            
            autoRotationId = requestAnimationFrame(autoRotateStep);
        }
        
        autoRotationId = requestAnimationFrame(autoRotateStep);
    }

    // 处理自动旋转的停止
    function stopAutoRotation() {
        if (autoRotationId) {
            cancelAnimationFrame(autoRotationId);
            autoRotationId = null;
            compass.classList.remove('auto-rotating');
            
            // 清除transform样式
            const compassInner = document.querySelector('.compass-inner');
            if (compassInner) {
                compassInner.style.transform = `rotate(${currentRotation}deg)`;
                // 移除重新创建文字层的逻辑，保持文字渲染一致
            }
        }
    }

    // 将自动旋转函数暴露到全局
    window.startAutoRotation = startAutoRotation;
    window.stopAutoRotation = stopAutoRotation;

    // 添加节气表格数据
    function createSolarTermInfoData() {
        return [
            { term: "立春", date: "按照四时天地能量的变化来排序，二十四节气的第1个节气实为冬至，立春乃第4个节气，在大寒与启蛰之间，完成承前启后的作用。", position: "太阳到达黄经315度", 
              phenomena: "一候东风解冻；二候蛰虫始振；三候鱼陟负冰", wind: "条风", 
              element: "五行阴阳属性是阳木", sound: "角音波", qi: "厥阴风木", 
              energy: "木炁仁德能量输布期" },
            { term: "启蛰", date: "由于历史的原因，启蛰与雨水的位置发生了变动。启蛰是二十四个节气中的第2个节气，实为第5个。", position: "太阳到达黄经330度", 
              phenomena: "一候獭祭鱼；二候候雁北；三候草木萌动", wind: "条风", 
              element: "五行阴阳属性是阳木", sound: "角音波", qi: "厥阴风木", 
              energy: "木炁仁德能量峰值期" },
            { term: "古雨水", date: "由于历史的原因，启蛰与雨水的位置发生了变动。古雨水是二十四个节气中的第3个节气，实为第6个。", position: "太阳到达黄经345度", 
              phenomena: "一候桃始华；二候仓庚鸣；三候鹰化为鸠", wind: "条风", 
              element: "五行阴阳属性是阳木转阴木", sound: "角音波", qi: "厥阴风木", 
              energy: "木炁仁德能量峰值期（开始进入尾期）" },
            { term: "春分", date: "春分是二十四个节气中的第4个节气，实为第7个", position: "太阳到达黄经0度", 
              phenomena: "一候元鸟至；二候雷乃发声；三候始电", wind: "明庶风", 
              element: "五行阴阳属性是阴木", sound: "角音波转徵音波", qi: "少阴君火", 
              energy: "木炁仁德能量收敛期，转入火炁礼德能量输布" },
            { term: "古谷雨", date: "由于历史的原因，谷雨与清明的位置发生了变动。古谷雨的度、数、信还在二月之中。古谷雨是二十四个节气中的第5个节气，实为第8个", position: "太阳到达黄经15度", 
              phenomena: "一候桐始华；二候田鼠化鴽；三候虹始见", wind: "明庶风", 
              element: "五行阴阳属性是阴木转阳土", sound: "角音波转徵音波", qi: "少阴君火", 
              energy: "转入火炁礼德能量输布" },
            { term: "古清明", date: "由于历史的原因，谷雨与清明的位置发生了变动。古清明是二十四个节气中的第6个节气，实为第9个", position: "太阳到达黄经30度", 
              phenomena: "一候萍始生；二候鸣鸠拂羽；三候戴胜降桑", wind: "明庶风", 
              element: "五行阴阳属性是阳土", sound: "徵音波", qi: "少阴君火", 
              energy: "火炁礼德能量峰值期" },
            { term: "立夏", date: "立夏是二十四节气中的第7个节气，实为第10个。", position: "太阳到达黄经45度", 
              phenomena: "一候蝼蝈鸣；二候蚯蚓出；三候王瓜生", wind: "清明风", 
              element: "五行阴阳属性是阳土转阴火", sound: "徵音波", qi: "少阴君火", 
              energy: "火炁礼德能量峰值期" },
            { term: "小满", date: "小满是二十四节气中的第8个节气，实为第11个。", position: "太阳到达黄经60度", 
              phenomena: "一候苦菜秀；二候靡草死；三候麦秋至", wind: "清明风", 
              element: "五行阴阳属性是阴火", sound: "徵音波", qi: "少阳相火", 
              energy: "火炁礼德能量下降期和收敛期" },
            { term: "芒种", date: "芒种是二十四节气中的第9个节气，实为第12个。", position: "太阳到达黄经75度", 
              phenomena: "一候螳螂生；二候鵙始鸣；三候反舌无声", wind: "清明风转景风", 
              element: "五行阴阳属性是阴火转阳火", sound: "徵音波转宫音波", qi: "少阳相火", 
              energy: "火炁礼德能量下降期" },
            { term: "夏至", date: "夏至是二十四节气中的第10个节气，实为第13个。", position: "太阳到达黄经90度", 
              phenomena: "一候鹿角解；二候蜩始鸣；三候半夏生", wind: "景风", 
              element: "五行阴阳属性是阳火", sound: "宫音波", qi: "少阳相火", 
              energy: "土炁信德能量输布期" },
            { term: "小暑", date: "小暑是二十四节气中的第11个节气，实为第14个。", position: "太阳到达黄经105度", 
              phenomena: "一候温风至；二候蟋蟀居宇；三候鹰始鸷", wind: "景风", 
              element: "五行阴阳属性是阳火转阴土", sound: "宫音波", qi: "少阳相火", 
              energy: "土炁信德能量输布期" },
            { term: "大暑", date: "大暑是二十四节气中的第12个节气，实为第15个。", position: "太阳到达黄经120度", 
              phenomena: "一候腐草为萤；二候土润溽暑；三候大雨时行", wind: "景风转凉风", 
              element: "五行阴阳属性是阴土", sound: "宫音波", qi: "太阴湿土", 
              energy: "土炁信德能量输布尾期" },
            { term: "立秋", date: "立秋是二十四节气中的第13个节气，实为第16个。", position: "太阳到达黄经135度", 
              phenomena: "一候凉风至；二候白露降；三候寒蝉鸣", wind: "凉风", 
              element: "五行阴阳属性是阳金", sound: "商音波", qi: "太阴湿土", 
              energy: "金炁义德能量输布开始期" },
            { term: "处暑", date: "处暑是二十四节气中的第14个节气，实为第17个。", position: "太阳到达黄经150度", 
              phenomena: "一候鹰祭鸟；二候天地始肃；三候禾乃登", wind: "凉风", 
              element: "五行阴阳属性是阳金", sound: "商音波", qi: "太阴湿土", 
              energy: "金炁义德能量输布期" },
            { term: "白露", date: "白露是二十四节气中的第15个节气，实为第18个。", position: "太阳到达黄经165度", 
              phenomena: "一候鸿雁来；二候玄鸟归；三候群鸟养羞", wind: "凉风", 
              element: "五行阴阳属性是阳金转阴金", sound: "商音波", qi: "太阴湿土", 
              energy: "金炁义德能量输布期" },
            { term: "秋分", date: "秋分是二十四节气中的第16个节气，实为第19个。", position: "太阳到达黄经180度", 
              phenomena: "一候雷始收声；二候蛰虫坯户；三候水始涸", wind: "阊阖风", 
              element: "五行阴阳属性是阴金", sound: "商音波", qi: "阳明燥金", 
              energy: "金炁义德能量峰值期" },
            { term: "寒露", date: "寒露是二十四节气中的第17个节气，实为第20个。", position: "太阳到达黄经195度", 
              phenomena: "一候鸿雁来宾；二候雀入大水为蛤；三候菊有黄华", wind: "阊阖风", 
              element: "五行阴阳属性是阴金转阳土", sound: "商音波", qi: "阳明燥金", 
              energy: "金炁义德能量峰值期下滑阶段" },
            { term: "霜降", date: "霜降是二十四节气中的第18个节气，实为第21个。", position: "太阳到达黄经210度", 
              phenomena: "一候豺乃祭兽；二候草木黄落；三候蛰虫咸俯", wind: "阊阖风", 
              element: "五行阴阳属性是阳土", sound: "商音波", qi: "阳明燥金", 
              energy: "金炁义德能量收尾期" },
            { term: "立冬", date: "立冬是二十四节气中的第19个节气，实为第22个。", position: "太阳到达黄经225度", 
              phenomena: "一候水始冰；二候地始冻；三候雉入大水为蜃", wind: "不周风", 
              element: "五行阴阳属性是阴水", sound: "立冬后九日商音波转羽音波", qi: "阳明燥金", 
              energy: "立冬后九日从金炁义德收尾期转为水炁智德能量输布期" },
            { term: "小雪", date: "小雪是二十四节气中的第20个节气，实为第23个。", position: "太阳到达黄经240度", 
              phenomena: "一候虹藏不见；二候天气上升；三候闭塞成冬", wind: "不周风", 
              element: "五行阴阳属性是阴水", sound: "羽音波", qi: "太阳寒水", 
              energy: "水炁智德能量输布期" },
            { term: "大雪", date: "大雪是二十四节气中的第21个节气，实为第24个。", position: "太阳到达黄经255度", 
              phenomena: "一候鹖旦不鸣；二候虎始交；三候荔挺出", wind: "不周风", 
              element: "五行阴阳属性是阴水转阳水", sound: "羽音波", qi: "太阳寒水", 
              energy: "水炁智德能量峰值期" },
            { term: "冬至", date: "冬至是二十四节气中的第22个节气，实为第1个。在夏、商(殷)、周时期天人合一的传统历法中，冬至为新年的开始，真正意义上的春节。", position: "太阳到达黄经270度", 
              phenomena: "一候蚯蚓结；二候麋角解；三候水泉动", wind: "不周风止，转广莫风", 
              element: "五行阴阳属性是阳水", sound: "羽音波", qi: "太阳寒水", 
              energy: "水炁智德能量峰值期" },
            { term: "小寒", date: "小寒是二十四节气中的第23个节气，实为第2个。", position: "太阳到达黄经285度", 
              phenomena: "一候雁北乡；二候鹊始巢；三候雉始雊", wind: "广莫风", 
              element: "五行阴阳属性是阳水，大寒前转阴土", sound: "羽音波", qi: "太阳寒水", 
              energy: "水炁智德能量收敛期" },
            { term: "大寒", date: "大寒是二十四节气中的第24个节气，实为第3个。", position: "太阳到达黄经300度", 
              phenomena: "一候鸡始乳；二候征鸟厉疾；三候水泽腹坚", wind: "广莫风", 
              element: "五行阴阳属性是阴土", sound: "角音波", qi: "厥阴风木", 
              energy: "木炁仁德能量输布期" }
        ];
    }

    // 添加节气表格分页窗口
    function addSolarTermInfoPanel() {
        // 检查容器是否已存在
        let infoPanel = document.querySelector('.solar-term-info-panel');
        if (infoPanel) {
            infoPanel.remove(); // 如果已存在则删除重建
        }
        
        // 创建外层容器
        infoPanel = document.createElement('div');
        infoPanel.className = 'solar-term-info-panel';
        document.querySelector('.container').appendChild(infoPanel);
        
        // 创建左侧信息区域
        const infoContent = document.createElement('div');
        infoContent.className = 'info-content';
        infoPanel.appendChild(infoContent);
        
        // 创建右侧分页按钮区域
        const tabButtons = document.createElement('div');
        tabButtons.className = 'tab-buttons';
        infoPanel.appendChild(tabButtons);
        
        // 定义分页按钮
        const tabs = [
            { id: 'tab1', label: '节气提醒<br>节气序列', fields: ['date'] },
            { id: 'tab2', label: '三候<br>黄道位置', fields: ['phenomena', 'position'] },
            { id: 'tab3', label: '八风能量对应<br>四季五行对应<br>五音能量对应', fields: ['wind', 'element', 'sound'] },
            { id: 'tab4', label: '六气能量主气<br>天地能量主运', fields: ['qi', 'energy'] }
        ];
        
        // 创建分页按钮
        tabs.forEach((tab, index) => {
            const button = document.createElement('div');
            button.className = 'tab-button' + (index === 0 ? ' active' : '');
            button.setAttribute('data-tab', tab.id);
            button.innerHTML = tab.label;
            
            button.addEventListener('mouseenter', () => {
                // 移除所有按钮的active类
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 给当前按钮添加active类
                button.classList.add('active');
                
                // 更新内容
                updateInfoContent(tab.fields);
            });
            
            tabButtons.appendChild(button);
        });
        
        // 设置样式
        const isMobile = window.innerWidth <= 768;
        
        // 设置面板位置和样式
        infoPanel.style.position = 'absolute';
        infoPanel.style.zIndex = '100';
        infoPanel.style.display = 'flex';
        infoPanel.style.width = isMobile ? '90%' : '360px';
        infoPanel.style.maxWidth = isMobile ? '90%' : '360px';
        infoPanel.style.color = '#ffeb3b';
        infoPanel.style.fontFamily = '"PingFang SC", "微软雅黑", sans-serif';
        infoPanel.style.border = '2px solid #d4af37';
        infoPanel.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.5)';
        infoPanel.style.borderRadius = '8px';
        infoPanel.style.background = 'transparent';
        
        // 根据设备类型设置位置和布局
        updatePanelLayout(infoPanel, infoContent, tabButtons);
        
        // 设置内容区域样式
        infoContent.style.flex = isMobile ? 'none' : '2';
        infoContent.style.padding = '8px';
        infoContent.style.fontSize = isMobile ? '11px' : '14px';
        infoContent.style.fontWeight = '400';
        infoContent.style.textShadow = '0 0 2px rgba(0, 0, 0, 0.8)';
        infoContent.style.minHeight = isMobile ? '80px' : '140px';
        
        // 设置按钮区域样式
        tabButtons.style.flex = isMobile ? 'none' : '1';
        tabButtons.style.display = 'flex';
        tabButtons.style.flexDirection = isMobile ? 'row' : 'column';
        tabButtons.style.justifyContent = 'space-around';
        tabButtons.style.padding = '2px';
        tabButtons.style.width = isMobile ? '100%' : 'auto';
        
        // 设置按钮样式
        const tabBtns = document.querySelectorAll('.tab-button');
        updateButtonStyles(tabBtns, isMobile);
        
        // 显示初始内容
        updateInfoContent(tabs[0].fields);
        
        // 监听窗口大小变化，调整面板位置
        window.addEventListener('resize', () => {
            const isMobileNow = window.innerWidth <= 768;
            updatePanelLayout(infoPanel, infoContent, tabButtons);
            updateButtonStyles(document.querySelectorAll('.tab-button'), isMobileNow);
        });
    }

    // 更新面板布局的函数
    function updatePanelLayout(panel, content, buttons) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            panel.style.bottom = '20px';
            panel.style.left = '50%';
            panel.style.right = 'auto';
            panel.style.transform = 'translateX(-50%)';
            panel.style.flexDirection = 'column';
            panel.style.width = '90%';
            panel.style.maxWidth = '90%';
            
            content.style.flex = 'none';
            content.style.fontSize = '11px';
            content.style.padding = '8px';
            content.style.minHeight = '80px';
            
            buttons.style.flexDirection = 'row';
            buttons.style.padding = '2px';
            buttons.style.width = '100%';
        } else {
            // 计算动态边距
            const screenWidth = window.innerWidth;
            const maxWidth = 1920; // 最大屏幕宽度（边距60px）
            const minWidth = 960;  // 最小屏幕宽度（边距6px）
            const maxMargin = 60;  // 最大边距
            const minMargin = 6;   // 最小边距
            
            // 使用线性插值计算边距
            let margin;
            if (screenWidth >= maxWidth) {
                margin = maxMargin;
            } else if (screenWidth <= minWidth) {
                margin = minMargin;
            } else {
                const ratio = (screenWidth - minWidth) / (maxWidth - minWidth);
                margin = minMargin + (maxMargin - minMargin) * ratio;
            }
            
            // 确保得到整数像素值
            margin = Math.round(margin);
            
            panel.style.bottom = `${margin}px`;
            panel.style.right = `${margin}px`;
            panel.style.left = 'auto';
            panel.style.transform = 'none';
            panel.style.flexDirection = 'row';
            panel.style.width = '360px';
            panel.style.maxWidth = '360px';
            
            content.style.flex = '2';
            content.style.fontSize = '14px';
            content.style.padding = '8px';
            content.style.minHeight = '140px';
            
            buttons.style.flexDirection = 'column';
            buttons.style.padding = '8px';
            buttons.style.width = 'auto';
        }
    }

    // 更新按钮样式的函数
    function updateButtonStyles(buttons, isMobile) {
        buttons.forEach(btn => {
            btn.style.padding = '2px 2px';
            btn.style.textAlign = 'center';
            btn.style.cursor = 'pointer';
            btn.style.borderRadius = '4px';
            btn.style.transition = 'all 0.3s ease';
            btn.style.fontSize = isMobile ? '10px' : '12px';
            btn.style.fontWeight = '400';
            btn.style.textShadow = '0 0 2px rgba(0, 0, 0, 0.8)';
            btn.style.marginBottom = isMobile ? '0' : '6px';
            btn.style.marginRight = isMobile ? '4px' : '0';
            btn.style.border = '1px solid rgba(212, 175, 55, 0.4)';
            btn.style.flex = isMobile ? '1' : 'none';
        });
    }

    // 为所有设备创建顶部自动旋转控件
    function addAutoRotateControlsToHeader() {
        // 检查控件是否已存在
        let headerControls = document.querySelector('.header-controls');
        if (headerControls) {
            return; // 已存在则不重复创建
        }
        
        // 创建控件容器
        headerControls = document.createElement('div');
        headerControls.className = 'header-controls';
        
        // 设置控件样式
        headerControls.style.position = 'fixed';
        headerControls.style.top = '80px';
        headerControls.style.right = '2px';
        headerControls.style.zIndex = '150';
        headerControls.style.display = 'flex';
        headerControls.style.flexDirection = 'column';
        headerControls.style.alignItems = 'center';
        headerControls.style.padding = '8px 4px';
        headerControls.style.backgroundColor = 'transparent';
        headerControls.style.color = '#d4af37';
        
        // 创建文本标签
        const controlText = document.createElement('span');
        controlText.innerText = '自动旋转';
        controlText.style.marginBottom = '8px';
        controlText.style.fontSize = '12px';
        controlText.style.fontWeight = 'bold';
        controlText.style.color = '#d4af37';
        controlText.style.writingMode = 'vertical-lr';
        controlText.style.textOrientation = 'upright';
        
        // 创建开关
        const toggleSwitch = document.createElement('label');
        toggleSwitch.className = 'switch';
        toggleSwitch.style.position = 'relative';
        toggleSwitch.style.display = 'inline-block';
        toggleSwitch.style.width = '16px';
        toggleSwitch.style.height = '32px';
        
        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'autoRotateToggle';
        checkbox.style.opacity = '0';
        checkbox.style.width = '0';
        checkbox.style.height = '0';
        
        // 创建滑块
        const slider = document.createElement('span');
        slider.className = 'slider round';
        slider.style.position = 'absolute';
        slider.style.cursor = 'pointer';
        slider.style.top = '0';
        slider.style.left = '0';
        slider.style.right = '0';
        slider.style.bottom = '0';
        slider.style.backgroundColor = '#333';
        slider.style.transition = '0.4s';
        slider.style.borderRadius = '16px';
        
        // 添加伪元素样式（通过CSS类）
        const style = document.createElement('style');
        style.textContent = `
            .slider:before {
                content: '';
                position: absolute;
                height: 10px;
                width: 10px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: #d4af37;
            }
            input:checked + .slider:before {
                transform: translateY(-16px);
            }
        `;
        document.head.appendChild(style);
        
        // 组装控件
        toggleSwitch.appendChild(checkbox);
        toggleSwitch.appendChild(slider);
        
        headerControls.appendChild(controlText);
        headerControls.appendChild(toggleSwitch);
        
        // 添加到文档中
        document.querySelector('.container').appendChild(headerControls);
        
        // 添加事件监听
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                startAutoRotation();
            } else {
                stopAutoRotation();
            }
        });
    }

    // 更新信息内容
    function updateInfoContent(fields) {
        const infoContent = document.querySelector('.info-content');
        if (!infoContent) return;
        
        // 获取当前节气
        const { currentTerm, nextTerm } = getCurrentSolarTerm();
        if (!currentTerm) return;
        
        // 从数据中查找当前节气的信息
        const termData = createSolarTermInfoData().find(term => term.term === currentTerm.name);
        if (!termData) return;
        
        // 判断设备类型
        const isMobile = window.innerWidth <= 768;
        const currentTermFontSize = isMobile ? '11px' : '14px';
        
        // 构建显示内容 - 更紧凑的布局
        let content = `<div style="margin-bottom: 8px; font-size: ${currentTermFontSize}; color: #ffeb3b;">当前节气：${currentTerm.name}</div>`;
        
        // 显示各字段内容
        fields.forEach(field => {
            let fieldContent = termData[field];
            // 为不同字段添加对应的前缀
            switch (field) {
                case 'position':
                    fieldContent = `黄道位置：${fieldContent}`;
                    break;
                case 'phenomena':
                    fieldContent = `三候：${fieldContent}`;
                    break;
                case 'wind':
                    fieldContent = `八风能量对应：${fieldContent}`;
                    break;
                case 'element':
                    fieldContent = `四季五行对应：${fieldContent}`;
                    break;
                case 'sound':
                    fieldContent = `五音能量对应：${fieldContent}`;
                    break;
                case 'qi':
                    fieldContent = `六气能量主气对应：${fieldContent}`;
                    break;
                case 'energy':
                    fieldContent = `天地能量主运：${fieldContent}`;
                    break;
            }
            content += `<div style="margin-bottom: 6px;">
                <span>${fieldContent}</span>
            </div>`;
        });
        
        // 如果是阳历时间页面，添加节气提示语到字段内容下方
        if (fields.includes('date')) {
            const beijingTime = getBeijingTime();
            const todayStr = beijingTime.toISOString().split('T')[0]; // 格式如 "2025-03-20"
            
            // 生成提示语
            let tips = '';
            if (todayStr === currentTerm.date) {
                tips += `🌸 今日${currentTerm.name}有导师的节气课程哦！`;                
            } else {
                tips += `下一个节气是【${nextTerm.name}】，阳历日期：${formatDate(nextTerm.date)}，倒计时${getDaysLeft(nextTerm.date)}天。`;
            }
            
            content += `<div style="margin: 10px 0 4px 0; font-size: 1em;">${tips}</div>`;
        }
        
        infoContent.innerHTML = content;
    }

    // 初始化罗盘
    initCompass();
    
    // 罗盘初始化后，自动旋转到当前节气位置
    rotateCompassToCurrentSolarTerm();

    // 添加页面滚动导航功能
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let lastScrollTime = 0;
    let scrollIsMobile = checkIfMobile();
    
    // 检测屏幕中心位置的函数
    function getScreenCenter() {
        return window.innerHeight / 2;
    }
    
    // 处理导航到博客页面
    function navigateToBlog() {
        // 使用window.location.assign而不是修改href，保留浏览历史
        window.location.assign('/blog/');
        
        // 另一个选择是使用history API
        // window.history.pushState({page: 'blog'}, 'Blog Page', '/blog/');
        // window.location.href = '/blog/';
    }
    
    // 点击箭头导航到博客页面
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToBlog();
        });
    }
    
    // 监听鼠标滚轮事件
    window.addEventListener('wheel', function(e) {
        const now = Date.now();
        // 防止过于频繁的滚动触发导航
        if (now - lastScrollTime < 500) return;
        
        // 向下滚动时导航到博客页面
        if (e.deltaY > 0) {
            lastScrollTime = now;
            navigateToBlog();
        }
    });
    
    // 监听移动端触摸事件
    if (scrollIsMobile) {
        let touchStartY = 0;
        let touchStartX = 0;
        const mainContainer = document.querySelector('.container');
        
        // 记录触摸开始位置
        if (mainContainer) {
            mainContainer.addEventListener('touchstart', function(e) {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            // 处理触摸移动
            mainContainer.addEventListener('touchmove', function(e) {
                if (e.touches.length !== 1) return;
                
                const touchY = e.touches[0].clientY;
                const touchX = e.touches[0].clientX;
                const deltaY = touchStartY - touchY;
                const deltaX = touchStartX - touchX;
                const screenCenter = getScreenCenter();
                const now = Date.now();
                
                // 防止过于频繁的滑动触发导航
                if (now - lastScrollTime < 500) return;
                
                // 水平方向滑动距离小，主要是垂直方向滑动
                if (Math.abs(deltaX) < Math.abs(deltaY) * 0.5) {
                    // 手指在屏幕下半部分，向上滑动超过50px
                    if (touchStartY > screenCenter && deltaY > 50) {
                        lastScrollTime = now;
                        navigateToBlog();
                    }
                }
            }, { passive: true });
        }
    }
    
    // 监听窗口大小变化，更新设备类型
    window.addEventListener('resize', function() {
        scrollIsMobile = checkIfMobile();
    });
}); 