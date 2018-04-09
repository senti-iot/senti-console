<?php 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/project.php';

$database = new Database();
$db = $database->getConnection();

$project = new Project($db);

$data = json_decode(file_get_contents("php://input"));

$project->id = $data->id;

$project->address = $data->address;
$project->title = $data->title;
$project->description = $data->description;
$project->open_date = $data->open_date;
$project->tags = $data->tags;
$project->progress = $data->progress;
$project->hits = $data->hits;
$project->img = $data->img;

if($project->update()){
	echo '{';
		echo 'Hell did not break loose';
	echo '}';
}
else {
	echo '{'
		echo 'Hell broke loose';
	echo '}'
}

