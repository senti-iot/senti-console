<?php 

/* Endpoint */
//headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//include Object files and DB

include_once '../config/database.php';
include_once '../objects/project.php';

$database = new Database();
$db = $database->getConnection();

$project = new Project($db);

$data = json_decode(file_get_contents("php://input"));

(int)$project->id =  (int)$data->id;
$project->address = $data->address;
$project->title = $data->title;
$project->description = $data->description;
$project->open_date = $data->open_date;
$project->tags = $data->tags;
$project->progress = $data->progress;
$project->hits = $data->hits;
$project->img = $data->img;

if($project->create()){
	echo '{';
		echo 'Success';
	echo '}';
}
else {
	echo '{';
		echo 'Failed';
	echo '}';
}
