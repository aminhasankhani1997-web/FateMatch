const $=s=>document.querySelector(s);
async function api(url,opts={}){const r=await fetch(url,{headers:{"Content-Type":"application/json"},...opts});const d=await r.json().catch(()=>({error:"پاسخ نامعتبر"}));if(!r.ok)throw Error(d.error||"خطا");return d}
async function load(){const d=await api("/api/admin/participants");$("#loginPanel").hidden=true;$("#dashboard").hidden=false;$("#stats").innerHTML=`<div class="stat">کل ثبت‌نام‌ها<b>${d.total}</b></div><div class="stat">دخترها<b>${d.girls}</b></div><div class="stat">پسرها<b>${d.boys}</b></div>`;
$("#participants").innerHTML="<table><thead><tr><th>نام</th><th>جنسیت</th><th>شهر</th><th>آیدی X</th><th>وضعیت</th></tr></thead><tbody>"+d.people.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.gender==="girl"?"دختر":"پسر"}</td><td>${esc(p.city)}</td><td dir="ltr">${esc(p.twitter)}</td><td>${p.paired?"جفت‌شده":"منتظر"}</td></tr>`).join("")+"</tbody></table>"}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#login").addEventListener("submit",async e=>{e.preventDefault();try{await api("/api/admin/login",{method:"POST",body:JSON.stringify({password:new FormData(e.currentTarget).get("password")})});await load()}catch(x){$("#loginMsg").textContent=x.message}});
$("#refresh").onclick=()=>load().catch(e=>$("#adminMsg").textContent=e.message);
$("#draw").onclick=async()=>{if(!confirm("قرعه‌کشی انجام شود؟ این کار زوج‌های این دور را نهایی می‌کند."))return;try{const d=await api("/api/admin/draw",{method:"POST",body:"{}"});$("#adminMsg").className="message success";$("#adminMsg").textContent=`قرعه‌کشی انجام شد: ${d.pairs} زوج. ${d.leftover} نفر برای دور بعد باقی ماندند.`;await load()}catch(e){$("#adminMsg").className="message error";$("#adminMsg").textContent=e.message}};
$("#logout").onclick=async()=>{await api("/api/admin/logout",{method:"POST",body:"{}"});location.reload()};
load().catch(()=>{});
