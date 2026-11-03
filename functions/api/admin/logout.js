import {json} from "../_utils.js";
export async function onRequestPost(){return json({ok:true},200,{"set-cookie":"fm_admin=; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=0"})}