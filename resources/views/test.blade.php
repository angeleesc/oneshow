<?php
    include('../app/Lib/social-stream/social-stream.php');
    echo social_stream(
        array(
            'id' => '1',
            'type' => 'wall',
            'network' => array(
                'twitter' => array(
                    'twitter_id_3' => array(
                        '#socialmedia'
                    ),
                    'twitter_images' => 'small',
                    'twitter_feeds' => ''
                ),
                'youtube' => array(
                    'youtube_id_3' => array(
                        'wordpress'
                    )
                ),
                'instagram' => array(
                    'instagram_id_2' => array(
                        'paris'
                    )
                )
            ),
            'theme' => 'sb-modern-light',
            'itemwidth' => 250,
            'results' => 30,
            'cache' => 720,
            'debuglog' => 1,
            'iframe' => 'media',
            'breakpoints' => array('4', '4', '3', '3', '2', '1', '1'),
            'filter_search' => true,
            'add_files' => true
        )
    );
?>