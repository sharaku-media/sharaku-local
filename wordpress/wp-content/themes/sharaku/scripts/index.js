let map;
let markers = [];
let currentSelectedMarker = null;
const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
const selectedIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

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

            // 対応する投稿を表示
            const locationItems = document.querySelectorAll(".location-item");
            locationItems.forEach((item) => {
                const itemLat = parseFloat(item.dataset.lat);
                const itemLng = parseFloat(item.dataset.lng);

                // 緯度経度が一致する投稿を表示
                if (itemLat === location.lat && itemLng === location.lng) {
                    // スクロール位置を調整
                    const locationView = document.querySelector(".location-view");
                    const itemOffset = item.offsetTop;
                    locationView.scrollTo({
                        top: itemOffset - 220,
                        behavior: "smooth",
                    });

                    // ハイライト効果を追加
                    item.classList.add("highlighted");
                    setTimeout(() => {
                        item.classList.remove("highlighted");
                    }, 2000);
                }
            });

            // パネルが閉じている場合は開く
            const locationViewWrapper = document.querySelector(".location-view-wrapper");
            if (locationViewWrapper.classList.contains("isClosing")) {
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
