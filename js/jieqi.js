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

    // 检测设备类型的函数，与CSS断点保持一致
    function checkIfMobile() {
        // CSS中定义了 --bp-md: 768px
        const mobileBreakpoint = 768;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < mobileBreakpoint;
    }
    
    // 根据设备性能调整参数
    const performanceSettings = {
        frameInterval: 1000 / 60, // 降低到60fps，足够流畅且更节能
        rotationSpeed: 0.2 
    };
    
    const settings = performanceSettings;
    
    // 获取当前设备类型 - 只在初始化时计算一次
    const isMobile = checkIfMobile();
    
    // 根据设备类型定义字体大小
    const fontSizes = {
        desktop: {
            normal: 20,
            hexagram: 22 
        },
        mobile: {
            normal: 12,
            hexagram: 14
        }
    };
    
    // 更新圆环半径比例函数 - 优化为预先计算好的值
    const mobileRatios = [0.14, 0.19, 0.24, 0.29, 0.34, 0.39, 0.44, 0.49, 0.54, 0.59];
    const desktopRatios = [0.1, 0.142, 0.184, 0.228, 0.270, 0.312, 0.354, 0.398, 0.442, 0.486];
    
    // 根据设备类型直接设置正确的圆环半径
    for (let i = 0; i < circleRadiusRatios.length; i++) {
        circleRadiusRatios[i] = isMobile ? mobileRatios[i] : desktopRatios[i];
    }
    
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

    // 统一处理窗口大小变化 - 简化版本
    function handleViewportChange() {
        // 获取当前视口尺寸
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 检测设备类型是否变化
        const newIsMobile = checkIfMobile();
        
        // 如果设备类型没有变化，只执行基本的样式调整
        if (newIsMobile === isMobile) {
            adjustAdditionalElements();
            
            // 仅更新信息面板布局，不重新创建罗盘
            const infoPanel = document.querySelector('.solar-term-info-panel');
            if (infoPanel) {
                updatePanelLayout(infoPanel);
            }
            return;
        }
        
        // 设备类型变化时执行完整的初始化
        location.reload(); // 直接刷新页面是处理设备类型变化的最简单方法
    }

    // 调整其他响应式元素
    function adjustAdditionalElements() {
        // 调整引用信息位置
        const referenceInfo = document.querySelector('.reference-info');
        if (referenceInfo) {
            if (isMobile) {
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
        }
        
        // 调整底部箭头指示器
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            if (isMobile) {
                scrollIndicator.style.bottom = '40px';
                scrollIndicator.style.width = '50px';
                scrollIndicator.style.height = '50px';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.bottom = '30px';
                scrollIndicator.style.width = '60px';
                scrollIndicator.style.height = '60px';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    }

    // 创建统一的事件处理函数
    const debouncedViewportChange = debounce(handleViewportChange, 150);
    const debouncedOrientationChange = debounce(handleViewportChange, 350);

    // 移除原有事件监听器以避免重复
    window.removeEventListener('resize', debouncedViewportChange);
    window.removeEventListener('orientationchange', debouncedOrientationChange);

    // 添加新的事件监听器
    window.addEventListener('resize', debouncedViewportChange);
    window.addEventListener('orientationchange', debouncedOrientationChange);

    // 添加特殊处理，针对iOS设备方向变化后的延迟重绘
    window.addEventListener('orientationchange', function() {
        // iOS设备在方向变化后可能需要额外时间来正确报告viewport尺寸
        setTimeout(handleViewportChange, 500);
    });

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
        // 检查是否点击了底部箭头，如果是则不触发罗盘旋转
        if (e.target.closest('.scroll-indicator')) {
            return;
        }
        
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
        // 如果是在底部箭头上的触摸，则忽略此事件
        if (e.target.closest('.scroll-indicator')) {
            return;
        }
        
        // 记录起始触摸位置
        const touch = e.touches[0];
        lastMouseX = touch.clientX;
        lastMouseY = touch.clientY;
        lastTime = Date.now();
        isDragging = true;
        startAngle = null;
        
        // 添加拖动标记类
        compass.classList.add('dragging');
        
        e.preventDefault();
    }, { passive: false });
    
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
    }, { passive: false });
    
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
        // 添加will-change属性以启用硬件加速
        textLayer.style.willChange = 'transform';
        
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
        
        // 预计算角度和位置
        const anglePositions = {};
        
        // 为每个圆环预计算角度和位置，减少三角函数计算
        circleTexts.forEach((texts, circleIndex) => {
            const numSegments = texts.length;
            const angleStep = 360 / numSegments;
            const radius = compassSize * circleRadiusRatios[circleIndex];
            
            anglePositions[circleIndex] = [];
            
            for (let i = 0; i < numSegments; i++) {
                // 计算角度，从正上方开始，顺时针旋转
                const angle = (i * angleStep + 90) % 360;
                // 转换为弧度并预计算余弦和正弦值（只计算一次）
                const radians = (angle - 90) * PI_DIV_180;
                const cosVal = Math.cos(radians);
                const sinVal = Math.sin(radians);
                
                // 计算文字位置
                const x = centerX + cosVal * radius;
                const y = centerY + sinVal * radius;
                
                anglePositions[circleIndex].push({
                    angle,
                    x,
                    y
                });
            }
        });
        
        // 创建文字元素
        circleTexts.forEach((texts, circleIndex) => {
            // 当前圆环使用的字体大小
            const fontSize = (circleIndex === 7) ? hexagramFontSize : normalFontSize;
            
            // 添加文字
            texts.forEach((text, i) => {
                const pos = anglePositions[circleIndex][i];
                
                const textElement = document.createElement('div');
                textElement.className = 'text-item';
                textElement.innerText = text;
                
                // 添加圆环特定的样式类别
                if (circleIndex === 7) {
                    textElement.classList.add('hexagram-text');
                }
                
                // 只设置位置和旋转相关的样式，其他样式交由CSS处理
                textElement.style.fontSize = `${fontSize}px`;
                textElement.style.left = `${pos.x}px`;
                textElement.style.top = `${pos.y}px`;
                textElement.style.transform = `translate(-50%, -50%) rotate(${pos.angle}deg)`;
                
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

    // 修改初始化罗盘的函数 - 优化资源加载
    function initCompass() {
        // 清空罗盘内容
        compass.innerHTML = '';
        
        // 设置罗盘容器样式
        compass.style.position = 'absolute';
        
        // 计算合适的罗盘尺寸（取视口宽度和高度的较小值的90%）
        const viewportMin = Math.min(window.innerWidth, window.innerHeight);
        const compassSize = viewportMin * 0.9;
        
        // 设置罗盘容器尺寸
        compass.style.width = `${compassSize}px`;
        compass.style.height = `${compassSize}px`;
        
        // 确保罗盘在视口中居中
        compass.style.top = '50%';
        compass.style.left = '50%';
        compass.style.transform = 'translate(-50%, -50%)';
        compass.style.transformOrigin = 'center center';
        compass.style.margin = '0';
        
        // 禁用所有动画和过渡效果
        compass.style.transition = 'none';
        compass.style.animation = 'none';
        
        // 设置基本样式
        compass.style.overflow = 'visible';
        compass.style.borderRadius = '50%';
        compass.style.maxWidth = '800px';
        compass.style.maxHeight = '800px';
        compass.style.zIndex = '50';
        
        // 移除不需要的样式
        compass.style.margin = '0';
        
        // 始终添加边框
        compass.classList.add('border-enabled');
        
        // 创建罗盘基础
        createCompassElements();
        
        // 创建文字层
        createTextLayer();
        
        // 创建扇形交互区域
        createSectors();
        
        // 立即显示罗盘，无需等待
        compass.style.visibility = 'visible';
        compass.style.opacity = '1';
        
        // 只在桌面端添加节气信息分页窗口
        if (!isMobile) {
            addSolarTermInfoPanel();
        }
        
        // 添加参考信息
        addReferenceInfo();
        
        // 注释掉原有旋转控件的创建函数调用
        // addAutoRotateControlsToHeader();
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
            referenceInfo.style.top= '80px'; // 在移动端显示在顶部，位于导航栏下方
            referenceInfo.style.left = '0';
            referenceInfo.style.transform = 'none';
            referenceInfo.style.fontSize = '10px'; // 移动端字体稍小
        } else {
            referenceInfo.style.bottom = '20px';
            referenceInfo.style.left = '50%';
            referenceInfo.style.transform = 'translateX(-50%)';
            referenceInfo.style.fontSize = '16px';
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
        // 如果已经在旋转，先停止
        if (autoRotationId) {
            stopAutoRotation();
        }
        
        console.log("开始自动旋转");
        compass.classList.add('auto-rotating');
        
        // 缓存DOM元素引用
        const compassInner = document.querySelector('.compass-inner');
        if (!compassInner) {
            console.error("找不到compass-inner元素");
            return;
        }
        
        // 使用JavaScript控制的帧动画代替CSS动画，确保兼容性
        let lastTimestamp = 0;
        const rotationSpeed = -0.05; // 每毫秒旋转的角度
        
        function rotateStep(timestamp) {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }
            
            // 计算时间差
            const elapsed = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // 更新旋转角度
            currentRotation += rotationSpeed * elapsed;
            
            // 应用旋转
            compassInner.style.transform = `rotate(${currentRotation}deg)`;
            
            // 继续动画循环
            autoRotationId = requestAnimationFrame(rotateStep);
        }
        
        // 启动动画
        autoRotationId = requestAnimationFrame(rotateStep);
        console.log("动画已启动，ID:", autoRotationId);
    }

    // 处理自动旋转的停止
    function stopAutoRotation() {
        console.log("停止自动旋转，当前ID:", autoRotationId);
        
        // 取消动画
        if (autoRotationId) {
            cancelAnimationFrame(autoRotationId);
            autoRotationId = null;
        }
        
        // 移除自动旋转类
        compass.classList.remove('auto-rotating');
        
        console.log("旋转已停止，当前角度:", currentRotation);
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
            { term: "古谷雨", date: "由于历史的原因，谷雨与清明的位置发生了变动。古谷雨的度、数、信还在二月之中。古谷雨是二十四个节气中的第5个节气，实为第8个。", position: "太阳到达黄经15度", 
              phenomena: "一候桐始华；二候田鼠化鴽；三候虹始见", wind: "明庶风", 
              element: "五行阴阳属性是阴木转阳土", sound: "角音波转徵音波", qi: "少阴君火", 
              energy: "转入火炁礼德能量输布" },
            { term: "古清明", date: "由于历史的原因，谷雨与清明的位置发生了变动。古清明是二十四个节气中的第6个节气，实为第9个。", position: "太阳到达黄经30度", 
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

    // 只在桌面端添加节气表格分页窗口 - 优化版本
    function addSolarTermInfoPanel() {
        // 移动端不创建面板
        if (isMobile) {
            return;
        }
        
        // 检查是否已存在面板
        let infoPanel = document.querySelector('.solar-term-info-panel');
        if (infoPanel) {
            return;
        }
        
        // 创建面板
        infoPanel = document.createElement('div');
        infoPanel.className = 'solar-term-info-panel';
        infoPanel.style.display = 'flex';
        
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
            { id: 'tab3', label: '八风能量<br>四季五行<br>五音能量', fields: ['wind', 'element', 'sound'] },
            { id: 'tab4', label: '六气能量<br>天地能量', fields: ['qi', 'energy'] }
        ];
        
        // 为桌面端预先构建所有按钮，一次性添加
        const buttonsFragment = document.createDocumentFragment();
        
        // 创建分页按钮
        tabs.forEach((tab, index) => {
            const button = document.createElement('div');
            button.className = 'tab-button' + (index === 0 ? ' active' : '');
            button.setAttribute('data-tab', tab.id);
            button.innerHTML = tab.label;
            
            // 桌面端使用鼠标悬停事件
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
            
            buttonsFragment.appendChild(button);
        });
        
        // 一次性添加所有按钮
        tabButtons.appendChild(buttonsFragment);
        
        // 显示初始内容
        updateInfoContent(tabs[0].fields);
    }

    // 简化面板布局更新函数
    function updatePanelLayout(panel) {
        if (!panel) return;
        
        // 根据设备类型设置显示状态 - 简化为只管显示和隐藏
        panel.style.display = isMobile ? 'none' : 'flex';
    }

    // 为所有设备创建顶部控件
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
        headerControls.style.top = '100px';
        headerControls.style.right = '5px';
        headerControls.style.zIndex = '150';
        headerControls.style.display = 'flex';
        headerControls.style.flexDirection = 'column'; // 垂直排列
        headerControls.style.alignItems = 'center';
        headerControls.style.backgroundColor = 'transparent'; // 透明背景
        headerControls.style.border = 'none'; // 无边框
        headerControls.style.boxShadow = 'none'; // 无阴影
        
        // 创建自动旋转控件组
        const rotateGroup = document.createElement('div');
        rotateGroup.className = 'control-group';
        rotateGroup.style.display = 'flex';
        rotateGroup.style.flexDirection = 'column'; // 垂直排列
        rotateGroup.style.alignItems = 'center';
        rotateGroup.style.marginBottom = '15px';
        
        // 创建自动旋转文本标签
        const rotateText = document.createElement('span');
        rotateText.innerText = '自动旋转';
        rotateText.style.fontSize = '12px';
        rotateText.style.fontWeight = 'bold';
        rotateText.style.color = '#d4af37';
        rotateText.style.marginBottom = '5px';
        rotateText.style.textAlign = 'center';
        
        // 创建自动旋转开关
        const toggleSwitch = document.createElement('label');
        toggleSwitch.className = 'switch';
        toggleSwitch.style.position = 'relative';
        toggleSwitch.style.display = 'inline-block';
        toggleSwitch.style.width = '30px';
        toggleSwitch.style.height = '16px';
        
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
        slider.style.borderRadius = '10px';
        
        // 添加滑块样式
        const style = document.createElement('style');
        style.textContent = `
            .slider:before {
                content: '';
                position: absolute;
                height: 10px;
                width: 10px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: #d4af37;
            }
            input:checked + .slider:before {
                transform: translateX(14px);
            }
        `;
        document.head.appendChild(style);
        
        // 组装控件
        toggleSwitch.appendChild(checkbox);
        toggleSwitch.appendChild(slider);
        rotateGroup.appendChild(rotateText);
        rotateGroup.appendChild(toggleSwitch);
        
        headerControls.appendChild(rotateGroup);
        
        // 添加到文档中
        document.querySelector('.container').appendChild(headerControls);
        
        // 添加自动旋转事件监听
        checkbox.addEventListener('change', function(e) {
            // 阻止事件冒泡，防止触发document上的点击事件
            e.stopPropagation();
            
            if (this.checked) {
                startAutoRotation();
            } else {
                stopAutoRotation();
            }
        });
        
        // 阻止控件区域点击事件冒泡，防止触发document上的流星效果
        headerControls.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 格式化日期为中文显示格式（例如：2023年10月1日 星期日）
    function formatCurrentDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekDay = weekDays[date.getDay()];
        return `${year}年${month}月${day}日 ${weekDay}`;
    }

    // 更新当前日期显示
    function updateCurrentDateDisplay() {
        const currentDateElements = document.querySelectorAll('.current-date');
        if (currentDateElements.length > 0) {
            const beijingTime = getBeijingTime();
            const formattedDate = formatCurrentDate(beijingTime);
            
            // 更新所有current-date元素
            currentDateElements.forEach(element => {
                element.innerHTML = formattedDate;
            });
            
            // 更新面板内容 - 重新生成节气卡片内容
            updateSolarTermInfo();
        }
    }

    // 更新节气卡片信息
    function updateSolarTermInfo() {
        const activeTabButton = document.querySelector('.tab-button.active');
        if (activeTabButton) {
            const tabId = activeTabButton.getAttribute('data-tab');
            const tabData = [
                { id: 'tab1', fields: ['date'] },
                { id: 'tab2', fields: ['phenomena', 'position'] },
                { id: 'tab3', fields: ['wind', 'element', 'sound'] },
                { id: 'tab4', fields: ['qi', 'energy'] }
            ].find(tab => tab.id === tabId);
            
            if (tabData) {
                updateInfoContent(tabData.fields);
            }
        }
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
        
        // 获取北京时间
        const beijingTime = getBeijingTime();
        const todayStr = beijingTime.toISOString().split('T')[0]; // 格式如 "2025-03-20"
        
        // 创建文档片段以减少DOM操作
        const fragment = document.createDocumentFragment();
        
        // 创建标题元素
        const titleElement = document.createElement('div');
        titleElement.className = 'current-term';
        titleElement.textContent = currentTerm.name;
        fragment.appendChild(titleElement);
        
        // 创建当前日期显示元素
        const dateElement = document.createElement('div');
        dateElement.className = 'current-date';
        dateElement.textContent = formatCurrentDate(beijingTime);
        fragment.appendChild(dateElement);
        
        // 为每个字段创建内容
        fields.forEach((field) => {
            let fieldContent = termData[field];
            let fieldLabel = '';
            
            // 为不同字段添加对应的前缀
            switch (field) {
                case 'position':
                    fieldLabel = '黄道位置';
                    break;
                case 'phenomena':
                    fieldLabel = '三候';
                    break;
                case 'wind':
                    fieldLabel = '八风能量对应';
                    break;
                case 'element':
                    fieldLabel = '四季五行对应';
                    break;
                case 'sound':
                    fieldLabel = '五音能量对应';
                    break;
                case 'qi':
                    fieldLabel = '六气能量主气对应';
                    break;
                case 'energy':
                    fieldLabel = '天地能量主运';
                    break;
            }
            
            // 创建信息项元素
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            
            if (fieldLabel) {
                const labelSpan = document.createElement('span');
                labelSpan.className = 'info-label';
                labelSpan.textContent = `${fieldLabel}：`;
                infoItem.appendChild(labelSpan);
                
                const valueSpan = document.createElement('span');
                valueSpan.className = 'info-value';
                valueSpan.textContent = fieldContent;
                infoItem.appendChild(valueSpan);
            } else {
                const valueSpan = document.createElement('span');
                valueSpan.className = 'info-value';
                valueSpan.textContent = fieldContent;
                infoItem.appendChild(valueSpan);
            }
            
            fragment.appendChild(infoItem);
        });
        
        // 如果是阳历时间页面，添加节气提示语
        if (fields.includes('date')) {
            const tipsContainer = document.createElement('div');
            tipsContainer.className = 'tips-container';
            
            if (todayStr === currentTerm.date) {
                const highlightTip = document.createElement('span');
                highlightTip.className = 'highlight-tip';
                highlightTip.textContent = `🌸 今日${currentTerm.name}有导师的节气课程哦！`;
                tipsContainer.appendChild(highlightTip);
            } else {
                const nextTermInfo = document.createElement('span');
                nextTermInfo.className = 'next-term';
                
                // 创建文本和强调部分
                const textNode = document.createTextNode(`下一个节气是【${nextTerm.name}】阳历日期：${formatDate(nextTerm.date)}，倒计时 `);
                nextTermInfo.appendChild(textNode);
                
                const strongElement = document.createElement('strong');
                strongElement.textContent = getDaysLeft(nextTerm.date);
                nextTermInfo.appendChild(strongElement);
                
                nextTermInfo.appendChild(document.createTextNode(' 天'));
                
                tipsContainer.appendChild(nextTermInfo);
            }
            
            fragment.appendChild(tipsContainer);
        }
        
        // 清空现有内容并一次性添加所有新元素
        infoContent.innerHTML = '';
        infoContent.appendChild(fragment);
    }

    // 初始化罗盘
    initCompass();
    
    // 罗盘初始化后，自动旋转到当前节气位置
    rotateCompassToCurrentSolarTerm();

    // 只在桌面端自动显示节气卡片，不需要判断
    if (!isMobile) {
        // 初始更新一次当前日期
        updateCurrentDateDisplay();
        
        // 设置定时器，每分钟更新一次日期显示
        setInterval(updateCurrentDateDisplay, 60000); // 60000毫秒 = 1分钟
    }

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
        window.location.href = '/blog/';
    }
    
    // 将导航函数添加到全局对象中
    window.navigateToBlog = navigateToBlog;
    
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