// 二十四节气侧边栏Tabs功能
document.addEventListener('DOMContentLoaded', function() {
    // ---------- 节气固定信息（名称、描述、三候等，每年不变）----------
    const solarTermBase = [
        {
            name: "立春",
            description: "按照四时天地能量的变化来排序，二十四节气的第1个节气实为冬至，立春乃第4个节气，在大寒与启蛰之间，完成承前启后的作用。",
            phenomena: "一候东风解冻；二候蛰虫始振；三候鱼陟负冰",
            position: "太阳到达黄经315度",
            wind: "条风",
            element: "五行阴阳属性是阳木",
            sound: "角音波",
            qi: "厥阴风木",
            energy: "木炁仁德能量输布期"
        },
        {
            name: "启蛰",
            description: "由于历史的原因，启蛰与雨水的位置发生了变动。启蛰是二十四个节气中的第2个节气，实为第5个。",
            phenomena: "一候獭祭鱼；二候候雁北；三候草木萌动",
            position: "太阳到达黄经330度",
            wind: "条风",
            element: "五行阴阳属性是阳木",
            sound: "角音波",
            qi: "厥阴风木",
            energy: "木炁仁德能量峰值期"
        },
        {
            name: "古雨水",
            description: "由于历史的原因，启蛰与雨水的位置发生了变动。古雨水是二十四个节气中的第3个节气，实为第6个。",
            phenomena: "一候桃始华；二候仓庚鸣；三候鹰化为鸠",
            position: "太阳到达黄经345度",
            wind: "条风",
            element: "五行阴阳属性是阳木转阴木",
            sound: "角音波",
            qi: "厥阴风木",
            energy: "木炁仁德能量峰值期（开始进入尾期）"
        },
        {
            name: "春分",
            description: "春分是二十四个节气中的第4个节气，实为第7个。",
            phenomena: "一候元鸟至；二候雷乃发声；三候始电",
            position: "太阳到达黄经0度",
            wind: "明庶风",
            element: "五行阴阳属性是阴木",
            sound: "角音波转徵音波",
            qi: "少阴君火",
            energy: "木炁仁德能量收敛期，转入火炁礼德能量输布"
        },
        {
            name: "古谷雨",
            description: "由于历史的原因，谷雨与清明的位置发生了变动。古谷雨是二十四个节气中的第5个节气，实为第8个。",
            phenomena: "一候桐始华；二候田鼠化鴽；三候虹始见",
            position: "太阳到达黄经15度",
            wind: "明庶风",
            element: "五行阴阳属性是阴木转阳土",
            sound: "角音波转徵音波",
            qi: "少阴君火",
            energy: "转入火炁礼德能量输布"
        },
        {
            name: "古清明",
            description: "由于历史的原因，谷雨与清明的位置发生了变动。古清明是二十四个节气中的第6个节气，实为第9个。",
            phenomena: "一候萍始生；二候鸣鸠拂羽；三候戴胜降桑",
            position: "太阳到达黄经30度",
            wind: "明庶风",
            element: "五行阴阳属性是阳土",
            sound: "徵音波",
            qi: "少阴君火",
            energy: "火炁礼德能量峰值期"
        },
        {
            name: "立夏",
            description: "立夏是二十四节气中的第7个节气，实为第10个。",
            phenomena: "一候蝼蝈鸣；二候蚯蚓出；三候王瓜生",
            position: "太阳到达黄经45度",
            wind: "清明风",
            element: "五行阴阳属性是阳土转阴火",
            sound: "徵音波",
            qi: "少阴君火",
            energy: "火炁礼德能量峰值期"
        },
        {
            name: "小满",
            description: "小满是二十四节气中的第8个节气，实为第11个。",
            phenomena: "一候苦菜秀；二候靡草死；三候麦秋至",
            position: "太阳到达黄经60度",
            wind: "清明风",
            element: "五行阴阳属性是阴火",
            sound: "徵音波",
            qi: "少阳相火",
            energy: "火炁礼德能量下降期和收敛期"
        },
        {
            name: "芒种",
            description: "芒种是二十四节气中的第9个节气，实为第12个。",
            phenomena: "一候螳螂生；二候鵙始鸣；三候反舌无声",
            position: "太阳到达黄经75度",
            wind: "清明风转景风",
            element: "五行阴阳属性是阴火转阳火",
            sound: "徵音波转宫音波",
            qi: "少阳相火",
            energy: "火炁礼德能量下降期"
        },
        {
            name: "夏至",
            description: "夏至是二十四节气中的第10个节气，实为第13个。",
            phenomena: "一候鹿角解；二候蜩始鸣；三候半夏生",
            position: "太阳到达黄经90度",
            wind: "景风",
            element: "五行阴阳属性是阳火",
            sound: "宫音波",
            qi: "少阳相火",
            energy: "土炁信德能量输布期"
        },
        {
            name: "小暑",
            description: "小暑是二十四节气中的第11个节气，实为第14个。",
            phenomena: "一候温风至；二候蟋蟀居宇；三候鹰始鸷",
            position: "太阳到达黄经105度",
            wind: "景风",
            element: "五行阴阳属性是阳火转阴土",
            sound: "宫音波",
            qi: "少阳相火",
            energy: "土炁信德能量输布期"
        },
        {
            name: "大暑",
            description: "大暑是二十四节气中的第12个节气，实为第15个。",
            phenomena: "一候腐草为萤；二候土润溽暑；三候大雨时行",
            position: "太阳到达黄经120度",
            wind: "景风转凉风",
            element: "五行阴阳属性是阴土",
            sound: "宫音波",
            qi: "太阴湿土",
            energy: "土炁信德能量输布尾期"
        },
        {
            name: "立秋",
            description: "立秋是二十四节气中的第13个节气，实为第16个。",
            phenomena: "一候凉风至；二候白露降；三候寒蝉鸣",
            position: "太阳到达黄经135度",
            wind: "凉风",
            element: "五行阴阳属性是阳金",
            sound: "商音波",
            qi: "太阴湿土",
            energy: "金炁义德能量输布开始期"
        },
        {
            name: "处暑",
            description: "处暑是二十四节气中的第14个节气，实为第17个。",
            phenomena: "一候鹰祭鸟；二候天地始肃；三候禾乃登",
            position: "太阳到达黄经150度",
            wind: "凉风",
            element: "五行阴阳属性是阳金",
            sound: "商音波",
            qi: "太阴湿土",
            energy: "金炁义德能量输布期"
        },
        {
            name: "白露",
            description: "白露是二十四节气中的第15个节气，实为第18个。",
            phenomena: "一候鸿雁来；二候玄鸟归；三候群鸟养羞",
            position: "太阳到达黄经165度",
            wind: "凉风",
            element: "五行阴阳属性是阳金转阴金",
            sound: "商音波",
            qi: "太阴湿土",
            energy: "金炁义德能量输布期"
        },
        {
            name: "秋分",
            description: "秋分是二十四节气中的第16个节气，实为第19个。",
            phenomena: "一候雷始收声；二候蛰虫坯户；三候水始涸",
            position: "太阳到达黄经180度",
            wind: "阊阖风",
            element: "五行阴阳属性是阴金",
            sound: "商音波",
            qi: "阳明燥金",
            energy: "金炁义德能量峰值期"
        },
        {
            name: "寒露",
            description: "寒露是二十四节气中的第17个节气，实为第20个。",
            phenomena: "一候鸿雁来宾；二候雀入大水为蛤；三候菊有黄华",
            position: "太阳到达黄经195度",
            wind: "阊阖风",
            element: "五行阴阳属性是阴金转阳土",
            sound: "商音波",
            qi: "阳明燥金",
            energy: "金炁义德能量峰值期下滑阶段"
        },
        {
            name: "霜降",
            description: "霜降是二十四节气中的第18个节气，实为第21个。",
            phenomena: "一候豺乃祭兽；二候草木黄落；三候蛰虫咸俯",
            position: "太阳到达黄经210度",
            wind: "阊阖风",
            element: "五行阴阳属性是阳土",
            sound: "商音波",
            qi: "阳明燥金",
            energy: "金炁义德能量收尾期"
        },
        {
            name: "立冬",
            description: "立冬是二十四节气中的第19个节气，实为第22个。",
            phenomena: "一候水始冰；二候地始冻；三候雉入大水为蜃",
            position: "太阳到达黄经225度",
            wind: "不周风",
            element: "五行阴阳属性是阴水",
            sound: "立冬后九日商音波转羽音波",
            qi: "阳明燥金",
            energy: "立冬后九日从金炁义德收尾期转为水炁智德能量输布期"
        },
        {
            name: "小雪",
            description: "小雪是二十四节气中的第20个节气，实为第23个。",
            phenomena: "一候虹藏不见；二候天气上升；三候闭塞成冬",
            position: "太阳到达黄经240度",
            wind: "不周风",
            element: "五行阴阳属性是阴水",
            sound: "羽音波",
            qi: "太阳寒水",
            energy: "水炁智德能量输布期"
        },
        {
            name: "大雪",
            description: "大雪是二十四节气中的第21个节气，实为第24个。",
            phenomena: "一候鹖旦不鸣；二候虎始交；三候荔挺出",
            position: "太阳到达黄经255度",
            wind: "不周风",
            element: "五行阴阳属性是阴水转阳水",
            sound: "羽音波",
            qi: "太阳寒水",
            energy: "水炁智德能量峰值期"
        },
        {
            name: "冬至",
            description: "冬至是二十四节气中的第22个节气，实为第1个。在夏、商(殷)、周时期天人合一的传统历法中，冬至为新年的开始，真正意义上的春节。",
            phenomena: "一候蚯蚓结；二候麋角解；三候水泉动",
            position: "太阳到达黄经270度",
            wind: "不周风止，转广莫风",
            element: "五行阴阳属性是阳水",
            sound: "羽音波",
            qi: "太阳寒水",
            energy: "水炁智德能量峰值期"
        },
        {
            name: "小寒",
            description: "小寒是二十四节气中的第23个节气，实为第2个。",
            phenomena: "一候雁北乡；二候鹊始巢；三候雉始雊",
            position: "太阳到达黄经285度",
            wind: "广莫风",
            element: "五行阴阳属性是阳水，大寒前转阴土",
            sound: "羽音波",
            qi: "太阳寒水",
            energy: "水炁智德能量收敛期"
        },
        {
            name: "大寒",
            description: "大寒是二十四节气中的第24个节气，实为第3个。",
            phenomena: "一候鸡始乳；二候征鸟厉疾；三候水泽腹坚",
            position: "太阳到达黄经300度",
            wind: "广莫风",
            element: "五行阴阳属性是阴土",
            sound: "角音波",
            qi: "厥阴风木",
            energy: "木炁仁德能量输布期"
        }
    ];

    /******************************************************************
     * 用户每年只需在此添加新一年的节气日期（北京时间）
     * 键名为立春所在的年份（例如2025年立春在2025-02-03，则键名为2025）
     * 值是一个长度为24的数组，顺序必须与 solarTermBase 完全一致
     * 日期格式："YYYY-MM-DD"
     ******************************************************************/
    const solarTermDatesByYear = {
        // 2025年（示例，来自原始数据）
        2025: [
            "2025-02-03", "2025-02-18", "2025-03-05", "2025-03-20",
            "2025-04-04", "2025-04-20", "2025-05-05", "2025-05-21",
            "2025-06-05", "2025-06-21", "2025-07-07", "2025-07-22",
            "2025-08-07", "2025-08-23", "2025-09-07", "2025-09-23",
            "2025-10-08", "2025-10-23", "2025-11-07", "2025-11-22",
            "2025-12-07", "2025-12-21", "2026-01-05", "2026-01-20"
        ],
        // 请在下方添加新一年的数据，例如：
        2026: [
            "2026-02-04", "2026-02-18", "2026-03-05", "2026-03-20",
            "2026-04-05", "2026-04-20", "2026-05-05", "2026-05-21",
            "2026-06-05", "2026-06-21", "2026-07-07", "2026-07-23",
            "2026-08-07", "2026-08-23", "2026-09-07", "2026-09-23",
            "2026-10-08", "2026-10-23", "2026-11-07", "2026-11-22",
            "2026-12-07", "2026-12-22", "2027-01-05", "2027-01-20"
        ]
        // 注意：日期必须从紫金山天文台等权威渠道获取，此处仅为示例。
    };

    // ---------- 工具函数（全部基于北京时间）----------

    // 将 "YYYY-MM-DD" 解析为北京时间0点的 UTC 时间戳
    function parseBeijingDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return Date.UTC(year, month - 1, day) + 8 * 60 * 60 * 1000;
    }

    // 获取当前北京日期的字符串 "YYYY-MM-DD"
    function getCurrentBeijingDateStr() {
        const now = new Date();
        const bjTime = now.getTime() + 8 * 60 * 60 * 1000;
        const bjDate = new Date(bjTime);
        const year = bjDate.getUTCFullYear();
        const month = bjDate.getUTCMonth() + 1;
        const day = bjDate.getUTCDate();
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // 获取当前格式化日期（用于显示），如 "4月15日"
    function getCurrentFormattedDate() {
        const now = new Date();
        const bjTime = now.getTime() + 8 * 60 * 60 * 1000;
        const bjDate = new Date(bjTime);
        const month = bjDate.getUTCMonth() + 1;
        const day = bjDate.getUTCDate();
        return `${month}月${day}日`;
    }

    // 计算距离下一个节气的天数（基于北京时间）
    function getDaysToNextTerm(nextTermDate) {
        const nextTimestamp = parseBeijingDate(nextTermDate);
        const todayStart = parseBeijingDate(getCurrentBeijingDateStr());
        const diff = nextTimestamp - todayStart;
        return Math.ceil(diff / (1000 * 3600 * 24));
    }

    // ---------- 构建所有年份的节气数据 ----------

    function buildAllSolarTerms() {
        const allTerms = [];
        // 遍历所有年份
        Object.keys(solarTermDatesByYear).forEach(year => {
            const dates = solarTermDatesByYear[year];
            // 安全检查
            if (dates.length !== solarTermBase.length) {
                console.error(`年份 ${year} 的节气日期数量不正确，应为 ${solarTermBase.length}，实际为 ${dates.length}`);
                return;
            }
            // 合并基础信息和日期
            solarTermBase.forEach((base, index) => {
                allTerms.push({
                    ...base,
                    date: dates[index]
                });
            });
        });
        // 按日期升序排序
        allTerms.sort((a, b) => parseBeijingDate(a.date) - parseBeijingDate(b.date));
        return allTerms;
    }

    // 全局节气数据（已排序）
    const allSolarTerms = buildAllSolarTerms();

    // ---------- 核心逻辑：查找当前节气和下一个节气 ----------

    function getCurrentAndNextSolarTerm() {
        const todayStr = getCurrentBeijingDateStr();
        const todayTime = parseBeijingDate(todayStr);

        // 找到今天之后的第一个节气
        const nextTerm = allSolarTerms.find(term => parseBeijingDate(term.date) > todayTime) || allSolarTerms[0];

        // 当前节气是上一个
        const nextIndex = allSolarTerms.indexOf(nextTerm);
        const currentTerm = nextIndex === 0 ? allSolarTerms[allSolarTerms.length - 1] : allSolarTerms[nextIndex - 1];

        return { currentTerm, nextTerm };
    }

    // ---------- 创建节气卡片 ----------

    function createJieqiTabs() {
        const asideContent = document.querySelector('#aside-content');
        if (!asideContent) return;

        const { currentTerm, nextTerm } = getCurrentAndNextSolarTerm();
        const daysToNext = getDaysToNextTerm(nextTerm.date);

        // 创建自定义侧边栏卡片
        const cardWidget = document.createElement('div');
        cardWidget.className = 'card-widget card-jieqi';

        // 标题
        const itemHeadline = document.createElement('div');
        itemHeadline.className = 'item-headline';
        itemHeadline.innerHTML = '<i class="fas fa-cloud-sun"></i><span>二十四节气</span>';
        cardWidget.appendChild(itemHeadline);

        // 当前节气提示
        const currentTermInfo = document.createElement('div');
        currentTermInfo.className = 'jieqi-current-info';
        currentTermInfo.innerHTML = `
            <div class="term-date">日期: ${getCurrentFormattedDate()}</div>
            <div class="current-term">当前节气: ${currentTerm.name}</div>  
            <div class="next-term">距离下一个节气 ${nextTerm.name} 还有 <strong>${daysToNext}</strong> 天</div>
        `;
        cardWidget.appendChild(currentTermInfo);

        // 选项卡容器
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'jieqi-tabs-container';

        // 选项卡按钮
        const tabNav = document.createElement('div');
        tabNav.className = 'jieqi-tab-nav';

        const tabCategories = [
            { id: 'tab-jieqi', name: '节气序列<br>节气知识' },
            { id: 'tab-phenomena', name: '三候<br>黄道位置' },
            { id: 'tab-elements', name: '五音八风<br>四季五行' },
            { id: 'tab-energy', name: '六气能量<br>天地能量' }
        ];

        tabCategories.forEach((tab, index) => {
            const tabButton = document.createElement('div');
            tabButton.className = `jieqi-tab-button ${index === 0 ? 'active' : ''}`;
            tabButton.setAttribute('data-tab', tab.id);
            tabButton.innerHTML = tab.name;
            tabButton.addEventListener('click', function() {
                document.querySelectorAll('.jieqi-tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.jieqi-tab-content').forEach(content => content.classList.remove('active'));

                this.classList.add('active');
                document.getElementById(tab.id).classList.add('active');
            });
            tabNav.appendChild(tabButton);
        });

        tabsContainer.appendChild(tabNav);

        // 选项卡内容
        const tabContentsContainer = document.createElement('div');
        tabContentsContainer.className = 'jieqi-tab-contents';

        // 第一个选项卡：节气序列
        const jieqiTab = document.createElement('div');
        jieqiTab.className = 'jieqi-tab-content active';
        jieqiTab.id = 'tab-jieqi';
        jieqiTab.innerHTML = `
            <div class="jieqi-current-content">
                <div class="term-info-label">节气序列：</div>
                <div class="term-info-value">${currentTerm.description}</div>
            </div>
        `;

        // 第二个选项卡：三候与黄道位置
        const phenomenaTab = document.createElement('div');
        phenomenaTab.className = 'jieqi-tab-content';
        phenomenaTab.id = 'tab-phenomena';
        phenomenaTab.innerHTML = `
            <div class="jieqi-current-content">
                <div class="term-info-label">三候：</div>
                <div class="term-info-value">${currentTerm.phenomena}</div>
                <div class="term-info-label">黄道位置：</div>
                <div class="term-info-value">${currentTerm.position}</div>
            </div>
        `;

        // 第三个选项卡：八风、五行、五音
        const elementsTab = document.createElement('div');
        elementsTab.className = 'jieqi-tab-content';
        elementsTab.id = 'tab-elements';
        elementsTab.innerHTML = `
            <div class="jieqi-current-content">
                <div class="term-info-label">八风能量：</div>
                <div class="term-info-value">${currentTerm.wind}</div>
                <div class="term-info-label">四季五行：</div>
                <div class="term-info-value">${currentTerm.element}</div>
                <div class="term-info-label">五音能量：</div>
                <div class="term-info-value">${currentTerm.sound}</div>
            </div>
        `;

        // 第四个选项卡：六气能量与天地能量
        const energyTab = document.createElement('div');
        energyTab.className = 'jieqi-tab-content';
        energyTab.id = 'tab-energy';
        energyTab.innerHTML = `
            <div class="jieqi-current-content">
                <div class="term-info-label">六气能量：</div>
                <div class="term-info-value">${currentTerm.qi}</div>
                <div class="term-info-label">天地能量：</div>
                <div class="term-info-value">${currentTerm.energy}</div>
            </div>
        `;

        tabContentsContainer.appendChild(jieqiTab);
        tabContentsContainer.appendChild(phenomenaTab);
        tabContentsContainer.appendChild(elementsTab);
        tabContentsContainer.appendChild(energyTab);

        tabsContainer.appendChild(tabContentsContainer);
        cardWidget.appendChild(tabsContainer);

        // 将卡片添加到侧边栏
        const stickyLayout = asideContent.querySelector('.sticky_layout');
        if (stickyLayout) {
            stickyLayout.insertBefore(cardWidget, stickyLayout.firstChild);
        } else {
            asideContent.appendChild(cardWidget);
        }
    }

    // ---------- 更新节气卡片信息 ----------

    function updateJieqiCard() {
        const { currentTerm, nextTerm } = getCurrentAndNextSolarTerm();
        const daysToNext = getDaysToNextTerm(nextTerm.date);

        // 更新日期显示
        const termDateEl = document.querySelector('.jieqi-current-info .term-date');
        if (termDateEl) {
            termDateEl.textContent = `日期: ${getCurrentFormattedDate()}`;
        }
        // 更新当前节气
        const currentTermEl = document.querySelector('.jieqi-current-info .current-term');
        if (currentTermEl) {
            currentTermEl.textContent = `当前节气: ${currentTerm.name}`;
        }
        // 更新下一个节气和天数
        const nextTermEl = document.querySelector('.jieqi-current-info .next-term');
        if (nextTermEl) {
            nextTermEl.innerHTML = `距离下一个节气 ${nextTerm.name} 还有 <strong>${daysToNext}</strong> 天`;
        }
        // 更新选项卡内容
        const jieqiValue = document.querySelector('#tab-jieqi .term-info-value');
        if (jieqiValue) {
            jieqiValue.textContent = currentTerm.description;
        }
        const phenomenaValues = document.querySelectorAll('#tab-phenomena .term-info-value');
        if (phenomenaValues.length >= 2) {
            phenomenaValues[0].textContent = currentTerm.phenomena;
            phenomenaValues[1].textContent = currentTerm.position;
        }
        const elementsValues = document.querySelectorAll('#tab-elements .term-info-value');
        if (elementsValues.length >= 3) {
            elementsValues[0].textContent = currentTerm.wind;
            elementsValues[1].textContent = currentTerm.element;
            elementsValues[2].textContent = currentTerm.sound;
        }
        const energyValues = document.querySelectorAll('#tab-energy .term-info-value');
        if (energyValues.length >= 2) {
            energyValues[0].textContent = currentTerm.qi;
            energyValues[1].textContent = currentTerm.energy;
        }
    }

    // ---------- 初始化 ----------

    if (document.getElementById('aside-content')) {
        createJieqiTabs();
        // 每分钟更新一次（包括倒计时和节气信息）
        setInterval(updateJieqiCard, 60000);
    }
});
