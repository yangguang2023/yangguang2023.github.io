// ==== 全局统一资源管理器 ====
// 替换原有的简单资源跟踪数组和AnimationController

// 避免重复声明ResourceManager
if (typeof window.ResourceManager === 'undefined') {
    window.ResourceManager = {
        // 动画管理
        animations: {}, // 按类型分组存储动画ID
        
        // 定时器管理
        timers: [],
        
        // 事件监听器管理
        listeners: [],
        
        // DOM元素管理
        elements: [],
        
        // 注册动画
        registerAnimation(callback, type = 'default') {
            if (!this.animations[type]) this.animations[type] = [];
            const id = requestAnimationFrame(callback);
            this.animations[type].push(id);
            return id;
        },
        
        // 取消特定类型的动画
        cancelAnimation(type) {
            if (!this.animations[type]) return false;
            this.animations[type].forEach(id => {
                try {
                    cancelAnimationFrame(id);
                } catch (e) {
                    console.error("取消动画错误:", e);
                }
            });
            this.animations[type] = [];
            return true;
        },
        
        // 取消所有动画
        cancelAllAnimations() {
            Object.keys(this.animations).forEach(type => this.cancelAnimation(type));
            return true;
        },
        
        // 添加定时器
        setTimeout(callback, delay) {
            const id = setTimeout(callback, delay);
            this.timers.push(id);
            return id;
        },
        
        // 添加周期定时器
        setInterval(callback, delay) {
            const id = setInterval(callback, delay);
            this.timers.push(id);
            return id;
        },
        
        // 清除所有定时器
        clearAllTimers() {
            this.timers.forEach(id => {
                try {
                    clearTimeout(id);
                    clearInterval(id);
                } catch (e) {
                    console.error("清除定时器错误:", e);
                }
            });
            this.timers = [];
            return true;
        },
        
        // 添加事件监听器
        addEventListener(element, type, listener, options) {
            if (!element) return null;
            element.addEventListener(type, listener, options);
            this.listeners.push({ element, type, listener });
            return listener;
        },
        
        // 移除所有事件监听器
        removeAllEventListeners() {
            this.listeners.forEach(({ element, type, listener }) => {
                try {
                    if (element) element.removeEventListener(type, listener);
                } catch (e) {
                    console.error("移除事件监听器错误:", e);
                }
            });
            this.listeners = [];
            return true;
        },
        
        // 添加DOM元素
        addElement(element) {
            if (element) this.elements.push(element);
            return element;
        },
        
        // 创建元素
        createElement(tag, attributes = {}, parent = null) {
            const element = document.createElement(tag);
            
            // 设置属性
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'textContent') {
                    element.textContent = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            // 添加到父元素
            if (parent) {
                parent.appendChild(element);
            }
            
            // 添加到管理列表
            this.elements.push(element);
            return element;
        },
        
        // 清理所有元素
        clearAllElements() {
            this.elements.forEach(element => {
                try {
                    if (element && element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                } catch (e) {
                    console.error("清除DOM元素错误:", e);
                }
            });
            this.elements = [];
            return true;
        },
        
        // 按类型清理资源
        clearResourcesByType(type) {
            switch(type) {
                case 'animations':
                    return this.cancelAllAnimations();
                case 'timers':
                    return this.clearAllTimers();
                case 'listeners':
                    return this.removeAllEventListeners();
                case 'elements':
                    return this.clearAllElements();
                case 'all':
                    this.cancelAllAnimations();
                    this.clearAllTimers();
                    this.removeAllEventListeners();
                    this.clearAllElements();
                    return true;
                default:
                    return false;
            }
        },
        
        // 清理所有资源
        clearAll() {
            return this.clearResourcesByType('all');
        },
        
        // 检查特定类型的动画是否在运行
        isAnimationRunning(type) {
            return this.animations[type] && this.animations[type].length > 0;
        },
        
        // 获取当前状态
        getStatus() {
            return {
                animationTypes: Object.keys(this.animations),
                timerCount: this.timers.length,
                listenerCount: this.listeners.length,
                elementCount: this.elements.length
            };
        }
    };
}

// 动画控制管理器 - 使用ResourceManager
if (typeof window.AnimationController === 'undefined') {
    window.AnimationController = {
        // 启动惯性动画
        startInertia: function(callback) {
            try {
                window.ResourceManager.cancelAnimation('inertia');
                return window.ResourceManager.registerAnimation(callback, 'inertia');
            } catch (error) {
                console.error("启动惯性动画失败:", error);
                return null;
            }
        },
        
        // 启动自动旋转动画
        startAutoRotation: function(callback) {
            try {
                window.ResourceManager.cancelAnimation('autoRotation');
                return window.ResourceManager.registerAnimation(callback, 'autoRotation');
            } catch (error) {
                console.error("启动自动旋转失败:", error);
                return null;
            }
        },
        
        // 停止特定动画
        stopAnimation: function(type) {
            try {
                return window.ResourceManager.cancelAnimation(type);
            } catch (error) {
                console.error("停止动画失败:", error);
                return false;
            }
        },
        
        // 停止所有动画
        stopAll: function() {
            try {
                return window.ResourceManager.cancelAllAnimations();
            } catch (error) {
                console.error("停止所有动画失败:", error);
                return false;
            }
        },
        
        // 强制停止所有动画（应急方案）
        forceStopAll: function() {
            try {
                return window.ResourceManager.cancelAllAnimations();
            } catch (error) {
                return false;
            }
        },
        
        // 获取当前动画状态
        getStatus: function() {
            return {
                isInertiaRunning: window.ResourceManager.isAnimationRunning('inertia'),
                isAutoRotationRunning: window.ResourceManager.isAnimationRunning('autoRotation')
            };
        },
        
        // 检查指定动画是否正在运行
        isRunning: function(type) {
            return window.ResourceManager.isAnimationRunning(type);
        }
    };
}

// 兼容函数 - 替代现有的safeSetTimeout等函数
function safeSetTimeout(callback, delay) {
    return window.ResourceManager.setTimeout(callback, delay);
}

function safeSetInterval(callback, delay) {
    return window.ResourceManager.setInterval(callback, delay);
}

function safeAnimationFrame(callback, type = 'default') {
    return window.ResourceManager.registerAnimation(callback, type);
}

function clearAllManagedResources(type = 'all') {
    return window.ResourceManager.clearResourcesByType(type);
}

// 监听页面可见性变化
ResourceManager.addEventListener(document, 'visibilitychange', function() {
  if (document.hidden) {
    // 页面不可见时清理资源
    ResourceManager.cancelAllAnimations();
  } else {
    // 页面可见时恢复必要的功能
    if (typeof refreshTimeAndUpdateInfo === 'function') {
      refreshTimeAndUpdateInfo();
    }
    
    // 如果自动旋转功能曾经开启，可以重新启动
    if (window.wasAutoRotating) {
      if (typeof startAutoRotation === 'function') {
        startAutoRotation();
      }
    }
  }
});

// 页面卸载时清理
ResourceManager.addEventListener(window, 'beforeunload', function() {
  ResourceManager.clearAll();
});

document.addEventListener('DOMContentLoaded', function() {
    // 日志控制系统 - 生产环境中设置为false可禁用所有日志输出
    const DEBUG_MODE = false;
    
    // 全局变量定义区域 - 将关键变量定义在顶部
    let solarTerms2025 = [];
    let solarTerms2026 = [];
    let solarTermsInitialized = false;
    let refreshInterval = null; // 明确定义为局部变量，但在闭包内全局可见
    
    // 检查localStorage中是否存在初始化标记
    try {
        solarTermsInitialized = localStorage.getItem('solarTermsInitialized') === 'true';
        log("从localStorage读取初始化状态: " + (solarTermsInitialized ? "已初始化" : "未初始化"));
    } catch (e) {
        log("无法读取localStorage，将使用内存中的初始化状态");
    }
    
    // 自定义日志函数，只在调试模式下输出日志
    function log(...args) {
        if (DEBUG_MODE) {
            console.log("[节气罗盘]", ...args);
        }
    }
    
    // 增强的DOM元素缓存系统 - 减少重复的DOM查询
    const domCache = {
        // 存储DOM引用的Map
        elements: new Map(),
        
        // 获取元素，如果不存在则查询并缓存
        get: function(selector, parent = document) {
            try {
                if (!selector) return null;
                
                const cacheKey = parent === document ? selector : `${parent.id || 'parent'}-${selector}`;
                
                if (this.elements.has(cacheKey)) {
                    return this.elements.get(cacheKey);
                }
                
                const element = parent.querySelector(selector);
                if (element) {
                    this.elements.set(cacheKey, element);
                }
                return element;
            } catch (error) {
                log("DOM缓存get错误:", error);
                // 尝试直接查询，不缓存
                return parent.querySelector(selector);
            }
        },
        
        // 获取多个元素
        getAll: function(selector, parent = document) {
            try {
                if (!selector) return [];
                
                const cacheKey = `all-${parent === document ? selector : `${parent.id || 'parent'}-${selector}`}`;
                
                if (this.elements.has(cacheKey)) {
                    return this.elements.get(cacheKey);
                }
                
                const elements = Array.from(parent.querySelectorAll(selector));
                this.elements.set(cacheKey, elements);
                return elements;
            } catch (error) {
                log("DOM缓存getAll错误:", error);
                // 尝试直接查询，不缓存
                return Array.from(parent.querySelectorAll(selector));
            }
        },
        
        // 清除特定选择器的缓存
        clear: function(selector) {
            try {
                if (selector) {
                    this.elements.delete(selector);
                    this.elements.delete(`all-${selector}`);
                } else {
                    this.elements.clear(); // 清除所有缓存
                }
            } catch (error) {
                log("DOM缓存clear错误:", error);
            }
        },
        
        // 更新缓存中的元素
        update: function(selector, element) {
            try {
                const cacheKey = selector;
                this.elements.set(cacheKey, element);
                return element;
            } catch (error) {
                log("DOM缓存update错误:", error);
                return element;
            }
        },
        
        // 创建并缓存元素
        create: function(tagName, attributes = {}, parent = null) {
            try {
                const element = document.createElement(tagName);
                
                // 设置属性
                Object.entries(attributes).forEach(([key, value]) => {
                    if (key === 'className') {
                        element.className = value;
                    } else if (key === 'textContent') {
                        element.textContent = value;
                    } else if (key === 'innerHTML') {
                        element.innerHTML = value;
                    } else if (key === 'style' && typeof value === 'object') {
                        Object.assign(element.style, value);
                    } else if (key === 'cssText') {
                        element.style.cssText = value;
                    } else {
                        element.setAttribute(key, value);
                    }
                });
                
                // 添加到父元素
                if (parent) {
                    if (typeof parent === 'string') {
                        const parentElement = this.get(parent);
                        if (parentElement) {
                            parentElement.appendChild(element);
                        }
                    } else {
                        parent.appendChild(element);
                    }
                }
                
                // 使用ID或生成唯一ID进行缓存
                if (attributes.id) {
                    this.update(`#${attributes.id}`, element);
                }
                
                return element;
            } catch (error) {
                log("DOM缓存create错误:", error);
                return document.createElement(tagName);
            }
        },
        
        // 批量创建元素
        createBatch: function(elements, parent = null) {
            try {
                const fragment = document.createDocumentFragment();
                const createdElements = [];
                
                elements.forEach(config => {
                    const element = this.create(config.tag, config.attributes);
                    fragment.appendChild(element);
                    createdElements.push(element);
                });
                
                if (parent) {
                    if (typeof parent === 'string') {
                        const parentElement = this.get(parent);
                        if (parentElement) {
                            parentElement.appendChild(fragment);
                        }
                    } else {
                        parent.appendChild(fragment);
                    }
                }
                
                return createdElements;
            } catch (error) {
                log("DOM缓存createBatch错误:", error);
                return [];
            }
        },
        
        // 安全地删除元素
        remove: function(selector) {
            try {
                const element = this.get(selector);
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                this.elements.delete(selector);
                return true;
            } catch (error) {
                log("DOM缓存remove错误:", error);
                return false;
            }
        }
    };
    
    // 中国传统罗盘上的文字
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

    // 节气数据及映射关系
    let solarTermToCompassMapping = {
        "冬至": 0, "小寒": 0,
        "大寒": 1, "立春": 1,
        "启蛰": 2, "古雨水": 2, "雨水": 2,
        "春分": 3, "古谷雨": 3, "谷雨": 3,
        "古清明": 4, "清明": 4, "立夏": 4,
        "小满": 5, "芒种": 5,
        "夏至": 6, "小暑": 6,
        "大暑": 7, "立秋": 7,
        "处暑": 8, "白露": 8,
        "秋分": 9, "寒露": 9,
        "霜降": 10, "立冬": 10,
        "小雪": 11, "大雪": 11
    };
    let solarTermData = [];

    // 检查localStorage中是否存在初始化标记
    try {
        solarTermsInitialized = localStorage.getItem('solarTermsInitialized') === 'true';
        log("从localStorage读取初始化状态: " + (solarTermsInitialized ? "已初始化" : "未初始化"));
    } catch (e) {
        log("无法读取localStorage，将使用内存中的初始化状态");
    }
    
    // 硬编码节气数据，无需从外部JSON文件加载
    function loadSolarTermData() {
        try {
            // 如果数据已经初始化成功且内存中有数据，直接返回
            if (solarTermsInitialized && 
                Array.isArray(solarTerms2025) && solarTerms2025.length === 24 && 
                Array.isArray(solarTerms2026) && solarTerms2026.length === 24) {
                log("节气数据已经正确初始化，跳过加载");
                
                // 确保window对象也有数据
                if (!window.solarTerms2025 || !window.solarTerms2026) {
                    window.solarTerms2025 = JSON.parse(JSON.stringify(solarTerms2025));
                    window.solarTerms2026 = JSON.parse(JSON.stringify(solarTerms2026));
                    log("同步现有数据到window对象");
                }
                
                return true;
            }
            
            log("使用硬编码的节气数据");
            
            // 2025年节气数据
            solarTerms2025 = [
                { name: "立春", date: "2025-02-03T22:10:13+08:00" },
                { name: "启蛰", date: "2025-02-18T18:06:18+08:00" },
                { name: "古雨水", date: "2025-03-05T16:07:02+08:00" },
                { name: "春分", date: "2025-03-20T17:01:14+08:00" },
                { name: "古谷雨", date: "2025-04-04T20:48:21+08:00" },
                { name: "古清明", date: "2025-04-20T03:55:45+08:00" },
                { name: "立夏", date: "2025-05-05T13:56:57+08:00" },
                { name: "小满", date: "2025-05-21T02:54:23+08:00" },
                { name: "芒种", date: "2025-06-05T17:56:16+08:00" },
                { name: "夏至", date: "2025-06-21T10:42:00+08:00" },
                { name: "小暑", date: "2025-07-07T04:04:43+08:00" },
                { name: "大暑", date: "2025-07-22T21:29:11+08:00" },
                { name: "立秋", date: "2025-08-07T13:51:19+08:00" },
                { name: "处暑", date: "2025-08-23T04:33:35+08:00" },
                { name: "白露", date: "2025-09-07T16:51:41+08:00" },
                { name: "秋分", date: "2025-09-23T02:19:04+08:00" },
                { name: "寒露", date: "2025-10-08T08:40:57+08:00" },
                { name: "霜降", date: "2025-10-23T11:50:39+08:00" },
                { name: "立冬", date: "2025-11-07T12:03:48+08:00" },
                { name: "小雪", date: "2025-11-22T09:35:18+08:00" },
                { name: "大雪", date: "2025-12-07T05:04:20+08:00" },
                { name: "冬至", date: "2025-12-21T23:02:48+08:00" },
                { name: "小寒", date: "2026-01-05T16:22:53+08:00" },
                { name: "大寒", date: "2026-01-20T09:44:39+08:00" }
            ];
            
            // 2026年节气数据
            solarTerms2026 = [
                { name: "立春", date: "2026-02-04T04:01:22+08:00" },
                { name: "启蛰", date: "2026-02-18T23:55:11+08:00" },
                { name: "古雨水", date: "2026-03-05T21:58:33+08:00" },
                { name: "春分", date: "2026-03-20T22:45:09+08:00" },
                { name: "古谷雨", date: "2026-04-04T02:39:47+08:00" },
                { name: "古清明", date: "2026-04-20T09:55:12+08:00" },
                { name: "立夏", date: "2026-05-05T19:48:19+08:00" },
                { name: "小满", date: "2026-05-21T08:43:57+08:00" },
                { name: "芒种", date: "2026-06-05T23:40:05+08:00" },
                { name: "夏至", date: "2026-06-21T16:24:37+08:00" },
                { name: "小暑", date: "2026-07-07T09:56:18+08:00" },
                { name: "大暑", date: "2026-07-23T03:18:44+08:00" },
                { name: "立秋", date: "2026-08-07T19:42:11+08:00" },
                { name: "处暑", date: "2026-08-23T10:11:29+08:00" },
                { name: "白露", date: "2026-09-07T22:30:55+08:00" },
                { name: "秋分", date: "2026-09-23T07:58:12+08:00" },
                { name: "寒露", date: "2026-10-08T14:12:33+08:00" },
                { name: "霜降", date: "2026-10-23T17:20:08+08:00" },
                { name: "立冬", date: "2026-11-07T17:35:44+08:00" },
                { name: "小雪", date: "2026-11-22T15:08:27+08:00" },
                { name: "大雪", date: "2026-12-07T10:38:19+08:00" },
                { name: "冬至", date: "2026-12-22T04:35:55+08:00" },
                { name: "小寒", date: "2027-01-05T22:09:33+08:00" },
                { name: "大寒", date: "2027-01-20T15:23:47+08:00" }
            ];
            
            // 确保2025年的最后两个节气正确包含跨年数据（2026年1月）
            const xiaohForJan2026 = solarTerms2025.find(term => term.name === "小寒");
            if (xiaohForJan2026) {
                log("确认2026年1月5日是小寒节气:", xiaohForJan2026.date);
            } else {
                log("错误: 未找到2026年1月5日的小寒节气数据");
            }
            
            // 验证数据完整性
            if (solarTerms2025.length === 24 && solarTerms2026.length === 24) {
                solarTermsInitialized = true;
                // 将初始化状态保存到localStorage
                try {
                    localStorage.setItem('solarTermsInitialized', 'true');
                    log("节气数据初始化状态已保存到localStorage");
                    
                    // 确保同步到window对象
                    window.solarTerms2025 = JSON.parse(JSON.stringify(solarTerms2025));
                    window.solarTerms2026 = JSON.parse(JSON.stringify(solarTerms2026));
                    window.solarTermsInitialized = true;
                } catch (e) {
                    log("无法保存初始化状态到localStorage:", e);
                }
                log("节气数据加载成功，共有2025年:", solarTerms2025.length, "个节气，2026年:", solarTerms2026.length, "个节气");
            } else {
                log("警告: 节气数据不完整 - 2025年:", solarTerms2025.length, "个节气，2026年:", solarTerms2026.length, "个节气");
            }
            
            return solarTermsInitialized;
        } catch (error) {
            solarTermsInitialized = false;
            try {
                localStorage.removeItem('solarTermsInitialized');
            } catch (e) {
                // 忽略localStorage错误
            }
            log("加载节气数据失败:", error);
            return false;
        }
    }
    
    // 将loadSolarTermData暴露为全局函数
    window.loadSolarTermData = loadSolarTermData;

    // 使用回退数据（硬编码）- 简化版
    function useFallbackData() {
        log("使用备用节气数据");
        
        // 直接调用loadSolarTermData函数来加载完整硬编码数据
        loadSolarTermData();
    }

    // 获取当前时间和日期的统一函数
    function getBeijingTime(format = 'date') {
        try {
            // 强制创建新的Date对象，确保每次都是最新时间
        const now = new Date();
            
            // 强制系统刷新时间
            now.setTime(Date.now());
            
            log("获取最新系统时间:", now.toLocaleString());
            
            // 根据请求的格式返回不同类型的结果
            if (format === 'date') {
                // 返回Date对象
                return now;
            } else if (format === 'dateStr') {
                // 返回标准格式字符串 YYYY-MM-DD
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const day = now.getDate();
                
                // 确保月和日是两位数
                const formattedMonth = month < 10 ? `0${month}` : month;
                const formattedDay = day < 10 ? `0${day}` : day;
                
                const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
                log("格式化的日期字符串:", dateStr);
                
                return dateStr;
            } else if (format === 'full') {
                // 返回一个包含日期对象和格式化字符串的完整信息对象
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const day = now.getDate();
                const formattedMonth = month < 10 ? `0${month}` : month;
                const formattedDay = day < 10 ? `0${day}` : day;
                const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
                
                return {
                    date: now,
                    dateStr: dateStr,
                    year: year,
                    month: month,
                    day: day,
                    formattedDate: formatCurrentDate(now)
                };
            }
            
            // 默认返回Date对象
            return now;
        } catch (error) {
            log("获取北京时间时发生错误:", error);
            // 返回当前系统时间作为备用
            return new Date();
        }
    }
    
    // 获取当前日期的标准格式字符串 YYYY-MM-DD - 保留为兼容性封装
    function getCurrentDateStr() {
        return getBeijingTime('dateStr');
    }

    // 添加一个函数专门处理特殊日期的节气识别
    function handleSpecialSolarTermDates(today) {
        // 检查是否是2026-01-05（小寒特殊日期）
        if (today === "2026-01-05") {
            // 在2025年的节气数据中查找小寒
            const xiaohTerm = solarTerms2025.find(term => term.name === "小寒");
            if (xiaohTerm) {
                log("特殊日期处理: 检测到2026-01-05，确认为小寒节气");
                const nextTerm = solarTerms2025.find(term => term.name === "大寒");
                return {
                    currentTerm: xiaohTerm,
                    nextTerm: nextTerm || solarTerms2026[0]
                };
            }
        }
        return null; // 不是特殊日期，返回null
    }
    
    // 获取当前或下一个节气
    function getCurrentSolarTerm() {
        try {
            // 先检查localStorage中的初始化状态
            if (!solarTermsInitialized) {
                try {
                    const storedInitStatus = localStorage.getItem('solarTermsInitialized') === 'true';
                    solarTermsInitialized = storedInitStatus;
                    log("从localStorage读取初始化状态: " + (storedInitStatus ? "已初始化" : "未初始化"));
                    
                    // 同步window全局变量
                    if (typeof window.solarTermsInitialized !== 'undefined') {
                        window.solarTermsInitialized = storedInitStatus;
                    }
                    
                    // 检查window对象是否有可用的节气数据
                    const windowDataAvailable = window.solarTerms2025 && Array.isArray(window.solarTerms2025) && 
                        window.solarTerms2025.length > 0 && window.solarTerms2026 && Array.isArray(window.solarTerms2026) && 
                        window.solarTerms2026.length > 0;
                        
                    if (windowDataAvailable) {
                        log("从window对象加载节气数据");
                        solarTerms2025 = window.solarTerms2025.slice();
                        solarTerms2026 = window.solarTerms2026.slice();
                        solarTermsInitialized = true;
                    }
                } catch (e) {
                    log("读取localStorage或同步window对象时出错:", e);
                }
            }
            
            // 确保使用完整的硬编码节气数据
            if (!solarTermsInitialized || !Array.isArray(solarTerms2025) || solarTerms2025.length === 0 || 
                !Array.isArray(solarTerms2026) || solarTerms2026.length === 0) {
                log("错误: 节气数据未正确初始化，尝试重新加载");
                const success = loadSolarTermData();
                
                // 再次检查数据是否已加载
                if (!success || !solarTermsInitialized || 
                    !Array.isArray(solarTerms2025) || solarTerms2025.length === 0 || 
                    !Array.isArray(solarTerms2026) || solarTerms2026.length === 0) {
                    log("严重错误: 无法初始化节气数据，使用默认值");
                    // 直接初始化简单的默认数据，避免页面崩溃
                    solarTerms2025 = [
                        { name: "未知节气", date: new Date().toISOString() }
                    ];
                    solarTerms2026 = [
                        { name: "未知节气", date: new Date().toISOString() }
                    ];
                    // 同步到window对象并确保是深拷贝
                    window.solarTerms2025 = JSON.parse(JSON.stringify(solarTerms2025));
                    window.solarTerms2026 = JSON.parse(JSON.stringify(solarTerms2026));
                    return {
                        currentTerm: { name: "未知节气", date: new Date().toISOString() },
                        nextTerm: { name: "未知节气", date: new Date().toISOString() }
                    };
                } else {
                    // 将成功加载的数据同步到window对象并确保是深拷贝
                    window.solarTerms2025 = JSON.parse(JSON.stringify(solarTerms2025));
                    window.solarTerms2026 = JSON.parse(JSON.stringify(solarTerms2026));
                    window.solarTermsInitialized = true;
                    log("数据成功加载并同步到window对象");
                }
            }
            
            // 获取当前时间作为Date对象
            const now = new Date();
            const nowTimestamp = now.getTime();
            
            // 获取当前日期字符串（仅日期部分，不含时间）
            const todayStr = getBeijingTime('dateStr');  // 格式：YYYY-MM-DD
            
            log("获取节气信息 - 检测当前时间:", now.toISOString(), "日期:", todayStr, "年份:", now.getFullYear());
            
            // 首先检查是否是特殊日期（如2026-01-05的小寒）
            const specialDateResult = handleSpecialSolarTermDates(todayStr);
            if (specialDateResult) {
                return specialDateResult;
            }
            
            // === 简化的节气判断逻辑 ===
            // 1. 合并2025和2026年的节气数据
            const allSolarTerms = [...solarTerms2025, ...solarTerms2026];
            
            // 2. 按日期排序
            allSolarTerms.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // 3. 转换为日期对象数组以便比较
            const allSolarTermsWithDate = allSolarTerms.map(term => ({
                ...term,
                dateObj: new Date(term.date)
            }));
            
            // 4. 首先检查今天是否恰好是某个节气日
            for (let i = 0; i < allSolarTermsWithDate.length; i++) {
                const term = allSolarTermsWithDate[i];
                const termDateStr = term.date.split('T')[0]; // 提取日期部分
                
                if (termDateStr === todayStr) {
                    // 今天正好是某个节气日
                    log("今天正是节气日！节气名称:", term.name);
                    
                    // 确定下一个节气，如果是最后一个就取第一个
                    const nextTerm = (i === allSolarTermsWithDate.length - 1)
                        ? allSolarTerms[0]
                        : allSolarTerms[i + 1];
                        
                    return { currentTerm: term, nextTerm };
                }
            }
            
            // 5. 找到下一个节气
            const nextTermIndex = allSolarTermsWithDate.findIndex(term => 
                term.dateObj.getTime() > nowTimestamp
            );
            
            // 如果找不到下一个节气（当前是最后一个），使用第一个作为下一个
            if (nextTermIndex === -1) {
                log("警告: 未找到下一个节气，使用第一个节气作为下一个节气");
                return {
                    currentTerm: allSolarTerms[allSolarTerms.length - 1],
                    nextTerm: allSolarTerms[0]
                };
            }
            
            // 6. 当前节气是下一个节气的前一个（如果下一个是第一个，则当前是最后一个）
            const currentTerm = (nextTermIndex === 0)
                ? allSolarTerms[allSolarTerms.length - 1]
                : allSolarTerms[nextTermIndex - 1];
                
            const nextTerm = allSolarTerms[nextTermIndex];
            
            log("节气判断 - 当前节气:", currentTerm.name, "日期:", currentTerm.date.split('T')[0], 
                "下一节气:", nextTerm.name, "日期:", nextTerm.date.split('T')[0]);
                
            return { currentTerm, nextTerm };
        } catch (error) {
            log("获取当前节气信息时发生错误:", error);
            // 返回一个安全的默认值，避免程序崩溃
            return { 
                currentTerm: { name: "未知节气", date: new Date().toISOString() }, 
                nextTerm: { name: "未知节气", date: new Date().toISOString() }
            };
        }
    }

    // 辅助函数：计算剩余天数
    function getDaysLeft(targetDateStr) {
        try {
            // 将目标日期字符串直接解析为Date对象
            const targetDate = new Date(targetDateStr);
            
            // 获取当前时间
            const currentDate = new Date();
            
            // 计算时间差（毫秒）
            const diffMs = targetDate - currentDate;
            
            // 转换为天数，使用Math.ceil向上取整（如果差值不足一天，也算作"距离1天"）
            const days = Math.ceil(diffMs / (1000 * 3600 * 24));
            
            log("倒计时计算 - 目标日期:", targetDateStr, "当前日期:", currentDate.toISOString(), "差异天数:", days);
            
            return days > 0 ? days : 0; // 确保不返回负数
        } catch (error) {
            log("计算剩余天数时发生错误:", error);
            return 0;
        }
    }

    // 辅助函数：格式化日期（将 "2025-02-03T22:10:13+08:00" 转为 "2月3日"）
    function formatDate(dateStr) {
        try {
            // 从ISO格式的日期字符串中提取日期部分
            const date = new Date(dateStr);
            const month = date.getMonth() + 1; // 获取月份 (0-11) + 1
            const day = date.getDate(); // 获取日期 (1-31)
            
            return `${month}月${day}日`;
        } catch (error) {
            log("格式化日期时发生错误:", error);
            // 使用字符串分割作为备选方案
            const datePart = dateStr.split('T')[0];
            const [year, month, day] = datePart.split('-');
            return `${parseInt(month)}月${parseInt(day)}日`;
        }
    }

    // 根据当前节气旋转罗盘
    function rotateCompassToCurrentSolarTerm() {
        try {
            // 获取当前节气信息
            const { currentTerm } = getCurrentSolarTerm();
            if (!currentTerm) {
                log("警告: 无法获取当前节气信息");
                return false;
            }
        
            // 查找当前节气在罗盘上的位置
            let solarTermIndex = solarTermToCompassMapping[currentTerm.name];
            if (typeof solarTermIndex === 'undefined') {
                log("警告: 当前节气在映射表中未找到:", currentTerm.name);
                
                // 对特殊节气名称进行特殊处理
                if (currentTerm.name === "古雨水") {
                    solarTermIndex = solarTermToCompassMapping["雨水"];
                    log("使用'雨水'的映射位置代替'古雨水'");
                } else if (currentTerm.name === "古谷雨") {
                    solarTermIndex = solarTermToCompassMapping["谷雨"];
                    log("使用'谷雨'的映射位置代替'古谷雨'");
                } else if (currentTerm.name === "古清明") {
                    solarTermIndex = solarTermToCompassMapping["清明"];
                    log("使用'清明'的映射位置代替'古清明'");
                } else {
                    // 如果仍然找不到映射，使用默认值
                    solarTermIndex = 0; // 默认使用冬至位置
                    log("使用默认位置(冬至)");
                }
            }
            
            // 计算旋转角度：索引×30度的位置要旋转到顶部（270度或-90度）
            const rotationAngle = 270 - (solarTermIndex * 30);
            
            // 停止任何正在进行的动画 - 安全检查AnimationController
            try {
                if (typeof AnimationController !== 'undefined' && AnimationController && typeof AnimationController.stopAll === 'function') {
                    AnimationController.stopAll();
                } else if (typeof ResourceManager !== 'undefined' && ResourceManager) {
                    // 直接使用ResourceManager作为备选
                    if (typeof ResourceManager.cancelAllAnimations === 'function') {
                        ResourceManager.cancelAllAnimations();
                    }
                }
            } catch (animError) {
                log("停止动画时出错:", animError);
                // 继续执行，不影响罗盘旋转
            }
            
            // 使用通用旋转函数应用旋转，带有过渡效果
            try {
                if (typeof applyRotation === 'function') {
                    applyRotation(rotationAngle, true);
                } else {
                    // 备选方案：直接设置旋转
                    const compassInner = document.querySelector('.compass-inner');
                    if (compassInner) {
                        compassInner.style.transition = 'transform 1s ease-out';
                        compassInner.style.transform = `rotate(${rotationAngle}deg)`;
                        
                        // 更新全局旋转状态
                        if (typeof window.currentRotation !== 'undefined') {
                            window.currentRotation = rotationAngle;
                        }
                    }
                }
            } catch (rotateError) {
                log("应用旋转时出错:", rotateError);
                return false;
            }
            
            log(`已旋转罗盘到当前节气:${currentTerm.name}，索引:${solarTermIndex}，角度:${rotationAngle}度`);
            return true;
        } catch (error) {
            log("旋转罗盘到当前节气时发生错误:", error);
            
            // 尝试恢复默认位置
            try {
                if (typeof applyRotation === 'function') {
                    applyRotation(0, false);
                } else {
                    const compassInner = document.querySelector('.compass-inner');
                    if (compassInner) {
                        compassInner.style.transition = 'none';
                        compassInner.style.transform = 'rotate(0deg)';
                    }
                }
            } catch (e) {
                // 忽略恢复错误
                log("恢复默认位置时出错:", e);
            }
            
            return false;
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
        try {
            // 先检查compass元素是否存在
            const compass = domCache.get('.compass') || document.querySelector('.compass');
            if (!compass) {
                log("错误: 找不到.compass元素，无法创建扇形区域");
                return false;
            }
            
            // 确保.compass-inner元素存在，如果不存在则创建
            let compassInner = domCache.get('.compass-inner') || document.querySelector('.compass-inner');
            if (!compassInner) {
                log("警告: 找不到.compass-inner元素，尝试创建");
                compassInner = document.createElement('div');
                compassInner.className = 'compass-inner';
                compassInner.style.cssText = `
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform-origin: center center;
                    transition: none;
                    backface-visibility: hidden;
                    webkit-backface-visibility: hidden;
                    transform-style: flat;
                    webkit-transform-style: flat;
                `;
                compass.appendChild(compassInner);
                domCache.update('.compass-inner', compassInner);
            }
            
            let segmentSector = document.querySelector('.segment-sector');
            
            // 如果不存在扇形容器，创建一个
            if (!segmentSector) {
                segmentSector = document.createElement('div');
                segmentSector.className = 'segment-sector';
                try {
                    compassInner.appendChild(segmentSector);
                } catch (e) {
                    log("错误: 无法将扇形容器添加到罗盘内部元素", e);
                    return false;
                }
            }
            
            // 清空现有的扇形
            segmentSector.innerHTML = '';
            
            // 检测是否为移动设备
            const isMobileDevice = checkIfMobile();
            
            // 创建12个扇形
            for (let i = 0; i < 12; i++) {
                try {
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
                        if (typeof isDragging === 'undefined' || !isDragging) {  // 增加对isDragging的检查
                            e.stopPropagation();
                            log(`点击了第 ${i + 1} 个扇区`);
                            if (segmentLinks && segmentLinks[i] && segmentLinks[i].url) {
                                window.open(segmentLinks[i].url, '_blank');
                            }
                        }
                    });
                    
                    // 添加简单的悬浮效果
                    sector.addEventListener('mouseenter', () => {
                        if (typeof isDragging === 'undefined' || !isDragging) {  // 增加对isDragging的检查
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
                    
                    try {
                        segmentSector.appendChild(sector);
                    } catch (e) {
                        log(`错误: 无法将第${i+1}个扇形添加到容器`, e);
                    }
                } catch (sectorError) {
                    log(`错误: 创建第${i+1}个扇形时出错`, sectorError);
                }
            }
            
            return segmentSector;
        } catch (error) {
            log("错误: 创建扇形区域失败", error);
            return false;
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

    // 添加通用旋转相关函数
    // 通用旋转函数，用于所有旋转相关操作
    function applyRotation(angle, withTransition = false) {
        try {
            // 更新当前旋转角度，确保在0-360范围内
            currentRotation = angle % 360;
            if (currentRotation < 0) currentRotation += 360;
            
            // 获取罗盘内部元素
            const compassInner = domCache.get('.compass-inner') || document.querySelector('.compass-inner');
            if (!compassInner) {
                log("错误: 找不到.compass-inner元素，无法应用旋转");
                return false;
            }
            
            // 设置过渡效果
            if (withTransition) {
                compassInner.style.transition = 'transform 0.5s ease';
            } else {
                compassInner.style.transition = 'none';
            }
            
            // 应用旋转
            compassInner.style.transform = `rotate(${currentRotation}deg)`;
            
            return true;
        } catch (error) {
            log("应用旋转时发生错误:", error);
            return false;
        }
    }
    
    // 优化的惯性动画函数
    function startInertiaAnimation(initialVelocity, maxDuration = 3000) {
        try {
            // 清除可能正在进行的其他动画
            AnimationController.stopAll();
            
            const startTime = Date.now();
            const startRotation = currentRotation;
            
            // 定义应用惯性效果的函数
            function animateInertia() {
                try {
                    const now = Date.now();
                    const elapsedTime = now - startTime;
                    
                    // 如果超过最大时间，停止动画
                    if (elapsedTime >= maxDuration) {
                        return;
                    }
                    
                    // 计算当前时刻的减速惯性速度（指数衰减）
                    const velocity = initialVelocity * Math.exp(-elapsedTime / 500);
                    
                    // 如果速度已经很小，停止惯性
                    if (Math.abs(velocity) < 0.1) {
                        return;
                    }
                    
                    // 更新旋转角度并应用
                    const newRotation = currentRotation + velocity;
                    applyRotation(newRotation);
                    
                    // 继续动画
                    AnimationController.startInertia(animateInertia);
                } catch (error) {
                    log("惯性动画过程中发生错误:", error);
                    // 错误恢复：停止动画
                    AnimationController.stopAnimation('inertia');
                }
            }
            
            // 启动动画
            AnimationController.startInertia(animateInertia);
            return true;
        } catch (error) {
            log("启动惯性动画时发生错误:", error);
            return false;
        }
    }
    
    // 停止所有动画的辅助函数
    function stopAllAnimations() {
        // 停止所有动画和效果
        clearAllManagedResources('animations');
        
        // 重置相关状态标志
        isAutoRotating = false;
        isDragging = false;
        
        // 移除任何视觉指示器
        const compass = document.querySelector('.compass');
        if (compass) {
            compass.classList.remove('auto-rotating', 'dragging');
        }
    }
    
    // 优化后的拖动结束处理函数
    function endDragWithInertia() {
        // 增强现有函数逻辑，兼容所有调用场景
        if (!lastMousePosition || !isDragging) return;
        
        const now = Date.now();
        const deltaTime = now - lastDragTime;
        
        // 计算角速度
        if (deltaTime > 0 && deltaTime < 100) {
            const velocity = (currentAngle - previousAngle) / deltaTime;
            startInertiaAnimation(velocity);
        }
        
        // 重置拖动状态
        isDragging = false;
        lastMousePosition = null;
        document.body.style.cursor = 'default';
        
        // 移除拖动指示器
        const compass = document.querySelector('.compass');
        if (compass) {
            compass.classList.remove('dragging');
        }
    }

    // 鼠标事件 - 在旋转区域上生效 - 只在非移动设备上启用
    rotateArea.addEventListener('mousedown', function(e) {
        // 移动设备不启用旋转功能
        if (isMobile) {
            return;
        }
        
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

    // 触摸设备支持 - 移动设备上禁用
    let lastTouchX = 0;
    let lastTouchY = 0;

    rotateArea.addEventListener('touchstart', function(e) {
        // 移动设备不启用旋转功能
        if (isMobile) {
            return;
        }
        
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
        try {
        if (!isDragging) return;
        
        isDragging = false;
        startAngle = null;
        
        // 恢复鼠标样式
        rotateArea.style.cursor = 'grab';
            
        // 移除拖动标记类
        compass.classList.remove('dragging');
        
        // 清除可能正在进行的惯性动画
            AnimationController.stopAnimation('inertia');
            
            // 使用DOM缓存获取元素
            const compassInner = domCache.get('.compass-inner');
            if (!compassInner) {
                log("警告: 找不到罗盘内部容器");
                return false;
            }
        
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
                    try {
                const now = Date.now();
                const elapsedTime = now - startTime;
                
                // 如果超过最大惯性时间，或速度已经很小，则停止惯性
                if (elapsedTime >= maxInertiaTime) {
                    return;
                }
                
                // 计算当前时刻的减速惯性速度
                // 使用指数衰减函数，提供更自然的减速感
                const velocity = initialVelocity * Math.exp(-elapsedTime / 500);
                
                // 如果速度已经很小，停止惯性
                if (Math.abs(velocity) < 0.1) {
                    return;
                }
                
                // 更新旋转角度
                currentRotation += velocity;
                compassInner.style.transform = `rotate(${currentRotation}deg)`;
                
                // 继续应用惯性
                        AnimationController.startInertia(applyInertia);
                    } catch (error) {
                        log("惯性效果应用时发生错误:", error);
                        // 停止动画
                        AnimationController.stopAnimation('inertia');
                    }
            }
            
            // 启动惯性效果
                AnimationController.startInertia(applyInertia);
            }
            
            return true;
        } catch (error) {
            log("处理拖动结束时发生错误:", error);
            // 尝试恢复界面状态
            compass.classList.remove('dragging');
            rotateArea.style.cursor = 'grab';
            return false;
        }
    }

    // 修改文字应用变换的方式，移除特效
    // 在createTextLayer函数中优化变换
    function createTextLayer() {
        // 移除旧的文字层
        const oldLayers = domCache.getAll('.text-layer');
        oldLayers.forEach(layer => layer.remove());
        domCache.clear('.text-layer');
        
        // 创建新的文字层
        const textLayer = document.createElement('div');
        textLayer.className = 'text-layer';
        // 添加will-change属性以启用硬件加速
        textLayer.style.willChange = 'transform';
        
        // 获取罗盘内部容器
        const compassInner = domCache.get('.compass-inner');
        if (!compassInner) return; // 错误处理
        
        // 获取罗盘尺寸 - 使用缓存的compass对象
        const compass = domCache.get('.compass');
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
        
        // 批量创建文字元素 - 使用内存中的操作替代直接DOM操作
        const textElements = [];
        
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
                
                // 只设置位置和旋转相关的样式
                textElement.style.cssText = `
                    font-size: ${fontSize}px;
                    left: ${pos.x}px;
                    top: ${pos.y}px;
                    transform: translate(-50%, -50%) rotate(${pos.angle}deg);
                    position: absolute;
                `;
                
                textElements.push(textElement);
            });
        });
        
        // 高效地添加所有元素
        textElements.forEach(element => {
            fragment.appendChild(element);
        });
        
        // 一次性添加所有元素到DOM
        textLayer.appendChild(fragment);
        compassInner.appendChild(textLayer);
        
        // 更新缓存
        domCache.update('.text-layer', textLayer);
        
        // 错误处理
        if (textElements.length === 0) {
            log("警告: 文字层没有创建任何文字元素");
        }
        
        return textLayer;
    }

    // 优化的旋转处理函数
    function handleRotation(clientX, clientY, currentTime) {
        try {
            if (!isDragging) return false;

            // 清除扇形区域状态
            document.querySelectorAll('.sector').forEach(sector => {
            sector.style.backgroundColor = 'transparent';
        });
        
            // 获取罗盘中心坐标 - 使用DOM缓存
            const compass = domCache.get('.compass');
            if (!compass) {
                log("警告: 找不到罗盘元素，无法计算旋转");
                return false;
            }
            
        const rect = compass.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
            // 计算角度
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
            // 初始化起始角度（如需要）
        if (startAngle === null) {
            startAngle = angle;
            startRotation = currentRotation;
        }
        
            // 计算新的旋转角度
        const rotation = startRotation + (angle - startAngle);
        
            // 防止极端值导致计算错误 - 设置安全的deltaTime
        const safeDeltatime = Math.max(1, currentTime - lastTime);
            
            // 计算旋转速度
            const dx = isMobile ? (clientX - lastTouchX) : (clientX - lastMouseX);
            const dy = isMobile ? (clientY - lastTouchY) : (clientY - lastMouseY);
        rotationSpeed = Math.sqrt(dx * dx + dy * dy) / safeDeltatime;
        
            // 限制速度范围，避免极端值
            rotationSpeed = Math.min(Math.max(rotationSpeed, 0), 20);
            
            // 更新时间记录
        lastTime = currentTime;
        
            // 应用旋转（无过渡效果）
            applyRotation(rotation);
            
            return true;
        } catch (error) {
            log("处理旋转时发生错误:", error);
            
            // 尝试恢复状态
            isDragging = false;
            startAngle = null;
            compass.classList.remove('dragging');
            
            return false;
        }
    }

    // 修改createCompassElements函数，确保移动端正确定位并添加中心图标
    function createCompassElements() {
        try {
            // 创建罗盘内部容器（用于旋转）- 使用DOM缓存
            let compassInner = domCache.get('.compass-inner');
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
                
                // 获取罗盘容器 - 使用DOM缓存
                const compass = domCache.get('.compass');
                if (!compass) {
                    throw new Error("找不到罗盘容器元素");
                }
                
            compass.appendChild(compassInner);
                
                // 更新DOM缓存
                domCache.update('.compass-inner', compassInner);
        }
        
            // 清空内部容器 - 使用文档片段收集新元素
        compassInner.innerHTML = '';
        
            // 创建中心图标
        const centerIcon = document.createElement('img');
        centerIcon.className = 'center-icon';
        centerIcon.src = '/images/center-icon.png';
        centerIcon.alt = '中心图标';
        
            // 使用cssText批量设置样式，减少重排/重绘次数
            centerIcon.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 16%;
                height: auto;
                z-index: 60;
                transform-origin: center;
            `;
            
            // 设置图片加载错误处理
            centerIcon.onerror = () => {
                log("警告: 中心图标加载失败");
                // 创建备用元素代替图片
                const fallbackElement = document.createElement('div');
                fallbackElement.className = 'center-icon-fallback';
                fallbackElement.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 16%;
                    height: 16%;
                    border-radius: 50%;
                    background: #d4af37;
                    z-index: 60;
                `;
                compassInner.appendChild(fallbackElement);
            };
        
        // 将中心图标添加到compassInner内部，使其能够随罗盘一起旋转
        compassInner.appendChild(centerIcon);
            
            // 缓存中心图标引用
            domCache.update('.center-icon', centerIcon);
            
            return compassInner;
        } catch (error) {
            log("创建罗盘元素时发生错误:", error);
            return null;
        }
    }

    // 优化的罗盘初始化函数
    function initCompass() {
        try {
            // 获取罗盘容器 - 使用DOM缓存
            const compass = domCache.get('.compass') || document.querySelector('.compass');
            if (!compass) {
                log("错误: 找不到罗盘容器元素 .compass");
                // 尝试创建一个容器作为备用
                try {
                    const newCompass = document.createElement('div');
                    newCompass.className = 'compass';
                    document.body.appendChild(newCompass);
                    domCache.set('.compass', newCompass);
                    log("已创建新的罗盘容器");
                    return initCompass(); // 重新调用初始化
                } catch (e) {
                    log("创建罗盘容器失败:", e);
                    return null;
                }
            }
            
        // 清空罗盘内容
            try {
        compass.innerHTML = '';
            } catch (e) {
                log("清空罗盘内容失败:", e);
                // 继续尝试初始化
            }
        
            // 批量设置罗盘容器样式，减少重排/重绘
            const viewportMin = Math.min(window.innerWidth, window.innerHeight);
            const compassSize = viewportMin * 0.9;
            
            try {
            compass.style.cssText = `
                position: absolute;
                width: ${compassSize}px;
                height: ${compassSize}px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transform-origin: center center;
                margin: 0;
                transition: none;
                animation: none;
                overflow: visible;
                border-radius: 50%;
                max-width: 800px;
                max-height: 800px;
                z-index: 50;
            `;
            
            // 添加边框类
            compass.classList.add('border-enabled');
            } catch (e) {
                log("设置罗盘样式失败:", e);
                // 继续尝试初始化其余部分
            }
            
            // 依次创建罗盘元素，使用DOM引用缓存，避免重复查询
            let compassInner;
            try {
                compassInner = typeof createCompassElements === 'function' ? 
                    createCompassElements() : null;
            if (!compassInner) {
                    log("警告: 创建罗盘内部元素失败，尝试直接创建基本元素");
                    // 直接创建基本元素作为备用
                    compassInner = document.createElement('div');
                    compassInner.className = 'compass-inner';
                    compass.appendChild(compassInner);
                }
            } catch (e) {
                log("创建罗盘内部元素时出错:", e);
                try {
                    // 直接创建基本元素作为备用
                    compassInner = document.createElement('div');
                    compassInner.className = 'compass-inner';
                    compass.appendChild(compassInner);
                } catch (err) {
                    log("创建基本罗盘元素失败:", err);
                    return null;
                }
            }
            
            let textLayer;
            try {
                textLayer = typeof createTextLayer === 'function' ? 
                    createTextLayer() : null;
            if (!textLayer) {
                    log("警告: 创建文字层失败");
                }
            } catch (e) {
                log("创建文字层时出错:", e);
            }
        
        // 创建扇形交互区域
            let sectors;
            try {
                sectors = createSectors();
            if (!sectors) {
                log("警告: 创建扇形区域失败");
                }
            } catch (e) {
                log("调用createSectors函数时出错:", e);
            }
        
            // 立即显示罗盘，无需等待
            try {
        compass.style.visibility = 'visible';
            compass.style.opacity = '1';
            } catch (e) {
                log("设置罗盘可见性失败:", e);
            }
            
            // 只在桌面端添加节气信息分页窗口
            let infoPanel;
            try {
                const isMobile = typeof checkIfMobile === 'function' ? 
                    checkIfMobile() : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (!isMobile && typeof addSolarTermInfoPanel === 'function') {
                    infoPanel = addSolarTermInfoPanel();
                    if (!infoPanel) {
                        log("警告: 创建节气信息面板失败");
                    }
                }
            } catch (e) {
                log("添加节气信息面板时出错:", e);
            }
        
        // 添加参考信息
            let referenceInfo;
            try {
                if (typeof addReferenceInfo === 'function') {
                    referenceInfo = addReferenceInfo();
                    if (!referenceInfo) {
                        log("警告: 添加参考信息失败");
                    }
                }
            } catch (e) {
                log("添加参考信息时出错:", e);
            }
            
            return compass;
        } catch (error) {
            log("初始化罗盘时发生错误:", error);
            
            // 尝试恢复显示
            try {
                const compass = domCache.get('.compass') || document.querySelector('.compass');
                if (compass) {
                    compass.style.visibility = 'visible';
                    compass.style.opacity = '1';
                    compass.innerHTML = '<div class="error-message">罗盘初始化失败，请刷新页面重试</div>';
                }
            } catch (e) {
                // 忽略恢复错误
                log("尝试显示错误信息失败:", e);
            }
            
            return null;
        }
    }
    
    // 添加引用信息到罗盘底部
    function addReferenceInfo() {
        try {
            // 确保compass元素存在
            const compass = domCache.get('.compass') || document.querySelector('.compass');
            if (!compass) {
                log("警告: 添加参考信息失败 - 未找到罗盘元素");
                return false;
            }
            
            // 创建参考信息容器
            let referenceInfo = document.querySelector('.reference-info');
            if (!referenceInfo) {
                referenceInfo = document.createElement('div');
                referenceInfo.className = 'reference-info';
                compass.parentNode.appendChild(referenceInfo);
            }
            
            // 设置文本内容
            referenceInfo.textContent = '节气次序图参照熊春锦先生著《中华传统节气修身文化·四时之春》，略有简化';
            
            // 设置基础样式
            referenceInfo.style.position = 'fixed';
            referenceInfo.style.color = '#d4af37';
            referenceInfo.style.fontSize = '12px';
            referenceInfo.style.textAlign = 'center';
            referenceInfo.style.width = '100%';
            referenceInfo.style.padding = '0 0px';
            referenceInfo.style.zIndex = '1000';
            referenceInfo.style.pointerEvents = 'none';
            referenceInfo.style.textShadow = '0 0 2px rgba(0, 0, 0, 0.8)';
            
            // 根据设备类型设置不同的位置
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                referenceInfo.style.bottom= '80px'; // 在移动端显示在顶部，位于导航栏下方
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
            
            // 创建调整引用信息位置的函数
            function adjustReferenceInfoPosition() {
                const isMobileNow = window.innerWidth <= 768;
                if (isMobileNow) {
                    referenceInfo.style.bottom = '80px';
                    referenceInfo.style.left = '0';
                    referenceInfo.style.transform = 'none';
                    referenceInfo.style.fontSize = '10px';
                } else {
                    referenceInfo.style.bottom = '20px';
                    referenceInfo.style.left = '50%';
                    referenceInfo.style.transform = 'translateX(-50%)';
                    referenceInfo.style.fontSize = '12px';
                }
            }
            
            // 移除可能存在的旧resize事件
            if (window._referenceInfoResizeHandler) {
                window.removeEventListener('resize', window._referenceInfoResizeHandler);
            }
            
            // 保存新的事件处理函数引用并添加监听器
            window._referenceInfoResizeHandler = adjustReferenceInfoPosition;
            window.addEventListener('resize', window._referenceInfoResizeHandler);
            
            return referenceInfo;
        } catch (error) {
            log("添加参考信息时发生错误:", error);
            return false;
        }
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

    // 优化的自动旋转函数
    function startAutoRotation() {
        try {
            // 移动设备不启用自动旋转
            if (isMobile) {
                log("移动设备不支持自动旋转");
                return false;
            }
            
            // 停止所有动画
            AnimationController.stopAll();
            
            log("开始自动旋转");
            compass.classList.add('auto-rotating');
            
            // 设置旋转动画参数
            let lastTimestamp = 0;
            const rotationSpeed = -0.05; // 每毫秒旋转的角度（负值为逆时针）
            
            // 定义旋转动画步骤
            function rotateStep(timestamp) {
                try {
                    if (!lastTimestamp) {
                        lastTimestamp = timestamp;
                    }
                    
                    // 计算时间差
                    const elapsed = timestamp - lastTimestamp;
                    lastTimestamp = timestamp;
                    
                    // 计算并应用新的旋转角度
                    const newRotation = currentRotation + (rotationSpeed * elapsed);
                    
                    // 同步旋转罗盘内部和文字层
                    applyRotation(newRotation, false);
                    
                    // 同步更新文字层的旋转，确保文字保持原来的朝向
                    const textLayer = document.querySelector('.text-layer');
                    if (textLayer) {
                        textLayer.style.transform = `rotate(${-newRotation}deg)`;
                    }
                    
                    // 继续动画循环
                    AnimationController.startAutoRotation(rotateStep);
                } catch (error) {
                    log("自动旋转过程中发生错误:", error);
                    // 错误恢复：停止动画
                    AnimationController.stopAnimation('autoRotation');
                    compass.classList.remove('auto-rotating');
                }
            }
            
            // 启动动画
            AnimationController.startAutoRotation(rotateStep);
            log("自动旋转已启动");
            return true;
        } catch (error) {
            log("启动自动旋转时发生错误:", error);
            // 尝试恢复状态
            compass.classList.remove('auto-rotating');
            AnimationController.stopAnimation('autoRotation');
            return false;
        }
    }

    // 简化的停止自动旋转函数
    function stopAutoRotation() {
        try {
            // 移动设备不执行操作
            if (isMobile) {
                return false;
            }
            
            log("停止自动旋转");
            
            // 取消动画并更新UI状态
            compass.classList.remove('auto-rotating');
            const result = AnimationController.stopAnimation('autoRotation');
            
            // 复位文字层的旋转
            const textLayer = document.querySelector('.text-layer');
            if (textLayer) {
                textLayer.style.transform = 'rotate(0deg)';
            }
            
            log("旋转已停止，当前角度:", currentRotation);
            return result;
        } catch (error) {
            log("停止自动旋转时发生错误:", error);
            // 尝试强制停止
            compass.classList.remove('auto-rotating');
            AnimationController.forceStopAll();
            return false;
        }
    }

    // 将自动旋转函数暴露到全局
    window.startAutoRotation = startAutoRotation;
    window.stopAutoRotation = stopAutoRotation;

    // 添加节气表格数据
    function createSolarTermInfoData() {
        // 如果我们已经从JSON加载了节气详细数据，则直接使用
        if (solarTermData && solarTermData.length > 0) {
            log(`使用JSON加载的${solarTermData.length}个节气详细数据`);
            return solarTermData;
        }
        
        // 否则使用硬编码的回退数据
        log("使用硬编码的节气详细数据");
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
            { term: "古谷雨", date: "由于历史的原因，谷雨与清明的位置发生了变动。古谷雨是二十四个节气中的第5个节气，实为第8个。", position: "太阳到达黄经15度", 
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
              phenomena: "一候蚯蚸结；二候麋角解；三候水泉动", wind: "不周风止，转广莫风", 
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
        try {
            // 先确保compass元素存在
            const compass = domCache.get('.compass') || document.querySelector('.compass');
            if (!compass) {
                log("警告: 创建节气信息面板失败 - 未找到罗盘元素");
                return false;
            }
            
            // 检查节气信息面板是否已存在
            let infoPanel = document.querySelector('.solar-term-info-panel');
            if (infoPanel) {
                // 面板已存在，更新其内容
                updatePanelLayout(infoPanel);
                return infoPanel;
            }
            
            // 创建节气信息面板
            infoPanel = document.createElement('div');
            infoPanel.className = 'solar-term-info-panel';
            infoPanel.style.display = 'flex';
            
            compass.parentNode.appendChild(infoPanel);
            
            // 创建左侧信息区域
            const infoContent = document.createElement('div');
            infoContent.className = 'info-content';
            infoPanel.appendChild(infoContent);
            domCache.update('.info-content', infoContent);
            
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
            
            // 立即更新面板布局
            updatePanelLayout(infoPanel);
            
            return infoPanel;
        } catch (error) {
            log("警告: 创建节气信息面板失败", error);
            return false;
        }
    }

    // 简化面板布局更新函数
    function updatePanelLayout(panel) {
        if (!panel) return;
        
        // 根据设备类型设置显示状态 - 简化为只管显示和隐藏
        panel.style.display = isMobile ? 'none' : 'flex';
    }

    // 为桌面设备创建顶部控件，移动端不创建
    function addAutoRotateControlsToHeader() {
        // 此功能已在index.html中实现，不需要在这里创建控件
        // 保留此空函数是为了保持代码结构完整性
        return;
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
        try {
            // 获取最新的时间信息，包括格式化的日期
            const timeInfo = getBeijingTime('full');
            
            // 更新日期显示 - 使用DOM缓存
            const currentDateElements = domCache.getAll('.current-date');
            if (currentDateElements && currentDateElements.length) {
                currentDateElements.forEach(element => {
                    element.innerHTML = timeInfo.formattedDate;
                });
            }
            
            // 直接更新节气信息，不依赖DOM状态
            updateSolarTermInfo();
            
            // 确保日期信息被更新
            updateDateInfo();
            
            return true;
        } catch (error) {
            log("更新日期显示时发生错误:", error);
            return false;
        }
    }

    // 更新节气卡片信息
    function updateSolarTermInfo() {
        // 获取所有选项卡数据
        const allTabs = [
            { id: 'tab1', fields: ['date'] },
            { id: 'tab2', fields: ['phenomena', 'position'] },
            { id: 'tab3', fields: ['wind', 'element', 'sound'] },
            { id: 'tab4', label: '六气能量<br>天地能量', fields: ['qi', 'energy'] }
        ];
        
        // 查找激活的选项卡
        const activeTabButton = document.querySelector('.tab-button.active');
        let activeTabData = allTabs[0]; // 默认使用第一个选项卡
        
        // 如果找到激活的选项卡，则使用对应数据
        if (activeTabButton) {
            const tabId = activeTabButton.getAttribute('data-tab');
            const foundTab = allTabs.find(tab => tab.id === tabId);
            if (foundTab) {
                activeTabData = foundTab;
            }
        }
        
        // 直接调用更新函数，确保更新节气信息
        updateInfoContent(activeTabData.fields);
        
        // 额外确保日期信息始终更新
        if (!activeTabData.fields.includes('date')) {
            // 如果当前选项卡不包含日期信息，则额外更新日期信息
            updateDateInfo();
        }
    }
    
    // 添加单独更新日期信息的函数 - 优化版
    function updateDateInfo() {
        try {
            // 使用DOM缓存获取元素
            const infoContent = domCache.get('.info-content');
            if (!infoContent) {
                // 不作为错误记录，因为这在博客等页面是正常情况
                log("注意: 当前页面没有info-content元素，可能在其他页面");
                return false;
            }
            
            // 获取当前节气信息
            const solarTermInfo = getCurrentSolarTerm();
            if (!solarTermInfo || !solarTermInfo.currentTerm || !solarTermInfo.nextTerm) {
                log("错误: 无法获取节气信息");
                return false;
            }
            
            const { currentTerm, nextTerm } = solarTermInfo;
            
            // 查找或创建提示容器 - 使用DOM缓存
            let tipsContainer = domCache.get('.tips-container', infoContent);
            if (!tipsContainer) {
                tipsContainer = document.createElement('div');
                tipsContainer.className = 'tips-container';
                infoContent.appendChild(tipsContainer);
                domCache.update('.tips-container', tipsContainer);
            } else {
                // 清空现有内容
                tipsContainer.innerHTML = '';
            }
            
            // 获取当前日期字符串
            const today = new Date();
            const todayStr = getBeijingTime('dateStr');  // 格式：YYYY-MM-DD
            
            // 提取节气日期的日期部分(不含时间)
            const currentTermDate = currentTerm.date.split('T')[0];  // 提取YYYY-MM-DD部分
            const nextTermDate = nextTerm.date.split('T')[0];  // 提取YYYY-MM-DD部分
            
            log("更新日期信息 - 当前日期:", todayStr, "当前节气:", currentTerm.name, "日期:", currentTermDate, "下一节气:", nextTerm.name, "日期:", nextTermDate);
            
            // 检查今天是否是节气日期 - 只比较日期部分
            const isTodaySolarTerm = todayStr === nextTermDate;
            
            // 获取倒计时天数
            const daysLeft = getDaysLeft(nextTerm.date);
            
            // 更新节气提示信息
            if (isTodaySolarTerm) {
                // 如果今天是节气日，显示节气提示语
                const highlightTip = document.createElement('span');
                highlightTip.className = 'highlight-tip';
                highlightTip.textContent = `🌸 今日${nextTerm.name}有导师的节气课程哦！`;
                log("显示节气提示语:", highlightTip.textContent);
                tipsContainer.appendChild(highlightTip);
                
                // 更新节气标题为今天的节气
                const currentTermTitle = domCache.get('.current-term');
                if (currentTermTitle && currentTermTitle.textContent !== nextTerm.name) {
                    currentTermTitle.textContent = nextTerm.name;
                    log("更新当前节气标题为今日节气:", nextTerm.name);
                }
            } else {
                // 如果今天不是节气日，显示下一个节气信息和倒计时
                const nextTermInfo = document.createElement('div');
                nextTermInfo.className = 'next-term';
                nextTermInfo.innerHTML = 
                    `下一个节气是【${nextTerm.name}】<br>` +
                    `阳历日期：${formatDate(nextTerm.date)}，倒计时 <strong>${daysLeft}</strong> 天`;
                
                log("显示下一节气信息:", nextTerm.name, "倒计时:", daysLeft, "天");
                tipsContainer.appendChild(nextTermInfo);
            }
            
            return tipsContainer;
        } catch (error) {
            log("更新日期信息时发生错误:", error);
            return null;
        }
    }

    // 更新信息内容 - 优化版
    function updateInfoContent(fields) {
        try {
            // 使用DOM缓存获取元素
            const infoContent = domCache.get('.info-content');
            if (!infoContent) {
                // 不作为错误记录，因为这在博客等页面是正常情况
                log("注意: 当前页面没有info-content元素，可能在其他页面");
                return null;
            }
        
            // 获取当前节气
            const solarTermInfo = getCurrentSolarTerm();
            if (!solarTermInfo || !solarTermInfo.currentTerm) {
                log("错误: 无法获取节气信息");
                return null;
            }
            
            const { currentTerm, nextTerm } = solarTermInfo;
            
            // 提取节气日期的日期部分(不含时间)
            const currentTermDate = currentTerm.date.split('T')[0];  // 提取YYYY-MM-DD部分
            const nextTermDate = nextTerm ? nextTerm.date.split('T')[0] : null;
        
            // 从数据中查找当前节气的信息
            const termData = createSolarTermInfoData().find(term => term.term === currentTerm.name);
            if (!termData) {
                log("错误: 无法找到节气数据:", currentTerm.name);
                return null;
            }
            
            // 获取时间信息
            const timeInfo = getBeijingTime('full');
            const todayStr = timeInfo.dateStr; // 格式如 "2025-03-20"
            
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
            dateElement.textContent = timeInfo.formattedDate;
            fragment.appendChild(dateElement);
            
            // 字段标签映射 - 避免重复switch语句
            const fieldLabels = {
                'position': '黄道位置',
                'phenomena': '三候',
                'wind': '八风能量对应',
                'element': '四季五行对应',
                'sound': '五音能量对应',
                'qi': '六气能量主气对应',
                'energy': '天地能量主运'
            };
            
            // 一次性创建所有字段元素 - 避免多次DOM操作
            const fieldElements = fields.map(field => {
                let fieldContent = termData[field];
                let fieldLabel = fieldLabels[field] || '';
                
                const infoItem = document.createElement('div');
                infoItem.className = 'info-item';
                
                if (fieldLabel) {
                    // 创建标签和值元素
                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'info-label';
                    labelSpan.textContent = `${fieldLabel}：`;
                    
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'info-value';
                    valueSpan.textContent = fieldContent;
                    
                    // 批量添加到父元素
                    infoItem.appendChild(labelSpan);
                    infoItem.appendChild(valueSpan);
                } else {
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'info-value';
                    valueSpan.textContent = fieldContent;
                    infoItem.appendChild(valueSpan);
                }
                
                return infoItem;
            });
            
            // 批量添加所有字段元素
            fieldElements.forEach(element => {
                fragment.appendChild(element);
            });
            
            // 如果是阳历时间页面，添加节气提示语
            if (fields.includes('date')) {
                const tipsContainer = document.createElement('div');
                tipsContainer.className = 'tips-container';
            
                // 检查今天是否是节气日期 - 只比较日期部分
                if (todayStr === currentTermDate) {
                    // 创建节气提示
                    const highlightTip = document.createElement('span');
                    highlightTip.className = 'highlight-tip';
                    highlightTip.textContent = `🌸 今日${currentTerm.name}有导师的节气课程哦！`;
                    tipsContainer.appendChild(highlightTip);
                } else if (nextTerm) {
                    // 创建下一节气信息
                    const nextTermInfo = document.createElement('span');
                    nextTermInfo.className = 'next-term';
                    nextTermInfo.style.display = 'inline-block'; // 确保span可以正常显示换行
                    
                    // 添加文本内容
                    const textNode1 = document.createTextNode(`下一个节气是【${nextTerm.name}】`);
                    nextTermInfo.appendChild(textNode1);
                    
                    nextTermInfo.appendChild(document.createElement('br'));
                    
                    const textNode2 = document.createTextNode(`阳历日期：${formatDate(nextTerm.date)}，倒计时 `);
                    nextTermInfo.appendChild(textNode2);
                    
                    const strongElement = document.createElement('strong');
                    const daysLeft = getDaysLeft(nextTerm.date);
                    strongElement.textContent = daysLeft;
                    nextTermInfo.appendChild(strongElement);
                    
                    nextTermInfo.appendChild(document.createTextNode(' 天'));
                    
                    tipsContainer.appendChild(nextTermInfo);
                }
                
                fragment.appendChild(tipsContainer);
            }
            
            // 清空内容并添加新内容
            infoContent.innerHTML = '';
            infoContent.appendChild(fragment);
            
            return infoContent;
        } catch (error) {
            log("更新信息内容时发生错误:", error);
            return null;
        }
    }

    // 初始化罗盘
    initCompass();
    
    // 罗盘初始化后，自动旋转到当前节气位置
    rotateCompassToCurrentSolarTerm();

    // 使用可靠且高性能的时间更新函数，确保获取最新系统时间
    function refreshTimeAndUpdateInfo() {
        try {
            // 强制获取最新系统时间 - 使用Date.now()确保每次都是新时间
            const currentTime = new Date(Date.now());
            log("正在获取最新系统时间:", currentTime.toLocaleString());
            
            // 在所有设备上更新时间信息
            // 使用requestAnimationFrame确保在下一帧渲染前更新
            // 这比setTimeout(fn, 0)更可靠，并且性能更好
            requestAnimationFrame(() => {
                // 更新当前日期显示
                updateCurrentDateDisplay();
                
                // 更新节气信息
                updateDateInfo();
                
                log("时间信息已更新完成");
            });
            
            return true;
        } catch (error) {
            log("刷新时间信息时发生错误:", error);
            return false;
        }
    }
    
    // 初始化罗盘和时间信息
    try {
        // 初始化罗盘
        initCompass();
        
        // 罗盘初始化后，自动旋转到当前节气位置
        rotateCompassToCurrentSolarTerm();
        
        // 立即执行时间刷新 - 使用requestAnimationFrame确保在下一帧渲染
        log("页面加载完成，立即刷新时间信息");
        requestAnimationFrame(refreshTimeAndUpdateInfo);
        
        // 所有设备都设置定期刷新
        // 设置定期刷新时间信息 - 使用间隔较长的定时器节约资源
        let refreshInterval; // 定义在更高的作用域以便于管理
        
        function startRefreshTimer() {
            // 确保先清除可能存在的定时器，避免多个定时器同时运行
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
            refreshInterval = setInterval(refreshTimeAndUpdateInfo, 600000); // 10分钟刷新一次
            log("设置定时刷新间隔为10分钟");
            return refreshInterval;
        }
        
        // 初始启动定时器
        refreshInterval = startRefreshTimer();
        
        // 页面不可见时停止刷新，节约资源
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                log("页面不可见，停止定时刷新");
                if (refreshInterval) {
                    clearInterval(refreshInterval);
                    refreshInterval = null;
                }
            } else {
                // 页面再次可见时立即刷新一次，然后重新开始定时刷新
                log("页面恢复可见，立即刷新并重启定时器");
                refreshTimeAndUpdateInfo();
                startRefreshTimer();
            }
        });
    } catch (error) {
        log("初始化罗盘和时间信息时发生错误:", error);
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
    
    // 处理wheel事件的函数
    function handleWheelEvent(e) {
        const now = Date.now();
        // 防止过于频繁的滚动触发导航
        if (now - lastScrollTime < 500) return;
        
        // 向下滚动时导航到博客页面
        if (e.deltaY > 0) {
            lastScrollTime = now;
            navigateToBlog();
        }
    }
    
    // 点击箭头导航到博客页面
    if (scrollIndicator) {
        // 清除可能存在的旧监听器
        const oldClickHandler = scrollIndicator._clickHandler;
        if (oldClickHandler) {
            scrollIndicator.removeEventListener('click', oldClickHandler);
        }
        
        // 设置新的点击处理函数
        scrollIndicator._clickHandler = function(e) {
            e.preventDefault();
            navigateToBlog();
        };
        
        // 添加点击事件监听器
        scrollIndicator.addEventListener('click', scrollIndicator._clickHandler);
    }
    
    // 移除可能存在的旧wheel事件监听器
    window.removeEventListener('wheel', handleWheelEvent);
    
    // 监听鼠标滚轮事件
    window.addEventListener('wheel', handleWheelEvent);
    
    // 监听移动端触摸事件
    function setupTouchEvents() {
        // 先移除可能存在的监听器（如存在）
        const mainContainer = document.querySelector('.container');
        if (!mainContainer) return;
        
        // 清理函数，用于移除旧事件监听器
        function cleanupTouchEvents() {
            if (mainContainer._touchStartHandler) {
                mainContainer.removeEventListener('touchstart', mainContainer._touchStartHandler);
                mainContainer._touchStartHandler = null;
            }
            if (mainContainer._touchMoveHandler) {
                mainContainer.removeEventListener('touchmove', mainContainer._touchMoveHandler);
                mainContainer._touchMoveHandler = null;
            }
        }
        
        // 先清理旧事件
        cleanupTouchEvents();
        
        // 只在移动设备上设置触摸事件
    if (scrollIsMobile) {
        let touchStartY = 0;
        let touchStartX = 0;
        
        // 记录触摸开始位置
            mainContainer._touchStartHandler = function(e) {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            };
            
            // 处理触摸移动
            mainContainer._touchMoveHandler = function(e) {
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
            };
            
            // 添加新事件监听器
            mainContainer.addEventListener('touchstart', mainContainer._touchStartHandler, { passive: true });
            mainContainer.addEventListener('touchmove', mainContainer._touchMoveHandler, { passive: true });
        }
    }
    
    // 初始化触摸事件
    setupTouchEvents();
    
    // 监听窗口大小变化，更新设备类型和触摸事件
    function updateDeviceTypeAndEvents() {
        // 更新设备类型
        scrollIsMobile = checkIfMobile();
        // 重新设置触摸事件
        setupTouchEvents();
    }
    
    // 移除可能存在的旧监听器
    window.removeEventListener('resize', updateDeviceTypeAndEvents);
    
    // 添加设备类型更新监听器
    window.addEventListener('resize', updateDeviceTypeAndEvents);

    // 主初始化函数 - 优化版本
    function init() {
        try {
            log("罗盘初始化开始...");
            
            // 初始化DOM缓存系统
            domCache.clear();
            
            // 先检查localStorage中的初始化状态
            if (!solarTermsInitialized) {
                try {
                    solarTermsInitialized = localStorage.getItem('solarTermsInitialized') === 'true';
                    log("从localStorage读取初始化状态: " + (solarTermsInitialized ? "已初始化" : "未初始化"));
                } catch (e) {
                    log("无法读取localStorage初始化状态");
                }
            }
            
            // 先确保节气数据已初始化
            if (!solarTermsInitialized || !Array.isArray(solarTerms2025) || solarTerms2025.length === 0 || 
                !Array.isArray(solarTerms2026) || solarTerms2026.length === 0) {
                log("初始化节气数据...");
                const success = loadSolarTermData();
                if (success) {
                    log("成功加载节气数据");
                    solarTermsInitialized = true;
                    try {
                        localStorage.setItem('solarTermsInitialized', 'true');
                    } catch (e) {
                        // 忽略localStorage错误
                    }
                } else {
                    log("使用回退的硬编码节气数据");
                    // 尝试再次加载，如果失败则保持错误状态
                    solarTermsInitialized = loadSolarTermData();
                }
            } else {
                log("节气数据已初始化，跳过加载步骤");
            }
            
            // 初始化罗盘界面
            initializeCompass();
            
            return true;
        } catch (error) {
            log("初始化过程中发生错误:", error);
            // 尝试错误恢复
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = '罗盘初始化失败，请刷新页面重试。';
            
            const compass = domCache.get('.compass') || document.querySelector('.compass');
            if (compass) {
                compass.innerHTML = '';
                compass.appendChild(errorElement);
                compass.style.visibility = 'visible';
                compass.style.opacity = '1';
            }
            return false;
        }
    }
    
    // 罗盘初始化函数
    function initializeCompass() {
        try {
            // 创建罗盘并缓存引用
            const compass = initCompass();
            if (!compass) {
                throw new Error("罗盘初始化失败");
            }
            
            // 立即更新当前日期和节气信息 - 使用requestAnimationFrame确保在绘制前执行
            requestAnimationFrame(() => {
                refreshTimeAndUpdateInfo();
            });
            
            // 无论设备类型，都旋转到当前节气位置
            rotateCompassToCurrentSolarTerm();
            
            // 确保罗盘在所有设备上可见
            compass.style.visibility = 'visible';
            compass.style.opacity = '1';
            
            // 如果是移动设备，记录日志
            if (isMobile) {
                log("移动设备: 已启用旋转到当前节气");
            }
            
            // 绑定事件监听器 - 使用单一事件处理系统
            bindAllEventListeners();
            
            log("罗盘初始化完成");
            return true;
        } catch (error) {
            log("初始化罗盘时发生错误:", error);
            return false;
        }
    }
    
    // 绑定所有事件监听器 - 集中管理
    function bindAllEventListeners() {
        try {
            const compass = domCache.get('.compass');
            if (!compass) {
                throw new Error("找不到罗盘元素，无法绑定事件");
            }
            
            // 定义拖拽开始函数
            const startDrag = function(event) {
                log("拖拽开始 - 未实现完整功能");
                // 阻止默认行为
                if (event.cancelable) {
                    event.preventDefault();
                }
                // 标记拖拽状态
                window.isDragging = true;
            };
            
            // 定义拖拽结束函数
            const endDrag = function(event) {
                window.isDragging = false;
            };
            
            // 定义窗口大小变化处理函数
            const handleResize = function() {
                log("窗口大小变化");
            };
            
            // 定义滚轮事件处理函数
            const handleWheel = function(event) {
                log("滚轮事件");
                if (event.cancelable) {
                    event.preventDefault();
                }
            };
            
            // 清除可能存在的旧监听器
            compass.removeEventListener('mousedown', startDrag);
            compass.removeEventListener('touchstart', startDrag);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('wheel', handleWheel);
            
            // 绑定拖拽事件
            compass.addEventListener('mousedown', startDrag);
            compass.addEventListener('touchstart', startDrag);
            
            // 使用节流函数绑定resize事件
            window.addEventListener('resize', handleResize);
            
            // 只在桌面端绑定滚轮事件
            const isMobile = typeof checkIfMobile === 'function' ? 
                checkIfMobile() : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (!isMobile) {
                window.addEventListener('wheel', handleWheel);
            }
            
            // 绑定页面可见性事件，在页面切换时保存资源
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            log("所有事件监听器已绑定");
            return true;
        } catch (error) {
            log("绑定事件监听器时发生错误:", error);
            return false;
        }
    }
    
    // 页面可见性变化处理
    function handleVisibilityChange() {
        if (document.hidden) {
            // 页面不可见时，暂停不必要的更新
            log("页面不可见，暂停部分功能");
            pauseRefreshTimer();
        } else {
            // 页面恢复可见时，立即更新信息
            log("页面恢复可见，立即更新信息");
            resumeRefreshTimer();
            requestAnimationFrame(() => {
                refreshTimeAndUpdateInfo();
            });
        }
    }
    
    // 暂停刷新定时器
    function pauseRefreshTimer() {
        try {
            if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
                log("已暂停定时刷新");
            }
        } catch (e) {
            log("暂停定时器时出错:", e);
        }
    }
    
    // 恢复刷新定时器
    function resumeRefreshTimer() {
        try {
            if (!refreshInterval) {
                refreshInterval = startRefreshTimer();
                log("已恢复定时刷新");
            }
        } catch (e) {
            log("恢复定时器时出错:", e);
        }
    }
    
    // 开始刷新定时器
    function startRefreshTimer() {
        try {
            if (refreshInterval) {
                clearInterval(refreshInterval);
                log("清除旧的定时器");
            }
            
            // 使用更合理的刷新间隔
            log("启动新的定时刷新，间隔30秒");
            return setInterval(() => {
                refreshTimeAndUpdateInfo();
            }, 30000); // 30秒刷新一次
        } catch (e) {
            log("启动定时器时出错:", e);
            return null;
        }
    }
    
    // 立即执行初始化
    init();

    // DOM批量操作优化
    function updateCompassElements(sectors) {
      // 使用DocumentFragment批量操作DOM
      const fragment = document.createDocumentFragment();
      const compassContainer = document.querySelector('.compass');
      
      // 如果需要完全重建，先清空
      // compassContainer.innerHTML = '';
      
      // 批量创建元素
      sectors.forEach(sector => {
        const sectorElement = document.createElement('div');
        sectorElement.className = 'sector';
        // 设置其他属性...
        fragment.appendChild(sectorElement);
      });
      
      // 一次性添加到DOM
      compassContainer.appendChild(fragment);
      
      // 使用requestAnimationFrame进行视觉更新
      safeAnimationFrame(() => {
        // 应用可能触发重排的样式变化
        document.querySelectorAll('.sector').forEach((element, index) => {
          const { angle, color } = sectors[index];
          element.style.transform = `rotate(${angle}deg)`;
          element.style.backgroundColor = color;
        });
      });
    }

    // 使用CSS变量减少样式计算
    function setupSwipeGesture() {
      // 监听整个document而非仅container
      document.addEventListener('touchstart', handleTouchStart, {passive: true});
      document.addEventListener('touchend', handleTouchEnd, {passive: true});
      
      let touchStartY = 0;
      let touchStartTime = 0;
      
      function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
      
      function handleTouchEnd(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchStartY - touchEndY;
        const swipeTime = Date.now() - touchStartTime;
        const swipeSpeed = swipeDistance / swipeTime;
        
        // 获取屏幕高度，用于计算相对位置
        const windowHeight = window.innerHeight;
        const startPositionRatio = touchStartY / windowHeight;
        
        // 根据起始位置动态调整所需滑动距离
        let requiredDistance;
        
        if (startPositionRatio < 0.33) {
          // 顶部区域 - 需要较长滑动
          requiredDistance = 150;
        } else if (startPositionRatio < 0.66) {
          // 中部区域 - 中等滑动距离
          requiredDistance = 100;
        } else {
          // 底部区域 - 较短滑动距离
          requiredDistance = 50;
        }
        
        // 如果滑动速度足够快，降低距离要求
        if (swipeSpeed > 0.8) {
          requiredDistance = requiredDistance * 0.7;
        }
        
        // 判断是否满足上滑条件
        if (swipeDistance > requiredDistance) {
          window.location.href = '/blog/';
        }
      }
    }

    // 在DOMContentLoaded中调用此函数
}); 

