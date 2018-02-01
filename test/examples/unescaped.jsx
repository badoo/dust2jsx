<div dangerouslySetInnerHTML={{__html: title}}></div>

<p id="{id}" dangerouslySetInnerHTML={{__html: text}}>
  
</p>

{footer ?
  <footer>
    <span dangerouslySetInnerHTML={{__html: footer}}></span>
  </footer>
 : null}
