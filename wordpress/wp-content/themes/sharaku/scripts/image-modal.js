document.addEventListener("DOMContentLoaded", function () {
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalClose = document.getElementById("imageModalClose");
    const modalOverlay = document.getElementById("imageModalOverlay");
    const modalPrevBtn = document.getElementById("modalPrevBtn");
    const modalNextBtn = document.getElementById("modalNextBtn");

    let allImages = [];
    let currentImageIndex = 0;

    // ページ内のすべての画像を取得し、拡大ボタンを追加
    function initializeImages() {
        // より包括的なセレクターで画像を取得
        const images = document.querySelectorAll(
            ".main-images img, .post-content img, .point-group img, figure img, .wp-block-group img"
        );

        console.log("見つかった画像要素:", images.length); // デバッグ用

        // 新しい画像のみを追加
        images.forEach((img, globalIndex) => {
            // 既に処理済みの画像はスキップ
            if (img.parentElement.classList.contains("image-container")) {
                return;
            }

            // 画像の読み込み完了を待つ
            const processImage = () => {
                // 画像が実際に存在し、srcがあることを確認
                let imageSrc = img.src;

                // 詳細なデバッグ情報を追加
                console.log("画像要素の詳細:", {
                    element: img,
                    src: img.src,
                    currentSrc: img.currentSrc,
                    dataSrc: img.getAttribute("data-src"),
                    dataLazySrc: img.getAttribute("data-lazy-src"),
                    dataOriginal: img.getAttribute("data-original"),
                    srcset: img.getAttribute("srcset"),
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    complete: img.complete,
                });

                if (
                    !imageSrc ||
                    imageSrc === "" ||
                    imageSrc.includes("undefined") ||
                    imageSrc.includes("data:image")
                ) {
                    // data-src等の遅延読み込み属性もチェック
                    imageSrc =
                        img.getAttribute("data-src") ||
                        img.getAttribute("data-lazy-src") ||
                        img.getAttribute("data-original") ||
                        img.currentSrc ||
                        (img.getAttribute("srcset") && img.getAttribute("srcset").split(" ")[0]);
                }

                // undefinedが含まれるURLを除外
                if (
                    !imageSrc ||
                    imageSrc === "" ||
                    imageSrc.includes("undefined") ||
                    imageSrc.includes("data:image")
                ) {
                    console.warn("有効な画像のsrcが見つかりません:", img);
                    console.warn("除外された画像URL:", imageSrc);
                    return;
                }

                console.log("処理中の画像:", imageSrc); // デバッグ用

                // 画像をコンテナでラップ
                const container = document.createElement("div");
                container.className = "image-container";

                // 画像の親要素に挿入
                img.parentNode.insertBefore(container, img);
                container.appendChild(img);

                // 拡大ボタンを作成
                const expandButton = document.createElement("button");
                expandButton.className = "expand-button";
                expandButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9.5 13.09L10.91 14.5L6.41 19H10v2H3v-7h2v3.59zM10.91 9.5L9.5 10.91L5.91 7.5H10V5.5H3v7h2V8.91zM14.5 13.09L13.09 14.5L17.59 19H14v2h7v-7h-2v3.59zM13.09 9.5L14.5 10.91L18.09 7.5H14V5.5h7v7h-2V8.91z"/>
                    </svg>
                `;

                // 新しい画像をallImagesに追加
                const index = allImages.length;
                allImages.push(img);

                // 拡大ボタンにクリックイベントを追加
                expandButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("拡大ボタンクリック:", img.src);
                    openModal(index);
                });

                // コンテナに拡大ボタンを追加
                container.appendChild(expandButton);

                // 画像にクリック不可能なスタイルを追加
                img.classList.add("clickable-image");
            };

            // 画像が読み込み完了している場合は即座に処理
            if (img.complete && img.naturalWidth > 0) {
                processImage();
            } else {
                // 読み込み完了を待って処理
                img.addEventListener("load", processImage);
                // 一定時間後に強制実行（フォールバック）
                setTimeout(processImage, 2000);
            }
        });

        console.log("初期化された画像数:", allImages.length); // デバッグ用
    }

    // モーダルを開く
    function openModal(imageIndex) {
        if (!allImages[imageIndex]) {
            console.error("画像が見つかりません:", imageIndex);
            return;
        }

        currentImageIndex = imageIndex;
        const img = allImages[imageIndex];

        // 画像のsrcを取得（様々な属性を考慮）
        let imageSrc = img.src;

        console.log("モーダル用画像の詳細チェック:", {
            element: img,
            src: img.src,
            currentSrc: img.currentSrc,
            dataSrc: img.getAttribute("data-src"),
            dataLazySrc: img.getAttribute("data-lazy-src"),
            dataOriginal: img.getAttribute("data-original"),
            srcset: img.getAttribute("srcset"),
        });

        if (
            !imageSrc ||
            imageSrc === "" ||
            imageSrc.includes("data:image") ||
            imageSrc.includes("undefined")
        ) {
            // 遅延読み込みやプレースホルダー画像の場合、他の属性をチェック
            imageSrc =
                img.getAttribute("data-src") ||
                img.getAttribute("data-lazy-src") ||
                img.getAttribute("data-original") ||
                img.getAttribute("data-full-url") ||
                img.currentSrc ||
                (img.getAttribute("srcset") &&
                    img.getAttribute("srcset").split(" ")[0].split(",")[0]);
        }

        // undefinedが含まれるURLを厳密にチェック
        if (
            !imageSrc ||
            imageSrc === "" ||
            imageSrc.includes("data:image") ||
            imageSrc.includes("undefined") ||
            imageSrc === "undefined"
        ) {
            console.error("有効な画像のsrcが見つかりません:", img);
            console.log("img要素の全属性:", {
                src: img.src,
                currentSrc: img.currentSrc,
                dataSrc: img.getAttribute("data-src"),
                dataLazySrc: img.getAttribute("data-lazy-src"),
                dataOriginal: img.getAttribute("data-original"),
                srcset: img.getAttribute("srcset"),
                outerHTML: img.outerHTML.substring(0, 200) + "...",
            });
            return;
        }

        console.log("モーダルで表示する画像:", imageSrc); // デバッグ用

        // 画像をモーダルに設定
        modalImage.src = imageSrc;
        modalImage.alt = img.alt || "";

        // 画像の読み込み完了を待つ
        modalImage.onload = function () {
            console.log("モーダル画像の読み込み完了"); // デバッグ用
            // モーダルを表示
            imageModal.classList.add("active");
            document.body.style.overflow = "hidden"; // 背景のスクロールを無効化

            // ナビゲーションボタンの状態を更新
            updateModalNavigation();
        };

        modalImage.onerror = function () {
            console.error("モーダル画像の読み込みエラー:", imageSrc);
            // エラーの場合でもモーダルを表示（エラーメッセージ等を表示するため）
            imageModal.classList.add("active");
            document.body.style.overflow = "hidden";
            updateModalNavigation();
        };
    }

    // モーダルを閉じる
    function closeModal() {
        imageModal.classList.remove("active");
        document.body.style.overflow = ""; // スクロールを再有効化
    }

    // モーダル内ナビゲーションの状態を更新
    function updateModalNavigation() {
        if (modalPrevBtn) {
            modalPrevBtn.disabled = currentImageIndex === 0;
        }
        if (modalNextBtn) {
            modalNextBtn.disabled = currentImageIndex === allImages.length - 1;
        }

        // 画像が1枚だけの場合はナビゲーションを非表示
        if (allImages.length <= 1) {
            if (modalPrevBtn) modalPrevBtn.style.display = "none";
            if (modalNextBtn) modalNextBtn.style.display = "none";
        } else {
            if (modalPrevBtn) modalPrevBtn.style.display = "flex";
            if (modalNextBtn) modalNextBtn.style.display = "flex";
        }
    }

    // 前の画像に移動
    function goToPrevImage() {
        if (currentImageIndex > 0) {
            openModal(currentImageIndex - 1);
        }
    }

    // 次の画像に移動
    function goToNextImage() {
        if (currentImageIndex < allImages.length - 1) {
            openModal(currentImageIndex + 1);
        }
    }

    // イベントリスナーの設定
    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    if (modalPrevBtn) {
        modalPrevBtn.addEventListener("click", goToPrevImage);
    }

    if (modalNextBtn) {
        modalNextBtn.addEventListener("click", goToNextImage);
    }

    // キーボードナビゲーション
    document.addEventListener("keydown", function (e) {
        if (!imageModal.classList.contains("active")) return;

        switch (e.key) {
            case "Escape":
                closeModal();
                break;
            case "ArrowLeft":
                goToPrevImage();
                break;
            case "ArrowRight":
                goToNextImage();
                break;
        }
    });

    // タッチスワイプ対応（モーダル内）
    let touchStartX = 0;
    let touchEndX = 0;

    if (modalImage) {
        modalImage.addEventListener("touchstart", function (e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        modalImage.addEventListener("touchend", function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleModalSwipe();
        });
    }

    function handleModalSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // 左にスワイプ（次の画像）
                goToNextImage();
            } else {
                // 右にスワイプ（前の画像）
                goToPrevImage();
            }
        }
    }

    // 画像の読み込み完了後に初期化
    function delayedInitialize() {
        // 複数回実行されても安全になるように
        setTimeout(() => {
            initializeImages();

            // WordPressコンテンツの遅延読み込み画像のために追加チェック
            setTimeout(initializeImages, 1000);
            setTimeout(initializeImages, 2000);
            setTimeout(initializeImages, 3000);
        }, 500);
    }

    // ページ読み込み完了後に実行
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", delayedInitialize);
    } else {
        // すでに読み込み完了している場合は即座に実行
        delayedInitialize();
    }

    // ページが完全に読み込まれた後にも実行
    window.addEventListener("load", () => {
        setTimeout(initializeImages, 1000);
    });

    // 画像の遅延読み込みを監視
    const observer = new MutationObserver(function (mutations) {
        let shouldReinitialize = false;
        mutations.forEach(function (mutation) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(function (node) {
                    if (
                        node.nodeType === 1 &&
                        (node.tagName === "IMG" || node.querySelector("img"))
                    ) {
                        shouldReinitialize = true;
                    }
                });
            }
            if (
                mutation.type === "attributes" &&
                mutation.target.tagName === "IMG" &&
                mutation.attributeName === "src"
            ) {
                shouldReinitialize = true;
            }
        });

        if (shouldReinitialize) {
            setTimeout(initializeImages, 100);
        }
    });

    // DOM変更を監視開始
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "data-src"],
    });
});
