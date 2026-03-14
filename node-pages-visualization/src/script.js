function recommend(){

let completed=[]

document.querySelectorAll("input:checked")
.forEach(c=>completed.push(c.value))

let available=[]

if(completed.includes("CS135")) available.push("CS136")
if(completed.includes("CS136")) available.push("CS246")
if(completed.includes("MATH135")) available.push("MATH136")
if(completed.includes("MATH137")) available.push("MATH138")

let result=document.getElementById("result")

if(available.length===0){
result.innerText="Complete more prerequisites first."
}
else{
result.innerText="You can take: "+available.join(", ")
}

}



/* scroll reveal */

const reveals=document.querySelectorAll(".reveal")

function reveal(){

for(let el of reveals){

let windowHeight=window.innerHeight
let top=el.getBoundingClientRect().top

if(top < windowHeight-100){
el.classList.add("active")
}

}

}

window.addEventListener("scroll",reveal)

reveal()