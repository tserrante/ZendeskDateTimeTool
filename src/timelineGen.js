

function generateTimeline(editingArea)
{
   chrome.runtime.sendMessage("nmkeddobbgmklaojjmkimpaffccencgn", "UPDATE", function(response) {
      
      if(response === "UPDATED")
      {
         console.log("generateTimeline Status: " + response);
         let dateTimeRecords = getInternalCommentTextNodes(editingArea);
         let uniqueRecords = removeDuplicateRecords(dateTimeRecords);
         uniqueRecords.sort(dateComparator);
                  
         const editorInstance = editingArea.ckeditorInstance;
         editorInstance.model.change(writer => {
            for(record of uniqueRecords)
            {
               const paragraph = writer.createElement('paragraph');
               writer.append(paragraph, editorInstance.model.document.getRoot());
               const textNode = writer.createText(record.tag + ' ' + record.comment);
               writer.append(textNode, paragraph);
            }
         });
         chrome.runtime.sendMessage("nmkeddobbgmklaojjmkimpaffccencgn", "FINISHED");
      }
      if(response === "TIMEOUT")
      {
         console.log("generateTimeline Status: " + response);
      }
   });
}

//clbcolmebfdinahpkodjbiifcpeobcik
document.addEventListener('mouseup', function(e) {
   if(this.activeElement.getAttribute("role") === "textbox" && this.activeElement.getAttribute("aria-label") === "Rich Text Editor. Editing area: main")
   {
      const editingArea = singletonEventListener(this.activeElement);
      //right click
      if(e.button === 2)
      {
         generateTimeline(editingArea);
      }
   }
});

/*
   Timeline Creation Logic Below
*/

/**
 * 
 * @param {The current unsorted array containing dateTimeRecordObjects} dateTimeRecords 
 * @returns An array of date time records 
 */
function removeDuplicateRecords(dateTimeRecords)
{
   let retArray = [];

   for(let i = 0; i < dateTimeRecords.length; i++)
   {
      if(!retArray.find(({comment})=> comment === dateTimeRecords[i].comment))
      {
         retArray.push(dateTimeRecords[i]);
      }
   }

   return retArray;
}

function dateComparator(firstRecord, secondRecord)
{
   // remove the trailing ':' from the tag string and create a new date object for comparison
   let firstRecordDate = new Date(Date.parse(firstRecord.tag.slice(0, firstRecord.tag.lastIndexOf(':'))));
   let secondRecordDate = new Date(Date.parse(secondRecord.tag.slice(0, secondRecord.tag.lastIndexOf(':'))));
   return firstRecordDate - secondRecordDate;
}

/**
 * This method creates date time record objects from a .zd-comment element and returns the collection 
 * @param {The DOM element containing internal notes to sort} internalComment 
 * @returns an array of date time records
*/
function createDateTimeRecords(zdComment)
{
   const DATETIME_REG_EXP = /\d\d\/\d\d\/\d\d\s\d\d:\d\d:/g; // date time tag expression
   const OMIT_RECORD_CHAR = '~';                             // for user to include in comment if they wish the record to be excluded from the timeline
   
   let zdCommentText = zdComment.textContent;

   // Get all the date time tags from the zdComment div.  dtTags becomes an array of arrays
   const dtTags = Array.from(zdCommentText.matchAll(DATETIME_REG_EXP));

   const dateTimeRecords = [];
   let index = 0;

   while(index < dtTags.length)
   {
      let currentTag = dtTags[index];
      // string representation of the date time tag 
      let tagString = currentTag[0];
      // calculate the total space in the raw string for the record
      let tagLengthOffset = tagString.length + currentTag.index; 
      // variable to store the comments between date time tags
      let commentString;

      // If there is one tag the rest of the text node becomes a commentString
      if(!(index + 1 < dtTags.length))
      {
         commentString = zdCommentText.slice(tagLengthOffset, zdCommentText.length).trim();
      }
      else
      {
         const nextTagPos = dtTags[index+1].index;
         commentString = zdCommentText.slice(tagLengthOffset, nextTagPos).trim();
      }
      // don't build an object with an empty comment
      if(commentString.length > 0 && commentString !== null && commentString[0] != OMIT_RECORD_CHAR)
      {
         commentString = commentString.replace(/\s+/g, " ");       // remove excessive spaces from comment
         dateTimeRecords.push({tag:tagString, comment: commentString});
      }
      index++
   }
   return dateTimeRecords;
}

/**
 * Looks through the eventContainer and retrieves all the zd-comment div's and sends them to createDateTimeRecords
 * @param {The container for all comments} eventContainer 
 * @returns An array of objects
 */

function getInternalCommentTextNodes(editingArea)
{

   let eventContainer = editingArea;

   // Grab parent nodes until "pane_body section"
   while(eventContainer.className !== 'pane_body section')
   {
      eventContainer = eventContainer.parentNode;
   }
   // Grab the parent node "rich-text"
   eventContainer = eventContainer.parentNode;

   // Grab "event-container" 
   eventContainer = eventContainer.querySelector('.event-container');

   // check to see if the first element is the internal comments 
   if(eventContainer.firstElementChild.className === 'ember-view audits')
   {   
      const dateTimeRecordObjects = []; // container for date time record objects

      const emberViewAudit = eventContainer.firstElementChild; // DOM element ember-view audits contain all of the ticket comments and events
      
      const internalCommentDivs = emberViewAudit.querySelectorAll("div[class='ember-view event web regular']");

      for(let i = internalCommentDivs.length-1; i >= 0; i--)
      {
         let record = createDateTimeRecords(internalCommentDivs[i].querySelector('.zd-comment'));
         if(!Array.isArray(record))
         {
            if(typeof record !== 'undefined')
               dateTimeRecordObjects.push(record);
         }
         else
         {
            for(let i = 0; i < record.length; i++)
            {
               if(record[i] !== 'undefined')
                  dateTimeRecordObjects.push(record[i]);
            }
         }         
      }
      
      return dateTimeRecordObjects;
   }
   return null;
}