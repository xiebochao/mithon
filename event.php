<?php
	//确认修改
	//$data=$_POST['data'];
	include_once('sql.php');
	header("Access-Control-Allow-Origin: * ");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header('Content-Type:Application/json;charset=utf-8');
	$data=$_POST['data'];
	//var_dump($data);
	$uid=$_GET['uid'];
	$create_time=time();
	$data = str_replace('[', '', $data);
    $data = str_replace(']', '', $data);
    $data = str_replace('},{', '};{', $data);
    $data = explode(";", $data);
    
	foreach($data as $key => $value) {
		//var_dump($value);
		if(!empty($value)){
			$value=json_decode($value);
			$value=(array)$value;
			$actionType=addslashes(isset($value['actionType'])?$value['actionType']:"");
		    $time=addslashes(isset($value['time'])?$value['time']:'');
		    $blockId=addslashes(isset($value['blockId'])?$value['blockId']:'');
		    $currentCode=addslashes(isset($value['currentCode'])?$value['currentCode']:'');
		    $newchildBlocks=addslashes(isset($value['newchildBlocks'])?$value['newchildBlocks']:'');
		    $newparentBlocks=addslashes(isset($value['newparentBlocks'])?$value['newparentBlocks']:'');
		   	$sql="insert into event value(null,{$uid},'{$actionType}','{$time}','{$blockId}','{$currentCode}','{$newchildBlocks}','{$newparentBlocks}','{$create_time}')";
	        $res=my_error($sql,$link);
    	}
	}