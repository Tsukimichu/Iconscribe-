import Nav from "./component/navigation"
import Hero from "./component/Hero"
import ProductSection from "./component/ProductSection";
import Aboutus from "./component/Aboutus";

function user() {
    return(
        <>
          <Nav/>
         <section id="home"> <Hero/> </section>
        <ProductSection />
            <section id="transactions" className="py-16"></section>
            <section id="about-us" className="py-16 justify-center"> <Aboutus/> </section>
            <section id="contact" className="py-16"></section>
        </>
    )
}

export default user