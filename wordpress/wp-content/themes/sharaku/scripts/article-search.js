// scripts/article-search.js
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("mobile-search-input");
    const clearButton = document.getElementById("mobile-clear-search");
    const articles = document.querySelectorAll(".article-card");

    // 🔍 検索処理
    function filterArticles() {
        const keyword = searchInput.value.toLowerCase().trim();

        if (keyword === "") {
            // 入力が空ならすべて表示
            articles.forEach((article) => {
                article.style.display = "";
            });
            clearButton.style.display = "none";
            return;
        }

        // キーワードがある場合の絞り込み
        articles.forEach((article) => {
            const title = article.querySelector(".article-title")?.textContent.toLowerCase() || "";
            const meta = article.querySelector(".article-meta")?.textContent.toLowerCase() || "";
            const text = (title + " " + meta).replace(/\s+/g, " ").trim();

            if (text.includes(keyword)) {
                article.style.display = "";
            } else {
                article.style.display = "none";
            }
        });

        // クリアボタン表示切り替え
        clearButton.style.display = "flex";
    }

    // 🔁 入力イベントで即時フィルタリング
    searchInput.addEventListener("input", filterArticles);

    // ❌ クリアボタン押下時
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        clearButton.style.display = "none";
        // 全件再表示
        articles.forEach((article) => {
            article.style.display = "";
        });
    });
});
