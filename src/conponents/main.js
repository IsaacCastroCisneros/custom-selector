import 'regenerator-runtime/runtime';
import Select from "./selector";
import cities from "../../dist/dist-files/cities.json";
import delay from "../util/delay";

const selectors = document.querySelectorAll('[data-custom]');
const form = document.querySelector('[data-form]')
const options = document.querySelectorAll('option');
const background = document.querySelector('[data-main-background]');

function orderOptions(options)
{
   const orderdOptionsText = [...options].map(option=>option.textContent).sort();
   return orderdOptionsText.map(text=>
   {
       return[...options].find(option=> option.textContent===text);
   })
}

const orderedOptions=orderOptions(options)
const optionsFragment = new DocumentFragment();

orderedOptions.forEach(option=>
{
    option.value=option.textContent.toLowerCase();
    optionsFragment.appendChild(option);
});


selectors.forEach(select=>
{
    select.innerHTML='';
    select.appendChild(optionsFragment);
});

document.querySelectorAll('option')[0].selected=true;

selectors.forEach(select=>
{
   return new Select(select);
})

showImage();
function showImage()
{
   selectors.forEach(async select=>
    {
        const actualBackground = cities.find(city=>select.value.startsWith(city.name))
        console.log(background.style.backgroundImage)
        console.log(actualBackground.name)
        if(background.style.backgroundImage.includes(actualBackground.name))return
        background.classList.add('active');
        await delay(200);
        background.style.backgroundImage=`url(${actualBackground.image})`;
        background.classList.remove('active');
    })
}


form.addEventListener('submit',(e)=>
{
    e.preventDefault();
    showImage();
})