// 将关键函数暴露到全局作用域，供HTML页面调用
// 注意：这里声明的函数对象可能与DOMContentLoaded中的同名函数不同
// 创建空函数以避免未定义错误
window.loadSolarTermData = function() {
    log("[节气罗盘] 全局loadSolarTermData被调用");
    
    // 先检查localStorage中的初始化状态
    try {
        if (localStorage.getItem('solarTermsInitialized') === 'true') {
            solarTermsInitialized = true;
            log("[节气罗盘] 从localStorage检测到节气数据已初始化");
            
            // 确保内存或全局变量中有数据可用
            const needReload = !Array.isArray(solarTerms2025) || solarTerms2025.length === 0 || 
                !Array.isArray(solarTerms2026) || solarTerms2026.length === 0;
                
            // 查看window全局对象是否存在有效数据
            const windowDataAvailable = window.solarTerms2025 && Array.isArray(window.solarTerms2025) && 
                window.solarTerms2025.length > 0 && window.solarTerms2026 && Array.isArray(window.solarTerms2026) && 
                window.solarTerms2026.length > 0;
                
            if (windowDataAvailable) {
                // 从window对象复制数据
                if (typeof solarTerms2025 !== 'undefined') {
                    solarTerms2025 = window.solarTerms2025.slice();
                }
                if (typeof solarTerms2026 !== 'undefined') {
                    solarTerms2026 = window.solarTerms2026.slice();
                }
                log("[节气罗盘] 从window对象恢复了节气数据");
                return true;
            } else if (needReload) {
                log("[节气罗盘] 虽然localStorage标记已初始化，但内存和window中均无数据，重新加载");
                // 重置初始化状态，强制执行完整的加载流程
                solarTermsInitialized = false;
                const success = loadSolarTermData();
                
                // 确保将加载的数据同步到window对象
                if (success && typeof solarTerms2025 !== 'undefined' && typeof solarTerms2026 !== 'undefined') {
                    window.solarTerms2025 = solarTerms2025.slice();
                    window.solarTerms2026 = solarTerms2026.slice();
                    window.solarTermsInitialized = true;
                    log("[节气罗盘] 重新加载数据并同步到window对象");
                }
                return success;
            }
            return true;
        }
    } catch (e) {
        log("[节气罗盘] 读取localStorage状态失败:", e);
    }
    
    // 如果localStorage没有标记或出错，调用内部loadSolarTermData函数
    const success = loadSolarTermData();
    
    // 确保将加载的数据同步到window对象
    if (success && typeof solarTerms2025 !== 'undefined' && typeof solarTerms2026 !== 'undefined') {
        window.solarTerms2025 = solarTerms2025.slice();
        window.solarTerms2026 = solarTerms2026.slice();
        window.solarTermsInitialized = true;
        log("[节气罗盘] 初始加载数据并同步到window对象");
    }
    
    return success;
};

