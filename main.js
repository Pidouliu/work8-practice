// 音乐排行榜 - 主逻辑
console.log("音乐排行榜 已加载");

// ========== 状态 ==========
let currentTab = "ranking";
let currentSort = "plays";
let currentKeyword = "";

// ========== 工具函数 ==========
function formatNumber(n) {
    if (n >= 10000) {
        return (n / 10000).toFixed(1) + "万";
    }
    return n.toString();
}

function isFavorited(songId) {
    return favorites.includes(songId);
}

// ========== 渲染歌曲列表 ==========
function renderSongList(container, list, showRank = true) {
    container.innerHTML = "";

    if (list.length === 0) {
        return false;
    }

    list.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = "song-item";
        li.dataset.id = song.id;

        const rankClass = showRank && index < 3 ? `rank-${index + 1}` : "";

        li.innerHTML = `
            ${showRank ? `<span class="rank-badge ${rankClass}">${index + 1}</span>` : ""}
            <div class="cover" style="background:${song.color}33">${song.cover}</div>
            <div class="song-info">
                <div class="song-name">${song.name}</div>
                <div class="song-meta">${song.artist} · ${song.album}</div>
            </div>
            <div class="song-stats">
                <span class="stat">▶ ${formatNumber(song.plays)}</span>
                <span class="stat">♥ ${formatNumber(song.likes)}</span>
            </div>
            <div class="song-actions">
                <button class="play-btn" aria-label="播放">▶</button>
                <button class="fav-btn ${isFavorited(song.id) ? "active" : ""}" aria-label="收藏">
                    ${isFavorited(song.id) ? "♥" : "♡"}
                </button>
            </div>
        `;

        // 播放按钮
        li.querySelector(".play-btn").addEventListener("click", () => playSong(song));

        // 收藏按钮
        li.querySelector(".fav-btn").addEventListener("click", () => toggleFavorite(song.id, li));

        container.appendChild(li);
    });

    return true;
}

// ========== 榜单渲染（带搜索 + 排序）==========
function renderRanking() {
    const list = document.getElementById("songList");
    const emptyTip = document.getElementById("emptyTip");

    let filtered = songs.filter(s => {
        if (!currentKeyword) return true;
        const kw = currentKeyword.toLowerCase();
        return s.name.toLowerCase().includes(kw) || s.artist.toLowerCase().includes(kw);
    });

    filtered.sort((a, b) => {
        if (currentSort === "name") return a.name.localeCompare(b.name, "zh");
        return b[currentSort] - a[currentSort];
    });

    const hasItems = renderSongList(list, filtered, true);
    emptyTip.hidden = hasItems;
}

// ========== 收藏渲染 ==========
function renderFavorites() {
    const list = document.getElementById("favList");
    const emptyTip = document.getElementById("favEmptyTip");

    const favSongs = songs.filter(s => favorites.includes(s.id));
    const hasItems = renderSongList(list, favSongs, false);
    emptyTip.hidden = hasItems;
}

// ========== 播放 ==========
function playSong(song) {
    const bar = document.getElementById("playerBar");
    const nowPlaying = document.getElementById("nowPlaying");
    nowPlaying.textContent = `♪ 正在播放：${song.name} - ${song.artist}`;
    bar.hidden = false;
    console.log("播放：", song.name);
}

document.getElementById("closePlayer").addEventListener("click", () => {
    document.getElementById("playerBar").hidden = true;
});

// ========== 收藏切换 ==========
function toggleFavorite(songId, li) {
    const btn = li.querySelector(".fav-btn");
    const idx = favorites.indexOf(songId);
    if (idx > -1) {
        favorites.splice(idx, 1);
        btn.classList.remove("active");
        btn.textContent = "♡";
        console.log("取消收藏：", songId);
    } else {
        favorites.push(songId);
        btn.classList.add("active");
        btn.textContent = "♥";
        console.log("收藏：", songId);
    }
    saveFavorites();
    // 如果在收藏页，重新渲染
    if (currentTab === "favorites") {
        renderFavorites();
    }
}

// ========== 搜索 ==========
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function doSearch() {
    currentKeyword = searchInput.value.trim();
    if (currentTab !== "ranking") {
        switchTab("ranking");
    }
    renderRanking();
}

searchBtn.addEventListener("click", doSearch);
searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") doSearch();
});
searchInput.addEventListener("input", () => {
    currentKeyword = searchInput.value.trim();
    if (currentTab === "ranking") renderRanking();
});

// ========== 排序 ==========
document.getElementById("sortSelect").addEventListener("change", e => {
    currentSort = e.target.value;
    renderRanking();
});

// ========== 标签页切换 ==========
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        switchTab(btn.dataset.tab);
    });
});

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.tab === tab);
    });
    document.querySelectorAll(".tab-panel").forEach(p => {
        p.classList.toggle("active", p.id === tab);
    });

    if (tab === "favorites") {
        renderFavorites();
    } else if (tab === "chart") {
        drawPlaysChart();
    }
}

// ========== 数据可视化：播放量柱状图（Canvas）==========
function drawPlaysChart() {
    const canvas = document.getElementById("playsChart");
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 按播放量降序取前10
    const data = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 10);
    const maxVal = data[0].plays;

    const padding = { top: 30, right: 20, bottom: 70, left: 60 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const barW = chartW / data.length * 0.6;
    const gap = chartW / data.length * 0.4;

    // 网格线 + Y轴刻度
    ctx.strokeStyle = "#eee";
    ctx.fillStyle = "#999";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
        const y = padding.top + (chartH / steps) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartW, y);
        ctx.stroke();
        const val = maxVal * (1 - i / steps);
        ctx.fillText(formatNumber(val), padding.left - 8, y);
    }

    // 柱体
    data.forEach((song, i) => {
        const x = padding.left + i * (barW + gap) + gap / 2;
        const h = (song.plays / maxVal) * chartH;
        const y = padding.top + chartH - h;

        // 渐变
        const grad = ctx.createLinearGradient(0, y, 0, y + h);
        grad.addColorStop(0, song.color);
        grad.addColorStop(1, song.color + "88");
        ctx.fillStyle = grad;

        ctx.fillRect(x, y, barW, h);

        // 数值标签
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(formatNumber(song.plays), x + barW / 2, y - 10);

        // X轴歌曲名
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const labelX = x + barW / 2;
        const labelY = padding.top + chartH + 8;
        ctx.save();
        ctx.translate(labelX, labelY);
        ctx.rotate(-Math.PI / 8);
        ctx.fillText(song.name, 0, 0);
        ctx.restore();
    });

    // 标题
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("各歌曲播放量对比（万次）", padding.left, 6);
}

// ========== 初始化 ==========
renderRanking();
