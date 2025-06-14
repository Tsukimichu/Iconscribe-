import Nav from "./component/navigation"
import Hero from "./component/Hero"

function user() {
    return(
        <>
          <Nav/>
          <Hero/>
           <section id = "product"></section>
           <section id = "transaction"></section>
           <section id = "about-us"></section>
           <section id = "conact"></section>
        </>
    )
}

export default user