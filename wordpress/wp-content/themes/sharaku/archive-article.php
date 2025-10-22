<!-- 記事一覧 -->
<?php
// 現在がスマホなら true
$is_mobile = wp_is_mobile();

// 記事アーカイブのURLを取得
$article_archive_url = get_post_type_archive_link('article');

// スマホのときだけ ?pp=2 を追加
if ( $is_mobile ) {
    $article_archive_url = add_query_arg( 'pp', '6', $article_archive_url );
}
?>
<?php include get_template_directory() . '/parts/header.php'; ?>
<main>
    <section class="archive-header">
        <div class="back-to-top">
            <a href="<?php echo home_url(); ?>" class="back-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z" />
                </svg>
                トップに戻る
            </a>
        </div>
        <div class="mobile-search-bar post-search-bar">
            <div class="mobile-search-input-container post-search">
                <svg class="mobile-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                    viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2">
                        <path d="m21 21l-4.34-4.34" />
                        <circle cx="11" cy="11" r="8" />
                    </g>
                </svg>
                <!-- 選択されたタグが検索バー内に表示される -->
                <div class="mobile-selected-tags" id="mobile-selected-tags"></div>
                <input type="text" id="mobile-search-input" placeholder="検索" />
                <button class="mobile-clear-search" id="mobile-clear-search" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
        </div>
    </section>

    <!-- 記事一覧 -->
    <div class="article-grid">
        <?php if ( have_posts() ) : ?>
        <?php while ( have_posts() ) : the_post(); ?>
        <article class="article-card">
            <a class="article-box" href="<?php the_permalink(); ?>">
                <div class="article-thumb">
                    <?php if ( has_post_thumbnail() ) : ?>
                    <?php the_post_thumbnail('medium'); ?>
                    <?php else: ?>
                    <img src="<?php echo get_template_directory_uri(); ?>/images/no-image.png" alt="no image">
                    <?php endif; ?>
                </div>
                <div class="article-content">
                    <?php
                        // タイトル内の '!' を改行 (<br>) に置換して表示する
                        $raw_title = get_the_title();
                    // 半角/全角の '!' を消さずに直後で改行させる（'!' -> '!<br>'、'！' -> '！<br>'）
                    $escaped = esc_html( $raw_title );
                    $formatted_title = str_replace( array('!','！'), array('!<br>','！<br>'), $escaped );
                        // <br>タグのみ許可して出力
                        echo '<h2 class="article-title">' . wp_kses( $formatted_title, array( 'br' => array() ) ) . '</h2>';
                    ?>
                    <?php
                        // モバイルでのみ表示する「はじめに」セクションの抜粋を取得
                        // 本文 HTML から <h2>または<h3>で「はじめに」とある部分の直後の最初の<p>を抽出
                        $content = apply_filters('the_content', get_post_field('post_content', get_the_ID()));
                        $intro_excerpt = '';

                        if ( $content ) {
                            // 正規表現で見出し（はじめに）を探し、その直後の最初の段落を取得
                            if ( preg_match('/<(h[2-3])[^>]*>\s*はじめに\s*<\/\1>\s*(?:<!--.*?-->\s*)*<p[^>]*>(.*?)<\/p>/siu', $content, $matches) ) {
                                $intro_excerpt = wp_kses( $matches[2], array( 'a'=>array('href'=>array()), 'br'=>array(), 'strong'=>array(), 'em'=>array() ) );
                            }
                        }

                        if ( $intro_excerpt ) : ?>
                    <div class="mobile-intro-excerpt">
                        <?php echo '<p class="line-clamp">' . $intro_excerpt . '</p>'; ?>
                    </div>
                    <?php endif; ?>
                    <p class="article-meta">
                        <?php echo get_the_date('Y.m.d'); ?> ｜ <?php the_author(); ?>
                    </p>
                </div>
            </a>
        </article>
        <?php endwhile; ?>
        <?php else: ?>
        <p>記事がまだありません。</p>
        <?php endif; ?>
    </div>

    <!-- ページネーション -->
    <div class="pagination">
        <?php the_posts_pagination([
            'mid_size'           => 3,
            'prev_text'          => '&lsaquo;', // <
            'next_text'          => '&rsaquo;', // >
            'screen_reader_text' => '',
            'type'               => 'list',     // ← <ul class="page-numbers"> にする
        ]); ?>
    </div>
</main>
<?php include get_template_directory() . '/parts/footer.php'; ?>