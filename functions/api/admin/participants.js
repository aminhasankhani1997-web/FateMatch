import {json,validSession} from "../_utils.js";
export async function onRequestGet({request,env}){if(!await validSession(request,env.ADMIN_PASSWORD))return json({error:"ابتدا وارد پنل مدیریت شو."},401);
const people=await env.DB.prepare("SELECT name,gender,city,twitter,paired_with FROM participants ORDER BY created_at DESC").all();
const rows=people.results||[];return json({total:rows.length,girls:rows.filter(x=>x.gender==="girl").length,boys:rows.filter(x=>x.gender==="boy").length,people:rows.map(x=>({...x,paired:!!x.paired_with}))})}