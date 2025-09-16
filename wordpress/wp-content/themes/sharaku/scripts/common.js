document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchContainer = document.querySelector(".search-container");
    const clearButton = document.querySelector(".clear-search");
    const seasonTags = {
        春: "#41CA4D",
        夏: "#F65F55",
        秋: "#EF7D30",
        冬: "#5D8EF2",
    };

    // 選択されたタグを保持する配列
    let selectedTags = [];
    let searchText = "";

    // タグを検索バーに追加する関数
    function addTagToSearchBar(tagText) {
        if (!selectedTags.includes(tagText)) {
            // タグ要素の作成
            const tagElement = document.createElement("span");
            tagElement.className = "search-tag";
            tagElement.textContent = tagText;

            // 季節タグの場合はdata-season属性と背景色を設定
            if (seasonTags[tagText]) {
                tagElement.setAttribute("data-season", tagText);
                tagElement.style.backgroundColor = seasonTags[tagText];
                tagElement.style.color = "var(--bgColor)";
            }

            // タグクリックで削除する処理
            tagElement.addEventListener("click", () => {
                // タグ要素を削除
                tagElement.remove();
                // 選択状態を解除
                selectedTags = selectedTags.filter((tag) => tag !== tagText);
                // タグボタンの選択状態も解除
                const button = Array.from(document.querySelectorAll(".tag-button")).find(
                    (btn) => btn.textContent.trim() === tagText
                );
                if (button) {
                    button.classList.remove("selected");
                }
                updateSearchVisibility();
                filterLocations();
            });

            // 検索バーの前にタグを挿入
            searchContainer.insertBefore(tagElement, searchInput);
            selectedTags.push(tagText);
            updateSearchVisibility();
            filterLocations();
        }
    }

    // 検索フィールドの表示状態を更新
    function updateSearchVisibility() {
        // クリアボタンの表示制御
        clearButton.style.display = selectedTags.length > 0 || searchInput.value ? "flex" : "none";

        // プレースホルダーの表示制御と入力フィールドの状態管理
        if (selectedTags.length > 0) {
            searchInput.placeholder = "";
            searchInput.style.display = searchInput.value ? "block" : "none";
        } else {
            searchInput.placeholder = "検索";
            searchInput.style.display = "block";
        }
    }

    // 検索と絞り込みの関数
    function filterLocations() {
        const locationItems = document.querySelectorAll(".location-item");
        const searchValue = searchInput.value.toLowerCase();

        locationItems.forEach((item) => {
            const title = item.querySelector(".location-item-title").textContent.toLowerCase();
            const address = item.querySelector(".location-item-address").textContent.toLowerCase();
            const tags = Array.from(
                item.querySelectorAll(".location-item-tags-view .tag-button")
            ).map((tag) => tag.textContent.toLowerCase());

            // タグによる絞り込み
            const hasSelectedTags =
                selectedTags.length === 0 ||
                selectedTags.every((selectedTag) => tags.includes(selectedTag.toLowerCase()));

            // テキストによる絞り込み
            const matchesSearch =
                searchValue === "" ||
                title.includes(searchValue) ||
                address.includes(searchValue) ||
                tags.some((tag) => tag.includes(searchValue));

            // 表示/非表示の切り替え
            const itemLink = item.closest(".location-item-link");
            if (hasSelectedTags && matchesSearch) {
                itemLink.style.display = "block";
            } else {
                itemLink.style.display = "none";
            }
        });
    }

    // 検索入力のイベントリスナー
    searchInput.addEventListener("input", (e) => {
        searchText = e.target.value;
        updateSearchVisibility();
        filterLocations();
    });

    // 入力フィールドのフォーカスイベント
    searchInput.addEventListener("focus", () => {
        if (selectedTags.length > 0) {
            searchInput.style.display = "block";
            searchInput.placeholder = "追加で検索...";
        }
    });

    // 入力フィールドのブラーイベント
    searchInput.addEventListener("blur", () => {
        if (selectedTags.length > 0 && !searchInput.value) {
            setTimeout(() => {
                updateSearchVisibility();
            }, 100);
        }
    });

    // タグボタンの初期化とクリックイベント
    document.querySelectorAll(".tag-button").forEach((button) => {
        const tagText = button.textContent.trim();
        if (seasonTags[tagText]) {
            button.style.backgroundColor = seasonTags[tagText];
            button.style.color = "var(--whiteColor)"; // 季節タグボタンの文字色も設定
        }

        button.addEventListener("click", function () {
            const existingTag = Array.from(searchContainer.querySelectorAll(".search-tag")).find(
                (tag) => tag.textContent === tagText
            );

            if (existingTag) {
                // タグを削除
                existingTag.remove();
                selectedTags = selectedTags.filter((tag) => tag !== tagText);
                this.classList.remove("selected");
            } else {
                // タグを追加
                addTagToSearchBar(tagText);
                this.classList.add("selected");
            }
            updateSearchVisibility();
            filterLocations();
        });
    });

    // クリアボタンのクリックイベント
    clearButton.addEventListener("click", () => {
        searchContainer.querySelectorAll(".search-tag").forEach((tag) => tag.remove());
        selectedTags = [];
        searchInput.value = "";
        searchInput.placeholder = "検索";
        searchInput.style.display = "block";
        clearButton.style.display = "none";
        document.querySelectorAll(".tag-button").forEach((button) => {
            button.classList.remove("selected");
        });
        updateSearchVisibility();
        filterLocations();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy");
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach((img) => imageObserver.observe(img));
    }
});
