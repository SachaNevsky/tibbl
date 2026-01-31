import{a as r,p as t,w as B}from"./chunk-EPOLDU6W-CP3WDhNt.js";const C="https://raw.githubusercontent.com/armbennett/tangible-11ty/main",I=[{value:"Numbers",label:"Numbers"},{value:"MusicLoops1",label:"Music Loops 1"},{value:"Mystery",label:"Mystery"},{value:"Notifications",label:"Notifications"},{value:"OdeToJoy",label:"Ode to Joy"},{value:"FurElise",label:"Fur Elise"}];function H(){const[l,A]=r.useState(!1),[m,w]=r.useState(""),[y,R]=r.useState(!0),[g,F]=r.useState(["Numbers","Notifications","Notifications"]),[a,M]=r.useState(null),[p,f]=r.useState(!1),[b,h]=r.useState(!1),j=r.useRef(null),x=(e,s,o)=>{const c=new window.Howl({src:[`${C}/assets/sound/${s}.mp3`],volume:.2,sprite:e.soundSets[s]});e.threads[o]=c};r.useEffect(()=>{if(!l)return;let e;const s=()=>{const i=document.getElementById("video-canvas-video"),n=document.getElementById("video-canvas"),d=document.querySelector(".video-container");if(i&&n&&d){d.contains(i)||d.insertBefore(i,d.firstChild),i.style.display="block",d.contains(n)||d.appendChild(n),n.style.position="absolute",n.style.top="0",n.style.left="0",n.style.width="100%",n.style.height="100%",n.style.pointerEvents="none",n.style.zIndex="10",n.style.display="block";const T=()=>{n.width=640,n.height=480},v=()=>{T()};i.addEventListener("loadedmetadata",v),i.addEventListener("playing",v),T(),e=()=>{i.removeEventListener("loadedmetadata",v),i.removeEventListener("playing",v)}}},o=setInterval(()=>{document.getElementById("video-canvas-video")&&(s(),clearInterval(o))},100),c=setTimeout(()=>clearInterval(o),5e3);return()=>{clearInterval(o),clearTimeout(c),e&&e()}},[l]),r.useEffect(()=>{(async()=>{try{const o=await(await fetch(`${C}/assets/js/howler.js`)).text(),c=document.createElement("script");c.textContent=o,document.head.appendChild(c);const n=await(await fetch(`${C}/assets/js/topcodes.js`)).text(),d=document.createElement("script");d.textContent=n,document.head.appendChild(d);let N=(await(await fetch(`${C}/assets/js/tangible.js`)).text()).replace("export default class Tangible","window.Tangible = class Tangible");N=N.replace(/setupTangible\(\) \{[\s\S]*?setVideoFrameCallback\("video-canvas", function \(jsonString\) \{[\s\S]*?\}, this\);[\s\S]*?\}/,`setupTangible() {
        this.setVideoCanvasHeight('video-canvas');
        let tangible = this;
        
        TopCodes.setVideoFrameCallback("video-canvas", function (jsonString) {
            
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
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
            ctx.lineWidth = 10;
            ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
            
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            for (let i = 0; i < topcodes.length; i++) {
                ctx.beginPath();
                ctx.arc(topcodes[i].x - (topcodes[i].radius/2), topcodes[i].y, topcodes[i].radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.font = "26px Arial";
                ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
                ctx.fillText(topcodes[i].code, topcodes[i].x - topcodes[i].radius, topcodes[i].y);
                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            }
            tangible.currentCodes = topcodes;
            tangible.once = true;
        }, this);
    }`);const P=document.createElement("script");if(P.textContent=N,document.head.appendChild(P),await new Promise(u=>setTimeout(u,200)),window.Tangible){const u=new window.Tangible;u.setupTangible(),setTimeout(()=>{const L=document.getElementById("video-canvas");if(L){const E=L.getContext("2d");E?(E.fillStyle="rgba(0, 0, 255, 0.5)",E.fillRect(200,200,100,100)):console.error("Manual test: Could not get canvas context")}else console.error("Manual test: Canvas not found")},1e3),x(u,"Numbers",0),x(u,"Notifications",1),x(u,"Notifications",2),M(u)}else console.error("window.Tangible not available");R(!1)}catch(s){console.error("Error loading scripts:",s),R(!1)}})()},[]);const $=()=>{if(!a){console.error("Tangible instance not initialized");return}const e=!l;a.cameraStatus=e,window.TopCodes&&(window.TopCodes.startStopVideoScan("video-canvas",a.mode),e||setTimeout(()=>{delete window.TopCodes._mediaStreams["video-canvas"]},100)),A(e)},S=(e,s)=>{const o=[...g];o[e]=s,F(o),a&&x(a,s,e)},k=()=>{if(!a){console.error("Tangible instance not initialized");return}if(a.isAudioPlaying()){a.stopAllSounds(),h(!1);return}if(l){const s=a.scanCode();if(s){const o=s.replace(/<br\/>/g,`
`).replace(/,\s*X:\[object Object\]/g,"").toLowerCase().replace(/(^|\n)([a-z])/g,(c,i,n)=>i+n.toUpperCase()).replace(/x/g,"X");if(w(o),o&&o.trim()){a.codeThreads=[[],[],[]],a.runTextCode(o),h(!0);const c=setInterval(()=>{a.isAudioPlaying()||(h(!1),clearInterval(c))},100)}return}}const e=j.current?.value||m;if(e&&e.trim()){a.codeThreads=[[],[],[]],a.runTextCode(e),h(!0);const s=setInterval(()=>{a.isAudioPlaying()||(h(!1),clearInterval(s))},100)}},z=()=>{if(!a){console.error("Tangible instance not initialized");return}if(a.synthesis.speaking){a.synthesis.cancel(),f(!1);return}if(a.isAudioPlaying()){a.stopAllSounds();return}if(l){const s=a.scanCode();if(s){const o=s.replace(/<br\/>/g,`
`).replace(/,\s*X:\[object Object\]/g,"").toLowerCase().replace(/(^|\n)([a-z])/g,(c,i,n)=>i+n.toUpperCase()).replace(/x/g,"X");w(o),o&&o.trim()&&(a.readCode(o),f(!0));return}}const e=j.current?.value||m;e&&e.trim()&&(a.readCode(e),f(!0))};return r.useEffect(()=>{if(!a)return;const e=setInterval(()=>{p&&!a.synthesis.speaking&&f(!1)},100);return()=>clearInterval(e)},[a,p]),r.useEffect(()=>{const e=s=>{s.touches.length===3&&(s.preventDefault(),k())};return document.addEventListener("touchstart",e,{passive:!1}),()=>{document.removeEventListener("touchstart",e)}},[a,l,m]),t.jsxs("div",{className:"app-container",children:[t.jsxs("header",{className:"header",role:"banner",children:[t.jsx("div",{className:"logo-container",children:t.jsx("img",{src:"https://armbennett.github.io/tangible-11ty/assets/img/tibbl-logo.png",alt:"Application logo",className:"logo"})}),t.jsxs("nav",{className:"header-buttons",role:"navigation","aria-label":"Main navigation",children:[t.jsxs("button",{className:"header-button",onClick:$,"aria-label":l?"Disable camera":"Enable camera","aria-pressed":l,disabled:y||!a,children:[t.jsx("i",{className:"fa-solid fa-camera fa-2xl","aria-hidden":"true"}),t.jsx("span",{children:"Camera"})]}),t.jsxs("button",{className:"header-button",onClick:k,"aria-label":b?"Stop code execution":"Play and execute code","aria-pressed":b,disabled:y||!a,children:[t.jsx("i",{className:`fa-solid ${b?"fa-stop":"fa-play"} fa-2xl`,"aria-hidden":"true"}),t.jsx("span",{children:b?"Stop":"Play"})]}),t.jsxs("button",{className:"header-button",onClick:z,"aria-label":p?"Stop reading code":"Read out code text","aria-pressed":p,disabled:y||!a,children:[t.jsx("i",{className:"fa-brands fa-readme fa-2xl","aria-hidden":"true"}),t.jsx("span",{children:p?"Stop":"Read"})]})]})]}),l&&t.jsx("section",{className:"camera-section",role:"region","aria-label":"Camera view",children:t.jsx("div",{className:"video-container",children:t.jsx("canvas",{id:"video-canvas",width:"640",height:"480","aria-label":"Code tile detection overlay"})})}),!l&&t.jsx("canvas",{id:"video-canvas",width:"640",height:"480",style:{display:"none"}}),t.jsxs("section",{className:`output-section ${l?"camera-active":""}`,role:"region","aria-label":"Code output and thread selection",children:[t.jsx("div",{className:"textbox-container",children:t.jsx("textarea",{ref:j,value:m,onChange:e=>w(e.target.value),className:"output-textbox",placeholder:`Thread 1
Loop 4 times
Play 5
End loop
Play 7

Thread 2
Delay 4
Loop 3 times
Play 8
End loop`,"aria-label":"Code output text area"})}),t.jsxs("div",{className:"dropdown-container",children:[t.jsxs("div",{className:"dropdown-group",children:[t.jsx("label",{htmlFor:"thread1",className:"dropdown-label",children:"Thread 1"}),t.jsx("select",{id:"thread1",className:"dropdown",value:g[0],onChange:e=>S(0,e.target.value),"aria-label":"Select Thread 1 sound options",children:I.map(e=>t.jsx("option",{value:e.value,children:e.label},e.value))})]}),t.jsxs("div",{className:"dropdown-group",children:[t.jsx("label",{htmlFor:"thread2",className:"dropdown-label",children:"Thread 2"}),t.jsx("select",{id:"thread2",className:"dropdown",value:g[1],onChange:e=>S(1,e.target.value),"aria-label":"Select Thread 2 sound options",children:I.map(e=>t.jsx("option",{value:e.value,children:e.label},e.value))})]}),t.jsxs("div",{className:"dropdown-group",children:[t.jsx("label",{htmlFor:"thread3",className:"dropdown-label",children:"Thread 3"}),t.jsx("select",{id:"thread3",className:"dropdown",value:g[2],onChange:e=>S(2,e.target.value),"aria-label":"Select Thread 3 sound options",children:I.map(e=>t.jsx("option",{value:e.value,children:e.label},e.value))})]})]})]})]})}function V({}){return[{title:"New React Router App"},{name:"description",content:"Welcome to React Router!"}]}const _=B(function(){return t.jsx(H,{})});export{_ as default,V as meta};
