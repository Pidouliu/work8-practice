// 音乐排行榜 - 歌曲数据
// 数据内置在本地，断网也可使用

const songs = [
    {
        id: 1,
        name: "晴天",
        artist: "周杰伦",
        album: "叶惠美",
        plays: 9850000,
        likes: 152000,
        cover: "🌤️",
        color: "#f5a623"
    },
    {
        id: 2,
        name: "起风了",
        artist: "买辣椒也用券",
        album: "起风了",
        plays: 8720000,
        likes: 198000,
        cover: "🍃",
        color: "#4a90d9"
    },
    {
        id: 3,
        name: "稻香",
        artist: "周杰伦",
        album: "魔杰座",
        plays: 7630000,
        likes: 134000,
        cover: "🌾",
        color: "#f8c471"
    },
    {
        id: 4,
        name: "光年之外",
        artist: "邓紫棋",
        album: "光年之外",
        plays: 7120000,
        likes: 121000,
        cover: "🌌",
        color: "#8e44ad"
    },
    {
        id: 5,
        name: "演员",
        artist: "薛之谦",
        album: "绅士",
        plays: 6890000,
        likes: 145000,
        cover: "🎭",
        color: "#34495e"
    },
    {
        id: 6,
        name: "后来",
        artist: "刘若英",
        album: "我等你",
        plays: 6540000,
        likes: 112000,
        cover: "🌸",
        color: "#e91e63"
    },
    {
        id: 7,
        name: "告白气球",
        artist: "周杰伦",
        album: "周杰伦的床边故事",
        plays: 6210000,
        likes: 167000,
        cover: "🎈",
        color: "#e74c3c"
    },
    {
        id: 8,
        name: "夜曲",
        artist: "周杰伦",
        album: "十一月的萧邦",
        plays: 5980000,
        likes: 143000,
        cover: "🌙",
        color: "#2c3e50"
    },
    {
        id: 9,
        name: "平凡之路",
        artist: "朴树",
        album: "猎户星座",
        plays: 5670000,
        likes: 118000,
        cover: "🛤️",
        color: "#16a085"
    },
    {
        id: 10,
        name: "江南",
        artist: "林俊杰",
        album: "第二天堂",
        plays: 5340000,
        likes: 105000,
        cover: "🏯",
        color: "#1abc9c"
    }
];

// 收藏列表（由 localStorage 持久化）
let favorites = JSON.parse(localStorage.getItem("music_favorites") || "[]");

function saveFavorites() {
    localStorage.setItem("music_favorites", JSON.stringify(favorites));
}
