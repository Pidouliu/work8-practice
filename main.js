// 音乐排行榜 - 主逻辑
console.log("音乐排行榜 已加载");

// 当前激活的标签页
let currentTab = "ranking";

// 标签页切换
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
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
