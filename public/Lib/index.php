<?php
    include('./social-stream/social-stream.php');

    /**
     * Obtener hashtags de Twitter con #
     * 
     * @param array $hashtagsTwitter
     * @return array
     */
    function obtenerHashtagsConSimbolo($hashtags) {
        foreach ($hashtags as $key => $hashtag) {
            $hashtags[$key] = ($hashtag[0] === "#") ? $hashtag : "#" . $hashtag;
        }

        return $hashtags;
    }

    /**
     * Obtener hashtags disponibles para el Social Wall
     * 
     * @return array
     */
    function obtenerRedesAConsultar() {
        $redes = array();

        $hashtagsTwitter = (json_decode($_GET['hashtagsTwitter'])) ? json_decode($_GET['hashtagsTwitter']) : [];
        $hashtagsInstagram = (json_decode($_GET['hashtagsInstagram'])) ? json_decode($_GET['hashtagsInstagram']) : [];

        $hashtagsTwitter = obtenerHashtagsConSimbolo($hashtagsTwitter);

        if (count($hashtagsTwitter) > 0) {
            $redes['twitter'] = [
                'twitter_id_3' => $hashtagsTwitter,
                'twitter_images' => 'small',
                'twitter_feeds' => ''
            ];
        }

        if (count($hashtagsInstagram) > 0) {
            $redes['instagram'] = [
                'instagram_id_2' => $hashtagsInstagram
            ];
        }

        $redes['instagram'] = [
            'instagram_id_2' => ['paris']
        ];

        $redes['rss'] = [
            'rss_id_1' => ['http://www.oneshow.com/api/RSS/' . $_GET['eventoId']],
            'rss_text' => 0
        ];

        return $redes;
    }
?>

<?php
    echo social_stream(
        array(
            'id' => '1',
            'type' => 'wall',
            'network' => obtenerRedesAConsultar(),
            'theme' => 'sb-modern-light',
            'itemwidth' => 250,
            'results' => ($_GET['cantidadDeResultados']) ? $_GET['cantidadDeResultados'] : 30,
            'cache' => 720,
            'debuglog' => 1,
            'iframe' => 'media',
            'breakpoints' => array('4', '4', '3', '3', '2', '1', '1'),
            'filter_search' => false,
            'add_files' => true,
            'loadmore' => false
        )
    );
?>