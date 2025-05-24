// 搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const siteCards = document.querySelectorAll('.site-card');
    const categorySections = document.querySelectorAll('.category-section');

    // 搜索功能
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // 显示所有内容
            siteCards.forEach(card => {
                card.style.display = 'flex';
                card.classList.remove('hidden');
            });
            categorySections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            // 搜索匹配
            let hasVisibleCards = {};
            
            siteCards.forEach(card => {
                const keywords = card.getAttribute('data-keywords') || '';
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                const isMatch = keywords.includes(searchTerm) || 
                               title.includes(searchTerm) || 
                               description.includes(searchTerm);
                
                if (isMatch) {
                    card.style.display = 'flex';
                    card.classList.remove('hidden');
                    
                    // 标记该分类有可见卡片
                    const section = card.closest('.category-section');
                    if (section) {
                        hasVisibleCards[section.id || section.className] = true;
                    }
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
            
            // 隐藏没有可见卡片的分类
            categorySections.forEach(section => {
                const sectionCards = section.querySelectorAll('.site-card');
                const visibleCards = Array.from(sectionCards).filter(card => 
                    !card.classList.contains('hidden')
                );
                
                if (visibleCards.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });
        }
        
        // 高亮搜索结果
        highlightSearchResults(searchTerm);
    });

    // 高亮搜索结果
    function highlightSearchResults(searchTerm) {
        siteCards.forEach(card => {
            if (card.style.display !== 'none') {
                const title = card.querySelector('h3');
                const description = card.querySelector('p');
                
                // 移除之前的高亮
                title.innerHTML = title.textContent;
                description.innerHTML = description.textContent;
                
                if (searchTerm) {
                    // 添加新的高亮
                    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
                    title.innerHTML = title.textContent.replace(regex, '<mark>$1</mark>');
                    description.innerHTML = description.textContent.replace(regex, '<mark>$1</mark>');
                }
            }
        });
    }

    // 转义正则表达式特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 清空搜索
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    });

    // 卡片点击统计（可选功能）
    siteCards.forEach(card => {
        card.addEventListener('click', function() {
            const siteName = this.querySelector('h3').textContent;
            console.log(`访问网站: ${siteName}`);
            
            // 可以在这里添加访问统计逻辑
            // 例如发送到 Google Analytics 或其他统计服务
        });
    });

    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });

    // 添加搜索提示
    const searchHints = [
        'github', 'python', '视频', '学习', 'ai', '工具', 
        '翻译', '电影', '代码', '教程', '下载', '开发'
    ];

    let hintIndex = 0;
    function rotatePlaceholder() {
        searchInput.placeholder = `搜索网站... (试试 "${searchHints[hintIndex]}")`;
        hintIndex = (hintIndex + 1) % searchHints.length;
    }

    // 每5秒轮换一次提示
    setInterval(rotatePlaceholder, 5000);

    // 添加平滑滚动
    function smoothScrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 添加回到顶部按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow-medium);
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
        z-index: 1000;
        font-size: 1.2rem;
    `;

    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', smoothScrollToTop);

    // 显示/隐藏回到顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // 添加加载动画
    function addLoadingAnimation() {
        const cards = document.querySelectorAll('.site-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    addLoadingAnimation();

    // 添加主题切换功能（可选）
    function createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'theme-toggle';
        themeToggle.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid var(--border-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
            z-index: 1001;
        `;

        document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // createThemeToggle(); // 取消注释以启用主题切换

    // 添加网站状态检查（可选）
    function checkSiteStatus() {
        // 这里可以添加检查网站是否可访问的逻辑
        // 例如使用 fetch API 检查网站状态
    }

    // 添加快捷访问功能
    document.addEventListener('keydown', function(e) {
        // 数字键快速访问（1-9）
        if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const index = parseInt(e.key) - 1;
            const visibleCards = Array.from(siteCards).filter(card => 
                card.style.display !== 'none' && !card.classList.contains('hidden')
            );
            
            if (visibleCards[index]) {
                e.preventDefault();
                visibleCards[index].click();
            }
        }
    });

    // 添加搜索历史（使用 localStorage）
    function saveSearchHistory(term) {
        if (!term.trim()) return;
        
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history = history.filter(item => item !== term); // 移除重复项
        history.unshift(term); // 添加到开头
        history = history.slice(0, 10); // 只保留最近10个
        
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    function getSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    // 在搜索时保存历史
    searchInput.addEventListener('change', function() {
        if (this.value.trim()) {
            saveSearchHistory(this.value.trim());
        }
    });

    console.log('个人导航站已加载完成！');
    console.log('快捷键：');
    console.log('- Ctrl/Cmd + K: 聚焦搜索框');
    console.log('- Esc: 清空搜索');
    console.log('- 数字键 1-9: 快速访问可见的网站');
}); 