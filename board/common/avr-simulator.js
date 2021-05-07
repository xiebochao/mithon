var MixlyAvrSimulate = {};

MixlyAvrSimulate.initSimulate = function () {
    if (file_save.existsSync(mixly_20_path+"\\mixlyBuild\\testArduino.ino.hex")) {
    	layui.use(['layer','form'], function(){
            var layer = layui.layer;
            layer.open({
                type: 1,
                id: "simulate_page",
                title: false,
                area: ["400px","300px"],
                closeBtn: 1,
                resize: false,
                content: $('#simulate-form'),
                success: function (layero, index) {
                    layero[0].childNodes[1].childNodes[0].classList.remove('layui-layer-close2');
                    layero[0].childNodes[1].childNodes[0].classList.add('layui-layer-close1');
                },
                end: function() {
    	            document.getElementById('simulate-form').style.display = 'none';
    	        }
            });
        });
    } else {
        layer.msg('未找到已编译文件!', {
            time: 1000
        });
    }
}