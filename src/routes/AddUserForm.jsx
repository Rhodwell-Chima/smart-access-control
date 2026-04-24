import UserForm from "../components/UserForm";
import NavigationBar from "../components/NavigationBar";
import { Fragment } from "react";
import Footer from "../components/Footer";
import { BsFacebook, BsInstagram } from "react-icons/bs";
export default function AddUserForm() {
  return (
    <Fragment>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <main className="flex-grow-1">
          <h1 className="text-center m-3 p-3"> Add User Details </h1>
          <UserForm />
        </main>
        <Footer
          companyName="Smart Access Control"
          socialLinks={[
            {
              label: "Instagram",
              url: "https://instagram.com",
              icon: BsInstagram,
            },
            {
              label: "Facebook",
              url: "https://facebook.com",
              icon: BsFacebook,
            },
          ]}
        />
      </div>
    </Fragment>
  );
}
