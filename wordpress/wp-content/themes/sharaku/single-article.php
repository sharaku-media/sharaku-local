<!-- 記事詳細 -->
<?php include get_template_directory() . '/parts/header.php'; ?>
<main>
    <div class="back-to-top">
        <a href="<?php echo get_post_type_archive_link('article'); ?>" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z" />
            </svg>
            トップに戻る
        </a>
    </div>
    <section class="article-container">
        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('article-detail'); ?>>
            <section class="article-header">
                <?php if ( has_post_thumbnail() ) : ?>
                <div class="article-image">
                    <?php the_post_thumbnail('large'); ?>
                </div>
                <h1 class="article-title"><?php the_title(); ?></h1>
                <div class="article-meta">
                    <div class="meta-times">
                        <?php endif; ?>
                        <?php
                                $published_datetime = get_the_date( DATE_W3C );
                                $published_display = get_the_date( 'Y/m/d' );
                            ?>
                        <span>投稿日
                            <time datetime="<?php echo esc_attr( $published_datetime ); ?>">
                                <?php echo esc_html( $published_display ); ?>
                            </time>
                        </span>

                        <?php
                            $modified_time = get_the_modified_time( 'U' );
                            $published_time = get_the_time( 'U' );
                            if ( $modified_time > $published_time ) :
                                $modified_datetime = get_the_modified_date( DATE_W3C );
                                $modified_display = get_the_modified_date( 'Y/m/d' );
                        ?>
                        <span>更新日
                            <time datetime="<?php echo esc_attr( $modified_datetime ); ?>">
                                <?php echo esc_html( $modified_display ); ?>
                            </time>
                        </span>
                        <?php endif; ?>
                    </div>
                    <span class="article-author">作成者 <?php the_author(); ?></span>
                </div>
            </section>

            <div class="article-content">
                <?php
                    // 元の投稿コンテンツ（未フィルタ）を取得
                    $raw_content = get_post_field('post_content', get_the_ID());

                    // 見出し(h2/h3)を抽出して目次を作成
                    $toc_items = array();
                    if ( preg_match_all('/<(h[2-3])[^>]*>(.*?)<\/\1>/si', $raw_content, $matches, PREG_SET_ORDER) ) {
                        $counter = 0;
                        foreach ( $matches as $m ) {
                            $tag = strtolower($m[1]);
                            $text = wp_strip_all_tags( trim( strip_shortcodes( $m[2] ) ) );
                            if ( $text === '' || $text === '関連記事' || $text === 'はじめに' ) continue;
                            $id = 'toc-' . sanitize_title_with_dashes( $text ) . '-' . $counter;
                            $toc_items[] = array(
                                'id' => $id,
                                'text' => $text,
                                'tag' => $tag,
                            );
                            $counter++;
                        }
                    }
                    // フィルタ済みのコンテンツを取得（ショートコード等を展開したもの）
                    $content = apply_filters('the_content', $raw_content);
                    // 見出しに id を埋め込む（既に id がある場合は上書きしない）
                    if ( ! empty( $toc_items ) ) {
                        $i = 0;
                        $content = preg_replace_callback('/<(h[2-3])([^>]*)>(.*?)<\/\1>/si', function($m) use (&$i, $toc_items) {
                            $tag = $m[1];
                            $attrs = $m[2];
                            $inner = $m[3];
                            // 既に id 属性があればそのまま
                            if ( preg_match('/\sid=["\"]/i', $attrs) || preg_match('/\sid\s*=\s*["\"]/i', $attrs) ) {
                                return $m[0];
                            }
                            if ( isset($toc_items[$i]) ) {
                                $id = $toc_items[$i]['id'];
                            } else {
                                $id = 'toc-' . $i;
                            }
                            $i++;
                            return '<' . $tag . ' id="' . esc_attr($id) . '"' . $attrs . '>' . $inner . '</' . $tag . '>';
                        }, $content);
                    }

                    // 目次HTMLを組み立て（はじめに見出しの直後に差し込む）
                    $toc_html = '';
                    if ( ! empty( $toc_items ) ) {
                        $toc_html .= '<nav class="article-toc"><h3>目次</h3><ul>';
                        foreach ( $toc_items as $item ) {
                            $toc_html .= '<li class="toc-' . esc_attr($item['tag']) . '"><a href="#' . esc_attr($item['id']) . '">' . esc_html($item['text']) . '</a></li>';
                        }
                        $toc_html .= '</ul></nav>';

                        // 「はじめに」と次の見出しの間に目次を挿入
                        $inserted = false;
                        $content = preg_replace('/((<h[2-3][^>]*>\s*はじめに\s*<\/h[2-3]>)\s*(.*?)(?=<h[2-3]))/ius', '$1' . $toc_html, $content, 1, $count);
                        if ( $count === 0 ) {
                            // 見出し「はじめに」が無ければ、先頭に挿入
                            $content = $toc_html . $content;
                        }
                    }
                    echo $content;
                ?>
                <?php
                    // 関連記事（最大3件）を表示
                    $related_args = array(
                        'post_type' => get_post_type(),
                        'posts_per_page' => 3,
                        'post__not_in' => array( get_the_ID() ),
                        'orderby' => 'date',
                    );

                    // まずはタグベースで関連を探す
                    $post_tags = wp_get_post_tags( get_the_ID() );
                    if ( $post_tags ) {
                        $tag_ids = array();
                        foreach ( $post_tags as $t ) $tag_ids[] = $t->term_id;
                        $related_args['tax_query'] = array(
                            array(
                                'taxonomy' => 'post_tag',
                                'field' => 'term_id',
                                'terms' => $tag_ids,
                            )
                        );
                        $related_args['orderby'] = 'rand';
                    }

                    $related = new WP_Query( $related_args );
                if ( $related->have_posts() ) :?>
                <aside class="related-posts">
                    <h3>関連記事</h3>
                    <div class="related-list">
                        <?php while ( $related->have_posts() ) : $related->the_post(); ?>
                        <article class="article-card">
                            <a class="article-box" href="<?php the_permalink(); ?>">
                                <div class="article-thumb">
                                    <?php if ( has_post_thumbnail() ) : ?>
                                    <?php the_post_thumbnail('medium'); ?>
                                    <?php else: ?>
                                    <img src="<?php echo get_template_directory_uri(); ?>/images/no-image.png"
                                        alt="no image">
                                    <?php endif; ?>
                                </div>
                                <div class="article-content">
                                    <?php
                                        $raw_title = get_the_title();
                                        $escaped = esc_html( $raw_title );
                                        $formatted_title = str_replace( array('!','！'), array('!<br>','！<br>'), $escaped );
                                        echo '<h2 class="article-title">' . wp_kses( $formatted_title, array( 'br' => array() ) ) . '</h2>';
                                    ?>
                                    <p class="article-meta">
                                        <?php echo get_the_date('Y.m.d'); ?> ｜ <?php the_author(); ?>
                                    </p>
                                </div>
                            </a>
                        </article>
                        <?php endwhile; wp_reset_postdata(); ?>
                    </div>
                </aside>
                <?php endif; 
                ?>
            </div>
        </article>
        <?php endwhile; else: ?>
        <p>記事が見つかりませんでした。</p>
        <?php endif; ?>
    </section>
</main>
<?php include get_template_directory() . '/parts/footer.php'; ?>