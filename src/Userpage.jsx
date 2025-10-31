import { useState, useEffect } from "react";
import Nav from "./component/navigation";
import Hero from "./component/Hero";
import ProductSection from "./component/ProductSection";
import Transactions from "./component/Transactions";
import Aboutus from "./component/Aboutus";
import ContactUs from "./component/ContactUs";
import Footer from "./component/footer";
import MaintenanceUser from "./component/MaintenanceUser";
import ChatWidget from "./component/ChatWidget";
import { useAuth } from "./context/authContext.jsx";

function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProducts, setActiveProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const onlyActive = data.filter((p) => p.status === "active");
        setActiveProducts(onlyActive);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <MaintenanceUser>
      <>
        <Nav />
        <main>
          <section id="home">
            <Hero />
          </section>

          <section id="product">
            <ProductSection products={activeProducts} />
          </section>

          {isLoggedIn && (
            <section id="transactions">
              <Transactions />
            </section>
          )}

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

        <ChatWidget userId={user?.user_id || 6} managerId={10} />

      </>
    </MaintenanceUser>
  );
}

export default UserPage;
