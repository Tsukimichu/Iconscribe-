import Nav from "./component/navigation"
import Hero from "./component/Hero"
import ProductSection from "./component/ProductSection";

function user() {
    return(
        <>
          <Nav/>
          <Hero/>
        <ProductSection />
            <section id="transactions" className="py-16"></section>
            <section id="about-us" className="py-16"></section>
            <section id="contact" className="py-16"></section>
        </>
    )
}

export default user