// モバイル検索機能
document.addEventListener("DOMContentLoaded", function () {
    const mobileSearchIcon = document.querySelector(".search-icon");
    const mobileSearchOverlay = document.getElementById("mobile-search-overlay");
    const mobileSearchBack = document.querySelector(".mobile-search-back");
    const mobileSearchClose = document.querySelector(".mobile-search-close");
    const mobileSearchInput = document.getElementById("mobile-search-input");
    const mobileClearSearch = document.getElementById("mobile-clear-search");
    const mobileSelectedTags = document.getElementById("mobile-selected-tags");
    const mobileSearchResults = document.getElementById("mobile-search-results");

    let selectedTags = [];
    let searchText = "";

    const seasonTags = {
        春: "#41CA4D",
        夏: "#F65F55",
        秋: "#EF7D30",
        冬: "#5D8EF2",
    };

    // 検索画面を開く
    function openMobileSearch() {
        mobileSearchOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        // 少し遅れて入力フィールドにフォーカス
        setTimeout(() => {
            mobileSearchInput.focus();
        }, 300);
    }

    // 検索画面を閉じる
    function closeMobileSearch() {
        mobileSearchOverlay.classList.remove("active");
        document.body.style.overflow = "";
        // 検索状態をリセット
        resetSearch();
    }

    // 検索状態をリセット
    function resetSearch() {
        selectedTags = [];
        searchText = "";
        mobileSearchInput.value = "";
        updateSelectedTagsDisplay();
        updateClearButtonVisibility();
        hideSearchResults(); // 初回は結果を非表示

        // タグボタンの選択状態をリセット
        document.querySelectorAll(".mobile-tag-button").forEach((button) => {
            button.classList.remove("selected");
        });
    }

    // 検索結果の表示/非表示を制御
    function showSearchResults() {
        mobileSearchResults.classList.add("show");
    }

    function hideSearchResults() {
        mobileSearchResults.classList.remove("show");
    }

    // 選択されたタグの表示を更新
    function updateSelectedTagsDisplay() {
        mobileSelectedTags.innerHTML = "";

        selectedTags.forEach((tagText) => {
            const tagElement = document.createElement("span");
            tagElement.className = "mobile-selected-tag";
            tagElement.textContent = tagText;

            // 季節タグの場合はdata-season属性を追加
            if (seasonTags[tagText]) {
                tagElement.setAttribute("data-season", tagText);
            }

            // タグをクリックで削除
            tagElement.addEventListener("click", () => {
                removeTag(tagText);
            });

            mobileSelectedTags.appendChild(tagElement);
        });

        // プレースホルダーを動的に変更
        if (selectedTags.length > 0) {
            mobileSearchInput.placeholder = "追加検索...";
        } else {
            mobileSearchInput.placeholder = "検索";
        }
    }

    // タグを追加
    function addTag(tagText) {
        if (!selectedTags.includes(tagText)) {
            selectedTags.push(tagText);
            updateSelectedTagsDisplay();
            updateClearButtonVisibility();
            filterMobileResults();
        }
    }

    // タグを削除
    function removeTag(tagText) {
        selectedTags = selectedTags.filter((tag) => tag !== tagText);
        updateSelectedTagsDisplay();
        updateClearButtonVisibility();
        filterMobileResults();

        // タグボタンの選択状態も解除
        const button = Array.from(document.querySelectorAll(".mobile-tag-button")).find(
            (btn) => btn.textContent.trim() === tagText
        );
        if (button) {
            button.classList.remove("selected");
        }
    }

    // クリアボタンの表示状態を更新
    function updateClearButtonVisibility() {
        if (selectedTags.length > 0 || searchText) {
            mobileClearSearch.style.display = "flex";
        } else {
            mobileClearSearch.style.display = "none";
        }
    }

    // 検索結果をフィルタリング
    function filterMobileResults() {
        // 検索条件があるかチェック
        const hasSearchConditions = selectedTags.length > 0 || searchText.trim() !== "";
        console.log("検索条件:", { selectedTags, searchText, hasSearchConditions });

        if (hasSearchConditions) {
            showSearchResults();
        } else {
            hideSearchResults();
            return; // 検索条件がない場合は処理を終了
        }

        const resultItems = document.querySelectorAll(".mobile-result-item");
        console.log("検索対象のアイテム数:", resultItems.length);

        resultItems.forEach((item) => {
            const title = item.querySelector(".mobile-result-title").textContent.toLowerCase();
            const address = item.querySelector(".mobile-result-address").textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll(".mobile-result-tag")).map((tag) =>
                tag.textContent.trim().toLowerCase()
            ); // trim()を追加して空白を除去

            console.log(
                "投稿:",
                title,
                "投稿のタグ:",
                tags,
                "選択されたタグ:",
                selectedTags.map((t) => t.toLowerCase())
            );

            // タグによる絞り込み（選択されたすべてのタグが投稿のタグに含まれているかチェック）
            const hasSelectedTags =
                selectedTags.length === 0 ||
                selectedTags.every((selectedTag) => tags.includes(selectedTag.toLowerCase()));

            // テキストによる絞り込み
            const matchesSearch =
                searchText === "" ||
                title.includes(searchText.toLowerCase()) ||
                address.includes(searchText.toLowerCase()) ||
                tags.some((tag) => tag.includes(searchText.toLowerCase()));

            console.log(
                "アイテム:",
                title,
                "タグマッチ:",
                hasSelectedTags,
                "テキストマッチ:",
                matchesSearch
            );

            // 表示/非表示の切り替え
            if (hasSelectedTags && matchesSearch) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    }

    // イベントリスナーの設定

    // 検索アイコンクリック
    if (mobileSearchIcon) {
        mobileSearchIcon.addEventListener("click", function () {
            openMobileSearch();
        });
    }

    // 戻るボタンクリック
    if (mobileSearchBack) {
        mobileSearchBack.addEventListener("click", closeMobileSearch);
    }

    // 閉じるボタンクリック
    if (mobileSearchClose) {
        mobileSearchClose.addEventListener("click", closeMobileSearch);
    }

    // 検索入力
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener("input", (e) => {
            searchText = e.target.value;
            console.log("検索テキスト変更:", searchText);
            updateClearButtonVisibility();
            filterMobileResults();
        });
    }

    // クリアボタン
    if (mobileClearSearch) {
        mobileClearSearch.addEventListener("click", () => {
            mobileSearchInput.value = "";
            searchText = "";
            selectedTags = []; // 選択されたタグもクリア
            updateSelectedTagsDisplay();
            updateClearButtonVisibility();
            // タグボタンの選択状態もリセット
            document.querySelectorAll(".mobile-tag-button").forEach((button) => {
                button.classList.remove("selected");
            });
            filterMobileResults();
        });
    }

    // タグボタンのクリック処理
    document.querySelectorAll(".mobile-tag-button").forEach((button) => {
        button.addEventListener("click", () => {
            const tagText = button.textContent.trim();
            console.log("タグボタンクリック:", tagText);

            if (selectedTags.includes(tagText)) {
                removeTag(tagText);
                button.classList.remove("selected");
            } else {
                addTag(tagText);
                button.classList.add("selected");
            }
        });
    });

    // 検索結果のアイテムクリック（ホーム画面に戻って該当の場所を表示）
    document.querySelectorAll(".mobile-result-item").forEach((item) => {
        item.addEventListener("click", () => {
            const lat = parseFloat(item.dataset.lat);
            const lng = parseFloat(item.dataset.lng);

            // 検索画面を閉じる
            closeMobileSearch();

            // 少し遅れてホーム画面の該当場所をハイライト
            setTimeout(() => {
                if (window.highlightLocationItem) {
                    window.highlightLocationItem(lat, lng);
                }
            }, 400);
        });
    });

    // ESCキーで検索画面を閉じる
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileSearchOverlay.classList.contains("active")) {
            closeMobileSearch();
        }
    });
});
