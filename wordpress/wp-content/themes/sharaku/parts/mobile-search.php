<!-- モバイル検索オーバーレイ -->
<div class="mobile-search-overlay" id="mobile-search-overlay">
    <div class="mobile-search-container">
        <!-- ヘッダー部分 -->
        <div class="mobile-search-header">
            <button class="mobile-search-back">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
                </svg>
            </button>
            <button class="mobile-search-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>

        <!-- 検索バー -->
        <div class="mobile-search-bar">
            <div class="mobile-search-input-container">
                <svg class="mobile-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <path d="m21 21l-4.34-4.34" />
                        <circle cx="11" cy="11" r="8" />
                    </g>
                </svg>
                <!-- 選択されたタグが検索バー内に表示される -->
                <div class="mobile-selected-tags" id="mobile-selected-tags"></div>
                <input type="text" id="mobile-search-input" placeholder="検索" />
                <button class="mobile-clear-search" id="mobile-clear-search" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- タグリスト -->
        <div class="mobile-tag-section">
            <div class="mobile-tag-list">
                <?php
                    // すべての投稿のタグを取得
                    $tags = get_tags();
                    $season_tags = ['春', '夏', '秋', '冬'];
                    
                    if ($tags) :
                        foreach ($tags as $tag) :
                            $is_season = in_array($tag->name, $season_tags) ? ' data-season="'.esc_attr($tag->name).'"' : '';
                ?>
                <button class="mobile-tag-button" <?php echo $is_season; ?>>
                    <?php echo esc_html($tag->name); ?>
                </button>
                <?php 
                        endforeach;
                    endif;
                ?>
            </div>
        </div>

        <!-- 検索結果 -->
        <div class="mobile-search-results" id="mobile-search-results">
            <div class="mobile-results-container">
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
                <div class="mobile-result-item" data-lat="<?php echo esc_attr($lat); ?>" 
                    data-lng="<?php echo esc_attr($lng); ?>">
                    <div class="mobile-result-img">
                        <?php
                        // コンテンツから最初の画像を取得
                        $content = get_the_content();
                        preg_match('/<img[^>]+>/i', $content, $firstImage);
                        
                        if ($firstImage) {
                            echo $firstImage[0];
                        } elseif (has_post_thumbnail()) {
                            the_post_thumbnail('thumbnail', ['class' => 'mobile-result-thumbnail']);
                        }
                    ?>
                    </div>
                    <div class="mobile-result-content">
                        <h3 class="mobile-result-title"><?php the_title(); ?></h3>
                        <?php
                            // 投稿コンテンツから住所情報を取得
                            $content = get_the_content();
                            $address = '';
                            
                            // 'paragraph-access' クラスを持つ要素から住所を抽出
                            if (preg_match('/<p[^>]*class="[^"]*paragraph-access[^"]*"[^>]*>(.*?)<\/p>/s', $content, $matches)) {
                                $address = strip_tags($matches[1]);
                            }
                        ?>
                        <p class="mobile-result-address"><?php echo esc_html($address); ?></p>
                        <div class="mobile-result-tags">
                            <?php
                                $tags = get_the_tags();
                                if ($tags) :
                                    foreach ($tags as $tag) :
                                        $is_season = in_array($tag->name, $season_tags) ? ' data-season="'.esc_attr($tag->name).'"' : '';
                            ?>
                            <span class="mobile-result-tag"<?php echo $is_season; ?>><?php echo esc_html($tag->name); ?></span>
                            <?php 
                                    endforeach;
                                endif;
                            ?>
                        </div>
                    </div>
                </div>
                <?php
                    endwhile;
                    wp_reset_postdata();
                endif;
                ?>
            </div>
        </div>
    </div>
</div>
