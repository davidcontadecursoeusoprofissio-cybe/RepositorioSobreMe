

export default function Card(Props){
    return(

        <>
        <div className="bg-gray-200">
        {/* <img src="" alt="" /> */}
        <h1>{Props.titulo}</h1>

        <p>{Props.descricao}</p>


        <a href="{props.url}">click aqui para ver o codigo</a>
        </div>
        
        </>
    )
}