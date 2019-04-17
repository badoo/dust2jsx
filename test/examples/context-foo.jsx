<p>{foo.title}</p>

{foo.text ?
<div className="header">
  <div>
    <p>{foo.text}</p>
  </div>
</div>
 : null}

{foo.images.map(item =>
<img src={item.img.src}>{item.foo}</div>
)}

{{
  [foo.IMG2]: (
    <Icon name={foo.picture.value}/>
  )
}[foo.picture]}

<Footer text={foo.text}/>
