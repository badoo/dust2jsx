{items.map(item =>
  {item ?
    <div className="item">{item}</div>
   : null}
)}

{text.map(item =>
  {item ? <p>{item}</p> : ''}
)}
