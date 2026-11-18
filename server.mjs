// Optional secure AI backend (Node.js 20+). GitHub Pages cannot run Node.
// Run: OPENAI_API_KEY=your_key node server.mjs   (Unix)
// Windows PowerShell: $env:OPENAI_API_KEY='your_key'; node server.mjs
// Never put keys in this repository, index.html, or browser JavaScript.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||3000);
const aiEnabled=Boolean(process.env.OPENAI_API_KEY);
const model=process.env.OPENAI_MODEL||'gpt-4.1-mini';
const knowledge=`You represent a FICTIONAL company "Orbit Digital Services" within a portfolio demo. Explain that pricing is only illustrative and nothing is ordered or sent. Sample services: 4–5-page business website (illustrative ₹8,000–₹15,000), landing pages (₹3,000–₹7,000), website fixes, WordPress/e-commerce, SEO/social creatives, and chatbot integration. Never invent client case studies, paid plans, business addresses or testimonials. Never claim to place real bookings, send emails, process payment, or save user details on a remote CRM. For quote enquiries, suggest filling out the demo lead form. Be concise, friendly, factual, and transparent that this is an AI-connected demo.`;
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'same-origin'});res.end(JSON.stringify(data))}
function readBody(req){return new Promise((resolve,reject)=>{let chunks=[],size=0;req.on('data',c=>{size+=c.length;if(size>15_000){reject(new Error('Request too large'));req.destroy()}else chunks.push(c)});req.on('end',()=>resolve(Buffer.concat(chunks).toString('utf8')));req.on('error',reject)})}
http.createServer(async(req,res)=>{try{
 const pathname=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`).pathname;
 if(pathname==='/api/status'&&req.method==='GET')return json(res,200,{ai_enabled:aiEnabled,mode:aiEnabled?'AI connected':'FAQ only'});
 if(pathname==='/api/chat'&&req.method==='POST'){
   if(!aiEnabled)return json(res,503,{error:'AI backend not configured. Use FAQ demo.'});
   let data;try{data=JSON.parse(await readBody(req))}catch{return json(res,400,{error:'Invalid JSON'})}
   let q=String(data?.question||'').trim();if(!q||q.length>1000)return json(res,400,{error:'Question must contain 1–1000 characters'});
   let history=Array.isArray(data?.history)?data.history.slice(-10):[];
   let input=[{role:'developer',content:knowledge},...history.filter(x=>x&&['user','bot'].includes(x.role)&&typeof x.text==='string').map(x=>({role:x.role==='bot'?'assistant':'user',content:x.text.slice(0,1000)}))];
   if(!input.some(x=>x.role==='user'&&x.content===q))input.push({role:'user',content:q});
   let r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model,input,max_output_tokens:360})});
   if(!r.ok){console.error('AI API error status',r.status);return json(res,502,{error:'AI request failed. Check provider/model/credits.'})}
   let result=await r.json();let answer=result.output_text||result.output?.flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('\n');
   if(!answer)return json(res,502,{error:'No AI text returned'});return json(res,200,{reply:String(answer).slice(0,2600)})
 }
 if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
 if(pathname==='/'||pathname==='/index.html'){let doc=await fs.readFile(path.join(root,'index.html'));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(doc)}
 return json(res,404,{error:'Not found'});
}catch(error){console.error(error.message);if(!res.headersSent)json(res,500,{error:'Server error'})}}).listen(port,()=>console.log(`ReplyPilot demo: http://localhost:${port} | AI enabled: ${aiEnabled}`));
