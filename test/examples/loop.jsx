{images.map(item =>
<div className="item">
  {item.match ?
    <div>{item.foo}</div>
   : null}
</div>
)}
