import bg from '../assets/org.jpg'

function Hero(){
    return(
        <>
     <div className="p-40 bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }}>
    <div className ="Hero-text text-white text-6x2 ">
    <h1>Fast. <br/>
        Reliable. <br/>
        Professional Printing Services
    </h1>
    <p>Order online and have your documents delivered or ready for pickup</p>
    </div>
    </div>  
        </>
    );
}

export default Hero;