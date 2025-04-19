// 二十四节气侧边栏Tabs功能
document.addEventListener('DOMContentLoaded', function() {
    // 节气数据
    const solarTerms = [
        { 
            name: "立春", 
            date: "2025-02-03", 
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
            date: "2025-02-18", 
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
            date: "2025-03-05", 
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
            date: "2025-03-20", 
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
            date: "2025-04-04", 
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
            date: "2025-04-20", 
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
            date: "2025-05-05", 
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
            date: "2025-05-21", 
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
            date: "2025-06-05", 
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
            date: "2025-06-21", 
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
            date: "2025-07-07", 
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
            date: "2025-07-22", 
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
            date: "2025-08-07", 
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
            date: "2025-08-23", 
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
            date: "2025-09-07", 
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
            date: "2025-09-23", 
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
            date: "2025-10-08", 
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
            date: "2025-10-23", 
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
            date: "2025-11-07", 
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
            date: "2025-11-22", 
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
            date: "2025-12-07", 
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
            date: "2025-12-21", 
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
            date: "2026-01-05", 
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
            date: "2026-01-20", 
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

    // 获取当前日期
    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 查找当前和下一个节气
    function getCurrentAndNextSolarTerm() {
        const today = getCurrentDate();
        const todayTime = new Date(today).getTime();
        
        // 找到今天之后的第一个节气
        const nextTerm = solarTerms.find(term => new Date(term.date).getTime() > todayTime) || solarTerms[0];
        
        // 找到当前节气（今天之前的最后一个节气）
        let currentTermIndex = solarTerms.findIndex(term => term.date === nextTerm.date) - 1;
        if (currentTermIndex < 0) currentTermIndex = solarTerms.length - 1;
        
        const currentTerm = solarTerms[currentTermIndex];
        
        return { currentTerm, nextTerm };
    }

    // 格式化日期为标准格式
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    }

    // 获取当前格式化日期
    function getCurrentFormattedDate() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        return `${month}月${day}日`;
    }

    // 计算距离下一个节气的天数
    function getDaysToNextTerm(nextTermDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // 解析日期并确保时间为0点0分0秒
        const [year, month, day] = nextTermDate.split('-').map(Number);
        const nextDate = new Date(year, month - 1, day);
        nextDate.setHours(0, 0, 0, 0);
        
        // 计算日期差异（毫秒）并转换为天数
        const timeDiff = nextDate.getTime() - today.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return days;
    }

    // 创建节气Tabs
    function createJieqiTabs() {
        const asideContent = document.querySelector('#aside-content');
        if (!asideContent) return;

        // 创建自定义侧边栏卡片
        const cardWidget = document.createElement('div');
        cardWidget.className = 'card-widget card-jieqi';
        
        // 创建标题
        const itemHeadline = document.createElement('div');
        itemHeadline.className = 'item-headline';
        itemHeadline.innerHTML = '<i class="fas fa-cloud-sun"></i><span>二十四节气</span>';
        cardWidget.appendChild(itemHeadline);

        // 获取当前节气信息
        const { currentTerm, nextTerm } = getCurrentAndNextSolarTerm();
        const daysToNext = getDaysToNextTerm(nextTerm.date);
        
        // 创建当前节气提示
        const currentTermInfo = document.createElement('div');
        currentTermInfo.className = 'jieqi-current-info';
        currentTermInfo.innerHTML = `
            <div class="term-date">日期: ${getCurrentFormattedDate()}</div>
            <div class="current-term">当前节气: ${currentTerm.name}</div>  
            <div class="next-term">距离下一个节气 ${nextTerm.name} 还有 <strong>${daysToNext}</strong> 天</div>
        `;
        cardWidget.appendChild(currentTermInfo);

        // 创建选项卡容器
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'jieqi-tabs-container';
        
        // 创建选项卡按钮
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
        
        // 创建选项卡内容
        const tabContentsContainer = document.createElement('div');
        tabContentsContainer.className = 'jieqi-tab-contents';
        
        // 第一个选项卡：节气序列
        const jieqiTab = document.createElement('div');
        jieqiTab.className = 'jieqi-tab-content active';
        jieqiTab.id = 'tab-jieqi';
        
        // 只显示当前节气的内容
        const jieqiContent = document.createElement('div');
        jieqiContent.className = 'jieqi-current-content';
        jieqiContent.innerHTML = `
            <div class="term-info-label">节气序列：</div>
            <div class="term-info-value">${currentTerm.description}</div>
        `;
        jieqiTab.appendChild(jieqiContent);
        
        // 第二个选项卡：三候与黄道位置
        const phenomenaTab = document.createElement('div');
        phenomenaTab.className = 'jieqi-tab-content';
        phenomenaTab.id = 'tab-phenomena';
        
        const phenomenaContent = document.createElement('div');
        phenomenaContent.className = 'jieqi-current-content';
        phenomenaContent.innerHTML = `
            <div class="term-info-label">三候：</div>
            <div class="term-info-value">${currentTerm.phenomena}</div>
            <div class="term-info-label">黄道位置：</div>
            <div class="term-info-value">${currentTerm.position}</div>
        `;
        phenomenaTab.appendChild(phenomenaContent);
        
        // 第三个选项卡：八风、五行、五音
        const elementsTab = document.createElement('div');
        elementsTab.className = 'jieqi-tab-content';
        elementsTab.id = 'tab-elements';
        
        const elementsContent = document.createElement('div');
        elementsContent.className = 'jieqi-current-content';
        elementsContent.innerHTML = `
            <div class="term-info-label">八风能量：</div>
            <div class="term-info-value">${currentTerm.wind}</div>
            <div class="term-info-label">四季五行：</div>
            <div class="term-info-value">${currentTerm.element}</div>
            <div class="term-info-label">五音能量：</div>
            <div class="term-info-value">${currentTerm.sound}</div>
        `;
        elementsTab.appendChild(elementsContent);
        
        // 第四个选项卡：六气能量与天地能量
        const energyTab = document.createElement('div');
        energyTab.className = 'jieqi-tab-content';
        energyTab.id = 'tab-energy';
        
        const energyContent = document.createElement('div');
        energyContent.className = 'jieqi-current-content';
        energyContent.innerHTML = `
            <div class="term-info-label">六气能量：</div>
            <div class="term-info-value">${currentTerm.qi}</div>
            <div class="term-info-label">天地能量：</div>
            <div class="term-info-value">${currentTerm.energy}</div>
        `;
        energyTab.appendChild(energyContent);
        
        // 添加所有选项卡
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

    // 更新节气卡片信息
    function updateJieqiCard() {
        // 获取当前节气信息
        const { currentTerm, nextTerm } = getCurrentAndNextSolarTerm();
        const daysToNext = getDaysToNextTerm(nextTerm.date);
        
        // 更新倒计时显示
        const nextTermElement = document.querySelector('.next-term strong');
        if (nextTermElement) {
            nextTermElement.textContent = daysToNext;
        }
        
        // 更新当前日期显示
        const termDateElement = document.querySelector('.term-date');
        if (termDateElement) {
            termDateElement.innerHTML = `日期: ${getCurrentFormattedDate()}`;
        }
    }

    // 页面加载时创建节气Tabs
    if (document.getElementById('aside-content')) {
        // 创建节气卡片
        createJieqiTabs();
        
        // 添加定时更新功能，每分钟检查一次倒计时是否需要更新
        setInterval(updateJieqiCard, 60000); // 每分钟更新一次
    }
});