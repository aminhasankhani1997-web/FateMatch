import {json,validSession} from "../_utils.js";
export async function onRequestPost({request,env}) {
 if(!await validSession(request,env.ADMIN_PASSWORD))return json({error:"ابتدا وارد پنل مدیریت شو."},401);
 const pending=await env.DB.prepare("SELECT id,gender,city FROM participants WHERE paired_with IS NULL ORDER BY created_at ASC").all();
 const people=pending.results||[], groups=new Map();
 for(const p of people){if(!groups.has(p.city))groups.set(p.city,{girl:[],boy:[]});groups.get(p.city)[p.gender].push(p.id)}
 const pairs=[];
 for(const [city,g] of groups){shuffle(g.girl);shuffle(g.boy);const n=Math.min(g.girl.length,g.boy.length);for(let i=0;i<n;i++)pairs.push([g.girl[i],g.boy[i]])}
 // Atomic batch prevents half-written results.
 const stmts=[];for(const [a,b] of pairs){stmts.push(env.DB.prepare("UPDATE participants SET paired_with=? WHERE id=? AND paired_with IS NULL").bind(b,a));stmts.push(env.DB.prepare("UPDATE participants SET paired_with=? WHERE id=? AND paired_with IS NULL").bind(a,b))}
 if(stmts.length)await env.DB.batch(stmts);
 return json({pairs:pairs.length,leftover:people.length-pairs.length*2});
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]]}}
