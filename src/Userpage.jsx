import { useState, useEffect } from "react";
import Nav from "./component/navigation";
import Hero from "./component/Hero";
import ProductSection from "./component/ProductSection";
import Transactions from "./component/Transactions";
import Aboutus from "./component/Aboutus";
import ContactUs from "./component/ContactUs";
import Footer from "./component/footer";
import MaintenanceLock from "./component/MaintenanceWrapper.jsx";
import ChatWidget from "./component/ChatWidget";
import { useAuth } from "./context/authContext.jsx";
import { API_URL } from "./api";

function UserPage() {
  const [activeProducts, setActiveProducts] = useState([]);
  const { user } = useAuth();

  // user exists → logged in
  const isLoggedIn = !!user;

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const onlyActive = data.filter((p) => p.status === "active");
        setActiveProducts(onlyActive);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <MaintenanceLock>
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

        {/* Fix: use user?.id instead of user?.user_id */}
        {isLoggedIn && <ChatWidget userId={user?.id} managerId={10} />}
      </>
    </MaintenanceLock>
  );
}

export default UserPage;
