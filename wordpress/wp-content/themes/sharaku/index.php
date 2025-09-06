<?php include get_template_directory() . '/parts/header.php'; ?>
<!-- この中に書いていくmain -->
<!-- body -->
<main>
    <!-- MapView -->
    <div class="map-view-container">
        <div id="map" class="map-view"></div>
    </div>

    <!-- LocationView -->
    <div class="location-view-wrapper isOpening">
        <div class="search-wrapper">
            <!-- Close button -->
            <span class="close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="white"
                        d="M8.7 7.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.3 3.3l-3.3 3.3c-.2.2-.3.4-.3.7c0 .6.4 1 1 1c.3 0 .5-.1.7-.3l4-4c.4-.4.4-1 0-1.4zM16 7c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1s1-.4 1-1V8c0-.6-.4-1-1-1" />
                </svg>
            </span>

            <div class="search-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2">
                        <path d="m21 21l-4.34-4.34" />
                        <circle cx="11" cy="11" r="8" />
                    </g>
                </svg>
                <input type="text" id="search-input" placeholder="検索" />
                <button class="clear-search" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 56 56">
                        <path fill="currentColor"
                            d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m-8.414-13.5a1.99 1.99 0 0 1-1.992-1.992c0-.539.234-1.008.609-1.36l6.984-7.03l-6.984-7.032a1.8 1.8 0 0 1-.61-1.36c0-1.077.891-1.945 1.993-1.945c.539 0 1.008.211 1.36.586l7.03 7.008l7.079-7.031c.398-.422.82-.61 1.336-.61c1.101 0 1.992.891 1.992 1.97c0 .538-.188.984-.586 1.359l-7.031 7.054l7.007 6.985c.352.375.586.844.586 1.406a1.99 1.99 0 0 1-1.992 1.992a1.93 1.93 0 0 1-1.383-.586l-7.007-7.031l-6.985 7.031a1.93 1.93 0 0 1-1.406.586" />
                    </svg>
                </button>
            </div>
            <div class="tagList">
                <?php
                    // すべての投稿のタグを取得
                    $tags = get_tags();
                    $season_tags = ['春', '夏', '秋', '冬'];
                    
                    if ($tags) :
                        echo '<div class="tag-list">';
                        foreach ($tags as $tag) :
                            $is_season = in_array($tag->name, $season_tags) ? ' data-season="'.esc_attr($tag->name).'"' : '';
                    ?>
                <span class="tag-button" <?php echo $is_season; ?>><?php echo esc_html($tag->name); ?></span>
                <?php 
                        endforeach;
                        echo '</div>';
                    endif;
                ?>
            </div>
        </div>

        <div class="location-view">
            <?php
            // 投稿を取得
            $args = array(
                'post_type' => 'post',
                'posts_per_page' => -1
            );
            $posts_query = new WP_Query($args);

            if ($posts_query->have_posts()) :
                while ($posts_query->have_posts()) : $posts_query->the_post();
                    // 緯度経度を取得
                    $lat = get_post_meta(get_the_ID(), 'lat', true);
                    $lng = get_post_meta(get_the_ID(), 'lng', true);
                    ?>
            <a href="<?php the_permalink(); ?>" class="location-item-link">
                <div class="location-item" data-lat="<?php echo esc_attr($lat); ?>" 
                    data-lng="<?php echo esc_attr($lng); ?>">
                    <div class="location-item-img-container">
                        <?php
                        // コンテンツから最初の画像を取得
                        $content = get_the_content();
                        preg_match('/<img[^>]+>/i', $content, $firstImage);
                        
                        if ($firstImage) {
                            echo $firstImage[0];  // 最初の画像を表示
                        } elseif (has_post_thumbnail()) {
                            // 画像が見つからない場合はアイキャッチ画像を表示
                            the_post_thumbnail('medium', ['class' => 'location-item-img']);
                        }
                    ?>
                    </div>
                    <div class="location-item-content">
                        <h2 class="location-item-title"><?php the_title(); ?></h2>
                        <div class="location-item-tags-view">
                            <?php
                                // すべての投稿のタグを取得
                                $tags = get_the_tags();
                                $season_tags = ['春', '夏', '秋', '冬'];
                                
                                if ($tags) :
                                    echo '<div class="tag-list pc-tag-list">';
                                    foreach ($tags as $tag) :
                                        $is_season = in_array($tag->name, $season_tags) ? ' data-season="'.esc_attr($tag->name).'"' : '';
                                ?>
                            <span class="tag-button pc-tag-button"
                                <?php echo $is_season; ?>><?php echo esc_html($tag->name); ?></span>
                            <?php 
                                    endforeach;
                                    echo '</div>';
                                endif;
                            ?>
                        </div>
                        <?php
                            // 投稿コンテンツから住所情報を取得
                            $content = get_the_content();
                            $address = '';
                            
                            // 'paragraph-access' クラスを持つ要素から住所を抽出
                            if (preg_match('/<p[^>]*class="[^"]*paragraph-access[^"]*"[^>]*>(.*?)<\/p>/s', $content, $matches)) {
                                $address = strip_tags($matches[1]);
                            }
                        ?>
                        <p class="location-item-address"><?php echo esc_html($address); ?></p>

                    </div>
                </div>
            </a>
            <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
    </div>
</main>

<script>
// 投稿データをJavaScriptで使用できるように変換
const locations = [
    <?php
    if ($posts_query->have_posts()) : 
        while ($posts_query->have_posts()) : $posts_query->the_post();
        $lat = get_post_meta(get_the_ID(), 'lat', true);
        $lng = get_post_meta(get_the_ID(), 'lng', true);
        ?> {
        lat: <?php echo $lat ? $lat : '0'; ?>,
        lng: <?php echo $lng ? $lng : '0'; ?>,
        title: "<?php echo esc_js(get_the_title()); ?>",
        image: "<?php echo get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'); ?>",
        description: "<?php echo esc_js(get_the_excerpt()); ?>"
    },
    <?php endwhile; wp_reset_postdata(); endif; ?>
];
</script>
<?php include get_template_directory() . '/parts/footer.php'; ?>