const Footer = ({
  companyName = "Company, Inc",
  year = new Date().getFullYear(),
  logoLink = "/",
  logoName = "SAC",
  socialLinks = [],
}) => {
  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        {/* Left side */}
        <div className="col-md-4 d-flex align-items-center">
          <a
            href={logoLink}
            className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
          >
            <span style={{ fontWeight: "bold" }}>{logoName}</span>
          </a>

          <span className="mb-3 mb-md-0 text-body-secondary">
            &copy; {year} {companyName}
          </span>
        </div>

        {/* Right side */}
        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;

            return (
              <li className="ms-3" key={index}>
                <a
                  className="text-body-secondary"
                  href={link.url}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={24} />
                </a>
              </li>
            );
          })}
        </ul>
      </footer>
    </div>
  );
};

export default Footer;
