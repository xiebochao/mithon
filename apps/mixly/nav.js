layui.use('element', function () {
    var element = layui.element;
    $(".layui-nav-third-child").hide();
    $(".third-class").hover(function () {
        $(".layui-nav-third-child").hide();
        $(this).next().css('left', $(this).parent().parent().width()+1);
        $(this).next().toggle();
    }, function () {
        $(".layui-nav-third-child").hide();
    });
    $(".layui-nav-third-child").hover(function () {
        $(this).toggle();
    }, function () {
        $(".layui-nav-third-child").hide();
    });
    $(".layui-nav-item").hover(function () {
        if ($(this).find('dl').css('right') == "0px") {
            $(this).find('dl').css('left', parseInt(parseInt(($(this).width()) - parseInt($(this).find('dl').width()))/2));
            $(this).find('dl').css('right', "auto");
        }
    },function () {
    });
    $("#filename_input").on("click", function () {
        try {
            if ($(this).find('select')) {
                if ($("#filename_input > div.layui-form-select dl").css('right') == "0px") {
                    $("#filename_input > div.layui-form-select dl").css('cssText', "left:" + parseInt(parseInt(($(this).width()) - parseInt($("#filename_input > div.layui-form-select dl").width()))/2) + " !important;right:auto !important;");
                }
            }
        } catch(e) {
            console.log(e);
        }
    });
});
layui.use('layer', function(){
    var layer = layui.layer;
});


function new_file(){
    layer.confirm(MSG['confirm_newfile'], {
        title:false,
        btn: [MSG['newfile_yes'], MSG['newfile_no']] 
        ,btn2: function(index, layero){
            layer.close(index);
        }
    }, function(index, layero){
        mixlyjs.createFn();
        layer.close(index);
    });
}
function open_language(){
    layer.confirm(MSG['choose_language'], {
        title:false,
        btn: ['简体中文', '繁体中文', 'English'] 
        ,btn3: function(index, layero){
            Code.changeLanguage_en();
        }
    }, function(index, layero){
        Code.changeLanguage_zh_hans();
    }, function(index){
        Code.changeLanguage_zh_hant();
    });
}
function open_theme(){
    layer.confirm(MSG['choose_theme'], {
        title:false,
        btn: ['Dark', 'Light'] 
        ,btn2: function(index, layero){
            localStorage.Theme = 'Light';
            Code.changeEditorTheme_light();
        }
    }, function(index, layero){
        localStorage.Theme = 'Dark';
        Code.changeEditorTheme_dark();
        layer.close(index);
    });
}

//Demo
layui.use('form', function(){
var form = layui.form;

//监听提交
form.on('submit(formDemo)', function(data){
    layer.msg(JSON.stringify(data.field));
    return false;
});
});