import Nav from "./component/navigation";
import Hero from "./component/Hero";
import ProductSection from "./component/ProductSection";
import Transactions from "./component/Transactions";
import Aboutus from "./component/Aboutus";
import ContactUs from "./component/ContactUs"; 
import Footer from "./component/footer";
import MaintenanceUser from "./component/MaintenanceUser"; 

function UserPage() {
  return (
    <MaintenanceUser>
      <>
        <Nav />
        <main>
          <section id="home">
            <Hero />
          </section>
          <section id="product">
            <ProductSection />
          </section>

          <section id="transactions" className="">
            <Transactions />
          </section>
          <section id="about-us" className="justify-center">
            <Aboutus />
          </section>
          <section id="contact" className="justify-center">
            <ContactUs />
          </section>
        </main>
        <footer>
          <Footer />
        </footer>
      </>
    </MaintenanceUser>
  );
}

export default UserPage;
