import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { Fragment } from "react";
import UserAdminConsole from "../components/UserAdminConsole";

export default function UpdateUserForm() {
  return (
    <Fragment>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <main className="flex-grow-1 m-3">
          <UserAdminConsole
            title="Update users"
            description="Edit user details, activate or deactivate accounts, and review the current access roster."
          />
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
