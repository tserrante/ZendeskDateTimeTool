/**
 * Removes duplicate event listeners through the singleton pattern
 * @param {The element containing ckeditorInstance} editingArea 
 * @returns the editingArea object
 */

function singletonEventListener(editingArea)
{
   editingArea.eventListener = (event, func) => {
      if(editingArea.lastEventListener == null) 
      { 
         editingArea.lastEventListener = {};
      }
      if(editingArea.lastEventListener[event] != null)
      {
         editingArea.removeEventListener(event, editingArea.lastEventListener[event]);
      }
      editingArea.addEventListener(event, func);
      editingArea.lastEventListener[event] = func;
   }
   return editingArea;
}

/**
 * This function adds an event listener to the ckeditor5 instance of editingArea    
 * @param {*} editingArea The textbox used to create comments in zendesk
 */

function createKeyPressListener(editingArea)
{   
   editingArea.eventListener('keydown', function(e)
   {
      if(e.key === "Enter" && e.ctrlKey)
      {
         const editorInstance = editingArea.ckeditorInstance;      
         const date = getDate();
         editorInstance.model.change( writer => {
            const text = writer.createText('\n' + date + ': ');
            editorInstance.model.insertContent( text );
         }); 
      }
   });
}

/**
 * This function creates a new date object, formats it, and returns it to the calling function.
 * @returns a date time string using the following format: MM/DD/YY hh:mm 
 */
function getDate()
{
   let dt = new Date;
   dt.setTime(dt.getTime()+dt.getTimezoneOffset()*60*1000);
   const offset = -240; //Timezone offset for EST in minutes.
   var estDate = new Date(dt.getTime() + offset*60*1000); //Static EST date variable.
   hours = estDate.getHours().toString().padStart(2, "0");
   minutes = estDate.getMinutes().toString().padStart(2, "0)");
   month = (estDate.getMonth() + 1).toString().padStart(2, "0");
   day = estDate.getDate().toString().padStart(2, "0");
   year = estDate.getFullYear().toString().slice(-2);
   return `${month}/${day}/${year} ${hours}:${minutes}`;
}

document.addEventListener('click', function(e){
    if(this.activeElement.getAttribute("role") === "textbox" && this.activeElement.getAttribute("aria-label") === "Rich Text Editor. Editing area: main")
    {
        const editingArea = singletonEventListener(this.activeElement);
        // left click
        if(e.button === 0) 
        {
            createKeyPressListener(editingArea);
        }
    }
});