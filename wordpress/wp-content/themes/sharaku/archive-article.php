<!-- 記事一覧 -->
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
                    <h2 class="article-title"><?php the_title(); ?></h2>
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
        <?php the_posts_pagination(array(
            'mid_size' => 2,
            'prev_text' => '← 前へ',
            'next_text' => '次へ →',
        )); ?>
    </div>
</main>
<?php include get_template_directory() . '/parts/footer.php'; ?>