window.init = function() {
    console.log("[节气罗盘] 全局init被调用");
    // 如果DOMContentLoaded已经触发，尝试重新初始化
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // 检查localStorage中的初始化状态
        try {
            const storedInitStatus = localStorage.getItem('solarTermsInitialized') === 'true';
            console.log("[节气罗盘] 从localStorage读取初始化状态: " + (storedInitStatus ? "已初始化" : "未初始化"));
            
            // 同步window全局变量和内存变量
            if (window.solarTerms2025 && window.solarTerms2025.length > 0) {
                if (typeof solarTerms2025 !== 'undefined') {
                    solarTerms2025 = window.solarTerms2025;
                }
                console.log("[节气罗盘] 从window对象同步2025年节气数据");
            }
            
            if (window.solarTerms2026 && window.solarTerms2026.length > 0) {
                if (typeof solarTerms2026 !== 'undefined') {
                    solarTerms2026 = window.solarTerms2026;
                }
                console.log("[节气罗盘] 从window对象同步2026年节气数据");
            }
            
            if (typeof solarTermsInitialized !== 'undefined') {
                solarTermsInitialized = storedInitStatus;
            }
            
            if (window.solarTermsInitialized !== storedInitStatus) {
                window.solarTermsInitialized = storedInitStatus;
            }
        } catch (e) {
            console.error("[节气罗盘] 读取或同步初始化状态时出错:", e);
        }
        
        // 重新加载数据和初始化
        window.loadSolarTermData();
        
        // 尝试查找并初始化罗盘元素
        const compass = document.querySelector('.compass');
        if (compass) {
            console.log("[节气罗盘] 找到罗盘元素，正在初始化");
            // 添加简单的CSS样式以确保可见
            compass.style.visibility = 'visible';
            compass.style.opacity = '1';
            
            // 如果需要，更新罗盘指针位置
            try {
                const currentTerm = getCurrentSolarTerm();
                if (currentTerm) {
                    rotateCompassToCurrentSolarTerm(currentTerm.name);
                    console.log("[节气罗盘] 罗盘指针已旋转到当前节气:", currentTerm.name);
                }
            } catch (e) {
                console.error("[节气罗盘] 更新罗盘指针位置时出错:", e);
            }
        }
        
        return true;
    }
    return false;
};

