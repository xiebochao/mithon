<?php
	//PHP公共文件
	//连接初始化
	header("Content-tyoe:text/html;charset=utf-8");

	//连接初始化
	$link=mysqli_connect('39.100.111.0:7777','root','Nofate1978!') ;
	//or die('数据库连接失败');

	//封装错误处理函数
	/*
	@param1 string $sql，要执行的SQL指令
	@return $res,正确执行后返回结果，如果SQL错误，直接终止
	*/
	function my_error($sql,$link){
		//执行SQL语句
		$res = mysqli_query($link,$sql);
		//处理可能出现的错误
		if(!$res){
			echo "SQL执行错误，错误编号为:".mysqli_errno($link)."<br/>";
			echo "SQL执行错误，错误信息为:".mysqli_error($link);
			//终止错误继续执行
			exit();
		}
		//返回结果
		return $res;
	}
	my_error('use mht',$link);