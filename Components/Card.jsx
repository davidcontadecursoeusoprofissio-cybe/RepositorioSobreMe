

export default function Card(Props){
    return(

        <>
        <div className=" flex flex-col  bg-blue-400 text-white h-70 w-100 mt-5 ms-20 rounded-lg ">
        {/* <img src="" alt="" /> */}
        <img className="w-full h-40" src={Props.img} alt="" />
        <h1 className="ms-40 mt-3">{Props.titulo}</h1>

        <p className="ms-10 mt-1 text-[12px]">{Props.descricao}</p>


        {Props.url && (
            <a href={Props.url} target="_blank" rel="noopener noreferrer">
                <button className="bg-green-400 h-7 w-70 rounded-lg cursor-pointer mt-4 ms-15">Clique aqui para ver o código</button>
            </a>
        )}

     
        </div>
        
        </>
    )
}