// 检查DOM并初始化罗盘的全局入口函数
window.initCompass = function() {
    // 如果已经存在日志函数，使用它，否则不记录
    if (typeof window.log === 'function') {
        window.log('[节气罗盘] 全局initCompass被调用');
    }
    
    // 准备存储节气名称映射对象的全局变量
    if (!window.solarTermMapping) {
        window.solarTermMapping = solarTermToCompassMapping;
    }
    
    // 所有罗盘功能的主入口
    log("[节气罗盘] 全局initCompass被调用");
    
    // 如果罗盘元素存在，初始化它
    if (document.querySelector('.compass')) {
        // 加载节气数据（已在全局函数中完成，这里不需要重复调用）
        // 尝试查找并初始化罗盘元素
        const compass = document.querySelector('.compass');
        if (compass) {
            console.log("[节气罗盘] 找到罗盘元素，正在初始化");
            // 添加简单的CSS样式以确保可见
            compass.style.visibility = 'visible';
            compass.style.opacity = '1';
        }
        return true;
    }
    return false;
};

// 自动旋转占位函数 - 空实现
window.startAutoRotation = function() {
    console.log("[节气罗盘] 自动旋转功能已禁用");
    return false;
};

window.stopAutoRotation = function() {
    console.log("[节气罗盘] 自动旋转功能已禁用");
    return false;
};

