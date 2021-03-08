<?php  

    include('config.php');

    print_r($_FILES);
    print_r($_REQUEST);

    // $spaces = $client->listBuckets();
    // foreach ($spaces['Buckets'] as $space){
    //     echo $space['Name']."\n";
    // }

    $client->putObject([
        'Bucket' => 'childlanglab-permalink-media',
        'Key'    => $_REQUEST['filename'].'.wav',
        'Body'   => fopen($_FILES['filedata']['tmp_name'], 'r+'),
        'ACL'    => 'private',
        'ContentType' => 'audio/wav'
   ]);

?>