import { Elysia, t } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { nanoid } from "nanoid";
import { db } from "./db";
import { auth, shortener } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia().use(html()).use(staticPlugin());

app.listen(3000);

app.get('/',()=>{
 return new Response(Bun.file('./src/index.html'))
})

app.get('/login',()=>{
  return new Response(Bun.file('./src/login.html'))
 })



 app.post("/login", async ({body:{email ,password}})=>{

  if(!email && !password){
    throw new Error("Username/Password is required")
  }



const userData = await db.select().from(auth).where(eq(auth.email,email)).get();

if (userData && userData.password) {
  const isMatch = await Bun.password.verify(password, userData.password);

  if (isMatch) {
    // Passwords match
    console.log( "Password Correct")
  } else {
    // Passwords don't match
    console.log( "Password InCorrect")

  }
} else {
  console.error("User data or password is undefined");
}
},{
  body:t.Object({
    email:t.String(),
    password:t.String()
  })
})



app.post("/signup", async ({body:{email ,password}})=>{

 if(!email && !password){

    throw new Error("Username/Password is required");

  }

 const hashPassword = await Bun.password.hash(password);


 const userData=await db.select().from(auth).where(eq(auth.email,email)).get();

 if (!userData ) {

  await db.insert(auth).values({email,password:hashPassword})

 } else {
  console.error("email already exists");
}
},{
  body:t.Object({
    email:t.String(),
    password:t.String()
  })
})


app.get('/shortens',async()=>{
  const urlExist = await db.select().from(shortener).all()

  // return urlExist

  const htmlSections = urlExist.slice(0,3)

// Join the HTML sections with a line break
const resultHTML = htmlSections.join(' ');
console.log(htmlSections);

// Send the HTML response
return htmlSections;


  
})

app.post("/shorten", async ({body:{url}})=>{

  if(!url){
    throw new Error("URL is required")
  }
  

  const urlId = nanoid(7);

  // await db.insert(shortener).values({url,urlId})

  const addResult = `<section id="result"
  class="flex  w-full border-slate-200 overflow-hidden border pl-2 rounded-full items-center justify-between">
  <p id="${urlId}">https://${app.server?.hostname}:${app.server?.port}/shorten/${urlId}</p>
 
<div class="bg-slate-200 py-3 px-6 text-black hover:bg-blue-600 cursor-pointer" hx-on="click: copyText('${urlId}')">
  Copy
</div>

  </section>`

  return addResult
},{
  body:t.Object({
    url:t.String()
  })
})

app.get('/shorten/:id',async({params:{id},set})=>{

  const urlExist = await db.select().from(shortener).where(eq(shortener.urlId,id)).get();

  if(!urlExist){
    throw new Error("URL doesn't exists.")
  }

  set.redirect=urlExist.url;

  })

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
