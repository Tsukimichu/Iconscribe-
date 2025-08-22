import Nav from "./component/navigation"
import Hero from "./component/Hero"
import ProductSection from "./component/ProductSection";
import Transactions from "./component/Transactions";
import Aboutus from "./component/Aboutus";
import ContactUs from "./component/ContactUs"; 
import Footer from "./component/footer";


function user() {
    return(
        <>
          <Nav/>
          <main>
            <section id="home"> <Hero/> </section>
            <section id="product"> <ProductSection /> </section>
            {/* Check if authentication then show transaction section */}
            <section id="transactions" className="py-16"><Transactions /></section>
            <section id="about-us" className="py-16 justify-center"> <Aboutus/> </section>
            <section id="contact" className="py-16 justify-center"> <ContactUs/> </section>
          </main>
          <footer>
            <Footer/>
          </footer>
        </>
    )
}

export default user 
