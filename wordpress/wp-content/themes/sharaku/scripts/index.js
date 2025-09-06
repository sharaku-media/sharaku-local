let map;
let markers = [];
let currentSelectedMarker = null;
const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
const selectedIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

// 投稿カードをハイライト表示する関数
function highlightLocationItem(targetLat, targetLng) {
    const locationItems = document.querySelectorAll(".location-item");

    // 全ての投稿から既存のハイライトとアニメーションを削除
    locationItems.forEach((item) => {
        item.classList.remove("highlighted", "fade-out");
    });

    locationItems.forEach((item) => {
        const itemLat = parseFloat(item.dataset.lat);
        const itemLng = parseFloat(item.dataset.lng);

        // 緯度経度が一致する投稿を表示
        if (itemLat === targetLat && itemLng === targetLng) {
            const locationView = document.querySelector(".location-view");

            // デバイスサイズに応じてスクロール方向を変更
            const isPC = window.innerWidth >= 600;

            if (isPC) {
                // PC版：縦スクロール
                const itemOffset = item.offsetTop;
                locationView.scrollTo({
                    top: itemOffset - 220,
                    behavior: "smooth",
                });
            } else {
                // スマホ版：横スクロール
                const itemOffset = item.offsetLeft;
                const containerWidth = locationView.clientWidth;
                const itemWidth = item.offsetWidth;
                // カードを中央に配置するようにオフセットを計算
                const scrollLeft = itemOffset - (containerWidth - itemWidth) / 2;
                locationView.scrollTo({
                    left: Math.max(0, scrollLeft),
                    behavior: "smooth",
                });
            }

            // ハイライト効果を追加
            item.classList.add("highlighted");

            // 3秒後にフェードアウトアニメーションを開始
            setTimeout(() => {
                item.classList.add("fade-out");

                // アニメーション完了後にクラスを削除
                setTimeout(() => {
                    item.classList.remove("highlighted", "fade-out");
                }, 500); // フェードアウトアニメーションの時間と同じ
            }, 2500); // 表示時間を少し短くしてフェードアウト時間を確保
        }
    });
}

function initMap() {
    // デフォルトの中心位置（大阪）
    const osakaCenter = {
        lat: 34.6937,
        lng: 135.5023,
    };

    // 地図の初期化
    map = new google.maps.Map(document.getElementById("map"), {
        center: osakaCenter,
        zoom: 11,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ],
        // 追加の地図オプション
        mapTypeControl: false, // 地図タイプの切り替えを非表示
        streetViewControl: false, // ストリートビューを非表示
        fullscreenControl: false, // 全画面表示ボタンを非表示
    });

    const infoWindow = new google.maps.InfoWindow();

    // マーカーの作成
    locations.forEach((location, index) => {
        const marker = new google.maps.Marker({
            position: {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lng),
            },
            map: map,
            icon: defaultIcon,
            title: location.title,
        });

        // マーカーのクリックイベント
        marker.addListener("click", () => {
            // マーカーのハイライト
            if (currentSelectedMarker) {
                currentSelectedMarker.setIcon(defaultIcon);
            }
            marker.setIcon(selectedIcon);
            currentSelectedMarker = marker;
            currentSelectedMarker.locationData = location; // ロケーションデータを保存

            // 対応する投稿をハイライト表示
            highlightLocationItem(location.lat, location.lng);

            // パネルが閉じている場合は開く（PC版のみ）
            const locationViewWrapper = document.querySelector(".location-view-wrapper");
            if (window.innerWidth >= 600 && locationViewWrapper.classList.contains("isClosing")) {
                locationViewWrapper.classList.remove("isClosing");
                locationViewWrapper.classList.add("isOpening");
            }
        });

        markers.push(marker);
    });
}

// 地図の初期化を実行
window.initMap = initMap;

// // パネル開閉機能
// Close Btn
const locationViewWrapper = document.querySelector(".location-view-wrapper");

const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", () => {
    if (locationViewWrapper.classList.contains("isOpening")) {
        locationViewWrapper.classList.remove("isOpening");
        locationViewWrapper.classList.add("isClosing");
    } else {
        locationViewWrapper.classList.remove("isClosing");
        locationViewWrapper.classList.add("isOpening");
    }
});

// 画面リサイズ時の処理
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // 現在選択されているマーカーがある場合、再度ハイライト表示を実行
        if (currentSelectedMarker && currentSelectedMarker.locationData) {
            const location = currentSelectedMarker.locationData;
            highlightLocationItem(location.lat, location.lng);
        }
    }, 100);
});
