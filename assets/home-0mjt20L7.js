import{a as i,p as o,w as B}from"./chunk-EPOLDU6W-CP3WDhNt.js";const C="https://raw.githubusercontent.com/armbennett/tangible-11ty/main",R=[{value:"Numbers",label:"Numbers"},{value:"MusicLoops1",label:"Music Loops 1"},{value:"Mystery",label:"Mystery"},{value:"Notifications",label:"Notifications"},{value:"OdeToJoy",label:"Ode to Joy"},{value:"FurElise",label:"Fur Elise"}];function D(){const[l,$]=i.useState(!1),[v,w]=i.useState(""),[j,k]=i.useState(!0),[m,A]=i.useState(["Numbers","Notifications","Notifications"]),[a,M]=i.useState(null),[g,b]=i.useState(!1),[f,p]=i.useState(!1),y=i.useRef(null),x=(e,t,n)=>{console.log(`Preloading sound set: ${t} for thread ${n}`);const d=new window.Howl({src:[`${C}/assets/sound/${t}.mp3`],volume:.2,sprite:e.soundSets[t]});e.threads[n]=d};i.useEffect(()=>{if(!l)return;let e;const t=()=>{const c=document.getElementById("video-canvas-video"),s=document.getElementById("video-canvas"),r=document.querySelector(".video-container");if(c&&s&&r){console.log("Moving video to container and positioning canvas"),r.contains(c)||r.insertBefore(c,r.firstChild),c.style.display="block",r.contains(s)||r.appendChild(s),s.style.position="absolute",s.style.top="0",s.style.left="0",s.style.width="100%",s.style.height="100%",s.style.pointerEvents="none",s.style.zIndex="10",s.style.display="block";const T=()=>{s.width=640,s.height=480,console.log(`Canvas set to: ${s.width}x${s.height}`)},h=()=>{T()};c.addEventListener("loadedmetadata",h),c.addEventListener("playing",h),T(),console.log("Video and canvas configured"),e=()=>{c.removeEventListener("loadedmetadata",h),c.removeEventListener("playing",h)}}},n=setInterval(()=>{document.getElementById("video-canvas-video")&&(t(),clearInterval(n))},100),d=setTimeout(()=>clearInterval(n),5e3);return()=>{clearInterval(n),clearTimeout(d),e&&e()}},[l]),i.useEffect(()=>{(async()=>{try{console.log("Loading Howler.js");const n=await(await fetch(`${C}/assets/js/howler.js`)).text(),d=document.createElement("script");d.textContent=n,document.head.appendChild(d),console.log("Howler.js loaded"),console.log("Loading TopCodes.js");const s=await(await fetch(`${C}/assets/js/topcodes.js`)).text(),r=document.createElement("script");r.textContent=s,document.head.appendChild(r),console.log("TopCodes.js loaded"),console.log("Loading Tangible.js");let N=(await(await fetch(`${C}/assets/js/tangible.js`)).text()).replace("export default class Tangible","window.Tangible = class Tangible");N=N.replace(/setupTangible\(\) \{[\s\S]*?setVideoFrameCallback\("video-canvas", function \(jsonString\) \{[\s\S]*?\}, this\);[\s\S]*?\}/,`setupTangible() {
        this.setVideoCanvasHeight('video-canvas');
        let tangible = this;
        
        TopCodes.setVideoFrameCallback("video-canvas", function (jsonString) {
            console.log("TopCodes callback triggered!");
            
            var canvas = document.querySelector("#video-canvas");
            if (!canvas) {
                console.error("Canvas not found in callback!");
                return;
            }
            var ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error("Could not get context in callback!");
                return;
            }
            
            var json = JSON.parse(jsonString);
            var topcodes = json.topcodes;
            console.log("Topcodes detected:", topcodes.length, "Canvas:", canvas.width, canvas.height);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
            ctx.lineWidth = 10;
            ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
            console.log("Red border drawn");
            
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            for (let i = 0; i < topcodes.length; i++) {
                console.log("Drawing topcode:", topcodes[i]);
                ctx.beginPath();
                ctx.arc(topcodes[i].x - (topcodes[i].radius/2), topcodes[i].y, topcodes[i].radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.font = "26px Arial";
                ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
                ctx.fillText(topcodes[i].code, topcodes[i].x - topcodes[i].radius, topcodes[i].y);
                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            }
            console.log("All topcodes drawn");
            tangible.currentCodes = topcodes;
            tangible.once = true;
        }, this);
        console.log("TopCodes callback registered");
    }`);const P=document.createElement("script");if(P.textContent=N,document.head.appendChild(P),console.log("Tangible.js loaded"),await new Promise(u=>setTimeout(u,200)),window.Tangible){console.log("Creating Tangible instance");const u=new window.Tangible;u.setupTangible(),console.log("setupTangible called"),setTimeout(()=>{const L=document.getElementById("video-canvas");if(L){const E=L.getContext("2d");E?(console.log("Manual test: Drawing blue rectangle on canvas"),E.fillStyle="rgba(0, 0, 255, 0.5)",E.fillRect(200,200,100,100)):console.error("Manual test: Could not get canvas context")}else console.error("Manual test: Canvas not found")},1e3),x(u,"Numbers",0),x(u,"Notifications",1),x(u,"Notifications",2),M(u)}else console.error("window.Tangible not available");k(!1)}catch(t){console.error("Error loading scripts:",t),k(!1)}})()},[]);const F=()=>{if(!a){console.error("Tangible instance not initialized");return}const e=!l;console.log("Toggling camera to:",e),a.cameraStatus=e,window.TopCodes&&(window.TopCodes.startStopVideoScan("video-canvas",a.mode),e||setTimeout(()=>{delete window.TopCodes._mediaStreams["video-canvas"],console.log("Deleted mediaStream reference to allow reinitialization")},100)),$(e)},S=(e,t)=>{console.log(`Changing thread ${e} to sound set: ${t}`);const n=[...m];n[e]=t,A(n),a&&x(a,t,e)},I=()=>{if(!a){console.error("Tangible instance not initialized");return}if(a.isAudioPlaying()){console.log("Stopping audio"),a.stopAllSounds(),p(!1);return}if(l){console.log("Camera enabled, scanning code");const t=a.scanCode();if(console.log("Scanned code:",t),t){const n=t.replace(/<br\/>/g,`
`).replace(/,\s*X:\[object Object\]/g,"");if(w(n),console.log("Running scanned code:",n),n&&n.trim()){a.codeThreads=[[],[],[]],a.runTextCode(n),p(!0);const d=setInterval(()=>{a.isAudioPlaying()||(p(!1),clearInterval(d))},100)}return}}const e=y.current?.value||v;if(console.log("Running code:",e),e&&e.trim()){a.codeThreads=[[],[],[]],a.runTextCode(e),p(!0);const t=setInterval(()=>{a.isAudioPlaying()||(p(!1),clearInterval(t))},100)}else console.log("No code to run")},H=()=>{if(!a){console.error("Tangible instance not initialized");return}if(a.synthesis.speaking){console.log("Stopping speech synthesis"),a.synthesis.cancel(),b(!1);return}if(a.isAudioPlaying()){console.log("Stopping audio"),a.stopAllSounds();return}if(l){console.log("Camera enabled, scanning code for reading");const t=a.scanCode();if(console.log("Scanned code:",t),t){const n=t.replace(/<br\/>/g,`
`).replace(/,\s*X:\[object Object\]/g,"");w(n),console.log("Reading scanned code:",n),n&&n.trim()&&(a.readCode(n),b(!0));return}}const e=y.current?.value||v;console.log("Reading code:",e),e&&e.trim()?(a.readCode(e),b(!0)):console.log("No code to read")};return i.useEffect(()=>{if(!a)return;const e=setInterval(()=>{g&&!a.synthesis.speaking&&b(!1)},100);return()=>clearInterval(e)},[a,g]),i.useEffect(()=>{const e=t=>{t.touches.length===3&&(t.preventDefault(),I())};return document.addEventListener("touchstart",e,{passive:!1}),()=>{document.removeEventListener("touchstart",e)}},[a,l,v]),o.jsxs("div",{className:"app-container",children:[o.jsxs("header",{className:"header",role:"banner",children:[o.jsx("div",{className:"logo-container",children:o.jsx("img",{src:"https://armbennett.github.io/tangible-11ty/assets/img/tibbl-logo.png",alt:"Application logo",className:"logo"})}),o.jsxs("nav",{className:"header-buttons",role:"navigation","aria-label":"Main navigation",children:[o.jsxs("button",{className:"header-button",onClick:F,"aria-label":l?"Disable camera":"Enable camera","aria-pressed":l,disabled:j||!a,children:[o.jsx("i",{className:"fa-solid fa-camera fa-2xl","aria-hidden":"true"}),o.jsx("span",{children:"Camera"})]}),o.jsxs("button",{className:"header-button",onClick:I,"aria-label":f?"Stop code execution":"Play and execute code","aria-pressed":f,disabled:j||!a,children:[o.jsx("i",{className:`fa-solid ${f?"fa-stop":"fa-play"} fa-2xl`,"aria-hidden":"true"}),o.jsx("span",{children:f?"Stop":"Play"})]}),o.jsxs("button",{className:"header-button",onClick:H,"aria-label":g?"Stop reading code":"Read out code text","aria-pressed":g,disabled:j||!a,children:[o.jsx("i",{className:"fa-brands fa-readme fa-2xl","aria-hidden":"true"}),o.jsx("span",{children:g?"Stop":"Read"})]})]})]}),l&&o.jsx("section",{className:"camera-section",role:"region","aria-label":"Camera view",children:o.jsx("div",{className:"video-container",children:o.jsx("canvas",{id:"video-canvas",width:"640",height:"480","aria-label":"Code tile detection overlay"})})}),!l&&o.jsx("canvas",{id:"video-canvas",width:"640",height:"480",style:{display:"none"}}),o.jsxs("section",{className:`output-section ${l?"camera-active":""}`,role:"region","aria-label":"Code output and thread selection",children:[o.jsx("div",{className:"textbox-container",children:o.jsx("textarea",{ref:y,value:v,onChange:e=>w(e.target.value),className:"output-textbox",placeholder:`Thread 1
Loop 4 times
Play 5
End loop
Play 7

Thread 2
Delay 4
Loop 3 times
Play 8
End loop`,"aria-label":"Code output text area"})}),o.jsxs("div",{className:"dropdown-container",children:[o.jsxs("div",{className:"dropdown-group",children:[o.jsx("label",{htmlFor:"thread1",className:"dropdown-label",children:"Thread 1"}),o.jsx("select",{id:"thread1",className:"dropdown",value:m[0],onChange:e=>S(0,e.target.value),"aria-label":"Select Thread 1 sound options",children:R.map(e=>o.jsx("option",{value:e.value,children:e.label},e.value))})]}),o.jsxs("div",{className:"dropdown-group",children:[o.jsx("label",{htmlFor:"thread2",className:"dropdown-label",children:"Thread 2"}),o.jsx("select",{id:"thread2",className:"dropdown",value:m[1],onChange:e=>S(1,e.target.value),"aria-label":"Select Thread 2 sound options",children:R.map(e=>o.jsx("option",{value:e.value,children:e.label},e.value))})]}),o.jsxs("div",{className:"dropdown-group",children:[o.jsx("label",{htmlFor:"thread3",className:"dropdown-label",children:"Thread 3"}),o.jsx("select",{id:"thread3",className:"dropdown",value:m[2],onChange:e=>S(2,e.target.value),"aria-label":"Select Thread 3 sound options",children:R.map(e=>o.jsx("option",{value:e.value,children:e.label},e.value))})]})]})]})]})}function z({}){return[{title:"New React Router App"},{name:"description",content:"Welcome to React Router!"}]}const O=B(function(){return o.jsx(D,{})});export{O as default,z as meta};
