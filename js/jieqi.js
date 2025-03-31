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
    
    // 根据设备性能调整动画参数
    const performanceSettings = {
        frameInterval: 1000 / 120, // 提高到120fps以获得更流畅的效果
        rotationSpeed: 0.2 // 设置旋转速度
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
    
    // 更新圆环半径比例函数
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
        // 获取当前视口尺寸
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 检测设备类型是否变化
        const newIsMobile = checkIfMobile();
        
        // 保存当前旋转角度
        const currentRotationValue = currentRotation;
        
        // 更新设备类型标记
        isMobile = newIsMobile;
        
        // 更新圆环半径，适应不同设备
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
        
        // 更新信息面板布局
        const infoPanel = document.querySelector('.solar-term-info-panel');
        if (infoPanel) {
            updatePanelLayout(infoPanel, document.querySelector('.info-content'), document.querySelector('.tab-buttons'));
        }
        
        // 添加额外的响应式调整
        adjustAdditionalElements();
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

    // 防抖函数，避免频繁触发重绘
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // 创建防抖处理函数的实例
    const debouncedViewportChange = debounce(handleViewportChange, 150);
    const debouncedOrientationChange = debounce(handleViewportChange, 350);

    // 窗口大小变化事件，使用150ms的防抖
    window.removeEventListener('resize', debouncedViewportChange);
    window.addEventListener('resize', debouncedViewportChange);

    // 设备方向变化事件，方向变化后等待更长时间重绘
    window.removeEventListener('orientationchange', debouncedOrientationChange);
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
                const opacityBase = 0.3;
                
                // 添加圆环特定的样式类别
                if (circleIndex === 7) {
                    textElement.classList.add('hexagram-text');
                }
                
                // 计算文字位置
                const x = centerX + cosVal * radius;
                const y = centerY + sinVal * radius;
                
                // 只设置位置和旋转相关的样式，其他样式交由CSS处理
                textElement.style.fontSize = `${fontSize}px`;
                textElement.style.left = `${x}px`;
                textElement.style.top = `${y}px`;
                textElement.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
                
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

    // 修改初始化罗盘的函数
    function initCompass() {
        // 清空罗盘内容
        compass.innerHTML = '';
        
        // 设置罗盘容器样式
        compass.style.position = 'absolute';
        
        // 计算合适的罗盘尺寸（取视口宽度和高度的较小值的90%）
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const viewportMin = Math.min(viewportWidth, viewportHeight);
        
        // 统一使用相同的计算逻辑
        const compassSize = viewportMin * 0.9;
        
        // 设置罗盘容器尺寸
        compass.style.width = `${compassSize}px`;
        compass.style.height = `${compassSize}px`;
        
        // 确保罗盘在视口中居中 - 直接使用CSS定位到中心
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
        
        // 设置最大尺寸，防止在大屏幕上过大
        compass.style.maxWidth = '800px';
        compass.style.maxHeight = '800px';
        
        // 设置z-index确保罗盘在正确的层级
        compass.style.zIndex = '50';
        
        // 移除不需要的样式
        compass.style.marginTop = '0';
        compass.style.marginBottom = '0';
        compass.style.marginLeft = '0';
        compass.style.marginRight = '0';
        
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
        if (autoRotationId) {
            stopAutoRotation();
        }
        
        compass.classList.add('auto-rotating');
        
        // 缓存DOM元素引用
        const compassInner = document.querySelector('.compass-inner');
        if (!compassInner) return;
        
        // 使用CSS动画代替JavaScript控制的帧动画
        compassInner.style.transition = 'transform 0.01s linear';
        
        let lastTimestamp = 0;
        const autoRotationSpeed = -performanceSettings.rotationSpeed; // 使用负值实现逆时针旋转
        
        function autoRotateStep(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            
            // 计算帧之间的时间差
            const elapsed = timestamp - lastTimestamp;
            
            // 计算每帧应该旋转的角度，根据elapsed时间动态调整
            // 这样即使帧率不稳定，旋转速度也会保持一致
            const rotationDelta = (autoRotationSpeed * elapsed) / 16.67; // 16.67ms是60fps的帧间隔
            
            currentRotation += rotationDelta;
            compassInner.style.transform = `rotate(${currentRotation}deg)`;
            lastTimestamp = timestamp;
            
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
            
            // 清除CSS过渡效果
            const compassInner = document.querySelector('.compass-inner');
            if (compassInner) {
                compassInner.style.transition = '';
                compassInner.style.transform = `rotate(${currentRotation}deg)`;
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

    // 只在桌面端添加节气表格分页窗口
    function addSolarTermInfoPanel() {
        // 检查容器是否已存在
        let infoPanel = document.querySelector('.solar-term-info-panel');
        if (infoPanel) {
            infoPanel.remove(); // 如果已存在则删除重建
        }
        
        // 判断是否为移动设备
        const isMobile = window.innerWidth <= 768;
        
        // 创建外层容器
        infoPanel = document.createElement('div');
        infoPanel.className = 'solar-term-info-panel' + (isMobile ? ' mobile-panel' : '');
        
        // 设置基本样式和显示属性
        infoPanel.style.position = 'fixed';
        infoPanel.style.zIndex = '100';
        infoPanel.style.display = 'flex';
        
        // 处理移动端的特殊初始设置
        if (isMobile) {
            // 先隐藏面板，等所有内容设置完毕再显示
            infoPanel.style.visibility = 'hidden';
        }
        
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
        
        // 为移动端预先构建所有按钮，一次性添加，减少DOM操作
        const buttonsFragment = document.createDocumentFragment();
        
        // 创建分页按钮
        tabs.forEach((tab, index) => {
            const button = document.createElement('div');
            button.className = 'tab-button' + (index === 0 ? ' active' : '');
            button.setAttribute('data-tab', tab.id);
            button.innerHTML = tab.label;
            
            if (isMobile) {
                // 移动端使用点击事件代替hover事件，减少触发频率
                button.addEventListener('click', () => {
                    // 移除所有按钮的active类
                    document.querySelectorAll('.tab-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // 给当前按钮添加active类
                    button.classList.add('active');
                    
                    // 更新内容
                    updateInfoContent(tab.fields);
                });
            } else {
                // 桌面端保持原有的鼠标悬停事件
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
                
                // 添加触摸事件支持
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault(); // 防止默认行为
                    
                    // 移除所有按钮的active类
                    document.querySelectorAll('.tab-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // 给当前按钮添加active类
                    button.classList.add('active');
                    
                    // 更新内容
                    updateInfoContent(tab.fields);
                });
            }
            
            buttonsFragment.appendChild(button);
        });
        
        // 一次性添加所有按钮
        tabButtons.appendChild(buttonsFragment);
        
        // 显示初始内容
        updateInfoContent(tabs[0].fields);
        
        // 监听窗口大小变化，但为移动设备降低响应频率
        const resizeHandler = isMobile ? 
            debounce(() => updatePanelLayout(infoPanel), 250) : 
            () => updatePanelLayout(infoPanel);
        
        window.addEventListener('resize', resizeHandler);
        
        // 设置初始显示状态 - 根据开关设置
        const cardToggle = document.getElementById('solarTermCardToggle');
        if (cardToggle) {
            infoPanel.style.display = cardToggle.checked ? 'flex' : 'none';
        }
        
        // 移动端在最后一步再显示面板，避免闪烁
        if (isMobile) {
            // 使用requestAnimationFrame确保在下一帧渲染
            requestAnimationFrame(() => {
                infoPanel.style.visibility = 'visible';
            });
        }
    }

    // 修改updatePanelLayout函数，简化布局更新方式
    function updatePanelLayout(panel) {
        const isMobile = window.innerWidth <= 768;
        
        // 移除可能的mobile-panel类
        panel.classList.remove('mobile-panel');
        
        // 根据设备类型重设类名
        if (isMobile) {
            panel.classList.add('mobile-panel');
        }
        
        // 设置显示状态
        const cardToggle = document.getElementById('solarTermCardToggle');
        if (cardToggle) {
            panel.style.display = cardToggle.checked ? 'flex' : 'none';
        }
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
        
        // 创建节气卡片控件组
        const cardGroup = document.createElement('div');
        cardGroup.className = 'control-group';
        cardGroup.style.display = 'flex';
        cardGroup.style.flexDirection = 'column'; // 垂直排列
        cardGroup.style.alignItems = 'center';
        
        // 节气卡片文本标签
        const cardText = document.createElement('span');
        cardText.innerText = '节气卡片';
        cardText.style.fontSize = '12px';
        cardText.style.fontWeight = 'bold';
        cardText.style.color = '#d4af37';
        cardText.style.marginBottom = '5px';
        cardText.style.textAlign = 'center';
        
        // 创建节气卡片开关
        const cardToggleSwitch = document.createElement('label');
        cardToggleSwitch.className = 'switch';
        cardToggleSwitch.style.position = 'relative';
        cardToggleSwitch.style.display = 'inline-block';
        cardToggleSwitch.style.width = '30px';
        cardToggleSwitch.style.height = '16px';
        
        // 创建节气卡片复选框
        const cardCheckbox = document.createElement('input');
        cardCheckbox.type = 'checkbox';
        cardCheckbox.id = 'solarTermCardToggle';
        cardCheckbox.style.opacity = '0';
        cardCheckbox.style.width = '0';
        cardCheckbox.style.height = '0';
        
        // 设置默认状态：桌面端默认打开，移动端默认关闭
        const isMobile = window.innerWidth <= 768;
        cardCheckbox.checked = !isMobile;
        
        // 创建节气卡片滑块
        const cardSlider = document.createElement('span');
        cardSlider.className = 'slider round';
        cardSlider.style.position = 'absolute';
        cardSlider.style.cursor = 'pointer';
        cardSlider.style.top = '0';
        cardSlider.style.left = '0';
        cardSlider.style.right = '0';
        cardSlider.style.bottom = '0';
        cardSlider.style.backgroundColor = '#333';
        cardSlider.style.transition = '0.4s';
        cardSlider.style.borderRadius = '10px';
        
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
        
        cardToggleSwitch.appendChild(cardCheckbox);
        cardToggleSwitch.appendChild(cardSlider);
        cardGroup.appendChild(cardText);
        cardGroup.appendChild(cardToggleSwitch);
        
        headerControls.appendChild(rotateGroup);
        headerControls.appendChild(cardGroup);
        
        // 添加到文档中
        document.querySelector('.container').appendChild(headerControls);
        
        // 添加自动旋转事件监听
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                startAutoRotation();
            } else {
                stopAutoRotation();
            }
        });
        
        // 添加节气卡片事件监听
        cardCheckbox.addEventListener('change', function() {
            const infoPanel = document.querySelector('.solar-term-info-panel');
            
            if (this.checked) {
                // 打开节气卡片
                if (!infoPanel) {
                    // 如果不存在则创建
                    addSolarTermInfoPanel();
                } else {
                    // 如果已存在则显示
                    infoPanel.style.display = 'flex';
                }
            } else {
                // 关闭节气卡片
                if (infoPanel) {
                    infoPanel.style.display = 'none';
                }
            }
        });
        
        // 初始根据卡片开关显示或隐藏节气卡片
        if (cardCheckbox.checked) {
            // 如果开关打开，确保卡片显示
            if (!document.querySelector('.solar-term-info-panel')) {
                addSolarTermInfoPanel();
            } else {
                const existingPanel = document.querySelector('.solar-term-info-panel');
                existingPanel.style.display = 'flex';
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
        
        // 判断是否为移动设备
        const isMobile = window.innerWidth <= 768;
        
        // 初始化HTML构建数组，比字符串拼接更高效
        const contentParts = [];
        
        // 添加标题
        contentParts.push(`<div class="current-term">${currentTerm.name}</div>`);
        
        // 显示各字段内容
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
            
            if (fieldLabel) {
                contentParts.push(`<div class="info-item">
                    <span class="info-label">${fieldLabel}：</span>
                    <span class="info-value">${fieldContent}</span>
                </div>`);
            } else {
                contentParts.push(`<div class="info-item">
                    <span class="info-value">${fieldContent}</span>
                </div>`);
            }
        });
        
        // 如果是阳历时间页面，添加节气提示语到字段内容下方
        if (fields.includes('date')) {
            const beijingTime = getBeijingTime();
            const todayStr = beijingTime.toISOString().split('T')[0]; // 格式如 "2025-03-20"
            
            // 生成提示语
            let tips = '';
            if (todayStr === currentTerm.date) {
                tips += `<span class="highlight-tip">🌸 今日${currentTerm.name}有导师的节气课程哦！</span>`;                
            } else {
                tips += `<span class="next-term">下一个节气是【${nextTerm.name}】阳历日期：${formatDate(nextTerm.date)}，倒计时 <strong>${getDaysLeft(nextTerm.date)}</strong> 天</span>`;
            }
            
            contentParts.push(`<div class="tips-container">${tips}</div>`);
        }
        
        // 一次性更新DOM，减少重排
        infoContent.innerHTML = contentParts.join('');
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