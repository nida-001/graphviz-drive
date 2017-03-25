"use strict";function onApiLoad(){window.gapi.load("picker",{callback:onPickerApiLoad})}function onAuthApiLoad(){window.gapi.auth.authorize({client_id:clientId,scope:SCOPES.join(" "),immediate:!1},handleAuthResult)}function onPickerApiLoad(){pickerApiLoaded=!0}function checkAuth(){console.log("checkAuth"),gapi.auth.authorize({client_id:CLIENT_ID,scope:SCOPES.join(" "),immediate:!0},handleAuthResult)}function handleAuthResult(e){var t=document.getElementById("authorize-div");e&&!e.error?(t.style.display="none",oauthToken=e.access_token):t.style.display="inline"}function handleAuthClick(e){return gapi.auth.authorize({client_id:CLIENT_ID,scope:SCOPES,immediate:!1},handleAuthResult),!1}function writeFileToGDrive(e,t,n){gapi.client.load("drive","v2",function(){insertFile(e,t,n)})}function insertFile(e,t,n,i){var o,a="-------314159265358979323846",r={title:e,mimeType:n};o=n==PNG_MIME_TYPE?t:utf8_to_b64(t),console.log(o);var l="\r\n--"+a+"\r\nContent-Type: application/json\r\n\r\n"+JSON.stringify(r)+"\r\n--"+a+"\r\nContent-Type: "+n+"\r\nContent-Transfer-Encoding: base64\r\n\r\n"+o+"\r\n--"+a+"--",d={path:"/upload/drive/v2/files",method:"POST",params:{uploadType:"multipart"},headers:{"Content-Type":'multipart/mixed; boundary="'+a+'"'},body:l};drive_files[e]&&(d.path="/upload/drive/v2/files/"+encodeURIComponent(drive_files[e].id),d.method="PUT");var c=gapi.client.request(d);i||(i=function(t){alert("保存しました");t.id;drive_files[e]=t}),c.execute(i)}function loadFileFromGDrive(e){gapi.client.load("drive","v3",function(){contentRequest=gapi.client.drive.files.get({fileId:e,alt:"media"}).then(function(e){response=e,editor.getSession().setValue(e.body)})})}function utf8_to_b64(e){return window.btoa(unescape(encodeURIComponent(e)))}function drawGraph(){console.log("drawGraph called"),worker&&worker.terminate(),worker=new Worker("./worker.js");var e={src:editor.getSession().getDocument().getValue(),options:{engine:"dot",format:"svg"}};worker.onmessage=function(e){var t=document.getElementById("graph"),n=t.firstChild;n&&n.parentNode.removeChild(n);var i=new DOMParser,o=i.parseFromString(e.data,"image/svg+xml");t.appendChild(o.documentElement),png=Viz.svgXmlToPngImageElement(document.getElementById("graph").innerHTML)},worker.onerror=function(e){console.error(e)},worker.postMessage(e)}function addFileExtension(e,t){var n=e.match(/(.*)(?:\.([^.]+$))/);return n&&n[2]===t?e:e+"."+t}function createPicker(){if(pickerApiLoaded&&oauthToken){(new google.picker.PickerBuilder).addView(google.picker.ViewId.DOCS).setOAuthToken(oauthToken).setDeveloperKey(DEVELOPER_KEY).setCallback(pickerCallback).build().setVisible(!0)}}function pickerCallback(e){e[google.picker.Response.ACTION]==google.picker.Action.PICKED&&(doc=e[google.picker.Response.DOCUMENTS][0],loadFileFromGDrive(doc.id))}var TEXT_MIME_TYPE="text/plain",SVG_MIME_TYPE="image/svg+xml",PNG_MIME_TYPE="image/png",DEVELOPER_KEY="AIzaSyAI5grPt2ETORNhZp05lB950crIyNlffCc",CLIENT_ID="1027551625677-9582c548i7072iih701rp3a0aeua98jg.apps.googleusercontent.com",SCOPES=["https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/drive.install"],oauthToken,pickerApiLoaded=!1,DEFAULT_FILE={content:"DEFAULT_FILE DAYO",metadata:{id:null,title:"untitled.txt",mimeType:"text/plain",editable:!0}},DEFAULT_FIELDS="id,title,mimeType,userPermission,editable,copyable,shared,fileSize",drive_files={},metadataRequest,contentRequest,response,editor=ace.edit("editor"),worker,png;editor.getSession().setMode("ace/mode/dot"),editor.on("change",function(){drawGraph()}),document.getElementById("save_btn").addEventListener("click",function(){var e=document.getElementById("fileName").textContent,t=document.getElementById("fileFormat"),n=t.options[t.selectedIndex].value;t=document.getElementById("savePlace");var i=t.options[t.selectedIndex].value,o=prompt("File Name",e);if(!o)return void console.log("Input fileName canceled.");e=o,e=addFileExtension(e,n);var a,r;switch(n){case"dot":a=editor.getSession().getDocument().getValue(),r=TEXT_MIME_TYPE;break;case"svg":a=document.getElementById("graph").innerHTML,r=SVG_MIME_TYPE;break;case"png":a=png.src,r=PNG_MIME_TYPE}switch(i){case"local":if("dot"==n||"svg"==n){var l=new Blob([a],{type:"text/plain;charset=utf-8"});saveAs(l,e)}else if("png"==n){var d=document.createElement("a");d.href=png.src,d.download=e,d.click()}break;case"gdrive":if("png"==n){writeFileToGDrive(e+".png",a.split(",")[1],r)}else writeFileToGDrive(e,a,r)}});var doc;document.getElementById("open_btn").addEventListener("click",function(){createPicker()}),drawGraph();