function updateDateInfo() {
    try {
        // 获取当前日期和节气信息
        const today = getCurrentDateStr();
        log("格式化的日期字符串:", today);
        
        const { currentTerm, nextTerm } = getCurrentSolarTerm();
        
        if (!currentTerm || !nextTerm) {
            log("节气数据不完整，无法更新日期信息");
            return false;
        }
        
        log("更新日期信息 - 当前日期:", today, "当前节气:", currentTerm.name, "日期:", formatDate(currentTerm.date), "下一节气:", nextTerm.name, "日期:", formatDate(nextTerm.date));
        
        // 找到info-content元素
        const infoContent = document.querySelector('.info-content');
        if (!infoContent) {
            // 如果元素不存在，不要把它当作错误，只是记录并退出
            log("注意: 当前页面没有info-content元素，可能在其他页面");
            return false;
        }
        
        // 安全地获取倒计时天数
        const daysLeft = getDaysLeft(nextTerm.date);
        
        // 显示当前节气信息
        const currentTermTitle = document.querySelector('.current-term');
        if (currentTermTitle) {
            currentTermTitle.textContent = currentTerm.name;
        }
        
        // 更新下一个节气信息和倒计时
        if (daysLeft !== null) {
            // 创建或获取提示容器
            let tipsContainer = document.querySelector('.tips-container');
            if (!tipsContainer) {
                tipsContainer = document.createElement('div');
                tipsContainer.className = 'tips-container';
                if (infoContent) infoContent.appendChild(tipsContainer);
            }
            
            // 更新下一节气倒计时信息
            if (tipsContainer) {
                tipsContainer.innerHTML = `<span class="next-term">${nextTerm.name}</span> 倒计时: <span class="days-left">${daysLeft}</span> 天`;
                log("显示下一节气信息:", nextTerm.name, "倒计时:", daysLeft, "天");
            }
        }
        
        return true;
    } catch (error) {
        log("更新日期信息时发生错误:", error);
        return false;
    }
}