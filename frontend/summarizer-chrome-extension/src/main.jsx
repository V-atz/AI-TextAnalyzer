import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <div>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem
      maiores quisquam reiciendis mollitia numquam quasi perferendis iure eum
      iste fuga tempora, incidunt nulla corporis dolore. Possimus corporis autem
      officiis quisquam dignissimos quis excepturi maxime similique adipisci
      illo voluptatibus blanditiis, repellendus delectus quibusdam harum, quia
      nulla laudantium ea! Error doloribus quam expedita alias accusamus quae
      quas animi, ipsum ipsa blanditiis molestias dolor! Porro eveniet quos
      itaque, minus quo maxime harum quaerat excepturi veritatis nulla sapiente
      perspiciatis? Neque nemo placeat animi deserunt quae. Consequatur labore
      tenetur sint blanditiis, et autem voluptatem sequi, aut facere distinctio
      dolores impedit nemo officia delectus ad fugit!
    </div> */}
  </StrictMode>
);