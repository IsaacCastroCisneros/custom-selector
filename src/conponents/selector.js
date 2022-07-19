export default class Select
{
   constructor(select)
   {
      this.itself=select; 
      this.options=formattedOptions(select.options);
      this.customContaier=document.createElement('DIV');
      this.customLabel=document.createElement('SPAN');
      this.customOptions=document.createElement('UL');
      createCustomSelect(this);
      this.itself.style.display='none';
      this.itself.after(this.customContaier);
   }

   get optionSelected()
   {
        return this.options.find(option=>option.selected===true);
   }
   get selectedIndex()
   {
       return this.options.indexOf(this.optionSelected);
   }

   setSelection(value)
   {
       const newSelected = this.options.find(option => option.value === value)
       if(newSelected===undefined)return
       const currentSelected = this.optionSelected;

       currentSelected.selected = false;
       currentSelected.itself.selected = false;
       
       newSelected.selected = true;
       newSelected.itself.selected = true;
       
       this.customLabel.textContent = newSelected.label;

       this.customOptions
           .querySelector(`[data-value=${currentSelected.value}`)
           .classList.remove('selected');

       const newOptionElement = this.customOptions.querySelector(`[data-value=${newSelected.value}]`);

       newOptionElement.classList.add('selected');
       newOptionElement.scrollIntoView({block:'nearest'});
   }
}

const submitButton = document.querySelector('button');
function createCustomSelect(select)
{
    select.customContaier.classList.add('custom-selector');
    select.customLabel.classList.add('custom-selector__label');
    select.customContaier.tabIndex=0;
 
    select.customLabel.textContent=select.optionSelected.label;
    select.customContaier.appendChild(select.customLabel);

    select.customLabel.addEventListener('click',(e)=>
    {
        e.target.classList.toggle('active');
    });
   
    select.customContaier.addEventListener('blur',()=>
    {
        select.customLabel.classList.remove('active');
    });

    select.options.forEach(option=>
    {
        const customOption = document.createElement('LI');
        customOption.classList.toggle('selected',option.selected);//para que cree el li con la clase selected, si es que el option actual tiene su propiedad selected como true
        customOption.textContent=option.label;
        customOption.dataset.value=option.value;
        customOption.classList.add('custom-selector__item');
        
        customOption.addEventListener('click',()=>
        {
             select.setSelection(option.value);
             submitButton.click();
        })

        select.customOptions.appendChild(customOption);
        
    });
    select.customOptions.classList.add('custom-selector__list');
    select.customLabel.after(select.customOptions);

    let key ='';
    let debounceTimeout;
   
    select.customContaier.addEventListener('keydown',e=>
    {
        switch(e.code)
        {
            case 'Enter': 
            submitButton.click();
            case 'Escape':select.customLabel.classList.remove('active');
            break;
            case 'Space': select.customLabel.classList.toggle('active');
            break;
            case 'ArrowDown': 
            {
                const nextPosition = select.selectedIndex+1; 
                const nextElement = select.options[nextPosition];

                if(!nextElement)return

                select.setSelection(nextElement.value);
            }
            break;
            case 'ArrowUp': 
            {
                const prevPosition = select.selectedIndex-1; 
                const prevElement = select.options[prevPosition];

                if(!prevElement)return

                select.setSelection(prevElement.value);
            }
            default:
            
            clearTimeout(debounceTimeout)//reinicia el timpo cada vez que presionas, cleartime borra el tiempo de espera de timeout
            key += e.key;
            debounceTimeout=setTimeout(()=>
            {
               key=''
            },500)
            
            const foundLabel = select.options.find(option=>option.label.toLowerCase().startsWith(key));

            if(foundLabel)
            {
                select.setSelection(foundLabel.value)
            }
        }
    })
    
}


function formattedOptions(options)
{
    return [...options].map(option=>
     {
         return{
             selected:option.selected,
             value:option.value,
             label:option.label,
             itself:option
         }
     }
    )
}



