<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- SEO基本設定 -->
    <title><?php wp_title('|', true, 'right');
            bloginfo('name'); ?></title>
    <meta name="description" content="<?php bloginfo('description'); ?>">

    <!-- 地域キーワード -->
    <meta name="geo.region" content="JP">
    <meta name="geo.position" content="34.6937;135.5023">
    <meta name="geo.region" content="JP-27">
    <meta name="geo.placename" content="関西,大阪府,兵庫県,京都府">

    <!-- OGP設定 -->
    <meta property="og:title" content="<?php wp_title('|', true, 'right');
                                        bloginfo('name'); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo esc_url(home_url('/')); ?>">
    <meta property="og:description" content="<?php bloginfo('description'); ?>">
    <?php if (has_post_thumbnail()) : ?>
    <meta property="og:image" content="<?php echo get_the_post_thumbnail_url(); ?>">
    <?php endif; ?>

    <!-- canonical URL -->
    <link rel="canonical" href="<?php echo esc_url(get_permalink()); ?>">

    <!-- google fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <!-- 共通 style -->
    <link rel="stylesheet" href="<?= esc_url(get_template_directory_uri() . '/styles/ress.css') ?>">
    <?php wp_head() ?>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>

<body>
    <!-- ここの下にheaderを用意 -->
    <!-- PCヘッダー -->
    <header class="pc-header">
        <h1 class="logo">
            <a href="<?= home_url('/') ?>">
                <img src="<?= esc_url(get_template_directory_uri() . '/images/logo.svg') ?>" alt="SHARAKU">
            </a>
        </h1>

        <div>
            <a href="<?php echo get_post_type_archive_link('article'); ?>" class="header-course-btn-pc">
                <img src="<?= esc_url(get_template_directory_uri() . '/images/写真初心者講座.png') ?>"
                    class="header-course-img" alt="写真初心者講座">
            </a>
        </div>
    </header>

    <!-- モバイルヘッダー -->
    <header class="mobile-header">
        <div class="header-left-container">
            <!-- logo -->
            <h1 class="logo">
                <a href="<?= home_url('/') ?>">
                    <img src="<?= esc_url(get_template_directory_uri() . '/images/logo.svg') ?>" alt="SHARAKU">
                </a>
            </h1>
            <div>
                <a href="<?php echo get_post_type_archive_link('article'); ?>" class="header-course-btn-mobile">
                    <img src="<?= esc_url(get_template_directory_uri() . '/images/写真初心者講座.png') ?>"
                        class="header-course-img" alt="写真初心者講座">
                </a>
            </div>
        </div>

        <!-- mobile search icon -->
        <button class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="m21 21l-4.34-4.34" />
                    <circle cx="11" cy="11" r="8" />
                </g>
            </svg>
        </button>
    </header>