import React from "react";
import backgroundImage from "../assets/srec.jpg";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header
        className="bg-cover bg-center flex items-center justify-center text-white p-4"
        style={{ backgroundImage: `url(${backgroundImage})`, height: "40vh" }}
      >
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold pr-4">Welcome to</h1>
            <img src={logo} alt="IEEE" className="w-28" />
          </div>
          <p className="mt-2 text-lg text-gray-200 font-bold">
            Exploring the World of Technology and Innovation
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <section>
          <h2 className="text-2xl font-bold mb-4">About IEEE</h2>
          <p>
            The Institute of Electrical and Electronics Engineers (IEEE) is the
            world's largest technical professional organization dedicated to
            advancing technology for the benefit of humanity. IEEE produces over
            30% of the world's literature in the electrical and electronics
            engineering and computer science fields, publishing well over 100
            peer-reviewed journals.
          </p>
          <p>
            IEEE is a trusted voice for engineering, computing, and technology
            information around the globe. It serves professionals involved in
            all aspects of the electrical, electronic, and computing fields and
            related areas of science and technology.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Mission and Vision</h2>
          <p>
            IEEE's mission is to foster technological innovation and excellence
            for the benefit of humanity. It strives to be an essential
            professional and learning resource, inspiring its members and the
            global community to collaborate and create technology solutions for
            the world's challenges.
          </p>
          <p>
            The vision of IEEE is to advance global prosperity by promoting
            technological innovation, enabling members' careers, and promoting
            community worldwide.
          </p>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} IEEE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
