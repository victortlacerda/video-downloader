const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('downloader',{
 getStatus:()=>ipcRenderer.invoke('status'),setup:()=>ipcRenderer.invoke('setup'),
 chooseFolder:()=>ipcRenderer.invoke('choose-folder'),openFolder:p=>ipcRenderer.invoke('open-folder',p),
 download:o=>ipcRenderer.invoke('download',o),
 onSetupProgress:cb=>ipcRenderer.on('setup-progress',(_e,d)=>cb(d)),
 onDownloadProgress:cb=>ipcRenderer.on('download-progress',(_e,d)=>cb(d))
});