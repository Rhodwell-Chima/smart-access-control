import { useState } from "react";
import "./App.css";
import { Link } from "react-router";
import NavigationBar from "./components/NavigationBar";
import AccessLogTable from "./components/AccessLogTable";
import FormSection from "./components/UserForm";
import UserForm from "./components/UserForm";

function App() {
  // const [count, setCount] = useState(0);
  const accessLogs = [
    {
      id: 1,
      scanned_at: "2024-01-15T07:02:11",
      first_name: "John",
      last_name: "Banda",
      uid: "1A 7C 78 30",
      role: "ADMIN",
      result: "GRANTED",
    },
    {
      id: 2,
      scanned_at: "2024-01-15T07:45:02",
      first_name: "Mary",
      last_name: "Phiri",
      uid: "CC CC A3 16",
      role: "USER",
      result: "GRANTED",
    },
    {
      id: 3,
      scanned_at: "2024-01-15T07:58:44",
      first_name: null,
      last_name: null,
      uid: "00 00 00 00",
      role: null,
      result: "UNAUTHORIZED",
    },
    {
      id: 4,
      scanned_at: "2024-01-15T08:10:30",
      first_name: "Chipo",
      last_name: "Mwale",
      uid: "3B 9D 45 12",
      role: "USER",
      result: "GRANTED",
    },
    {
      id: 5,
      scanned_at: "2024-01-15T08:22:05",
      first_name: null,
      last_name: null,
      uid: "FF 4B 21 09",
      role: null,
      result: "BLACKLISTED",
    },
    {
      id: 6,
      scanned_at: "2024-01-15T08:35:18",
      first_name: "Tendai",
      last_name: "Moyo",
      uid: "7F 2A 91 CC",
      role: "GUEST",
      result: "GRANTED",
    },
    {
      id: 7,
      scanned_at: "2024-01-15T09:01:33",
      first_name: "Mary",
      last_name: "Phiri",
      uid: "CC CC A3 16",
      role: "USER",
      result: "OUTSIDE TIME WINDOW",
    },
    {
      id: 8,
      scanned_at: "2024-01-15T09:14:55",
      first_name: null,
      last_name: null,
      uid: "AB 3C 77 F1",
      role: null,
      result: "UNAUTHORIZED",
    },
    {
      id: 9,
      scanned_at: "2024-01-15T09:30:02",
      first_name: "John",
      last_name: "Banda",
      uid: "1A 7C 78 30",
      role: "ADMIN",
      result: "GRANTED",
    },
    {
      id: 10,
      scanned_at: "2024-01-15T09:47:19",
      first_name: "Chipo",
      last_name: "Mwale",
      uid: "3B 9D 45 12",
      role: "USER",
      result: "GRANTED",
    },
    {
      id: 11,
      scanned_at: "2024-01-15T10:05:44",
      first_name: "Tendai",
      last_name: "Moyo",
      uid: "7F 2A 91 CC",
      role: "GUEST",
      result: "OUTSIDE TIME WINDOW",
    },
    {
      id: 12,
      scanned_at: "2024-01-15T10:22:31",
      first_name: null,
      last_name: null,
      uid: "FF 4B 21 09",
      role: null,
      result: "BLACKLISTED",
    },
    {
      id: 13,
      scanned_at: "2024-01-15T10:38:09",
      first_name: "Mary",
      last_name: "Phiri",
      uid: "CC CC A3 16",
      role: "USER",
      result: "GRANTED",
    },
    {
      id: 14,
      scanned_at: "2024-01-15T10:55:27",
      first_name: null,
      last_name: null,
      uid: "12 DE 88 4A",
      role: null,
      result: "UNAUTHORIZED",
    },
    {
      id: 15,
      scanned_at: "2024-01-15T11:10:14",
      first_name: "John",
      last_name: "Banda",
      uid: "1A 7C 78 30",
      role: "ADMIN",
      result: "GRANTED",
    },
    {
      id: 16,
      scanned_at: "2024-01-15T11:28:50",
      first_name: "Chipo",
      last_name: "Mwale",
      uid: "3B 9D 45 12",
      role: "USER",
      result: "GRANTED",
    },
    {
      id: 17,
      scanned_at: "2024-01-15T11:45:03",
      first_name: "Tendai",
      last_name: "Moyo",
      uid: "7F 2A 91 CC",
      role: "GUEST",
      result: "GRANTED",
    },
    {
      id: 18,
      scanned_at: "2024-01-15T12:02:38",
      first_name: null,
      last_name: null,
      uid: "00 00 00 00",
      role: null,
      result: "UNAUTHORIZED",
    },
    {
      id: 19,
      scanned_at: "2024-01-15T12:19:22",
      first_name: "Mary",
      last_name: "Phiri",
      uid: "CC CC A3 16",
      role: "USER",
      result: "GRANTED",
    },
    {
      id: 20,
      scanned_at: "2024-01-15T12:35:47",
      first_name: null,
      last_name: null,
      uid: "FF 4B 21 09",
      role: null,
      result: "BLACKLISTED",
    },
  ];

  return (
    <>
      <NavigationBar />
      <h1>Access Logs</h1>
      <UserForm />
      <AccessLogTable logs={accessLogs} />
    </>
  );
}

export default App;
