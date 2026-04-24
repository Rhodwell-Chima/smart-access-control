import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { Fragment } from "react";
import AccessLogTable from "../components/AccessLogTable";
import Footer from "../components/Footer";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import Pagination from "../components/Pagination";
import { accessLogs } from "../utils/data";

export default function ViewLogs() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(accessLogs.length / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedLogs = accessLogs.slice(startIndex, endIndex);
  return (
    <Fragment>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <main className="flex-grow-1 m-3">
          <h1 className="text-center m-3 p-3"> View Logs </h1>
          <AccessLogTable logs={paginatedLogs} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1); // reset to first page
            }}
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
