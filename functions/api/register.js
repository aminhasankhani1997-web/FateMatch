import { json, normalizeCity, clean } from "./_utils.js";
export async function onRequestPost({request,env}) {
  const b=await request.json().catch(()=>null);
  if(!b||!b.consent) return json({error:"برای ثبت‌نام باید با نمایش آیدی X به جفتت موافقت کنی."},400);
  const name=clean(b.name,40),city=normalizeCity(b.city),twitter=clean(b.twitter,80),gender=b.gender;
  if(!name||!city||!twitter||!["girl","boy"].includes(gender)) return json({error:"لطفاً همه موارد فرم را درست تکمیل کن."},400);
  const token=crypto.randomUUID().replaceAll("-","");
  await env.DB.prepare("INSERT INTO participants (token,name,gender,city,twitter,created_at) VALUES (?,?,?,?,?,?)").bind(token,name,gender,city,twitter,Date.now()).run();
  return json({token});
}