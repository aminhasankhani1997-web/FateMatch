const $ = (s)=>document.querySelector(s);
async function api(url, options={}) {
  const r=await fetch(url,{headers:{"Content-Type":"application/json"},...options});
  const data=await r.json().catch(()=>({error:"پاسخ نامعتبر از سرور"}));
  if(!r.ok) throw new Error(data.error||"خطایی رخ داد");
  return data;
}
$("#signup").addEventListener("submit",async e=>{
  e.preventDefault(); const form=e.currentTarget, btn=form.querySelector("button"), msg=$("#signupMsg");
  btn.disabled=true;msg.textContent="در حال ثبت‌نام...";
  const f=new FormData(form);
  try{
    const data=await api("/api/register",{method:"POST",body:JSON.stringify({name:f.get("name"),gender:f.get("gender"),city:f.get("city"),twitter:f.get("twitter"),consent:f.get("consent")==="on"})});
    msg.className="message success";
    msg.innerHTML=`ثبت‌نامت انجام شد! کد پیگیری‌ات رو نگه دار: <b dir="ltr">${data.token}</b><br>این کد رو به کسی نده؛ برای دیدن نتیجه لازمش داری.`;
    form.reset();
    $("#resultForm [name=token]").value=data.token;
  }catch(err){msg.className="message error";msg.textContent=err.message}
  finally{btn.disabled=false}
});
$("#resultForm").addEventListener("submit",async e=>{
 e.preventDefault();const token=new FormData(e.currentTarget).get("token").trim(),msg=$("#resultMsg"),card=$("#resultCard");
 card.hidden=true;msg.textContent="در حال بررسی...";
 try{const d=await api("/api/result?token="+encodeURIComponent(token));msg.textContent="";
 if(d.status==="waiting"){card.hidden=false;card.textContent="هنوز قرعه‌کشی انجام نشده یا برای شهر شما جفتی در این دور پیدا نشده. بعداً دوباره بررسی کن."}
 else{card.hidden=false;card.innerHTML=`🎉 جفتت مشخص شد!<br><strong>${escapeHtml(d.match.name)}</strong><br>شهر: ${escapeHtml(d.match.city)}<br>آیدی X: <b dir="ltr">${escapeHtml(d.match.twitter)}</b>`}
 }catch(err){msg.className="message error";msg.textContent=err.message}
});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
