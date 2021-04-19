const {app, BrowserWindow} = require('electron')
const electron = require('electron')
const Menu = electron.Menu
app.on('ready', function createWindow () {
    //Menu.setApplicationMenu(null);
    // 可以创建多个渲染进程
    let win = new BrowserWindow({
        show: false,
        //resizable: false,
        minHeight: 400,
        minWidth: 650,
        icon: __dirname + '/media/mixly.ico',
        allowRunningInsecureContent: true, 
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true
        }
    })
    //win.webContents.openDevTools();
    win.maximize()
    win.show()

    // 渲染进程中的web页面可以加载本地文件
    win.loadFile('index.html')


    // 记得在页面被关闭后清除该变量，防止内存泄漏
    win.on('closed', function () {
        win = null
    })
})
//app.disableHardwareAcceleration()
app.allowRendererProcessReuse = false;

// 页面全部关闭后关闭主进程,不同平台可能有不同的处理方式
app.on('window-all-closed', () => {
    app.quit()
})
