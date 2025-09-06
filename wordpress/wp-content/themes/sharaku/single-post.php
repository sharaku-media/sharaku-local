<?php
    $tags = get_the_tags();
?>
<?php include get_template_directory() . '/parts/header.php'; ?>
<main class="single-post">
    <div class="back-to-top">
        <a href="<?php echo home_url(); ?>" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z" />
            </svg>
            トップに戻る
        </a>
    </div>
    <div class="main-images">
        <div class="slider-container">
            <!-- 前の画像ボタン -->
            <button class="slider-arrow slider-arrow-prev" id="prevBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
                </svg>
            </button>

            <div class="image-track" id="imageTrack">
                <?php
                        global $post;
                        $content = $post->post_content;
                        preg_match_all('/<img[^>]+>/i', $content, $matches);
                        $images = array_slice($matches[0], 0, 4);
                        foreach ($images as $image) {
                            echo '<div class="slide">' . $image . '</div>';
                        }
                    ?>
            </div>

            <!-- 次の画像ボタン -->
            <button class="slider-arrow slider-arrow-next" id="nextBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.59 16.59L10 18l6-6l-6-6l-1.41 1.41L13.17 12z" />
                </svg>
            </button>
        </div>

        <div class="indicator">
            <?php for ($i = 0; $i < count($images); $i++): ?>
            <span class="dot" data-index="<?= $i ?>"></span>
            <?php endfor; ?>
        </div>
    </div>
    <section class="post-content">
        <h1 class="post-title"><?php the_title() ?></h1>
        <div>
            <?php if( $tags ){
                echo '<ul class="tag-list">';
                foreach( $tags as $tag ){
                    $season_tags = ['春', '夏', '秋', '冬'];
                    $is_season = in_array($tag->name, $season_tags) ? ' data-season="'.esc_attr($tag->name).'"' : '';
                    echo '<li>';
                    echo '<span class="tag-button"' . $is_season . '>' . esc_html( $tag->name ) . '</span>';
                    echo '</li>';
                }
                echo '</ul>';
            } 
            ?>
        </div>
        <div class="post-wrap">
            <?php
                    // WordPressのループを開始
                    if ( have_posts() ) :
                        while ( have_posts() ) : the_post();
                            // コンテンツを取得
                            $content = get_the_content();
                            
                            // 画像タグを見つけて、最初の4枚分を削除
                            $pattern = '/<img[^>]+>/i';
                            preg_match_all($pattern, $content, $matches);
                            
                            if (!empty($matches[0])) {
                                // 最初の4枚の画像を順番に置換
                                for ($i = 0; $i < min(4, count($matches[0])); $i++) {
                                    $content = preg_replace($pattern, '', $content, 1);
                                }
                            }
                            
                            // フィルターを適用して出力
                            echo apply_filters('the_content', $content);
                        endwhile;
                    else :
                        echo '<p>投稿が見つかりませんでした。</p>';
                    endif;
                ?>
        </div>
    </section>
</main>

<!-- 画像拡大モーダル -->
<div id="imageModal" class="image-modal">
    <div class="image-modal-overlay" id="imageModalOverlay">
        <div class="image-modal-content">
            <button class="image-modal-close" id="imageModalClose">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
            <img id="modalImage" class="modal-image" src="" alt="">

            <!-- モーダル内でのナビゲーション（複数画像がある場合） -->
            <button class="modal-nav modal-nav-prev" id="modalPrevBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
                </svg>
            </button>
            <button class="modal-nav modal-nav-next" id="modalNextBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.59 16.59L10 18l6-6l-6-6l-1.41 1.41L13.17 12z" />
                </svg>
            </button>
        </div>
    </div>
</div>

<?php include get_template_directory() . '/parts/footer.php'; ?>