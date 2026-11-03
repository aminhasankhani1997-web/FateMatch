import { json } from "./_utils.js";
export async function onRequestGet({request,env}) {
 const token=new URL(request.url).searchParams.get("token")||"";
 if(!/^[a-f0-9]{32}$/.test(token)) return json({error:"کد پیگیری معتبر نیست."},400);
 const p=await env.DB.prepare("SELECT id,paired_with FROM participants WHERE token=?").bind(token).first();
 if(!p) return json({error:"شرکت‌کننده‌ای با این کد پیدا نشد."},404);
 if(!p.paired_with) return json({status:"waiting"});
 const m=await env.DB.prepare("SELECT name,city,twitter FROM participants WHERE id=?").bind(p.paired_with).first();
 if(!m) return json({status:"waiting"});
 return json({status:"paired",match:m});
}