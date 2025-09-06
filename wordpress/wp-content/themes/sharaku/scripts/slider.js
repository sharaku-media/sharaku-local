document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".image-track");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!track || dots.length === 0) return;

    const slideWidth = track.clientWidth;
    const totalSlides = dots.length;
    let currentIndex = 0;

    // ドットクリックでスライド
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            goToSlide(i);
        });
    });

    // 前の画像ボタン
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            }
        });
    }

    // 次の画像ボタン
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < totalSlides - 1) {
                goToSlide(currentIndex + 1);
            }
        });
    }

    // スライドに移動する関数
    function goToSlide(index) {
        currentIndex = index;
        track.scrollTo({
            left: index * slideWidth,
            behavior: "smooth",
        });
        updateDots(index);
        updateArrowButtons();
    }

    // スクロールでアクティブドット更新
    track.addEventListener("scroll", () => {
        const index = Math.round(track.scrollLeft / slideWidth);
        currentIndex = index;
        updateDots(index);
        updateArrowButtons();
    });

    // ドットの状態を更新
    function updateDots(activeIndex) {
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === activeIndex);
        });
    }

    // 矢印ボタンの状態を更新
    function updateArrowButtons() {
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentIndex === totalSlides - 1;
        }
    }

    // キーボードナビゲーション
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" && currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else if (e.key === "ArrowRight" && currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        }
    });

    // タッチスワイプ対応
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && currentIndex < totalSlides - 1) {
                // 左にスワイプ（次のスライド）
                goToSlide(currentIndex + 1);
            } else if (swipeDistance < 0 && currentIndex > 0) {
                // 右にスワイプ（前のスライド）
                goToSlide(currentIndex - 1);
            }
        }
    }

    // 初期設定
    updateDots(0);
    updateArrowButtons();
});
